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

// Mock data for the dashboard
const portfolioValueData = [
  { date: "Jan", value: 1000 },
  { date: "Feb", value: 1200 },
  { date: "Mar", value: 900 },
  { date: "Apr", value: 1500 },
  { date: "May", value: 2000 },
  { date: "Jun", value: 1800 },
  { date: "Jul", value: 2400 },
  { date: "Aug", value: 2600 },
  { date: "Sep", value: 2200 },
  { date: "Oct", value: 2800 },
  { date: "Nov", value: 3100 },
  { date: "Dec", value: 3500 },
];

const assetsData = [
  { name: "Bitcoin", value: 42, color: "#F7931A" },
  { name: "Ethereum", value: 28, color: "#6E7FE0" },
  { name: "Solana", value: 15, color: "#00FFA3" },
  { name: "Cardano", value: 8, color: "#0033AD" },
  { name: "Others", value: 7, color: "#6C7284" },
];

const transactionsData = [
  {
    id: 1,
    type: "Buy",
    asset: "Bitcoin",
    amount: "0.05 BTC",
    value: "$2,150.75",
    date: "Dec 15, 2023",
    status: "Completed",
  },
  {
    id: 2,
    type: "Sell",
    asset: "Ethereum",
    amount: "1.2 ETH",
    value: "$2,880.40",
    date: "Dec 10, 2023",
    status: "Completed",
  },
  {
    id: 3,
    type: "Buy",
    asset: "Solana",
    amount: "12 SOL",
    value: "$1,346.88",
    date: "Dec 5, 2023",
    status: "Completed",
  },
  {
    id: 4,
    type: "Receive",
    asset: "Bitcoin",
    amount: "0.01 BTC",
    value: "$430.15",
    date: "Dec 1, 2023",
    status: "Completed",
  },
];

// Add NFT and DeFi mock data at the top of the file with other mock data
const nftData = [
  {
    id: 1,
    name: "Bored Ape #1234",
    collection: "BAYC",
    image: "ape",
    price: "$103,450.00",
    lastPrice: "$98,760.00",
    change: "+4.7%", 
    floor: "$95,230.00",
    allocation: 62
  },
  {
    id: 2,
    name: "Azuki #5678",
    collection: "Azuki",
    image: "azuki",
    price: "$32,540.00",
    lastPrice: "$36,210.00",
    change: "-10.1%",
    floor: "$30,120.00",
    allocation: 18
  },
  {
    id: 3,
    name: "Doodle #9012",
    collection: "Doodles",
    image: "doodle",
    price: "$11,230.00",
    lastPrice: "$10,980.00",
    change: "+2.3%",
    floor: "$10,500.00",
    allocation: 13
  },
  {
    id: 4,
    name: "CloneX #3456",
    collection: "CloneX",
    image: "clone",
    price: "$9,870.00",
    lastPrice: "$10,230.00",
    change: "-3.5%",
    floor: "$9,450.00",
    allocation: 7
  }
];

const defiData = [
  {
    id: 1,
    name: "Aave",
    protocol: "Lending",
    symbol: "AAVE",
    value: "$2,348.20",
    apy: "4.2%",
    balance: "12.5 AAVE",
    rewards: "$98.62",
    allocation: 40
  },
  {
    id: 2,
    name: "Uniswap LP",
    protocol: "DEX",
    symbol: "UNI-V3",
    value: "$1,562.80",
    apy: "18.7%",
    balance: "0.05 LP",
    rewards: "$292.25",
    allocation: 28
  },
  {
    id: 3,
    name: "Curve",
    protocol: "DEX",
    symbol: "CRV",
    value: "$987.45",
    apy: "5.8%",
    balance: "425.2 CRV",
    rewards: "$57.27",
    allocation: 20
  },
  {
    id: 4,
    name: "Compound",
    protocol: "Lending",
    symbol: "COMP",
    value: "$645.32",
    apy: "3.5%",
    balance: "8.4 COMP",
    rewards: "$22.58",
    allocation: 12
  }
];

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
              <div className="text-2xl font-bold">$14,259.23</div>
              <div className="flex items-center text-xs text-green-500">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12.5% from last month
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
              <div className="text-2xl font-bold">$3,842.56</div>
              <div className="flex items-center text-xs text-green-500">
                <TrendingUp className="mr-1 h-3 w-3" />
                +8.2% from purchase value
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
              <div className="text-2xl font-bold">$1,248.33</div>
              <div className="flex items-center text-xs text-red-500">
                <TrendingDown className="mr-1 h-3 w-3" />
                42 transactions
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
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="asset">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
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
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                        itemStyle={{
                          color: 'hsl(var(--card-foreground))'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left">Type</th>
                          <th className="px-4 py-3 text-left">Asset</th>
                          <th className="px-4 py-3 text-right">Amount</th>
                          <th className="px-4 py-3 text-right">Value</th>
                          <th className="px-4 py-3 text-right">Date</th>
                          <th className="px-4 py-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactionsData.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="border-b last:border-0 hover:bg-muted/40"
                          >
                            <td className="px-4 py-3 text-left">
                              <span 
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  transaction.type === "Buy"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : transaction.type === "Sell"
                                    ? "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                                    : transaction.type === "Receive" || transaction.type === "Send"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                }`}
                              >
                                {transaction.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-left">{transaction.asset}</td>
                            <td className="px-4 py-3 text-right">{transaction.amount}</td>
                            <td className="px-4 py-3 text-right">{transaction.value}</td>
                            <td className="px-4 py-3 text-right">{transaction.date}</td>
                            <td className="px-4 py-3 text-right">
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                {transaction.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
