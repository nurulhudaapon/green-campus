type ClassSchedule = {
    formalCode: string
    courseTitle: string
    section: string
    room: string
    day: string
    time: string
}

function getDayNumber(day: string): number {
    const dayMap = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
    }
    return dayMap[day as keyof typeof dayMap] || 0
}

function parseTime(timeSlot: string): { start: string; end: string } {
    const [startTime, endTime] = timeSlot.split(' - ')
    
    function convertTime(time: string): string {
        // Remove any spaces and :
        time = time.replace(/\s+/g, '').replace(':', '')
        
        let hours = parseInt(time.substring(0, 2))
        const minutes = time.substring(2, 4)
        const isPM = time.includes('PM')
        
        // Convert to 24-hour format
        if (isPM && hours !== 12) {
            hours += 12
        }
        if (!isPM && hours === 12) {
            hours = 0
        }
        
        // Pad with zeros
        return `${hours.toString().padStart(2, '0')}${minutes}`
    }
    
    return {
        start: convertTime(startTime),
        end: convertTime(endTime)
    }
}

export function generateICSFile(classes: ClassSchedule[]): string {
    const events = classes
        .map((cls) => {
            const { start, end } = parseTime(cls.time)
            const dayNumber = getDayNumber(cls.day)

            // Generate event for the next occurrence of this weekday
            const now = new Date()
            const daysUntilNext = (dayNumber + 7 - now.getDay()) % 7
            const nextOccurrence = new Date(
                now.getTime() + daysUntilNext * 24 * 60 * 60 * 1000
            )

            // Format date to YYYYMMDD
            const dateStr = nextOccurrence
                .toISOString()
                .split('T')[0]
                .replace(/-/g, '')

            // Clean up the description and location
            const description = `Course: ${cls.formalCode}\\nSection: ${cls.section}`.replace(/[^\w\s\\:]/g, '')
            const location = cls.room?.replace(/[^\w\s]/g, '') || 'TBA'

            return `BEGIN:VEVENT
SUMMARY:${cls.courseTitle}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART;TZID=Asia/Dhaka:${dateStr}T${start}00
DTEND;TZID=Asia/Dhaka:${dateStr}T${end}00
RRULE:FREQ=WEEKLY
END:VEVENT`
        })
        .join('\n')

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
CALSCALE:GREGORIAN
${events}
END:VCALENDAR`
}
