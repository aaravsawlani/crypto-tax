import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { state } = body;

    console.log("[Coinbase Store State] Request received:", {
      hasState: !!state,
      stateValue: state,
      timestamp: new Date().toISOString()
    });

    if (!state) {
      console.error("[Coinbase Store State] No state parameter provided");
      return NextResponse.json(
        { error: "No state parameter provided" },
        { status: 400 }
      );
    }

    // Create response with cookie
    const response = NextResponse.json({ success: true });
    
    // Get domain from NEXT_PUBLIC_APP_URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, ''); // Remove trailing slash
    const domain = appUrl ? new URL(appUrl).hostname : undefined;
    
    console.log("[Coinbase Store State] Cookie domain:", {
      appUrl,
      domain,
      timestamp: new Date().toISOString()
    });
    
    // Set cookie in response
    response.cookies.set('coinbase_oauth_state', state, {
      httpOnly: true,
      secure: true, // Always use secure in production
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10, // 10 minutes
      domain
    });

    // Log the cookie being set
    console.log("[Coinbase Store State] Setting cookie:", {
      name: 'coinbase_oauth_state',
      value: state,
      options: {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 10,
        domain
      },
      timestamp: new Date().toISOString()
    });

    return response;
  } catch (error) {
    console.error("[Coinbase Store State] Unexpected error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 