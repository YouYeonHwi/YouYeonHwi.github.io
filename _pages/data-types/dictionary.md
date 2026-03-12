---
title: 딕셔너리
layout: post
---

딕셔너리(`dict`)는 `키(key): 값(value)` 쌍으로 데이터를 저장하는 자료형입니다.

## 핵심 포인트

- 중괄호 `{}` 사용
- 키는 중복 불가, 값은 중복 가능
- 빠른 조회에 강점

## 예제

```python
student = {
    "name": "Yuna",
    "age": 24,
    "major": "Computer Science"
}

print(student["name"])      # Yuna
student["age"] = 25
student["grade"] = "A"
print(student)
```

## 자주 쓰는 메서드

```python
print(student.keys())
print(student.values())
print(student.get("email", "없음"))
```
