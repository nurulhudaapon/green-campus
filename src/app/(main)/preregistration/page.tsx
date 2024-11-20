'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Info } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getCourses } from './action'
import SectionsCell from './component'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
export default function PreRegistrationPage() {
    const [selectedSections, setSelectedSections] = useState<{
        [key: string]: string
    }>({})
    const [confirmationData, setConfirmationData] = useState<{
        courseCode: string
        sectionName: string
        action: 'select' | 'cancel'
    } | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedCourses, setExpandedCourses] = useState<string[]>([])

    const coursesQuery = useQuery({
        queryKey: ['courses'],
        queryFn: () => getCourses(),
    })

    // Initial mount
    useEffect(() => {
        const existingSearch =
            typeof localStorage !== 'undefined'
                ? localStorage.getItem('preregistration-search')
                : ''
        if (existingSearch) {
            setSearchQuery(existingSearch)
            handleSearchChange(existingSearch)
        }
    }, [])

    useEffect(() => {
        if (coursesQuery.data) {
            setSelectedSections(
                coursesQuery.data.reduce(
                    (acc, course) => ({
                        ...acc,
                        [course.formalCode]: course.sectionName,
                    }),
                    {}
                )
            )
        }
    }, [coursesQuery.data])

    if (coursesQuery.isLoading) {
        return (
            <div className="container mx-auto max-w-7xl p-4">
                Loading courses...
            </div>
        )
    }

    if (coursesQuery.error) {
        return (
            <div className="container mx-auto max-w-7xl p-4">
                Error loading courses: {coursesQuery.error.message}
            </div>
        )
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
        coursesQuery.refetch()
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
            coursesQuery.refetch()
            setConfirmationData(null)
        }
    }

    const handleCancelSelection = (courseCode: string) => {
        setConfirmationData({
            courseCode,
            sectionName: selectedSections[courseCode],
            action: 'cancel',
        })
        coursesQuery.refetch()
    }

    // Parse search query into array of course codes
    const searchedCourses = searchQuery
        .split(',')
        .map((code) => code.trim().toUpperCase())
        .filter((code) => code.length > 0)

    // Filter and sort courses based on search
    const processedCourses = coursesQuery.data?.slice() || []
    processedCourses.sort((a, b) => {
        const aMatches = searchedCourses.includes(a.formalCode)
        const bMatches = searchedCourses.includes(b.formalCode)
        if (aMatches && !bMatches) return -1
        if (!aMatches && bMatches) return 1
        return 0
    })

    const toggleCourseExpansion = (courseCode: string) => {
        setExpandedCourses((prev) =>
            prev.some((code) => matchCourseCode(code, courseCode))
                ? prev.filter((code) => !matchCourseCode(code, courseCode))
                : [...prev, courseCode]
        )
    }

    function handleSearchChange(value: string) {
        setSearchQuery(value)
        localStorage.setItem('preregistration-search', value)
        // Auto-expand searched courses
        const searcQueries = value
            .split(',')
            .map((code) => code.trim().toUpperCase())
            .filter((code) => code.length > 0)

        // Fuzzy search using matchCourse...
        const newCourses = processedCourses
            .filter((course) =>
                searcQueries.some((query) =>
                    matchCourseCode(course.formalCode, query)
                )
            )
            .map((course) => course.formalCode)
        setExpandedCourses(newCourses)
    }

    function matchCourseCode(code: string = '', query: string = '') {
        console.log({ code, query })
        // Exact Match
        if (code === query) return true

        // Lowercase Match
        if (code.toLowerCase() === query.toLowerCase()) return true

        // Only Course Code Match
        // Replace every but char and digit
        const courseCode = code.split('-')[0]?.replace(/[^a-zA-Z0-9]/g, '')
        const queryCode = query?.replace(/[^a-zA-Z0-9]/g, '')
        if (courseCode?.toLowerCase() === queryCode?.toLowerCase()) return true

        return false
    }

    return (
        <div className="container mx-auto max-w-7xl p-2">
            <div className="flex items-center gap-2 mb-2">
                <h5 className="flex items-center gap-1 text-xs text-gray-500">
                    <Info className="h-3 w-3" />
                    Dummy Data - Under Development
                </h5>
                <h1 className="text-xl font-bold">Pre-Registration</h1>
            </div>
            <div className="w-full mb-2">
                <Input
                    placeholder="Search courses (e.g. CSE101, CSE102)"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="text-sm"
                />
            </div>
            <Card className="shadow-sm">
                <CardHeader className="py-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                            Available Courses
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-2">
                    <ScrollArea className="h-[calc(100vh-160px)]">
                        <div className="space-y-4">
                            {processedCourses.map((course) => {
                                const isExpanded =
                                    expandedCourses.includes(
                                        course.formalCode
                                    ) ||
                                    searchedCourses.includes(course.formalCode)
                                const isSearchMatch = searchedCourses.includes(
                                    course.formalCode
                                )

                                return (
                                    <div
                                        key={course.courseID}
                                        className={`border rounded-lg p-3 transition-colors duration-200
                                            ${isSearchMatch ? 'border-primary' : 'border-border'}
                                        `}
                                    >
                                        <div
                                            className="flex items-start justify-between mb-2 cursor-pointer"
                                            onClick={() =>
                                                toggleCourseExpansion(
                                                    course.formalCode
                                                )
                                            }
                                        >
                                            <div>
                                                <h3 className="font-medium">
                                                    {course.formalCode}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {course.courseTitle}
                                                </p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {isExpanded ? '▼' : '▶'}
                                            </div>
                                        </div>
                                        {isExpanded && (
                                            <SectionsCell
                                                course={course}
                                                selectedSections={
                                                    selectedSections
                                                }
                                                onSectionSelect={
                                                    handleSectionSelect
                                                }
                                                onCancelSelection={
                                                    handleCancelSelection
                                                }
                                            />
                                        )}
                                    </div>
                                )
                            })}
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
