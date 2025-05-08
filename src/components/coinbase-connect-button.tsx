"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CoinbaseConnectButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);

      // Generate a random state
      const state = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Store state in a cookie through server-side API
      const response = await fetch("/api/coinbase/store-state", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state }),
      });

      if (!response.ok) {
        throw new Error("Failed to store state");
      }

      // Construct the authorization URL
      const clientId = process.env.NEXT_PUBLIC_COINBASE_CLIENT_ID;
      const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/coinbase/callback`.replace(/([^:]\/)\/+/g, "$1");
      const scope = "wallet:accounts:read,wallet:transactions:read";
      
      const authUrl = new URL("https://www.coinbase.com/oauth/authorize");
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("client_id", clientId!);
      authUrl.searchParams.append("redirect_uri", redirectUri);
      authUrl.searchParams.append("state", state);
      authUrl.searchParams.append("scope", scope);

      // Redirect to Coinbase
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("Failed to connect to Coinbase:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleConnect} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect Coinbase"
      )}
    </Button>
  );
} 