'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CreditCard, Calendar, Search } from 'lucide-react'

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

  const billingData = {
    totalFee: 418100,
    totalBill: 227990,
    totalPaid: 228190,
    balance: -200,
    installments: [
      { number: '1st Installment', dueDate: '19/08/2024', amount: 7500.00, payable: 0.00, lateFee: 0.00 },
      { number: '2nd Installment', dueDate: '09/09/2024', amount: 8200.00, payable: 0.00, lateFee: 0.00 },
      { number: '3rd Installment', dueDate: '15/10/2024', amount: 6060.00, payable: 0.00, lateFee: 0.00 },
      { number: '4th Installment', dueDate: '10/12/2024', amount: 6060.00, payable: -200.00, lateFee: 0.00 },
    ],
    transactions: [
      { slNo: 1, feeType: 'Student Payment', courseCode: '', credit: '', amount: '', discount: '', payment: 1550, trimesterName: '', date: '17/11/2024', remark: '' },
      { slNo: 2, feeType: 'Mid Term Improvement Exam Fee', courseCode: 'CSE 323', credit: 3, amount: 1500, discount: '', payment: '', trimesterName: 'Fall 2024', date: '15/11/2024', remark: 'Exam Fee' },
      { slNo: 3, feeType: 'Student Payment', courseCode: '', credit: '', amount: '', discount: '', payment: 10000, trimesterName: '', date: '11/10/2024', remark: '' },
      { slNo: 4, feeType: '10% Special Tuition', courseCode: '', credit: '', amount: '', discount: -5320, payment: '', trimesterName: 'Fall 2024', date: '03/10/2024', remark: '10% Special Waiver' },
      { slNo: 5, feeType: 'Tuition Fees', courseCode: 'CSE 312-CSE(181)', credit: 1.5, amount: 4200, discount: '', payment: '', trimesterName: 'Fall 2024', date: '21/08/2024', remark: '' },
    ]
  }

  const filteredTransactions = billingData.transactions.filter(transaction => 
    Object.values(transaction).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="mb-6 text-3xl font-bold">Billing History (Dummy Data)</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fee</CardTitle>
            <TakaIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{billingData.totalFee.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bill</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.totalBill.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <TakaIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{billingData.totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {billingData.balance < 0 ? 'Advance Payment' : 'Due'}
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
              {billingData.installments.map((installment, index) => (
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