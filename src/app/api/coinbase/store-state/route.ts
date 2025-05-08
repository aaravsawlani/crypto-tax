import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { state } = body;

    console.log("[Coinbase Store State] Request received:", {
      hasState: !!state,
      timestamp: new Date().toISOString()
    });

    if (!state) {
      console.error("[Coinbase Store State] No state parameter provided");
      return NextResponse.json(
        { error: "No state parameter provided" },
        { status: 400 }
      );
    }

    // Store state in a cookie
    const cookieStore = cookies();
    cookieStore.set('coinbase_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10 // 10 minutes
    });

    console.log("[Coinbase Store State] State stored successfully");

    return NextResponse.json({ success: true });
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