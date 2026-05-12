'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { TestCasePanel } from '@/components/editor/TestCasePanel'
import { LessonContent } from '@/components/learn/LessonContent'
import { useJudge } from '@/hooks/useJudge'
import { useEditorStore } from '@/store/editorStore'

const lessonData: Record<string, { title: string; content: string; starterCode: string }> = {
  'nhap-mon': {
    title: 'Module 1: Nhập môn C',
    content: `## Giới thiệu về C

C là ngôn ngữ lập trình mạnh mẽ và phổ biến, được tạo ra bởi Dennis Ritchie vào năm 1972. Đây là nền tảng của nhiều ngôn ngữ hiện đại như C++, Java, và Python.

## Cấu trúc chương trình C

Một chương trình C cơ bản gồm:

\`\`\`c
#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}
\`\`\`

### Giải thích:
- \`#include <stdio.h>\` — Thư viện nhập xuất chuẩn
- \`int main()\` — Hàm chính, nơi chương trình bắt đầu
- \`printf()\` — Hàm in ra màn hình
- \`return 0\` — Kết thúc chương trình thành công

## Compile và chạy

\`\`\`bash
gcc program.c -o program
./program
\`\`\`

## Bài tập thực hành

Hãy viết chương trình in ra câu "Xin chao, toi hoc C!"`,
    starterCode: `#include <stdio.h>

int main() {
    // In ra dòng chữ "Xin chao, toi hoc C!"

    return 0;
}`,
  },
  'bien-kieu-dulieu': {
    title: 'Module 2: Biến & Kiểu dữ liệu',
    content: `## Biến trong C

Biến dùng để lưu trữ dữ liệu trong bộ nhớ.

## Các kiểu dữ liệu cơ bản

| Kiểu | Kích thước | Khoảng giá trị |
|------|-----------|----------------|
| \`int\` | 4 bytes | -2.1B đến 2.1B |
| \`float\` | 4 bytes | ±1.2E-38 đến ±3.4E38 |
| \`double\` | 8 bytes | ±2.3E-308 đến ±1.7E308 |
| \`char\` | 1 byte | -128 đến 127 |

## Ví dụ

\`\`\`c
int age = 20;
float pi = 3.14;
char grade = 'A';

printf("Tuoi: %d, Pi: %.2f, Diem: %c\\n", age, pi, grade);
\`\`\`

## Hãy thử:

Khai báo các biến và in chúng ra.`,
    starterCode: `#include <stdio.h>

int main() {
    // Khai báo biến
    int tuoi = 18;
    float chieu_cao = 1.75;
    char chu_cai = 'C';

    // In ra màn hình
    printf("Tuoi: %d\\n", tuoi);
    printf("Chieu cao: %.2f\\n", chieu_cao);
    printf("Chu cai: %c\\n", chu_cai);

    return 0;
}`,
  },
  'toan-tu': {
    title: 'Module 3: Toán tử',
    content: `## Toán tử trong C

### Toán tử số học
\`\`\`c
+   -   *   /   %
\`\`\`

### Toán tử so sánh
\`\`\`c
==  !=  >   <   >=  <=
\`\`\`

### Toán tử logic
\`\`\`c
&&  ||  !
\`\`\`

## Ví dụ

\`\`\`c
int a = 10, b = 3;
printf("Tong: %d\\n", a + b);
printf("Thuong: %.2f\\n", (float)a / b);
printf("So du: %d\\n", a % b);
\`\`\``,
    starterCode: `#include <stdio.h>

int main() {
    int a = 15, b = 4;

    // Tính và in ra tổng, hiệu, tích, thương, số dư

    return 0;
}`,
  },
  'dieu-kien': {
    title: 'Module 4: Điều kiện',
    content: `## Câu lệnh điều kiện trong C

### if / else
\`\`\`c
if (dieu_kien) {
    // thuc thi neu dung
} else if (dieu_kien2) {
    // thuc thi neu dieu_kien sai va dieu_kien2 dung
} else {
    // thuc thi neu tat ca deu sai
}
\`\`\`

### switch-case
\`\`\`c
switch (bien) {
    case 1: printf("Mot"); break;
    case 2: printf("Hai"); break;
    default: printf("Khac");
}
\`\`\`

### Toán tử ba ngôi (Ternary)
\`\`\`c
int max = (a > b) ? a : b;
\`\`\`

## Ví dụ: Kiểm tra số chẵn lẻ
\`\`\`c
int n = 7;
if (n % 2 == 0)
    printf("%d la so chan", n);
else
    printf("%d la so le", n);
\`\`\``,
    starterCode: `#include <stdio.h>

int main() {
    int n;
    printf("Nhap mot so: ");
    scanf("%d", &n);

    // Kiem tra so am, duong, hay bang 0

    return 0;
}`,
  },
  'vong-lap': {
    title: 'Module 5: Vòng lặp',
    content: `## Vòng lặp trong C

### for
\`\`\`c
for (khoi_tao; dieu_kien; tang_giam) {
    // than vong lap
}
\`\`\`

### while
\`\`\`c
while (dieu_kien) {
    // than vong lap
}
\`\`\`

### do-while
\`\`\`c
do {
    // than vong lap (chay it nhat 1 lan)
} while (dieu_kien);
\`\`\`

### break / continue
- \`break\`: thoát vòng lặp ngay lập tức
- \`continue\`: bỏ qua phần còn lại, chuyển sang vòng lặp kế tiếp

## Ví dụ: In số từ 1 đến 5
\`\`\`c
for (int i = 1; i <= 5; i++) {
    printf("%d ", i);
}
// Output: 1 2 3 4 5
\`\`\``,
    starterCode: `#include <stdio.h>

int main() {
    // In cac so tu 1 den 10, bo qua so 5
    for (int i = 1; i <= 10; i++) {
        if (i == 5) continue;
        printf("%d ", i);
    }
    return 0;
}`,
  },
  'ham': {
    title: 'Module 6: Hàm',
    content: `## Hàm trong C

### Khai báo hàm
\`\`\`c
// Khai bao (prototype)
int cong(int a, int b);

// Dinh nghia
int cong(int a, int b) {
    return a + b;
}
\`\`\`

### Tham số và giá trị trả về
- Hàm có thể nhận tham số hoặc không
- \`void\` nếu không trả về giá trị
- Truyền tham số theo \`value\`

### Đệ quy
\`\`\`c
int giaiThua(int n) {
    if (n <= 1) return 1;
    return n * giaiThua(n - 1);
}
\`\`\`

## Ví dụ
\`\`\`c
int max(int a, int b) {
    return (a > b) ? a : b;
}

int main() {
    printf("%d", max(5, 3)); // 5
}
\`\`\``,
    starterCode: `#include <stdio.h>

// Viet ham tinh tong cac so tu 1 den n
int tong(int n) {
    // ...

}

int main() {
    int n = 10;
    printf("Tong tu 1 den %d la %d", n, tong(n));
    return 0;
}`,
  },
  'mang': {
    title: 'Module 7: Mảng',
    content: `## Mảng trong C

### Mảng 1 chiều
\`\`\`c
int arr[5] = {1, 2, 3, 4, 5};
printf("%d", arr[0]); // 1
\`\`\`

### Mảng 2 chiều
\`\`\`c
int matrix[2][3] = {{1,2,3}, {4,5,6}};
printf("%d", matrix[1][2]); // 6
\`\`\`

### Duyệt mảng
\`\`\`c
int arr[5] = {10, 20, 30, 40, 50};
for (int i = 0; i < 5; i++) {
    printf("%d ", arr[i]);
}
\`\`\`

### Truyền mảng vào hàm
\`\`\`c
void inMang(int arr[], int n) {
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
}
\`\`\``,
    starterCode: `#include <stdio.h>

int main() {
    int arr[] = {5, 2, 8, 1, 9};
    int n = 5;

    // Tim gia tri lon nhat trong mang
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
    }

    printf("Gia tri lon nhat: %d", max);
    return 0;
}`,
  },
  'chuoi': {
    title: 'Module 8: Chuỗi',
    content: `## Chuỗi trong C

### Khai báo chuỗi
\`\`\`c
char str[20] = "Hello";
char str2[] = {'H','i','\\0'};
\`\`\`

### Thư viện string.h
\`\`\`c
#include <string.h>

strlen(s)      // do dai chuoi
strcpy(dest, src)  // copy chuoi
strcat(dest, src)  // noi chuoi
strcmp(s1, s2)     // so sanh (== 0 neu bang)
\`\`\`

### Nhập chuỗi
\`\`\`c
char s[100];
scanf("%s", s);        // khong co dau cach
fgets(s, 100, stdin);  // co dau cach
\`\`\`

## Ví dụ
\`\`\`c
char name[50];
printf("Nhap ten: ");
fgets(name, 50, stdin);
printf("Xin chao, %s", name);
\`\`\``,
    starterCode: `#include <stdio.h>
#include <string.h>

int main() {
    char str[] = "Lap trinh C";
    int len = strlen(str);
    printf("Chuoi: %s\\n", str);
    printf("Do dai: %d\\n", len);

    // In chuoi dao nguoc
    for (int i = len - 1; i >= 0; i--)
        printf("%c", str[i]);

    return 0;
}`,
  },
  'con-tro': {
    title: 'Module 9: Con trỏ',
    content: `## Con trỏ trong C

### Khai báo và sử dụng
\`\`\`c
int x = 10;
int *ptr = &x;   // ptr tro den dia chi cua x
printf("%d", *ptr); // 10 (toan tu dereference)
\`\`\`

### Pointer Arithmetic
\`\`\`c
int arr[3] = {10, 20, 30};
int *p = arr;
printf("%d", *(p + 1)); // 20
\`\`\`

### Con trỏ và mảng
\`\`\`c
int arr[3] = {1, 2, 3};
int *p = arr;
for (int i = 0; i < 3; i++)
    printf("%d ", *(p + i));
\`\`\`

### NULL pointer
\`\`\`c
int *p = NULL;
if (p != NULL) {
    *p = 10;
}
\`\`\`

## Ví dụ: Hoán đổi giá trị
\`\`\`c
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
\`\`\``,
    starterCode: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 5, y = 10;
    printf("Truoc: x=%d, y=%d\\n", x, y);
    swap(&x, &y);
    printf("Sau: x=%d, y=%d\\n", x, y);
    return 0;
}`,
  },
  'struct-union': {
    title: 'Module 10: Struct & Union',
    content: `## Struct trong C

### Khai báo struct
\`\`\`c
struct SinhVien {
    char ten[50];
    int tuoi;
    float diem;
};

struct SinhVien sv1 = {"An", 20, 8.5};
printf("%s %.1f", sv1.ten, sv1.diem);
\`\`\`

### typedef
\`\`\`c
typedef struct {
    int x, y;
} Diem;

Diem p1 = {3, 4};
\`\`\`

### Union
\`\`\`c
union Data {
    int i;
    float f;
    char str[20];
}; // Dung chung bo nho, kich thuoc = thanh vien lon nhat
\`\`\`

### Nested struct
\`\`\`c
struct Diem { int x, y; };
struct HinhChuNhat {
    struct Diem traiTren;
    struct Diem phaiDuoi;
};
\`\`\``,
    starterCode: `#include <stdio.h>

typedef struct {
    char ten[50];
    int tuoi;
    float diem;
} SinhVien;

int main() {
    SinhVien sv = {"Nguyen Van A", 20, 9.0};
    printf("Ten: %s\\n", sv.ten);
    printf("Tuoi: %d\\n", sv.tuoi);
    printf("Diem: %.1f\\n", sv.diem);
    return 0;
}`,
  },
  'file-io': {
    title: 'Module 11: File I/O',
    content: `## Thao tác với file trong C

### Mở file
\`\`\`c
FILE *f = fopen("data.txt", "r"); // doc
FILE *f = fopen("data.txt", "w"); // ghi
FILE *f = fopen("data.txt", "a"); // them
\`\`\`

### Đọc file
\`\`\`c
char buffer[255];
while (fgets(buffer, 255, f) != NULL) {
    printf("%s", buffer);
}
\`\`\`

### Ghi file
\`\`\`c
fprintf(f, "Hello, file!\\n");
fputc('A', f);
fputs("Chuoi", f);
\`\`\`

### Đọc/ghi nhị phân
\`\`\`c
fread(&data, sizeof(data), 1, f);
fwrite(&data, sizeof(data), 1, f);
\`\`\`

### Đóng file
\`\`\`c
fclose(f);
\`\`\`

## Ví dụ
\`\`\`c
FILE *f = fopen("hello.txt", "w");
fprintf(f, "Xin chao the gioi!");
fclose(f);
\`\`\``,
    starterCode: `#include <stdio.h>

int main() {
    FILE *f = fopen("output.txt", "w");
    if (f == NULL) {
        printf("Khong the mo file!");
        return 1;
    }
    fprintf(f, "Lap trinh C that thu vi!");
    fclose(f);
    printf("Da ghi file thanh cong.");
    return 0;
}`,
  },
  'thuat-toan': {
    title: 'Module 12: Thuật toán',
    content: `## Thuật toán cơ bản trong C

### Sắp xếp nổi bọt (Bubble Sort)
\`\`\`c
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
}
\`\`\`

### Tìm kiếm nhị phân
\`\`\`c
int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] == x) return mid;
        if (arr[mid] < x) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}
\`\`\`

### Độ phức tạp (Big O)
- O(1): Truy cập mảng
- O(n): Vòng lặp đơn
- O(n²): Vòng lặp lồng nhau
- O(log n): Tìm kiếm nhị phân

## Ví dụ
\`\`\`c
int arr[] = {64, 34, 25, 12, 22, 11, 90};
int n = sizeof(arr)/sizeof(arr[0]);
bubbleSort(arr, n);
// arr = {11, 12, 22, 25, 34, 64, 90}
\`\`\``,
    starterCode: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    // Cai dat thuat toan sap xep noi bot
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr)/sizeof(arr[0]);

    bubbleSort(arr, n);

    printf("Mang sau khi sap xep: ");
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);

    return 0;
}`,
  },
}

export default function LessonPage() {
  const params = useParams()
  const slug = params.slug as string
  const [activeTab, setActiveTab] = useState<'theory' | 'editor' | 'result'>('theory')
  const { handleRun, testResults, showTestPanel, isRunning } = useJudge()
  const reset = useEditorStore((s) => s.reset)
  const lesson = lessonData[slug]

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#f38ba8] font-mono mb-2">404</h1>
        <p className="text-[#6c7086] font-mono">Bài học không tồn tại</p>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row">
      {/* Mobile tabs */}
      <div className="lg:hidden flex border-b border-[#313244]">
        {(['theory', 'editor', 'result'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 text-sm font-mono transition-colors ${
              activeTab === tab
                ? 'text-[#a6e3a1] border-b-2 border-[#a6e3a1] bg-[#181825]'
                : 'text-[#6c7086] hover:text-[#a6adc8]'
            }`}
          >
            {tab === 'theory' ? 'Lý thuyết' : tab === 'editor' ? 'Editor' : 'Kết quả'}
          </button>
        ))}
      </div>

      {/* Theory panel */}
      <div className={`lg:w-1/2 xl:w-3/5 border-r border-[#313244] overflow-hidden ${
        activeTab !== 'theory' ? 'hidden lg:flex' : 'flex-1'
      }`}>
        <LessonContent content={lesson.content} title={lesson.title} />
      </div>

      {/* Right panel: Editor + Output */}
      <div className={`lg:w-1/2 xl:w-2/5 flex flex-col overflow-hidden ${
        activeTab !== 'editor' && activeTab !== 'result' ? 'hidden lg:flex' : 'flex-1'
      }`}>
        <div className="flex-1 min-h-[200px]">
          <CodeEditor
            autoSaveKey={`lesson-${slug}`}
            onRun={handleRun}
            onReset={() => reset(lesson.starterCode)}
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
