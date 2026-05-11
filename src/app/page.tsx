import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      {/* Hero */}
      <section className="text-center mb-20 animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-[#a6e3a1]/10 text-[#a6e3a1] px-4 py-1.5 rounded-full text-sm mb-6 font-mono">
          <span className="w-2 h-2 bg-[#a6e3a1] rounded-full animate-pulse" />
          Nền tảng học C hiện đại
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 font-mono">
          Học lập trình{' '}
          <span className="text-[#a6e3a1]">C</span>
          <br />
          từ cơ bản đến nâng cao
        </h1>
        <p className="text-[#a6adc8] text-lg max-w-2xl mx-auto mb-8 font-mono leading-relaxed">
          IDE tích hợp ngay trong trang web, 50+ bài tập HackerRank,
          hệ thống test case thông minh và gamification hấp dẫn.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/learn"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#a6e3a1] text-[#1e1e2e] font-mono font-medium text-sm hover:bg-[#8bd88a] transition-colors"
          >
            Bắt đầu học →
          </Link>
          <Link
            href="/problems"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#313244] text-[#cdd6f4] font-mono text-sm hover:bg-[#45475a] transition-colors border border-[#45475a]"
          >
            Thử thách ngay
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 mb-20">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-[#181825] border border-[#313244] rounded-xl p-6 hover:border-[#45475a] transition-all animate-slide-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span className="text-3xl mb-4 block">{f.icon}</span>
            <h3 className="text-[#cdd6f4] font-semibold mb-2 font-mono">{f.title}</h3>
            <p className="text-[#6c7086] text-sm leading-relaxed">{f.description}</p>
          </div>
        ))}
      </section>

      {/* Course Overview */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-10 font-mono">
          Lộ trình <span className="text-[#a6e3a1]">12 module</span>
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {modules.map((mod, i) => (
            <Link key={i} href={`/learn/${mod.slug}`}>
              <div className="bg-[#181825] border border-[#313244] rounded-lg p-4 hover:border-[#45475a] transition-all">
                <span className="text-xs text-[#6c7086] font-mono">Module {i + 1}</span>
                <h3 className="text-[#cdd6f4] text-sm font-medium mt-1 font-mono">{mod.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="text-center">
        <div className="inline-grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
          {[
            { value: '12', label: 'Module học' },
            { value: '50+', label: 'Bài tập' },
            { value: '200+', label: 'Test cases' },
            { value: '5', label: 'Cấp độ rank' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-[#a6e3a1] font-mono">{s.value}</p>
              <p className="text-[#6c7086] text-sm font-mono">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: '⚡',
    title: 'IDE Tích Hợp',
    description: 'Code và chạy C trực tiếp trong trình duyệt với Monaco Editor, hỗ trợ syntax highlighting, auto-complete.',
  },
  {
    icon: '🎯',
    title: 'HackerRank Integration',
    description: '50+ bài tập từ HackerRank với hệ thống test case public/hidden, chấm điểm tự động.',
  },
  {
    icon: '🏆',
    title: 'Gamification',
    description: 'XP, rank, streak, leaderboard — biến việc học thành cuộc phiêu lưu thú vị.',
  },
  {
    icon: '📚',
    title: 'Giáo Trình W3Schools',
    description: 'Nội dung chuẩn từ W3Schools, tổ chức theo 12 module từ nhập môn đến nâng cao.',
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

const modules = [
  { slug: 'nhap-mon', title: 'Nhập môn C' },
  { slug: 'bien-kieu-dulieu', title: 'Biến & Kiểu dữ liệu' },
  { slug: 'toan-tu', title: 'Toán tử' },
  { slug: 'dieu-kien', title: 'Điều kiện' },
  { slug: 'vong-lap', title: 'Vòng lặp' },
  { slug: 'ham', title: 'Hàm' },
  { slug: 'mang', title: 'Mảng' },
  { slug: 'chuoi', title: 'Chuỗi' },
  { slug: 'con-tro', title: 'Con trỏ' },
  { slug: 'struct-union', title: 'Struct & Union' },
  { slug: 'file-io', title: 'File I/O' },
  { slug: 'thuat-toan', title: 'Thuật toán' },
]
