'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Calendar, Search } from 'lucide-react'
import { BillingHistory, getBilling } from './action'
import { useQuery } from '@tanstack/react-query'

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
        <text x="6" y="18" fontSize="16">
            ৳
        </text>
    </svg>
)

export default function BillingPage() {
    const [searchTerm, setSearchTerm] = useState('')

    const billingQuery = useQuery({
        queryKey: ['billing'],
        queryFn: () => getBilling(),
        initialData: {
            installments: [],
            records: [],
            summary: {
                totalFee: 0,
                totalBill: 0,
                totalPaid: 0,
                balance: 0,
                totalDiscount: 0,
            },
        },
    })

    const billingData = billingQuery.data as BillingHistory

    if (billingQuery.isError) {
        return <div>{billingQuery.error.message}</div>
    }
    if (billingQuery.isLoading) {
        return <div>Loading...</div>
    }

    if (!billingData) {
        return <div>No data</div>
    }

    const filteredTransactions =
        billingData?.records.filter((transaction) =>
            Object.values(transaction).some((value) =>
                value
                    ?.toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        ) ?? []

    const getBadgeColor = (feeType: string) => {
        switch (feeType.toLowerCase()) {
            case 'tuition':
                return 'bg-blue-500'
            case 'admission':
                return 'bg-green-500'
            case 'library':
                return 'bg-yellow-500'
            case 'exam':
                return 'bg-red-500'
            default:
                return 'bg-gray-500'
        }
    }

    const getAmountColor = (amount: number | string) => {
        if (typeof amount === 'string') {
            amount = parseFloat(amount)
        }
        return amount < 0 ? 'text-green-500' : 'text-black-500'
    }

    return (
        <div className="container mx-auto max-w-7xl p-4">
            <h1 className="mb-6 text-3xl font-bold">Billing History</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Fee
                        </CardTitle>
                        <TakaIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ৳{billingData?.summary.totalFee.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Bill
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ৳{billingData?.summary.totalBill.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Paid
                        </CardTitle>
                        <TakaIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ৳{billingData?.summary.totalPaid.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Balance
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ৳{billingData?.summary.balance.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {billingData?.summary.balance &&
                            billingData.summary.balance < 0
                                ? 'Advance Payment'
                                : 'Due'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Installment Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto max-w-[65vw] md:max-w-[85vw] lg:md:max-w-[65vw]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="whitespace-nowrap">
                                        Installment <br /> Number
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap">
                                        Due Date
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap">
                                        Amount
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap">
                                        Payable
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap">
                                        Late Fee
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {billingData?.installments.map(
                                    (installment, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {installment.number
                                                    .split(' ')
                                                    .at(0)}
                                            </TableCell>
                                            <TableCell>
                                                {installment.dueDate}
                                            </TableCell>
                                            <TableCell>
                                                ৳{installment.amount.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                ৳
                                                {installment.payable.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                ৳
                                                {installment.lateFee.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>
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
                    <div className="overflow-x-auto max-w-[65vw] md:max-w-[85vw] lg:md:max-w-[65vw]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="whitespace-nowrap">
                                        SL <br />
                                        No.
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap">
                                        Fee Type
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap">
                                        Amount
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap">
                                        Date
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap">
                                        Details
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.map((transaction) => (
                                    <TableRow key={transaction.slNo}>
                                        <TableCell>
                                            {transaction.slNo}
                                        </TableCell>
                                        <TableCell>
                                            {transaction.feeType}
                                        </TableCell>
                                        <TableCell
                                            className={getAmountColor(
                                                transaction.amount ||
                                                    -transaction.payment ||
                                                    transaction.discount ||
                                                    0
                                            )}
                                        >
                                            ৳
                                            {transaction.amount ||
                                                -transaction.payment ||
                                                transaction.discount ||
                                                0}
                                        </TableCell>
                                        <TableCell>
                                            {transaction.date}
                                        </TableCell>
                                        <TableCell className="flex items-center justify-center lg:justify-start lg:xitems-start">
                                            <div className="flex flex-col gap-2 items-center justify-center lg:flex-row lg:flex-wrap lg:justify-start lg:items-start ">
                                                {transaction.courseCode && (
                                                    <Badge
                                                        variant="outline"
                                                        className="mr-1 text-center bg-purple-100"
                                                    >
                                                        {transaction.courseCode}
                                                    </Badge>
                                                )}
                                                {transaction.trimesterName && (
                                                    <Badge
                                                        variant="outline"
                                                        className="mr-1 text-center bg-orange-100"
                                                    >
                                                        {
                                                            transaction.trimesterName
                                                        }
                                                    </Badge>
                                                )}
                                                {transaction.credit && (
                                                    <Badge
                                                        variant="outline"
                                                        className="mr-1 text-center bg-blue-100"
                                                    >
                                                        {transaction.credit}{' '}
                                                        credits
                                                    </Badge>
                                                )}
                                                {transaction.discount && (
                                                    <Badge
                                                        variant="outline"
                                                        className="mr-1 text-center bg-green-100"
                                                    >
                                                        {transaction.credit}{' '}
                                                        Discounts
                                                    </Badge>
                                                )}
                                                {transaction.payment && (
                                                    <Badge
                                                        variant="outline"
                                                        className="mr-1 text-center bg-green-100"
                                                    >
                                                        {transaction.credit}{' '}
                                                        Payments
                                                    </Badge>
                                                )}
                                                {transaction.remark && (
                                                    <Badge
                                                        variant="outline"
                                                        className="mr-1 text-center bg-yellow-100"
                                                    >
                                                        {transaction.remark}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
