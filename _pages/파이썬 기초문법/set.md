---
title: 집합 (Set)
layout: post
category: 파이썬 기초 문법
weight: 8
---

## 집합(set)이란?

집합(`set`)은 **순서가 없고, 중복을 허용하지 않는** 데이터의 모음입니다. 수학의 집합 개념과 매우 유사하며, 주로 데이터의 중복을 제거하거나, 멤버십을 테스트(특정 요소가 포함되어 있는지 확인)하거나, 다른 집합과의 수학적 연산(합집합, 교집합 등)을 수행할 때 유용하게 사용됩니다.

- **순서 없음(Unordered)**: 요소를 추가할 때마다 순서가 보장되지 않으므로, 인덱싱(`[0]`)이나 슬라이싱을 사용할 수 없습니다.
- **고유성(Unique)**: 모든 요소는 유일해야 합니다. 중복된 값을 추가해도 하나의 요소만 남습니다.
- **가변성(Mutable)**: 집합 자체는 생성된 후에 요소를 추가하거나 삭제할 수 있습니다. 단, 집합의 요소는 **변하지 않는(immutable)** 자료형만 가능합니다(예: 숫자, 문자열, 튜플).

## 집합 생성하기

집합은 중괄호 `{}`나 `set()` 생성자를 사용해 만듭니다.

```python
# 1. 중괄호 {} 사용
fruits = {"사과", "바나나", "딸기"}
print(fruits)  # 출력 순서는 실행할 때마다 다를 수 있음

# 2. set() 생성자 사용 (리스트, 튜플, 문자열 등 반복 가능한 객체 전달)
# - 리스트를 이용한 생성
numbers_list = [1, 2, 2, 3, 4, 3]
numbers_set = set(numbers_list)
print(numbers_set)  # {1, 2, 3, 4} (중복이 자동으로 제거됨)

# - 문자열을 이용한 생성
letters = set("hello world")
print(letters)  # {'l', 'd', 'o', 'h', ' ', 'w', 'e', 'r'}

# 3. 빈 집합 생성
# 주의! empty_set = {} 는 빈 딕셔너리를 생성합니다.
empty_set = set()
print(type(empty_set)) # <class 'set'>
```

## 집합 요소 다루기

### 1. 요소 추가

- **`add(값)`**: 하나의 요소를 추가합니다.
- **`update(iterable)`**: 여러 요소를 한 번에 추가합니다. 리스트, 튜플, 다른 집합 등을 전달할 수 있습니다.

```python
s = {1, 2, 3}

# 요소 하나 추가
s.add(4)
print(s)  # {1, 2, 3, 4}

# 이미 있는 요소를 추가하면 변화 없음
s.add(3)
print(s)  # {1, 2, 3, 4}

# 여러 요소 추가
s.update([4, 5, 6])
print(s)  # {1, 2, 3, 4, 5, 6}
```

### 2. 요소 삭제

- **`remove(값)`**: 특정 요소를 삭제합니다. **만약 요소가 집합에 없으면 `KeyError`가 발생합니다.**
- **`discard(값)`**: 특정 요소를 삭제합니다. **요소가 없어도 오류가 발생하지 않습니다.**
- **`pop()`**: 임의의 요소를 제거하고 그 값을 반환합니다. 집합이 비어있으면 `KeyError` 발생.

```python
s = {1, 2, 3, 4, 5}

# remove 예제
s.remove(3)
print(s)  # {1, 2, 4, 5}
# s.remove(10)  # KeyError 발생!

# discard 예제
s.discard(2)
print(s)  # {1, 4, 5}
s.discard(10) # 오류 발생하지 않음
print(s)  # {1, 4, 5}

# pop 예제
removed_item = s.pop()
print(f"제거된 항목: {removed_item}")
print(s)
```

## 집합 연산

수학의 집합 연산을 직관적인 연산자나 메서드로 수행할 수 있습니다.

```python
A = {1, 2, 3, 4}
B = {3, 4, 5, 6}

# 1. 합집합 (Union): 두 집합의 모든 요소를 포함 (중복 제외)
print(A | B)              # {1, 2, 3, 4, 5, 6}
print(A.union(B))         # {1, 2, 3, 4, 5, 6}

# 2. 교집합 (Intersection): 두 집합에 공통으로 존재하는 요소
print(A & B)              # {3, 4}
print(A.intersection(B))  # {3, 4}

# 3. 차집합 (Difference): A에는 있고 B에는 없는 요소
print(A - B)              # {1, 2}
print(A.difference(B))    # {1, 2}

# 4. 대칭 차집합 (Symmetric Difference): 합집합에서 교집합을 뺀 나머지 (둘 중 한 곳에만 있는 요소)
print(A ^ B)              # {1, 2, 5, 6}
print(A.symmetric_difference(B)) # {1, 2, 5, 6}
```

## 집합 관련 메서드 및 연산자

- **`len(s)`**: 집합 `s`의 요소 개수를 반환합니다.
- **`x in s`**: `x`가 집합 `s`에 포함되어 있으면 `True`, 아니면 `False`를 반환합니다. (멤버십 테스트)
- **`s.issubset(t)` 또는 `s <= t`**: 집합 `s`가 집합 `t`의 부분집합인지 확인합니다.
- **`s.issuperset(t)` 또는 `s >= t`**: 집합 `s`가 집합 `t`의 상위집합인지 확인합니다.
- **`s.isdisjoint(t)`**: 집합 `s`와 `t`가 서로소(공통 요소가 없음)인지 확인합니다.

```python
A = {1, 2}
B = {1, 2, 3, 4}

print(f"A는 B의 부분집합인가? {A.issubset(B)}")   # True
print(f"B는 A의 상위집합인가? {B.issuperset(A)}")   # True
print(f"A와 {5, 6}은 서로소인가? {A.isdisjoint({5, 6})}") # True
```

집합은 데이터의 유일성을 보장하고, 빠르고 효율적인 멤버십 테스트와 집합 연산을 제공하므로 알고리즘 문제나 데이터 분석 등 다양한 상황에서 매우 유용하게 쓰입니다.
