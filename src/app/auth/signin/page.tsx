"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("coinbase", { 
        callbackUrl: "/transactions",
        redirect: true,
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-lg mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle>Connect Coinbase</CardTitle>
            <CardDescription>
              Connect your Coinbase account to import your transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Connect with Coinbase"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 