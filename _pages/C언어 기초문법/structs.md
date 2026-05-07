---
title: 구조체 (Structures)
layout: post
category: C언어 기초 문법
weight: 11
---

## 1. 구조체란?

구조체(Structure)는 **서로 다른 자료형의 데이터를 하나로 묶어** 표현하는 사용자 정의 자료형입니다. 예를 들어 학생 정보(이름, 나이, 성적)처럼 성격이 다른 여러 데이터를 하나의 단위로 관리할 때 유용합니다.

## 2. 구조체 정의 및 사용

`struct` 키워드로 구조체를 정의하고, 이후 구조체 타입으로 변수를 선언합니다.

```c
#include <stdio.h>
#include <string.h>

// 구조체 정의
struct Student {
    char name[50];  // 이름
    int age;        // 나이
    double gpa;     // 학점
};

int main() {
    // 구조체 변수 선언 및 초기화
    struct Student s1;
    strcpy(s1.name, "Alice");
    s1.age = 20;
    s1.gpa = 3.8;

    // 멤버 접근: 점(.) 연산자 사용
    printf("이름: %s\n", s1.name);
    printf("나이: %d\n", s1.age);
    printf("학점: %.1f\n", s1.gpa);

    // 선언과 동시에 초기화
    struct Student s2 = {"Bob", 22, 3.5};
    printf("\n이름: %s, 나이: %d, 학점: %.1f\n", s2.name, s2.age, s2.gpa);

    return 0;
}
```

---

## 3. `typedef`로 구조체 이름 간략화

`typedef`를 사용하면 `struct Student` 대신 `Student`만으로 구조체 변수를 선언할 수 있어 코드가 간결해집니다.

```c
#include <stdio.h>
#include <string.h>

// typedef를 사용한 구조체 정의
typedef struct {
    char model[50];
    int year;
    double price;
} Car;

int main() {
    // struct Car 대신 Car만으로 선언 가능
    Car car1 = {"Tesla Model 3", 2023, 45000000.0};

    printf("모델: %s\n", car1.model);
    printf("연식: %d년\n", car1.year);
    printf("가격: %.0f원\n", car1.price);

    return 0;
}
```

---

## 4. 구조체 배열

여러 개의 구조체 변수를 배열로 관리할 수 있습니다.

```c
#include <stdio.h>
#include <string.h>

typedef struct {
    char name[30];
    int score;
} Student;

int main() {
    Student students[3] = {
        {"Alice", 92},
        {"Bob", 85},
        {"Charlie", 78}
    };

    int total = 0;
    printf("--- 학생 성적 ---\n");
    for (int i = 0; i < 3; i++) {
        printf("%s: %d점\n", students[i].name, students[i].score);
        total += students[i].score;
    }
    printf("평균: %.1f점\n", (double)total / 3);

    return 0;
}
```

---

## 5. 포인터로 구조체 멤버 접근 (`->` 연산자)

포인터로 구조체를 가리킬 때는 멤버 접근에 점(`.`) 대신 화살표(`->`) 연산자를 사용합니다.

```c
#include <stdio.h>
#include <string.h>

typedef struct {
    char name[30];
    int age;
} Person;

void print_person(Person *p) {
    // (*p).name 대신 p->name 사용 (동일한 의미)
    printf("이름: %s, 나이: %d\n", p->name, p->age);
}

int main() {
    Person person = {"Yeon", 25};
    print_person(&person);

    // 포인터를 통해 값 수정
    Person *ptr = &person;
    ptr->age = 26;
    printf("수정 후 나이: %d\n", ptr->age);

    return 0;
}
```

구조체는 현실 세계의 복잡한 객체를 프로그램으로 표현하는 강력한 방법입니다. 이를 잘 활용하면 데이터를 체계적으로 관리할 수 있으며, C++의 클래스(Class)와 같은 객체지향 개념의 기초가 됩니다.
