'use server'

import { cookies } from 'next/headers'

const BASE_URL = 'https://studentportal.green.edu.bd'

export async function getAuthToken(prev: unknown, formData: FormData) {
    try {
        const initialResponse = await getInitialTokens()
        if (!initialResponse) return { error: 'Could not connect to server' }

        const { credentialCookies } = await login({
            cookies: initialResponse.cookies,
            verificationToken: initialResponse.verificationToken ?? '',
            studentId: formData.get('student_id')?.toString() ?? '',
            password: formData.get('password')?.toString() ?? '',
        })

        console.log({ credentialCookies: credentialCookies.slice(0, 50) })

        const cookieStore = await cookies()
        if (credentialCookies) {
            cookieStore.set('auth', credentialCookies)
        }

        if (!credentialCookies) {
            return { error: 'Invalid Student ID or Password' }
        }

        return { credentialCookies }
    } catch (error) {
        console.error(error)
        return { error: 'An error occurred during login' }
    }
}

async function getInitialTokens() {
    try {
        const response = await fetch(`${BASE_URL}/Account/Login`)
        const responseText = await response.text()
        const cookies = response.headers.getSetCookie()
        const verificationToken = responseText.match(
            /<input name="__RequestVerificationToken" type="hidden" value="([^"]+)" \/>/
        )?.[1]
        return {
            cookies,
            verificationToken,
        }
    } catch (err) {
        console.error(err)
        return null
    }
}

interface LoginParams {
    cookies: string[]
    verificationToken: string
    studentId: string | null
    password: string | null
}

async function login({
    cookies,
    verificationToken,
    studentId,
    password,
}: LoginParams) {
    // console.log({ studentId })
    const interestingCookies = cookies
        .filter((cookie: string) => cookie.includes('.AspNetCore.Antiforgery'))
        .map((cookie: string) => cookie.split(';')[0])
        .join(';')

    const response = await fetch(`${BASE_URL}/Account/Login`, {
        redirect: 'manual',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            cookie: interestingCookies,
        },
        body: `Input.LoginId=${studentId}&Input.Password=${password}&__RequestVerificationToken=${verificationToken}`,
        method: 'POST',
    })

    const credentialCookies = response.headers
        .getSetCookie()
        .filter((cookie) => cookie.includes('.AspNetCore.Cookies'))
        .map((cookie) => cookie.split(';')[0])
        .join(';')

    return {
        credentialCookies,
    }
}
