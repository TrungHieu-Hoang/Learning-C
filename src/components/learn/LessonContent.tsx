'use client'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface LessonContentProps {
  content: string
  title: string
}

export function LessonContent({ content, title }: LessonContentProps) {
  return (
    <div className="prose-c p-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-text mb-6 font-mono">{title}</h1>
      <div className="max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
