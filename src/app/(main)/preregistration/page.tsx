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
import { useQuery } from '@tanstack/react-query'
import { getCourses, getSections } from './action'

interface Course {
    courseID: number
    formalCode: string
    courseTitle: string
}

interface Section {
    acaCal_SectionID: number
    sectionName: string
    capacity: number
    occupied: number
}

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

    const coursesQuery = useQuery<Course[]>({ queryKey: ['courses'], queryFn: () => getCourses() })
    const sectionsQuery = useQuery<Section[]>({ 
        queryKey: ['sections'], 
        queryFn: () => getSections(coursesQuery.data?.[0] ?? {} as Course) 
    })

    if (coursesQuery.isLoading) {
        return <div className="container mx-auto max-w-7xl p-4">Loading courses...</div>
    }

    if (coursesQuery.error) {
        return <div className="container mx-auto max-w-7xl p-4">Error loading courses: {coursesQuery.error.message}</div>
    }

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
                                    {coursesQuery.data?.map((course) => (
                                        <TableRow key={course.courseID}>
                                            <TableCell>{course.formalCode}</TableCell>
                                            <TableCell>{course.courseTitle}</TableCell>
                                            <TableCell>
                                                {sectionsQuery.isLoading ? (
                                                    <div>Loading sections...</div>
                                                ) : sectionsQuery.error ? (
                                                    <div>Error loading sections: {sectionsQuery.error.message}</div>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {sectionsQuery.data?.filter(section => 
                                                            section.acaCal_SectionID === course.courseID
                                                        ).map((section) => (
                                                            <Button
                                                                key={section.acaCal_SectionID}
                                                                variant={
                                                                    selectedSections[course.formalCode] === section.sectionName
                                                                        ? 'default'
                                                                        : 'outline'
                                                                }
                                                                size="sm"
                                                                className={`
                                                                    ${
                                                                        selectedSections[course.formalCode] === section.sectionName
                                                                            ? 'bg-primary text-primary-foreground'
                                                                            : getBackgroundColor(
                                                                                  section.capacity - section.occupied,
                                                                                  section.capacity
                                                                              )
                                                                    }
                                                                    ${
                                                                        hoveredSection?.courseCode === course.formalCode &&
                                                                        hoveredSection?.sectionName === section.sectionName
                                                                            ? 'bg-primary text-primary-foreground'
                                                                            : ''
                                                                    }
                                                                    transition-colors duration-200
                                                                `}
                                                                onClick={() =>
                                                                    handleSectionSelect(course.formalCode, section.sectionName)
                                                                }
                                                                onMouseEnter={() =>
                                                                    setHoveredSection({
                                                                        courseCode: course.formalCode,
                                                                        sectionName: section.sectionName,
                                                                    })
                                                                }
                                                                onMouseLeave={() => setHoveredSection(null)}
                                                            >
                                                                {hoveredSection?.courseCode === course.formalCode &&
                                                                hoveredSection?.sectionName === section.sectionName ? (
                                                                    <Check className="mr-1 h-4 w-4" />
                                                                ) : (
                                                                    section.sectionName
                                                                )}
                                                                <Badge variant="secondary" className="ml-2">
                                                                    {section.capacity - section.occupied}/{section.capacity}
                                                                </Badge>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {selectedSections[course.formalCode] ? (
                                                    <div className="flex items-center gap-2">
                                                        <Badge>
                                                            {selectedSections[course.formalCode]}
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleCancelSelection(course.formalCode)
                                                            }
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">None</span>
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
