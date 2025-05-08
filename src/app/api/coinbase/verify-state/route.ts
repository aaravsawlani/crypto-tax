import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
      cookies: allCookies.map((c: { name: string; value: string }) => ({ name: c.name, value: c.value })),
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
        cookieExists: !!savedState
      });
      return NextResponse.json(
        { error: "Invalid state parameter" },
        { status: 400 }
      );
    }

    // Clear the state cookie after successful verification
    await cookieStore.delete('coinbase_oauth_state');

    console.log("[Coinbase Verify State] State verified successfully");

    return NextResponse.json({ success: true });
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