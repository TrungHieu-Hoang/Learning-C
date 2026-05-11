import { getRank } from '@/types'

export function calculateXP(params: {
  passedPublic: number
  totalPublic: number
  passedHidden: number
  totalHidden: number
  attempts: number
  streak: number
  isFirstSolve: boolean
  within24h: boolean
}) {
  const { passedPublic, totalPublic, passedHidden, totalHidden, attempts, streak, isFirstSolve, within24h } = params

  const publicWeight = totalPublic > 0 ? 30 / totalPublic : 0
  const hiddenWeight = totalHidden > 0 ? 70 / totalHidden : 0

  const total = passedPublic * publicWeight + passedHidden * hiddenWeight
  const penalty = Math.min((attempts - 1) * 5, 20)
  const streakBonus = streak >= 7 ? 1.5 : 1.0
  const firstSolveBonus = isFirstSolve && within24h ? 50 : 0

  const xp = Math.max(0, Math.round((total - penalty) * streakBonus + firstSolveBonus))

  const rank = getRank(xp)
  const newRank = { name: rank.name, icon: rank.icon, minXP: rank.minXP }

  return { xp, newRank, streakBonus: streak >= 7 }
}
