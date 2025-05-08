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

        // Check for OAuth errors
        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        // Verify state
        const savedState = sessionStorage.getItem("coinbase_oauth_state");
        if (!state || !savedState || state !== savedState) {
          throw new Error("Invalid state parameter");
        }

        // Remove state from storage
        sessionStorage.removeItem("coinbase_oauth_state");

        // Exchange code for tokens through our API route
        const response = await fetch("/api/coinbase/token", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            code,
            redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/coinbase/callback`.replace(/([^:]\/)\/+/g, "$1")
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error_description || errorData.error || "Failed to exchange code for tokens");
        }

        const data = await response.json();
        
        // Store tokens in session storage
        sessionStorage.setItem("coinbase_access_token", data.access_token);
        if (data.refresh_token) {
          sessionStorage.setItem("coinbase_refresh_token", data.refresh_token);
        }

        setStatus("success");
        setTimeout(() => router.push("/accounts"), 2000);
      } catch (err) {
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