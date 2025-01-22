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
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Users,
    Download,
    List,
    Table as TableIcon,
} from 'lucide-react'
import { getClassRoutine } from './action'
import { generateICSFile } from '@/lib/calendar'
import { Calendar } from '@/components/ui/calendar'

type ClassSchedule = {
    formalCode: string
    courseTitle: string
    section: string
    room: string
    day: string
    time: string
}

const normalizeDay = (day: string) => {
    const dayMap: { [key: string]: string } = {
        Mon: 'Monday',
        Tue: 'Tuesday',
        Wed: 'Wednesday',
        Thu: 'Thursday',
        Fri: 'Friday',
        Sat: 'Saturday',
        Sun: 'Sunday',
    }
    return dayMap[day] || day
}

const normalizeTime = (time: string) => {
    return time.replace(/\s+/g, '').replace(':', '')
}

const sortTimeSlots = (timeSlots: string[]) => {
    return timeSlots.sort((a, b) => {
        const getMinutes = (time: string) => {
            const [timeStr] = time.split(' - ')
            const [hours, minutes] = timeStr.split(':')
            let hour = parseInt(hours)
            const minute = parseInt(minutes)
            if (timeStr.includes('PM') && hour !== 12) {
                hour += 12
            }
            if (timeStr.includes('AM') && hour === 12) {
                hour = 0
            }
            return hour * 60 + minute
        }
        return getMinutes(a) - getMinutes(b)
    })
}

const sortedDayOrder = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]

const dayMap = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday',
}

function getTimeRange(timeSlot: string) {
    const [start, end] = timeSlot.split(' - ')
    return { start, end }
}

export default function ClassRoutinePage() {
    const [classSchedules, setClassRoutine] = useState<ClassSchedule[]>([])
    const [viewMode, setViewMode] = useState<'list' | 'schedule' | 'calendar'>(
        'list'
    )
    const [date, setDate] = useState<Date>(new Date())

    useEffect(() => {
        getClassRoutine().then((data) => {
            console.log('Fetched class schedules:', data)

            setClassRoutine(data)
        })
    }, [])

    const allDays = classSchedules.map((cls) => normalizeDay(cls.day))
    const days = [...new Set(allDays)]
    const allTimeSlots = classSchedules.map((cls) => cls.time)
    const timeSlots = [...new Set(allTimeSlots.map(getTimeRange).map(range => range.start))].map(onlyStarting => {
        const fullTimeSlot = allTimeSlots.find(time => getTimeRange(time).start === onlyStarting)
        return fullTimeSlot
    })
    console.log({ classSchedules })
    const getClassForTimeSlot = (day: string, timeSlot: string) => {
        const shortDay = Object.entries(dayMap).find(
            ([_, long]) => long === day
        )?.[0]

        function compareOnlyStartTime(a: string, b: string) {
            const { start: aStart } = getTimeRange(a)
            const { start: bStart } = getTimeRange(b)
            return aStart === bStart
        }
        return classSchedules.find(
            (cls) =>
                cls.day === shortDay &&
                compareOnlyStartTime(cls.time, timeSlot)
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

    const getClassesForDate = (date: Date) => {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
        const shortDay = Object.entries(dayMap).find(
            ([_, long]) => long === dayName
        )?.[0]
        return classSchedules.filter((cls) => cls.day === shortDay)
    }

    const sortedTimeSlots = sortTimeSlots(timeSlots.filter(Boolean) as string[])
    const sortedDays = sortedDayOrder.filter((day) => days.includes(day))

    return (
        <div className="container mx-auto  p-4">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold text-center lg:text-left">
                    Class Routine
                </h1>
                <div className="flex flex-col gap-2 lg:flex-row lg:space-x-2">
                    <Button
                        variant="outline"
                        onClick={handleDownloadCalendar}
                        className="w-full sm:w-auto"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download Calendar
                    </Button>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant={
                                viewMode === 'list' ? 'default' : 'outline'
                            }
                            onClick={() => setViewMode('list')}
                            className="flex-1 sm:flex-none"
                        >
                            <List className="mr-2 h-4 w-4" />
                            List
                        </Button>
                        <Button
                            variant={
                                viewMode === 'schedule' ? 'default' : 'outline'
                            }
                            onClick={() => setViewMode('schedule')}
                            className="flex-1 sm:flex-none"
                        >
                            <TableIcon className="mr-2 h-4 w-4" />
                            Schedule
                        </Button>
                        <Button
                            variant={
                                viewMode === 'calendar' ? 'default' : 'outline'
                            }
                            onClick={() => setViewMode('calendar')}
                            className="flex-1 sm:flex-none"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Calendar
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
                                        <CalendarIcon className="h-4 w-4" />
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
            ) : viewMode === 'schedule' ? (
                <div className="rounded-lg border bg-card">
                    <div className="overflow-x-auto w-full">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[150px]">
                                        Day / Time
                                    </TableHead>
                                    {sortedTimeSlots.map((timeSlot) => (
                                        <TableHead
                                            key={timeSlot}
                                            className="min-w-[200px] text-center"
                                        >
                                            {timeSlot}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedDays.map((day) => (
                                    <TableRow key={day}>
                                        <TableCell className="font-medium bg-muted/50">
                                            {day}
                                        </TableCell>
                                        {sortedTimeSlots.map((timeSlot) => {
                                            const cls = getClassForTimeSlot(
                                                day,
                                                timeSlot
                                            )
                                            return (
                                                <TableCell
                                                    key={timeSlot}
                                                    className={`text-center ${cls ? 'p-0' : ''}`}
                                                >
                                                    {cls && (
                                                        <Card className="h-full border-0 shadow-none">
                                                            <CardContent className="p-3">
                                                                <div className="space-y-2">
                                                                    <div className="font-medium text-primary">
                                                                        {
                                                                            cls.courseTitle
                                                                        }
                                                                    </div>
                                                                    {cls.time !== timeSlot && (
                                                                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground text-center">
                                                                                <Clock className="h-3 w-3" />
                                                                                {cls.time}
                                                                            </div>
                                                                        )}
                                                                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                                                                        
                                                                        {cls.room && <div className="flex items-center gap-1">
                                                                            <MapPin className="h-3 w-3" />
                                                                                {
                                                                                    cls.room
                                                                                }
                                                                            </div>
                                                                        }
                                                                        {cls.section && (
                                                                            <div className="flex items-center gap-1">
                                                                                <Users className="h-3 w-3" />
                                                                            {
                                                                                cls.section
                                                                            }
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">
                        Classes on{' '}
                        {date.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </h2>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3 flex items-start justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(date) => date && setDate(date)}
                                className="rounded-md border"
                            />
                        </div>
                        <div className="md:w-2/3">
                            <div className="grid gap-4">
                                {getClassesForDate(date).map((cls, index) => (
                                    <Card key={index}>
                                        <CardHeader>
                                            <CardTitle className="text-start md:text-center">
                                                {cls.courseTitle}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 flex flex-col gap-2 md:flex-row md:space-y-0 md:justify-center">
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
                                {getClassesForDate(date).length === 0 && (
                                    <p className="text-muted-foreground">
                                        No classes scheduled for this day.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
