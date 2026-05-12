# C-Learn — Học lập trình C online

> Nền tảng học lập trình C hiện đại với IDE tích hợp, bài tập đa dạng và gamification hấp dẫn.

🌐 **Website:** [learning-c-aw76.onrender.com](https://learning-c-aw76.onrender.com)

---

## Tính năng

- **IDE tích hợp** — Code và chạy C trực tiếp trong trình duyệt nhờ Monaco Editor (giống VSCode) + Piston API
- **22 module học** — Từ nhập môn đến con trỏ nâng cao, lập trình hệ thống, cấu trúc dữ liệu
- **76+ bài tập** — Bao gồm bài tập tự soạn và bộ sưu tập HackerRank (dễ → khó)
- **Test case thông minh** — Hệ thống test case public/hidden, chấm điểm tự động
- **Gamification** — XP, rank, streak, leaderboard, huy hiệu
- **Multiple themes** — Giao diện Mocha (tối), Latte (sáng), Ocean (xanh dương)
- **Auth** — Đăng nhập bằng Google, lưu tiến độ học tập
- **Responsive** — Học mọi lúc mọi nơi, tối ưu cho cả desktop và mobile

## Tech Stack

| Công nghệ | Mục đích |
|-----------|----------|
| **Next.js 16** (App Router, Turbopack) | Framework chính |
| **React 19** | UI |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling, multi-theme |
| **Prisma** | ORM, PostgreSQL |
| **NextAuth v4** | Authentication (Google OAuth) |
| **Monaco Editor** | Code editor |
| **Piston API** | Code execution |
| **Zustand** | State management |

## Chạy local

### Yêu cầu

- Node.js >= 18
- PostgreSQL (chạy local hoặc dùng Docker)
- npm hoặc yarn

### Các bước

```bash
# 1. Clone repo
git clone https://github.com/<your-username>/learning-c.git
cd learning-c

# 2. Cài dependencies
npm install

# 3. Tạo file .env.local
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/clearn?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
PISTON_URL="https://emkc.org/api/v2/piston"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
EOF

# 4. Tạo database và seed dữ liệu
npx prisma migrate dev --name init
npx prisma db seed

# 5. Chạy dev server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

### Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Build production |
| `npm run start` | Start production server |
| `npm run lint` | Kiểm tra code |
| `npx prisma db seed` | Seed database với dữ liệu bài học & bài tập |

## Cấu trúc thư mục

```
src/
├── app/              # Pages (App Router)
│   ├── learn/        # Module học
│   ├── problems/     # Bài tập
│   ├── profile/      # Trang cá nhân
│   ├── leaderboard/  # Bảng xếp hạng
│   └── settings/     # Cài đặt
├── components/       # React components
│   ├── editor/       # Code editor & output
│   ├── problems/     # Problem card, filters
│   ├── learn/        # Lesson & module UI
│   ├── submissions/  # Submission history
│   ├── profile/      # Profile UI
│   └── ui/           # UI primitives
├── data/             # Static data mapping
├── store/            # Zustand stores
├── hooks/            # Custom hooks
└── lib/              # Utilities (prisma, auth, judge)
prisma/
├── schema.prisma     # Database schema
├── seed.ts           # Seed script
└── seed-data/        # Seed data (problems, lessons)
```

## API Endpoints

| Route | Mô tả |
|-------|-------|
| `GET /api/problems` | Danh sách bài tập |
| `GET /api/problems/[id]` | Chi tiết bài tập |
| `POST /api/submissions` | Nộp bài |
| `GET /api/submissions` | Lịch sử nộp bài |
| `POST /api/judge` | Chạy code với test cases |
| `POST /api/execute` | Chạy code đơn lẻ |
| `GET /api/modules` | Danh sách module |
| `GET /api/modules/[slug]` | Chi tiết module |
| `GET /api/leaderboard` | Bảng xếp hạng |
| `GET /api/streak` | Streak hiện tại |
| `POST /api/progress` | Cập nhật tiến độ |

## License

MIT
