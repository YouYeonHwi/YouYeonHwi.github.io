---
title: 파이썬 조건문 (Conditional Statements)
layout: post
parent: 파이썬 기초 문법
---

## 조건문이란?

조건문은 프로그램의 실행 흐름을 **특정 조건에 따라 다르게 제어**하고자 할 때 사용합니다. 주어진 조건식이 참(True)인지 거짓(False)인지를 판단하여, 각 상황에 맞는 코드 블록을 실행하게 해줍니다. 이를 통해 프로그램은 훨씬 더 유연하고 지능적으로 동작할 수 있습니다.

파이썬의 대표적인 조건문은 `if`, `elif`, `else`를 사용하는 것입니다.

## `if` 문: 가장 기본적인 조건문

`if` 문은 제시된 조건식이 참(`True`)일 경우에만 그 아래의 코드 블록을 실행합니다.

**기본 구조:**
```python
if 조건식:
    # 조건식이 참(True)일 때 실행될 코드
```

**예제:**
```python
weather = "맑음"

if weather == "맑음":
    print("날씨가 좋으니 산책을 가자!")

print("프로그램 종료")
```
> 위 예제에서 `weather` 변수가 "맑음"이므로 `if` 문 아래의 `print`문이 실행됩니다. 만약 `weather`가 다른 값이었다면, `if` 블록은 건너뛰고 "프로그램 종료"만 출력되었을 것입니다.

---

## `if-else` 문: 두 가지 경우 처리하기

`if-else` 문은 조건식이 참일 때와 거짓일 때 각각 다른 코드를 실행하고 싶을 때 사용합니다.

**기본 구조:**
```python
if 조건식:
    # 조건식이 참(True)일 때 실행될 코드
else:
    # 조건식이 거짓(False)일 때 실행될 코드
```

**예제:**
```python
temperature = 32

if temperature > 30:
    print("날씨가 덥습니다. 에어컨을 켜세요.")
else:
    print("아직은 괜찮네요. 선풍기만으로도 충분합니다.")
```
> `temperature`가 30보다 크므로 `if` 블록 안의 코드가 실행됩니다. 만약 25였다면 `else` 블록의 코드가 실행되었을 것입니다.

---

## `if-elif-else` 문: 여러 조건을 순차적으로 검사하기

세 개 이상의 다양한 조건을 검사해야 할 때 `if-elif-else` 구조를 사용합니다. `elif`는 "else if"의 줄임말로, 이전 `if` 또는 `elif` 문의 조건이 거짓일 때 새로운 조건을 검사합니다.

**기본 구조:**
```python
if 첫 번째 조건식:
    # 첫 번째 조건식이 참일 때 실행될 코드
elif 두 번째 조건식:
    # 첫 번째는 거짓이고, 두 번째 조건식이 참일 때 실행될 코드
elif 세 번째 조건식:
    # 앞의 모든 조건이 거짓이고, 세 번째 조건식이 참일 때 실행될 코드
else:
    # 위의 모든 조건식이 거짓일 때 실행될 코드
```

> **중요**: `if`와 `elif`는 위에서부터 순서대로 조건을 검사하다가, **하나의 조건이라도 참이 되어 해당 블록이 실행되면, 그 뒤의 `elif`나 `else`는 더 이상 검사하지 않고** 전체 조건문을 빠져나갑니다.

**예제:**
```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"당신의 점수는 {score}점이며, 학점은 '{grade}'입니다.") # 당신의 점수는 85점이며, 학점은 'B'입니다.
```

---

## 💡 조건문 꿀팁과 고급 활용법

### 1. 한 줄 조건문 (Ternary Operator)

간단한 `if-else` 문은 한 줄로 간결하게 표현할 수 있습니다. 이를 "조건부 표현식(Conditional Expression)" 또는 "삼항 연산자(Ternary Operator)"라고 부릅니다.

**기본 구조:**
`참일_때의_값 if 조건식 else 거짓일_때의_값`

**예제:**
```python
age = 22
status = "성인" if age >= 20 else "미성년자"
print(status)  # 성인
```
> 이 코드는 `if-else` 블록을 사용한 아래의 코드와 완전히 동일하게 동작합니다.
> ```python
> if age >= 20:
>     status = "성인"
> else:
>     status = "미성년자"
> ```

### 2. `in` 연산자 활용하기

리스트, 튜플, 문자열, 딕셔너리 등에 특정 요소가 포함되어 있는지 검사할 때 `in` 연산자를 사용하면 코드가 매우 직관적이고 깔끔해집니다.

**예제:**
```python
# 리스트에서 사용
allowed_users = ["Alice", "Bob", "Charlie"]
current_user = "Bob"

if current_user in allowed_users:
    print("접근이 허용되었습니다.")

# 문자열에서 사용
if "spam" in "this is a spam mail":
    print("스팸 메일입니다.")
```

### 3. Truthiness: `if` 문의 참/거짓 판별 규칙

파이썬은 불(bool) 자료형(`True`/`False`)이 아니더라도, 다양한 자료형을 `if` 조건문에서 사용할 때 참 또는 거짓으로 평가합니다. 이를 "Truthiness"라고 합니다.

- **거짓(False)으로 평가되는 값**:
  - `None`
  - 숫자 `0`, `0.0`
  - 빈 컨테이너: `""`(빈 문자열), `[]`(빈 리스트), `()`(빈 튜플), `{}`(빈 딕셔너리), `set()`(빈 집합)
- **참(True)으로 평가되는 값**:
  - 위에서 언급한 거짓 값들을 제외한 모든 값

**예제:**
```python
my_list = []
if not my_list:  # len(my_list) == 0 보다 간결함
    print("리스트가 비어 있습니다.")

user_input = ""
if user_input:
    print(f"입력된 값: {user_input}")
else:
    print("아무것도 입력되지 않았습니다.") # 실행됨
```
> Truthiness를 잘 활용하면 "리스트에 내용이 있는가?", "사용자가 무언가 입력했는가?"와 같은 검사를 매우 간결하게 작성할 수 있습니다.

### 4. 중첩 조건문 (Nested `if`)

`if` 문 안에 또 다른 `if` 문을 넣어 더 복잡한 조건을 구현할 수 있습니다. 하지만 너무 깊게 중첩되면 코드를 이해하기 어려워지므로, 2~3단계 이상은 사용하지 않는 것이 좋습니다.

**예제:**
```python
is_logged_in = True
user_level = "admin"

if is_logged_in:
    print("로그인 상태입니다.")
    if user_level == "admin":
        print("관리자 권한이 있습니다.")
    else:
        print("일반 사용자입니다.")
else:
    print("로그인이 필요합니다.")
```

조건문은 프로그래밍의 논리적인 흐름을 만드는 가장 기본적인 도구입니다. 다양한 활용법을 익혀 상황에 맞게 명확하고 효율적인 코드를 작성하는 습관을 들이는 것이 중요합니다.
