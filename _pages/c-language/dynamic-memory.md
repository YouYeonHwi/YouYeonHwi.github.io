---
title: 동적 메모리 할당 (Dynamic Memory)
layout: post
category: C언어 기초 문법
weight: 12
---

## 1. 동적 메모리 할당이란?

C언어에서 일반 변수와 배열은 **컴파일 시점에 크기가 결정**되는 정적 메모리를 사용합니다. 반면 **동적 메모리 할당**은 프로그램 실행 중에 필요한 만큼 메모리를 **힙(Heap) 영역에 직접 요청**하는 방법입니다.

이를 통해 입력 크기를 미리 알 수 없는 상황에서도 유연하게 메모리를 사용할 수 있습니다.

## 2. `malloc()`: 메모리 할당

`<stdlib.h>`에 선언된 `malloc(n)` 함수는 **n 바이트**의 메모리를 힙에 할당하고, 해당 공간의 **시작 주소(`void *`)**를 반환합니다. 할당 실패 시 `NULL`을 반환합니다.

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;

    // int 5개를 저장할 공간 동적 할당
    int *arr = (int *)malloc(sizeof(int) * n);

    // 할당 실패 검사 (필수!)
    if (arr == NULL) {
        printf("메모리 할당 실패!\n");
        return 1;
    }

    // 배열처럼 사용
    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 10;
    }

    printf("동적 배열: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]); // 10 20 30 40 50
    }
    printf("\n");

    // 반드시 메모리 해제 (free 필수!)
    free(arr);
    arr = NULL; // 해제 후 NULL로 초기화 (dangling pointer 방지)

    return 0;
}
```

---

## 3. `calloc()`: 초기화된 메모리 할당

`calloc(n, size)` 함수는 `n`개의 요소를 `size` 크기로 할당하고, 모든 바이트를 **0으로 초기화**합니다.

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = (int *)calloc(n, sizeof(int)); // 0으로 초기화된 배열

    if (arr == NULL) { return 1; }

    printf("calloc 초기값: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]); // 0 0 0 0 0
    }
    printf("\n");

    free(arr);
    return 0;
}
```

---

## 4. `realloc()`: 메모리 재할당

이미 할당된 메모리의 크기를 **늘리거나 줄일** 때 사용합니다.

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = (int *)malloc(sizeof(int) * 3);
    arr[0] = 1; arr[1] = 2; arr[2] = 3;

    // 크기를 5개로 늘림
    int *new_arr = (int *)realloc(arr, sizeof(int) * 5);
    if (new_arr == NULL) { free(arr); return 1; }
    arr = new_arr;

    arr[3] = 4; arr[4] = 5;

    printf("재할당 후 배열: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", arr[i]); // 1 2 3 4 5
    }
    printf("\n");

    free(arr);
    return 0;
}
```

---

## 5. 메모리 관리 주의사항

동적 메모리를 안전하게 사용하려면 아래 규칙을 꼭 지켜야 합니다.

| 문제 | 설명 |
| :--- | :--- |
| **메모리 누수 (Memory Leak)** | `free()`를 호출하지 않아 할당된 메모리가 반환되지 않음 |
| **Dangling Pointer** | `free()` 후에도 포인터를 계속 사용하는 것. `free()` 후 `NULL`로 초기화 |
| **이중 해제 (Double Free)** | 이미 해제된 메모리를 다시 `free()` 하는 것. 심각한 오류 유발 |
| **할당 실패 무시** | `malloc()` 반환값이 `NULL`인지 검사하지 않는 것 |

동적 메모리 할당은 강력한 기능이지만, 개발자가 직접 메모리를 관리해야 하므로 신중하게 사용해야 합니다. `malloc()`과 `free()`는 항상 쌍으로 사용하는 것을 원칙으로 삼으세요.
