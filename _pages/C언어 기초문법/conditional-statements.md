---
title: 조건문 (Conditional Statements)
layout: post
category: C언어 기초 문법
weight: 5
---

## 1. 조건문이란?

조건문은 주어진 조건의 참(참이면 1, 거짓이면 0)에 따라 **실행할 코드 블록을 선택**하는 구문입니다. C언어의 조건문에는 `if`, `if-else`, `if-else if-else`, `switch` 문이 있습니다.

## 2. `if` 문: 가장 기본적인 조건문

`if` 문은 조건식이 참(0이 아닌 값)일 때만 내부 코드를 실행합니다.

**기본 구조:**
```c
if (조건식) {
    // 조건식이 참(비-0)일 때 실행할 코드
}
```

**예제:**
```c
#include <stdio.h>

int main() {
    int score = 90;

    if (score >= 60) {
        printf("합격입니다!\n");
    }

    printf("프로그램 종료\n");
    return 0;
}
```
> `score`가 60 이상이므로 `if` 블록 내부가 실행되어 "합격입니다!"가 출력됩니다.

---

## 3. `if-else` 문: 두 가지 경우 처리하기

조건이 참일 때와 거짓일 때 각각 다른 코드를 실행합니다.

**예제:**
```c
#include <stdio.h>

int main() {
    int temperature = 25;

    if (temperature > 30) {
        printf("매우 덥습니다. 에어컨을 켜세요.\n");
    } else {
        printf("적당한 날씨입니다.\n"); // 이 코드가 실행됨
    }

    return 0;
}
```

---

## 4. `if-else if-else` 문: 여러 조건 처리하기

세 개 이상의 조건을 순차적으로 검사할 때 사용합니다.

**예제:**
```c
#include <stdio.h>

int main() {
    int score = 85;
    char grade;

    if (score >= 90) {
        grade = 'A';
    } else if (score >= 80) {
        grade = 'B'; // score가 85이므로 이 블록이 실행됨
    } else if (score >= 70) {
        grade = 'C';
    } else {
        grade = 'F';
    }

    printf("점수: %d, 학점: %c\n", score, grade);
    return 0;
}
```

> **중요**: 조건은 위에서부터 순서대로 검사하며, 하나의 조건이 참이 되어 해당 블록이 실행되면 나머지 `else if`와 `else`는 검사하지 않고 건너뜁니다.

---

## 5. `switch` 문: 값에 따른 다분기 처리

특정 변수의 **값(정수 또는 문자)**에 따라 여러 경우 중 하나를 실행할 때 `switch` 문이 편리합니다.

**기본 구조:**
```c
switch (변수 또는 표현식) {
    case 값1:
        // 값1에 해당하는 코드
        break; // switch 문 탈출 (필수!)
    case 값2:
        // 값2에 해당하는 코드
        break;
    default:
        // 해당하는 case가 없을 때 실행
        break;
}
```

**예제:**
```c
#include <stdio.h>

int main() {
    int day = 3; // 1=월, 2=화, 3=수, ...

    switch (day) {
        case 1:
            printf("월요일\n");
            break;
        case 2:
            printf("화요일\n");
            break;
        case 3:
            printf("수요일\n"); // 이 코드가 실행됨
            break;
        case 4:
            printf("목요일\n");
            break;
        case 5:
            printf("금요일\n");
            break;
        default:
            printf("주말\n");
            break;
    }
    return 0;
}
```

> **`break`의 중요성**: `case` 블록 끝에 `break`를 빠뜨리면, 해당 `case`가 실행된 후 멈추지 않고 다음 `case`의 코드까지 연속으로 실행되는 **fall-through** 현상이 발생합니다. 의도한 게 아니라면 반드시 `break`를 붙여야 합니다.

---

## 6. 삼항 연산자 (Ternary Operator)

간단한 `if-else` 구문을 한 줄로 표현할 수 있습니다.

**기본 구조:** `조건식 ? 참일_때의_값 : 거짓일_때의_값`

```c
#include <stdio.h>

int main() {
    int a = 10, b = 20;

    // a와 b 중 더 큰 값을 max에 저장
    int max = (a > b) ? a : b;
    printf("더 큰 값: %d\n", max); // 20

    // 짝수 / 홀수 판별
    int num = 7;
    printf("%d은(는) %s입니다.\n", num, (num % 2 == 0) ? "짝수" : "홀수");

    return 0;
}
```

조건문은 프로그램의 논리적인 흐름을 제어하는 가장 핵심적인 도구입니다. 상황에 맞게 `if-else`와 `switch`를 적절히 선택하여 사용하면 더 명확하고 효율적인 코드를 작성할 수 있습니다.
