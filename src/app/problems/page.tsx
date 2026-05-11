'use client'
import React, { useState, useMemo } from 'react'
import { ProblemCard } from '@/components/problems/ProblemCard'
import { ProblemFilters } from '@/components/problems/ProblemFilters'
import type { Difficulty } from '@/types'

const problems = [
  { id: 'hello-world-c', title: 'Hello World in C', difficulty: 'easy' as Difficulty, source: 'hackerrank', description: 'In ra "Hello, World!" sử dụng printf.' },
  { id: 'playing-characters', title: 'Playing With Characters', difficulty: 'easy' as Difficulty, source: 'hackerrank', description: 'Đọc và in ký tự, chuỗi, câu.' },
  { id: 'sum-difference', title: 'Sum and Difference of Two Numbers', difficulty: 'easy' as Difficulty, source: 'hackerrank', description: 'Tính tổng và hiệu của hai số.' },
  { id: 'conditional-stmts', title: 'Conditional Statements', difficulty: 'easy' as Difficulty, source: 'hackerrank', description: 'Sử dụng if-else để in số bằng chữ.' },
  { id: 'for-loop-c', title: 'For Loop in C', difficulty: 'easy' as Difficulty, source: 'hackerrank', description: 'In các số từ a đến b sử dụng for loop.' },
  { id: 'functions-c', title: 'Functions in C', difficulty: 'easy' as Difficulty, source: 'hackerrank', description: 'Viết hàm tìm số lớn nhất.' },
  { id: 'pointer-c', title: 'Pointer in C', difficulty: 'easy' as Difficulty, source: 'hackerrank', description: 'Thao tác con trỏ, tính tổng và hiệu.' },
  { id: 'sorting-strings', title: 'Sorting Array of Strings', difficulty: 'medium' as Difficulty, source: 'hackerrank', description: 'Sắp xếp mảng chuỗi theo nhiều tiêu chí.' },
  { id: 'variadic-c', title: 'Variadic Functions in C', difficulty: 'medium' as Difficulty, source: 'hackerrank', description: 'Viết hàm với tham số biến đổi.' },
  { id: 'bitwise-ops', title: 'Bitwise Operators', difficulty: 'medium' as Difficulty, source: 'hackerrank', description: 'Tính toán bitwise giữa các số.' },
  { id: 'dynamic-array-c', title: 'Dynamic Array in C', difficulty: 'medium' as Difficulty, source: 'hackerrank', description: 'Cấp phát và thao tác mảng động.' },
  { id: 'students-marks', title: 'Students Marks Sum', difficulty: 'easy' as Difficulty, source: 'hackerrank', description: 'Tính tổng điểm theo giới tính.' },
  { id: 'box-turtle', title: 'Boxes through a Tunnel', difficulty: 'medium' as Difficulty, source: 'hackerrank', description: 'Struct và điều kiện về kích thước.' },
  { id: 'small-triangles', title: 'Small Triangles, Large Triangles', difficulty: 'hard' as Difficulty, source: 'hackerrank', description: 'Sắp xếp tam giác theo diện tích.' },
  { id: 'post-transition', title: 'Post Transition', difficulty: 'hard' as Difficulty, source: 'hackerrank', description: 'Quản lý state với struct và con trỏ.' },
  { id: 'permutation', title: 'Permutation of Strings', difficulty: 'hard' as Difficulty, source: 'hackerrank', description: 'Sinh hoán vị của mảng chuỗi.' },
  { id: 'digit-frequency', title: 'Digit Frequency', difficulty: 'medium' as Difficulty, source: 'hackerrank', description: 'Đếm tần suất xuất hiện của chữ số.' },
  { id: 'array-reversal', title: 'Array Reversal', difficulty: 'easy' as Difficulty, source: 'hackerrank', description: 'Đảo ngược mảng một chiều.' },
  { id: 'sum-numbers', title: 'Sum of Digits of a Five Digit Number', difficulty: 'easy' as Difficulty, source: 'hackerrank', description: 'Tính tổng các chữ số.' },
  { id: '1d-arrays', title: '1D Arrays in C', difficulty: 'easy' as Difficulty, source: 'hackerrank', description: 'Tính tổng mảng một chiều.' },
]

export default function ProblemsPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [source, setSource] = useState<string | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (difficulty !== 'all' && p.difficulty !== difficulty) return false
      if (source !== 'all' && p.source !== source) return false
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [difficulty, source, search])

  const counts = {
    all: problems.length,
    easy: problems.filter((p) => p.difficulty === 'easy').length,
    medium: problems.filter((p) => p.difficulty === 'medium').length,
    hard: problems.filter((p) => p.difficulty === 'hard').length,
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="animate-fade-in mb-6">
        <h1 className="text-2xl font-bold font-mono mb-2">Bài tập C</h1>
        <p className="text-[#a6adc8] text-sm font-mono">
          {counts.all} bài tập · {counts.easy} Easy · {counts.medium} Medium · {counts.hard} Hard
        </p>
      </div>

      <ProblemFilters
        selectedDifficulty={difficulty}
        selectedSource={source}
        searchQuery={search}
        onDifficultyChange={setDifficulty}
        onSourceChange={setSource}
        onSearchChange={setSearch}
      />

      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((p) => (
          <ProblemCard key={p.id} {...p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#6c7086] font-mono">Không tìm thấy bài tập nào</p>
        </div>
      )}
    </div>
  )
}
