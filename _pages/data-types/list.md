---
title: 리스트
layout: post
---

리스트(`list`)는 여러 데이터를 순서대로 저장하는 가장 대표적인 컬렉션 자료형입니다.

## 핵심 포인트

- 대괄호 `[]` 사용
- 순서 보장, 중복 허용
- 요소 추가/수정/삭제 가능 (가변)

## 예제

```python
fruits = ["apple", "banana", "cherry"]
fruits.append("orange")
fruits[1] = "blueberry"

print(fruits)            # ['apple', 'blueberry', 'cherry', 'orange']
print(fruits[:2])        # ['apple', 'blueberry']
```

## 자주 쓰는 메서드

```python
nums = [3, 1, 4, 1, 5]
nums.sort()
print(nums)              # [1, 1, 3, 4, 5]
nums.remove(1)           # 첫 번째 1 삭제
print(len(nums))         # 길이 확인
```
