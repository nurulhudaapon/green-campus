"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";
type Section = {
  name: string;
  availableSeats: number;
  totalSeats: number;
};

type Course = {
  code: string;
  title: string;
  sections: Section[];
};

const courses: Course[] = [
  {
    code: "CSE 323",
    title: "Computer and Cyber Security",
    sections: [
      { name: "D1", availableSeats: 25, totalSeats: 30 },
      { name: "D2", availableSeats: 30, totalSeats: 30 },
      { name: "D3", availableSeats: 15, totalSeats: 30 },
    ],
  },
  {
    code: "CSE 311",
    title: "Computer Networking",
    sections: [
      { name: "D1", availableSeats: 20, totalSeats: 30 },
      { name: "D2", availableSeats: 28, totalSeats: 30 },
      { name: "D3", availableSeats: 10, totalSeats: 30 },
      { name: "D4", availableSeats: 30, totalSeats: 30 },
    ],
  },
  {
    code: "CSE 312",
    title: "Computer Networking Lab",
    sections: [
      { name: "D1", availableSeats: 15, totalSeats: 30 },
      { name: "D2", availableSeats: 22, totalSeats: 30 },
    ],
  },
  {
    code: "GED 401",
    title: "Financial and Managerial Accounting",
    sections: [
      { name: "D1", availableSeats: 30, totalSeats: 30 },
      { name: "D2", availableSeats: 25, totalSeats: 30 },
      { name: "D3", availableSeats: 20, totalSeats: 30 },
    ],
  },
  {
    code: "CSE 403",
    title: "Information System and Design",
    sections: [
      { name: "D1", availableSeats: 18, totalSeats: 30 },
      { name: "D2", availableSeats: 23, totalSeats: 30 },
    ],
  },
];

export default function PreRegistrationPage() {
  const [selectedSections, setSelectedSections] = useState<{
    [key: string]: string;
  }>({});

  const handleSectionSelect = (courseCode: string, sectionName: string) => {
    setSelectedSections((prev) => ({
      ...prev,
      [courseCode]: sectionName,
    }));
  };

  const getBackgroundColor = (availableSeats: number, totalSeats: number) => {
    const ratio = availableSeats / totalSeats;
    if (ratio > 0.7) return "bg-green-100";
    if (ratio > 0.3) return "bg-yellow-100";
    return "bg-red-100";
  };

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
            <div className="overflow-x-auto max-w-[68vw]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Sections</TableHead>
                    <TableHead>Selected</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.code}>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.title}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {course.sections.map((section) => (
                            <Button
                              key={section.name}
                              variant="outline"
                              size="sm"
                              className={`${getBackgroundColor(
                                section.availableSeats,
                                section.totalSeats,
                              )} hover:${getBackgroundColor(
                                section.availableSeats,
                                section.totalSeats,
                              )}`}
                              onClick={() =>
                                handleSectionSelect(course.code, section.name)
                              }
                            >
                              {section.name}
                              <Badge variant="secondary" className="ml-2">
                                {section.availableSeats}/{section.totalSeats}
                              </Badge>
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {selectedSections[course.code] ? (
                          <Badge>{selectedSections[course.code]}</Badge>
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
    </div>
  );
}
