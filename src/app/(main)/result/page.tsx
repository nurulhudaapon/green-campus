'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getResult, ResultData } from './action'

export default function ResultHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<ResultData | null>({
    semesters: [],
    courses: [],
  });

  useEffect(() => {
    getResult().then(result => {
      if (result && 'error' in result) {
        console.error(result.error);
      } else {
        setResults(result);
      }
    });
  }, []);

  const filteredCourses = results?.courses?.filter(course =>
    Object.values(course).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) ?? [];

  return (
    <div className="container mx-auto max-w-7xl p-4">
      <h1 className="mb-6 text-3xl font-bold">Result History</h1>

      <Tabs defaultValue="gpa" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gpa">GPA Summary</TabsTrigger>
          <TabsTrigger value="courses">Course Results</TabsTrigger>
        </TabsList>
        <TabsContent value="gpa">
          <Card>
            <CardHeader>
              <CardTitle>Trimester wise GPA and CGPA</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SL.</TableHead>
                    <TableHead>Trimester</TableHead>
                    <TableHead>Credit(Probation)</TableHead>
                    <TableHead>Term GPA(Probation)</TableHead>
                    <TableHead>CGPA(Probation)</TableHead>
                    <TableHead>Credit(Transcript)</TableHead>
                    <TableHead>GPA(Transcript)</TableHead>
                    <TableHead>CGPA(Transcript)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results?.semesters?.map((semester) => (
                    <TableRow key={semester.sl}>
                      <TableCell>{semester.sl}</TableCell>
                      <TableCell>{semester.trimester}</TableCell>
                      <TableCell>{semester.creditProbation.toFixed(2)}</TableCell>
                      <TableCell>{semester.termGPAProbation.toFixed(2)}</TableCell>
                      <TableCell>{semester.cgpaProbation.toFixed(2)}</TableCell>
                      <TableCell>{semester.creditTranscript.toFixed(2)}</TableCell>
                      <TableCell>{semester.gpaTranscript.toFixed(2)}</TableCell>
                      <TableCell>{semester.cgpaTranscript.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semester/Trimester</TableHead>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Credit</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Point</TableHead>
                    <TableHead>Course Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell>{course.semester}</TableCell>
                      <TableCell>{course.courseCode}</TableCell>
                      <TableCell>{course.courseTitle}</TableCell>
                      <TableCell>{course.credit}</TableCell>
                      <TableCell>{course.grade}</TableCell>
                      <TableCell>{course.point.toFixed(2)}</TableCell>
                      <TableCell>{course.courseStatus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}