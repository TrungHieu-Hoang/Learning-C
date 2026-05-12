import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { KeepAlive } from '@/components/layout/KeepAlive'
import { ToastProvider } from '@/components/ui/Toast'
import { SessionProvider } from '@/components/auth/SessionProvider'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'C_Learn - Học lập trình C',
  description: 'Nền tảng học lập trình C toàn diện với IDE tích hợp, bài tập HackerRank và gamification',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${jetbrainsMono.variable}`}>
      <body className="bg-[#1e1e2e] text-[#cdd6f4] min-h-screen font-mono">
        <SessionProvider>
          <ToastProvider>
            <KeepAlive />
            <Navbar />
            <main className="flex-1">{children}</main>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
