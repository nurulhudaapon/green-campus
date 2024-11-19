type ClassSchedule = {
  formalCode: string
  courseTitle: string
  section: string
  room: string
  day: string
  time: string
}

function getDayNumber(day: string): number {
  const days = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
  }
  return days[day as keyof typeof days] || 0
}

function parseTime(timeSlot: string): { start: string; end: string } {
  // Assuming time format is like "9:00 AM - 10:20 AM"
  const [start, end] = timeSlot.split(' - ')
  return { start, end }
}

export function generateICSFile(classes: ClassSchedule[]): string {
  const events = classes.map(cls => {
    const { start, end } = parseTime(cls.time)
    const dayNumber = getDayNumber(cls.day)
    
    // Generate event for the next occurrence of this weekday
    const now = new Date()
    const daysUntilNext = (dayNumber + 7 - now.getDay()) % 7
    const nextOccurrence = new Date(now.getTime() + daysUntilNext * 24 * 60 * 60 * 1000)
    
    // Format date to YYYYMMDD
    const dateStr = nextOccurrence.toISOString().split('T')[0].replace(/-/g, '')
    
    return `BEGIN:VEVENT
SUMMARY:${cls.courseTitle}
DESCRIPTION:Course: ${cls.formalCode}\\nSection: ${cls.section}
LOCATION:${cls.room}
DTSTART;TZID=Asia/Dhaka:${dateStr}T${start.replace(/[^\d]/g, '')}00
DTEND;TZID=Asia/Dhaka:${dateStr}T${end.replace(/[^\d]/g, '')}00
RRULE:FREQ=WEEKLY
END:VEVENT`
  }).join('\n')

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
CALSCALE:GREGORIAN
${events}
END:VCALENDAR`
} 