'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { TestCasePanel } from '@/components/editor/TestCasePanel'
import { Editorial } from '@/components/problems/Editorial'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useJudge } from '@/hooks/useJudge'
import { useEditorStore } from '@/store/editorStore'

type Difficulty = 'easy' | 'medium' | 'hard'

const problemData: Record<string, {
  title: string
  difficulty: Difficulty
  description: string
  inputFormat: string
  constraints: string
  sampleInput: string
  sampleOutput: string
  starterCode: string
  explanation: string
  solution: string
  testCases: { input: string; expectedOutput: string; isHidden: boolean }[]
}> = {
  'hello-world-c': {
    title: 'Hello World in C',
    difficulty: 'easy',
    description: 'Hoàn thành chương trình in ra dòng chữ "Hello, World!" trên một dòng duy nhất.',
    inputFormat: 'Không có đầu vào.',
    constraints: 'Không có.',
    sampleInput: '',
    sampleOutput: 'Hello, World!',
    starterCode: `#include <stdio.h>

int main() {
    // In ra "Hello, World!"

    return 0;
}`,
    explanation: 'Sử dụng printf để in chuỗi ra màn hình. Nhớ thêm \\n để xuống dòng.',
    solution: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
    testCases: [
      { input: '', expectedOutput: 'Hello, World!', isHidden: false },
      { input: '', expectedOutput: 'Hello, World!', isHidden: false },
      { input: '', expectedOutput: 'Hello, World!', isHidden: false },
      { input: '', expectedOutput: 'Hello, World!', isHidden: true },
    ],
  },
  'playing-characters': {
    title: 'Playing With Characters',
    difficulty: 'easy',
    description: 'Đọc một ký tự, một chuỗi và một câu từ stdin, sau đó in chúng ra mỗi thứ trên một dòng.',
    inputFormat: 'Dòng 1: Một ký tự.\nDòng 2: Một chuỗi (không dấu cách).\nDòng 3: Một câu (có dấu cách).',
    constraints: '1 ≤ |chuỗi| ≤ 100, 1 ≤ |câu| ≤ 100',
    sampleInput: 'C\nProgramming\nI love coding',
    sampleOutput: 'C\nProgramming\nI love coding',
    starterCode: `#include <stdio.h>

int main() {
    char ch;
    char s[100];
    char sen[100];

    // Đọc và in ký tự

    // Đọc và in chuỗi

    // Đọc và in câu

    return 0;
}`,
    explanation: 'Dùng scanf với %c cho ký tự, %s cho chuỗi, và %[^\\n] cho câu (hoặc fgets).',
    solution: `#include <stdio.h>

int main() {
    char ch;
    char s[100];
    char sen[100];

    scanf("%c", &ch);
    scanf("%s", s);
    getchar();
    fgets(sen, 100, stdin);

    printf("%c\\n", ch);
    printf("%s\\n", s);
    printf("%s", sen);
    return 0;
}`,
    testCases: [
      { input: 'C\nProgramming\nI love coding', expectedOutput: 'C\nProgramming\nI love coding', isHidden: false },
      { input: 'A\nHello\nWorld is beautiful', expectedOutput: 'A\nHello\nWorld is beautiful', isHidden: false },
      { input: 'Z\nTest\nC programming language', expectedOutput: 'Z\nTest\nC programming language', isHidden: true },
    ],
  },
  'sum-difference': {
    title: 'Sum and Difference of Two Numbers',
    difficulty: 'easy',
    description: 'Tính tổng và hiệu của hai số nguyên, sau đó là tổng và hiệu của hai số thực.',
    inputFormat: 'Dòng 1: Hai số nguyên a và b.\nDòng 2: Hai số thực c và d.',
    constraints: '1 ≤ a, b ≤ 1000\n1 ≤ c, d ≤ 1000',
    sampleInput: '10 4\n4.5 1.5',
    sampleOutput: '14 6\n6.0 3.0',
    starterCode: `#include <stdio.h>

int main() {
    int a, b;
    float c, d;

    // Đọc đầu vào

    // Tính và in kết quả

    return 0;
}`,
    explanation: 'Khai báo int cho số nguyên, float cho số thực. In số nguyên với %d, số thực với %.1f.',
    solution: `#include <stdio.h>

int main() {
    int a, b;
    float c, d;

    scanf("%d %d", &a, &b);
    scanf("%f %f", &c, &d);

    printf("%d %d\\n", a + b, a - b);
    printf("%.1f %.1f\\n", c + d, c - d);
    return 0;
}`,
    testCases: [
      { input: '10 4\n4.5 1.5', expectedOutput: '14 6\n6.0 3.0', isHidden: false },
      { input: '20 8\n10.5 3.2', expectedOutput: '28 12\n13.7 7.3', isHidden: false },
      { input: '100 50\n100.0 50.0', expectedOutput: '150 50\n150.0 50.0', isHidden: true },
    ],
  },
}

export default function ProblemPage() {
  const params = useParams()
  const id = params.id as string
  const [showEditorial, setShowEditorial] = useState(false)
  const [tab, setTab] = useState<'problem' | 'editor' | 'result'>('problem')
  const { handleRun, handleTestCases, testResults, showTestPanel, isRunning } = useJudge()
  const reset = useEditorStore((s) => s.reset)

  const problem = problemData[id]

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#f38ba8] font-mono mb-2">Bài tập không tồn tại</h1>
        <p className="text-[#6c7086] font-mono">ID: {id}</p>
      </div>
    )
  }

  const difficultyColors: Record<Difficulty, string> = {
    easy: 'text-[#a6e3a1] bg-[#a6e3a1]/10',
    medium: 'text-[#f9e2af] bg-[#f9e2af]/10',
    hard: 'text-[#f38ba8] bg-[#f38ba8]/10',
  }

  const handleSubmit = async () => {
    await handleTestCases(problem.testCases)
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row">
      {/* Mobile tabs */}
      <div className="lg:hidden flex border-b border-[#313244]">
        {(['problem', 'editor', 'result'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-4 py-2 text-sm font-mono transition-colors ${
              tab === t
                ? 'text-[#a6e3a1] border-b-2 border-[#a6e3a1] bg-[#181825]'
                : 'text-[#6c7086] hover:text-[#a6adc8]'
            }`}
          >
            {t === 'problem' ? 'Đề bài' : t === 'editor' ? 'Editor' : 'Kết quả'}
          </button>
        ))}
      </div>

      {/* Problem description */}
      <div className={`lg:w-2/5 xl:w-1/3 border-r border-[#313244] overflow-y-auto ${
        tab !== 'problem' ? 'hidden lg:block' : 'flex-1'
      }`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-lg font-bold font-mono text-[#cdd6f4]">{problem.title}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${difficultyColors[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-[#cdd6f4] font-medium mb-1 font-mono">Mô tả</h3>
              <p className="text-[#a6adc8] leading-relaxed">{problem.description}</p>
            </div>

            <div>
              <h3 className="text-[#cdd6f4] font-medium mb-1 font-mono">Input Format</h3>
              <pre className="bg-[#181825] p-3 rounded-lg text-[#a6adc8] text-xs whitespace-pre-wrap">{problem.inputFormat}</pre>
            </div>

            <div>
              <h3 className="text-[#cdd6f4] font-medium mb-1 font-mono">Constraints</h3>
              <pre className="bg-[#181825] p-3 rounded-lg text-[#a6adc8] text-xs">{problem.constraints}</pre>
            </div>

            <div>
              <h3 className="text-[#cdd6f4] font-medium mb-1 font-mono">Sample Input</h3>
              <pre className="bg-[#181825] p-3 rounded-lg text-[#a6e3a1] text-xs">{problem.sampleInput}</pre>
            </div>

            <div>
              <h3 className="text-[#cdd6f4] font-medium mb-1 font-mono">Sample Output</h3>
              <pre className="bg-[#181825] p-3 rounded-lg text-[#a6e3a1] text-xs">{problem.sampleOutput}</pre>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditorial(!showEditorial)}
              className="w-full"
            >
              {showEditorial ? 'Ẩn Editorial' : 'Xem Editorial'}
            </Button>

            {showEditorial && (
              <Editorial
                solution={problem.solution}
                explanation={problem.explanation}
                isUnlocked={true}
                hoursUntilUnlock={0}
              />
            )}
          </div>
        </div>
      </div>

      {/* Editor + Results */}
      <div className={`lg:flex-1 flex flex-col ${tab !== 'editor' && tab !== 'result' ? 'hidden lg:flex' : 'flex-1'}`}>
        <div className="flex-1 min-h-[200px]">
          <CodeEditor
            autoSaveKey={`problem-${id}`}
            onRun={handleRun}
            onSubmit={handleSubmit}
            onReset={() => reset(problem.starterCode)}
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
