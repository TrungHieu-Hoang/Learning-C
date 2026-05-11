export function checkStreak(lastActive: Date | string): { streak: number; isNewDay: boolean } {
  const last = new Date(lastActive)
  const now = new Date()

  const lastDate = new Date(last.getFullYear(), last.getMonth(), last.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return { streak: 0, isNewDay: false }
  } else if (diffDays === 1) {
    return { streak: 1, isNewDay: true }
  } else {
    return { streak: 0, isNewDay: true }
  }
}

export function getStreakMultiplier(streak: number): number {
  return streak >= 7 ? 1.5 : 1.0
}
