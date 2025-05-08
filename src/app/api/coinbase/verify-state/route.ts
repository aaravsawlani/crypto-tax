import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface Cookie {
  name: string;
  value: string;
  path?: string;
  domain?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { state, code } = body;

    console.log("[Coinbase Verify State] Request received:", {
      hasState: !!state,
      hasCode: !!code,
      stateValue: state,
      timestamp: new Date().toISOString()
    });

    if (!state) {
      console.error("[Coinbase Verify State] No state parameter provided");
      return NextResponse.json(
        { error: "No state parameter provided" },
        { status: 400 }
      );
    }

    // Get the saved state from cookies
    const cookieStore = await cookies();
    const savedState = cookieStore.get('coinbase_oauth_state')?.value;

    // Log all cookies for debugging
    const allCookies = cookieStore.getAll();
    console.log("[Coinbase Verify State] All cookies:", {
      cookies: allCookies.map((c: Cookie) => ({ 
        name: c.name, 
        value: c.value,
        path: c.path,
        domain: c.domain
      })),
      timestamp: new Date().toISOString()
    });

    console.log("[Coinbase Verify State] State verification:", {
      receivedState: state,
      savedState,
      match: state === savedState,
      timestamp: new Date().toISOString()
    });

    if (!savedState || state !== savedState) {
      console.error("[Coinbase Verify State] State mismatch:", {
        receivedState: state,
        savedState,
        match: state === savedState,
        cookieExists: !!savedState,
        cookieDetails: savedState ? {
          name: 'coinbase_oauth_state',
          value: savedState
        } : null
      });
      return NextResponse.json(
        { error: "Invalid state parameter" },
        { status: 400 }
      );
    }

    // Create response and clear the state cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete('coinbase_oauth_state');

    console.log("[Coinbase Verify State] State verified successfully");

    return response;
  } catch (error) {
    console.error("[Coinbase Verify State] Unexpected error:", {
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