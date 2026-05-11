'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/learn', label: 'Học tập' },
  { href: '/problems', label: 'Bài tập' },
  { href: '/leaderboard', label: 'Bảng xếp hạng' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-[#181825] border-b border-[#313244] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-[#a6e3a1] text-xl font-bold font-mono group-hover:brightness-110 transition-all">
            C_Learn
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors ${
                pathname.startsWith(item.href)
                  ? 'bg-[#313244] text-[#a6e3a1]'
                  : 'text-[#a6adc8] hover:bg-[#313244] hover:text-[#cdd6f4]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="text-[#6c7086] hover:text-[#cdd6f4] transition-colors p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#181825] border-t border-[#313244] z-40 flex justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              pathname.startsWith(item.href)
                ? 'text-[#a6e3a1]'
                : 'text-[#6c7086] hover:text-[#a6adc8]'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
