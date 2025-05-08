"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ArrowDownToLine,
  BarChart,
  Calendar,
  FileText,
  HelpCircle,
  Settings,
  Download,
  Wallet,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

// Empty data instead of mock data
const taxYears = ["2023", "2022", "2021", "2020"];

const mockReportData = {
  shortTermGains: "$0.00",
  longTermGains: "$0.00",
  totalIncome: "$0.00",
  taxableEvents: 0,
  incomeEvents: 0,
  taxLiability: "$0.00",
};

const taxForms = [
  {
    id: 1,
    name: "Capital Gains CSV",
    description: "A CSV of all of your capital gains/losses",
    icon: FileText,
    category: "capital-gains"
  },
  {
    id: 2,
    name: "IRS Form 8949",
    description: "Reports any disposals of capital assets (excluding futures/perpetuals)",
    icon: FileText,
    category: "irs"
  },
  {
    id: 3,
    name: "IRS Schedule D (Form 1040)",
    description: "Reports your capital gains/losses (goes with 8949)",
    icon: FileText,
    category: "irs"
  },
  {
    id: 4,
    name: "IRS Schedule 1 (Form 1040)",
    description: "Reports your crypto income",
    icon: FileText,
    category: "irs"
  },
  {
    id: 5,
    name: "Summary Report",
    description: "PDF including income, expenses, and capital gains for the year",
    icon: FileText,
    category: "summary"
  },
  {
    id: 6,
    name: "TurboTax 1099-B",
    description: "For import into TurboTax",
    icon: FileText,
    category: "tax-software"
  },
  {
    id: 7,
    name: "TurboTax 1099-B Aggregated",
    description: "For over 4,000 transactions in the year",
    icon: FileText,
    category: "tax-software"
  },
  {
    id: 8,
    name: "TurboTax Futures Report",
    description: "Separated futures trades for TurboTax",
    icon: FileText,
    category: "tax-software"
  },
  {
    id: 9,
    name: "TaxAct 1099-B",
    description: "For import into TaxAct (Windows only)",
    icon: FileText,
    category: "tax-software"
  },
  {
    id: 10,
    name: "Perpetuals/Futures Report",
    description: "Separated futures trades (taxed differently by jurisdiction)",
    icon: FileText,
    category: "detailed"
  },
  {
    id: 11,
    name: "Transaction History",
    description: "CSV of all transactions with sent/received transfers",
    icon: FileText,
    category: "detailed"
  },
  {
    id: 12,
    name: "Capital Gains (Breakdown by Asset)",
    description: "CSV with proceeds, basis, and gain/loss per asset",
    icon: FileText,
    category: "detailed"
  },
  {
    id: 13,
    name: "Transactions Per Asset",
    description: "XLSX file with separate sheets for trades for each asset",
    icon: FileText,
    category: "detailed"
  },
  {
    id: 14,
    name: "Income Report",
    description: "CSV of all transactions where you received income",
    icon: FileText,
    category: "detailed"
  },
  {
    id: 15,
    name: "Balance Report",
    description: "Report of calculated asset balances at year-end",
    icon: FileText,
    category: "detailed"
  },
];

export default function TaxReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2023");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Debug log to verify the component is being loaded
  useEffect(() => {
    console.log("Tax Reports page loaded");
    setMounted(true);
  }, []);

  // Debug report to check if component isn't rendering at all
  console.log("Tax Reports component rendering");

  // Handle errors in the client-side rendering
  if (typeof window !== 'undefined' && !mounted) {
    console.log("Awaiting mount on client");
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p>Loading Tax Reports...</p>
        </div>
      </Layout>
    );
  }

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);

    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
    }, 2000);
  };

  // More debug info
  console.log("Tax Reports component rendering content with year:", selectedYear);

  // Sample data for capital gains chart with empty values
  const capitalGainsData = [];

  // Empty placeholder for calculations that were previously used
  const totalCapitalGains = 0;
  const totalIncome = 0;
  const capitalGainsTotals = {
    shortTerm: 0,
    longTerm: 0
  };

  // Sample data for income chart
  const incomeData = [];

  // Calculate income totals (with fallbacks to avoid NaN)
  const incomeTotals = {
    trading: 0,
    interest: 0, 
    mining: 0,
    rewards: 0,
    other: 0
  };
  const safeCalculate = (value, total) => total === 0 ? 0 : (value / total) * 100;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Tax Reports</h1>
          <div className="flex items-center gap-2">
            <Tabs defaultValue={selectedYear} onValueChange={setSelectedYear}>
              <TabsList>
                <TabsTrigger value="2021">2021</TabsTrigger>
                <TabsTrigger value="2022">2022</TabsTrigger>
                <TabsTrigger value="2023">2023</TabsTrigger>
              </TabsList>
            </Tabs>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tax Settings</DialogTitle>
                  <DialogDescription>
                    Configure your tax preferences and calculation methods.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Calculation Method</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <Button variant="outline" className="justify-start">
                        FIFO (First In, First Out)
                      </Button>
                      <Button variant="outline" className="justify-start">
                        LIFO (Last In, First Out)
                      </Button>
                      <Button variant="outline" className="justify-start">
                        HIFO (Highest In, First Out)
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Tax Jurisdiction</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <Button variant="outline" className="justify-start">
                        United States
                      </Button>
                      <Button variant="outline" className="justify-start">
                        European Union
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Custom
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Short-Term Gains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockReportData.shortTermGains}</div>
              <p className="text-xs text-muted-foreground">
                No short-term gain data
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Long-Term Gains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockReportData.longTermGains}</div>
              <p className="text-xs text-muted-foreground">
                No long-term gain data
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Crypto Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockReportData.totalIncome}</div>
              <p className="text-xs text-muted-foreground">
                No income data available
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxable Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockReportData.taxableEvents}</div>
              <p className="text-xs text-muted-foreground">
                No taxable events
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Income Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockReportData.incomeEvents}</div>
              <p className="text-xs text-muted-foreground">
                No income events
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Est. Tax Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockReportData.taxLiability}</div>
              <p className="text-xs text-muted-foreground">
                No liability data
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="forms" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="forms">Tax Forms</TabsTrigger>
            <TabsTrigger value="summary">Tax Summary</TabsTrigger>
            <TabsTrigger value="history">Report History</TabsTrigger>
          </TabsList>
          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <CardTitle>Available Tax Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-4 flex flex-wrap justify-start">
                    <TabsTrigger value="all">All Reports</TabsTrigger>
                    <TabsTrigger value="irs">IRS Forms</TabsTrigger>
                    <TabsTrigger value="tax-software">Tax Software</TabsTrigger>
                    <TabsTrigger value="detailed">Detailed Reports</TabsTrigger>
                    <TabsTrigger value="capital-gains">Capital Gains</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                  </TabsList>
                  
                  {['all', 'irs', 'tax-software', 'detailed', 'capital-gains', 'summary'].map((category) => (
                    <TabsContent key={category} value={category}>
                      <div className="space-y-4">
                        {taxForms
                          .filter(form => category === 'all' || form.category === category)
                          .map((form) => (
                            <div
                              key={form.id}
                              className="flex items-center justify-between rounded-lg border border-border p-4"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                  <form.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium">{form.name}</h3>
                                  <p className="text-xs text-muted-foreground">
                                    {form.description}
                                  </p>
                                </div>
                              </div>
                              <Button size="sm">
                                <ArrowDownToLine className="mr-1 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="mt-6 rounded-lg border border-dashed border-border p-6 text-center">
                  <h3 className="text-lg font-medium">Generate Tax Report</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Generate your complete tax report package for {selectedYear}
                  </p>
                  <Button
                    className="mt-4"
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? (
                      <>Generating Report...</>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Complete Report
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Tax Summary for {selectedYear}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-muted p-4">
                  <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Short-term Capital Gains
                      </div>
                      <div className="text-lg font-bold">
                        {mockReportData.shortTermGains}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Long-term Capital Gains
                      </div>
                      <div className="text-lg font-bold">
                        {mockReportData.longTermGains}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Total Taxable Events
                      </div>
                      <div className="text-lg font-bold">
                        {mockReportData.taxableEvents}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Income Events
                      </div>
                      <div className="text-lg font-bold">
                        {mockReportData.incomeEvents}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Total Tax Liability</h3>
                  <div className="rounded-lg border border-border p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {mockReportData.taxLiability}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Estimated tax based on your activity in {selectedYear}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Download Tax Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Report History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">
                          2023 Tax Report Package
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Generated on Apr 1, 2024
                        </p>
                      </div>
                      <Button size="sm">
                        <ArrowDownToLine className="mr-1 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">
                          2022 Tax Report Package
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Generated on Mar 15, 2023
                        </p>
                      </div>
                      <Button size="sm">
                        <ArrowDownToLine className="mr-1 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">
                          2021 Tax Report Package
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Generated on Apr 5, 2022
                        </p>
                      </div>
                      <Button size="sm">
                        <ArrowDownToLine className="mr-1 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Capital Gains Section */}
        <Card>
          <CardHeader>
            <CardTitle>Capital Gains</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            {capitalGainsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={capitalGainsData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(var(--muted-foreground))"
                    strokeOpacity={0.6}
                  />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, '']}
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
                  <Legend />
                  <Bar dataKey="shortTerm" fill="hsl(var(--primary))" name="Short Term" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="longTerm" fill="hsl(var(--primary)/0.6)" name="Long Term" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No capital gains data</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Connect accounts or add transactions to see your capital gains breakdown.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Income Section */}
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No income data</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Connect accounts or add transactions to see your income breakdown.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
