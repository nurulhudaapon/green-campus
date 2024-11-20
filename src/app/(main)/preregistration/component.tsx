'use client'

import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Course, getSections, registerSection, Section } from './action'

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
    onCancelSelection,
}: SectionsCellProps) {
    const [hoveredSection, setHoveredSection] = useState<string | null>(null)

    const sectionsQuery = useQuery({
        queryKey: ['sections', course.courseID],
        queryFn: () => getSections(course),
    })

    const sectionRegistrationMutation = useMutation({
        mutationFn: async ({
            section,
            course,
        }: {
            section: Section
            course: Course
        }) => {
            const res = await registerSection(section, course)
            if (res) return true
            else
                throw new Error(
                    'Failed to register section, please reload and retry'
                )
        },
        onError: (error) => {
            alert(error.message)
            // TODO: Revert the selection
        },
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

    const groupedSections = sectionsQuery.data?.reduce(
        (acc, section) => {
            const splittedSectionName = section.sectionName.split('_')
            const isSingularBatch = splittedSectionName.length === 1
            const batchId = isSingularBatch ? '' : splittedSectionName[0]
            return {
                ...acc,
                [batchId]: [...(acc[batchId] || []), section],
            }
        },
        {} as Record<string, typeof sectionsQuery.data>
    )

    function handleSectionSelect(course: Course, section: Section) {
        onSectionSelect(course.formalCode, section.sectionName)

        sectionRegistrationMutation.mutate({ section, course })
    }

    return (
        <div className="flex flex-wrap gap-1.5">
            {Object.entries(groupedSections ?? {}).map(
                ([batchId, sections]) => (
                    <div key={batchId} className="space-y-1">
                        {batchId && (
                            <span className="text-xs text-muted-foreground ml-1 outline outline-1 outline-muted-foreground rounded-md px-1">
                                Batch: {batchId}
                                <br />
                            </span>
                        )}
                        {sections
                            .sort((a, b) =>
                                a.sectionName.localeCompare(b.sectionName)
                            )
                            .map((section) => {
                                const isSelected =
                                    selectedSections[course.formalCode] ===
                                        section.sectionName ||
                                    course.sectionName === section.sectionName
                                const isHovered =
                                    hoveredSection === section.sectionName
                                const isDropped =
                                    section.sectionName.includes('(DROPPED)')
                                const isFull =
                                    section.capacity - section.occupied === 0 &&
                                    !isSelected

                                return (
                                    <Button
                                        key={section.acaCal_SectionID}
                                        disabled={isDropped || isFull}
                                        variant={
                                            isSelected ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        className={`
                            h-6 px-2 text-xs mx-0.5
                            ${
                                isSelected
                                    ? 'bg-primary text-primary-foreground'
                                    : getBackgroundColor(
                                          section.capacity - section.occupied,
                                          section.capacity
                                      )
                            }
                            ${sectionRegistrationMutation.isPending ? 'opacity-50' : ''}
                            transition-colors duration-200
                        `}
                                        onClick={() => {
                                            if (isSelected && isHovered) {
                                                onCancelSelection(
                                                    course.formalCode
                                                )
                                            } else {
                                                handleSectionSelect(
                                                    course,
                                                    section
                                                )
                                            }
                                        }}
                                        onMouseEnter={() =>
                                            setHoveredSection(
                                                section.sectionName
                                            )
                                        }
                                        onMouseLeave={() =>
                                            setHoveredSection(null)
                                        }
                                    >
                                        {isSelected &&
                                        !sectionRegistrationMutation.isPending &&
                                        isHovered ? (
                                            <div className="flex items-center justify-center gap-1 w-[52px] text-center">
                                                Remove
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 w-[52px] justify-between">
                                                <span className="font-bold">
                                                    {formatSectionName(
                                                        section.sectionName
                                                    )}
                                                </span>
                                                <span className="opacity-60">
                                                    {section.capacity -
                                                        section.occupied}
                                                    /{section.capacity}
                                                </span>
                                            </div>
                                        )}
                                    </Button>
                                )
                            })}
                    </div>
                )
            )}
        </div>
    )
}

function formatSectionName(sectionName: string) {
    const [batch, section] = sectionName.split('_')
    return (section ?? batch)
        .replace('(DROPPED)', '')
        .replace('(MERGED)', '')
        .split(' ')[0]
        .trim()
}
