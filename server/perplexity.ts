// Perplexity API service
import fetch from "node-fetch";

// Check if the API key is set
if (!process.env.PERPLEXITY_API_KEY) {
  console.warn("PERPLEXITY_API_KEY environment variable is not set. Chatbot will not function properly.");
}

type PerplexityMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type PerplexityResponse = {
  id: string;
  model: string;
  object: string;
  created: number;
  citations: string[];
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

/**
 * Send a chat completion request to Perplexity API
 */
export async function getChatCompletion(
  messages: PerplexityMessage[]
): Promise<{ content: string; citations?: string[] }> {
  try {
    // Validate message sequence (must alternate user/assistant)
    let lastRole: string | null = null;
    for (const message of messages) {
      if (message.role === "user" && lastRole === "user") {
        throw new Error("Messages must alternate between user and assistant");
      }
      lastRole = message.role;
    }

    // Ensure the last message is from the user
    if (messages.length > 0 && messages[messages.length - 1].role !== "user") {
      throw new Error("The last message must be from the user");
    }

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages,
        max_tokens: 500,
        temperature: 0.2,
        top_p: 0.9,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as PerplexityResponse;
    
    return {
      content: data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.",
      citations: data.citations,
    };
  } catch (error) {
    console.error("Error in Perplexity API:", error);
    return {
      content: `I encountered an error while processing your request. Please try again.`,
    };
  }
}