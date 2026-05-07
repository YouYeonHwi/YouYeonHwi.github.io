---
title: 함수 (Functions)
layout: post
category: C언어 기초 문법
weight: 8
---

## 1. 함수란?

함수(Function)는 **특정 작업을 수행하는 코드 블록에 이름을 붙인 것**입니다. 동일한 코드를 여러 번 작성하는 대신, 함수로 만들어 두고 필요할 때마다 **호출(call)**하여 사용할 수 있습니다.

함수를 사용하면:
- **코드의 재사용성**이 높아집니다.
- **가독성**이 향상됩니다.
- 각 기능을 독립적으로 **테스트하고 수정**하기 쉬워집니다.

## 2. 함수의 구조

```c
반환타입 함수명(매개변수목록) {
    // 함수 본문 (실행할 코드)
    return 반환값; // 반환타입이 void가 아닐 때
}
```

- **반환타입(Return Type)**: 함수가 결과로 돌려줄 값의 자료형. 반환 값이 없으면 `void`를 사용.
- **함수명**: 함수를 호출할 때 사용하는 이름.
- **매개변수(Parameter)**: 함수 호출 시 외부에서 전달받는 값. 없으면 `void` 또는 빈 괄호.

## 3. 함수 선언, 정의, 호출

C언어에서는 `main()` 함수 아래에 함수를 **정의**할 경우, `main()` 위에 **선언(프로토타입)**을 먼저 해야 합니다.

```c
#include <stdio.h>

// 함수 선언 (프로토타입): 반환타입, 함수명, 매개변수 타입만 명시
int add(int a, int b);

int main() {
    // 함수 호출
    int result = add(10, 20);
    printf("10 + 20 = %d\n", result); // 30
    return 0;
}

// 함수 정의: 실제 구현
int add(int a, int b) {
    return a + b;
}
```

---

## 4. 다양한 함수 형태

### 반환값과 매개변수가 없는 함수

```c
#include <stdio.h>

void print_separator() {
    printf("------------------------------\n");
}

int main() {
    print_separator();
    printf("Hello, World!\n");
    print_separator();
    return 0;
}
```

### 반환값이 있고 매개변수도 있는 함수

```c
#include <stdio.h>

double calculate_area(double radius) {
    const double PI = 3.14159265358979;
    return PI * radius * radius;
}

int main() {
    double r = 5.0;
    printf("반지름 %.1f인 원의 넓이: %.2f\n", r, calculate_area(r));
    return 0;
}
```

---

## 5. 값에 의한 전달 (Call by Value)

C언어의 함수는 기본적으로 변수의 **값을 복사하여** 전달합니다. 따라서 함수 내에서 매개변수를 변경해도 **원본 변수는 영향을 받지 않습니다.**

```c
#include <stdio.h>

void try_to_double(int x) {
    x = x * 2; // 복사된 값을 변경 (원본에 영향 없음)
    printf("함수 내부 x: %d\n", x);
}

int main() {
    int num = 10;
    try_to_double(num);
    printf("함수 호출 후 num: %d\n", num); // 여전히 10
    return 0;
}
```
> 함수가 원본 변수를 직접 수정하게 하려면 **포인터(Pointer)**를 사용해야 합니다.

---

## 6. 재귀 함수 (Recursive Function)

함수가 **자기 자신을 호출**하는 것을 재귀(Recursion)라고 합니다. 재귀는 반드시 **종료 조건(base case)**이 있어야 무한루프를 방지할 수 있습니다.

```c
#include <stdio.h>

// n의 팩토리얼(n!)을 재귀로 계산
int factorial(int n) {
    if (n <= 1) {
        return 1; // 종료 조건
    }
    return n * factorial(n - 1); // 자기 자신을 호출
}

int main() {
    printf("5! = %d\n", factorial(5)); // 120
    printf("10! = %d\n", factorial(10)); // 3628800
    return 0;
}
```

함수는 C언어 프로그래밍의 핵심 구성 요소입니다. 코드를 기능별로 함수로 분리하면 유지보수가 쉬워지고, 팀 프로젝트에서의 협업도 원활해집니다.
