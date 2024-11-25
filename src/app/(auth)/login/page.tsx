'use client'

import { Suspense, useActionState, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getAuthToken } from './action'
import { logout } from '@/app/action'

export default function LoginPage() {
    const [formActionState, formAction, isPending] = useActionState(
        getAuthToken,
        null
    )
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
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center">
                        <Image
                            src="https://studentportal.green.edu.bd/logo.png"
                            alt="GUB Logo"
                            width={80}
                            height={80}
                            className="h-16 w-16 sm:h-20 sm:w-20"
                        />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-center">
                        Login to GUB Portal
                    </CardTitle>
                    <CardDescription className="text-center text-sm sm:text-base">
                        Redesigned UI/UX with existing server/database!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="studentId">Student ID</Label>
                                <Input
                                    id="student_id"
                                    name="student_id"
                                    placeholder="Enter your Student ID"
                                    value={studentId}
                                    onChange={(e) =>
                                        setStudentId(e.target.value)
                                    }
                                    required
                                    disabled={isPending}
                                    className="h-9 sm:h-10"
                                />
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    disabled={isPending}
                                    className="h-9 sm:h-10"
                                />
                            </div>
                        </div>
                        <Suspense>
                            <ErrorMessage message={error} />
                        </Suspense>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="mt-3 sm:mt-4 w-full h-9 sm:h-10"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

function ErrorMessage(props: { message: string }) {
    const [error, setError] = useState(props.message)
    const searchParams = useSearchParams()

    useEffect(() => {
        const message = searchParams.get('message')
        if (message) {
            setError(message)
        }
        if (message === 'Session expired') {
            logout().then(() => {
                console.log('Log out because session expired')
            })
        }
    }, [searchParams])

    if (!error) return null

    return (
        <Alert
            variant="destructive"
            className="mt-3 sm:mt-4 text-sm sm:text-base"
        >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
}
