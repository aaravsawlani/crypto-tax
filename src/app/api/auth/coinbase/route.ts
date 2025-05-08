import { NextRequest, NextResponse } from "next/server";

/**
 * Initiates the Coinbase OAuth2 authorization flow
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.COINBASE_CLIENT_ID;
  const redirectUri = process.env.COINBASE_REDIRECT_URI;
  
  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "OAuth configuration missing" },
      { status: 500 }
    );
  }

  // Define the scopes we need for accessing user's Coinbase data
  const scopes = [
    "wallet:accounts:read",
    "wallet:transactions:read",
    "wallet:user:read"
  ];

  // Construct the authorization URL
  const authUrl = new URL("https://www.coinbase.com/oauth/authorize");
  authUrl.searchParams.append("client_id", clientId);
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", scopes.join(" "));
  
  // Generate a state parameter to prevent CSRF
  const state = Math.random().toString(36).substring(2, 15);
  authUrl.searchParams.append("state", state);
  
  // Store the state in a cookie to verify when handling callback
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set({
    name: "coinbase_oauth_state",
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    path: "/"
  });
  
  return response;
} 