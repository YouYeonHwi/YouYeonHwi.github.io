---
title: 튜플
layout: post
---

튜플(`tuple`)은 리스트와 비슷하지만 생성 후 수정할 수 없는 불변 자료형입니다.

## 핵심 포인트

- 소괄호 `()` 사용
- 순서 보장, 중복 허용
- 데이터 보호, 패킹/언패킹에 유용

## 예제

```python
point = (10, 20)
name_age = ("Alice", 25)

x, y = point
print(x, y)              # 10 20
print(name_age[0])       # Alice
```

## 패킹 & 언패킹

```python
data = 1, 2, 3           # 패킹
a, b, c = data           # 언패킹
print(a, b, c)
```
