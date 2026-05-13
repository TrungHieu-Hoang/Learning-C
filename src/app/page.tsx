import Link from 'next/link'
import { modulesData } from '@/data/lessons'
import { problemsList } from '@/data/problems'

export default function LandingPage() {
  const modules = modulesData
  const problemCount = problemsList.length
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      {/* Hero */}
      <section className="text-center mb-20 animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-green/10 text-green px-4 py-1.5 rounded-full text-sm mb-6 font-mono">
          <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
          Nền tảng học C hiện đại
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 font-mono">
          Học lập trình{' '}
          <span className="text-green">C</span>
          <br />
          từ cơ bản đến nâng cao
        </h1>
        <p className="text-subtext0 text-lg max-w-2xl mx-auto mb-8 font-mono leading-relaxed">
          IDE tích hợp ngay trong trang web, {problemCount} bài tập,
          hệ thống test case thông minh và gamification hấp dẫn.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/learn"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-green text-base font-mono font-medium text-sm hover:bg-green-hover transition-colors"
          >
            Bắt đầu học →
          </Link>
          <Link
            href="/problems"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-surface0 text-text font-mono text-sm hover:bg-surface1 transition-colors border border-surface1"
          >
            Thử thách ngay
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 mb-20">
        {getFeatures(modules.length, problemCount).map((f, i) => (
          <div
            key={i}
            className="bg-mantle border border-surface0 rounded-xl p-6 hover:border-surface1 transition-all animate-slide-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span className="text-3xl mb-4 block">{f.icon}</span>
            <h3 className="text-text font-semibold mb-2 font-mono">{f.title}</h3>
            <p className="text-overlay0 text-sm leading-relaxed">{f.description}</p>
          </div>
        ))}
      </section>

      {/* Course Overview */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-10 font-mono">
          Lộ trình <span className="text-green">{modules.length} module</span>
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {modules.map((mod, i) => {
            const firstLessonId = mod.lessons[0]?.id || mod.id
            return (
              <Link key={mod.id} href={mod.isLocked ? '/learn' : `/learn/${firstLessonId}`} className={mod.isLocked ? 'opacity-50' : ''}>
                <div className={`bg-mantle border border-surface0 rounded-lg p-4 transition-all ${mod.isLocked ? '' : 'hover:border-surface1'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-overlay0 font-mono">Module {i + 1}</span>
                    {mod.isLocked ? (
                      <span className="text-overlay0 text-xs">🔒</span>
                    ) : (
                      <span className="text-xs text-overlay0 font-mono">{mod.lessons.length} bài</span>
                    )}
                  </div>
                  <h3 className="text-text text-sm font-medium mt-1 font-mono">{mod.title}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="text-center">
        <div className="inline-grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
          {[
            { value: String(modules.length), label: 'Module học' },
            { value: `${problemCount}+`, label: 'Bài tập' },
            { value: '200+', label: 'Test cases' },
            { value: '5', label: 'Cấp độ rank' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-green font-mono">{s.value}</p>
              <p className="text-overlay0 text-sm font-mono">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function getFeatures(modCount: number, problemCount: number) {
  return [
    {
      icon: '⚡',
      title: 'IDE Tích Hợp',
      description: 'Code và chạy C trực tiếp trong trình duyệt với Monaco Editor, hỗ trợ syntax highlighting, auto-complete.',
    },
    {
      icon: '🎯',
      title: 'Bài tập đa dạng',
      description: `${problemCount} bài tập với hệ thống test case public/hidden, chấm điểm tự động.`,
    },
    {
      icon: '🏆',
      title: 'Gamification',
      description: 'XP, rank, streak, leaderboard — biến việc học thành cuộc phiêu lưu thú vị.',
    },
    {
      icon: '📚',
      title: 'Giáo Trình W3Schools',
      description: `Nội dung chuẩn từ W3Schools, tổ chức theo ${modCount} module từ nhập môn đến nâng cao.`,
    },
    {
      icon: '🎨',
      title: 'Dark Theme',
      description: 'Giao diện tối giống VSCode, font JetBrains Mono với ligatures, dễ chịu cho mắt.',
    },
    {
      icon: '📱',
      title: 'Responsive',
      description: 'Học mọi lúc mọi nơi với giao diện responsive, tối ưu cho cả desktop và mobile.',
    },
  ]
}

