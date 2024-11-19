'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const BASE_URL = 'https://studentportal.green.edu.bd'

export async function getStudentInfo() {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth')

    if (!authToken) {
        redirect('/login?message=Session expired')
    }

    const response = await fetch(`${BASE_URL}/api/StudentInfo`, {
        headers: {
            accept: 'application/json, text/plain, */*',
            Cookie: authToken.value,
        },
    })

    if (response.url.includes('/Account/login')) {
        // cookieStore.delete("auth"); /// TODO: Probably a next.js bug [ Server ] Error: Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options
        redirect('/login?message=Session expired')
    }

    const data = await response.json()
    return data?.at(0)
}
