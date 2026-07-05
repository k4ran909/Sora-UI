import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    // First, let's see if there are credentials already loaded in process.env. If not, we use the ones sent in the request body.
    const clientId = process.env.SPOTIFY_CLIENT_ID || body.clientId;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || body.clientSecret;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Missing Spotify Client ID or Client Secret" },
        { status: 400 }
      );
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Spotify auth failed: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      access_token: data.access_token,
      expires_in: data.expires_in,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
