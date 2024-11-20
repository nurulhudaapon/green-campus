'use client'

import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Course, getSections } from './action'

interface SectionsCellProps {
    course: Course
    selectedSections: { [key: string]: string }
    onSectionSelect: (courseCode: string, sectionName: string) => void
    onCancelSelection: (courseCode: string) => void
}

export default function SectionsCell({ 
    course, 
    selectedSections, 
    onSectionSelect,
    onCancelSelection 
}: SectionsCellProps) {
    const [hoveredSection, setHoveredSection] = useState<string | null>(null)

    const sectionsQuery = useQuery({
        queryKey: ['sections', course.courseID],
        queryFn: () => getSections(course)
    })

    const getBackgroundColor = (availableSeats: number, totalSeats: number) => {
        const ratio = availableSeats / totalSeats
        if (ratio > 0.7) return 'bg-green-100'
        if (ratio > 0.3) return 'bg-yellow-100'
        return 'bg-red-100'
    }

    if (sectionsQuery.isLoading) {
        return <div>Loading sections...</div>
    }

    if (sectionsQuery.error) {
        return <div>Error loading sections: {sectionsQuery.error.message}</div>
    }

    return (
        <div className="flex flex-wrap gap-1.5">
            {sectionsQuery.data?.map((section) => {
                const isSelected = selectedSections[course.formalCode] === section.sectionName
                const isHovered = hoveredSection === section.sectionName

                return (
                    <Button
                        key={section.acaCal_SectionID}
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        className={`
                            h-6 px-2 text-xs
                            ${isSelected ? 'bg-primary text-primary-foreground' : 
                                getBackgroundColor(
                                    section.capacity - section.occupied,
                                    section.capacity
                                )
                            }
                            transition-colors duration-200
                        `}
                        onClick={() => {
                            if (isSelected && isHovered) {
                                onCancelSelection(course.formalCode)
                            } else {
                                onSectionSelect(course.formalCode, section.sectionName)
                            }
                        }}
                        onMouseEnter={() => setHoveredSection(section.sectionName)}
                        onMouseLeave={() => setHoveredSection(null)}
                    >
                        {isSelected && isHovered ? (
                            <div className="flex items-center justify-center gap-1 w-[52px] text-center">
                                Remove
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 w-[52px] justify-between">
                                <span className='font-bold'>{section.sectionName}</span>
                                <span className="opacity-60">
                                    {section.capacity - section.occupied}/{section.capacity}
                                </span>
                            </div>
                        )}
                    </Button>
                )
            })}
        </div>
    )
} 