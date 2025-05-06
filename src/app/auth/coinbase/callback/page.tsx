"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CoinbaseOAuthCallback } from "@/components/coinbase-oauth-callback";
import { logDebugInfo } from "@/lib/coinbase";
import { toast } from "sonner";

export default function CoinbaseCallbackPage() {
  const router = useRouter();

  const handleSuccess = (data: any) => {
    logDebugInfo("Callback completed successfully", { scope: data.scope });
    
    // Redirect to accounts page after a short delay
    setTimeout(() => {
      router.push("/accounts");
    }, 2000);
  };

  const handleError = (error: string) => {
    logDebugInfo("Callback error", error);
    toast.error("Failed to connect to Coinbase: " + error);
    
    // Redirect to accounts page after a short delay
    setTimeout(() => {
      router.push("/accounts");
    }, 3000);
  };

  // Log when the component mounts for debugging
  useEffect(() => {
    logDebugInfo("Coinbase callback page loaded");
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-xl font-semibold">Coinbase Connection</h1>
          <CoinbaseOAuthCallback 
            onSuccess={handleSuccess} 
            onError={handleError} 
          />
        </div>
      </div>
    </div>
  );
} 