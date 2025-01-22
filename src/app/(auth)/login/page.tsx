'use client'

import { Suspense, useActionState, useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams, redirect } from 'next/navigation'
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
import { getAuthToken, loginUsingToken } from './action'
import { logout } from '@/app/action'
import dynamic from 'next/dynamic'

const ReCAPTCHA = dynamic(
    () => {
        return new Promise((resolve) => {
            if (typeof window !== 'undefined') {
                const script = document.createElement('script')
                script.src = 'https://www.google.com/recaptcha/api.js'
                script.async = true
                script.defer = true
                document.body.appendChild(script)
                script.onload = () => {
                    resolve(() => (
                        <div
                            className="g-recaptcha"
                            data-sitekey="6Ld0l4oqAAAAANZUVvtTBjTraHcs0ZgP44GZOxsK"
                        ></div>
                    ))
                }
            }
        })
    },
    {
        ssr: false,
        loading: () => <div className="h-[78px]" /> // Placeholder with same height
    }
)

export default async function LoginPage() {
    const searchParams = useSearchParams()



    const [formActionState, formAction, isPending] = useActionState(
        (state, formData: FormData) => getAuthToken(formData),
        null
    )
    const [studentId, setStudentId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const captchaRef = useRef<HTMLDivElement>(null)
    const [captchaError, setCaptchaError] = useState('')

    useEffect(() => {
        if (formActionState?.credentialCookies) {
            router.push('/profile')
        }

        if (formActionState?.error) {
            setError(formActionState.error)
        }
    }, [formActionState, router])

    useEffect(() => {
        const token = searchParams.get('token')
        console.log({ token })
        if (token) {
            loginUsingToken(token)
        }
    }, [searchParams])

    const handleSubmit = async (formData: FormData) => {
        const captchaResponse = (window as any).grecaptcha?.getResponse()
        
        if (!captchaResponse) {
            setCaptchaError('Please complete the captcha')
            return
        }
        
        formData.append('g-recaptcha-response', captchaResponse)
        
        formAction(formData)
    }

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
                    <form action={handleSubmit}>
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
                        <div className="mt-3 sm:mt-4 flex justify-center">
                            <ReCAPTCHA />
                        </div>
                        {captchaError && (
                            <p className="text-sm text-red-500 text-center mt-2">
                                {captchaError}
                            </p>
                        )}
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
