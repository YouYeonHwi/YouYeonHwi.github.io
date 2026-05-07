---
title: 포인터 (Pointers)
layout: post
category: C언어 기초 문법
weight: 9
---

## 1. 포인터란?

포인터(Pointer)는 **다른 변수의 메모리 주소를 저장하는 변수**입니다. C언어의 가장 강력하면서도 어려운 개념 중 하나로, 포인터를 제대로 이해하면 메모리를 직접 제어하는 고급 프로그래밍이 가능해집니다.

## 2. 주소 연산자(`&`)와 역참조 연산자(`*`)

- **`&` (address-of 연산자)**: 변수의 메모리 **주소**를 반환합니다.
- **`*` (dereference 연산자)**: 포인터가 가리키는 주소의 **값**에 접근합니다.

```c
#include <stdio.h>

int main() {
    int num = 10;
    int *p; // int형 포인터 변수 p 선언

    p = &num; // p에 num의 주소를 저장

    printf("num의 값: %d\n", num);          // 10
    printf("num의 주소(&num): %p\n", &num); // 주소값 (예: 0x...ff)
    printf("p에 저장된 주소: %p\n", p);     // &num과 동일한 값
    printf("*p (역참조): %d\n", *p);        // 10 (p가 가리키는 값)

    // *p를 통해 num의 값을 간접적으로 변경
    *p = 99;
    printf("*p = 99 대입 후, num의 값: %d\n", num); // 99

    return 0;
}
```

---

## 3. 포인터와 함수 (Call by Reference)

값에 의한 전달(Call by Value)에서는 함수가 원본을 수정할 수 없었습니다. 포인터를 사용하면 함수에 변수의 **주소(참조)**를 전달하여 원본 변수를 직접 수정할 수 있습니다.

```c
#include <stdio.h>

// 두 변수의 값을 서로 바꾸는 함수 (포인터 사용)
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;
    printf("교환 전: x=%d, y=%d\n", x, y); // x=10, y=20

    swap(&x, &y); // x와 y의 주소를 전달

    printf("교환 후: x=%d, y=%d\n", x, y); // x=20, y=10
    return 0;
}
```

---

## 4. 포인터와 배열

배열 이름 자체가 배열의 **첫 번째 원소의 주소**입니다. 따라서 포인터와 배열은 매우 밀접한 관계를 가집니다.

```c
#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    int *p = arr; // arr은 &arr[0]과 동일

    printf("arr[0]과 *p: %d, %d\n", arr[0], *p);       // 10, 10

    // 포인터 산술 (포인터에 정수를 더하면 다음 원소를 가리킴)
    printf("arr[1]과 *(p+1): %d, %d\n", arr[1], *(p+1)); // 20, 20
    printf("arr[2]와 *(p+2): %d, %d\n", arr[2], *(p+2)); // 30, 30

    // 포인터 증가로 배열 순회
    printf("\n포인터로 배열 순회: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", *(p + i));
    }
    printf("\n");

    return 0;
}
```

---

## 5. `NULL` 포인터

포인터를 선언했지만 아직 어떤 변수도 가리키지 않는 경우, `NULL`로 초기화하는 것이 좋은 습관입니다. `NULL` 포인터를 역참조하면 프로그램이 비정상 종료되므로, 사용 전에 반드시 검사해야 합니다.

```c
#include <stdio.h>

int main() {
    int *p = NULL; // 아무것도 가리키지 않는 포인터

    if (p == NULL) {
        printf("포인터가 NULL입니다. 역참조를 수행하지 않습니다.\n");
    }

    // 아래 코드는 비정상 종료(Segmentation Fault)를 일으킵니다!
    // printf("%d", *p);

    return 0;
}
```

포인터는 C언어의 정수이자, 다른 고급 언어에 없는 강력한 기능입니다. 동적 메모리 할당(`malloc`)이나 자료구조(연결 리스트 등)를 구현할 때도 필수적으로 사용됩니다. 포인터 개념을 확실히 익혀두면 C언어 실력이 한 단계 도약하게 됩니다.
