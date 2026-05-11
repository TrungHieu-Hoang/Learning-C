'use client'
import React from 'react'
import { ModuleCard } from '@/components/learn/ModuleCard'
import { ProgressBar } from '@/components/learn/ProgressBar'

const modules = [
  { id: 'nhap-mon', title: 'Nhập môn C', description: 'Hello World, cấu trúc chương trình, compile, biên dịch với GCC', lessonCount: 4 },
  { id: 'bien-kieu-dulieu', title: 'Biến & Kiểu dữ liệu', description: 'int, float, char, double, sizeof, khai báo và khởi tạo biến', lessonCount: 4 },
  { id: 'toan-tu', title: 'Toán tử', description: 'Số học, so sánh, logic, bitwise, độ ưu tiên toán tử', lessonCount: 4 },
  { id: 'dieu-kien', title: 'Điều kiện', description: 'if/else, switch-case, ternary operator, cấu trúc rẽ nhánh', lessonCount: 4 },
  { id: 'vong-lap', title: 'Vòng lặp', description: 'for, while, do-while, break/continue, lồng vòng lặp', lessonCount: 4 },
  { id: 'ham', title: 'Hàm', description: 'Khai báo hàm, tham số, return, đệ quy, function pointer', lessonCount: 5 },
  { id: 'mang', title: 'Mảng', description: '1D array, 2D array, thao tác cơ bản, truyền mảng vào hàm', lessonCount: 4 },
  { id: 'chuoi', title: 'Chuỗi', description: 'string.h, scanf/gets, xử lý ký tự, các hàm xử lý chuỗi', lessonCount: 5 },
  { id: 'con-tro', title: 'Con trỏ', description: 'Địa chỉ, dereference, pointer arithmetic, con trỏ và mảng', lessonCount: 5 },
  { id: 'struct-union', title: 'Struct & Union', description: 'Khai báo struct, union, typedef, nested struct', lessonCount: 4 },
  { id: 'file-io', title: 'File I/O', description: 'fopen, fread, fwrite, fclose, đọc ghi file nhị phân', lessonCount: 4 },
  { id: 'thuat-toan', title: 'Thuật toán', description: 'Sort, search, đệ quy nâng cao, độ phức tạp', lessonCount: 5 },
]

export default function LearnPage() {
  const firstUnlocked = 'nhap-mon'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold font-mono mb-2">Lộ trình học C</h1>
        <p className="text-[#a6adc8] text-sm font-mono mb-4">
          12 module từ cơ bản đến nâng cao
        </p>
        <ProgressBar value={0} max={12} size="lg" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {modules.map((mod, i) => (
          <ModuleCard
            key={mod.id}
            {...mod}
            orderIndex={i + 1}
            isLocked={mod.id !== firstUnlocked}
            progress={0}
          />
        ))}
      </div>
    </div>
  )
}
