import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { QueryClientProvider } from '@/contexts/query'
const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
})
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
})

export const metadata: Metadata = {
    title: 'GUB Portal',
    description: 'GUB Portal',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <head>
                <script src="https://www.google.com/recaptcha/api.js" async defer></script>
            </head>
            <body>
                <QueryClientProvider>
                    <main>{children}</main>
                </QueryClientProvider>
            </body>
        </html>
    )
}
