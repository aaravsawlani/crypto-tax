"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export function CoinbaseOAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        // Ensure the redirect URI doesn't have double slashes
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/coinbase/callback`.replace(/([^:]\/)\/+/g, "$1");

        console.log("[Coinbase OAuth] Callback received:", {
          hasCode: !!code,
          hasError: !!error,
          errorDescription,
          redirectUri
        });

        if (error) {
          console.error("[Coinbase OAuth] Error in callback:", { error, errorDescription });
          setError(errorDescription || "Failed to connect to Coinbase");
          setStatus("error");
          return;
        }

        if (!code) {
          console.error("[Coinbase OAuth] No code in callback");
          setError("No authorization code received");
          setStatus("error");
          return;
        }

        console.log("[Coinbase OAuth] Exchanging code for token...");
        const response = await fetch("/api/coinbase/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        console.log("[Coinbase OAuth] Token exchange response:", {
          status: response.status,
          success: response.ok,
          hasAccessToken: !!data.access_token,
          error: data.error,
          errorDescription: data.error_description
        });

        if (!response.ok) {
          throw new Error(data.error_description || "Failed to exchange code for token");
        }

        console.log("[Coinbase OAuth] Successfully connected to Coinbase");
        setStatus("success");
        toast.success("Successfully connected to Coinbase");
        
        // Redirect to accounts page after a short delay
        setTimeout(() => {
          router.push("/accounts");
        }, 2000);
      } catch (err) {
        console.error("[Coinbase OAuth] Error in callback handler:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        setStatus("error");
        toast.error("Failed to connect to Coinbase");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connecting to Coinbase</CardTitle>
        <CardDescription>
          {status === "loading" && "Please wait while we connect to your Coinbase account..."}
          {status === "success" && "Successfully connected to Coinbase!"}
          {status === "error" && "Failed to connect to Coinbase"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {status === "loading" && (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">This may take a few moments...</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <p className="text-sm text-muted-foreground">Redirecting to accounts page...</p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="h-8 w-8 text-rose-500" />
            <p className="text-sm text-rose-500">{error}</p>
            <Button
              variant="outline"
              onClick={() => router.push("/accounts")}
            >
              Return to Accounts
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
} 