---
title: 파일 입출력 (File I/O)
layout: post
category: C언어 기초 문법
weight: 13
---

## 1. 파일 입출력이란?

파일 입출력(File I/O)은 프로그램이 **파일을 읽고 쓰는 작업**을 의미합니다. 콘솔 출력과 달리, 파일에 저장된 데이터는 프로그램이 종료된 후에도 영구적으로 보존됩니다.

C언어에서는 `<stdio.h>`에 있는 표준 라이브러리 함수들을 통해 파일을 다룹니다. 파일 작업의 핵심은 **파일 포인터(`FILE *`)**입니다.

## 2. 파일 열기: `fopen()`

모든 파일 작업의 시작은 `fopen()`으로 파일을 여는 것입니다.

```c
FILE *파일포인터 = fopen("파일경로", "모드");
```

**주요 파일 열기 모드:**

| 모드 | 설명 | 파일이 없을 때 |
| :--- | :--- | :--- |
| `"r"` | **읽기 (Read)**: 파일 읽기 전용 | 오류 반환 (`NULL`) |
| `"w"` | **쓰기 (Write)**: 파일 쓰기. **기존 내용 삭제** | 새 파일 생성 |
| `"a"` | **추가 (Append)**: 파일 끝에 내용 추가 | 새 파일 생성 |
| `"r+"` | 읽기 + 쓰기 | 오류 반환 (`NULL`) |
| `"w+"` | 읽기 + 쓰기. **기존 내용 삭제** | 새 파일 생성 |

```c
FILE *fp = fopen("data.txt", "w");
if (fp == NULL) {
    printf("파일 열기 실패!\n");
    return 1; // 오류 처리 필수
}
```

---

## 3. 파일 쓰기: `fprintf()`, `fputc()`, `fputs()`

### `fprintf()`: 형식화된 데이터 쓰기

`printf()`와 유사하지만, 화면 대신 **파일**에 씁니다.

```c
#include <stdio.h>

int main() {
    FILE *fp = fopen("output.txt", "w");
    if (fp == NULL) { return 1; }

    fprintf(fp, "안녕하세요!\n");
    fprintf(fp, "이름: %s, 나이: %d\n", "Alice", 20);
    fprintf(fp, "학점: %.2f\n", 3.85);

    fclose(fp); // 파일 닫기 (필수!)
    printf("파일 쓰기 완료.\n");
    return 0;
}
```

---

## 4. 파일 읽기: `fscanf()`, `fgetc()`, `fgets()`

### `fgets()`: 한 줄씩 읽기 (권장)

```c
#include <stdio.h>

int main() {
    FILE *fp = fopen("output.txt", "r");
    if (fp == NULL) {
        printf("파일을 열 수 없습니다.\n");
        return 1;
    }

    char line[200];
    printf("--- 파일 내용 ---\n");
    // fgets가 NULL을 반환하면 파일 끝 또는 오류
    while (fgets(line, sizeof(line), fp) != NULL) {
        printf("%s", line);
    }

    fclose(fp);
    return 0;
}
```

### `fscanf()`: 형식에 맞게 읽기

```c
#include <stdio.h>

int main() {
    FILE *fp = fopen("numbers.txt", "r"); // "10 20 30" 내용의 파일
    if (fp == NULL) { return 1; }

    int a, b, c;
    fscanf(fp, "%d %d %d", &a, &b, &c);
    printf("읽은 값: %d, %d, %d\n", a, b, c);

    fclose(fp);
    return 0;
}
```

---

## 5. 파일 닫기: `fclose()`

파일 작업이 끝나면 반드시 `fclose()`를 호출해야 합니다. 닫지 않으면 파일에 쓴 내용이 디스크에 저장되지 않거나 파일이 손상될 수 있습니다.

```c
fclose(fp);
fp = NULL; // 안전을 위해 NULL로 초기화
```

---

## 6. 종합 예제: 학생 성적 저장 및 읽기

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    char name[30];
    int score;
} Student;

int main() {
    // 파일 쓰기
    FILE *fp = fopen("students.txt", "w");
    if (fp == NULL) { return 1; }

    Student students[3] = {{"Alice", 92}, {"Bob", 85}, {"Charlie", 78}};
    for (int i = 0; i < 3; i++) {
        fprintf(fp, "%s %d\n", students[i].name, students[i].score);
    }
    fclose(fp);
    printf("성적 파일 저장 완료.\n");

    // 파일 읽기
    fp = fopen("students.txt", "r");
    if (fp == NULL) { return 1; }

    printf("\n--- 저장된 성적 ---\n");
    Student read;
    while (fscanf(fp, "%s %d", read.name, &read.score) == 2) {
        printf("이름: %-10s 점수: %d\n", read.name, read.score);
    }
    fclose(fp);

    return 0;
}
```

파일 입출력은 데이터를 영구적으로 저장하고 독립적인 프로그램 간 데이터를 공유하는 데 필수적인 기능입니다. `fopen()`으로 파일을 열고, 읽기/쓰기 작업 후 반드시 `fclose()`로 파일을 닫는 패턴을 항상 지키도록 합니다.
