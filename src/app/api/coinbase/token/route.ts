import { NextResponse } from 'next/server';
import { logDebugInfo } from '@/lib/coinbase';

/**
 * NOTE: This is a mock implementation for demonstration purposes only.
 * 
 * In a real-world application, the client_secret should NEVER be exposed to the frontend.
 * The token exchange should happen on your backend server.
 * 
 * This route handler simulates what a backend implementation would do.
 */
export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    logDebugInfo("Received code for token exchange", { code });

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // Make request to Coinbase token endpoint
    const response = await fetch('https://login.coinbase.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.COINBASE_CLIENT_ID!,
        client_secret: process.env.COINBASE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/coinbase/callback`
      })
    });

    if (!response.ok) {
      const error = await response.json();
      logDebugInfo("Error from Coinbase token endpoint", error);
      return NextResponse.json({ error: error.error_description || 'Failed to exchange code for token' }, { status: response.status });
    }

    const tokenData = await response.json();
    logDebugInfo("Successfully exchanged code for token", { 
      access_token: tokenData.access_token.substring(0, 10) + "...",
      scope: tokenData.scope
    });

    return NextResponse.json(tokenData);
  } catch (error) {
    logDebugInfo("Error in token exchange", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 