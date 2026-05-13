export interface ChallengeData {
  id: string
  title: string
  descriptionMd: string
  starterCode: string
  testCases: { input: string; expectedOutput: string; isHidden: boolean }[]
}

export const challengeData = new Map<string, ChallengeData>()

challengeData.set('nhap-mon-challenge', {
  id: 'nhap-mon-challenge',
  title: 'Chương trình chào hỏi',
  descriptionMd: `## Yêu cầu

Viết chương trình nhập vào **tên** và **tuổi** của người dùng, sau đó in ra lời chào.

### Input
- Dòng 1: Họ tên (có thể có khoảng trắng)
- Dòng 2: Tuổi (số nguyên)

### Output
In ra theo mẫu:
\`Xin chao, <ten>! Ban <tuoi> tuoi.\`

### Ví dụ

Input:
\`\`\`
Nguyen Van A
19
\`\`\`

Output:
\`\`\`
Xin chao, Nguyen Van A! Ban 19 tuoi.
\`\`\`

> **Gợi ý:** Dùng \`printf\` và \`scanf\` với \`%[^\\n]\` để đọc chuỗi có khoảng trắng.`,
  starterCode: '',
  testCases: [
    {
      input: 'Nguyen Van A\n19\n',
      expectedOutput: 'Xin chao, Nguyen Van A! Ban 19 tuoi.\n',
      isHidden: false,
    },
    {
      input: 'Le Thi B\n14\n',
      expectedOutput: 'Xin chao, Le Thi B! Ban 14 tuoi.\n',
      isHidden: false,
    },
    {
      input: 'Tran Van C\n36\n',
      expectedOutput: 'Xin chao, Tran Van C! Ban 36 tuoi.\n',
      isHidden: true,
    },
  ],
})

challengeData.set('bien-kieu-dulieu-challenge', {
  id: 'bien-kieu-dulieu-challenge',
  title: 'Bộ chuyển đổi nhiệt độ',
  descriptionMd: `## Yêu cầu

Viết chương trình chuyển đổi nhiệt độ giữa độ C và độ F.

### Công thức
- °C → °F: \\( F = C \\times \\frac{9}{5} + 32 \\)
- °F → °C: \\( C = (F - 32) \\times \\frac{5}{9} \\)

### Input
- Dòng 1: Ký tự \`C\` hoặc \`F\` (loại nhiệt độ nhập vào)
- Dòng 2: Giá trị nhiệt độ (số thực)

### Output
- Nếu input là \`C\`: in ra \`<gia_tri>°C = <ket_qua>°F\`
- Nếu input là \`F\`: in ra \`<gia_tri>°F = <ket_qua>°C\`
- Kết quả làm tròn **2 chữ số thập phân**

### Ví dụ

Input:
\`\`\`
C
100
\`\`\`

Output:
\`\`\`
100.00°C = 212.00°F
\`\`\`

> **Gợi ý:** Dùng \`%.2f\` để in số thực với 2 chữ số thập phân. Chú ý kiểu dữ liệu \`float\` hoặc \`double\`.`,
  starterCode: '',
  testCases: [
    {
      input: 'C\n100\n',
      expectedOutput: '100.00°C = 212.00°F\n',
      isHidden: false,
    },
    {
      input: 'F\n212\n',
      expectedOutput: '212.00°F = 100.00°C\n',
      isHidden: false,
    },
    {
      input: 'C\n0\n',
      expectedOutput: '0.00°C = 32.00°F\n',
      isHidden: false,
    },
    {
      input: 'F\n32\n',
      expectedOutput: '32.00°F = 0.00°C\n',
      isHidden: true,
    },
  ],
})

challengeData.set('toan-tu-challenge', {
  id: 'toan-tu-challenge',
  title: 'Máy tính cơ bản',
  descriptionMd: `## Yêu cầu

Viết chương trình máy tính thực hiện 4 phép toán cơ bản: Cộng, Trừ, Nhân, Chia.

### Input
- Dòng 1: Số thứ nhất (số thực)
- Dòng 2: Số thứ hai (số thực)
- Dòng 3: Ký tự phép toán (\`+\`, \`-\`, \`*\`, \`/\`)

### Output
- In kết quả: \`<so1> <phep_toan> <so2> = <ket_qua>\`
- Kết quả làm tròn **2 chữ số thập phân**
- Nếu chia cho 0, in \`Loi: chia cho 0\`

### Ví dụ

Input:
\`\`\`
10
3
/
\`\`\`

Output:
\`\`\`
10.00 / 3.00 = 3.33
\`\`\`

> **Gợi ý:** Dùng \`switch-case\` để xử lý từng phép toán. Chú ý kiểm tra chia cho 0.`,
  starterCode: '',
  testCases: [
    {
      input: '10\n3\n/\n',
      expectedOutput: '10.00 / 3.00 = 3.33\n',
      isHidden: false,
    },
    {
      input: '5\n3\n+\n',
      expectedOutput: '5.00 + 3.00 = 8.00\n',
      isHidden: false,
    },
    {
      input: '7\n2\n*\n',
      expectedOutput: '7.00 * 2.00 = 14.00\n',
      isHidden: false,
    },
    {
      input: '10\n0\n/\n',
      expectedOutput: 'Loi: chia cho 0\n',
      isHidden: false,
    },
    {
      input: '15\n4\n-\n',
      expectedOutput: '15.00 - 4.00 = 11.00\n',
      isHidden: true,
    },
  ],
})

challengeData.set('dieu-kien-challenge', {
  id: 'dieu-kien-challenge',
  title: 'Giải phương trình bậc 2',
  descriptionMd: `## Yêu cầu

Viết chương trình giải phương trình bậc 2: \\(ax^2 + bx + c = 0\\)

### Input
Một dòng gồm 3 số thực \`a b c\`

### Output
- Nếu \`a = 0\` và \`b = 0\` và \`c = 0\`: in \`Vo so nghiem\`
- Nếu \`a = 0\` và \`b = 0\` và \`c != 0\`: in \`Vo nghiem\`
- Nếu \`a = 0\`: nghiệm duy nhất \`x = <ket_qua>\` (làm tròn 2 số)
- Nếu \`delta > 0\`: \`x1 = <x1>, x2 = <x2>\`
- Nếu \`delta = 0\`: \`x = <x>\`
- Nếu \`delta < 0\`: \`Vo nghiem\`
- Tất cả kết quả làm tròn **2 chữ số thập phân**

### Ví dụ

Input:
\`\`\`
1 -3 2
\`\`\`

Output:
\`\`\`
x1 = 2.00, x2 = 1.00
\`\`\`

> **Gợi ý:** \`delta = b*b - 4*a*c\`. Dùng \`sqrt()\` từ \`<math.h>\`. Nhớ thêm \`-lm\` khi compile.

> **Chú ý:** Nhớ \`#include <math.h>\` để dùng \`sqrt()\`. Khi compile cần flag \`-lm\`.`,
  starterCode: '',
  testCases: [
    {
      input: '1 -3 2\n',
      expectedOutput: 'x1 = 2.00, x2 = 1.00\n',
      isHidden: false,
    },
    {
      input: '1 -2 1\n',
      expectedOutput: 'x = 1.00\n',
      isHidden: false,
    },
    {
      input: '0 2 4\n',
      expectedOutput: 'x = -2.00\n',
      isHidden: false,
    },
    {
      input: '0 0 5\n',
      expectedOutput: 'Vo nghiem\n',
      isHidden: false,
    },
    {
      input: '1 0 1\n',
      expectedOutput: 'Vo nghiem\n',
      isHidden: true,
    },
    {
      input: '0 0 0\n',
      expectedOutput: 'Vo so nghiem\n',
      isHidden: true,
    },
  ],
})

challengeData.set('vong-lap-challenge', {
  id: 'vong-lap-challenge',
  title: 'Tam giác số',
  descriptionMd: `## Yêu cầu

Viết chương trình in ra tam giác số từ 1 đến N.

### Input
Một số nguyên dương \`n\` (1 ≤ n ≤ 9)

### Output
In ra tam giác số có dạng:
\`\`\`
1
2 3
4 5 6
7 8 9 10
...
\`\`\`
Các số cách nhau bởi 1 khoảng trắng, mỗi dòng xuống dòng.

### Ví dụ

Input:
\`\`\`
4
\`\`\`

Output:
\`\`\`
1
2 3
4 5 6
7 8 9 10
\`\`\`

> **Gợi ý:** Dùng vòng lặp lồng nhau. Biến đếm tăng dần từ 1.`,
  starterCode: '',
  testCases: [
    {
      input: '4\n',
      expectedOutput: '1\n2 3\n4 5 6\n7 8 9 10\n',
      isHidden: false,
    },
    {
      input: '3\n',
      expectedOutput: '1\n2 3\n4 5 6\n',
      isHidden: false,
    },
    {
      input: '1\n',
      expectedOutput: '1\n',
      isHidden: false,
    },
    {
      input: '5\n',
      expectedOutput: '1\n2 3\n4 5 6\n7 8 9 10\n11 12 13 14 15\n',
      isHidden: true,
    },
  ],
})
