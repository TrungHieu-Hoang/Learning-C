'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { TestCasePanel } from '@/components/editor/TestCasePanel'
import { LessonContent } from '@/components/learn/LessonContent'
import { useJudge } from '@/hooks/useJudge'
import { useEditorStore } from '@/store/editorStore'

const lessonData: Record<string, { title: string; content: string; starterCode: string }> = {
  'nhap-mon': {
    title: 'Module 1: Nhập môn C',
    content: `## Giới thiệu về C

C là ngôn ngữ lập trình mạnh mẽ và phổ biến, được tạo ra bởi Dennis Ritchie vào năm 1972. Đây là nền tảng của nhiều ngôn ngữ hiện đại như C++, Java, và Python.

## Cấu trúc chương trình C

Một chương trình C cơ bản gồm:

\`\`\`c
#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}
\`\`\`

### Giải thích:
- \`#include <stdio.h>\` — Thư viện nhập xuất chuẩn
- \`int main()\` — Hàm chính, nơi chương trình bắt đầu
- \`printf()\` — Hàm in ra màn hình
- \`return 0\` — Kết thúc chương trình thành công

## Compile và chạy

\`\`\`bash
gcc program.c -o program
./program
\`\`\`

## Bài tập thực hành

Hãy viết chương trình in ra câu "Xin chao, toi hoc C!"`,
    starterCode: `#include <stdio.h>

int main() {
    // In ra dòng chữ "Xin chao, toi hoc C!"

    return 0;
}`,
  },
  'bien-kieu-dulieu': {
    title: 'Module 2: Biến & Kiểu dữ liệu',
    content: `## Biến trong C

Biến dùng để lưu trữ dữ liệu trong bộ nhớ.

## Các kiểu dữ liệu cơ bản

| Kiểu | Kích thước | Khoảng giá trị |
|------|-----------|----------------|
| \`int\` | 4 bytes | -2.1B đến 2.1B |
| \`float\` | 4 bytes | ±1.2E-38 đến ±3.4E38 |
| \`double\` | 8 bytes | ±2.3E-308 đến ±1.7E308 |
| \`char\` | 1 byte | -128 đến 127 |

## Ví dụ

\`\`\`c
int age = 20;
float pi = 3.14;
char grade = 'A';

printf("Tuoi: %d, Pi: %.2f, Diem: %c\\n", age, pi, grade);
\`\`\`

## Hãy thử:

Khai báo các biến và in chúng ra.`,
    starterCode: `#include <stdio.h>

int main() {
    // Khai báo biến
    int tuoi = 18;
    float chieu_cao = 1.75;
    char chu_cai = 'C';

    // In ra màn hình
    printf("Tuoi: %d\\n", tuoi);
    printf("Chieu cao: %.2f\\n", chieu_cao);
    printf("Chu cai: %c\\n", chu_cai);

    return 0;
}`,
  },
  'toan-tu': {
    title: 'Module 3: Toán tử',
    content: `## Toán tử trong C

### Toán tử số học
\`\`\`c
+   -   *   /   %
\`\`\`

### Toán tử so sánh
\`\`\`c
==  !=  >   <   >=  <=
\`\`\`

### Toán tử logic
\`\`\`c
&&  ||  !
\`\`\`

## Ví dụ

\`\`\`c
int a = 10, b = 3;
printf("Tong: %d\\n", a + b);
printf("Thuong: %.2f\\n", (float)a / b);
printf("So du: %d\\n", a % b);
\`\`\``,
    starterCode: `#include <stdio.h>

int main() {
    int a = 15, b = 4;

    // Tính và in ra tổng, hiệu, tích, thương, số dư

    return 0;
}`,
  },
}

export default function LessonPage() {
  const params = useParams()
  const slug = params.slug as string
  const [activeTab, setActiveTab] = useState<'theory' | 'editor' | 'result'>('theory')
  const { handleRun, testResults, showTestPanel, isRunning } = useJudge()
  const reset = useEditorStore((s) => s.reset)
  const lesson = lessonData[slug]

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#f38ba8] font-mono mb-2">404</h1>
        <p className="text-[#6c7086] font-mono">Bài học không tồn tại</p>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row">
      {/* Mobile tabs */}
      <div className="lg:hidden flex border-b border-[#313244]">
        {(['theory', 'editor', 'result'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 text-sm font-mono transition-colors ${
              activeTab === tab
                ? 'text-[#a6e3a1] border-b-2 border-[#a6e3a1] bg-[#181825]'
                : 'text-[#6c7086] hover:text-[#a6adc8]'
            }`}
          >
            {tab === 'theory' ? 'Lý thuyết' : tab === 'editor' ? 'Editor' : 'Kết quả'}
          </button>
        ))}
      </div>

      {/* Theory panel */}
      <div className={`lg:w-1/2 xl:w-3/5 border-r border-[#313244] overflow-hidden ${
        activeTab !== 'theory' ? 'hidden lg:flex' : 'flex-1'
      }`}>
        <LessonContent content={lesson.content} title={lesson.title} />
      </div>

      {/* Right panel: Editor + Output */}
      <div className={`lg:w-1/2 xl:w-2/5 flex flex-col overflow-hidden ${
        activeTab !== 'editor' && activeTab !== 'result' ? 'hidden lg:flex' : 'flex-1'
      }`}>
        <div className="flex-1 min-h-[200px]">
          <CodeEditor
            autoSaveKey={`lesson-${slug}`}
            onRun={handleRun}
            onReset={() => reset(lesson.starterCode)}
          />
        </div>
        <div className="h-1/2 min-h-[150px] border-t border-[#313244]">
          {showTestPanel && testResults.length > 0 ? (
            <TestCasePanel results={testResults} isRunning={isRunning} />
          ) : (
            <OutputPanel />
          )}
        </div>
      </div>
    </div>
  )
}
