---
title: 불 자료형
layout: post
---

불 자료형(`bool`)은 참(`True`)과 거짓(`False`) 두 가지 값만 가지는 자료형입니다.

## 핵심 포인트

- 조건문(`if`), 반복문(`while`)에서 핵심 역할
- 비교 연산의 결과는 `bool`
- `0`, `None`, `""`, `[]` 등은 `False`로 평가

## 예제

```python
is_python_fun = True
score = 75

print(is_python_fun)
print(score > 60)         # True
print(bool(""))           # False
print(bool([1, 2, 3]))    # True
```

## 논리 연산

```python
a = True
b = False

print(a and b)   # False
print(a or b)    # True
print(not a)     # False
```
