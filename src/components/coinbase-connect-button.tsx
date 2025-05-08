"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

// Generate a secure random state
function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function CoinbaseConnectButton() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      // Generate a secure random state
      const state = generateState();
      console.log("[Coinbase OAuth] Generated state:", state);
      
      // Store state in sessionStorage for verification
      sessionStorage.setItem('coinbase_oauth_state', state);
      console.log("[Coinbase OAuth] Stored state in sessionStorage:", {
        key: 'coinbase_oauth_state',
        value: state
      });

      // Construct the authorization URL
      const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/coinbase/callback`.replace(/([^:]\/)\/+/g, "$1");
      const authUrl = new URL('https://www.coinbase.com/oauth/authorize');
      
      // Add required parameters
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('client_id', process.env.NEXT_PUBLIC_COINBASE_CLIENT_ID!);
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('state', state);
      authUrl.searchParams.append('scope', 'wallet:accounts:read,wallet:transactions:read');

      console.log("[Coinbase OAuth] Initiating OAuth flow:", {
        authUrl: authUrl.toString(),
        redirectUri,
        state,
        clientId: process.env.NEXT_PUBLIC_COINBASE_CLIENT_ID ? "present" : "missing"
      });

      // Redirect to Coinbase
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("[Coinbase OAuth] Error initiating OAuth flow:", error);
      toast.error("Failed to connect to Coinbase");
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="w-full"
    >
      {isConnecting ? "Connecting..." : "Connect Coinbase"}
    </Button>
  );
} 