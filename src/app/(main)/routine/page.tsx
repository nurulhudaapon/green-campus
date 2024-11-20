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
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, Users, Download } from 'lucide-react'
import { getClassRoutine } from './action'
import { generateICSFile } from '@/lib/calendar'

type ClassSchedule = {
    formalCode: string
    courseTitle: string
    section: string
    room: string
    day: string
    time: string
}

export default function ClassRoutinePage() {
    const [classSchedules, setClassRoutine] = useState<ClassSchedule[]>([])
    const [viewMode, setViewMode] = useState<'list' | 'schedule'>('list')

    useEffect(() => {
        getClassRoutine().then(setClassRoutine)
    }, [])

    const allDays = classSchedules.map((cls) => cls.day)
    const days = [...new Set(allDays)]
    const allTimeSlots = classSchedules.map((cls) => cls.time)
    const timeSlots = [...new Set(allTimeSlots)]

    const getClassForTimeSlot = (day: string, timeSlot: string) => {
        return classSchedules.find(
            (cls) => cls.day === day && cls.time === timeSlot
        )
    }

    const handleDownloadCalendar = () => {
        const icsContent = generateICSFile(classSchedules)
        const blob = new Blob([icsContent], {
            type: 'text/calendar;charset=utf-8',
        })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.setAttribute('download', 'class-routine.ics')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="container mx-auto max-w-7xl p-4">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold">Class Routine</h1>
                <div className="flex flex-col gap-2 lg:flex-row lg:space-x-2">
                    <Button
                        variant="outline"
                        onClick={handleDownloadCalendar}
                        className="w-full sm:w-auto"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download Calendar
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant={
                                viewMode === 'list' ? 'default' : 'outline'
                            }
                            onClick={() => setViewMode('list')}
                            className="flex-1 sm:flex-none"
                        >
                            List View
                        </Button>
                        <Button
                            variant={
                                viewMode === 'schedule' ? 'default' : 'outline'
                            }
                            onClick={() => setViewMode('schedule')}
                            className="flex-1 sm:flex-none"
                        >
                            Schedule View
                        </Button>
                    </div>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {classSchedules.map((cls, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>{cls.courseTitle}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{cls.day}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{cls.time}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{cls.room}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4" />
                                        <span>{cls.section}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto max-w-[80vw] md:max-w-[60vw]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time / Day</TableHead>
                                {days.map((day) => (
                                    <TableHead key={day}>{day}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {timeSlots.map((timeSlot) => (
                                <TableRow key={timeSlot}>
                                    <TableCell className="font-medium">
                                        {timeSlot}
                                    </TableCell>
                                    {days.map((day) => {
                                        const cls = getClassForTimeSlot(
                                            day,
                                            timeSlot
                                        )
                                        return (
                                            <TableCell key={day}>
                                                {cls && (
                                                    <div className="space-y-1">
                                                        <div className="font-medium">
                                                            {cls.courseTitle}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {cls.room}
                                                        </div>
                                                    </div>
                                                )}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
