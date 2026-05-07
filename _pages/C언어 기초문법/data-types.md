---
title: 자료형 (Data Types)
layout: post
category: C언어 기초 문법
weight: 2
---

## C언어의 자료형이란?

C언어는 변수를 선언할 때 **저장할 데이터의 종류(자료형)를 반드시 명시**해야 합니다. 자료형은 해당 변수가 메모리에 얼마나 많은 공간을 차지할지, 그리고 어떤 종류의 값을 저장할 수 있는지를 결정합니다.

## 1. 기본 자료형 (Primitive Types)

C언어가 기본으로 제공하는 자료형들입니다.

| 자료형 | 크기 (일반적) | 값의 범위 | 설명 |
| :----- | :------------ | :-------- | :--- |
| `char` | 1 byte | -128 ~ 127 | 문자 하나를 저장 |
| `int` | 4 bytes | -2,147,483,648 ~ 2,147,483,647 | 정수 저장 |
| `float` | 4 bytes | 약 ±3.4 × 10^38 | 단정밀도 실수 |
| `double` | 8 bytes | 약 ±1.7 × 10^308 | 배정밀도 실수 |

> **참고**: 자료형의 크기는 컴파일러와 운영체제(32비트/64비트)에 따라 달라질 수 있습니다. 정확한 크기가 필요하면 `sizeof()` 연산자를 사용하세요.

## 2. 정수형 (`int`)

`int`는 소수점 없는 정수를 저장하는 가장 기본적인 자료형입니다. `short`, `long`, `long long` 등의 수정자를 붙여 크기를 조절할 수 있습니다.

```c
#include <stdio.h>

int main() {
    int age = 25;
    short year = 2024;
    long population = 51000000L;
    long long big_number = 9876543210LL;

    printf("나이: %d\n", age);
    printf("연도: %d\n", year);
    printf("인구: %ld\n", population);
    printf("큰 수: %lld\n", big_number);

    return 0;
}
```

> `unsigned`를 앞에 붙이면 음수를 표현하지 않는 대신 양수 범위가 2배로 늘어납니다. (예: `unsigned int`는 0 ~ 4,294,967,295)

---

## 3. 실수형 (`float`, `double`)

소수점이 있는 수를 저장합니다. 정밀도가 더 높은 계산이 필요할 때는 `float` 보다 `double`을 사용하는 것이 일반적입니다.

```c
#include <stdio.h>

int main() {
    float pi_f = 3.14159f;   // float 리터럴은 끝에 'f'를 붙임
    double pi_d = 3.14159265358979;

    printf("float  pi: %.5f\n", pi_f);   // 3.14159
    printf("double pi: %.14f\n", pi_d);  // 3.14159265358979

    // 부동 소수점 오차 확인
    float a = 0.1f + 0.2f;
    printf("0.1 + 0.2 = %.10f\n", a); // 정확히 0.3이 아닐 수 있음

    return 0;
}
```

---

## 4. 문자형 (`char`)

문자 하나를 작은 따옴표(`''`)로 감싸서 저장합니다. 내부적으로는 해당 문자의 **ASCII 코드값(정수)**이 저장됩니다.

```c
#include <stdio.h>

int main() {
    char grade = 'A';
    char newline = '\n'; // 이스케이프 시퀀스

    printf("학점: %c\n", grade);
    printf("ASCII 코드값: %d\n", grade); // 'A'의 ASCII 값은 65

    // char는 정수처럼 연산 가능
    char next_grade = grade + 1;
    printf("다음 학점: %c\n", next_grade); // 'B'

    return 0;
}
```

---

## 5. `sizeof()` 연산자

`sizeof()` 연산자를 사용하면 특정 자료형이나 변수가 메모리에서 차지하는 바이트 수를 확인할 수 있습니다.

```c
#include <stdio.h>

int main() {
    printf("char   의 크기: %zu byte(s)\n", sizeof(char));
    printf("int    의 크기: %zu byte(s)\n", sizeof(int));
    printf("float  의 크기: %zu byte(s)\n", sizeof(float));
    printf("double 의 크기: %zu byte(s)\n", sizeof(double));

    int x = 100;
    printf("변수 x의 크기: %zu byte(s)\n", sizeof(x));

    return 0;
}
```

자료형을 정확히 이해하는 것은 C언어로 효율적이고 안전한 프로그램을 만드는 첫걸음입니다. 특히 각 자료형의 크기와 범위를 숙지하면 메모리 낭비나 오버플로우(overflow)와 같은 오류를 미리 방지할 수 있습니다.
