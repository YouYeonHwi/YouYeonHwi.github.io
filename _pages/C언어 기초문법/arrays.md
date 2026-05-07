---
title: 배열 (Arrays)
layout: post
category: C언어 기초 문법
weight: 7
---

## 1. 배열이란?

배열(Array)은 **동일한 자료형의 데이터 여러 개를 하나의 이름으로 연속된 메모리 공간에 저장**하는 자료구조입니다. 많은 수의 데이터를 관리할 때 변수를 개별적으로 선언하는 번거로움을 줄여줍니다.

## 2. 1차원 배열

**선언 및 초기화:**
```c
자료형 배열명[원소개수];
자료형 배열명[원소개수] = {값1, 값2, ...};
자료형 배열명[] = {값1, 값2, ...}; // 크기 자동 결정
```

배열의 각 요소는 **인덱스(index)**를 사용하여 접근하며, 인덱스는 **0부터** 시작합니다.

```c
#include <stdio.h>

int main() {
    // 크기가 5인 정수 배열 선언 및 초기화
    int scores[5] = {90, 85, 78, 92, 88};

    // 인덱스로 개별 요소 접근 (0부터 시작)
    printf("첫 번째 점수: %d\n", scores[0]); // 90
    printf("세 번째 점수: %d\n", scores[2]); // 78

    // 배열 요소 변경
    scores[1] = 95;
    printf("수정된 두 번째 점수: %d\n", scores[1]); // 95

    // for 문으로 배열 전체 순회
    int sum = 0;
    for (int i = 0; i < 5; i++) {
        sum += scores[i];
    }
    printf("총합: %d, 평균: %.1f\n", sum, (double)sum / 5);

    return 0;
}
```

> **배열 범위 초과 주의**: `scores[5]`처럼 배열 범위를 벗어난 인덱스에 접근하는 것은 **정의되지 않은 동작(undefined behavior)**을 유발하며, 프로그램이 비정상 종료될 수 있습니다. C언어는 이를 자동으로 검사하지 않으므로 주의해야 합니다.

---

## 3. 배열의 크기 구하기

`sizeof()` 연산자를 활용하여 배열의 총 크기와 원소 개수를 계산할 수 있습니다.

```c
#include <stdio.h>

int main() {
    int arr[] = {10, 20, 30, 40, 50};

    int total_size = sizeof(arr);                   // 배열 전체 바이트 크기: 20
    int element_size = sizeof(arr[0]);              // 원소 하나의 크기: 4
    int count = sizeof(arr) / sizeof(arr[0]);       // 원소 개수: 5

    printf("배열 전체 크기: %d bytes\n", total_size);
    printf("원소 개수: %d\n", count);

    return 0;
}
```

---

## 4. 2차원 배열

2차원 배열은 **행(row)과 열(column)**로 구성된 표 형태의 데이터를 표현할 때 사용합니다.

```c
#include <stdio.h>

int main() {
    // 3행 4열의 2차원 배열
    int matrix[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };

    // 특정 요소 접근: [행_인덱스][열_인덱스]
    printf("matrix[1][2] = %d\n", matrix[1][2]); // 7

    // 중첩 for 문으로 2차원 배열 전체 출력
    printf("\n행렬 출력:\n");
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%3d ", matrix[i][j]);
        }
        printf("\n");
    }

    return 0;
}
```

---

## 5. 배열과 문자열

C언어에서 문자열은 `char` 배열로 표현합니다. 문자열의 끝에는 반드시 **널 종료 문자(`'\0'`)**가 위치하여 문자열의 끝을 나타냅니다.

```c
#include <stdio.h>
#include <string.h>

int main() {
    // 문자 배열로 문자열 선언 (널 문자를 위해 크기 +1)
    char name[10] = "Alice";

    printf("이름: %s\n", name);
    printf("문자열 길이: %lu\n", strlen(name)); // 5 ('\0' 제외)
    printf("배열 크기: %lu\n", sizeof(name));    // 10

    // 각 문자에 개별 접근
    printf("첫 글자: %c\n", name[0]); // 'A'

    return 0;
}
```

배열은 C언어에서 데이터를 효율적으로 관리하는 기본 자료구조입니다. 특히 반복문과 함께 사용할 때 강력한 위력을 발휘하며, 이후 배울 포인터(Pointer)와 밀접한 연관이 있습니다.
