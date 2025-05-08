"use client";

import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, Coins, Wallet, ExternalLink, TrendingUp, TrendingDown, FileBadge } from "lucide-react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useRouter } from "next/navigation";

// Empty data structures instead of mock data
const portfolioValueData = [];
const assetsData = [];
const transactionsData = [];
const nftData = [];
const defiData = [];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [assetType, setAssetType] = useState("coins");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleCoinClick = (symbol) => {
    router.push(`/coins/${symbol}`);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Portfolio Value
              </CardTitle>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <div className="flex items-center text-xs text-muted-foreground">
                No portfolio data
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unrealized Gains
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <div className="flex items-center text-xs text-muted-foreground">
                No gains data
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxable Events (2023)
              </CardTitle>
              <FileBadge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <div className="flex items-center text-xs text-muted-foreground">
                0 transactions
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Tabs defaultValue="portfolio">
            <TabsList>
              <TabsTrigger value="portfolio">Portfolio Value</TabsTrigger>
              <TabsTrigger value="asset">Asset Allocation</TabsTrigger>
              <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Value Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {portfolioValueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={portfolioValueData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke="hsl(var(--muted-foreground))"
                          strokeOpacity={0.6}
                        />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                        />
                        <YAxis 
                          tickFormatter={(value) => `$${value.toLocaleString()}`}
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                        />
                        <Tooltip 
                          formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                          labelFormatter={(label) => `Date: ${label}`}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--card-foreground))',
                            borderRadius: 'var(--radius)',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                          }}
                          labelStyle={{
                            color: 'hsl(var(--card-foreground))',
                            fontWeight: 500
                          }}
                          itemStyle={{
                            color: 'hsl(var(--card-foreground))'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No portfolio data</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Connect accounts or add transactions to see your portfolio value over time.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="asset">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {assetsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assetsData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {assetsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'Allocation']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--card-foreground))',
                            borderRadius: 'var(--radius)',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                          }}
                          labelStyle={{
                            color: 'hsl(var(--card-foreground))',
                            fontWeight: 500
                          }}
                          itemStyle={{
                            color: 'hsl(var(--card-foreground))'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Coins className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No assets found</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Connect accounts or add transactions to see your asset allocation.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions">
              <Card>
                <CardContent className="p-0">
                  {transactionsData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left font-medium text-muted-foreground p-4">Type</th>
                            <th className="text-left font-medium text-muted-foreground p-4">Asset</th>
                            <th className="text-right font-medium text-muted-foreground p-4">Amount</th>
                            <th className="text-right font-medium text-muted-foreground p-4">Value</th>
                            <th className="text-right font-medium text-muted-foreground p-4">Date</th>
                            <th className="text-right font-medium text-muted-foreground p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactionsData.map((transaction) => (
                            <tr key={transaction.id} className="border-b last:border-b-0">
                              <td className="p-4">
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  transaction.type === "Buy"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : transaction.type === "Sell"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                }`}>
                                  {transaction.type}
                                </span>
                              </td>
                              <td className="p-4">{transaction.asset}</td>
                              <td className="p-4 text-right">{transaction.amount}</td>
                              <td className="p-4 text-right">{transaction.value}</td>
                              <td className="p-4 text-right">{transaction.date}</td>
                              <td className="p-4 text-right">
                                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  {transaction.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[400px]">
                      <div className="text-center">
                        <ArrowUpRight className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No transactions</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Connect accounts or add transactions to see your recent activity.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Holdings Section */}
      <div className="mt-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">Holdings</h2>
          <div className="mt-2 sm:mt-0 flex items-center gap-2">
            <div className="bg-muted rounded-lg p-1 inline-flex">
              <button 
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${assetType === "coins" 
                  ? "bg-background shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setAssetType("coins")}
              >
                Coins
              </button>
              <button 
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${assetType === "nfts" 
                  ? "bg-background shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setAssetType("nfts")}
              >
                NFTs
              </button>
              <button 
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${assetType === "defi" 
                  ? "bg-background shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setAssetType("defi")}
              >
                DeFi
              </button>
            </div>
            <button className="p-1.5 rounded-md hover:bg-muted">
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {assetType === "coins" && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium text-muted-foreground p-4">Asset</th>
                      <th className="text-right font-medium text-muted-foreground p-4">Percent</th>
                      <th className="text-right font-medium text-muted-foreground p-4">Price</th>
                      <th className="text-right font-medium text-muted-foreground p-4">Holdings</th>
                      <th className="text-right font-medium text-muted-foreground p-4">Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Bitcoin */}
                    <tr 
                      className="border-b hover:bg-muted/40 cursor-pointer" 
                      onClick={() => handleCoinClick('btc')}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                            <Coins className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <div className="font-medium">Bitcoin</div>
                            <div className="text-xs text-muted-foreground">BTC</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center gap-2">
                          <div className="relative w-full min-w-[50px]">
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div className="h-2 rounded-full bg-primary" style={{ width: "62%" }} />
                            </div>
                          </div>
                          <span className="text-xs font-medium whitespace-nowrap">62%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">$42,381.54</div>
                        <div className="text-xs text-green-500">+1.2%</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">$8,476.31</div>
                        <div className="text-xs text-muted-foreground">0.2 BTC</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium text-green-500">+$421.58</div>
                        <div className="text-xs text-green-500">+5.23%</div>
                      </td>
                    </tr>

                    {/* Ethereum */}
                    <tr 
                      className="border-b hover:bg-muted/40 cursor-pointer" 
                      onClick={() => handleCoinClick('eth')}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                            <Coins className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium">Ethereum</div>
                            <div className="text-xs text-muted-foreground">ETH</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center gap-2">
                          <div className="relative w-full min-w-[50px]">
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div className="h-2 rounded-full bg-primary" style={{ width: "28%" }} />
                            </div>
                          </div>
                          <span className="text-xs font-medium whitespace-nowrap">28%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">$2,305.76</div>
                        <div className="text-xs text-green-500">+0.8%</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">$4,611.52</div>
                        <div className="text-xs text-muted-foreground">2.0 ETH</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium text-green-500">+$215.92</div>
                        <div className="text-xs text-green-500">+4.91%</div>
                      </td>
                    </tr>

                    {/* Solana */}
                    <tr 
                      className="border-b hover:bg-muted/40 cursor-pointer" 
                      onClick={() => handleCoinClick('sol')}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                            <Coins className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <div className="font-medium">Solana</div>
                            <div className="text-xs text-muted-foreground">SOL</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center gap-2">
                          <div className="relative w-full min-w-[50px]">
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div className="h-2 rounded-full bg-primary" style={{ width: "10%" }} />
                            </div>
                          </div>
                          <span className="text-xs font-medium whitespace-nowrap">10%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">$129.76</div>
                        <div className="text-xs text-green-500">+1.47%</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">$1,297.60</div>
                        <div className="text-xs text-muted-foreground">10 SOL</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium text-red-500">-$52.40</div>
                        <div className="text-xs text-red-500">-3.88%</div>
                      </td>
                    </tr>

                    {/* USDC */}
                    <tr 
                      className="hover:bg-muted/40 cursor-pointer" 
                      onClick={() => handleCoinClick('usdc')}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                            <Coins className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium">USD Coin</div>
                            <div className="text-xs text-muted-foreground">USDC</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center gap-2">
                          <div className="relative w-full min-w-[50px]">
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div className="h-2 rounded-full bg-primary" style={{ width: "5%" }} />
                            </div>
                          </div>
                          <span className="text-xs font-medium whitespace-nowrap">5%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">$1.00</div>
                        <div className="text-xs text-muted-foreground">0%</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">$873.80</div>
                        <div className="text-xs text-muted-foreground">873.8 USDC</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium text-muted-foreground">$0.00</div>
                        <div className="text-xs text-muted-foreground">0.00%</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {assetType === "nfts" && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium text-muted-foreground p-4">NFT</th>
                      <th className="text-right font-medium text-muted-foreground p-4">Percent</th>
                      <th className="text-right font-medium text-muted-foreground p-4">Price</th>
                      <th className="text-right font-medium text-muted-foreground p-4">Floor Price</th>
                      <th className="text-right font-medium text-muted-foreground p-4">Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nftData.map((nft) => (
                      <tr key={nft.id} className={nft.id !== nftData.length ? "border-b hover:bg-muted/40" : "hover:bg-muted/40"}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-lg bg-muted">
                              <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium">{nft.name}</div>
                              <div className="text-xs text-muted-foreground">{nft.collection}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center gap-2">
                            <div className="relative w-full min-w-[50px]">
                              <div className="h-2 w-full rounded-full bg-muted">
                                <div className="h-2 rounded-full bg-primary" style={{ width: `${nft.allocation}%` }} />
                              </div>
                            </div>
                            <span className="text-xs font-medium whitespace-nowrap">{nft.allocation}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="font-medium">{nft.price}</div>
                          <div className={`text-xs ${nft.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{nft.change}</div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="font-medium">{nft.floor}</div>
                          <div className="text-xs text-muted-foreground">Collection floor</div>
                        </td>
                        <td className="p-4 text-right">
                          <div className={`font-medium ${nft.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {nft.change.startsWith('+') ? '+' : '-'}
                            {Math.abs(parseFloat(nft.price.replace(/[^0-9.-]+/g, "")) - parseFloat(nft.lastPrice.replace(/[^0-9.-]+/g, ""))).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                          </div>
                          <div className={`text-xs ${nft.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{nft.change}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {assetType === "defi" && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium text-muted-foreground p-4">Protocol</th>
                      <th className="text-right font-medium text-muted-foreground p-4">Percent</th>
                      <th className="text-right font-medium text-muted-foreground p-4">Value</th>
                      <th className="text-right font-medium text-muted-foreground p-4">APY</th>
                      <th className="text-right font-medium text-muted-foreground p-4">Rewards</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defiData.map((defi) => (
                      <tr key={defi.id} className={defi.id !== defiData.length ? "border-b hover:bg-muted/40" : "hover:bg-muted/40"}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full 
                              ${defi.protocol === 'Lending' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-violet-100 dark:bg-violet-900/20'}`}>
                              <Wallet className={`h-5 w-5 
                                ${defi.protocol === 'Lending' ? 'text-green-600 dark:text-green-400' : 'text-violet-600 dark:text-violet-400'}`} />
                            </div>
                            <div>
                              <div className="font-medium">{defi.name}</div>
                              <div className="text-xs text-muted-foreground">{defi.protocol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center gap-2">
                            <div className="relative w-full min-w-[50px]">
                              <div className="h-2 w-full rounded-full bg-muted">
                                <div className="h-2 rounded-full bg-primary" style={{ width: `${defi.allocation}%` }} />
                              </div>
                            </div>
                            <span className="text-xs font-medium whitespace-nowrap">{defi.allocation}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="font-medium">{defi.value}</div>
                          <div className="text-xs text-muted-foreground">{defi.balance}</div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="font-medium text-green-500">{defi.apy}</div>
                          <div className="text-xs text-muted-foreground">Annual</div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="font-medium text-green-500">{defi.rewards}</div>
                          <div className="text-xs text-green-500">Earned</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
