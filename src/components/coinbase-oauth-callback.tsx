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

        // Make API call to exchange code for token
        const response = await fetch('/api/coinbase/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        if (!response.ok) {
          const error = await response.json();
          const message = error.error || 'Failed to exchange code for token';
          logDebugInfo("Token exchange error", message);
          setStatus("error");
          setErrorMessage(message);
          onError(message);
          return;
        }

        const tokenData = await response.json();
        
        // Save the token data
        saveTokenData(tokenData);
        logDebugInfo("Token exchange successful", { 
          access_token: tokenData.access_token.substring(0, 10) + "...",
          scope: tokenData.scope 
        });

        // Set success status and call onSuccess callback
        setStatus("success");
        onSuccess(tokenData);
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