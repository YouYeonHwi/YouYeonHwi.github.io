---
title: 문자열 (Strings)
layout: post
category: C언어 기초 문법
weight: 10
---

## 1. C언어의 문자열이란?

C언어에는 파이썬처럼 별도의 `string` 자료형이 없습니다. 대신 **`char` 배열**을 사용하여 문자열을 표현합니다. 문자열의 끝에는 반드시 **널 종료 문자(`'\0'`, null terminator)**가 있어 문자열의 끝을 나타냅니다.

```c
char name[] = "Hello"; // {'H', 'e', 'l', 'l', 'o', '\0'} 와 동일
```

## 2. 문자열 선언 및 초기화

```c
#include <stdio.h>
#include <string.h>

int main() {
    // 방법 1: 문자열 리터럴로 초기화 (권장)
    char str1[] = "Hello, C!";

    // 방법 2: 크기를 직접 지정 (널 문자 포함 크기 = 글자 수 + 1)
    char str2[20] = "World";

    // 방법 3: 문자 하나씩 직접 초기화 (널 문자 직접 추가)
    char str3[] = {'C', 'o', 'd', 'e', '\0'};

    printf("str1: %s\n", str1); // Hello, C!
    printf("str2: %s\n", str2); // World
    printf("str3: %s\n", str3); // Code

    printf("str1의 길이: %lu\n", strlen(str1)); // 9 ('\0' 제외)
    printf("str1의 배열 크기: %lu\n", sizeof(str1)); // 10 ('\0' 포함)

    return 0;
}
```

> `scanf`로 문자열을 입력받을 때 기본적으로 공백을 기준으로 입력이 끊깁니다. 공백 포함 문자열을 입력받으려면 `fgets()`를 사용하세요.

---

## 3. `string.h` 주요 함수

`<string.h>` 헤더를 `#include`하면 문자열을 다루는 다양한 표준 라이브러리 함수를 사용할 수 있습니다.

### `strlen()`: 문자열 길이

```c
#include <stdio.h>
#include <string.h>

int main() {
    char str[] = "Hello";
    printf("길이: %lu\n", strlen(str)); // 5
    return 0;
}
```

### `strcpy()`: 문자열 복사

```c
char dest[20];
char src[] = "Hello";
strcpy(dest, src); // src의 내용을 dest에 복사
printf("%s\n", dest); // Hello
```

### `strcat()`: 문자열 연결

```c
char greet[30] = "Hello, ";
char name[] = "World!";
strcat(greet, name); // greet 끝에 name을 이어붙임
printf("%s\n", greet); // Hello, World!
```

### `strcmp()`: 문자열 비교

두 문자열을 **사전순으로** 비교합니다.
- 반환값이 `0`: 두 문자열이 **동일**
- 반환값이 **음수**: 첫 번째 문자열이 사전순으로 **앞**
- 반환값이 **양수**: 첫 번째 문자열이 사전순으로 **뒤**

```c
char a[] = "apple";
char b[] = "apple";
char c[] = "banana";

if (strcmp(a, b) == 0) {
    printf("a와 b는 같습니다.\n"); // 이 코드가 실행됨
}

printf("a와 c 비교: %d\n", strcmp(a, c)); // 음수 (apple이 banana보다 앞)
```

---

## 4. 문자열 입출력

```c
#include <stdio.h>

int main() {
    char input[100];

    printf("이름을 입력하세요: ");
    // fgets: 공백 포함 한 줄 입력, 버퍼 오버플로우 방지
    fgets(input, sizeof(input), stdin);

    printf("안녕하세요, %s", input);

    return 0;
}
```

> **`gets()` 사용 금지**: `gets()` 함수는 입력 길이를 검사하지 않아 보안 취약점(버퍼 오버플로우)을 유발합니다. 반드시 `fgets()`를 사용하세요.

C언어의 문자열은 파이썬처럼 내장 연산자(`+`, `==`)로 조작할 수 없어 불편하게 느껴질 수 있지만, `string.h` 라이브러리 함수들을 익혀두면 대부분의 문자열 작업을 효율적으로 처리할 수 있습니다.
