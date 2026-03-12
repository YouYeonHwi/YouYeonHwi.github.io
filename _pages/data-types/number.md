---
title: 숫자형 (Number)
layout: post
---

## 숫자형 자료란?

숫자형(Numeric Types)은 이름 그대로 숫자를 표현하고 다루기 위한 자료형입니다. 파이썬은 다양한 종류의 숫자형을 기본적으로 제공하여, 간단한 계산부터 복잡한 과학 계산까지 폭넓게 활용할 수 있습니다.

주요 숫자형에는 **정수(integer)**, **실수(float)**, **복소수(complex number)**가 있습니다.

## 1. 정수형 (Integer, `int`)

정수형은 소수점이 없는 모든 양수, 음수, 0을 나타냅니다. 파이썬의 정수형은 다른 언어와 달리 표현할 수 있는 수의 크기에 제한이 없어 아주 큰 수도 다룰 수 있다는 장점이 있습니다.

```python
# 일반적인 정수
a = 100
b = -50
c = 0
print(type(a), type(b), type(c))  # <class 'int'> <class 'int'> <class 'int'>

# 매우 큰 수
large_number = 12345678901234567890
print(large_number)

# 다양한 진법 표현
binary_num = 0b1010  # 2진수 (0b로 시작) -> 10
octal_num = 0o12     # 8진수 (0o로 시작) -> 10
hex_num = 0xA      # 16진수 (0x로 시작) -> 10
print(binary_num, octal_num, hex_num) # 10 10 10
```

## 2. 실수형 (Floating-Point, `float`)

실수형은 소수점을 포함하는 숫자를 나타냅니다. 과학적 표기법인 지수 표현(E 또는 e)도 사용할 수 있습니다.

```python
# 일반적인 실수
pi = 3.14159
negative_float = -0.001
print(type(pi)) # <class 'float'>

# 지수 표현
# 3.14 * 10^2
exp_float = 3.14e2
print(exp_float)  # 314.0

# 1.23 * 10^-4
small_float = 1.23E-4
print(small_float) # 0.000123
```

> **부동 소수점 오차**: 컴퓨터는 실수를 2진법으로 표현하는 과정에서 미세한 오차가 발생할 수 있습니다. 예를 들어 `0.1 + 0.2`는 정확히 `0.3`이 아닐 수 있습니다. 정밀한 계산이 필요할 때는 `decimal` 모듈 사용을 고려해야 합니다.
> ```python
> print(0.1 + 0.2)  # 0.30000000000000004
> ```

## 3. 복소수형 (Complex, `complex`)

복소수형은 수학의 복소수(실수부 + 허수부)를 다루기 위한 자료형입니다. 허수부는 숫자 뒤에 `j` 또는 `J`를 붙여 표현합니다. 공학 분야에서 자주 사용됩니다.

```python
# 복소수 생성
c1 = 2 + 3j
c2 = complex(5, -2) # complex() 함수로도 생성 가능

print(c1)  # (2+3j)
print(c2)  # (5-2j)

# 실수부와 허수부 접근
print(f"c1의 실수부: {c1.real}") # c1의 실수부: 2.0
print(f"c1의 허수부: {c1.imag}") # c1의 허수부: 3.0

# 복소수 간 연산
print(c1 + c2) # (7+1j)
print(c1 * c2) # (16+11j)
```

## 숫자형 간의 연산

파이썬은 기본적인 사칙연산(`+`, `-`, `*`, `/`) 외에도 다양한 연산자를 제공합니다.

```python
a = 10
b = 3

print(f"더하기: {a + b}")       # 13
print(f"빼기: {a - b}")         # 7
print(f"곱하기: {a * b}")       # 30
print(f"나누기: {a / b}")         # 3.333... (결과는 항상 float)
print(f"나머지: {a % b}")         # 1
print(f"몫: {a // b}")           # 3 (소수점 이하 버림)
print(f"거듭제곱: {a ** b}")      # 1000 (10의 3제곱)
```

## 형 변환 (Type Conversion)

`int()`, `float()`, `complex()` 함수를 사용해 숫자형 간에 타입을 변환할 수 있습니다.

```python
# 실수 -> 정수 (소수점 이하 버림)
num_float = 5.8
print(f"float to int: {int(num_float)}") # 5

# 정수 -> 실수
num_int = 10
print(f"int to float: {float(num_int)}") # 10.0

# 문자열 -> 숫자
str_num = "123"
print(f"string to int: {int(str_num)}") # 123
# 주의: 숫자로 변환할 수 없는 문자열은 ValueError 발생
# int("hello") # ValueError

# 정수 -> 복소수
print(f"int to complex: {complex(num_int)}") # (10+0j)
```

## 유용한 내장 함수

- **`abs(x)`**: `x`의 절댓값을 반환합니다.
- **`round(x, n)`**: `x`를 소수점 `n`자리까지 반올림합니다. `n`을 생략하면 정수로 반올림.
- **`pow(x, y)`**: `x`의 `y`제곱을 반환합니다 (`x ** y`와 동일).
- **`divmod(x, y)`**: `(x // y, x % y)` 즉, 몫과 나머지를 튜플로 반환합니다.

```python
print(f"abs(-10): {abs(-10)}")             # 10
print(f"round(3.14159, 2): {round(3.14159, 2)}") # 3.14
print(f"pow(2, 10): {pow(2, 10)}")         # 1024
print(f"divmod(10, 3): {divmod(10, 3)}") # (3, 1)
```

숫자형 자료는 모든 프로그래밍의 기본이 되는 만큼, 각 타입의 특징과 연산 방법을 잘 이해해두는 것이 중요합니다.
