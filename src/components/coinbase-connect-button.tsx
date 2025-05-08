"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CoinbaseConnectButton() {
  const [isLoading, setIsLoading] = useState(false);

  const generateSecureState = () => {
    // Generate a random state using crypto.getRandomValues
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const state = Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log("[Coinbase OAuth] Generated state:", state);
    return state;
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      
      // Generate and store state
      const state = generateSecureState();
      console.log("[Coinbase OAuth] Storing state in sessionStorage:", {
        key: 'coinbase_oauth_state',
        value: state,
        timestamp: new Date().toISOString()
      });
      
      // Store state in sessionStorage
      sessionStorage.setItem('coinbase_oauth_state', state);
      
      // Verify state was stored
      const savedState = sessionStorage.getItem('coinbase_oauth_state');
      console.log("[Coinbase OAuth] Verified stored state:", {
        saved: savedState,
        matches: savedState === state
      });

      // Construct the authorization URL
      const clientId = process.env.NEXT_PUBLIC_COINBASE_CLIENT_ID;
      const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/coinbase/callback`.replace(/([^:]\/)\/+/g, "$1");
      
      console.log("[Coinbase OAuth] Initiating OAuth flow:", {
        hasClientId: !!clientId,
        redirectUri,
        state,
        timestamp: new Date().toISOString()
      });

      if (!clientId) {
        throw new Error("Coinbase client ID is not configured");
      }

      const authUrl = new URL("https://www.coinbase.com/oauth/authorize");
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("client_id", clientId);
      authUrl.searchParams.append("redirect_uri", redirectUri);
      authUrl.searchParams.append("state", state);
      authUrl.searchParams.append("scope", "wallet:user:read");

      // Log the final URL (without sensitive data)
      console.log("[Coinbase OAuth] Redirecting to:", {
        baseUrl: authUrl.origin + authUrl.pathname,
        hasState: !!authUrl.searchParams.get("state"),
        hasClientId: !!authUrl.searchParams.get("client_id"),
        hasRedirectUri: !!authUrl.searchParams.get("redirect_uri"),
        scope: authUrl.searchParams.get("scope")
      });

      // Redirect to Coinbase
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("[Coinbase OAuth] Error initiating connection:", error);
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