'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getAuthToken } from './action'

export default function LoginPage() {
  const [formActionState, formAction] = useActionState(getAuthToken, null)
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (formActionState?.credentialCookies) {
      router.push('/profile')
    } 

    if (formActionState?.error) {
      setError(formActionState.error)
    }

  }, [formActionState, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <Image
              src="https://studentportal.green.edu.bd/logo.png"
              alt="GUB Logo"
              width={80}
              height={80}
              className="h-20 w-20"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Login to GUB Portal</CardTitle>
          <CardDescription className="text-center">
            Enter your Student ID and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input 
                  id="student_id"
                  name="student_id"
                  placeholder="Enter your Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="mt-4 w-full">
              Login
            </Button>
          </form>
        </CardContent>
        {/* <CardFooter className="flex justify-center">
          <Button variant="link" className="text-sm text-muted-foreground">
            Forgot password?
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  )
}