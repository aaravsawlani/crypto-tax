import { NextResponse } from 'next/server';
import { logDebugInfo } from '@/lib/coinbase';

/**
 * Coinbase OAuth2 token exchange endpoint.
 * 
 * This route handler exchanges the authorization code for an access token
 * by making a request to Coinbase's token endpoint.
 * 
 * The client_secret is kept secure on the server side.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    // Ensure the redirect URI doesn't have double slashes
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/coinbase/callback`.replace(/([^:]\/)\/+/g, "$1");

    console.log("[Coinbase OAuth] Token exchange request received:", {
      code: code ? "present" : "missing",
      redirectUri,
      clientId: process.env.COINBASE_CLIENT_ID ? "present" : "missing",
      clientSecret: process.env.COINBASE_CLIENT_SECRET ? "present" : "missing"
    });

    if (!code) {
      console.error("[Coinbase OAuth] No authorization code provided");
      return NextResponse.json(
        { error: "No authorization code provided" },
        { status: 400 }
      );
    }

    const tokenEndpoint = "https://login.coinbase.com/oauth2/token";
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.COINBASE_CLIENT_ID!,
      client_secret: process.env.COINBASE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
    });

    console.log("[Coinbase OAuth] Making token request to Coinbase:", {
      endpoint: tokenEndpoint,
      params: {
        grant_type: "authorization_code",
        code: "present",
        client_id: "present",
        client_secret: "present",
        redirect_uri: redirectUri
      }
    });

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    console.log("[Coinbase OAuth] Token response status:", response.status);
    console.log("[Coinbase OAuth] Token response data:", {
      success: response.ok,
      error: data.error,
      error_description: data.error_description,
      hasAccessToken: !!data.access_token,
      hasRefreshToken: !!data.refresh_token,
      expiresIn: data.expires_in
    });

    if (!response.ok) {
      console.error("[Coinbase OAuth] Token exchange failed:", data);
      return NextResponse.json(
        { error: data.error_description || "Failed to exchange token" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Coinbase OAuth] Token exchange error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 