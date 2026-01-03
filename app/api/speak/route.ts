import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      console.error("❌ ELEVENLABS_API_KEY missing in production environment");
      return NextResponse.json(
        { error: "Voice service is temporarily unavailable" },
        { status: 500 }
      );
    }

    console.log("ElevenLabs API key loaded:", process.env.ELEVENLABS_API_KEY ? "Yes" : "No");

    // Call ElevenLabs API
    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.8,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);
      
      if (response.status === 401) {
        // Check for specific permission error
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.detail?.message?.includes("missing_permissions") || errorJson.detail?.message?.includes("text_to_speech")) {
            return NextResponse.json(
              { error: "Your ElevenLabs API key is missing the 'text_to_speech' permission. Please create a new API key with text-to-speech permissions at https://elevenlabs.io/app/settings/api-keys" },
              { status: 401 }
            );
          }
        } catch {
          // If JSON parsing fails, use generic message
        }
        
        return NextResponse.json(
          { error: "ElevenLabs API key is invalid or expired. Please check your API key at https://elevenlabs.io/app/settings/api-keys" },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: `ElevenLabs API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    // Return audio with correct headers
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Speak API route error:", error);
    return NextResponse.json(
      { error: "Voice service unavailable" },
      { status: 500 }
    );
  }
}
