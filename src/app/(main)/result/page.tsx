'use client'

import { use, useEffect, useState } from 'react'
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
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    getClassRoutine,
    getCurrentCourses,
    getResult,
    ResultData,
    CurrentCourseData,
    ClassSchedule,
} from './action'
import { BookOpen, GraduationCap, Award, LineChart } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export default function ResultHistoryPage() {
    const [currentCourses, setCurrentCourses] = useState<CurrentCourseData[]>(
        []
    )
    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState<ResultData | null>({
        semesters: [],
        courses: [],
    })

    useEffect(() => {
        getResult().then((result) => {
            if (result && 'error' in result) {
                console.error(result.error)
            } else {
                setResults(result)
            }
        })
        getCurrentCourses()
            .then((courses) => {
                if (courses && 'error' in courses) {
                    console.error(courses.error)
                    return
                }

                return getClassRoutine().then((routineData) => {
                    const routineLookup = routineData.reduce(
                        (lookup: any, routine: ClassSchedule) => {
                            lookup[routine.formalCode] = routine
                            return lookup
                        },
                        {}
                    )
                    const newCurrentCourses = courses.map((course) => {
                        const matchingRoutine = routineLookup[course.courseCode]
                        if (matchingRoutine) {
                            return {
                                ...course,
                                courseTitle: matchingRoutine.courseTitle,
                            }
                        }
                        return course
                    })

                    setCurrentCourses(newCurrentCourses)
                })
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }, [])

    const filteredCourses =
        results?.courses?.filter((course) =>
            Object.values(course).some((value) =>
                value
                    ?.toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        ) ?? []

    // Calculate statistics
    const calculateStats = () => {
        if (!results?.courses)
            return {
                totalCredits: 0,
                totalCourses: 0,
                avgGPA: 0,
                currentCGPA: 0,
            }

        const totalCredits = results.courses.reduce(
            (sum, course) => sum + course.credit,
            0
        )
        const remainingCredits = 144 - totalCredits
        const totalCourses = results.courses.length
        const avgGPA =
            results.courses.reduce((sum, course) => sum + course.point, 0) /
            totalCourses
        const currentCGPA =
            results.semesters[results.semesters.length - 1]?.cgpaTranscript || 0
        const newSemeterTotalCredits = currentCourses.reduce(
            (sum, course) => sum + course.credit,
            0
        )
        const newTotalCredits = totalCredits + newSemeterTotalCredits

        const newCGPA =
            (currentCGPA * totalCredits + newSemeterTotalCredits * 4) /
            newTotalCredits
        const predictedGPA =
            currentCourses.reduce(
                (sum, course) => sum + course.credit * (course.point || 4),
                0
            ) / newSemeterTotalCredits
        const predictedCGPA =
            (currentCGPA * totalCredits +
                predictedGPA * newSemeterTotalCredits) /
            newTotalCredits

        return {
            totalCredits,
            remainingCredits,
            totalCourses,
            avgGPA,
            currentCGPA,
            newCGPA,
            predictedGPA,
            predictedCGPA,
        }
    }

    const stats = calculateStats()

    return (
        <div className="container mx-auto max-w-7xl p-4">
            <h1 className="mb-6 text-3xl font-bold">Result History</h1>

            {/* Add Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Credits
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalCredits}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                                Completed
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {stats.remainingCredits} remaining
                            </p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div
                                className="bg-primary h-1.5 rounded-full"
                                style={{
                                    width: `${(stats.totalCredits / 144) * 100}%`,
                                }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Out of 144 credits
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Current CGPA
                        </CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.currentCGPA.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Latest Transcript CGPA
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Courses
                        </CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalCourses}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Courses Completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Maximum Possible CGPA
                        </CardTitle>
                        <LineChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.newCGPA?.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            If you get 4.00 in running semester
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="gpa" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 rounded-lg p-1 bg-muted/20">
                    <TabsTrigger
                        value="gpa"
                        className="data-[state=active]:bg-background rounded-md transition-all"
                    >
                        GPA Summary
                    </TabsTrigger>
                    <TabsTrigger
                        value="courses"
                        className="data-[state=active]:bg-background rounded-md transition-all"
                    >
                        Course Results
                    </TabsTrigger>
                    <TabsTrigger
                        value="predictCGPA"
                        className="relative data-[state=active]:bg-background rounded-md transition-all"
                    >
                        Predict CGPA
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="gpa">
                    <Card>
                        <CardHeader>
                            <CardTitle>Trimester wise GPA and CGPA</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto max-w-[65vw] md:max-w-[85vw] lg:md:max-w-[65vw]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>SL.</TableHead>
                                            <TableHead>Trimester</TableHead>
                                            <TableHead>
                                                Credit(Probation)
                                            </TableHead>
                                            <TableHead>
                                                Term GPA(Probation)
                                            </TableHead>
                                            <TableHead>
                                                CGPA(Probation)
                                            </TableHead>
                                            <TableHead>
                                                Credit(Transcript)
                                            </TableHead>
                                            <TableHead>
                                                GPA(Transcript)
                                            </TableHead>
                                            <TableHead>
                                                CGPA(Transcript)
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {results?.semesters?.map((semester) => (
                                            <TableRow key={semester.sl}>
                                                <TableCell>
                                                    {semester.sl}
                                                </TableCell>
                                                <TableCell>
                                                    {semester.trimester}
                                                </TableCell>
                                                <TableCell>
                                                    {semester.creditProbation.toFixed(
                                                        2
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {semester.termGPAProbation.toFixed(
                                                        2
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {semester.cgpaProbation.toFixed(
                                                        2
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {semester.creditTranscript.toFixed(
                                                        2
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {semester.gpaTranscript.toFixed(
                                                        2
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {semester.cgpaTranscript.toFixed(
                                                        2
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="courses">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <Label htmlFor="search">Search Courses</Label>
                                <Input
                                    id="search"
                                    placeholder="Search by course code, title, etc."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <div className="overflow-x-auto max-w-[65vw] md:max-w-[85vw] lg:md:max-w-[65vw]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                Semester/Trimester
                                            </TableHead>
                                            <TableHead>Course Code</TableHead>
                                            <TableHead>Course Title</TableHead>
                                            <TableHead>Credit</TableHead>
                                            <TableHead>Grade</TableHead>
                                            <TableHead>Point</TableHead>
                                            <TableHead>Course Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCourses.map(
                                            (course, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {course.semester}
                                                    </TableCell>
                                                    <TableCell>
                                                        {course.courseCode}
                                                    </TableCell>
                                                    <TableCell>
                                                        {course.courseTitle}
                                                    </TableCell>
                                                    <TableCell>
                                                        {course.credit}
                                                    </TableCell>
                                                    <TableCell>
                                                        {course.grade}
                                                    </TableCell>
                                                    <TableCell>
                                                        {course.point.toFixed(
                                                            2
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {course.courseStatus}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="predictCGPA">
                    <Card>
                        <CardHeader>
                            <CardTitle>Predict CGPA</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="p-4 border rounded-lg">
                                        <div className="text-sm text-muted-foreground">
                                            Current CGPA
                                        </div>
                                        <div className="text-2xl font-bold">
                                            {stats.currentCGPA.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <div className="text-sm text-muted-foreground">
                                            Predited GPA
                                        </div>
                                        <div className="text-2xl font-bold">
                                            {stats.predictedGPA?.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <div className="text-sm text-muted-foreground">
                                            Predicted CGPA
                                        </div>
                                        <div className="text-2xl font-bold">
                                            {stats.predictedCGPA?.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 mt-6">
                                <div className="text-lg font-semibold">
                                    Running Semester Courses
                                </div>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Course Code
                                                </TableHead>
                                                <TableHead>
                                                    Course Title
                                                </TableHead>
                                                <TableHead>Credit</TableHead>
                                                <TableHead>Grade</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentCourses.map(
                                                (course, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {course.courseCode}
                                                        </TableCell>
                                                        <TableCell>
                                                            {course.courseTitle}
                                                        </TableCell>
                                                        <TableCell>
                                                            {course.credit}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select
                                                                defaultValue="4.00"
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    const newCourses =
                                                                        [
                                                                            ...currentCourses,
                                                                        ]
                                                                    newCourses[
                                                                        index
                                                                    ] = {
                                                                        ...course,
                                                                        grade: value,
                                                                        point: parseFloat(
                                                                            value
                                                                        ),
                                                                    }
                                                                    setCurrentCourses(
                                                                        newCourses
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-24">
                                                                    <SelectValue placeholder="Grade" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="4.00">
                                                                        A+
                                                                    </SelectItem>
                                                                    <SelectItem value="3.75">
                                                                        A
                                                                    </SelectItem>
                                                                    <SelectItem value="3.50">
                                                                        A-
                                                                    </SelectItem>
                                                                    <SelectItem value="3.25">
                                                                        B+
                                                                    </SelectItem>
                                                                    <SelectItem value="3.00">
                                                                        B
                                                                    </SelectItem>
                                                                    <SelectItem value="2.75">
                                                                        C+
                                                                    </SelectItem>
                                                                    <SelectItem value="2.50">
                                                                        C
                                                                    </SelectItem>
                                                                    <SelectItem value="2.00">
                                                                        D
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
