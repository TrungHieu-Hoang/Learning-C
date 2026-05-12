'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export function AuthButton() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (status === 'loading') {
    return (
      <div className="w-8 h-8 border-2 border-[#6c7086] border-t-transparent rounded-full animate-spin" />
    )
  }

  if (status === 'unauthenticated') {
    return (
      <button
        onClick={() => signIn()}
        className="px-4 py-1.5 bg-[#a6e3a1] text-[#1e1e2e] font-mono text-sm font-medium rounded-lg hover:brightness-110 transition-all"
      >
        Đăng nhập
      </button>
    )
  }

  const user = session?.user
  const initial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#313244] transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-[#a6e3a1] text-[#1e1e2e] flex items-center justify-center text-xs font-mono font-bold">
          {initial}
        </div>
        <span className="text-sm font-mono text-[#cdd6f4] hidden md:block max-w-[120px] truncate">
          {user?.name || user?.email}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#181825] border border-[#313244] rounded-xl shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-[#313244]">
            <p className="text-sm font-mono text-[#cdd6f4] truncate">{user?.name}</p>
            <p className="text-xs font-mono text-[#6c7086] truncate">{user?.email}</p>
          </div>
          <div className="py-1">
            <Link
              href={`/profile/${user?.id}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm font-mono text-[#a6adc8] hover:bg-[#313244] hover:text-[#cdd6f4] transition-colors"
            >
              Trang cá nhân
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 text-sm font-mono text-[#f38ba8] hover:bg-[#313244] transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
