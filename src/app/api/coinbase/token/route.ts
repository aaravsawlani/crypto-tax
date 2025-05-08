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

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, redirect_uri } = body;

    console.log("[Coinbase Token] Received token exchange request:", {
      hasCode: !!code,
      redirectUri: redirect_uri,
      timestamp: new Date().toISOString()
    });

    if (!code) {
      console.error("[Coinbase Token] No code provided in request");
      return NextResponse.json(
        { error: "No authorization code provided" },
        { status: 400 }
      );
    }

    const clientId = process.env.COINBASE_CLIENT_ID;
    const clientSecret = process.env.COINBASE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("[Coinbase Token] Missing credentials:", {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret
      });
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log("[Coinbase Token] Exchanging code for tokens...");

    const response = await fetch("https://api.coinbase.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Coinbase Token] Token exchange failed:", {
        status: response.status,
        error: data.error,
        errorDescription: data.error_description
      });
      return NextResponse.json(
        { 
          error: data.error,
          error_description: data.error_description 
        },
        { status: response.status }
      );
    }

    console.log("[Coinbase Token] Successfully exchanged code for tokens:", {
      hasAccessToken: !!data.access_token,
      hasRefreshToken: !!data.refresh_token,
      expiresIn: data.expires_in
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Coinbase Token] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 