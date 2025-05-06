"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { verifyStateParam, saveTokenData, logDebugInfo } from "@/lib/coinbase";
import { Loader2 } from "lucide-react";

interface CoinbaseOAuthCallbackProps {
  onSuccess: (data: any) => void;
  onError: (error: string) => void;
}

export function CoinbaseOAuthCallback({ onSuccess, onError }: CoinbaseOAuthCallbackProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get the code and state from the URL
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        logDebugInfo("OAuth callback called", { code, state, error });

        // If there's an error in the URL, handle it
        if (error) {
          const errorDescription = searchParams.get("error_description") || "Unknown error";
          logDebugInfo("OAuth error", errorDescription);
          setStatus("error");
          setErrorMessage(errorDescription);
          onError(errorDescription);
          return;
        }

        // Check if code and state exist
        if (!code || !state) {
          const message = "Missing authorization code or state parameter";
          logDebugInfo(message);
          setStatus("error");
          setErrorMessage(message);
          onError(message);
          return;
        }

        // Verify state parameter to prevent CSRF attacks
        if (!verifyStateParam(state)) {
          const message = "Invalid state parameter";
          logDebugInfo(message);
          setStatus("error");
          setErrorMessage(message);
          onError(message);
          return;
        }

        logDebugInfo("State verification successful");

        // In a real implementation, you would send this code to your backend
        // Your backend would exchange it for an access token without exposing client_secret to the frontend
        // For demo purposes, we'll simulate a successful token exchange
        
        // Here we would normally make an API call to our backend:
        // const response = await fetch('/api/coinbase/token', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ code })
        // });
        // const data = await response.json();

        // Simulate successful token exchange
        const mockTokenData = {
          access_token: "mock_access_token_" + Math.random().toString(36).substring(2),
          token_type: "bearer",
          expires_in: 7200,
          refresh_token: "mock_refresh_token_" + Math.random().toString(36).substring(2),
          scope: "wallet:user:read wallet:accounts:read"
        };

        // Save the token data
        saveTokenData(mockTokenData);
        logDebugInfo("Token exchange successful", { scope: mockTokenData.scope });

        // Set success status and call onSuccess callback
        setStatus("success");
        onSuccess(mockTokenData);
      } catch (error) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        logDebugInfo("Error processing callback", message);
        setStatus("error");
        setErrorMessage(message);
        onError(message);
      }
    }

    handleCallback();
  }, [searchParams, onSuccess, onError]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Processing Coinbase authorization...</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait while we complete the connection</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-destructive">
        <p>Error connecting to Coinbase</p>
        <p className="text-sm mt-2">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 text-green-600">
      <p>Successfully connected to Coinbase!</p>
      <p className="text-sm text-muted-foreground mt-2">You can now close this window</p>
    </div>
  );
} 