"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function CoinbaseOAuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code and state from URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        const error = params.get("error");

        console.log("[Coinbase Callback] Received callback:", {
          hasCode: !!code,
          hasState: !!state,
          hasError: !!error,
          fullUrl: window.location.href
        });

        // Check for OAuth errors
        if (error) {
          console.error("[Coinbase Callback] OAuth error:", error);
          throw new Error(`OAuth error: ${error}`);
        }

        // Verify state
        const savedState = sessionStorage.getItem("coinbase_oauth_state");
        console.log("[Coinbase Callback] State verification:", {
          receivedState: state,
          savedState,
          match: state === savedState,
          sessionStorageKeys: Object.keys(sessionStorage)
        });

        if (!state || !savedState || state !== savedState) {
          console.error("[Coinbase Callback] State mismatch:", {
            receivedState: state,
            savedState,
            match: state === savedState
          });
          throw new Error("Invalid state parameter");
        }

        // Remove state from storage
        sessionStorage.removeItem("coinbase_oauth_state");
        console.log("[Coinbase Callback] Removed state from storage");

        // Exchange code for tokens through our API route
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/coinbase/callback`.replace(/([^:]\/)\/+/g, "$1");
        console.log("[Coinbase Callback] Exchanging code for tokens:", {
          hasCode: !!code,
          redirectUri
        });

        const response = await fetch("/api/coinbase/token", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            code,
            redirect_uri: redirectUri
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("[Coinbase Callback] Token exchange failed:", {
            status: response.status,
            error: errorData.error,
            errorDescription: errorData.error_description
          });
          throw new Error(errorData.error_description || errorData.error || "Failed to exchange code for tokens");
        }

        const data = await response.json();
        console.log("[Coinbase Callback] Token exchange successful:", {
          hasAccessToken: !!data.access_token,
          hasRefreshToken: !!data.refresh_token,
          expiresIn: data.expires_in
        });
        
        // Store tokens in session storage
        sessionStorage.setItem("coinbase_access_token", data.access_token);
        if (data.refresh_token) {
          sessionStorage.setItem("coinbase_refresh_token", data.refresh_token);
        }
        console.log("[Coinbase Callback] Tokens stored in session storage");

        setStatus("success");
        setTimeout(() => router.push("/accounts"), 2000);
      } catch (err) {
        console.error("[Coinbase Callback] Error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setStatus("error");
        setTimeout(() => router.push("/accounts"), 3000);
      }
    };

    handleCallback();
  }, [router]);

  if (status === "loading") {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Connecting to Coinbase...</p>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-red-500">Connection Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
          <p className="mt-4">Redirecting to accounts page...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-green-500">Connected Successfully</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Successfully connected to Coinbase!</p>
        <p className="mt-4">Redirecting to accounts page...</p>
      </CardContent>
    </Card>
  );
} 