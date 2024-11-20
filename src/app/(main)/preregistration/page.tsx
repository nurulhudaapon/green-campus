'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Info, X, Check } from 'lucide-react'

type Section = {
    name: string
    availableSeats: number
    totalSeats: number
}

type Course = {
    code: string
    title: string
    sections: Section[]
}

const courses: Course[] = [
    {
        code: 'CSE 323',
        title: 'Computer and Cyber Security',
        sections: [
            { name: 'D1', availableSeats: 25, totalSeats: 30 },
            { name: 'D2', availableSeats: 30, totalSeats: 30 },
            { name: 'D3', availableSeats: 15, totalSeats: 30 },
        ],
    },
    {
        code: 'CSE 311',
        title: 'Computer Networking',
        sections: [
            { name: 'D1', availableSeats: 20, totalSeats: 30 },
            { name: 'D2', availableSeats: 28, totalSeats: 30 },
            { name: 'D3', availableSeats: 10, totalSeats: 30 },
            { name: 'D4', availableSeats: 30, totalSeats: 30 },
        ],
    },
    {
        code: 'CSE 312',
        title: 'Computer Networking Lab',
        sections: [
            { name: 'D1', availableSeats: 15, totalSeats: 30 },
            { name: 'D2', availableSeats: 22, totalSeats: 30 },
        ],
    },
    {
        code: 'GED 401',
        title: 'Financial and Managerial Accounting',
        sections: [
            { name: 'D1', availableSeats: 30, totalSeats: 30 },
            { name: 'D2', availableSeats: 25, totalSeats: 30 },
            { name: 'D3', availableSeats: 20, totalSeats: 30 },
        ],
    },
    {
        code: 'CSE 403',
        title: 'Information System and Design',
        sections: [
            { name: 'D1', availableSeats: 18, totalSeats: 30 },
            { name: 'D2', availableSeats: 23, totalSeats: 30 },
        ],
    },
]

export default function PreRegistrationPage() {
    const [selectedSections, setSelectedSections] = useState<{
        [key: string]: string
    }>({})
    const [confirmationData, setConfirmationData] = useState<{
        courseCode: string
        sectionName: string
        action: 'select' | 'cancel'
    } | null>(null)
    const [hoveredSection, setHoveredSection] = useState<{
        courseCode: string
        sectionName: string
    } | null>(null)

    const handleSectionSelect = (courseCode: string, sectionName: string) => {
        if (selectedSections[courseCode] === sectionName) {
            return
        }
        if (selectedSections[courseCode]) {
            setConfirmationData({ courseCode, sectionName, action: 'select' })
        } else {
            setSelectedSections((prev) => ({
                ...prev,
                [courseCode]: sectionName,
            }))
        }
    }

    const handleConfirmChange = () => {
        if (confirmationData) {
            if (confirmationData.action === 'select') {
                setSelectedSections((prev) => ({
                    ...prev,
                    [confirmationData.courseCode]: confirmationData.sectionName,
                }))
            } else if (confirmationData.action === 'cancel') {
                setSelectedSections((prev) => {
                    const newState = { ...prev }
                    delete newState[confirmationData.courseCode]
                    return newState
                })
            }
            setConfirmationData(null)
        }
    }

    const handleCancelSelection = (courseCode: string) => {
        setConfirmationData({
            courseCode,
            sectionName: selectedSections[courseCode],
            action: 'cancel',
        })
    }

    const getBackgroundColor = (availableSeats: number, totalSeats: number) => {
        const ratio = availableSeats / totalSeats
        if (ratio > 0.7) return 'bg-green-100'
        if (ratio > 0.3) return 'bg-yellow-100'
        return 'bg-red-100'
    }

    return (
        <div className="container mx-auto max-w-7xl p-4">
            <h5 className="flex items-center gap-2 text-sm text-gray-500">
                <Info className="h-4 w-4" />
                Dummy Data - Under Development
            </h5>
            <h1 className="mb-6 text-3xl font-bold">Pre-Registration</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Available Courses</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px]">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[150px]">
                                            Course Code
                                        </TableHead>
                                        <TableHead className="w-[300px]">
                                            Course Title
                                        </TableHead>
                                        <TableHead>Sections</TableHead>
                                        <TableHead className="w-[150px]">
                                            Selected
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courses.map((course) => (
                                        <TableRow key={course.code}>
                                            <TableCell>{course.code}</TableCell>
                                            <TableCell>
                                                {course.title}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-2">
                                                    {course.sections.map(
                                                        (section) => (
                                                            <Button
                                                                key={
                                                                    section.name
                                                                }
                                                                variant={
                                                                    selectedSections[
                                                                        course
                                                                            .code
                                                                    ] ===
                                                                    section.name
                                                                        ? 'default'
                                                                        : 'outline'
                                                                }
                                                                size="sm"
                                                                className={`
                                                                ${
                                                                    selectedSections[
                                                                        course
                                                                            .code
                                                                    ] ===
                                                                    section.name
                                                                        ? 'bg-primary text-primary-foreground'
                                                                        : getBackgroundColor(
                                                                              section.availableSeats,
                                                                              section.totalSeats
                                                                          )
                                                                }
                                                                ${
                                                                    hoveredSection?.courseCode ===
                                                                        course.code &&
                                                                    hoveredSection?.sectionName ===
                                                                        section.name
                                                                        ? 'bg-primary text-primary-foreground'
                                                                        : ''
                                                                }
                                                                transition-colors duration-200
                                                            `}
                                                                onClick={() =>
                                                                    handleSectionSelect(
                                                                        course.code,
                                                                        section.name
                                                                    )
                                                                }
                                                                onMouseEnter={() =>
                                                                    setHoveredSection(
                                                                        {
                                                                            courseCode:
                                                                                course.code,
                                                                            sectionName:
                                                                                section.name,
                                                                        }
                                                                    )
                                                                }
                                                                onMouseLeave={() =>
                                                                    setHoveredSection(
                                                                        null
                                                                    )
                                                                }
                                                            >
                                                                {hoveredSection?.courseCode ===
                                                                    course.code &&
                                                                hoveredSection?.sectionName ===
                                                                    section.name ? (
                                                                    <Check className="mr-1 h-4 w-4" />
                                                                ) : (
                                                                    section.name
                                                                )}
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="ml-2"
                                                                >
                                                                    {
                                                                        section.availableSeats
                                                                    }
                                                                    /
                                                                    {
                                                                        section.totalSeats
                                                                    }
                                                                </Badge>
                                                            </Button>
                                                        )
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {selectedSections[
                                                    course.code
                                                ] ? (
                                                    <div className="flex items-center gap-2">
                                                        <Badge>
                                                            {
                                                                selectedSections[
                                                                    course.code
                                                                ]
                                                            }
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleCancelSelection(
                                                                    course.code
                                                                )
                                                            }
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        None
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Dialog
                open={!!confirmationData}
                onOpenChange={() => setConfirmationData(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {confirmationData?.action === 'select'
                                ? 'Confirm Section Selection'
                                : 'Confirm Cancellation'}
                        </DialogTitle>
                        <DialogDescription>
                            {confirmationData?.action === 'select'
                                ? `Are you sure you want to select section ${confirmationData?.sectionName} for ${confirmationData?.courseCode}?`
                                : `Are you sure you want to cancel your selection for ${confirmationData?.courseCode}?`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmationData(null)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmChange}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
