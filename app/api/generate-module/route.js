import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { chapter } = await req.json();

    if (!chapter) {
      return NextResponse.json({ error: "Chapter name is required" }, { status: 400 });
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
                { role: "system", content: "You are an AI tutor generating study material for indian extrance exams with markdown formatting, emojis, and engaging style." },
                { role: "user", content: `Generate study material for ${chapter} in JEE mains exam. Provide explanations, key points, and examples.` }
              ],
              max_tokens: 4096,
              temperature: 0.7,
              stream: true,
            }),
          });

          if (!response.body) {
            controller.close();
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            // Process each line separately
            const lines = chunk.split("\n").filter((line) => line.trim() !== "");
            for (const line of lines) {
              if (line === "data: [DONE]") {
                // Stop reading when LM Studio sends the completion signal
                controller.close();
                return;
              }

              if (line.startsWith("data:")) {
                try {
                  const jsonData = JSON.parse(line.substring(5).trim()); // Remove "data: " prefix
                  const delta = jsonData.choices?.[0]?.delta?.content || "";
                  controller.enqueue(encoder.encode(delta));
                } catch (err) {
                  console.error("JSON Parse Error:", err, line);
                }
              }
            }
          }

          controller.close();
        } catch (error) {
          console.error("Streaming Error:", error);
          controller.enqueue(encoder.encode("Error generating content."));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
