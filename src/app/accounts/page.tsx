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
import { PlusCircle, Wallet, Building, ExternalLink, BarChart2, ArrowRightLeft, AlertCircle, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletConnectDialog } from "@/components/wallet-connect-dialog";
import type { ConnectionResult } from "@/types/wallet"; // Import the ConnectionResult type
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import axios from "axios";

// Define types
interface BaseAccount {
  id: number;
  name: string;
  type: string;
  balance: string;
  lastUpdated: string;
  provider: string;
  logo: string;
  transactions?: number; // Add transactions count to each account
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

// Mock data for accounts
const connectedWallets: WalletAccount[] = [
  {
    id: 1,
    name: "Ethereum Wallet",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    chain: "Ethereum",
    type: "wallet",
    balance: "$5,230.45",
    lastUpdated: "2023-12-15T14:30:12Z",
    provider: "MetaMask",
    logo: "/images/tokens/ethereum.png",
    transactions: 28,
  },
  {
    id: 2,
    name: "Solana Wallet",
    address: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH",
    chain: "Solana",
    type: "wallet",
    balance: "$2,845.32",
    lastUpdated: "2023-12-14T09:22:45Z",
    provider: "Phantom",
    logo: "/images/tokens/solana.png",
    transactions: 15,
  },
  {
    id: 3,
    name: "Bitcoin Wallet",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    chain: "Bitcoin",
    type: "wallet",
    balance: "$4,120.78",
    lastUpdated: "2023-12-12T16:45:30Z",
    provider: "Ledger",
    logo: "/images/tokens/bitcoin.png",
    transactions: 12,
  },
];

const connectedExchanges: ExchangeAccount[] = [
  {
    id: 4,
    name: "Coinbase",
    type: "exchange",
    balance: "$7,890.22",
    lastUpdated: "2023-12-15T18:10:33Z",
    provider: "Coinbase",
    logo: "/images/tokens/coinbase.png",
    transactions: 42,
  },
  {
    id: 5,
    name: "Binance",
    type: "exchange",
    balance: "$3,450.65",
    lastUpdated: "2023-12-14T22:05:18Z",
    provider: "Binance",
    logo: "/images/tokens/binance.png",
    transactions: 31,
  },
];

const allAccounts: Account[] = [...connectedWallets, ...connectedExchanges];

// Mock supported wallets and exchanges for connection
const supportedWallets = [
  { id: "metamask", name: "MetaMask", logo: "/images/tokens/ethereum.png" },
  { id: "phantom", name: "Phantom", logo: "/images/tokens/solana.png" },
  { id: "ledger", name: "Ledger", logo: "/images/tokens/bitcoin.png" },
  { id: "trezor", name: "Trezor", logo: "/images/tokens/ethereum.png" },
];

const supportedExchanges = [
  { id: "coinbase", name: "Coinbase", logo: "/images/tokens/coinbase.png" },
  { id: "binance", name: "Binance", logo: "/images/tokens/binance.png" },
  { id: "kraken", name: "Kraken", logo: "/images/tokens/ethereum.png" },
  { id: "kucoin", name: "KuCoin", logo: "/images/tokens/bitcoin.png" },
  { id: "gemini", name: "Gemini", logo: "/images/tokens/ethereum.png" },
];

// Create a separate component for the accounts page content
function AccountsContent() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>(allAccounts);
  const [accounts, setAccounts] = useState<Account[]>(allAccounts);
  const [isLoadingCoinbase, setIsLoadingCoinbase] = useState(false);
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
      
      // Fetch Coinbase accounts
      fetchCoinbaseAccounts();
    } else if (error) {
      setOauthStatus({ error });
      toast.error(`Failed to connect: ${error}`);
    }
  }, [searchParams]);

  // Fetch Coinbase accounts from our API
  const fetchCoinbaseAccounts = async () => {
    try {
      setIsLoadingCoinbase(true);
      console.log("[Accounts] Fetching Coinbase accounts");
      
      const response = await axios.get('/api/coinbase/accounts');
      
      // Process the accounts
      if (response.data.accounts && response.data.accounts.length > 0) {
        console.log("[Accounts] Received Coinbase accounts:", response.data.accounts.length);
        
        // Convert Coinbase accounts to our application's account format
        const coinbaseAccounts = response.data.accounts.map((account: any, index: number) => {
          const newId = accounts.length + index + 1;
          
          const newAccount: ExchangeAccount = {
            id: newId,
            name: `Coinbase ${account.name}`,
            type: "exchange",
            balance: account.balance?.formatted || "$0.00",
            lastUpdated: new Date().toISOString(),
            provider: "Coinbase",
            logo: "/images/tokens/coinbase.png",
            transactions: 0
          };
          
          return newAccount;
        });
        
        // Add the accounts to our state
        setAccounts(prevAccounts => [...prevAccounts, ...coinbaseAccounts]);
        toast.success(`Added ${coinbaseAccounts.length} Coinbase accounts`);
      } else {
        console.log("[Accounts] No Coinbase accounts found");
        toast.info("No Coinbase accounts found");
      }
    } catch (error) {
      console.error("[Accounts] Error fetching Coinbase accounts:", error);
      toast.error("Failed to fetch Coinbase accounts");
    } finally {
      setIsLoadingCoinbase(false);
    }
  };

  useEffect(() => {
    if (filter === "all") {
      setFilteredAccounts(accounts);
    } else if (filter === "wallets") {
      setFilteredAccounts(accounts.filter(acc => acc.type === "wallet"));
    } else if (filter === "exchanges") {
      setFilteredAccounts(accounts.filter(acc => acc.type === "exchange"));
    }
  }, [filter, accounts]);

  // Calculate total accounts and transactions
  const getTotalAccounts = () => {
    return accounts.length;
  };

  const getTotalTransactions = () => {
    return accounts.reduce((total, account) => total + (account.transactions || 0), 0);
  };

  const handleAccountConnect = (provider: string, data: ConnectionResult) => { 
    // Generate a mock account based on the provider
    const newId = accounts.length + 1;
    let newAccount: Account;

    if (provider === "csv") {
      // For CSV, create an exchange account
      const newExchange: ExchangeAccount = {
        id: newId,
        name: `CSV Import (${data.fileName})`,
        type: "exchange",
        balance: "$0.00",
        lastUpdated: new Date().toISOString(),
        provider: "CSV",
        logo: "https://cryptologos.cc/logos/csv-file-icon.png",
        transactions: 0,
      };
      newAccount = newExchange;
      toast.success(`CSV file imported successfully: ${data.fileName}`);
    } else if (["binance", "kraken", "kucoin", "gemini"].includes(provider)) {
      // For exchanges (excluding Coinbase which uses OAuth)
      const exchangeInfo = supportedExchanges.find(e => e.id === provider);
      const newExchange: ExchangeAccount = {
        id: newId,
        name: exchangeInfo?.name || provider,
        type: "exchange",
        balance: "$0.00",
        lastUpdated: new Date().toISOString(),
        provider: exchangeInfo?.name || provider,
        logo: exchangeInfo?.logo || "",
        transactions: 0,
      };
      newAccount = newExchange;
      toast.success(`Connected to ${exchangeInfo?.name || provider}`);
    } else {
      // For wallets
      const walletInfo = supportedWallets.find(w => w.id === provider);
      const newWallet: WalletAccount = {
        id: newId,
        name: `${walletInfo?.name || provider} Wallet`,
        type: "wallet",
        address: `0x${Math.random().toString(16).substring(2, 42)}`,
        chain: provider === "metamask" ? "Ethereum" :
               provider === "phantom" ? "Solana" :
               provider === "keplr" ? "Cosmos" : "Multiple",
        balance: "$0.00",
        lastUpdated: new Date().toISOString(),
        provider: walletInfo?.name || provider,
        logo: walletInfo?.logo || "",
        transactions: 0,
      };
      newAccount = newWallet;
      toast.success(`Connected to ${walletInfo?.name || provider}`);
    }

    setAccounts([...accounts, newAccount]);
  };

  const formatAddress = (address: string) => {
    if (address.length < 15) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Add this helper function after formatAddress function
  const getAccountColor = (provider: string): string => {
    const colors: {[key: string]: string} = {
      MetaMask: "#E2761B", // MetaMask orange
      Phantom: "#9945FF", // Phantom purple
      Ledger: "#000000", // Ledger black
      Coinbase: "#0052FF", // Coinbase blue
      Binance: "#F0B90B", // Binance yellow
      Kraken: "#5741D9", // Kraken purple
      KuCoin: "#26A17B", // KuCoin green
      Gemini: "#00DCFA", // Gemini blue
      CSV: "#4CAF50", // Green for CSV
      Default: "#6E56CF", // Default purple
    };

    return colors[provider] || colors.Default;
  };

  const getAccountAbbreviation = (name: string): string => {
    // For exchanges/providers, use first 1-2 letters
    if (name.includes(" ")) {
      // For "X Wallet" or similar formats, use the first letter of each word
      return name.split(" ")
        .map(word => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    
    // For single word names, use first 2 letters
    return name.slice(0, 2).toUpperCase();
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
            <p>Successfully connected to Coinbase! Your accounts have been imported.</p>
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

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="col-span-3 md:col-span-1">
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
              <CardDescription>Overview of your connected accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-muted-foreground">Total Accounts</div>
                  <div></div>
                </div>
                <div className="text-2xl font-bold">{getTotalAccounts()}</div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-muted-foreground">Total Transactions</div>
                  <div></div>
                </div>
                <div className="text-2xl font-bold">{getTotalTransactions()}</div>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Account Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Wallets</span>
                    </div>
                    <span className="text-sm font-medium">
                      {accounts.filter(acc => acc.type === "wallet").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Exchanges</span>
                    </div>
                    <span className="text-sm font-medium">
                      {accounts.filter(acc => acc.type === "exchange").length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-start" onClick={() => setIsAddDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Account</span>
                  </Button>
                  {isLoadingCoinbase && (
                    <div className="text-center text-sm text-muted-foreground flex items-center gap-2 justify-center mt-4">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading Coinbase accounts...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 md:col-span-2">
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your connected accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {filteredAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="flex h-8 w-8 items-center justify-center rounded-full text-white font-bold text-sm"
                      style={{ backgroundColor: getAccountColor(account.provider) }}
                    >
                      {getAccountAbbreviation(account.provider)}
                    </div>
                    {account.type === "wallet" ? (
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Building className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="mr-2">{account.name}</span>
                    {account.type === "wallet" && (
                      <span>{formatAddress((account as WalletAccount).address)}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      <span className="mr-2">
                        {account.transactions} transaction{account.transactions !== 1 ? 's' : ''}
                      </span>
                      |
                      <span className="ml-2">
                        Last Updated: {new Date(account.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                    <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
                      <span>Details</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
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
          <WalletConnectDialog onConnect={(provider, data) => {
            handleAccountConnect(provider, data);
            setIsAddDialogOpen(false);
          }} />
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
