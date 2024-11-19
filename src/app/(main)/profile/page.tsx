import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GraduationCap, User } from 'lucide-react'
import { getStudentInfo } from './action'
export default async function ProfilePage() {
    const studentInfo = await getStudentInfo()

    return (
        <div className="container mx-auto max-w-7xl p-4 overflow-x-hidden">
            <h1 className="mb-6 text-3xl font-bold">Student Profile</h1>
            <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                        Basic Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center space-x-4">
                            <User className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium leading-none">
                                    {studentInfo.studentID}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {studentInfo.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <GraduationCap className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium leading-none">
                                    {studentInfo.gender}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Marital Status: {studentInfo.matrialStatus}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="personal" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="personal">Personal </TabsTrigger>
                    <TabsTrigger value="academic">
                        Academic Information
                    </TabsTrigger>
                    <TabsTrigger value="contact">
                        Contact Information
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="personal">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input
                                        id="dob"
                                        value={new Date(
                                            studentInfo.dob
                                        ).toLocaleDateString()}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bloodGroup">
                                        Blood Group
                                    </Label>
                                    <Input
                                        id="bloodGroup"
                                        value={studentInfo.bloodGroup}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="religion">Religion</Label>
                                    <Input
                                        id="religion"
                                        value={studentInfo.religion}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nationality">
                                        Nationality
                                    </Label>
                                    <Input
                                        id="nationality"
                                        value={studentInfo.nationality}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="academic">
                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="fatherName">
                                        Father's Name
                                    </Label>
                                    <Input
                                        id="fatherName"
                                        value={studentInfo.fatherName}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="motherName">
                                        Mother's Name
                                    </Label>
                                    <Input
                                        id="motherName"
                                        value={studentInfo.motherName}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fatherProfession">
                                        Father's Profession
                                    </Label>
                                    <Input
                                        id="fatherProfession"
                                        value={studentInfo.fatherProfession}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="motherProfession">
                                        Mother's Profession
                                    </Label>
                                    <Input
                                        id="motherProfession"
                                        value={studentInfo.motherProfession}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={studentInfo.email}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={studentInfo.contactNumber}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="presentAddress">
                                        Present Address
                                    </Label>
                                    <Input
                                        id="presentAddress"
                                        value={studentInfo.presentAddress}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="permanentAddress">
                                        Permanent Address
                                    </Label>
                                    <Input
                                        id="permanentAddress"
                                        value={studentInfo.parmanentAddress}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* <div className="mt-6 flex justify-end">
        <Button onClick={() => setrue(!isEditing)}>
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div> */}
        </div>
    )
}
