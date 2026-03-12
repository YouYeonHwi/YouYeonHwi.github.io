---
title: 집합
layout: post
---

집합(`set`)은 중복을 허용하지 않고 순서가 없는 자료형입니다.

## 핵심 포인트

- 중괄호 `{}` 사용 (빈 집합은 `set()`)
- 중복 제거에 매우 유용
- 합집합, 교집합, 차집합 연산 가능

## 예제

```python
a = {1, 2, 3, 3}
b = {3, 4, 5}

print(a)          # {1, 2, 3}
print(a | b)      # 합집합
print(a & b)      # 교집합
print(a - b)      # 차집합
```

## 자주 쓰는 메서드

```python
a.add(10)
a.remove(2)
print(a)
```
