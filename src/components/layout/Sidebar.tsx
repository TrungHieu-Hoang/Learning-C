'use client'
import React from 'react'
import Link from 'next/link'

const modules = [
  { id: 'nhap-mon', title: 'Module 1 — Nhập môn', lessons: ['Hello World', 'Cấu trúc chương trình', 'Compile'] },
  { id: 'bien-kieu-dulieu', title: 'Module 2 — Biến & Kiểu dữ liệu', lessons: ['int, float, char', 'double, sizeof'] },
  { id: 'toan-tu', title: 'Module 3 — Toán tử', lessons: ['Số học', 'So sánh', 'Logic', 'Bitwise'] },
  { id: 'dieu-kien', title: 'Module 4 — Điều kiện', lessons: ['if/else', 'switch-case', 'Ternary'] },
  { id: 'vong-lap', title: 'Module 5 — Vòng lặp', lessons: ['for', 'while', 'do-while', 'break/continue'] },
  { id: 'ham', title: 'Module 6 — Hàm', lessons: ['Khai báo', 'Tham số', 'return', 'Đệ quy'] },
  { id: 'mang', title: 'Module 7 — Mảng', lessons: ['1D Array', '2D Array', 'Thao tác'] },
  { id: 'chuoi', title: 'Module 8 — Chuỗi', lessons: ['string.h', 'scanf/gets', 'Xử lý ký tự'] },
  { id: 'con-tro', title: 'Module 9 — Con trỏ', lessons: ['Địa chỉ', 'Dereference', 'Pointer Arithmetic'] },
  { id: 'struct-union', title: 'Module 10 — Struct & Union', lessons: ['Struct', 'Union'] },
  { id: 'file-io', title: 'Module 11 — File I/O', lessons: ['fopen', 'fread', 'fwrite'] },
  { id: 'thuat-toan', title: 'Module 12 — Thuật toán', lessons: ['Sort', 'Search', 'Đệ quy nâng cao'] },
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#181825] border-r border-[#313244] h-[calc(100vh-3.5rem)] overflow-y-auto hidden lg:block shrink-0">
      <div className="p-4">
        <h3 className="text-xs font-semibold text-[#6c7086] uppercase tracking-wider mb-3 font-mono">
          Lộ trình học
        </h3>
        <nav className="space-y-1">
          {modules.map((mod) => (
            <Link
              key={mod.id}
              href={`/learn/${mod.id}`}
              className="block px-3 py-2 rounded-lg text-sm text-[#a6adc8] hover:bg-[#313244] hover:text-[#cdd6f4] transition-colors font-mono"
            >
              <span className="text-[#6c7086] text-xs">{mod.title.split(' —')[0]}</span>
              <br />
              <span className="text-xs">{mod.title.split('— ')[1] || mod.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
