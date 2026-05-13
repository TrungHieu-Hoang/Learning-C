import { PrismaClient } from '@prisma/client'
import { lessons } from './seed-data/lessons'
import { problems } from './seed-data/problems'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Skip if already seeded (non-destructive — keeps user data on restart)
  const existing = await prisma.module.count()
  if (existing > 0) {
    console.log('  ✓ Data already exists, skipping seed')
    return
  }

  // Create modules
  const modulesData = [
    { id: 'nhap-mon', title: 'Nhập môn C', description: 'Hello World, cấu trúc chương trình, compile, biên dịch với GCC', orderIndex: 1 },
    { id: 'bien-kieu-dulieu', title: 'Biến & Kiểu dữ liệu', description: 'int, float, char, double, sizeof, khai báo và khởi tạo biến', orderIndex: 2 },
    { id: 'toan-tu', title: 'Toán tử', description: 'Số học, so sánh, logic, bitwise, độ ưu tiên toán tử', orderIndex: 3 },
    { id: 'dieu-kien', title: 'Điều kiện', description: 'if/else, switch-case, ternary operator, cấu trúc rẽ nhánh', orderIndex: 4 },
    { id: 'vong-lap', title: 'Vòng lặp', description: 'for, while, do-while, break/continue, lồng vòng lặp', orderIndex: 5 },
    { id: 'ham', title: 'Hàm', description: 'Khai báo hàm, tham số, return, đệ quy, function pointer', orderIndex: 6 },
    { id: 'mang', title: 'Mảng', description: '1D array, 2D array, thao tác cơ bản, truyền mảng vào hàm', orderIndex: 7 },
    { id: 'chuoi', title: 'Chuỗi', description: 'string.h, scanf/gets, xử lý ký tự, các hàm xử lý chuỗi', orderIndex: 8 },
    { id: 'con-tro', title: 'Con trỏ', description: 'Địa chỉ, dereference, pointer arithmetic, con trỏ và mảng', orderIndex: 9 },
    { id: 'struct-union', title: 'Struct & Union', description: 'Khai báo struct, union, typedef, nested struct', orderIndex: 10 },
    { id: 'file-io', title: 'File I/O', description: 'fopen, fread, fwrite, fclose, đọc ghi file nhị phân', orderIndex: 11 },
    { id: 'thuat-toan', title: 'Thuật toán', description: 'Sort, search, đệ quy nâng cao, độ phức tạp', orderIndex: 12 },
    { id: 'de-quy', title: 'Đệ quy chuyên sâu', description: 'Quay lui, chia để trị, nhánh cận, đệ quy có nhớ', orderIndex: 13 },
    { id: 'cap-phat-dong', title: 'Cấp phát bộ nhớ động', description: 'malloc, calloc, realloc, free, memory leak, valgrind', orderIndex: 14 },
    { id: 'preprocessor', title: 'Preprocessor & Macro', description: '#define, #ifdef, #include, #pragma, macro function', orderIndex: 15 },
    { id: 'cau-truc-du-lieu', title: 'Cấu trúc dữ liệu', description: 'Stack, Queue, Linked List, Tree, Binary Search Tree', orderIndex: 16 },
    { id: 'con-tro-nang-cao', title: 'Con trỏ nâng cao', description: 'Function pointer, void pointer, con trỏ cấp 2, callback', orderIndex: 17 },
    { id: 'thu-vien-chuan', title: 'Thư viện chuẩn C', description: 'math.h, stdlib.h, time.h, string.h, assert.h, setjmp.h', orderIndex: 18 },
    { id: 'lap-trinh-he-thong', title: 'Lập trình hệ thống', description: 'argc/argv, environment, file system, process, signal', orderIndex: 19 },
    { id: 'bitwise-nang-cao', title: 'Thao tác bit nâng cao', description: 'Bit mask, set/clear/toggle, endianness, checksum, flag', orderIndex: 20 },
    { id: 'debug-toi-uu', title: 'Debug & Tối ưu', description: 'gdb, assert, profiling, inline, restrict, align, cache', orderIndex: 21 },
    { id: 'thiet-ke-chuong-trinh', title: 'Thiết kế chương trình', description: 'Modular, header files, makefile, static/shared library', orderIndex: 22 },
  ]

  for (const mod of modulesData) {
    await prisma.module.create({
      data: {
        id: mod.id,
        title: mod.title,
        description: mod.description,
        orderIndex: mod.orderIndex,
        isLocked: mod.id !== 'nhap-mon',
      },
    })
  }
  console.log(`  ✓ Created ${modulesData.length} modules`)

  // Create lessons (one per module)
  for (const lesson of lessons) {
    await prisma.lesson.create({
      data: {
        id: lesson.id,
        moduleId: lesson.id,
        title: lesson.title,
        contentMd: lesson.content,
        starterCode: lesson.starterCode,
        orderIndex: lesson.moduleOrder,
        lessonType: 'theory',
      },
    })
  }
  console.log(`  ✓ Created ${lessons.length} lessons`)

  // Create challenge lessons for the first 5 modules
  const challengeLessons = [
    { id: 'nhap-mon-challenge', moduleId: 'nhap-mon', title: 'Thực hành: Chương trình chào hỏi', orderIndex: 2 },
    { id: 'bien-kieu-dulieu-challenge', moduleId: 'bien-kieu-dulieu', title: 'Thực hành: Bộ chuyển đổi nhiệt độ', orderIndex: 2 },
    { id: 'toan-tu-challenge', moduleId: 'toan-tu', title: 'Thực hành: Máy tính cơ bản', orderIndex: 2 },
    { id: 'dieu-kien-challenge', moduleId: 'dieu-kien', title: 'Thực hành: Giải phương trình bậc 2', orderIndex: 2 },
    { id: 'vong-lap-challenge', moduleId: 'vong-lap', title: 'Thực hành: Tam giác số', orderIndex: 2 },
  ]
  for (const cl of challengeLessons) {
    await prisma.lesson.create({
      data: {
        id: cl.id,
        moduleId: cl.moduleId,
        title: cl.title,
        contentMd: '',
        starterCode: '',
        orderIndex: cl.orderIndex,
        lessonType: 'challenge',
      },
    })
  }
  console.log(`  ✓ Created ${challengeLessons.length} challenge lessons`)

  // Create problems and test cases
  for (const problem of problems) {
    const created = await prisma.problem.create({
      data: {
        id: problem.id,
        lessonId: 'nhap-mon',
        source: 'custom',
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        timeLimit: 5,
        memoryLimit: 256,
        starterCode: problem.starterCode,
        solution: problem.solution,
        explanation: problem.explanation,
        inputFormat: problem.inputFormat,
        constraints: problem.constraints,
        sampleInput: problem.sampleInput,
        sampleOutput: problem.sampleOutput,
      },
    })

    // Create test cases for this problem
    for (let i = 0; i < problem.testCases.length; i++) {
      const tc = problem.testCases[i]
      await prisma.testCase.create({
        data: {
          problemId: created.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden,
          weight: tc.isHidden ? Math.ceil(70 / problem.testCases.filter(t => t.isHidden).length) : Math.floor(30 / problem.testCases.filter(t => !t.isHidden).length) || 1,
        },
      })
    }
  }
  console.log(`  ✓ Created ${problems.length} problems with test cases`)

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
