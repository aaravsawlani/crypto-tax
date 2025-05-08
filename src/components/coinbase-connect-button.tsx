"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CoinbaseConnectButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      
      // Generate a cryptographically secure state
      const state = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Store state in session storage
      sessionStorage.setItem('coinbase_oauth_state', state);

      // Construct the authorization URL
      const clientId = process.env.NEXT_PUBLIC_COINBASE_CLIENT_ID;
      const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/coinbase/callback`.replace(/([^:]\/)\/+/g, "$1");

      if (!clientId) {
        throw new Error("Coinbase client ID is not configured");
      }

      const authUrl = new URL("https://www.coinbase.com/oauth/authorize");
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("client_id", clientId);
      authUrl.searchParams.append("redirect_uri", redirectUri);
      authUrl.searchParams.append("state", state);
      authUrl.searchParams.append("scope", "wallet:user:read");

      // Redirect to Coinbase
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("Error connecting to Coinbase:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className="w-full"
    >
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