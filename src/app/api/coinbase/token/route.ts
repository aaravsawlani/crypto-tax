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
    const body = await request.json();
    const { code } = body;
    
    // Log the received code (for debugging)
    logDebugInfo("Received authorization code for exchange", { code: code?.substring(0, 10) + "..." });

    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    // Mock Coinbase API call - in a real implementation, you would call the Coinbase token endpoint
    // const tokenResponse = await fetch('https://login.coinbase.com/oauth2/token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     grant_type: 'authorization_code',
    //     code,
    //     client_id: process.env.COINBASE_CLIENT_ID,
    //     client_secret: process.env.COINBASE_CLIENT_SECRET,
    //     redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/coinbase/callback`
    //   })
    // });
    
    // const tokenData = await tokenResponse.json();
    
    // For demo purposes, return mock token data
    const mockTokenData = {
      access_token: "mock_access_token_" + Math.random().toString(36).substring(2),
      token_type: "bearer",
      expires_in: 7200,
      refresh_token: "mock_refresh_token_" + Math.random().toString(36).substring(2),
      scope: "wallet:user:read wallet:accounts:read wallet:transactions:read"
    };
    
    logDebugInfo("Successfully exchanged code for token", { scope: mockTokenData.scope });
    
    return NextResponse.json(mockTokenData);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.json(
      { error: 'Failed to exchange authorization code for token' },
      { status: 500 }
    );
  }
} 