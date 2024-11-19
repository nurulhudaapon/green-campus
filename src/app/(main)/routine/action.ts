'use server'

import { cookies } from 'next/headers'

const BASE_URL = 'https://studentportal.green.edu.bd'

export async function getClassRoutine() {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth')

    if (!authToken) {
        return { error: 'Unauthorized' }
    }

    console.log({ authToken: authToken.value.slice(0, 50) })

    const response = await fetch(`${BASE_URL}/api/ClassRoutine`, {
        headers: {
            accept: 'application/json, text/plain, */*',
            Cookie: authToken.value,
        },
    })

    const data = await response.json()
    return data
}
