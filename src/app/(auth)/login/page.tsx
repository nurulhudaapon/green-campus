'use client'

import { logout } from '@/app/action'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useActionState, useEffect, useRef, useState } from 'react'
import { getAuthToken, loginUsingToken } from './action'

const ReCAPTCHA = dynamic(
    // @ts-ignore
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
        loading: () => <div className="h-[78px]" />, // Placeholder with same height
    }
)

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex h-[78px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
        </div>}>
            <LoginPageBase />
        </Suspense>
    )
}

function LoginPageBase() {
    const searchParams = useSearchParams()
    const [token, setToken] = useState('')
    const router = useRouter()

    useEffect(() => {
        const urlToken = searchParams.get('token')
        if (urlToken) {
            loginUsingToken(urlToken)
        }
    }, [searchParams])

    useEffect(() => {
        if (token) {
            loginUsingToken(token)
        }
    }, [token])

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
                        Login to Unofficial GUB Portal
                    </CardTitle>
                    <CardDescription className="text-center text-sm sm:text-base text-red-500">
                        ⚠️ Warning: Only paste your token if you trust the author of this site. Never share it with others.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                        <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="token">Login Token</Label>
                            <Input
                                id="token"
                                name="token"
                                placeholder="Paste your login token here"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="h-9 sm:h-10"
                            />
                        </div>
                    </div>
                    <Suspense>
                        <ErrorMessage message="" />
                    </Suspense>
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
