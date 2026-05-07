---
title: 연산자 (Operators)
layout: post
category: C언어 기초 문법
weight: 4
---

## C언어의 연산자란?

연산자(Operator)는 데이터(피연산자)를 연산하여 결과를 만들어내는 기호입니다. C언어는 매우 다양하고 강력한 연산자들을 제공합니다.

## 1. 산술 연산자 (Arithmetic Operators)

일반적인 수학 계산에 사용하는 연산자입니다.

| 연산자 | 의미 | 예제 (`a=10, b=3`) | 결과 |
| :----- | :--- | :----------------- | :--- |
| `+` | 덧셈 | `a + b` | `13` |
| `-` | 뺄셈 | `a - b` | `7` |
| `*` | 곱셈 | `a * b` | `30` |
| `/` | 나눗셈 | `a / b` | `3` (정수 나눗셈) |
| `%` | 나머지 | `a % b` | `1` |

```c
#include <stdio.h>

int main() {
    int a = 10, b = 3;

    printf("a + b = %d\n", a + b); // 13
    printf("a - b = %d\n", a - b); // 7
    printf("a * b = %d\n", a * b); // 30
    printf("a / b = %d\n", a / b); // 3 (소수점 버림)
    printf("a %% b = %d\n", a % b); // 1

    // 실수 나눗셈을 원하면 캐스팅 필요
    printf("실수 나눗셈: %.2f\n", (double)a / b); // 3.33

    return 0;
}
```

> **정수 나눗셈 주의**: `int / int`는 결과도 `int`가 됩니다. `10 / 3`의 결과는 `3`이며, 소수점 이하는 버려집니다.

---

## 2. 대입 연산자 (Assignment Operators)

변수에 값을 저장할 때 사용합니다. 왼쪽 피연산자에 오른쪽의 값을 대입합니다.

```c
#include <stdio.h>

int main() {
    int x = 10;

    x += 5;  // x = x + 5  -> 15
    printf("x += 5 : %d\n", x);

    x -= 3;  // x = x - 3  -> 12
    printf("x -= 3 : %d\n", x);

    x *= 2;  // x = x * 2  -> 24
    printf("x *= 2 : %d\n", x);

    x /= 4;  // x = x / 4  -> 6
    printf("x /= 4 : %d\n", x);

    x %= 4;  // x = x % 4  -> 2
    printf("x %%= 4 : %d\n", x);

    return 0;
}
```

---

## 3. 비교 연산자 (Relational Operators)

두 값을 비교하여 참(1) 또는 거짓(0)을 반환합니다.

```c
#include <stdio.h>

int main() {
    int a = 10, b = 20;

    printf("a == b : %d\n", a == b); // 0 (거짓)
    printf("a != b : %d\n", a != b); // 1 (참)
    printf("a > b  : %d\n", a > b);  // 0 (거짓)
    printf("a < b  : %d\n", a < b);  // 1 (참)
    printf("a >= b : %d\n", a >= b); // 0 (거짓)
    printf("a <= b : %d\n", a <= b); // 1 (참)

    return 0;
}
```

---

## 4. 논리 연산자 (Logical Operators)

여러 조건을 결합할 때 사용합니다.

| 연산자 | 의미 | 설명 |
| :----- | :--- | :--- |
| `&&` | 논리 AND | 두 조건이 **모두** 참일 때만 참 |
| `\|\|` | 논리 OR | 두 조건 중 **하나라도** 참이면 참 |
| `!` | 논리 NOT | 참↔거짓을 반전 |

```c
#include <stdio.h>

int main() {
    int age = 20;
    int has_id = 1; // 1 = 참(True)

    // && (AND): 나이가 19 이상이고 신분증이 있으면 입장 가능
    if (age >= 19 && has_id) {
        printf("입장 가능합니다.\n");
    }

    int is_holiday = 0; // 0 = 거짓(False)
    int is_weekend  = 1;

    // || (OR): 공휴일이거나 주말이면 쉬는 날
    if (is_holiday || is_weekend) {
        printf("오늘은 쉬는 날입니다.\n");
    }

    // ! (NOT)
    int is_raining = 0;
    if (!is_raining) {
        printf("비가 오지 않습니다.\n");
    }

    return 0;
}
```

---

## 5. 증감 연산자 (Increment/Decrement Operators)

변수의 값을 1씩 늘리거나 줄이는 연산자로, 반복문에서 매우 자주 사용됩니다.

```c
#include <stdio.h>

int main() {
    int a = 5;

    // 전위(prefix): 먼저 증가시키고 값을 사용
    printf("++a : %d\n", ++a); // 6
    // 후위(postfix): 값을 먼저 사용하고 증가
    printf("a++ : %d\n", a++); // 6 (출력 후 a는 7이 됨)
    printf("현재 a: %d\n", a); // 7

    int b = 5;
    printf("--b : %d\n", --b); // 4
    printf("b-- : %d\n", b--); // 4 (출력 후 b는 3이 됨)
    printf("현재 b: %d\n", b); // 3

    return 0;
}
```

연산자는 C언어의 핵심 도구입니다. 특히 대입 연산자와 증감 연산자는 다른 언어와 미묘하게 다르게 동작할 수 있으므로, 전위/후위 연산의 차이를 정확히 이해해두는 것이 중요합니다.
