export type Difficulty = 'easy' | 'medium' | 'hard'
export type LessonType = 'theory' | 'exercise' | 'challenge'
export type ProblemSource = 'custom' | 'hackerrank'
export type SubmissionStatus = 'AC' | 'WA' | 'TLE' | 'CE' | 'RE' | 'PENDING'

export interface Module {
  id: string
  title: string
  description: string
  orderIndex: number
  isLocked: boolean
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  contentMd: string
  orderIndex: number
  lessonType: LessonType
  module?: Module
}

export interface Problem {
  id: string
  lessonId: string
  source: ProblemSource
  title: string
  description: string
  difficulty: Difficulty
  timeLimit: number
  memoryLimit: number
  starterCode: string
  testCases: TestCase[]
  lesson?: Lesson
}

export interface TestCase {
  id: string
  problemId: string
  input: string
  expectedOutput: string
  isHidden: boolean
  weight: number
}

export interface Submission {
  id: string
  userId: string
  problemId: string
  code: string
  language: string
  status: SubmissionStatus
  xpEarned: number
  runtimeMs: number
  memoryKb: number
  submittedAt: Date
}

export interface UserProgress {
  id: string
  userId: string
  lessonId: string
  isCompleted: boolean
  completedAt: Date | null
  attempts: number
}

export interface User {
  id: string
  username: string
  email: string
  avatar: string | null
  xp: number
  streak: number
  lastActive: Date
  createdAt: Date
}

export interface Judge0Result {
  stdout: string
  stderr: string
  compile_output: string
  exit_code: number
  time: string
  memory: number
  status: { id: number; description: string }
}

export interface TestResult {
  testCaseId: string
  input: string
  expected: string
  actual: string
  passed: boolean
  time: string
  isHidden: boolean
}

export interface XPResult {
  xpEarned: number
  totalXP: number
  newRank?: RankInfo
  streak: number
  streakBonus: boolean
}

export interface RankInfo {
  name: string
  icon: string
  minXP: number
}

export const RANKS: RankInfo[] = [
  { name: 'Beginner', icon: '🌱', minXP: 0 },
  { name: 'Learner', icon: '⚡', minXP: 500 },
  { name: 'Coder', icon: '🔥', minXP: 1500 },
  { name: 'Advanced', icon: '💎', minXP: 3000 },
  { name: 'Expert', icon: '🏅', minXP: 6000 },
]

export function getRank(xp: number): RankInfo {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (xp >= r.minXP) rank = r
  }
  return rank
}
