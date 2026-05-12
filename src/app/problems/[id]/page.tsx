'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { TestCasePanel } from '@/components/editor/TestCasePanel'
import { Editorial } from '@/components/problems/Editorial'
import { SubmissionHistory } from '@/components/submissions/SubmissionHistory'
import { Button } from '@/components/ui/Button'
import { useJudge } from '@/hooks/useJudge'
import { useEditorStore } from '@/store/editorStore'
import type { Difficulty, Submission } from '@/types'

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
  'calculate-nth-term': {
    title: 'Calculate the Nth Term',
    difficulty: 'easy',
    description: 'Cho 3 số a, b, c và số n. Tính số thứ n theo công thức: f(n) = a nếu n=1, f(n) = b nếu n=2, f(n) = c nếu n=3, f(n) = f(n-1) + f(n-2) + f(n-3) nếu n > 3.',
    inputFormat: 'Một dòng chứa bốn số nguyên a, b, c, n.',
    constraints: '1 ≤ a, b, c, n ≤ 20',
    sampleInput: '1 2 3 5',
    sampleOutput: '11',
    starterCode: `#include <stdio.h>

int find_nth_term(int n, int a, int b, int c) {
    // De quy tinh so thu n
}

int main() {
    int a, b, c, n;
    scanf("%d %d %d %d", &a, &b, &c, &n);
    printf("%d", find_nth_term(n, a, b, c));
    return 0;
}`,
    explanation: 'Dùng đệ quy: nếu n==1 return a, n==2 return b, n==3 return c. Ngược lại return find_nth_term(n-1) + find_nth_term(n-2) + find_nth_term(n-3).',
    solution: `#include <stdio.h>

int find_nth_term(int n, int a, int b, int c) {
    if (n == 1) return a;
    if (n == 2) return b;
    if (n == 3) return c;
    return find_nth_term(n-1, a, b, c) + find_nth_term(n-2, a, b, c) + find_nth_term(n-3, a, b, c);
}

int main() {
    int a, b, c, n;
    scanf("%d %d %d %d", &a, &b, &c, &n);
    printf("%d", find_nth_term(n, a, b, c));
    return 0;
}`,
    testCases: [
      { input: '1 2 3 5', expectedOutput: '11', isHidden: false },
      { input: '1 1 1 10', expectedOutput: '81', isHidden: false },
      { input: '2 4 6 7', expectedOutput: '94', isHidden: true },
    ],
  },
  'printing-pattern': {
    title: 'Printing Pattern Using Loops',
    difficulty: 'medium',
    description: 'In một pattern số dựa trên n. Với n=2: 2 2 2 2 2 \\n 2 1 1 1 2 \\n 2 1 0 1 2 \\n 2 1 1 1 2 \\n 2 2 2 2 2',
    inputFormat: 'Một dòng chứa số nguyên n.',
    constraints: '1 ≤ n ≤ 50',
    sampleInput: '2',
    sampleOutput: '2 2 2 2 2\n2 1 1 1 2\n2 1 0 1 2\n2 1 1 1 2\n2 2 2 2 2',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    // In pattern

    return 0;
}`,
    explanation: 'Kích thước ma trận là 2*n-1. Mỗi ô (i,j) có giá trị = max(abs(n-1-i), abs(n-1-j)) + 1.',
    solution: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int size = 2*n - 1;
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            int val = abs(n-1-i) > abs(n-1-j) ? abs(n-1-i) : abs(n-1-j);
            printf("%d ", val + 1);
        }
        printf("\\n");
    }
    return 0;
}`,
    testCases: [
      { input: '2', expectedOutput: '2 2 2 2 2\n2 1 1 1 2\n2 1 0 1 2\n2 1 1 1 2\n2 2 2 2 2', isHidden: false },
      { input: '1', expectedOutput: '1', isHidden: false },
      { input: '3', expectedOutput: '3 3 3 3 3 3 3\n3 2 2 2 2 2 3\n3 2 1 1 1 2 3\n3 2 1 0 1 2 3\n3 2 1 1 1 2 3\n3 2 2 2 2 2 3\n3 3 3 3 3 3 3', isHidden: true },
    ],
  },
  'reverse-string': {
    title: 'Reverse a String',
    difficulty: 'easy',
    description: 'Viết chương trình đảo ngược một chuỗi nhập từ bàn phím và in ra.',
    inputFormat: 'Một dòng chứa chuỗi s.',
    constraints: '1 ≤ |s| ≤ 1000',
    sampleInput: 'hello',
    sampleOutput: 'olleh',
    starterCode: `#include <stdio.h>
#include <string.h>

int main() {
    char s[1000];
    scanf("%s", s);

    // Dao nguoc va in chuoi

    return 0;
}`,
    explanation: 'Dùng hai con trỏ: left ở đầu, right ở cuối. Hoán đổi và di chuyển vào giữa.',
    solution: `#include <stdio.h>
#include <string.h>

int main() {
    char s[1000];
    scanf("%s", s);
    int len = strlen(s);
    for (int i = 0, j = len-1; i < j; i++, j--) {
        char temp = s[i];
        s[i] = s[j];
        s[j] = temp;
    }
    printf("%s", s);
    return 0;
}`,
    testCases: [
      { input: 'hello', expectedOutput: 'olleh', isHidden: false },
      { input: 'C programming', expectedOutput: 'gnimmargorp C', isHidden: false },
      { input: 'racecar', expectedOutput: 'racecar', isHidden: true },
    ],
  },
  'palindrome-check': {
    title: 'Palindrome Check',
    difficulty: 'easy',
    description: 'Kiểm tra một chuỗi có phải palindrome (đọc xuôi ngược như nhau) hay không.',
    inputFormat: 'Một dòng chứa chuỗi s.',
    constraints: '1 ≤ |s| ≤ 1000',
    sampleInput: 'racecar',
    sampleOutput: 'Yes',
    starterCode: `#include <stdio.h>
#include <string.h>

int main() {
    char s[1000];
    scanf("%s", s);

    // Kiem tra palindrome

    return 0;
}`,
    explanation: 'So sánh ký tự đầu và cuối, lùi dần vào giữa. Nếu có cặp nào khác nhau thì không phải palindrome.',
    solution: `#include <stdio.h>
#include <string.h>

int main() {
    char s[1000];
    scanf("%s", s);
    int len = strlen(s);
    int is_pal = 1;
    for (int i = 0, j = len-1; i < j; i++, j--) {
        if (s[i] != s[j]) { is_pal = 0; break; }
    }
    printf("%s", is_pal ? "Yes" : "No");
    return 0;
}`,
    testCases: [
      { input: 'racecar', expectedOutput: 'Yes', isHidden: false },
      { input: 'hello', expectedOutput: 'No', isHidden: false },
      { input: 'abccba', expectedOutput: 'Yes', isHidden: true },
    ],
  },
  'fibonacci-series': {
    title: 'Fibonacci Series',
    difficulty: 'easy',
    description: 'In n số đầu tiên của dãy Fibonacci. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).',
    inputFormat: 'Một dòng chứa số nguyên n.',
    constraints: '1 ≤ n ≤ 30',
    sampleInput: '7',
    sampleOutput: '0 1 1 2 3 5 8',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    // In n so fibonacci dau tien

    return 0;
}`,
    explanation: 'Dùng vòng lặp: a=0, b=1. In a, sau đó tính next=a+b, gán a=b, b=next.',
    solution: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        printf("%d ", a);
        int next = a + b;
        a = b;
        b = next;
    }
    return 0;
}`,
    testCases: [
      { input: '7', expectedOutput: '0 1 1 2 3 5 8', isHidden: false },
      { input: '5', expectedOutput: '0 1 1 2 3', isHidden: false },
      { input: '10', expectedOutput: '0 1 1 2 3 5 8 13 21 34', isHidden: true },
    ],
  },
  'gcd-euclid': {
    title: 'GCD using Euclid Algorithm',
    difficulty: 'easy',
    description: 'Tìm ước chung lớn nhất (GCD) của hai số nguyên dương bằng thuật toán Euclid.',
    inputFormat: 'Một dòng chứa hai số nguyên a và b.',
    constraints: '1 ≤ a, b ≤ 10^6',
    sampleInput: '12 18',
    sampleOutput: '6',
    starterCode: `#include <stdio.h>

int gcd(int a, int b) {
    // Thuat toan Euclid
}

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d", gcd(a, b));
    return 0;
}`,
    explanation: 'Thuật toán Euclid: gcd(a,b) = gcd(b, a%b). Lặp đến khi b=0 thì a là kết quả.',
    solution: `#include <stdio.h>

int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d", gcd(a, b));
    return 0;
}`,
    testCases: [
      { input: '12 18', expectedOutput: '6', isHidden: false },
      { input: '100 35', expectedOutput: '5', isHidden: false },
      { input: '17 13', expectedOutput: '1', isHidden: true },
    ],
  },
  'prime-check': {
    title: 'Prime Number Check',
    difficulty: 'easy',
    description: 'Kiểm tra một số nguyên dương có phải số nguyên tố hay không.',
    inputFormat: 'Một dòng chứa số nguyên n.',
    constraints: '1 ≤ n ≤ 10^6',
    sampleInput: '17',
    sampleOutput: 'Yes',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    // Kiem tra nguyen to

    return 0;
}`,
    explanation: 'Số nguyên tố là số > 1 và chỉ chia hết cho 1 và chính nó. Kiểm tra từ 2 đến sqrt(n).',
    solution: `#include <stdio.h>
#include <math.h>

int main() {
    int n;
    scanf("%d", &n);
    if (n < 2) { printf("No"); return 0; }
    int is_prime = 1;
    for (int i = 2; i <= sqrt(n); i++) {
        if (n % i == 0) { is_prime = 0; break; }
    }
    printf("%s", is_prime ? "Yes" : "No");
    return 0;
}`,
    testCases: [
      { input: '17', expectedOutput: 'Yes', isHidden: false },
      { input: '15', expectedOutput: 'No', isHidden: false },
      { input: '97', expectedOutput: 'Yes', isHidden: true },
    ],
  },
  'matrix-multiplication': {
    title: 'Matrix Multiplication',
    difficulty: 'medium',
    description: 'Nhân hai ma trận a (m×n) và b (n×p), in ma trận kết quả.',
    inputFormat: 'Dòng 1: m n p.\nm dòng tiếp: Ma trận a (m×n).\np dòng tiếp: Ma trận b (n×p).',
    constraints: '1 ≤ m, n, p ≤ 10\n1 ≤ giá trị ≤ 100',
    sampleInput: '2 2 2\n1 2\n3 4\n5 6\n7 8',
    sampleOutput: '19 22\n43 50',
    starterCode: `#include <stdio.h>

int main() {
    int m, n, p;
    scanf("%d %d %d", &m, &n, &p);
    int a[10][10], b[10][10], c[10][10] = {0};

    // Nhap ma tran a, b

    // Nhan ma tran

    // In ket qua

    return 0;
}`,
    explanation: 'c[i][j] = sum(a[i][k] * b[k][j]) với k từ 0 đến n-1.',
    solution: `#include <stdio.h>

int main() {
    int m, n, p;
    scanf("%d %d %d", &m, &n, &p);
    int a[10][10], b[10][10], c[10][10] = {0};
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < p; j++)
            scanf("%d", &b[i][j]);
    for (int i = 0; i < m; i++)
        for (int j = 0; j < p; j++)
            for (int k = 0; k < n; k++)
                c[i][j] += a[i][k] * b[k][j];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < p; j++)
            printf("%d ", c[i][j]);
        printf("\\n");
    }
    return 0;
}`,
    testCases: [
      { input: '2 2 2\n1 2\n3 4\n5 6\n7 8', expectedOutput: '19 22\n43 50', isHidden: false },
      { input: '2 3 2\n1 2 3\n4 5 6\n7 8\n9 10', expectedOutput: '52 58\n115 130', isHidden: false },
      { input: '1 2 1\n1 2\n3\n4', expectedOutput: '11', isHidden: true },
    ],
  },
  'second-largest': {
    title: 'Second Largest Element',
    difficulty: 'easy',
    description: 'Tìm phần tử lớn thứ hai trong mảng số nguyên.',
    inputFormat: 'Dòng 1: Số nguyên n.\nDòng 2: n số nguyên.',
    constraints: '2 ≤ n ≤ 1000\n1 ≤ arr[i] ≤ 10^6',
    sampleInput: '6\n10 5 8 20 15 12',
    sampleOutput: '15',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    for (int i = 0; i < n; i++)
        scanf("%d", &arr[i]);

    // Tim so lon thu hai

    return 0;
}`,
    explanation: 'Duyệt mảng, giữ largest và second_largest. Nếu arr[i] > largest thì cập nhật second = largest, largest = arr[i].',
    solution: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    for (int i = 0; i < n; i++)
        scanf("%d", &arr[i]);
    int largest = arr[0], second = -1;
    for (int i = 1; i < n; i++) {
        if (arr[i] > largest) { second = largest; largest = arr[i]; }
        else if (arr[i] > second && arr[i] != largest) second = arr[i];
    }
    printf("%d", second);
    return 0;
}`,
    testCases: [
      { input: '6\n10 5 8 20 15 12', expectedOutput: '15', isHidden: false },
      { input: '3\n1 1 1', expectedOutput: '-1', isHidden: false },
      { input: '4\n100 90 80 70', expectedOutput: '90', isHidden: true },
    ],
  },
  'binary-to-decimal': {
    title: 'Binary to Decimal',
    difficulty: 'easy',
    description: 'Chuyển đổi số nhị phân (dạng chuỗi) sang số thập phân.',
    inputFormat: 'Một dòng chứa chuỗi nhị phân s.',
    constraints: '1 ≤ |s| ≤ 30',
    sampleInput: '1011',
    sampleOutput: '11',
    starterCode: `#include <stdio.h>
#include <string.h>

int main() {
    char s[31];
    scanf("%s", s);

    // Chuyen nhi phan sang thap phan

    return 0;
}`,
    explanation: 'Duyệt từ trái sang phải: decimal = decimal * 2 + (s[i] - \'0\').',
    solution: `#include <stdio.h>
#include <string.h>

int main() {
    char s[31];
    scanf("%s", s);
    int dec = 0;
    for (int i = 0; s[i] != '\\0'; i++)
        dec = dec * 2 + (s[i] - '0');
    printf("%d", dec);
    return 0;
}`,
    testCases: [
      { input: '1011', expectedOutput: '11', isHidden: false },
      { input: '11111111', expectedOutput: '255', isHidden: false },
      { input: '1000000', expectedOutput: '64', isHidden: true },
    ],
  },
  'frequency-count': {
    title: 'Element Frequency Count',
    difficulty: 'medium',
    description: 'Đếm tần suất xuất hiện của mỗi phần tử trong mảng và in ra theo thứ tự tăng dần.',
    inputFormat: 'Dòng 1: Số nguyên n.\nDòng 2: n số nguyên.',
    constraints: '1 ≤ n ≤ 1000\n1 ≤ arr[i] ≤ 1000',
    sampleInput: '8\n3 1 4 1 5 3 2 5',
    sampleOutput: '1: 2\n2: 1\n3: 2\n4: 1\n5: 2',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    for (int i = 0; i < n; i++)
        scanf("%d", &arr[i]);

    // Dem tan suat

    return 0;
}`,
    explanation: 'Dùng mảng đếm tối đa 1001 phần tử. Duyệt mảng, tăng đếm. In các số có count > 0.',
    solution: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    int count[1001] = {0};
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
        count[arr[i]]++;
    }
    for (int i = 1; i <= 1000; i++)
        if (count[i] > 0)
            printf("%d: %d\\n", i, count[i]);
    return 0;
}`,
    testCases: [
      { input: '8\n3 1 4 1 5 3 2 5', expectedOutput: '1: 2\n2: 1\n3: 2\n4: 1\n5: 2', isHidden: false },
      { input: '3\n1 1 1', expectedOutput: '1: 3', isHidden: false },
      { input: '5\n10 20 10 20 30', expectedOutput: '10: 2\n20: 2\n30: 1', isHidden: true },
    ],
  },
  'merge-arrays': {
    title: 'Merge Two Sorted Arrays',
    difficulty: 'easy',
    description: 'Cho hai mảng đã được sắp xếp tăng dần. Trộn chúng thành một mảng cũng được sắp xếp tăng dần.',
    inputFormat: 'Dòng 1: n m (kích thước hai mảng).\nDòng 2: n số nguyên (mảng 1).\nDòng 3: m số nguyên (mảng 2).',
    constraints: '1 ≤ n, m ≤ 500\n1 ≤ arr[i] ≤ 10^6',
    sampleInput: '4 3\n1 3 5 7\n2 4 6',
    sampleOutput: '1 2 3 4 5 6 7',
    starterCode: `#include <stdio.h>

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    int a[n], b[m], c[n+m];

    // Nhap hai mang

    // Tron mang

    // In ket qua

    return 0;
}`,
    explanation: 'Dùng 3 con trỏ i, j, k. So sánh a[i] và b[j], copy phần tử nhỏ hơn vào c[k].',
    solution: `#include <stdio.h>

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    int a[n], b[m], c[n+m];
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    for (int i = 0; i < m; i++) scanf("%d", &b[i]);
    int i = 0, j = 0, k = 0;
    while (i < n && j < m)
        c[k++] = (a[i] < b[j]) ? a[i++] : b[j++];
    while (i < n) c[k++] = a[i++];
    while (j < m) c[k++] = b[j++];
    for (int t = 0; t < n+m; t++)
        printf("%d ", c[t]);
    return 0;
}`,
    testCases: [
      { input: '4 3\n1 3 5 7\n2 4 6', expectedOutput: '1 2 3 4 5 6 7', isHidden: false },
      { input: '3 3\n1 2 3\n4 5 6', expectedOutput: '1 2 3 4 5 6', isHidden: false },
      { input: '2 2\n1 4\n2 3', expectedOutput: '1 2 3 4', isHidden: true },
    ],
  },
  'remove-duplicates': {
    title: 'Remove Duplicates from Array',
    difficulty: 'medium',
    description: 'Loại bỏ các phần tử trùng lặp trong mảng, chỉ giữ lại phần tử đầu tiên và in mảng kết quả.',
    inputFormat: 'Dòng 1: Số nguyên n.\nDòng 2: n số nguyên.',
    constraints: '1 ≤ n ≤ 1000\n1 ≤ arr[i] ≤ 1000',
    sampleInput: '8\n1 2 2 3 4 4 5 5',
    sampleOutput: '1 2 3 4 5',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    for (int i = 0; i < n; i++)
        scanf("%d", &arr[i]);

    // Loai bo trung lap

    return 0;
}`,
    explanation: 'Dùng mảng đánh dấu count[1001]. Nếu count[arr[i]] == 0 thì in arr[i] và đánh dấu.',
    solution: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    int count[1001] = {0};
    for (int i = 0; i < n; i++)
        scanf("%d", &arr[i]);
    for (int i = 0; i < n; i++) {
        if (count[arr[i]] == 0) {
            printf("%d ", arr[i]);
            count[arr[i]] = 1;
        }
    }
    return 0;
}`,
    testCases: [
      { input: '8\n1 2 2 3 4 4 5 5', expectedOutput: '1 2 3 4 5', isHidden: false },
      { input: '5\n1 1 1 1 1', expectedOutput: '1', isHidden: false },
      { input: '7\n3 1 2 3 1 2 4', expectedOutput: '3 1 2 4', isHidden: true },
    ],
  },
  'querying-document': {
    title: 'Querying the Document',
    difficulty: 'hard',
    description: 'Phân tích văn bản thành các đoạn (paragraph), mỗi đoạn thành các câu, mỗi câu thành các từ. Trả về từ/câu/đoạn theo truy vấn.',
    inputFormat: 'Dòng đầu: Văn bản (kết thúc bằng #).\nCác truy vấn: paragraph_index sentence_index word_index ...',
    constraints: '1 ≤ độ dài văn bản ≤ 1000',
    sampleInput: 'C is fun.\nLearn C at HackerRank.\n#\n1 1 2',
    sampleOutput: 'fun.',
    starterCode: `#include <stdio.h>
#include <string.h>

int main() {
    char doc[1000];
    // Xu ly van ban va truy van
    return 0;
}`,
    explanation: 'Dùng strtok để tách đoạn, câu, từ. Lưu vào mảng các cấp độ. Truy xuất theo chỉ số.',
    solution: `#include <stdio.h>
#include <string.h>

int main() {
    char doc[1000], line[100];
    int pi, si, wi;
    gets(doc);
    scanf("%d %d %d", &pi, &si, &wi);
    char *para = strtok(doc, "\\n");
    for (int i = 1; i < pi && para; i++)
        para = strtok(NULL, "\\n");
    char *sent = strtok(para, ".");
    for (int i = 1; i < si && sent; i++)
        sent = strtok(NULL, ".");
    char *word = strtok(sent, " ");
    for (int i = 1; i < wi && word; i++)
        word = strtok(NULL, " ");
    printf("%s", word);
    return 0;
}`,
    testCases: [
      { input: 'C is fun.\nLearn C at HackerRank.\n#\n1 1 2', expectedOutput: 'fun.', isHidden: false },
      { input: 'Hello world.\n#\n1 1 1', expectedOutput: 'Hello', isHidden: false },
      { input: 'A B C.\nD E.\n#\n2 1 2', expectedOutput: 'E.', isHidden: true },
    ],
  },
  'factorial': {
    title: 'Factorial of a Number',
    difficulty: 'easy',
    description: 'Tính giai thừa của một số nguyên n (n!). Giai thừa được định nghĩa: n! = n * (n-1) * ... * 1.',
    inputFormat: 'Một dòng chứa số nguyên n.',
    constraints: '0 ≤ n ≤ 12',
    sampleInput: '5',
    sampleOutput: '120',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    // Tinh n!

    return 0;
}`,
    explanation: 'Dùng vòng lặp: kết quả *= i từ 1 đến n. Nếu n=0 thì factorial=1.',
    solution: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    long long fact = 1;
    for (int i = 2; i <= n; i++)
        fact *= i;
    printf("%lld", fact);
    return 0;
}`,
    testCases: [
      { input: '5', expectedOutput: '120', isHidden: false },
      { input: '0', expectedOutput: '1', isHidden: false },
      { input: '10', expectedOutput: '3628800', isHidden: true },
    ],
  },
  'armstrong-number': {
    title: 'Armstrong Number',
    difficulty: 'easy',
    description: 'Kiểm tra số Armstrong (tổng lũy thừa 3 của các chữ số bằng chính số đó). Ví dụ: 153 = 1^3 + 5^3 + 3^3.',
    inputFormat: 'Một dòng chứa số nguyên n.',
    constraints: '100 ≤ n ≤ 999',
    sampleInput: '153',
    sampleOutput: 'Yes',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    // Kiem tra Armstrong

    return 0;
}`,
    explanation: 'Tách từng chữ số: digit = n % 10, sum += digit*digit*digit, n /= 10. So sánh sum với n ban đầu.',
    solution: `#include <stdio.h>

int main() {
    int n, temp, sum = 0;
    scanf("%d", &n);
    temp = n;
    while (temp > 0) {
        int digit = temp % 10;
        sum += digit * digit * digit;
        temp /= 10;
    }
    printf("%s", sum == n ? "Yes" : "No");
    return 0;
}`,
    testCases: [
      { input: '153', expectedOutput: 'Yes', isHidden: false },
      { input: '123', expectedOutput: 'No', isHidden: false },
      { input: '370', expectedOutput: 'Yes', isHidden: true },
    ],
  },
  'perfect-number': {
    title: 'Perfect Number',
    difficulty: 'easy',
    description: 'Kiểm tra số hoàn hảo (tổng các ước số bằng chính số đó). Ví dụ: 6 = 1 + 2 + 3.',
    inputFormat: 'Một dòng chứa số nguyên n.',
    constraints: '1 ≤ n ≤ 10^5',
    sampleInput: '28',
    sampleOutput: 'Yes',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    // Kiem tra so hoan hao

    return 0;
}`,
    explanation: 'Tính tổng các ước số từ 1 đến n/2. Nếu tổng == n thì là số hoàn hảo.',
    solution: `#include <stdio.h>

int main() {
    int n, sum = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n/2; i++)
        if (n % i == 0) sum += i;
    printf("%s", sum == n ? "Yes" : "No");
    return 0;
}`,
    testCases: [
      { input: '28', expectedOutput: 'Yes', isHidden: false },
      { input: '12', expectedOutput: 'No', isHidden: false },
      { input: '496', expectedOutput: 'Yes', isHidden: true },
    ],
  },
  'count-vowels': {
    title: 'Count Vowels and Consonants',
    difficulty: 'easy',
    description: 'Đếm số lượng nguyên âm (a, e, i, o, u) và phụ âm trong một chuỗi.',
    inputFormat: 'Một dòng chứa chuỗi s.',
    constraints: '1 ≤ |s| ≤ 1000',
    sampleInput: 'Hello World',
    sampleOutput: '3 7',
    starterCode: `#include <stdio.h>
#include <string.h>

int main() {
    char s[1000];
    fgets(s, 1000, stdin);

    // Dem nguyen am va phu am

    return 0;
}`,
    explanation: 'Duyệt chuỗi, nếu là chữ cái thì kiểm tra nguyên âm/phụ âm. Dùng tolower() để chuyển về chữ thường.',
    solution: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main() {
    char s[1000];
    fgets(s, 1000, stdin);
    int vowels = 0, cons = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        char c = tolower(s[i]);
        if (c >= 'a' && c <= 'z') {
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
                vowels++;
            else
                cons++;
        }
    }
    printf("%d %d", vowels, cons);
    return 0;
}`,
    testCases: [
      { input: 'Hello World', expectedOutput: '3 7', isHidden: false },
      { input: 'AEIOU', expectedOutput: '5 0', isHidden: false },
      { input: 'xyz', expectedOutput: '0 3', isHidden: true },
    ],
  },
  'decimal-to-binary': {
    title: 'Decimal to Binary',
    difficulty: 'easy',
    description: 'Chuyển đổi số thập phân sang nhị phân và in ra kết quả.',
    inputFormat: 'Một dòng chứa số nguyên n.',
    constraints: '1 ≤ n ≤ 10^6',
    sampleInput: '11',
    sampleOutput: '1011',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    // Chuyen sang nhi phan

    return 0;
}`,
    explanation: 'Chia n cho 2, lấy số dư. In các số dư theo thứ tự ngược lại. Hoặc dùng mảng để lưu kết quả.',
    solution: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int bin[32], i = 0;
    while (n > 0) {
        bin[i++] = n % 2;
        n /= 2;
    }
    for (int j = i-1; j >= 0; j--)
        printf("%d", bin[j]);
    return 0;
}`,
    testCases: [
      { input: '11', expectedOutput: '1011', isHidden: false },
      { input: '255', expectedOutput: '11111111', isHidden: false },
      { input: '16', expectedOutput: '10000', isHidden: true },
    ],
  },
  'leap-year': {
    title: 'Leap Year Check',
    difficulty: 'easy',
    description: 'Kiểm tra một năm có phải năm nhuận hay không. Năm nhuận: chia hết cho 400, hoặc chia hết cho 4 nhưng không chia hết cho 100.',
    inputFormat: 'Một dòng chứa số nguyên year.',
    constraints: '1 ≤ year ≤ 10^5',
    sampleInput: '2024',
    sampleOutput: 'Yes',
    starterCode: `#include <stdio.h>

int main() {
    int year;
    scanf("%d", &year);

    // Kiem tra nam nhuan

    return 0;
}`,
    explanation: 'if (year % 400 == 0) la nam nhuan; else if (year % 100 == 0) khong phai; else if (year % 4 == 0) la nam nhuan.',
    solution: `#include <stdio.h>

int main() {
    int year;
    scanf("%d", &year);
    if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0))
        printf("Yes");
    else
        printf("No");
    return 0;
}`,
    testCases: [
      { input: '2024', expectedOutput: 'Yes', isHidden: false },
      { input: '1900', expectedOutput: 'No', isHidden: false },
      { input: '2000', expectedOutput: 'Yes', isHidden: true },
    ],
  },
  'pyramid-pattern': {
    title: 'Pyramid Pattern',
    difficulty: 'easy',
    description: 'In hình kim tự tháp bằng dấu * với n dòng.',
    inputFormat: 'Một dòng chứa số nguyên n.',
    constraints: '1 ≤ n ≤ 20',
    sampleInput: '4',
    sampleOutput: '   *\n  ***\n *****\n*******',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    // In hinh kim tu thap

    return 0;
}`,
    explanation: 'Mỗi dòng i (từ 1 đến n) có n-i khoảng trắng và 2*i-1 dấu *.',
    solution: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n-i; j++) printf(" ");
        for (int j = 1; j <= 2*i-1; j++) printf("*");
        printf("\\n");
    }
    return 0;
}`,
    testCases: [
      { input: '4', expectedOutput: '   *\n  ***\n *****\n*******', isHidden: false },
      { input: '2', expectedOutput: ' *\n***', isHidden: false },
      { input: '3', expectedOutput: '  *\n ***\n*****', isHidden: true },
    ],
  },
  'transpose-matrix': {
    title: 'Transpose of a Matrix',
    difficulty: 'easy',
    description: 'Tính ma trận chuyển vị của ma trận kích thước m×n. Chuyển vị: đổi hàng thành cột.',
    inputFormat: 'Dòng 1: m n.\nm dòng sau: Ma trận a (m×n).',
    constraints: '1 ≤ m, n ≤ 10\n1 ≤ giá trị ≤ 100',
    sampleInput: '2 3\n1 2 3\n4 5 6',
    sampleOutput: '1 4\n2 5\n3 6',
    starterCode: `#include <stdio.h>

int main() {
    int m, n;
    scanf("%d %d", &m, &n);
    int a[10][10];

    // Nhap ma tran

    // In ma tran chuyen vi

    return 0;
}`,
    explanation: 'Ma trận chuyển vị có kích thước n×m. result[j][i] = a[i][j].',
    solution: `#include <stdio.h>

int main() {
    int m, n;
    scanf("%d %d", &m, &n);
    int a[10][10];
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);
    for (int j = 0; j < n; j++) {
        for (int i = 0; i < m; i++)
            printf("%d ", a[i][j]);
        printf("\\n");
    }
    return 0;
}`,
    testCases: [
      { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '1 4\n2 5\n3 6', isHidden: false },
      { input: '3 2\n1 2\n3 4\n5 6', expectedOutput: '1 3 5\n2 4 6', isHidden: false },
      { input: '2 2\n1 0\n0 1', expectedOutput: '1 0\n0 1', isHidden: true },
    ],
  },
  'sum-of-diagonals': {
    title: 'Sum of Matrix Diagonals',
    difficulty: 'easy',
    description: 'Tính tổng đường chéo chính và đường chéo phụ của ma trận vuông n×n.',
    inputFormat: 'Dòng 1: n.\nn dòng sau: Ma trận n×n.',
    constraints: '1 ≤ n ≤ 10\n1 ≤ giá trị ≤ 100',
    sampleInput: '3\n1 2 3\n4 5 6\n7 8 9',
    sampleOutput: '15 15',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[10][10];

    // Nhap va tinh tong 2 duong cheo

    return 0;
}`,
    explanation: 'Đường chéo chính: i == j. Đường chéo phụ: i + j == n-1.',
    solution: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[10][10], main_sum = 0, sec_sum = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) {
            scanf("%d", &a[i][j]);
            if (i == j) main_sum += a[i][j];
            if (i + j == n-1) sec_sum += a[i][j];
        }
    printf("%d %d", main_sum, sec_sum);
    return 0;
}`,
    testCases: [
      { input: '3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '15 15', isHidden: false },
      { input: '2\n1 2\n3 4', expectedOutput: '5 5', isHidden: false },
      { input: '1\n42', expectedOutput: '42 42', isHidden: true },
    ],
  },
  'insertion-sort': {
    title: 'Insertion Sort',
    difficulty: 'easy',
    description: 'Cài đặt thuật toán sắp xếp chèn (Insertion Sort) để sắp xếp mảng tăng dần.',
    inputFormat: 'Dòng 1: Số nguyên n.\nDòng 2: n số nguyên.',
    constraints: '1 ≤ n ≤ 500\n1 ≤ arr[i] ≤ 10^4',
    sampleInput: '6\n5 2 4 6 1 3',
    sampleOutput: '1 2 3 4 5 6',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    for (int i = 0; i < n; i++)
        scanf("%d", &arr[i]);

    // Insertion sort

    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    return 0;
}`,
    explanation: 'Duyệt từ i=1 đến n-1. Lưu key=arr[i], dịch các phần tử > key lên 1 vị trí. Chèn key vào vị trí đúng.',
    solution: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    for (int i = 0; i < n; i++)
        scanf("%d", &arr[i]);
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    return 0;
}`,
    testCases: [
      { input: '6\n5 2 4 6 1 3', expectedOutput: '1 2 3 4 5 6', isHidden: false },
      { input: '3\n3 2 1', expectedOutput: '1 2 3', isHidden: false },
      { input: '5\n1 2 3 4 5', expectedOutput: '1 2 3 4 5', isHidden: true },
    ],
  },
  'anagram-check': {
    title: 'Anagram Check',
    difficulty: 'medium',
    description: 'Kiểm tra hai chuỗi có phải là anagram (cùng tập ký tự với số lượng bằng nhau) hay không.',
    inputFormat: 'Dòng 1: Chuỗi s1.\nDòng 2: Chuỗi s2.',
    constraints: '1 ≤ |s1|, |s2| ≤ 1000',
    sampleInput: 'listen\nsilent',
    sampleOutput: 'Yes',
    starterCode: `#include <stdio.h>
#include <string.h>

int main() {
    char s1[1000], s2[1000];
    scanf("%s %s", s1, s2);

    // Kiem tra anagram

    return 0;
}`,
    explanation: 'Dùng mảng đếm 26 ký tự. Tăng với s1, giảm với s2. Nếu tất cả đều 0 thì là anagram.',
    solution: `#include <stdio.h>
#include <string.h>

int main() {
    char s1[1000], s2[1000];
    scanf("%s %s", s1, s2);
    int count[26] = {0};
    if (strlen(s1) != strlen(s2)) { printf("No"); return 0; }
    for (int i = 0; s1[i] != '\\0'; i++) {
        count[s1[i]-'a']++;
        count[s2[i]-'a']--;
    }
    int ok = 1;
    for (int i = 0; i < 26; i++)
        if (count[i] != 0) { ok = 0; break; }
    printf("%s", ok ? "Yes" : "No");
    return 0;
}`,
    testCases: [
      { input: 'listen\nsilent', expectedOutput: 'Yes', isHidden: false },
      { input: 'hello\nworld', expectedOutput: 'No', isHidden: false },
      { input: 'triangle\nintegral', expectedOutput: 'Yes', isHidden: true },
    ],
  },
  'longest-word': {
    title: 'Find Longest Word',
    difficulty: 'easy',
    description: 'Tìm và in ra từ dài nhất trong một câu. Nếu nhiều từ có cùng độ dài, in từ đầu tiên.',
    inputFormat: 'Một dòng chứa câu s.',
    constraints: '1 ≤ |s| ≤ 500',
    sampleInput: 'I love programming in C',
    sampleOutput: 'programming',
    starterCode: `#include <stdio.h>
#include <string.h>

int main() {
    char s[500];
    fgets(s, 500, stdin);

    // Tim tu dai nhat

    return 0;
}`,
    explanation: 'Dùng strtok để tách từ. So sánh strlen của mỗi từ, lưu từ dài nhất.',
    solution: `#include <stdio.h>
#include <string.h>

int main() {
    char s[500];
    fgets(s, 500, stdin);
    s[strcspn(s, "\\n")] = '\\0';
    char *token = strtok(s, " ");
    char *longest = token;
    while (token != NULL) {
        if (strlen(token) > strlen(longest))
            longest = token;
        token = strtok(NULL, " ");
    }
    printf("%s", longest);
    return 0;
}`,
    testCases: [
      { input: 'I love programming in C', expectedOutput: 'programming', isHidden: false },
      { input: 'C is fun', expectedOutput: 'fun', isHidden: false },
      { input: 'a bb ccc dd', expectedOutput: 'ccc', isHidden: true },
    ],
  },
  'circular-rotation': {
    title: 'Array Circular Rotation',
    difficulty: 'medium',
    description: 'Xoay mảng sang phải k lần. Mỗi lần xoay, phần tử cuối cùng được đưa lên đầu.',
    inputFormat: 'Dòng 1: n k.\nDòng 2: n số nguyên.',
    constraints: '1 ≤ n ≤ 1000\n0 ≤ k ≤ 100',
    sampleInput: '5 2\n1 2 3 4 5',
    sampleOutput: '4 5 1 2 3',
    starterCode: `#include <stdio.h>

int main() {
    int n, k;
    scanf("%d %d", &n, &k);
    int arr[n];
    for (int i = 0; i < n; i++)
        scanf("%d", &arr[i]);

    // Xoay mang k lan

    return 0;
}`,
    explanation: 'Tối ưu: k = k % n. Tạo mảng kết quả: result[i] = arr[(n-k+i) % n].',
    solution: `#include <stdio.h>

int main() {
    int n, k;
    scanf("%d %d", &n, &k);
    int arr[n];
    for (int i = 0; i < n; i++)
        scanf("%d", &arr[i]);
    k = k % n;
    for (int i = 0; i < n; i++)
        printf("%d ", arr[(n - k + i) % n]);
    return 0;
}`,
    testCases: [
      { input: '5 2\n1 2 3 4 5', expectedOutput: '4 5 1 2 3', isHidden: false },
      { input: '3 1\n10 20 30', expectedOutput: '30 10 20', isHidden: false },
      { input: '4 6\n1 2 3 4', expectedOutput: '3 4 1 2', isHidden: true },
    ],
  },
  'symmetric-matrix': {
    title: 'Symmetric Matrix Check',
    difficulty: 'easy',
    description: 'Kiểm tra ma trận vuông có đối xứng qua đường chéo chính hay không (a[i][j] == a[j][i]).',
    inputFormat: 'Dòng 1: n.\nn dòng sau: Ma trận n×n.',
    constraints: '1 ≤ n ≤ 10\n1 ≤ giá trị ≤ 100',
    sampleInput: '3\n1 2 3\n2 4 5\n3 5 6',
    sampleOutput: 'Symmetric',
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[10][10];

    // Kiem tra ma tran doi xung

    return 0;
}`,
    explanation: 'Kiểm tra a[i][j] == a[j][i] với mọi i > j. Nếu khác thì không đối xứng.',
    solution: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[10][10], sym = 1;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);
    for (int i = 0; i < n; i++)
        for (int j = i+1; j < n; j++)
            if (a[i][j] != a[j][i]) { sym = 0; break; }
    printf("%s", sym ? "Symmetric" : "Not Symmetric");
    return 0;
}`,
    testCases: [
      { input: '3\n1 2 3\n2 4 5\n3 5 6', expectedOutput: 'Symmetric', isHidden: false },
      { input: '2\n1 2\n3 4', expectedOutput: 'Not Symmetric', isHidden: false },
      { input: '1\n5', expectedOutput: 'Symmetric', isHidden: true },
    ],
  },
  'tower-of-hanoi': {
    title: 'Tower of Hanoi',
    difficulty: 'hard',
    description: 'In các bước di chuyển đĩa trong bài toán Tháp Hà Nội với n đĩa từ cột A sang cột C, dùng cột B làm trung gian.',
    inputFormat: 'Một dòng chứa số nguyên n.',
    constraints: '1 ≤ n ≤ 10',
    sampleInput: '3',
    sampleOutput: 'A -> C\nA -> B\nC -> B\nA -> C\nB -> A\nB -> C\nA -> C',
    starterCode: `#include <stdio.h>

void hanoi(int n, char from, char to, char aux) {
    // Di chuyen n dia tu from sang to, su dung aux
}

int main() {
    int n;
    scanf("%d", &n);
    hanoi(n, 'A', 'C', 'B');
    return 0;
}`,
    explanation: 'Đệ quy: chuyển n-1 đĩa từ A sang B, chuyển đĩa cuối từ A sang C, chuyển n-1 đĩa từ B sang C.',
    solution: `#include <stdio.h>

void hanoi(int n, char from, char to, char aux) {
    if (n == 1) { printf("%c -> %c\\n", from, to); return; }
    hanoi(n-1, from, aux, to);
    printf("%c -> %c\\n", from, to);
    hanoi(n-1, aux, to, from);
}

int main() {
    int n;
    scanf("%d", &n);
    hanoi(n, 'A', 'C', 'B');
    return 0;
}`,
    testCases: [
      { input: '1', expectedOutput: 'A -> C', isHidden: false },
      { input: '2', expectedOutput: 'A -> B\nA -> C\nB -> C', isHidden: false },
      { input: '3', expectedOutput: 'A -> C\nA -> B\nC -> B\nA -> C\nB -> A\nB -> C\nA -> C', isHidden: true },
    ],
  },
  'n-queens': {
    title: 'N-Queens Problem',
    difficulty: 'hard',
    description: 'Xếp n quân hậu lên bàn cờ n×n sao cho không quân hậu nào ăn nhau. In một cách xếp hoặc "No solution" nếu không có.',
    inputFormat: 'Một dòng chứa số nguyên n.',
    constraints: '1 ≤ n ≤ 10',
    sampleInput: '4',
    sampleOutput: '. Q . .\n. . . Q\nQ . . .\n. . Q .',
    starterCode: `#include <stdio.h>

int board[10][10];

int is_safe(int n, int row, int col) {
    // Kiem tra dat quan hau tai (row, col) co an toan?
}

void solve(int n, int row) {
    // De quy xep quan hau
}

int main() {
    int n;
    scanf("%d", &n);
    // Khoi tao ban co va goi solve
    return 0;
}`,
    explanation: 'Đệ quy quay lui: thử đặt hậu từng hàng. Kiểm tra cột và đường chéo. Nếu đặt được đến hàng cuối thì in kết quả.',
    solution: `#include <stdio.h>
#include <stdlib.h>

int board[10][10], found = 0;

int is_safe(int n, int row, int col) {
    for (int i = 0; i < row; i++)
        if (board[i][col]) return 0;
    for (int i = row-1, j = col-1; i >= 0 && j >= 0; i--, j--)
        if (board[i][j]) return 0;
    for (int i = row-1, j = col+1; i >= 0 && j < n; i--, j++)
        if (board[i][j]) return 0;
    return 1;
}

void solve(int n, int row) {
    if (row == n) {
        found = 1;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++)
                printf("%c ", board[i][j] ? 'Q' : '.');
            printf("\\n");
        }
        return;
    }
    for (int col = 0; col < n; col++) {
        if (is_safe(n, row, col)) {
            board[row][col] = 1;
            solve(n, row+1);
            if (found) return;
            board[row][col] = 0;
        }
    }
}

int main() {
    int n; scanf("%d", &n);
    if (n == 2 || n == 3) { printf("No solution"); return 0; }
    solve(n, 0);
    return 0;
}`,
    testCases: [
      { input: '1', expectedOutput: 'Q', isHidden: false },
      { input: '4', expectedOutput: '. Q . .\n. . . Q\nQ . . .\n. . Q .', isHidden: false },
      { input: '2', expectedOutput: 'No solution', isHidden: true },
    ],
  },
  'sudoku-solver': {
    title: 'Sudoku Solver',
    difficulty: 'hard',
    description: 'Giải Sudoku 9×9. Một số ô đã được điền sẵn (khác 0), các ô trống là 0. In bảng đã giải.',
    inputFormat: '9 dòng, mỗi dòng 9 số nguyên (0 là ô trống).',
    constraints: '0 ≤ board[i][j] ≤ 9',
    sampleInput: '5 3 0 0 7 0 0 0 0\n6 0 0 1 9 5 0 0 0\n0 9 8 0 0 0 0 6 0\n8 0 0 0 6 0 0 0 3\n4 0 0 8 0 3 0 0 1\n7 0 0 0 2 0 0 0 6\n0 6 0 0 0 0 2 8 0\n0 0 0 4 1 9 0 0 5\n0 0 0 0 8 0 0 7 9',
    sampleOutput: '5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 9',
    starterCode: `#include <stdio.h>

int board[9][9];

int is_valid(int row, int col, int num) {
    // Kiem tra dat num tai (row,col) co hop le?
}

int solve() {
    // Giai sudoku bang quay lui
}

int main() {
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < 9; j++)
            scanf("%d", &board[i][j]);
    solve();
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++)
            printf("%d ", board[i][j]);
        printf("\\n");
    }
    return 0;
}`,
    explanation: 'Quay lui: tìm ô trống, thử số 1-9. Kiểm tra hàng, cột, ô 3×3. Nếu tìm được lời giải thì in ra.',
    solution: `#include <stdio.h>

int board[9][9];

int is_valid(int row, int col, int num) {
    for (int i = 0; i < 9; i++)
        if (board[row][i] == num || board[i][col] == num)
            return 0;
    int br = row - row % 3, bc = col - col % 3;
    for (int i = br; i < br+3; i++)
        for (int j = bc; j < bc+3; j++)
            if (board[i][j] == num) return 0;
    return 1;
}

int solve() {
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < 9; j++)
            if (board[i][j] == 0) {
                for (int num = 1; num <= 9; num++) {
                    if (is_valid(i, j, num)) {
                        board[i][j] = num;
                        if (solve()) return 1;
                        board[i][j] = 0;
                    }
                }
                return 0;
            }
    return 1;
}

int main() {
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < 9; j++)
            scanf("%d", &board[i][j]);
    solve();
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++)
            printf("%d ", board[i][j]);
        printf("\\n");
    }
    return 0;
}`,
    testCases: [
      { input: '5 3 0 0 7 0 0 0 0\n6 0 0 1 9 5 0 0 0\n0 9 8 0 0 0 0 6 0\n8 0 0 0 6 0 0 0 3\n4 0 0 8 0 3 0 0 1\n7 0 0 0 2 0 0 0 6\n0 6 0 0 0 0 2 8 0\n0 0 0 4 1 9 0 0 5\n0 0 0 0 8 0 0 7 9', expectedOutput: '5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 9', isHidden: false },
      { input: '0 0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0 0', expectedOutput: '1 2 3 4 5 6 7 8 9\n4 5 6 7 8 9 1 2 3\n7 8 9 1 2 3 4 5 6\n2 1 4 3 6 5 8 9 7\n3 6 5 8 9 7 2 1 4\n8 9 7 2 1 4 3 6 5\n5 3 1 6 4 2 9 7 8\n6 4 2 9 7 8 5 3 1\n9 7 8 5 3 1 6 4 2', isHidden: true },
    ],
  },
  'rat-in-maze': {
    title: 'Rat in a Maze',
    difficulty: 'hard',
    description: 'Cho mê cung n×n với 1 là đường đi, 0 là tường. Chuột ở (0,0) cần đến (n-1,n-1). In đường đi hoặc "No path".',
    inputFormat: 'Dòng 1: n.\nn dòng sau: Ma trận n×n (0: tường, 1: đường).',
    constraints: '1 ≤ n ≤ 10',
    sampleInput: '4\n1 0 0 0\n1 1 0 1\n0 1 0 0\n1 1 1 1',
    sampleOutput: '1 0 0 0\n1 1 0 0\n0 1 0 0\n0 1 1 1',
    starterCode: `#include <stdio.h>

int maze[10][10], sol[10][10] = {0};

int solve_maze(int n, int x, int y) {
    // Tim duong di tu (x,y) den (n-1,n-1)
}

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &maze[i][j]);
    if (solve_maze(n, 0, 0)) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++)
                printf("%d ", sol[i][j]);
            printf("\\n");
        }
    } else printf("No path");
    return 0;
}`,
    explanation: 'Đệ quy quay lui: thử đi xuống, phải. Đánh dấu ô đã đi. Nếu đến đích thì in lời giải.',
    solution: `#include <stdio.h>

int maze[10][10], sol[10][10] = {0};

int solve_maze(int n, int x, int y) {
    if (x == n-1 && y == n-1) { sol[x][y] = 1; return 1; }
    if (x < 0 || x >= n || y < 0 || y >= n || !maze[x][y] || sol[x][y])
        return 0;
    sol[x][y] = 1;
    if (solve_maze(n, x+1, y)) return 1;
    if (solve_maze(n, x, y+1)) return 1;
    sol[x][y] = 0;
    return 0;
}

int main() {
    int n; scanf("%d", &n);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &maze[i][j]);
    if (solve_maze(n, 0, 0))
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++)
                printf("%d ", sol[i][j]);
            printf("\\n");
        }
    else printf("No path");
    return 0;
}`,
    testCases: [
      { input: '4\n1 0 0 0\n1 1 0 1\n0 1 0 0\n1 1 1 1', expectedOutput: '1 0 0 0\n1 1 0 0\n0 1 0 0\n0 1 1 1', isHidden: false },
      { input: '2\n1 1\n0 1', expectedOutput: '1 1\n0 1', isHidden: false },
      { input: '3\n1 0 0\n1 0 0\n1 1 0', expectedOutput: 'No path', isHidden: true },
    ],
  },
  'lcs': {
    title: 'Longest Common Subsequence',
    difficulty: 'hard',
    description: 'Tìm độ dài dãy con chung dài nhất (LCS) của hai chuỗi.',
    inputFormat: 'Dòng 1: Chuỗi s1.\nDòng 2: Chuỗi s2.',
    constraints: '1 ≤ |s1|, |s2| ≤ 100',
    sampleInput: 'ABCDGH\nAEDFHR',
    sampleOutput: '3',
    starterCode: `#include <stdio.h>
#include <string.h>

int max(int a, int b) { return a > b ? a : b; }

int main() {
    char s1[101], s2[101];
    scanf("%s %s", s1, s2);

    // Tinh LCS bang quy hoach dong

    return 0;
}`,
    explanation: 'Dùng bảng DP: dp[i][j] = dp[i-1][j-1] + 1 nếu s1[i]==s2[j], ngược lại = max(dp[i-1][j], dp[i][j-1]).',
    solution: `#include <stdio.h>
#include <string.h>

int max(int a, int b) { return a > b ? a : b; }

int main() {
    char s1[101], s2[101];
    scanf("%s %s", s1, s2);
    int m = strlen(s1), n = strlen(s2);
    int dp[101][101] = {0};
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (s1[i-1] == s2[j-1])
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
    printf("%d", dp[m][n]);
    return 0;
}`,
    testCases: [
      { input: 'ABCDGH\nAEDFHR', expectedOutput: '3', isHidden: false },
      { input: 'ABC\nABC', expectedOutput: '3', isHidden: false },
      { input: 'ABC\nDEF', expectedOutput: '0', isHidden: true },
    ],
  },
  'knapsack': {
    title: '0/1 Knapsack Problem',
    difficulty: 'hard',
    description: 'Cho n vật với trọng lượng và giá trị. Tìm tổng giá trị lớn nhất có thể mang với túi có sức chứa W.',
    inputFormat: 'Dòng 1: n W.\nDòng 2: n số nguyên (giá trị).\nDòng 3: n số nguyên (trọng lượng).',
    constraints: '1 ≤ n ≤ 20\n1 ≤ W ≤ 100\n1 ≤ weight[i], value[i] ≤ 100',
    sampleInput: '3 50\n60 100 120\n10 20 30',
    sampleOutput: '220',
    starterCode: `#include <stdio.h>

int max(int a, int b) { return a > b ? a : b; }

int main() {
    int n, W;
    scanf("%d %d", &n, &W);
    int val[20], wt[20];
    for (int i = 0; i < n; i++) scanf("%d", &val[i]);
    for (int i = 0; i < n; i++) scanf("%d", &wt[i]);

    // Giai bai toan knapsack bang quy hoach dong

    return 0;
}`,
    explanation: 'Bảng DP: dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]]). Kết quả là dp[n][W].',
    solution: `#include <stdio.h>

int max(int a, int b) { return a > b ? a : b; }

int main() {
    int n, W;
    scanf("%d %d", &n, &W);
    int val[20], wt[20], dp[101][101] = {0};
    for (int i = 0; i < n; i++) scanf("%d", &val[i]);
    for (int i = 0; i < n; i++) scanf("%d", &wt[i]);
    for (int i = 1; i <= n; i++)
        for (int w = 1; w <= W; w++)
            if (wt[i-1] <= w)
                dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]]);
            else
                dp[i][w] = dp[i-1][w];
    printf("%d", dp[n][W]);
    return 0;
}`,
    testCases: [
      { input: '3 50\n60 100 120\n10 20 30', expectedOutput: '220', isHidden: false },
      { input: '3 10\n10 20 30\n5 6 7', expectedOutput: '30', isHidden: false },
      { input: '4 8\n10 40 30 50\n5 4 6 3', expectedOutput: '90', isHidden: true },
    ],
  },
  'infix-to-postfix': {
    title: 'Infix to Postfix Conversion',
    difficulty: 'hard',
    description: 'Chuyển biểu thức trung tố (infix) sang hậu tố (postfix) sử dụng stack. Biểu thức gồm + - * / ( ) và chữ cái thường.',
    inputFormat: 'Một dòng chứa biểu thức trung tố.',
    constraints: '1 ≤ độ dài ≤ 100',
    sampleInput: 'a+b*(c-d)',
    sampleOutput: 'abcd-*+',
    starterCode: `#include <stdio.h>
#include <string.h>

char stack[100];
int top = -1;

void push(char c) { stack[++top] = c; }
char pop() { return stack[top--]; }
int priority(char c) {
    // Do uu tien toan tu
}

int main() {
    char expr[100];
    scanf("%s", expr);

    // Chuyen sang hau to

    return 0;
}`,
    explanation: 'Dùng stack. Duyệt biểu thức: nếu là toán hạng thì in ra. Nếu ( thì push. Nếu ) thì pop đến (. Nếu toán tử thì pop các toán tử có độ ưu tiên >= nó.',
    solution: `#include <stdio.h>
#include <string.h>

char stack[100];
int top = -1;

void push(char c) { stack[++top] = c; }
char pop() { return stack[top--]; }
int priority(char c) {
    if (c == '^') return 3;
    if (c == '*' || c == '/') return 2;
    if (c == '+' || c == '-') return 1;
    return 0;
}

int main() {
    char expr[100];
    scanf("%s", expr);
    for (int i = 0; expr[i] != '\\0'; i++) {
        char c = expr[i];
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))
            printf("%c", c);
        else if (c == '(') push(c);
        else if (c == ')') {
            while (top >= 0 && stack[top] != '(')
                printf("%c", pop());
            pop();
        } else {
            while (top >= 0 && priority(stack[top]) >= priority(c))
                printf("%c", pop());
            push(c);
        }
    }
    while (top >= 0) printf("%c", pop());
    return 0;
}`,
    testCases: [
      { input: 'a+b*(c-d)', expectedOutput: 'abcd-*+', isHidden: false },
      { input: 'a+b-c', expectedOutput: 'ab+c-', isHidden: false },
      { input: '(a+b)*c', expectedOutput: 'ab+c*', isHidden: true },
    ],
  },
  'big-number-addition': {
    title: 'Big Number Addition',
    difficulty: 'hard',
    description: 'Tính tổng hai số nguyên rất lớn (lên đến 100 chữ số) bằng cách xử lý chuỗi.',
    inputFormat: 'Dòng 1: Chuỗi thứ nhất.\nDòng 2: Chuỗi thứ hai.',
    constraints: '1 ≤ |s| ≤ 100',
    sampleInput: '12345678901234567890\n98765432109876543210',
    sampleOutput: '111111111011111111100',
    starterCode: `#include <stdio.h>
#include <string.h>

int main() {
    char s1[101], s2[101], res[102];
    scanf("%s %s", s1, s2);

    // Cong hai so lon

    return 0;
}`,
    explanation: 'Duyệt từ cuối lên đầu, cộng từng chữ số + nhớ. Đảo ngược kết quả.',
    solution: `#include <stdio.h>
#include <string.h>

int main() {
    char s1[101], s2[101];
    scanf("%s %s", s1, s2);
    int i = strlen(s1)-1, j = strlen(s2)-1, carry = 0, k = 0;
    char res[102];
    while (i >= 0 || j >= 0 || carry) {
        int sum = carry;
        if (i >= 0) sum += s1[i--] - '0';
        if (j >= 0) sum += s2[j--] - '0';
        res[k++] = (sum % 10) + '0';
        carry = sum / 10;
    }
    for (int t = k-1; t >= 0; t--) printf("%c", res[t]);
    return 0;
}`,
    testCases: [
      { input: '12345678901234567890\n98765432109876543210', expectedOutput: '111111111011111111100', isHidden: false },
      { input: '999\n1', expectedOutput: '1000', isHidden: false },
      { input: '0\n0', expectedOutput: '0', isHidden: true },
    ],
  },
  'linked-list': {
    title: 'Singly Linked List',
    difficulty: 'hard',
    description: 'Cài đặt danh sách liên kết đơn: chèn vào đầu, in danh sách, và tìm kiếm phần tử.',
    inputFormat: 'Dòng 1: Số nguyên n (số phần tử).\nDòng 2: n số nguyên.\nDòng 3: x (giá trị cần tìm).',
    constraints: '1 ≤ n ≤ 100\n1 ≤ giá trị ≤ 1000',
    sampleInput: '5\n10 20 30 40 50\n30',
    sampleOutput: '50 40 30 20 10\nFound',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node *insert_head(Node *head, int val) {
    // Chen vao dau danh sach
}

void print_list(Node *head) {
    // In danh sach
}

int search(Node *head, int x) {
    // Tim kiem phan tu
}

int main() {
    int n, x;
    scanf("%d", &n);
    Node *head = NULL;
    for (int i = 0; i < n; i++) {
        int val; scanf("%d", &val);
        head = insert_head(head, val);
    }
    scanf("%d", &x);
    print_list(head);
    printf("%s", search(head, x) ? "Found" : "Not Found");
    return 0;
}`,
    explanation: 'Mỗi Node chứa data và con trỏ next. insert_head: tạo node mới, trỏ next đến head cũ. search: duyệt từ đầu đến cuối, so sánh data.',
    solution: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

Node *insert_head(Node *head, int val) {
    Node *new_node = (Node*)malloc(sizeof(Node));
    new_node->data = val;
    new_node->next = head;
    return new_node;
}

void print_list(Node *head) {
    while (head) { printf("%d ", head->data); head = head->next; }
    printf("\\n");
}

int search(Node *head, int x) {
    while (head) { if (head->data == x) return 1; head = head->next; }
    return 0;
}

int main() {
    int n, x; scanf("%d", &n);
    Node *head = NULL;
    for (int i = 0; i < n; i++) { int v; scanf("%d", &v); head = insert_head(head, v); }
    scanf("%d", &x);
    print_list(head);
    printf("%s", search(head, x) ? "Found" : "Not Found");
    return 0;
}`,
    testCases: [
      { input: '5\n10 20 30 40 50\n30', expectedOutput: '50 40 30 20 10\nFound', isHidden: false },
      { input: '3\n1 2 3\n4', expectedOutput: '3 2 1\nNot Found', isHidden: false },
      { input: '1\n42\n42', expectedOutput: '42\nFound', isHidden: true },
    ],
  },
  'expression-evaluator': {
    title: 'Simple Expression Evaluator',
    difficulty: 'hard',
    description: 'Tính giá trị biểu thức số học chỉ gồm +, -, *, / và số nguyên. Biểu thức không có dấu ngoặc.',
    inputFormat: 'Một dòng chứa biểu thức (các số và toán tử cách nhau bởi dấu cách).',
    constraints: '1 ≤ độ dài ≤ 100',
    sampleInput: '10 + 20 * 3',
    sampleOutput: '70',
    starterCode: `#include <stdio.h>

int main() {
    char expr[100];
    fgets(expr, 100, stdin);

    // Tinh gia tri bieu thuc

    return 0;
}`,
    explanation: 'Dùng hai stack: số và toán tử. Duyệt biểu thức, đẩy số vào stack. Khi gặp toán tử, nếu độ ưu tiên cao hơn thì tính trước.',
    solution: `#include <stdio.h>

int main() {
    int nums[50], ni = 0, num, a, b;
    char op[50], oi = 0, c, prv = ' ';
    while ((c = getchar()) != '\\n') {
        if (c >= '0' && c <= '9') {
            ungetc(c, stdin);
            scanf("%d", &num);
            nums[ni++] = num;
        } else if (c == '+' || c == '-' || c == '*' || c == '/') {
            while (oi > 0 && ((op[oi-1] == '*' || op[oi-1] == '/') || ((c == '+' || c == '-') && (op[oi-1] == '+' || op[oi-1] == '-')))) {
                b = nums[--ni]; a = nums[--ni]; char o = op[--oi];
                switch (o) { case '+': nums[ni++] = a+b; break; case '-': nums[ni++] = a-b; break; case '*': nums[ni++] = a*b; break; case '/': nums[ni++] = a/b; break; }
            }
            op[oi++] = c;
        }
    }
    while (oi > 0) {
        b = nums[--ni]; a = nums[--ni]; char o = op[--oi];
        switch (o) { case '+': nums[ni++] = a+b; break; case '-': nums[ni++] = a-b; break; case '*': nums[ni++] = a*b; break; case '/': nums[ni++] = a/b; break; }
    }
    printf("%d", nums[0]);
    return 0;
}`,
    testCases: [
      { input: '10 + 20 * 3', expectedOutput: '70', isHidden: false },
      { input: '5 * 6 - 4', expectedOutput: '26', isHidden: false },
      { input: '100 / 10 + 5 * 2', expectedOutput: '20', isHidden: true },
    ],
  },
}

export default function ProblemPage() {
  const params = useParams()
  const id = params.id as string
  const [showEditorial, setShowEditorial] = useState(false)
  const [tab, setTab] = useState<'problem' | 'editor' | 'result'>('problem')
  const [panelTab, setPanelTab] = useState<'result' | 'history'>('result')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [subsLoading, setSubsLoading] = useState(false)
  const { data: session } = useSession()
  const { handleRun, handleTestCases, testResults, showTestPanel, isRunning } = useJudge()
  const { code } = useEditorStore()
  const reset = useEditorStore((s) => s.reset)

  const problem = problemData[id]

  const difficultyColors: Record<Difficulty, string> = {
    easy: 'text-[#a6e3a1] bg-[#a6e3a1]/10',
    medium: 'text-[#f9e2af] bg-[#f9e2af]/10',
    hard: 'text-[#f38ba8] bg-[#f38ba8]/10',
  }

  useEffect(() => {
    reset(problem?.starterCode ?? '')
  }, [id, reset])

  useEffect(() => {
    if (!id || !session?.user?.id) return
    setSubsLoading(true)
    fetch(`/api/submissions?problemId=${id}`)
      .then((r) => r.json())
      .then((data) => setSubmissions(Array.isArray(data) ? data : []))
      .catch(() => setSubmissions([]))
      .finally(() => setSubsLoading(false))
  }, [id, session])

  const handleSubmit = async () => {
    const results = await handleTestCases(problem.testCases)
    if (!session?.user?.id || results.length === 0) return

    const allPassed = results.every((r) => r.passed)
    const runtimeMs = Math.max(...results.map((r) => parseInt(r.time) || 0))
    const xpEarned = allPassed ? 30 : 0

    fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: id,
        code,
        status: allPassed ? 'AC' : 'WA',
        runtimeMs,
        memoryKb: 1024,
        xpEarned,
      }),
    })
      .then((r) => r.json())
      .then((sub) => {
        if (sub?.id) setSubmissions((prev) => [sub, ...prev])
      })
      .catch(() => {})
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
        <div className="p-3 border-b border-[#313244]">
          <Link
            href="/problems"
            className="inline-flex items-center gap-1 text-sm font-mono text-[#6c7086] hover:text-[#cdd6f4] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </Link>
        </div>
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
            onRun={handleRun}
            onSubmit={handleSubmit}
            onReset={() => reset(problem.starterCode)}
          />
        </div>
        <div className="h-1/2 min-h-[150px] border-t border-[#313244] flex flex-col">
          <div className="flex border-b border-[#313244]">
            <button
              onClick={() => setPanelTab('result')}
              className={`px-4 py-1.5 text-xs font-mono transition-colors ${
                panelTab === 'result'
                  ? 'text-[#a6e3a1] border-b-2 border-[#a6e3a1]'
                  : 'text-[#6c7086] hover:text-[#a6adc8]'
              }`}
            >
              Kết quả
            </button>
            <button
              onClick={() => setPanelTab('history')}
              className={`px-4 py-1.5 text-xs font-mono transition-colors ${
                panelTab === 'history'
                  ? 'text-[#a6e3a1] border-b-2 border-[#a6e3a1]'
                  : 'text-[#6c7086] hover:text-[#a6adc8]'
              }`}
            >
              Lịch sử
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            {panelTab === 'history' ? (
              <SubmissionHistory submissions={submissions} loading={subsLoading} />
            ) : showTestPanel && testResults.length > 0 ? (
              <TestCasePanel results={testResults} isRunning={isRunning} />
            ) : (
              <OutputPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
