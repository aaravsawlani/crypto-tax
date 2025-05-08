"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Error</CardTitle>
        <CardDescription>
          {error === "AccessDenied"
            ? "You denied access to your Coinbase account"
            : "An error occurred during authentication"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {error === "AccessDenied"
            ? "You need to grant access to your Coinbase account to use this feature."
            : "Please try again or contact support if the problem persists."}
        </p>
        <Button
          className="w-full"
          onClick={() => window.location.href = "/auth/signin"}
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AuthError() {
  return (
    <Layout>
      <div className="container max-w-lg mx-auto py-12">
        <Suspense fallback={
          <Card>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Please wait while we load the error details...
              </p>
            </CardContent>
          </Card>
        }>
          <ErrorContent />
        </Suspense>
      </div>
    </Layout>
  );
} 