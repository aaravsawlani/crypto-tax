"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Wallet, Building, ExternalLink, BarChart2, ArrowRightLeft } from "lucide-react";
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

export default function AccountsPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>(allAccounts);
  const [accounts, setAccounts] = useState<Account[]>(allAccounts);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleAccountConnect = (provider: string, data: ConnectionResult) => { // Update to use ConnectionResult
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
    } else if (["coinbase", "binance", "kraken", "kucoin", "gemini"].includes(provider)) {
      // For exchanges
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
    const colors = {
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
    
    // Single word name - use first two letters
    return name.slice(0, 2).toUpperCase();
  };

  if (!mounted) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Connected Accounts</h1>
          <WalletConnectDialog onConnect={handleAccountConnect} />
        </div>
        
        {/* Account Summary Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Connected Accounts
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 p-1.5">
                <Wallet className="h-full w-full text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalAccounts()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{filteredAccounts.filter(a => a.type === "wallet").length} wallets and {filteredAccounts.filter(a => a.type === "exchange").length} exchanges</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Transactions
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 p-1.5">
                <ArrowRightLeft className="h-full w-full text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalTransactions()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>Across all connected accounts</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Accounts</TabsTrigger>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAccounts.map((account) => (
            <Card key={account.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{account.name}</CardTitle>
                  {account.type === "wallet" && (
                    <CardDescription>
                      {formatAddress((account as WalletAccount).address)}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center space-x-2">
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
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-2">
                  <div className="text-sm text-muted-foreground">Balance</div>
                  <div className="text-2xl font-bold">{account.balance}</div>
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
              </CardContent>
            </Card>
          ))}

          <Card className="flex h-full flex-col items-center justify-center border-dashed p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <PlusCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Add Account</h3>
            <p className="mb-4 mt-1 text-center text-sm text-muted-foreground">
              Connect a wallet or exchange to track your crypto tax information.
            </p>
            <WalletConnectDialog onConnect={handleAccountConnect} />
          </Card>
        </div>
      </div>
    </Layout>
  );
}
