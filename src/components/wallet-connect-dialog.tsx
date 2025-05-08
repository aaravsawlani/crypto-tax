"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Loader2 } from "lucide-react";
import type { ConnectionResult, WalletProvider, ExchangeProvider } from "@/types/wallet";

const walletProviders: WalletProvider[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "/images/tokens/ethereum.png",
    chains: ["Ethereum", "Polygon", "Arbitrum", "Optimism"],
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: "/images/tokens/solana.png",
    chains: ["Solana"],
  },
  {
    id: "keplr",
    name: "Keplr",
    icon: "/images/tokens/ethereum.png",
    chains: ["Cosmos", "Osmosis", "Juno"],
  },
  {
    id: "ledger",
    name: "Ledger",
    icon: "/images/tokens/bitcoin.png",
    chains: ["Bitcoin", "Ethereum", "Solana", "Multiple"],
  },
];

const exchangeProviders: ExchangeProvider[] = [
  {
    id: "coinbase",
    name: "Coinbase",
    icon: "/images/tokens/coinbase.png",
    connection: "API",
  },
  {
    id: "binance",
    name: "Binance",
    icon: "/images/tokens/binance.png",
    connection: "API",
  },
  {
    id: "kraken",
    name: "Kraken",
    icon: "/images/tokens/ethereum.png",
    connection: "API/CSV",
  },
  {
    id: "kucoin",
    name: "KuCoin",
    icon: "/images/tokens/bitcoin.png",
    connection: "CSV",
  },
];

interface WalletConnectDialogProps {
  onConnect?: (provider: string, data: ConnectionResult) => void;
}

export function WalletConnectDialog({ onConnect }: WalletConnectDialogProps) {
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  const handleConnect = (provider: string) => {
    setSelectedProvider(provider);
    setConnecting(true);

    // Simulate connection process
    setTimeout(() => {
      setConnecting(false);
      setOpen(false);

      if (onConnect) {
        onConnect(provider, {
          success: true,
          provider,
          timestamp: new Date().toISOString(),
        });
      }
    }, 2000);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleCsvSubmit = () => {
    if (!csvFile) return;

    setConnecting(true);

    // Simulate processing
    setTimeout(() => {
      setConnecting(false);
      setOpen(false);

      if (onConnect) {
        onConnect("csv", {
          success: true,
          provider: "csv",
          fileName: csvFile.name,
          timestamp: new Date().toISOString(),
        });
      }
    }, 2500);
  };

  const handleApiConnect = () => {
    if (!apiKey || !apiSecret) return;

    setConnecting(true);

    // Simulate API connection
    setTimeout(() => {
      setConnecting(false);
      setOpen(false);

      if (onConnect) {
        onConnect(selectedProvider, {
          success: true,
          provider: selectedProvider,
          timestamp: new Date().toISOString(),
        });
      }
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Connect Wallet or Exchange</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect Account</DialogTitle>
          <DialogDescription>
            Connect your crypto wallets and exchanges to import your transactions
          </DialogDescription>
        </DialogHeader>

        {connecting ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Connecting to {selectedProvider}...</p>
            <p className="text-sm text-muted-foreground mt-2">This might take a few moments</p>
          </div>
        ) : (
          <Tabs defaultValue="wallets" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wallets">Wallets</TabsTrigger>
              <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
              <TabsTrigger value="csv">CSV Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="wallets" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {walletProviders.map((provider) => (
                  <button
                    key={provider.id}
                    className="flex flex-col items-center space-y-2 rounded-lg border p-4 hover:bg-accent transition-colors"
                    onClick={() => handleConnect(provider.id)}
                  >
                    <img
                      src={provider.icon}
                      alt={provider.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div className="text-center">
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-xs text-muted-foreground">{provider.chains.join(", ")}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-2 pt-2">
                <div className="h-px flex-1 bg-border" />
                <p className="text-xs text-muted-foreground">Or connect manually</p>
                <div className="h-px flex-1 bg-border" />
              </div>
              <Button variant="outline" className="w-full" onClick={() => handleConnect("manual")}>
                <QrCode className="mr-2 h-4 w-4" />
                Connect with address
              </Button>
            </TabsContent>

            <TabsContent value="exchanges" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {exchangeProviders.map((provider) => (
                  <button
                    key={provider.id}
                    className="flex flex-col items-center space-y-2 rounded-lg border p-4 hover:bg-accent transition-colors"
                    onClick={() => {
                      setSelectedProvider(provider.id);

                      // If provider only supports CSV, switch to CSV tab
                      if (provider.connection === "CSV") {
                        const csvTab = document.querySelector('[data-value="csv"]') as HTMLElement;
                        csvTab?.click();
                      }
                    }}
                  >
                    <img
                      src={provider.icon}
                      alt={provider.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div className="text-center">
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-xs text-muted-foreground">Via {provider.connection}</p>
                    </div>
                  </button>
                ))}
              </div>

              {selectedProvider && ["coinbase", "binance", "kraken"].includes(selectedProvider) && (
                <div className="mt-4 space-y-4 border rounded-lg p-4">
                  <h3 className="text-sm font-medium">API Connection for {selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)}</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="api-secret">API Secret</Label>
                      <Input
                        id="api-secret"
                        type="password"
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                        placeholder="Enter your API secret"
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleApiConnect}
                      disabled={!apiKey || !apiSecret}
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="csv" className="mt-4 space-y-4">
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 text-lg font-medium">Upload transaction CSV</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Drag and drop your transaction CSV file or click to browse
                </p>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  className="mx-auto max-w-xs"
                  onChange={handleCsvUpload}
                />
                {csvFile && (
                  <div className="mt-4 text-sm">
                    Selected file: <span className="font-medium">{csvFile.name}</span>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleCsvSubmit}
                  disabled={!csvFile}
                >
                  Upload and Process
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
