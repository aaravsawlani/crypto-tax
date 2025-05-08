"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout";

export default function SignIn() {
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
              onClick={() => signIn("coinbase", { callbackUrl: "/transactions" })}
            >
              Connect with Coinbase
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 