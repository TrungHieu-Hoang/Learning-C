import { problems as seedProblems } from '../../prisma/seed-data/problems'
import type { Difficulty } from '@/types'

export interface ProblemListItem {
  id: string
  title: string
  difficulty: Difficulty
  source: string
  description: string
}

export interface ProblemDetail {
  id: string
  title: string
  difficulty: Difficulty
  description: string
  inputFormat: string
  constraints: string
  sampleInput: string
  sampleOutput: string
  starterCode: string
  solution: string
  explanation: string
  testCases: { id: string; input: string; expectedOutput: string; isHidden: boolean; weight: number }[]
}

export const problemsList: ProblemListItem[] = seedProblems.map((p) => ({
  id: p.id,
  title: p.title,
  difficulty: p.difficulty as Difficulty,
  source: 'custom',
  description: p.description,
}))

export const problemsDetail = new Map<string, ProblemDetail>(
  seedProblems.map((p) => [
    p.id,
    {
      id: p.id,
      title: p.title,
      difficulty: p.difficulty as Difficulty,
      description: p.description,
      inputFormat: p.inputFormat,
      constraints: p.constraints,
      sampleInput: p.sampleInput,
      sampleOutput: p.sampleOutput,
      starterCode: p.starterCode,
      solution: p.solution,
      explanation: p.explanation,
      testCases: p.testCases.map((tc, i) => ({
        id: `${p.id}-tc-${i}`,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: tc.isHidden,
        weight: tc.isHidden ? 2 : 1,
      })),
    },
  ])
)
