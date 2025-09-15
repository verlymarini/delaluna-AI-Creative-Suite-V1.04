interface RequestPayload {
  prompt: string;
  aspect_ratio?: string;
  styling?: {
    effects?: {
      color?: string;
      framing?: string;
      lightning?: string;
    };
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Get Freepik API key from request headers (passed from frontend)
    const freepikApiKey = req.headers.get("X-Freepik-API-Key");
    if (!freepikApiKey || !freepikApiKey.trim()) {
      return new Response(
        JSON.stringify({ 
          error: "Freepik API key not provided. Please configure your Freepik API key in the application settings." 
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Parse request body
    const { prompt, aspect_ratio = "social_post_4_5", styling }: RequestPayload = await req.json();

    if (!prompt || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    console.log("🔧 Generating image with Freepik API...");
    console.log("📝 Prompt:", prompt.trim());

    // Call Freepik Flux API
    const freepikResponse = await fetch("https://api.freepik.com/v1/ai/text-to-image/flux-dev", {
      method: "POST",
      headers: {
        "x-freepik-api-key": freepikApiKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        aspect_ratio,
        styling: styling || {
          effects: {
            color: "vibrant",
            framing: "portrait",
            lightning: "dramatic",
          },
        },
      }),
    });

    console.log("📡 Freepik API response status:", freepikResponse.status);

    if (!freepikResponse.ok) {
      const errorText = await freepikResponse.text();
      console.error("❌ Freepik API Error:", errorText);
      
      let errorMessage = `Freepik API error (${freepikResponse.status}): `;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error && errorData.error.message) {
          errorMessage += errorData.error.message;
        } else if (errorData.message) {
          errorMessage += errorData.message;
        } else {
          errorMessage += freepikResponse.statusText;
        }
        if (errorData.error && errorData.error.details) {
          errorMessage += ` - ${errorData.error.details}`;
        }
      } catch (e) {
        errorMessage += freepikResponse.statusText;
      }

      return new Response(
        JSON.stringify({ error: errorMessage }),
        {
          status: freepikResponse.status,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const responseData = await freepikResponse.json();
    console.log("✅ Freepik API response:", responseData);

    if (!responseData.data || !responseData.data.task_id) {
      return new Response(
        JSON.stringify({ error: "Invalid response from Freepik API - task_id not found" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        task_id: responseData.data.task_id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error("❌ Edge Function Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: `Edge Function error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});