---
title: 불 자료형 (Boolean)
layout: post
---

## 불(Bool) 자료형이란?

불(bool) 자료형은 프로그래밍에서 가장 기본적인 데이터 타입 중 하나로, **참(True)**과 **거짓(False)** 두 가지 값만을 가집니다. 이 두 가지 상태를 이용해 조건의 진위를 판별하거나, 프로그램의 실행 흐름을 제어하는 데 결정적인 역할을 합니다.

- **`True`**: 조건이 참이거나, 상태가 활성화되었음을 의미합니다.
- **`False`**: 조건이 거짓이거나, 상태가 비활성화되었음을 의미합니다.

> **참고**: 파이썬에서 `True`와 `False`는 첫 글자가 대문자입니다. 소문자로 `true`나 `false`로 쓰면 변수 이름으로 인식하므로 주의해야 합니다.

## 불 자료형은 언제 사용될까?

불 자료형은 주로 다음과 같은 상황에서 사용됩니다.

### 1. 조건문과 반복문

`if`, `elif`, `else`와 같은 조건문이나 `while` 반복문에서 특정 코드 블록을 실행할지 말지를 결정하는 기준으로 사용됩니다.

```python
# if 조건문 예제
is_active = True
if is_active:
    print("현재 계정은 활성 상태입니다.")  # is_active가 True이므로 실행됨

# while 반복문 예제
count = 3
while count > 0:
    print(f"카운트 다운: {count}")
    count -= 1
    if count == 0:
        print("발사!")
```

### 2. 비교 연산자의 결과

두 값을 비교하는 연산(`==`, `!=`, `>`, `<`, `>=`, `<=`)의 결과는 항상 불 자료형으로 반환됩니다.

```python
a = 10
b = 5

print(f"a > b: {a > b}")          # True
print(f"a == b: {a == b}")        # False
print(f"a != b: {a != b}")        # True
```

### 3. 논리 연산자

`and`, `or`, `not`과 같은 논리 연산자는 불 자료형을 조합하여 더 복잡한 조건을 만들 때 사용됩니다.

- **`and`**: 두 조건이 모두 `True`일 때만 `True`를 반환합니다.
- **`or`**: 두 조건 중 하나라도 `True`이면 `True`를 반환합니다.
- **`not`**: 불 값의 진위를 반전시킵니다 (`True` -> `False`, `False` -> `True`).

```python
has_permission = True
is_logged_in = False

# and 예제: 두 조건 모두 만족해야 접근 가능
if has_permission and is_logged_in:
    print("관리자 페이지에 오신 것을 환영합니다.")
else:
    print("접근 권한이 없습니다.")  # is_logged_in이 False이므로 실행됨

# or 예제: 둘 중 하나만 만족해도 접근 가능
if has_permission or is_logged_in:
    print("일부 기능에 접근할 수 있습니다.")  # has_permission이 True이므로 실행됨
else:
    print("로그인이 필요합니다.")

# not 예제: 진위 반전
is_premium_user = False
if not is_premium_user:
    print("프리미엄 기능 사용을 위해 결제가 필요합니다.")  # not False는 True이므로 실행됨
```

## 자료형의 참/거짓 판별 (Truthiness)

파이썬에서는 다양한 자료형을 불 자료형으로 형 변환(`bool()`)할 수 있습니다. 이때 각 자료형은 "참으로 여겨지는 값(Truthy)"과 "거짓으로 여겨지는 값(Falsy)"으로 나뉩니다.

### 거짓(False)으로 평가되는 값들

다음과 같은 값들은 `bool()` 함수를 통과하거나 `if` 조건문에서 사용될 때 `False`로 평가됩니다.

- **숫자**: `0`, `0.0`
- **빈 컨테이너**:
  - 빈 문자열: `""`, `''`
  - 빈 리스트: `[]`
  - 빈 튜플: `()`
  - 빈 딕셔너리: `{}`
  - 빈 세트: `set()`
- **`None`**: 아무 값도 없음을 의미하는 특별한 객체

### 참(True)으로 평가되는 값들

위에서 언급된 "거짓으로 평가되는 값"들을 제외한 **모든 값**은 `True`로 평가됩니다.

- 0이 아닌 모든 숫자 (예: `1`, `-10`, `3.14`)
- 내용이 있는 모든 컨테이너 (예: `"hello"`, `[1]`, `(1,)`, `{"a": 1}`)

### Truthiness 예제

```python
def check_truthiness(value):
    if value:
        print(f"'{value}'(은)는 참(True)입니다.")
    else:
        print(f"'{value}'(은)는 거짓(False)입니다.")

# 거짓으로 평가되는 값들
check_truthiness(0)          # '0'(은)는 거짓(False)입니다.
check_truthiness("")         # ''(은)는 거짓(False)입니다.
check_truthiness([])         # '[]'(은)는 거짓(False)입니다.
check_truthiness(None)       # 'None'(은)는 거짓(False)입니다.

print("-" * 20)

# 참으로 평가되는 값들
check_truthiness(100)        # '100'(은)는 참(True)입니다.
check_truthiness("Python")   # 'Python'(은)는 참(True)입니다.
check_truthiness([1, 2])     # '[1, 2]'(은)는 참(True)입니다.
```

이러한 "Truthiness" 규칙을 활용하면 코드를 더 간결하게 작성할 수 있습니다.

```python
# Truthiness를 활용한 간결한 코드
my_list = []
if not my_list:  # len(my_list) == 0 대신 사용
    print("리스트가 비어있습니다.")

name = "Alice"
if name:  # name != "" 대신 사용
    print(f"안녕하세요, {name}님!")
```

불 자료형은 단순해 보이지만, 프로그램의 논리 구조를 세우는 데 있어 가장 핵심적인 요소입니다. 그 쓰임새와 Truthiness 규칙을 잘 이해하면 더 견고하고 효율적인 파이썬 코드를 작성할 수 있습니다.
