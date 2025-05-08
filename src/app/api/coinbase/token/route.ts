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
    const { code, redirect_uri } = await request.json();

    console.log("[Coinbase OAuth] Token exchange request received:", {
      hasCode: !!code,
      hasRedirectUri: !!redirect_uri,
      redirect_uri
    });

    if (!code) {
      console.error("[Coinbase OAuth] No code provided");
      return NextResponse.json(
        { error: "No authorization code provided" },
        { status: 400 }
      );
    }

    if (!redirect_uri) {
      console.error("[Coinbase OAuth] No redirect URI provided");
      return NextResponse.json(
        { error: "No redirect URI provided" },
        { status: 400 }
      );
    }

    const tokenEndpoint = "https://api.coinbase.com/oauth/token";
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirect_uri);
    params.append("client_id", process.env.COINBASE_CLIENT_ID!);
    params.append("client_secret", process.env.COINBASE_CLIENT_SECRET!);

    console.log("[Coinbase OAuth] Making token request to Coinbase:", {
      endpoint: tokenEndpoint,
      params: {
        grant_type: "authorization_code",
        code: "present",
        client_id: "present",
        client_secret: "present",
        redirect_uri
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
      console.error("[Coinbase OAuth] Token exchange failed:", {
        error: data.error,
        error_description: data.error_description
      });
      return NextResponse.json(
        { 
          error: data.error,
          error_description: data.error_description
        },
        { status: response.status }
      );
    }

    // Return the token response in the same format as the Go example
    const tokenResponse: TokenResponse = {
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      refresh_token: data.refresh_token,
      scope: data.scope
    };

    return NextResponse.json(tokenResponse);
  } catch (error) {
    console.error("[Coinbase OAuth] Error in token exchange:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 