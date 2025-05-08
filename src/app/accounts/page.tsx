"use client";

import { useState, useEffect, Suspense } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Wallet, Building, ExternalLink, AlertCircle, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletConnectDialog } from "@/components/wallet-connect-dialog";
import type { ConnectionResult } from "@/types/wallet";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

// Define types
interface BaseAccount {
  id: number;
  name: string;
  type: string;
  balance: string;
  lastUpdated: string;
  provider: string;
  logo: string;
  transactions?: number;
}

interface WalletAccount extends BaseAccount {
  type: "wallet";
  address: string;
  chain: string;
}

interface ExchangeAccount extends BaseAccount {
  type: "exchange";
}

type Account = WalletAccount | ExchangeAccount;

// Create a separate component for the accounts page content
function AccountsContent() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [oauthStatus, setOauthStatus] = useState<{ success?: boolean; error?: string } | null>(null);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    
    // Check for OAuth callback parameters
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    
    if (success === 'true') {
      setOauthStatus({ success: true });
      toast.success('Successfully connected to Coinbase');
    } else if (error) {
      setOauthStatus({ error });
      toast.error(`Failed to connect: ${error}`);
    }
  }, [searchParams]);

  const handleAccountConnect = (provider: string, data: ConnectionResult) => { 
    toast.success(`Connected to ${provider}`);
    setIsAddDialogOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Accounts</h1>
            <p className="text-muted-foreground">Manage your crypto wallets and exchanges</p>
          </div>
          <div className="flex gap-2">
            <Tabs value={filter} className="w-[400px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" onClick={() => setFilter("all")}>
                  All
                </TabsTrigger>
                <TabsTrigger value="wallets" onClick={() => setFilter("wallets")}>
                  Wallets
                </TabsTrigger>
                <TabsTrigger value="exchanges" onClick={() => setFilter("exchanges")}>
                  Exchanges
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* OAuth Status Messages */}
        {oauthStatus?.success && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p>Successfully connected to Coinbase! Your accounts will appear here once implemented.</p>
          </div>
        )}
        
        {oauthStatus?.error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p>Failed to connect to Coinbase: {oauthStatus.error}</p>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => window.location.href = '/api/auth/coinbase'}>
              Try Again
            </Button>
          </div>
        )}

        {/* Empty state - shows when no accounts exist */}
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No accounts connected</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Connect your crypto wallets and exchanges to track your portfolio and calculate tax reports.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Account</DialogTitle>
            <DialogDescription>
              Connect a wallet, exchange, or import transactions
            </DialogDescription>
          </DialogHeader>
          <WalletConnectDialog onConnect={handleAccountConnect} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

// Loading component to show when Suspense is active
function AccountsLoading() {
  return (
    <Layout>
      <div className="container py-6 space-y-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-xl font-medium">Loading accounts...</h2>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Main exported page component with Suspense boundary
export default function AccountsPage() {
  return (
    <Suspense fallback={<AccountsLoading />}>
      <AccountsContent />
    </Suspense>
  );
}
