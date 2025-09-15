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

    if (req.method !== "GET") {
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

    // Extract task_id from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const taskId = pathParts[pathParts.length - 1];

    if (!taskId || taskId === 'freepik-status') {
      return new Response(
        JSON.stringify({ error: "Task ID is required in URL path" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    console.log("📊 Checking status for task ID:", taskId);

    // Call Freepik status API
    const freepikResponse = await fetch(`https://api.freepik.com/v1/ai/text-to-image/flux-dev/${taskId}`, {
      method: "GET",
      headers: {
        "x-freepik-api-key": freepikApiKey,
        "Accept": "application/json",
      },
    });

    console.log("📡 Freepik status API response status:", freepikResponse.status);

    if (!freepikResponse.ok) {
      const errorText = await freepikResponse.text();
      console.error("❌ Freepik Status API Error:", errorText);
      
      let errorMessage = `Freepik status API error (${freepikResponse.status}): `;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error && errorData.error.message) {
          errorMessage += errorData.error.message;
        } else if (errorData.message) {
          errorMessage += errorData.message;
        } else {
          errorMessage += freepikResponse.statusText;
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
    console.log("✅ Freepik status response:", responseData);

    if (!responseData.data) {
      return new Response(
        JSON.stringify({ error: "Invalid response from Freepik status API" }),
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
        data: responseData.data,
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