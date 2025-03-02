import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "mistral-7b-instruct-v0.3",
              messages: [
                { role: "system", content: "You are an AI tutor specializing in JEE and NEET preparation. Provide structured and step-by-step explanations for doubts, ensuring clarity based on the student's difficulty level. Make sure to use emojis and add a very slight fun element to your responses just to make it natural." },
                { role: "user", content: message }
              ],
              temperature: 0.7,
              max_tokens: 4096,
              stream: true,
            }),
          });

          if (!response.body) {
            controller.close();
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          let buffer = ""; // 🔥 Buffer for incomplete JSON chunks

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            // Append chunk to buffer
            buffer += chunk;

            // Process only complete lines
            const lines = buffer.split("\n");
            buffer = lines.pop(); // Keep incomplete line for next iteration

            for (const line of lines) {
              if (line.trim() === "data: [DONE]") {
                controller.close();
                return;
              }

              if (line.startsWith("data:")) {
                try {
                  const jsonData = JSON.parse(line.substring(5).trim()); // Remove "data: " prefix
                  const delta = jsonData.choices?.[0]?.delta?.content || "";
                  if (delta) controller.enqueue(encoder.encode(delta)); // Only enqueue non-empty content
                } catch (err) {
                  console.error("JSON Parse Error:", err, line);
                }
              }
            }
          }

          controller.close();
        } catch (error) {
          console.error("Streaming Error:", error);
          controller.enqueue(encoder.encode("Error processing your doubt."));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
