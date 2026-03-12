---
title: 숫자형
layout: post
---

숫자형은 수치 계산을 담당하는 자료형으로 `int`, `float`, `complex`가 있습니다.

## 핵심 포인트

- `int`: 정수
- `float`: 소수점이 있는 실수
- `complex`: 복소수 (`a + bj` 형태)

## 예제

```python
a = 10          # int
b = 3.5         # float
c = 2 + 4j      # complex

print(type(a), type(b), type(c))
print(a + b)    # 13.5
print(c.real, c.imag)  # 2.0 4.0
```

## 자주 쓰는 함수

```python
print(abs(-7))      # 절댓값
print(pow(2, 5))    # 2의 5제곱
print(round(3.14159, 2))  # 반올림
```
