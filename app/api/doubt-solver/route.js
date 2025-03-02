export async function POST(req) {
    try {
      const body = await req.json();
      const { message } = body;
  
      if (!message) return new Response("Missing message", { status: 400 });
  
      // 🔥 Send request to LM Studio's local server
      const response = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "mistral-7b-instruct-v0.3", // Your local model
          messages: [{ role: "user", content: message }],
          stream: true, // Enable response streaming
        }),
      });
  
      if (!response.body) throw new Error("No response body");
  
      // Stream response back to frontend
      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (error) {
      console.error("Error in /api/doubt-solver:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  