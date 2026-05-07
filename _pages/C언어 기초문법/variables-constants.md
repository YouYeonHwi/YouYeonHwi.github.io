---
title: 변수와 상수 (Variables & Constants)
layout: post
category: C언어 기초 문법
weight: 3
---

## 변수와 상수란?

**변수(Variable)**는 프로그램 실행 중에 값이 변할 수 있는 저장 공간입니다. 반면 **상수(Constant)**는 한 번 값이 정해지면 프로그램이 끝날 때까지 그 값이 변하지 않는 저장 공간입니다.

C언어에서는 변수를 사용하기 전에 반드시 **자료형과 함께 선언(declaration)**을 먼저 해야 합니다.

## 1. 변수 선언과 초기화

```
자료형 변수명;          // 선언
자료형 변수명 = 초기값; // 선언과 동시에 초기화
```

```c
#include <stdio.h>

int main() {
    // 선언만 하기 (초기화되지 않은 변수는 쓰레기 값을 가질 수 있음!)
    int count;

    // 선언과 동시에 초기화
    int age = 20;
    double height = 175.5;
    char initial = 'Y';

    // 이미 선언된 변수에 값 대입
    count = 10;

    printf("나이: %d\n", age);
    printf("키: %.1f cm\n", height);
    printf("이니셜: %c\n", initial);
    printf("카운트: %d\n", count);

    return 0;
}
```

> **주의**: 초기화하지 않은 변수에는 예측할 수 없는 "쓰레기 값(garbage value)"이 들어 있을 수 있습니다. 항상 사용하기 전에 값을 초기화하는 습관을 들이세요.

---

## 2. 변수 명명 규칙

변수 이름을 지을 때는 다음 규칙을 따라야 합니다.

- 영문자(`a-z`, `A-Z`), 숫자(`0-9`), 밑줄(`_`)만 사용 가능
- **첫 글자는 반드시 영문자 또는 밑줄**로 시작 (숫자로 시작 불가)
- C언어의 예약어(키워드)는 사용 불가 (예: `int`, `if`, `for` 등)
- 대소문자를 구분함 (`count`와 `Count`는 다른 변수)

```c
// 올바른 변수명
int user_age = 25;
double _speed = 100.5;
char firstName = 'A';

// 잘못된 변수명 (컴파일 오류 발생)
// int 1st_place;  // 숫자로 시작
// int my-score;   // 하이픈 사용 불가
// int int;        // 예약어 사용 불가
```

---

## 3. 상수 (`const`, `#define`)

### `const` 키워드

변수 선언 앞에 `const`를 붙이면 상수가 됩니다. 이후 값을 변경하려 하면 컴파일 오류가 발생합니다.

```c
#include <stdio.h>

int main() {
    const double PI = 3.14159265358979;
    const int MAX_SIZE = 100;

    double radius = 5.0;
    double area = PI * radius * radius;

    printf("원의 넓이: %.2f\n", area);

    // 아래 코드는 컴파일 오류 발생! (const 상수 값 변경 불가)
    // PI = 3.14;

    return 0;
}
```

### `#define` 전처리기 지시자

`#define`은 컴파일 이전에 특정 단어를 지정한 값으로 **텍스트 치환**하는 방식입니다. `const`와 달리 자료형이 없으며, 세미콜론(`;`)을 붙이지 않습니다.

```c
#include <stdio.h>

#define PI 3.14159
#define MAX_SCORE 100
#define APP_NAME "My C Program"

int main() {
    printf("앱 이름: %s\n", APP_NAME);
    printf("원주율: %f\n", PI);
    printf("최대 점수: %d\n", MAX_SCORE);

    return 0;
}
```

| 비교 항목 | `const` | `#define` |
| :--- | :--- | :--- |
| 자료형 | 있음 | 없음 |
| 디버깅 | 용이 | 불편 (타입 정보 없음) |
| 범위(Scope) | 블록 스코프를 따름 | 전역적으로 적용 |
| 권장 여부 | **현대 C/C++에서 권장** | 레거시 코드에서 주로 사용 |

변수와 상수를 올바르게 사용하면 프로그램의 의도를 명확히 하고, 실수로 인한 버그를 미리 방지할 수 있습니다. 특히 변경되어서는 안 되는 값에는 `const`를 적극적으로 활용하는 것이 좋습니다.
