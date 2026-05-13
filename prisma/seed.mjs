import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

const lessonsData = [
  { id: 'nhap-mon', moduleOrder: 1, title: 'Module 1: Nhập môn C', starterCode: '' },
  { id: 'bien-kieu-dulieu', moduleOrder: 2, title: 'Module 2: Biến & Kiểu dữ liệu', starterCode: '' },
  { id: 'toan-tu', moduleOrder: 3, title: 'Module 3: Toán tử', starterCode: '' },
  { id: 'dieu-kien', moduleOrder: 4, title: 'Module 4: Điều kiện', starterCode: '' },
  { id: 'vong-lap', moduleOrder: 5, title: 'Module 5: Vòng lặp', starterCode: '' },
  { id: 'ham', moduleOrder: 6, title: 'Module 6: Hàm', starterCode: '' },
  { id: 'mang', moduleOrder: 7, title: 'Module 7: Mảng', starterCode: '' },
  { id: 'chuoi', moduleOrder: 8, title: 'Module 8: Chuỗi', starterCode: '' },
  { id: 'con-tro', moduleOrder: 9, title: 'Module 9: Con trỏ', starterCode: '' },
  { id: 'struct-union', moduleOrder: 10, title: 'Module 10: Struct & Union', starterCode: '' },
  { id: 'file-io', moduleOrder: 11, title: 'Module 11: File I/O', starterCode: '' },
  { id: 'thuat-toan', moduleOrder: 12, title: 'Module 12: Thuật toán', starterCode: '' },
  { id: 'de-quy', moduleOrder: 13, title: 'Module 13: Đệ quy chuyên sâu', starterCode: '' },
  { id: 'cap-phat-dong', moduleOrder: 14, title: 'Module 14: Cấp phát bộ nhớ động', starterCode: '' },
  { id: 'preprocessor', moduleOrder: 15, title: 'Module 15: Preprocessor & Macro', starterCode: '' },
  { id: 'cau-truc-du-lieu', moduleOrder: 16, title: 'Module 16: Cấu trúc dữ liệu', starterCode: '' },
  { id: 'con-tro-nang-cao', moduleOrder: 17, title: 'Module 17: Con trỏ nâng cao', starterCode: '' },
  { id: 'thu-vien-chuan', moduleOrder: 18, title: 'Module 18: Thư viện chuẩn C', starterCode: '' },
  { id: 'lap-trinh-he-thong', moduleOrder: 19, title: 'Module 19: Lập trình hệ thống', starterCode: '' },
  { id: 'bitwise-nang-cao', moduleOrder: 20, title: 'Module 20: Thao tác bit nâng cao', starterCode: '' },
  { id: 'debug-toi-uu', moduleOrder: 21, title: 'Module 21: Debug & Tối ưu', starterCode: '' },
  { id: 'thiet-ke-chuong-trinh', moduleOrder: 22, title: 'Module 22: Thiết kế chương trình', starterCode: '' },
]

const challengeLessons = [
  { id: 'nhap-mon-challenge', moduleId: 'nhap-mon', title: 'Thực hành: Chương trình chào hỏi' },
  { id: 'bien-kieu-dulieu-challenge', moduleId: 'bien-kieu-dulieu', title: 'Thực hành: Bộ chuyển đổi nhiệt độ' },
  { id: 'toan-tu-challenge', moduleId: 'toan-tu', title: 'Thực hành: Máy tính cơ bản' },
  { id: 'dieu-kien-challenge', moduleId: 'dieu-kien', title: 'Thực hành: Giải phương trình bậc 2' },
  { id: 'vong-lap-challenge', moduleId: 'vong-lap', title: 'Thực hành: Tam giác số' },
]

const problemsData = [
  {
    id: 'hello-world',
    title: 'Hello, World!',
    description: 'Viết chương trình in ra "Hello, World!" trên một dòng.',
    difficulty: 'easy',
    starterCode: '#include <stdio.h>\n\nint main() {\n    // In ra "Hello, World!"\n    \n    return 0;\n}',
    solution: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    explanation: 'Sử dụng printf() để in ra màn hình.',
    inputFormat: 'Không có input.',
    constraints: '',
    sampleInput: '',
    sampleOutput: 'Hello, World!',
    testCases: [
      { input: '', expectedOutput: 'Hello, World!\n', isHidden: false },
    ],
  },
  {
    id: 'nhap-xuat',
    title: 'Nhập và Xuất',
    description: 'Viết chương trình nhập một ký tự từ bàn phím và in ra mã ASCII của nó.',
    difficulty: 'easy',
    starterCode: '#include <stdio.h>\n\nint main() {\n    char ch;\n    \n    return 0;\n}',
    solution: '#include <stdio.h>\n\nint main() {\n    char ch;\n    scanf("%c", &ch);\n    printf("%d\\n", ch);\n    return 0;\n}',
    explanation: 'Dùng scanf("%c", &ch) để nhập ký tự, printf("%d", ch) để in mã ASCII.',
    inputFormat: 'Một ký tự.',
    constraints: '',
    sampleInput: 'A',
    sampleOutput: '65',
    testCases: [
      { input: 'A\n', expectedOutput: '65\n', isHidden: false },
      { input: 'z\n', expectedOutput: '122\n', isHidden: true },
    ],
  },
  {
    id: 'tinh-tong',
    title: 'Tính Tổng',
    description: 'Viết chương trình nhập hai số nguyên và in ra tổng của chúng.',
    difficulty: 'easy',
    starterCode: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    \n    return 0;\n}',
    solution: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("%d\\n", a + b);\n    return 0;\n}',
    explanation: 'Sử dụng scanf để nhập hai số, tính tổng và in ra.',
    inputFormat: 'Một dòng gồm hai số nguyên a, b.',
    constraints: '-10^9 ≤ a, b ≤ 10^9',
    sampleInput: '3 5',
    sampleOutput: '8',
    testCases: [
      { input: '3 5\n', expectedOutput: '8\n', isHidden: false },
      { input: '-10 20\n', expectedOutput: '10\n', isHidden: true },
    ],
  },
]

async function main() {
  console.log('🌱 Starting seed...')

  const existing = await prisma.module.count()
  if (existing > 0) {
    console.log('  ✓ Data already exists, skipping seed')
    return
  }

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

  for (const lesson of lessonsData) {
    await prisma.lesson.create({
      data: {
        id: lesson.id,
        moduleId: lesson.id,
        title: lesson.title,
        contentMd: '',
        starterCode: lesson.starterCode,
        orderIndex: lesson.moduleOrder,
        lessonType: 'theory',
      },
    })
  }
  console.log(`  ✓ Created ${lessonsData.length} theory lessons`)

  for (const cl of challengeLessons) {
    await prisma.lesson.create({
      data: {
        id: cl.id,
        moduleId: cl.moduleId,
        title: cl.title,
        contentMd: '',
        starterCode: '',
        orderIndex: 2,
        lessonType: 'challenge',
      },
    })
  }
  console.log(`  ✓ Created ${challengeLessons.length} challenge lessons`)

  for (const problem of problemsData) {
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

    for (const tc of problem.testCases) {
      await prisma.testCase.create({
        data: {
          problemId: created.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden,
          weight: 1,
        },
      })
    }
  }
  console.log(`  ✓ Created ${problemsData.length} problems with test cases`)

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
