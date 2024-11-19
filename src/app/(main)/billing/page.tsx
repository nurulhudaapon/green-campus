'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CreditCard, Calendar, Search } from 'lucide-react'
import { BillingHistory, getBilling } from './action'

const TakaIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <text x="6" y="18" fontSize="16">৳</text>
  </svg>
)

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [billingData, setBillingData] = useState<BillingHistory | null>({
    installments: [],
    records: [],
    summary: {
      totalFee: 0,
      totalBill: 0,
      totalPaid: 0,
      balance: 0,
      totalDiscount: 0
    }
  });

  useEffect(() => {
    getBilling().then(data => {
      console.log(data);
      if (data && 'error' in data) {
        console.error(data.error);
      } else {
        setBillingData(data);
      }
    });
  }, []);

  const filteredTransactions = billingData?.records.filter(transaction => 
    Object.values(transaction).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) ?? [];

  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="mb-6 text-3xl font-bold">Billing History</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fee</CardTitle>
            <TakaIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{billingData?.summary.totalFee.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bill</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{billingData?.summary.totalBill.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <TakaIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{billingData?.summary.totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{billingData?.summary.balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {billingData?.summary.balance && billingData.summary.balance < 0 ? 'Advance Payment' : 'Due'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Installment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Installment Number</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payable</TableHead>
                <TableHead>Late Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingData?.installments.map((installment, index) => (
                <TableRow key={index}>
                  <TableCell>{installment.number}</TableCell>
                  <TableCell>{installment.dueDate}</TableCell>
                  <TableCell>৳{installment.amount.toFixed(2)}</TableCell>
                  <TableCell>৳{installment.payable.toFixed(2)}</TableCell>
                  <TableCell>৳{installment.lateFee.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SL No.</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Course Code</TableHead>
                <TableHead>Credit</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Trimester Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.slNo}>
                  <TableCell>{transaction.slNo}</TableCell>
                  <TableCell>{transaction.feeType}</TableCell>
                  <TableCell>{transaction.courseCode}</TableCell>
                  <TableCell>{transaction.credit}</TableCell>
                  <TableCell>{transaction.amount ? `৳${transaction.amount}` : ''}</TableCell>
                  <TableCell>{transaction.discount ? `৳${transaction.discount}` : ''}</TableCell>
                  <TableCell>{transaction.payment ? `৳${transaction.payment}` : ''}</TableCell>
                  <TableCell>{transaction.trimesterName}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.remark}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button>
          <Calendar className="mr-2 h-4 w-4" /> Pay Next Installment
        </Button>
      </div>
    </div>
  )
}