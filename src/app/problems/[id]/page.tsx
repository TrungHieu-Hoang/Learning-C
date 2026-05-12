'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { TestCasePanel } from '@/components/editor/TestCasePanel'
import { Editorial } from '@/components/problems/Editorial'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useJudge } from '@/hooks/useJudge'
import { useEditorStore } from '@/store/editorStore'

type Difficulty = 'easy' | 'medium' | 'hard'

const problemData: Record<string, {
  title: string
  difficulty: Difficulty
  description: string
  inputFormat: string
  constraints: string
  sampleInput: string
  sampleOutput: string
  starterCode: string
  explanation: string
  solution: string
  testCases: { input: string; expectedOutput: string; isHidden: boolean }[]
}> = {
  'hello-world-c': {
    title: 'Hello World in C',
    difficulty: 'easy',
    description: 'Hoàn thành chương trình in ra dòng chữ "Hello, World!" trên một dòng duy nhất.',
    inputFormat: 'Không có đầu vào.',
    constraints: 'Không có.',
    sampleInput: '',
    sampleOutput: 'Hello, World!',
    starterCode: `#include <stdio.h>

int main() {
    // In ra "Hello, World!"

    return 0;
}`,
    explanation: 'Sử dụng printf để in chuỗi ra màn hình. Nhớ thêm \\n để xuống dòng.',
    solution: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
    testCases: [
      { input: '', expectedOutput: 'Hello, World!', isHidden: false },
      { input: '', expectedOutput: 'Hello, World!', isHidden: false },
      { input: '', expectedOutput: 'Hello, World!', isHidden: false },
      { input: '', expectedOutput: 'Hello, World!', isHidden: true },
    ],
  },
  'playing-characters': {
    title: 'Playing With Characters',
    difficulty: 'easy',
    description: 'Đọc một ký tự, một chuỗi và một câu từ stdin, sau đó in chúng ra mỗi thứ trên một dòng.',
    inputFormat: 'Dòng 1: Một ký tự.\nDòng 2: Một chuỗi (không dấu cách).\nDòng 3: Một câu (có dấu cách).',
    constraints: '1 ≤ |chuỗi| ≤ 100, 1 ≤ |câu| ≤ 100',
    sampleInput: 'C\nProgramming\nI love coding',
    sampleOutput: 'C\nProgramming\nI love coding',
    starterCode: `#include <stdio.h>

int main() {
    char ch;
    char s[100];
    char sen[100];

    // Đọc và in ký tự

    // Đọc và in chuỗi

    // Đọc và in câu

    return 0;
}`,
    explanation: 'Dùng scanf với %c cho ký tự, %s cho chuỗi, và %[^\\n] cho câu (hoặc fgets).',
    solution: `#include <stdio.h>

int main() {
    char ch;
    char s[100];
    char sen[100];

    scanf("%c", &ch);
    scanf("%s", s);
    getchar();
    fgets(sen, 100, stdin);

    printf("%c\\n", ch);
    printf("%s\\n", s);
    printf("%s", sen);
    return 0;
}`,
    testCases: [
      { input: 'C\nProgramming\nI love coding', expectedOutput: 'C\nProgramming\nI love coding', isHidden: false },
      { input: 'A\nHello\nWorld is beautiful', expectedOutput: 'A\nHello\nWorld is beautiful', isHidden: false },
      { input: 'Z\nTest\nC programming language', expectedOutput: 'Z\nTest\nC programming language', isHidden: true },
    ],
  },
  'sum-difference': {
    title: 'Sum and Difference of Two Numbers',
    difficulty: 'easy',
    description: 'Tính tổng và hiệu của hai số nguyên, sau đó là tổng và hiệu của hai số thực.',
    inputFormat: 'Dòng 1: Hai số nguyên a và b.\nDòng 2: Hai số thực c và d.',
    constraints: '1 ≤ a, b ≤ 1000\n1 ≤ c, d ≤ 1000',
    sampleInput: '10 4\n4.5 1.5',
    sampleOutput: '14 6\n6.0 3.0',
    starterCode: `#include <stdio.h>

int main() {
    int a, b;
    float c, d;

    // Đọc đầu vào

    // Tính và in kết quả

    return 0;
}`,
    explanation: 'Khai báo int cho số nguyên, float cho số thực. In số nguyên với %d, số thực với %.1f.',
    solution: `#include <stdio.h>

int main() {
    int a, b;
    float c, d;

    scanf("%d %d", &a, &b);
    scanf("%f %f", &c, &d);

    printf("%d %d\\n", a + b, a - b);
    printf("%.1f %.1f\\n", c + d, c - d);
    return 0;
}`,
    testCases: [
      { input: '10 4\n4.5 1.5', expectedOutput: '14 6\n6.0 3.0', isHidden: false },
      { input: '20 8\n10.5 3.2', expectedOutput: '28 12\n13.7 7.3', isHidden: false },
      { input: '100 50\n100.0 50.0', expectedOutput: '150 50\n150.0 50.0', isHidden: true },
    ],
  },
  'conditional-stmts': {
    title: 'Conditional Statements',
    difficulty: 'easy',
    description: 'Cho một số nguyên n, in ra chữ tiếng Anh tương ứng nếu 1 ≤ n ≤ 9, ngược lại in "Greater than 9".',
    inputFormat: 'Một dòng chứa số nguyên n.',
    constraints: '1 ≤ n ≤ 10^9',
    sampleInput: '5',
    sampleOutput: 'five',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    // Viet code in chu tieng Anh cua n

    return 0;
}`,
    explanation: 'Dùng if-else hoặc mảng chuỗi. Với n từ 1-9, in chữ tương ứng. Nếu n > 9, in "Greater than 9".',
    solution: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    char *words[] = {"one","two","three","four","five","six","seven","eight","nine"};
    if (n >= 1 && n <= 9)
        printf("%s", words[n-1]);
    else
        printf("Greater than 9");
    return 0;
}`,
    testCases: [
      { input: '5', expectedOutput: 'five', isHidden: false },
      { input: '9', expectedOutput: 'nine', isHidden: false },
      { input: '12', expectedOutput: 'Greater than 9', isHidden: false },
      { input: '1', expectedOutput: 'one', isHidden: true },
    ],
  },
  'for-loop-c': {
    title: 'For Loop in C',
    difficulty: 'easy',
    description: 'Cho a và b, in ra các số từ a đến b. Với số 1-9 in chữ, với số > 9 in "even" nếu chẵn, "odd" nếu lẻ.',
    inputFormat: 'Một dòng chứa hai số nguyên a và b.',
    constraints: '1 ≤ a ≤ b ≤ 10^6',
    sampleInput: '8 11',
    sampleOutput: 'eight\nnine\neven\nodd',
    starterCode: `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);

    // In tu a den b theo quy tac

    return 0;
}`,
    explanation: 'Dùng vòng lặp for. Với số từ 1-9 dùng mảng chữ. Với số > 9 kiểm tra chẵn lẻ bằng % 2.',
    solution: `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    char *words[] = {"one","two","three","four","five","six","seven","eight","nine"};
    for (int i = a; i <= b; i++) {
        if (i >= 1 && i <= 9)
            printf("%s\\n", words[i-1]);
        else if (i % 2 == 0)
            printf("even\\n");
        else
            printf("odd\\n");
    }
    return 0;
}`,
    testCases: [
      { input: '8 11', expectedOutput: 'eight\nnine\neven\nodd', isHidden: false },
      { input: '1 3', expectedOutput: 'one\ntwo\nthree', isHidden: false },
      { input: '10 12', expectedOutput: 'even\nodd\neven', isHidden: true },
    ],
  },
  'functions-c': {
    title: 'Functions in C',
    difficulty: 'easy',
    description: 'Viết hàm max_of_four nhận 4 số nguyên và trả về số lớn nhất.',
    inputFormat: 'Một dòng chứa bốn số nguyên.',
    constraints: '1 ≤ a, b, c, d ≤ 10^6',
    sampleInput: '3 8 5 2',
    sampleOutput: '8',
    starterCode: `#include <stdio.h>

int max_of_four(int a, int b, int c, int d) {
    // Viet code tim so lon nhat
}

int main() {
    int a, b, c, d;
    scanf("%d %d %d %d", &a, &b, &c, &d);
    printf("%d", max_of_four(a, b, c, d));
    return 0;
}`,
    explanation: 'Dùng hàm max phụ trợ: int max(int x, int y) { return x > y ? x : y; }. Sau đó max(max(a,b), max(c,d)).',
    solution: `#include <stdio.h>

int max(int x, int y) { return x > y ? x : y; }

int max_of_four(int a, int b, int c, int d) {
    return max(max(a, b), max(c, d));
}

int main() {
    int a, b, c, d;
    scanf("%d %d %d %d", &a, &b, &c, &d);
    printf("%d", max_of_four(a, b, c, d));
    return 0;
}`,
    testCases: [
      { input: '3 8 5 2', expectedOutput: '8', isHidden: false },
      { input: '10 20 30 40', expectedOutput: '40', isHidden: false },
      { input: '100 50 75 25', expectedOutput: '100', isHidden: true },
    ],
  },
  'pointer-c': {
    title: 'Pointer in C',
    difficulty: 'easy',
    description: 'Viết hàm update nhận hai con trỏ, gán tổng vào biến thứ nhất và hiệu (trị tuyệt đối) vào biến thứ hai.',
    inputFormat: 'Một dòng chứa hai số nguyên a và b.',
    constraints: '1 ≤ a, b ≤ 10^6',
    sampleInput: '4 5',
    sampleOutput: '9\n1',
    starterCode: `#include <stdio.h>

void update(int *a, int *b) {
    // Tinh tong va hieu
}

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    update(&a, &b);
    printf("%d\\n%d", a, b);
    return 0;
}`,
    explanation: 'Dùng *a để truy cập giá trị tại địa chỉ. Lưu tổng tạm trước khi gán, vì *a bị thay đổi. Dùng abs() cho trị tuyệt đối.',
    solution: `#include <stdio.h>
#include <stdlib.h>

void update(int *a, int *b) {
    int sum = *a + *b;
    int diff = abs(*a - *b);
    *a = sum;
    *b = diff;
}

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    update(&a, &b);
    printf("%d\\n%d", a, b);
    return 0;
}`,
    testCases: [
      { input: '4 5', expectedOutput: '9\n1', isHidden: false },
      { input: '10 3', expectedOutput: '13\n7', isHidden: false },
      { input: '7 12', expectedOutput: '19\n5', isHidden: true },
    ],
  },
  'students-marks': {
    title: 'Students Marks Sum',
    difficulty: 'easy',
    description: 'Cho mảng điểm của sinh viên nam và nữ xen kẽ. Tính tổng điểm của sinh viên theo giới tính cho trước.',
    inputFormat: 'Dòng 1: Số nguyên n.\nDòng 2: n số nguyên là điểm.\nDòng 3: Ký tự \'b\' (nam) hoặc \'g\' (nữ).',
    constraints: '1 ≤ n ≤ 1000\n0 ≤ marks[i] ≤ 100',
    sampleInput: '4\n10 20 30 40\nb',
    sampleOutput: '40',
    starterCode: `#include <stdio.h>

int marks_summation(int marks[], int n, char gender) {
    // Tinh tong diem theo gioi tinh
}

int main() {
    int n;
    scanf("%d", &n);
    int marks[n];
    for (int i = 0; i < n; i++)
        scanf("%d", &marks[i]);
    char gender;
    scanf(" %c", &gender);
    printf("%d", marks_summation(marks, n, gender));
    return 0;
}`,
    explanation: 'Nam ở vị trí chẵn (0, 2, 4...), nữ ở vị trí lẻ (1, 3, 5...). Dùng vòng lặp với bước nhảy 2.',
    solution: `#include <stdio.h>

int marks_summation(int marks[], int n, char gender) {
    int sum = 0;
    int start = (gender == 'b') ? 0 : 1;
    for (int i = start; i < n; i += 2)
        sum += marks[i];
    return sum;
}

int main() {
    int n;
    scanf("%d", &n);
    int marks[n];
    for (int i = 0; i < n; i++)
        scanf("%d", &marks[i]);
    char gender;
    scanf(" %c", &gender);
    printf("%d", marks_summation(marks, n, gender));
    return 0;
}`,
    testCases: [
      { input: '4\n10 20 30 40\nb', expectedOutput: '40', isHidden: false },
      { input: '4\n10 20 30 40\ng', expectedOutput: '60', isHidden: false },
      { input: '3\n5 15 25\nb', expectedOutput: '30', isHidden: true },
    ],
  },
  'array-reversal': {
    title: 'Array Reversal',
    difficulty: 'easy',
    description: 'Cho mảng số nguyên, đảo ngược thứ tự các phần tử và in ra.',
    inputFormat: 'Dòng 1: Số nguyên n.\nDòng 2: n số nguyên.',
    constraints: '1 ≤ n ≤ 1000\n1 ≤ arr[i] ≤ 10^6',
    sampleInput: '6\n1 4 6 2 3 8',
    sampleOutput: '8 3 2 6 4 1',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    for (int i = 0; i < n; i++)
        scanf("%d", &arr[i]);

    // Dao nguoc mang

    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    return 0;
}`,
    explanation: 'Dùng hai con trỏ: left = 0, right = n-1. Hoán đổi arr[left] với arr[right] rồi tăng left, giảm right.',
    solution: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    for (int i = 0; i < n; i++)
        scanf("%d", &arr[i]);
    for (int i = 0, j = n-1; i < j; i++, j--) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    return 0;
}`,
    testCases: [
      { input: '6\n1 4 6 2 3 8', expectedOutput: '8 3 2 6 4 1', isHidden: false },
      { input: '3\n10 20 30', expectedOutput: '30 20 10', isHidden: false },
      { input: '1\n42', expectedOutput: '42', isHidden: true },
    ],
  },
  'sum-numbers': {
    title: 'Sum of Digits of a Five Digit Number',
    difficulty: 'easy',
    description: 'Cho số nguyên 5 chữ số, tính tổng các chữ số của nó.',
    inputFormat: 'Một dòng chứa số nguyên n (5 chữ số).',
    constraints: '10000 ≤ n ≤ 99999',
    sampleInput: '10564',
    sampleOutput: '16',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    // Tinh tong cac chu so

    printf("%d", sum);
    return 0;
}`,
    explanation: 'Dùng vòng lặp: sum += n % 10 (lấy chữ số cuối); n /= 10 (xóa chữ số cuối).',
    solution: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    printf("%d", sum);
    return 0;
}`,
    testCases: [
      { input: '10564', expectedOutput: '16', isHidden: false },
      { input: '12345', expectedOutput: '15', isHidden: false },
      { input: '99999', expectedOutput: '45', isHidden: true },
    ],
  },
  '1d-arrays': {
    title: '1D Arrays in C',
    difficulty: 'easy',
    description: 'Cấp phát động mảng n số nguyên, tính tổng các phần tử.',
    inputFormat: 'Dòng 1: Số nguyên n.\nDòng 2: n số nguyên.',
    constraints: '1 ≤ n ≤ 1000\n1 ≤ arr[i] ≤ 10^6',
    sampleInput: '5\n1 2 3 4 5',
    sampleOutput: '15',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    scanf("%d", &n);
    int *arr = (int*)malloc(n * sizeof(int));

    // Doc mang va tinh tong

    printf("%d", sum);
    free(arr);
    return 0;
}`,
    explanation: 'Dùng malloc để cấp phát mảng động. Dùng vòng lặp để đọc và tính tổng. Giải phóng bộ nhớ với free().',
    solution: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    scanf("%d", &n);
    int *arr = (int*)malloc(n * sizeof(int));
    int sum = 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
        sum += arr[i];
    }
    printf("%d", sum);
    free(arr);
    return 0;
}`,
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '15', isHidden: false },
      { input: '3\n10 20 30', expectedOutput: '60', isHidden: false },
      { input: '1\n42', expectedOutput: '42', isHidden: true },
    ],
  },
  'digit-frequency': {
    title: 'Digit Frequency',
    difficulty: 'medium',
    description: 'Cho một chuỗi, đếm tần suất xuất hiện của mỗi chữ số (0-9) trong chuỗi.',
    inputFormat: 'Một dòng chứa chuỗi ký tự.',
    constraints: '1 ≤ |chuỗi| ≤ 1000, Chuỗi có thể chứa chữ cái, chữ số, ký tự đặc biệt.',
    sampleInput: 'a11472o5t6',
    sampleOutput: '0 2 1 0 1 1 1 1 0 0',
    starterCode: `#include <stdio.h>

int main() {
    char s[1000];
    scanf("%s", s);

    // Dem tan suat cac chu so

    return 0;
}`,
    explanation: 'Khởi tạo mảng đếm 10 phần tử. Duyệt chuỗi, nếu ký tự là chữ số (s[i] >= \'0\' && s[i] <= \'9\') thì tăng đếm tương ứng.',
    solution: `#include <stdio.h>

int main() {
    char s[1000];
    scanf("%s", s);
    int count[10] = {0};
    for (int i = 0; s[i] != '\\0'; i++) {
        if (s[i] >= '0' && s[i] <= '9')
            count[s[i] - '0']++;
    }
    for (int i = 0; i < 10; i++)
        printf("%d ", count[i]);
    return 0;
}`,
    testCases: [
      { input: 'a11472o5t6', expectedOutput: '0 2 1 0 1 1 1 1 0 0', isHidden: false },
      { input: 'hello123', expectedOutput: '0 1 1 1 0 0 0 0 0 0', isHidden: false },
      { input: 'abc', expectedOutput: '0 0 0 0 0 0 0 0 0 0', isHidden: true },
    ],
  },
  'bitwise-ops': {
    title: 'Bitwise Operators',
    difficulty: 'medium',
    description: 'Tính giá trị lớn nhất của a & b, a | b, a ^ b với 1 ≤ a < b ≤ n.',
    inputFormat: 'Một dòng chứa hai số nguyên n và k.',
    constraints: '2 ≤ n ≤ 1000\n2 ≤ k ≤ n',
    sampleInput: '5 4',
    sampleOutput: '2\n3\n3',
    starterCode: `#include <stdio.h>

int main() {
    int n, k;
    scanf("%d %d", &n, &k);

    // Tinh toan bitwise

    return 0;
}`,
    explanation: 'Dùng vòng lặp lồng để thử mọi cặp (a,b) với 1 ≤ a < b ≤ n. Tính toán bitwise và cập nhật max nếu kết quả < k.',
    solution: `#include <stdio.h>

int main() {
    int n, k;
    scanf("%d %d", &n, &k);
    int max_and = 0, max_or = 0, max_xor = 0;
    for (int a = 1; a <= n; a++) {
        for (int b = a+1; b <= n; b++) {
            int andv = a & b, orv = a | b, xorv = a ^ b;
            if (andv < k && andv > max_and) max_and = andv;
            if (orv < k && orv > max_or) max_or = orv;
            if (xorv < k && xorv > max_xor) max_xor = xorv;
        }
    }
    printf("%d\\n%d\\n%d", max_and, max_or, max_xor);
    return 0;
}`,
    testCases: [
      { input: '5 4', expectedOutput: '2\n3\n3', isHidden: false },
      { input: '8 5', expectedOutput: '4\n5\n5', isHidden: false },
      { input: '10 8', expectedOutput: '7\n7\n7', isHidden: true },
    ],
  },
  'box-turtle': {
    title: 'Boxes through a Tunnel',
    difficulty: 'medium',
    description: 'Cho struct Box với chiều dài, rộng, cao. Tính thể tích các hộp có chiều cao < 41.',
    inputFormat: 'Dòng 1: Số nguyên n.\nn dòng tiếp theo: Mỗi dòng chứa chiều dài, rộng, cao.',
    constraints: '1 ≤ n ≤ 100\n1 ≤ các cạnh ≤ 100',
    sampleInput: '4\n3 2 5\n10 10 10\n5 5 5\n10 4 40',
    sampleOutput: '30\n125',
    starterCode: `#include <stdio.h>

typedef struct {
    int length, width, height;
} Box;

int main() {
    int n;
    scanf("%d", &n);
    Box boxes[n];
    for (int i = 0; i < n; i++)
        scanf("%d %d %d", &boxes[i].length, &boxes[i].width, &boxes[i].height);

    // In the tich cac hop co chieu cao < 41

    return 0;
}`,
    explanation: 'Duyệt mảng Box. Nếu height < 41 thì in ra thể tích (length * width * height).',
    solution: `#include <stdio.h>

typedef struct {
    int length, width, height;
} Box;

int main() {
    int n;
    scanf("%d", &n);
    Box boxes[n];
    for (int i = 0; i < n; i++)
        scanf("%d %d %d", &boxes[i].length, &boxes[i].width, &boxes[i].height);
    for (int i = 0; i < n; i++)
        if (boxes[i].height < 41)
            printf("%d\\n", boxes[i].length * boxes[i].width * boxes[i].height);
    return 0;
}`,
    testCases: [
      { input: '4\n3 2 5\n10 10 10\n5 5 5\n10 4 40', expectedOutput: '30\n125', isHidden: false },
      { input: '2\n1 1 40\n2 2 2', expectedOutput: '8', isHidden: false },
      { input: '1\n3 3 30', expectedOutput: '270', isHidden: true },
    ],
  },
  'sorting-strings': {
    title: 'Sorting Array of Strings',
    difficulty: 'medium',
    description: 'Sắp xếp mảng chuỗi theo thứ tự từ điển, số lượng ký tự khác nhau, và độ dài.',
    inputFormat: 'Dòng 1: Số nguyên n.\nn dòng tiếp theo: Các chuỗi.',
    constraints: '1 ≤ n ≤ 100\n1 ≤ |chuỗi| ≤ 100',
    sampleInput: '4\napple\nbanana\napricot\ngrape',
    sampleOutput: 'apple\napricot\nbanana\ngrape',
    starterCode: `#include <stdio.h>
#include <string.h>

int main() {
    int n;
    scanf("%d", &n);
    char str[n][100];
    for (int i = 0; i < n; i++)
        scanf("%s", str[i]);

    // Sap xep tu dien

    return 0;
}`,
    explanation: 'Dùng strcmp để so sánh và bubble sort để sắp xếp theo thứ tự từ điển.',
    solution: `#include <stdio.h>
#include <string.h>

int main() {
    int n;
    scanf("%d", &n);
    char str[n][100];
    for (int i = 0; i < n; i++)
        scanf("%s", str[i]);
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (strcmp(str[j], str[j+1]) > 0) {
                char temp[100];
                strcpy(temp, str[j]);
                strcpy(str[j], str[j+1]);
                strcpy(str[j+1], temp);
            }
    for (int i = 0; i < n; i++)
        printf("%s\\n", str[i]);
    return 0;
}`,
    testCases: [
      { input: '4\napple\nbanana\napricot\ngrape', expectedOutput: 'apple\napricot\nbanana\ngrape', isHidden: false },
      { input: '3\ncat\ndog\nbird', expectedOutput: 'bird\ncat\ndog', isHidden: false },
      { input: '2\nzoo\nant', expectedOutput: 'ant\nzoo', isHidden: true },
    ],
  },
  'variadic-c': {
    title: 'Variadic Functions in C',
    difficulty: 'medium',
    description: 'Viết hàm variadic để tính tổng, hiệu, tích của n số nguyên.',
    inputFormat: 'Dòng 1: Số nguyên count.\nDòng 2: count số nguyên.',
    constraints: '2 ≤ count ≤ 10\n1 ≤ các số ≤ 100',
    sampleInput: '3\n10 5 2',
    sampleOutput: '17\n3\n100',
    starterCode: `#include <stdio.h>
#include <stdarg.h>

int sum(int count, ...) {
    // Tinh tong
}

int min(int count, ...) {
    // Tim hieu
}

int mul(int count, ...) {
    // Tinh tich
}

int main() {
    int count;
    scanf("%d", &count);
    // Xu ly input va goi ham
    return 0;
}`,
    explanation: 'Dùng thư viện stdarg.h: va_list, va_start, va_arg, va_end. Duyệt qua các tham số bằng vòng lặp.',
    solution: `#include <stdio.h>
#include <stdarg.h>

int sum(int count, ...) {
    va_list args;
    va_start(args, count);
    int s = 0;
    for (int i = 0; i < count; i++)
        s += va_arg(args, int);
    va_end(args);
    return s;
}

int min(int count, ...) {
    va_list args;
    va_start(args, count);
    int m = va_arg(args, int);
    for (int i = 1; i < count; i++) {
        int x = va_arg(args, int);
        if (x < m) m = x;
    }
    va_end(args);
    return m;
}

int mul(int count, ...) {
    va_list args;
    va_start(args, count);
    int p = 1;
    for (int i = 0; i < count; i++)
        p *= va_arg(args, int);
    va_end(args);
    return p;
}

int main() {
    int n; scanf("%d", &n);
    int a[10];
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    printf("%d\\n%d\\n%d", sum(n,a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9]),
           min(n,a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9]),
           mul(n,a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9]));
    return 0;
}`,
    testCases: [
      { input: '3\n10 5 2', expectedOutput: '17\n3\n100', isHidden: false },
      { input: '2\n7 3', expectedOutput: '10\n3\n21', isHidden: false },
      { input: '4\n1 2 3 4', expectedOutput: '10\n1\n24', isHidden: true },
    ],
  },
  'dynamic-array-c': {
    title: 'Dynamic Array in C',
    difficulty: 'medium',
    description: 'Cấp phát động mảng 2 chiều với kích thước thay đổi, điền số và in ra.',
    inputFormat: 'Dòng 1: Hai số nguyên n (số mảng) và q (số truy vấn).\nTiếp theo là q truy vấn.',
    constraints: '1 ≤ n ≤ 100\n1 ≤ q ≤ 100',
    sampleInput: '2 3\n1 2 3 4 5\n2 1 4 6\n1 1 2',
    sampleOutput: '4\n2 4 6',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, q;
    scanf("%d %d", &n, &q);

    // Cap phat va thao tac mang dong

    return 0;
}`,
    explanation: 'Cấp phát mảng con trỏ, mỗi con trỏ trỏ đến một mảng động. Đọc dữ liệu và xử lý truy vấn.',
    solution: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, q;
    scanf("%d %d", &n, &q);
    int **arr = (int**)malloc(n * sizeof(int*));
    for (int i = 0; i < n; i++) {
        int k; scanf("%d", &k);
        arr[i] = (int*)malloc(k * sizeof(int));
        for (int j = 0; j < k; j++)
            scanf("%d", &arr[i][j]);
    }
    for (int t = 0; t < q; t++) {
        int i, j; scanf("%d %d", &i, &j);
        printf("%d\\n", arr[i][j]);
    }
    for (int i = 0; i < n; i++) free(arr[i]);
    free(arr);
    return 0;
}`,
    testCases: [
      { input: '2 3\n1 2 3 4 5\n2 1 4 6\n1 1 2', expectedOutput: '4\n2 4 6', isHidden: false },
      { input: '1 1\n3 10 20 30\n0 2', expectedOutput: '30', isHidden: false },
      { input: '3 2\n2 5 6\n1 7\n2 8 9\n0 1\n2 0', expectedOutput: '6\n8', isHidden: true },
    ],
  },
  'small-triangles': {
    title: 'Small Triangles, Large Triangles',
    difficulty: 'hard',
    description: 'Sắp xếp các tam giác theo diện tích tăng dần. Mỗi tam giác được cho bởi 3 cạnh.',
    inputFormat: 'Dòng 1: Số nguyên n.\nn dòng tiếp theo: Mỗi dòng chứa a, b, c là 3 cạnh.',
    constraints: '1 ≤ n ≤ 100\n1 ≤ a, b, c ≤ 100',
    sampleInput: '3\n3 4 5\n5 6 7\n6 8 10',
    sampleOutput: '3 4 5\n5 6 7\n6 8 10',
    starterCode: `#include <stdio.h>
#include <math.h>

typedef struct {
    int a, b, c;
} Triangle;

int main() {
    int n;
    scanf("%d", &n);
    Triangle t[n];
    for (int i = 0; i < n; i++)
        scanf("%d %d %d", &t[i].a, &t[i].b, &t[i].c);

    // Sap xep theo dien tich

    return 0;
}`,
    explanation: 'Công thức Heron: s = (a+b+c)/2, area = sqrt(s*(s-a)*(s-b)*(s-c)). Dùng bubble sort để sắp xếp theo diện tích.',
    solution: `#include <stdio.h>
#include <math.h>

typedef struct { int a, b, c; } Triangle;

double area(Triangle t) {
    double s = (t.a + t.b + t.c) / 2.0;
    return sqrt(s * (s - t.a) * (s - t.b) * (s - t.c));
}

int main() {
    int n;
    scanf("%d", &n);
    Triangle t[n];
    for (int i = 0; i < n; i++)
        scanf("%d %d %d", &t[i].a, &t[i].b, &t[i].c);
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (area(t[j]) > area(t[j+1])) {
                Triangle temp = t[j];
                t[j] = t[j+1];
                t[j+1] = temp;
            }
    for (int i = 0; i < n; i++)
        printf("%d %d %d\\n", t[i].a, t[i].b, t[i].c);
    return 0;
}`,
    testCases: [
      { input: '3\n3 4 5\n5 6 7\n6 8 10', expectedOutput: '3 4 5\n5 6 7\n6 8 10', isHidden: false },
      { input: '2\n7 8 9\n3 4 5', expectedOutput: '3 4 5\n7 8 9', isHidden: false },
      { input: '1\n5 12 13', expectedOutput: '5 12 13', isHidden: true },
    ],
  },
  'post-transition': {
    title: 'Post Transition',
    difficulty: 'hard',
    description: 'Quản lý state của các đối tượng với struct và con trỏ. Thực hiện các thao tác chuyển đổi.',
    inputFormat: 'Dòng 1: Số n.\nCác dòng tiếp theo chứa dữ liệu của n đối tượng.',
    constraints: '1 ≤ n ≤ 10',
    sampleInput: '3\nBook 1 10\nPen 2 5\nNotebook 3 15',
    sampleOutput: 'Book 1 10\nPen 2 5\nNotebook 3 15',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    char name[50];
    int id;
    int value;
} Object;

int main() {
    int n;
    scanf("%d", &n);
    Object *objs = (Object*)malloc(n * sizeof(Object));

    // Doc du lieu va xu ly

    free(objs);
    return 0;
}`,
    explanation: 'Cấp phát động mảng Object. Đọc dữ liệu vào struct. Sắp xếp hoặc lọc theo yêu cầu.',
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[50];
    int id;
    int value;
} Object;

int main() {
    int n;
    scanf("%d", &n);
    Object *objs = (Object*)malloc(n * sizeof(Object));
    for (int i = 0; i < n; i++)
        scanf("%s %d %d", objs[i].name, &objs[i].id, &objs[i].value);
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (objs[j].id > objs[j+1].id) {
                Object temp = objs[j];
                objs[j] = objs[j+1];
                objs[j+1] = temp;
            }
    for (int i = 0; i < n; i++)
        printf("%s %d %d\\n", objs[i].name, objs[i].id, objs[i].value);
    free(objs);
    return 0;
}`,
    testCases: [
      { input: '3\nBook 1 10\nPen 2 5\nNotebook 3 15', expectedOutput: 'Book 1 10\nPen 2 5\nNotebook 3 15', isHidden: false },
      { input: '2\nB 2 20\nA 1 10', expectedOutput: 'A 1 10\nB 2 20', isHidden: false },
      { input: '1\nItem 5 99', expectedOutput: 'Item 5 99', isHidden: true },
    ],
  },
  'permutation': {
    title: 'Permutation of Strings',
    difficulty: 'hard',
    description: 'Sinh tất cả hoán vị của mảng chuỗi theo thứ tự từ điển.',
    inputFormat: 'Dòng 1: Số nguyên n.\nn dòng tiếp theo: Các chuỗi.',
    constraints: '2 ≤ n ≤ 6\n1 ≤ |chuỗi| ≤ 50',
    sampleInput: '3\nab\nbc\ncd',
    sampleOutput: 'ab bc cd\nab cd bc\nbc ab cd\nbc cd ab\ncd ab bc\ncd bc ab',
    starterCode: `#include <stdio.h>
#include <string.h>

int main() {
    int n;
    scanf("%d", &n);
    char str[n][50];
    for (int i = 0; i < n; i++)
        scanf("%s", str[i]);

    // Sinh hoan vi

    return 0;
}`,
    explanation: 'Dùng hàm thư viện hoặc tự cài đặt thuật toán sinh hoán vị kế tiếp (next_permutation).',
    solution: `#include <stdio.h>
#include <string.h>

void swap(char *a, char *b) { char t[50]; strcpy(t,a); strcpy(a,b); strcpy(b,t); }

int next_permutation(int n, char s[][50]) {
    int i = n-2;
    while (i >= 0 && strcmp(s[i], s[i+1]) >= 0) i--;
    if (i < 0) return 0;
    int j = n-1;
    while (strcmp(s[j], s[i]) <= 0) j--;
    swap(s[i], s[j]);
    for (int l = i+1, r = n-1; l < r; l++, r--)
        swap(s[l], s[r]);
    return 1;
}

int main() {
    int n;
    scanf("%d", &n);
    char s[n][50];
    for (int i = 0; i < n; i++) scanf("%s", s[i]);
    do {
        for (int i = 0; i < n; i++) printf("%s%c", s[i], i == n-1 ? '\\n' : ' ');
    } while (next_permutation(n, s));
    return 0;
}`,
    testCases: [
      { input: '3\nab\nbc\ncd', expectedOutput: 'ab bc cd\nab cd bc\nbc ab cd\nbc cd ab\ncd ab bc\ncd bc ab', isHidden: false },
      { input: '2\na\nb', expectedOutput: 'a b\nb a', isHidden: false },
      { input: '3\nx\ny\nz', expectedOutput: 'x y z\nx z y\ny x z\ny z x\nz x y\nz y x', isHidden: true },
    ],
  },
}

export default function ProblemPage() {
  const params = useParams()
  const id = params.id as string
  const [showEditorial, setShowEditorial] = useState(false)
  const [tab, setTab] = useState<'problem' | 'editor' | 'result'>('problem')
  const { handleRun, handleTestCases, testResults, showTestPanel, isRunning } = useJudge()
  const reset = useEditorStore((s) => s.reset)

  const problem = problemData[id]

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#f38ba8] font-mono mb-2">Bài tập không tồn tại</h1>
        <p className="text-[#6c7086] font-mono">ID: {id}</p>
      </div>
    )
  }

  const difficultyColors: Record<Difficulty, string> = {
    easy: 'text-[#a6e3a1] bg-[#a6e3a1]/10',
    medium: 'text-[#f9e2af] bg-[#f9e2af]/10',
    hard: 'text-[#f38ba8] bg-[#f38ba8]/10',
  }

  const handleSubmit = async () => {
    await handleTestCases(problem.testCases)
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row">
      {/* Mobile tabs */}
      <div className="lg:hidden flex border-b border-[#313244]">
        {(['problem', 'editor', 'result'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-4 py-2 text-sm font-mono transition-colors ${
              tab === t
                ? 'text-[#a6e3a1] border-b-2 border-[#a6e3a1] bg-[#181825]'
                : 'text-[#6c7086] hover:text-[#a6adc8]'
            }`}
          >
            {t === 'problem' ? 'Đề bài' : t === 'editor' ? 'Editor' : 'Kết quả'}
          </button>
        ))}
      </div>

      {/* Problem description */}
      <div className={`lg:w-2/5 xl:w-1/3 border-r border-[#313244] overflow-y-auto ${
        tab !== 'problem' ? 'hidden lg:block' : 'flex-1'
      }`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-lg font-bold font-mono text-[#cdd6f4]">{problem.title}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${difficultyColors[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-[#cdd6f4] font-medium mb-1 font-mono">Mô tả</h3>
              <p className="text-[#a6adc8] leading-relaxed">{problem.description}</p>
            </div>

            <div>
              <h3 className="text-[#cdd6f4] font-medium mb-1 font-mono">Input Format</h3>
              <pre className="bg-[#181825] p-3 rounded-lg text-[#a6adc8] text-xs whitespace-pre-wrap">{problem.inputFormat}</pre>
            </div>

            <div>
              <h3 className="text-[#cdd6f4] font-medium mb-1 font-mono">Constraints</h3>
              <pre className="bg-[#181825] p-3 rounded-lg text-[#a6adc8] text-xs">{problem.constraints}</pre>
            </div>

            <div>
              <h3 className="text-[#cdd6f4] font-medium mb-1 font-mono">Sample Input</h3>
              <pre className="bg-[#181825] p-3 rounded-lg text-[#a6e3a1] text-xs">{problem.sampleInput}</pre>
            </div>

            <div>
              <h3 className="text-[#cdd6f4] font-medium mb-1 font-mono">Sample Output</h3>
              <pre className="bg-[#181825] p-3 rounded-lg text-[#a6e3a1] text-xs">{problem.sampleOutput}</pre>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditorial(!showEditorial)}
              className="w-full"
            >
              {showEditorial ? 'Ẩn Editorial' : 'Xem Editorial'}
            </Button>

            {showEditorial && (
              <Editorial
                solution={problem.solution}
                explanation={problem.explanation}
                isUnlocked={true}
                hoursUntilUnlock={0}
              />
            )}
          </div>
        </div>
      </div>

      {/* Editor + Results */}
      <div className={`lg:flex-1 flex flex-col ${tab !== 'editor' && tab !== 'result' ? 'hidden lg:flex' : 'flex-1'}`}>
        <div className="flex-1 min-h-[200px]">
          <CodeEditor
            autoSaveKey={`problem-${id}`}
            onRun={handleRun}
            onSubmit={handleSubmit}
            onReset={() => reset(problem.starterCode)}
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
