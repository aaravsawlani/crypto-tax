"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface CoinbaseOAuthCallbackProps {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export default function CoinbaseOAuthCallback({ onSuccess, onError }: CoinbaseOAuthCallbackProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code and state from the URL
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        console.log("[Coinbase OAuth] Callback received:", {
          hasCode: !!code,
          hasState: !!state,
          hasError: !!error,
          errorDescription,
          state
        });

        // Check for OAuth errors
        if (error) {
          console.error("[Coinbase OAuth] OAuth error:", { error, errorDescription });
          throw new Error(errorDescription || error);
        }

        // Verify state parameter
        const savedState = sessionStorage.getItem('coinbase_oauth_state');
        console.log("[Coinbase OAuth] State verification:", {
          receivedState: state,
          savedState,
          match: state === savedState
        });

        if (!state || !savedState || state !== savedState) {
          console.error("[Coinbase OAuth] State mismatch:", {
            receivedState: state,
            savedState,
            match: state === savedState
          });
          throw new Error("Invalid state parameter");
        }

        // Remove the state from sessionStorage after verification
        sessionStorage.removeItem('coinbase_oauth_state');
        console.log("[Coinbase OAuth] Removed state from sessionStorage");

        if (!code) {
          console.error("[Coinbase OAuth] No authorization code received");
          throw new Error("No authorization code received");
        }

        // Construct the redirect URI
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/coinbase/callback`.replace(/([^:]\/)\/+/g, "$1");
        console.log("[Coinbase OAuth] Using redirect URI:", redirectUri);

        // Exchange the code for tokens
        const response = await fetch("/api/coinbase/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, redirect_uri: redirectUri }),
        });

        console.log("[Coinbase OAuth] Token exchange response status:", response.status);
        const data = await response.json();
        console.log("[Coinbase OAuth] Token exchange response:", {
          success: response.ok,
          error: data.error,
          error_description: data.error_description,
          hasAccessToken: !!data.access_token,
          hasRefreshToken: !!data.refresh_token
        });

        if (!response.ok) {
          throw new Error(data.error_description || data.error || "Failed to exchange code for token");
        }

        // Store the tokens
        sessionStorage.setItem("coinbase_access_token", data.access_token);
        sessionStorage.setItem("coinbase_refresh_token", data.refresh_token);
        console.log("[Coinbase OAuth] Tokens stored in sessionStorage");

        setStatus("success");
        toast.success("Successfully connected to Coinbase");
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(data);
        } else {
          // Default behavior if no callback provided
          setTimeout(() => {
            router.push("/accounts");
          }, 2000);
        }
      } catch (error) {
        console.error("[Coinbase OAuth] Error in callback:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to connect to Coinbase";
        setError(errorMessage);
        setStatus("error");
        
        // Call onError callback if provided
        if (onError) {
          onError(errorMessage);
        }
      }
    };

    handleCallback();
  }, [searchParams, router, onSuccess, onError]);

  return (
    <div className="container max-w-lg py-8">
      <Card>
        <CardHeader>
          <CardTitle>Connecting to Coinbase</CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we complete the connection..."}
            {status === "success" && "Successfully connected to Coinbase!"}
            {status === "error" && "Failed to connect to Coinbase"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === "loading" && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Processing...</span>
            </div>
          )}
          {status === "success" && (
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
              <span>Connection successful!</span>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertCircle className="h-6 w-6" />
                <span>{error}</span>
              </div>
              <Button onClick={() => router.push("/accounts")}>
                Return to Accounts
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 