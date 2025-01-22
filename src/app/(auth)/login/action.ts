'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
// import { Agent, setGlobalDispatcher, fetch } from 'undici'
// import dns from 'dns/promises'
// import { promisify } from 'util'

const BASE_URL = 'https://studentportal.green.edu.bd'

// Create a custom agent that uses Google's DNS server
// const agent = new Agent({
//   connect: {
//     lookup: async (hostname: string, options: any, callback: Function) => {
//       try {
//         // Configure DNS resolver to use Google's DNS
//         const resolver = new dns.Resolver()
//         resolver.setServers(['8.8.8.8'])
//         const addresses = await resolver.resolve4(hostname)
//         callback(null, addresses[0], 4)
//       } catch (err) {
//         callback(err)
//       }
//     }
//   }
// })

// setGlobalDispatcher(agent)

export async function getAuthToken(formData: FormData) {
    const captchaResponse = formData.get('g-recaptcha-response')

    if (!captchaResponse || typeof captchaResponse !== 'string') {
        return { error: 'Captcha verification failed' }
    }

    // const isValidCaptcha = await verifyCaptcha(captchaResponse)
    // if (!isValidCaptcha) {
    //     return { error: 'Invalid captcha response' }
    // }

    console.log({ captchaResponse })

    try {
        const initialResponse = await getInitialTokens()
        if (!initialResponse) return { error: 'Could not connect to server' }

        const { credentialCookies } = await login({
            cookies: initialResponse.cookies,
            verificationToken: initialResponse.verificationToken ?? '',
            studentId: formData.get('student_id')?.toString() ?? '',
            password: formData.get('password')?.toString() ?? '',
            captchaResponse: captchaResponse,
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
    captchaResponse: string | null
}

async function login({
    cookies,
    verificationToken,
    studentId,
    password,
    captchaResponse,
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
        body: `Input.LoginId=${studentId}&Input.Password=${password}&__RequestVerificationToken=${verificationToken}&g-recaptcha-response=${captchaResponse}`,
        method: 'POST',
    })

    console.log({ response, cookies: response.headers.entries() })

    console.log({ responseText: await response.clone().text() })

    const credentialCookies = response.headers
        .getSetCookie()
        .filter((cookie) => cookie.includes('.AspNetCore.Cookies'))
        .map((cookie) => cookie.split(';')[0])
        .join(';')

    return {
        credentialCookies,
    }
}

// async function verifyCaptcha(captchaResponse: string) {
//     const secretKey = process.env.RECAPTCHA_SECRET_KEY // Add this to your .env file

//     const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: `secret=${secretKey}&response=${captchaResponse}`,
//     })

//     const data = await response.json()
//     return data.success
// }

export async function loginUsingToken(token: string) {
    const cookieStore = await cookies()
    cookieStore.set('auth', `.AspNetCore.Cookies=${token}`)
    redirect('/profile')
}

