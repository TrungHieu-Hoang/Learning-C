'use client'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-mono rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1e1e2e] disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-[#a6e3a1] text-[#1e1e2e] hover:bg-[#8bd88a] focus:ring-[#a6e3a1] font-medium',
    secondary: 'bg-[#313244] text-[#cdd6f4] hover:bg-[#45475a] focus:ring-[#45475a] border border-[#45475a]',
    ghost: 'bg-transparent text-[#a6adc8] hover:bg-[#313244] focus:ring-[#313244]',
    danger: 'bg-[#f38ba8] text-[#1e1e2e] hover:bg-[#e67a95] focus:ring-[#f38ba8]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
