export interface LessonItem {
  id: string
  title: string
  contentMd: string
  starterCode: string
  lessonType: string
}

export interface ModuleItem {
  id: string
  title: string
  description: string
  orderIndex: number
  isLocked: boolean
  lessons: LessonItem[]
}

export const modulesData: ModuleItem[] = [
  {
    id: 'nhap-mon', title: 'Nhập môn C', description: 'Hello World, cấu trúc chương trình, compile, biên dịch với GCC', orderIndex: 1, isLocked: false,
    lessons: [{ id: 'nhap-mon', title: 'Module 1: Nhập môn C', contentMd: `## Giới thiệu về C

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
    // In ra dong chu "Xin chao, toi hoc C!"

    return 0;
}`,
      lessonType: 'theory' },
      { id: 'nhap-mon-challenge', title: 'Thực hành: Chương trình chào hỏi', contentMd: '', starterCode: '', lessonType: 'challenge' }]
  },
  {
    id: 'bien-kieu-dulieu', title: 'Biến & Kiểu dữ liệu', description: 'int, float, char, double, sizeof, khai báo và khởi tạo biến', orderIndex: 2, isLocked: false,
    lessons: [{ id: 'bien-kieu-dulieu', title: 'Module 2: Biến & Kiểu dữ liệu', contentMd: `## Biến trong C

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
    // Khai bao bien
    int tuoi = 18;
    float chieu_cao = 1.75;
    char chu_cai = 'C';

    // In ra man hinh
    printf("Tuoi: %d\\n", tuoi);
    printf("Chieu cao: %.2f\\n", chieu_cao);
    printf("Chu cai: %c\\n", chu_cai);

    return 0;
}`,
      lessonType: 'theory' },
      { id: 'bien-kieu-dulieu-challenge', title: 'Thực hành: Bộ chuyển đổi nhiệt độ', contentMd: '', starterCode: '', lessonType: 'challenge' }]
  },
  {
    id: 'toan-tu', title: 'Toán tử', description: 'Số học, so sánh, logic, bitwise, độ ưu tiên toán tử', orderIndex: 3, isLocked: false,
    lessons: [{ id: 'toan-tu', title: 'Module 3: Toán tử', contentMd: `## Toán tử trong C

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

    // Tinh va in ra tong, hieu, tich, thuong, so du

    return 0;
}`,
      lessonType: 'theory' },
      { id: 'toan-tu-challenge', title: 'Thực hành: Máy tính cơ bản', contentMd: '', starterCode: '', lessonType: 'challenge' }]
  },
  {
    id: 'dieu-kien', title: 'Điều kiện', description: 'if/else, switch-case, ternary operator, cấu trúc rẽ nhánh', orderIndex: 4, isLocked: false,
    lessons: [{ id: 'dieu-kien', title: 'Module 4: Điều kiện', contentMd: `## Câu lệnh điều kiện trong C

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
      lessonType: 'theory' },
      { id: 'dieu-kien-challenge', title: 'Thực hành: Giải phương trình bậc 2', contentMd: '', starterCode: '', lessonType: 'challenge' }]
  },
  {
    id: 'vong-lap', title: 'Vòng lặp', description: 'for, while, do-while, break/continue, lồng vòng lặp', orderIndex: 5, isLocked: false,
    lessons: [{ id: 'vong-lap', title: 'Module 5: Vòng lặp', contentMd: `## Vòng lặp trong C

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
      lessonType: 'theory' },
      { id: 'vong-lap-challenge', title: 'Thực hành: Tam giác số', contentMd: '', starterCode: '', lessonType: 'challenge' }]
  },
  {
    id: 'ham', title: 'Hàm', description: 'Khai báo hàm, tham số, return, đệ quy, function pointer', orderIndex: 6, isLocked: false,
    lessons: [{ id: 'ham', title: 'Module 6: Hàm', contentMd: `## Hàm trong C

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
      lessonType: 'theory' }]
  },
  {
    id: 'mang', title: 'Mảng', description: '1D array, 2D array, thao tác cơ bản, truyền mảng vào hàm', orderIndex: 7, isLocked: false,
    lessons: [{ id: 'mang', title: 'Module 7: Mảng', contentMd: `## Mảng trong C

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
      lessonType: 'theory' }]
  },
  {
    id: 'chuoi', title: 'Chuỗi', description: 'string.h, scanf/gets, xử lý ký tự, các hàm xử lý chuỗi', orderIndex: 8, isLocked: false,
    lessons: [{ id: 'chuoi', title: 'Module 8: Chuỗi', contentMd: `## Chuỗi trong C

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
      lessonType: 'theory' }]
  },
  {
    id: 'con-tro', title: 'Con trỏ', description: 'Địa chỉ, dereference, pointer arithmetic, con trỏ và mảng', orderIndex: 9, isLocked: false,
    lessons: [{ id: 'con-tro', title: 'Module 9: Con trỏ', contentMd: `## Con trỏ trong C

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
      lessonType: 'theory' }]
  },
  {
    id: 'struct-union', title: 'Struct & Union', description: 'Khai báo struct, union, typedef, nested struct', orderIndex: 10, isLocked: false,
    lessons: [{ id: 'struct-union', title: 'Module 10: Struct & Union', contentMd: `## Struct trong C

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
      lessonType: 'theory' }]
  },
  {
    id: 'file-io', title: 'File I/O', description: 'fopen, fread, fwrite, fclose, đọc ghi file nhị phân', orderIndex: 11, isLocked: false,
    lessons: [{ id: 'file-io', title: 'Module 11: File I/O', contentMd: `## Thao tác với file trong C

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
      lessonType: 'theory' }]
  },
  {
    id: 'thuat-toan', title: 'Thuật toán', description: 'Sort, search, đệ quy nâng cao, độ phức tạp', orderIndex: 12, isLocked: false,
    lessons: [{ id: 'thuat-toan', title: 'Module 12: Thuật toán', contentMd: `## Thuật toán cơ bản trong C

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
      lessonType: 'theory' }]
  },
  {
    id: 'de-quy', title: 'Đệ quy chuyên sâu', description: 'Quay lui, chia để trị, nhánh cận, đệ quy có nhớ', orderIndex: 13, isLocked: false,
    lessons: [{ id: 'de-quy', title: 'Module 13: Đệ quy chuyên sâu', contentMd: `## Đệ quy nâng cao

### Đệ quy quay lui (Backtracking)
Kỹ thuật thử-sai: thử từng lựa chọn, nếu sai thì quay lại bước trước.

\`\`\`c
// In tat ca nhi phan do dai n
void binary(int n, int arr[], int i) {
    if (i == n) {
        for (int j = 0; j < n; j++) printf("%d", arr[j]);
        printf("\\n"); return;
    }
    arr[i] = 0; binary(n, arr, i+1);
    arr[i] = 1; binary(n, arr, i+1);
}
\`\`\`

### Chia để trị (Divide and Conquer)
Chia bài toán thành các bài toán con, giải đệ quy, kết hợp kết quả.

\`\`\`c
int power(int x, int n) {
    if (n == 0) return 1;
    int half = power(x, n/2);
    if (n % 2 == 0) return half * half;
    else return half * half * x;
}
\`\`\`

### Đệ quy có nhớ (Memoization)
Lưu kết quả đã tính để tránh tính lại.

\`\`\`c
int fib[100] = {0};
int fib_memo(int n) {
    if (n <= 1) return n;
    if (fib[n]) return fib[n];
    fib[n] = fib_memo(n-1) + fib_memo(n-2);
    return fib[n];
}
\`\`\`

### Nhánh cận (Branch and Bound)
Cắt tỉa nhánh không khả thi để tối ưu thời gian chạy.`,
      starterCode: `#include <stdio.h>

// Liet ke to hop chap k cua n
void combine(int n, int k, int arr[], int start, int pos) {
    if (pos == k) {
        for (int i = 0; i < k; i++)
            printf("%d ", arr[i]);
        printf("\\n");
        return;
    }
    for (int i = start; i <= n; i++) {
        arr[pos] = i;
        combine(n, k, arr, i+1, pos+1);
    }
}

int main() {
    int n = 5, k = 3;
    int arr[3];
    combine(n, k, arr, 1, 0);
    return 0;
}`,
      lessonType: 'theory' }]
  },
  {
    id: 'cap-phat-dong', title: 'Cấp phát bộ nhớ động', description: 'malloc, calloc, realloc, free, memory leak, valgrind', orderIndex: 14, isLocked: false,
    lessons: [{ id: 'cap-phat-dong', title: 'Module 14: Cấp phát bộ nhớ động', contentMd: `## Cấp phát bộ nhớ động

### malloc - Cấp phát bộ nhớ
\`\`\`c
int *arr = (int*)malloc(n * sizeof(int));
if (arr == NULL) { printf("Khong du bo nho!"); exit(1); }
\`\`\`

### calloc - Cấp phát và khởi tạo 0
\`\`\`c
int *arr = (int*)calloc(n, sizeof(int)); // tat ca = 0
\`\`\`

### realloc - Thay đổi kích thước
\`\`\`c
arr = (int*)realloc(arr, new_size * sizeof(int));
if (arr == NULL) { /* loi */ }
\`\`\`

### free - Giải phóng bộ nhớ
\`\`\`c
free(arr);
arr = NULL; // tranh dangling pointer
\`\`\`

### Memory leak
Xảy ra khi malloc nhưng không free. Dùng valgrind để kiểm tra:
\`\`\`bash
valgrind --leak-check=full ./program
\`\`\`

### Lưu ý
- Luôn kiểm tra NULL sau malloc/calloc/realloc
- Giải phóng đúng 1 lần (double-free gây crash)
- Không dùng con trỏ sau khi free (dangling pointer)`,
      starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    printf("Nhap so phan tu: ");
    scanf("%d", &n);

    // Cap phat dong mang n so nguyen
    int *arr = (int*)malloc(n * sizeof(int));
    if (arr == NULL) { printf("Loi cap phat!"); return 1; }

    for (int i = 0; i < n; i++)
        arr[i] = (i+1) * 10;

    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);

    free(arr);
    return 0;
}`,
      lessonType: 'theory' }]
  },
  {
    id: 'preprocessor', title: 'Preprocessor & Macro', description: '#define, #ifdef, #include, #pragma, macro function', orderIndex: 15, isLocked: false,
    lessons: [{ id: 'preprocessor', title: 'Module 15: Preprocessor & Macro', contentMd: `## Preprocessor trong C

### #define - Định nghĩa hằng và macro
\`\`\`c
#define PI 3.14159
#define MAX(a,b) ((a) > (b) ? (a) : (b))
#define SQUARE(x) ((x)*(x))
\`\`\`

### Toán tử trong macro
\`\`\`c
#define STR(x) #x        // bien thanh chuoi
#define CONCAT(a,b) a##b // noi token
\`\`\`

### Điều kiện biên dịch
\`\`\`c
#ifdef DEBUG
    printf("x = %d\\n", x);
#endif

#ifndef HEADER_H
#define HEADER_H
// header file content
#endif
\`\`\`

### #pragma
\`\`\`c
#pragma once  // tranh include nhieu lan
#pragma pack(1) // align struct
\`\`\`

### Macro vs Function
- Macro: nhanh, không kiểm tra kiểu, khó debug
- Function: chậm hơn (call overhead), an toàn kiểu

### predefined macros
\`\`\`c
__LINE__  // dong hien tai
__FILE__  // file hien tai
__DATE__  // ngay bien dich
__TIME__  // gio bien dich
\`\`\``,
      starterCode: `#include <stdio.h>

#define PI 3.14159
#define AREA(r) (PI * (r) * (r))
#define DEBUG

int main() {
    double r = 5.0;
#ifdef DEBUG
    printf("Ban kinh: %.2f\\n", r);
#endif
    printf("Dien tich hinh tron: %.2f\\n", AREA(r));
    return 0;
}`,
      lessonType: 'theory' }]
  },
  {
    id: 'cau-truc-du-lieu', title: 'Cấu trúc dữ liệu', description: 'Stack, Queue, Linked List, Tree, Binary Search Tree', orderIndex: 16, isLocked: false,
    lessons: [{ id: 'cau-truc-du-lieu', title: 'Module 16: Cấu trúc dữ liệu', contentMd: `## Cấu trúc dữ liệu trong C

### Stack (Ngăn xếp) - LIFO
\`\`\`c
#define MAX 100
int stack[MAX], top = -1;

void push(int v) { if (top < MAX-1) stack[++top] = v; }
int pop() { return (top >= 0) ? stack[top--] : -1; }
int peek() { return (top >= 0) ? stack[top] : -1; }
\`\`\`

### Queue (Hàng đợi) - FIFO
\`\`\`c
int queue[MAX], front = 0, rear = 0;

void enqueue(int v) { if (rear < MAX) queue[rear++] = v; }
int dequeue() { return (front < rear) ? queue[front++] : -1; }
\`\`\`

### Linked List (DS Liên kết đơn)
\`\`\`c
typedef struct Node { int data; struct Node *next; } Node;

Node *insert(Node *head, int v) {
    Node *n = malloc(sizeof(Node));
    n->data = v; n->next = head;
    return n;
}

void print(Node *h) {
    while (h) { printf("%d ", h->data); h = h->next; }
}
\`\`\`

### Binary Search Tree
\`\`\`c
typedef struct Tree { int val; struct Tree *l, *r; } Tree;

Tree *insert(Tree *t, int v) {
    if (!t) { t = malloc(sizeof(Tree)); t->val = v; t->l=t->r=NULL; return t; }
    if (v < t->val) t->l = insert(t->l, v);
    else t->r = insert(t->r, v);
    return t;
}
\`\`\`

### Độ phức tạp
- Stack/Queue: O(1) push/pop
- Linked List: O(1) insert, O(n) search
- BST: O(log n) trung bình, O(n) tệ nhất`,
      starterCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

Node *push(Node *head, int v) {
    Node *n = malloc(sizeof(Node));
    n->data = v; n->next = head;
    return n;
}

void print(Node *head) {
    while (head) { printf("%d ", head->data); head = head->next; }
}

int main() {
    Node *head = NULL;
    head = push(head, 10);
    head = push(head, 20);
    head = push(head, 30);
    print(head); // 30 20 10
    return 0;
}`,
      lessonType: 'theory' }]
  },
  {
    id: 'con-tro-nang-cao', title: 'Con trỏ nâng cao', description: 'Function pointer, void pointer, con trỏ cấp 2, callback', orderIndex: 17, isLocked: false,
    lessons: [{ id: 'con-tro-nang-cao', title: 'Module 17: Con trỏ nâng cao', contentMd: `## Con trỏ nâng cao

### Function Pointer (Con trỏ hàm)
\`\`\`c
int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int main() {
    int (*op)(int, int); // khai bao con tro ham
    op = add;
    printf("%d", op(5, 3)); // 8
    op = sub;
    printf("%d", op(5, 3)); // 2
}
\`\`\`

### Callback
\`\`\`c
void sort(int arr[], int n, int (*cmp)(int, int)) {
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (cmp(arr[j], arr[j+1]) > 0) {
                int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;
            }
}
\`\`\`

### Void pointer
\`\`\`c
void *ptr; // con tro toan cuc, khong co kieu
int x = 10; ptr = &x;
printf("%d", *(int*)ptr); // ep kieu khi dung
\`\`\`

### Con trỏ cấp 2 (Double pointer)
\`\`\`c
int x = 10, *p = &x, **pp = &p;
printf("%d", **pp); // 10
\`\`\`

### Mảng con trỏ hàm
\`\`\`c
int (*ops[])(int,int) = {add, sub, mul};
printf("%d", ops[0](5,3)); // goi add
\`\`\`

### Ứng dụng: qsort với callback
\`\`\`c
int cmp(const void *a, const void *b) {
    return *(int*)a - *(int*)b;
}
qsort(arr, n, sizeof(int), cmp);
\`\`\``,
      starterCode: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

int main() {
    int (*ops[2])(int, int) = {add, mul};
    int a = 5, b = 3;
    for (int i = 0; i < 2; i++)
        printf("Result: %d\\n", ops[i](a, b));
    return 0;
}`,
      lessonType: 'theory' }]
  },
  {
    id: 'thu-vien-chuan', title: 'Thư viện chuẩn C', description: 'math.h, stdlib.h, time.h, string.h, assert.h, setjmp.h', orderIndex: 18, isLocked: false,
    lessons: [{ id: 'thu-vien-chuan', title: 'Module 18: Thư viện chuẩn C', contentMd: `## Thư viện chuẩn C

### stdlib.h - Hàm tiện ích
\`\`\`c
atoi("123")     // chuoi sang int
atof("3.14")    // chuoi sang double
rand()          // so ngau nhien 0..RAND_MAX
srand(time(0))  // khoi tao seed
abs(-5)         // gia tri tuyet doi
system("cls")   // lenh he thong
qsort(arr, n, sizeof(int), cmp) // sap xep
\`\`\`

### math.h - Hàm toán học
\`\`\`c
sqrt(x), pow(x,y), sin(x), cos(x), tan(x)
exp(x), log(x), log10(x), ceil(x), floor(x)
fabs(x), fmod(x,y)
\`\`\`

### time.h - Thời gian
\`\`\`c
time_t t = time(NULL); // thoi gian hien tai
clock_t start = clock();
// do something
clock_t end = clock();
double time_spent = (double)(end-start) / CLOCKS_PER_SEC;
\`\`\`

### string.h - Xử lý chuỗi nâng cao
\`\`\`c
strtok(str, delim)   // tach chuoi
strstr(haystack, needle) // tim chuoi con
strrchr(s, c)      // vi tri cuoi cung cua c
sprintf(buf, "%d", n) // ghi vao buffer
\`\`\`

### setjmp.h - Nhảy phi cục bộ
\`\`\`c
jmp_buf buf;
if (setjmp(buf) == 0) {
    // code binh thuong
} else {
    // xu ly loi
}
longjmp(buf, 1); // nhay den setjmp
\`\`\`

### assert.h - Debug
\`\`\`c
assert(ptr != NULL); // crash neu dieu kien sai
\`\`\``,
      starterCode: `#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    srand(time(NULL));
    printf("10 so ngau nhien: ");
    for (int i = 0; i < 10; i++)
        printf("%d ", rand() % 100);
    return 0;
}`,
      lessonType: 'theory' }]
  },
  {
    id: 'lap-trinh-he-thong', title: 'Lập trình hệ thống', description: 'argc/argv, environment, file system, process, signal', orderIndex: 19, isLocked: false,
    lessons: [{ id: 'lap-trinh-he-thong', title: 'Module 19: Lập trình hệ thống', contentMd: `## Lập trình hệ thống với C

### argc và argv - Đối số dòng lệnh
\`\`\`c
int main(int argc, char *argv[]) {
    printf("Ten chuong trinh: %s\\n", argv[0]);
    for (int i = 1; i < argc; i++)
        printf("Doi so %d: %s\\n", i, argv[i]);
}
\`\`\`

### Biến môi trường
\`\`\`c
#include <stdlib.h>
char *path = getenv("PATH");    // lay bien moi truong
putenv("MY_VAR=hello");          // dat bien moi truong
\`\`\`

### Hệ thống file
\`\`\`c
#include <stdio.h>
remove("file.txt");     // xoa file
rename("old","new");    // doi ten
FILE *f = fopen("f.txt","r");
if (f) { /* doc file */ fclose(f); }
\`\`\`

### Process
\`\`\`c
#include <stdlib.h>
system("dir");     // chay lenh he thong (Windows)
system("ls -la");  // chay lenh he thong (Linux)
\`\`\`

### Trên Linux/Unix:
\`\`\`c
#include <unistd.h>
#include <sys/wait.h>

pid_t pid = fork();
if (pid == 0) { /* tien trinh con */ }
else { /* tien trinh cha */ wait(NULL); }
\`\`\`

### Signal handling
\`\`\`c
#include <signal.h>
void handler(int sig) { printf("Nhan signal %d\\n", sig); }
signal(SIGINT, handler); // Ctrl+C
\`\`\``,
      starterCode: `#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("So luong doi so: %d\\n", argc);
    for (int i = 0; i < argc; i++)
        printf("argv[%d] = %s\\n", i, argv[i]);
    return 0;
}`,
      lessonType: 'theory' }]
  },
  {
    id: 'bitwise-nang-cao', title: 'Thao tác bit nâng cao', description: 'Bit mask, set/clear/toggle, endianness, checksum, flag', orderIndex: 20, isLocked: false,
    lessons: [{ id: 'bitwise-nang-cao', title: 'Module 20: Thao tác bit nâng cao', contentMd: `## Thao tác bit nâng cao

### Bit Mask - Mặt nạ bit
\`\`\`c
#define BIT(n) (1 << n)  // bit thu n
\`\`\`

### Set/Clear/Toggle bit
\`\`\`c
int x = 0;
x |= BIT(3);    // set bit 3:  x = x | (1<<3)
x &= ~BIT(3);   // clear bit 3: x = x & ~(1<<3)
x ^= BIT(3);    // toggle bit 3: x = x ^ (1<<3)
(x & BIT(3))    // kiem tra bit 3
\`\`\`

### Kiểm tra bit
\`\`\`c
int is_set(int x, int n) { return (x >> n) & 1; }
\`\`\`

### Đếm bit 1 (Hamming weight)
\`\`\`c
int count_bits(int x) {
    int count = 0;
    while (x) { count += x & 1; x >>= 1; }
    return count;
}
// Toi uu: x & (x-1) xoa bit 1 cuoi cung
int count_bits_opt(int x) {
    int count = 0;
    while (x) { count++; x &= x - 1; }
    return count;
}
\`\`\`

### Endianness
\`\`\`c
int x = 0x12345678;
char *c = (char*)&x;
if (*c == 0x78) printf("Little endian");
else printf("Big endian");
\`\`\`

### Checksum đơn giản
\`\`\`c
char checksum(char *data, int len) {
    char sum = 0;
    for (int i = 0; i < len; i++) sum ^= data[i];
    return sum;
}
\`\`\`

### Flag pattern
\`\`\`c
#define FLAG_READ  (1 << 0)
#define FLAG_WRITE (1 << 1)
#define FLAG_EXEC  (1 << 2)
int flags = FLAG_READ | FLAG_WRITE;
if (flags & FLAG_READ) printf("Co quyen doc");
\`\`\``,
      starterCode: `#include <stdio.h>

#define BIT(n) (1 << n)
#define FLAG_A BIT(0)
#define FLAG_B BIT(1)
#define FLAG_C BIT(2)

int main() {
    int flags = 0;
    flags |= FLAG_A | FLAG_C;
    printf("Flags: %d\\n", flags);
    printf("Co A: %s\\n", (flags & FLAG_A) ? "Yes" : "No");
    printf("Co B: %s\\n", (flags & FLAG_B) ? "Yes" : "No");
    flags ^= FLAG_C;
    printf("Sau toggle C: %d\\n", flags);
    return 0;
}`,
      lessonType: 'theory' }]
  },
  {
    id: 'debug-toi-uu', title: 'Debug & Tối ưu', description: 'gdb, assert, profiling, inline, restrict, align, cache', orderIndex: 21, isLocked: false,
    lessons: [{ id: 'debug-toi-uu', title: 'Module 21: Debug & Tối ưu', contentMd: `## Debug và Tối ưu trong C

### assert - Kiểm tra điều kiện
\`\`\`c
#include <assert.h>
assert(ptr != NULL); // dung chuong trinh neu ptr == NULL
\`\`\`

### Debug với macro
\`\`\`c
#ifdef DEBUG
    #define LOG(fmt, ...) printf("[DEBUG] " fmt "\\n", ##__VA_ARGS__)
#else
    #define LOG(fmt, ...)
#endif
\`\`\`

### GDB Commands cơ bản
\`\`\`bash
gcc -g program.c -o program   # bien dich voi -g
gdb ./program
(gdb) break main     # dat breakpoint
(gdb) run            # chay
(gdb) print x        # in bien
(gdb) next           # buoc tiep
(gdb) step           # vao trong ham
(gdb) continue       # tiep tuc
(gdb) quit           # thoat
\`\`\`

### Tối ưu hóa
\`\`\`c
// Compiler optimization flags: -O1, -O2, -O3, -Os
inline int max(int a, int b) { return a > b ? a : b; }
register int i; // (goi y) luu trong thanh ghi
\`\`\`

### restrict
\`\`\`c
void copy(int *restrict dest, int *restrict src, int n);
// 2 con tro khong tro cung 1 vung nho -> toi uu hon
\`\`\`

### align - Căn chỉnh bộ nhớ
\`\`\`c
#include <stdalign.h>
alignas(64) int arr[1000]; // can chinh 64 byte
\`\`\`

### Tối ưu Cache
- Truy cập mảng tuần tự (stride 1) nhanh hơn nhảy cóc
- Dùng struct nhỏ gọn (#pragma pack)
- Tránh pointer aliasing (dùng restrict)

### Profiling
\`\`\`bash
gcc -pg program.c -o program   # bien dich voi -pg
./program                        # chay tao gmon.out
gprof ./program                  # xem profile
\`\`\``,
      starterCode: `#include <stdio.h>
#include <assert.h>

#ifdef DEBUG
    #define LOG(fmt, ...) printf("[DEBUG] " fmt "\\n", ##__VA_ARGS__)
#else
    #define LOG(fmt, ...)
#endif

int main() {
    int x = 42;
    LOG("x = %d", x);

    int arr[] = {1, 2, 3, 4, 5};
    int *p = arr;
    assert(p != NULL);

    int sum = 0;
    for (int i = 0; i < 5; i++) sum += p[i];
    printf("Sum: %d\\n", sum);
    return 0;
}`,
      lessonType: 'theory' }]
  },
  {
    id: 'thiet-ke-chuong-trinh', title: 'Thiết kế chương trình', description: 'Modular, header files, makefile, static/shared library', orderIndex: 22, isLocked: false,
    lessons: [{ id: 'thiet-ke-chuong-trinh', title: 'Module 22: Thiết kế chương trình', contentMd: `## Thiết kế chương trình C

### Module hóa - Chia file
\`\`\`c
// math_utils.h
#ifndef MATH_UTILS_H
#define MATH_UTILS_H
int add(int a, int b);
int mul(int a, int b);
#endif

// math_utils.c
#include "math_utils.h"
int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

// main.c
#include "math_utils.h"
int main() { printf("%d", add(5,3)); }
\`\`\`

### Makefile
\`\`\`makefile
CC = gcc
CFLAGS = -Wall -O2
OBJ = main.o math_utils.o

program: $(OBJ)
    $(CC) $(CFLAGS) -o program $(OBJ)

%.o: %.c
    $(CC) $(CFLAGS) -c $<

clean:
    rm -f *.o program
\`\`\`

### Static Library
\`\`\`bash
gcc -c math_utils.c
ar rcs libmath.a math_utils.o
gcc main.c -L. -lmath -o program
\`\`\`

### Shared Library (Linux)
\`\`\`bash
gcc -fPIC -c math_utils.c
gcc -shared -o libmath.so math_utils.o
gcc main.c -L. -lmath -o program
export LD_LIBRARY_PATH=.:$LD_LIBRARY_PATH
./program
\`\`\`

### Qui tắc thiết kế
- Mỗi file .c đi kèm 1 file .h
- Tránh biến global (dùng static)
- Dùng enum thay #define cho hằng số nhóm
- Documentation với comment
- Kiểm tra lỗi ở mọi hàm hệ thống

### Coding convention
\`\`\`c
// Ten ham: snake_case
// Hang so: UPPER_CASE
// Bien: meaningful names
// Khoang trong: 4 spaces / 1 tab
\`\`\``,
      starterCode: `/* calculator.h */
#ifndef CALCULATOR_H
#define CALCULATOR_H
int add(int a, int b);
int sub(int a, int b);
int mul(int a, int b);
int divide(int a, int b);
#endif

/* main.c */
#include <stdio.h>
#include "calculator.h"

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }
int divide(int a, int b) { return b ? a/b : 0; }

int main() {
    printf("5 + 3 = %d\\n", add(5,3));
    printf("5 * 3 = %d\\n", mul(5,3));
    return 0;
}`,
      lessonType: 'theory' }]
  },
]
