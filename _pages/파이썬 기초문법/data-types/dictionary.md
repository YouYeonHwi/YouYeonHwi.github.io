---
title: 딕셔너리 (Dictionary)
layout: post
---

## 딕셔너리(dict)란?

딕셔너리(`dict`)는 **키(Key)와 값(Value)을 하나의 쌍으로 묶어 저장**하는 자료형입니다. 현실 세계의 사전처럼, 단어(키)를 찾으면 그에 해당하는 뜻(값)을 알 수 있듯이, 딕셔너리는 키를 통해 값을 빠르고 효율적으로 찾아낼 수 있습니다.

- **키(Key)**: 딕셔너리 내에서 값을 식별하는 고유한 데이터입니다. **변하지 않는(immutable)** 자료형만 키가 될 수 있습니다(예: 문자열, 숫자, 튜플). 키는 중복될 수 없습니다.
- **값(Value)**: 키에 대응하는 데이터입니다. 리스트, 다른 딕셔너리 등 모든 자료형을 값으로 사용할 수 있으며, 중복도 가능합니다.

딕셔너리는 중괄호 `{}`로 감싸서 표현하며, 각 `키: 값` 쌍은 쉼표(`,`)로 구분합니다.

## 딕셔너리 생성하기

```python
# 1. 가장 일반적인 방법: {} 사용
person = {
    "name": "김철수",
    "age": 30,
    "city": "서울"
}
print(person)  # {'name': '김철수', 'age': 30, 'city': '서울'}

# 2. dict() 생성자 사용
# - 키워드 인자 방식 (키는 문자열만 가능)
person2 = dict(name="이영희", age=25, city="부산")
print(person2)  # {'name': '이영희', 'age': 25, 'city': '부산'}

# - (키, 값) 쌍의 리스트나 튜플을 전달
person3 = dict([("name", "박지성"), ("age", 40)])
print(person3)  # {'name': '박지성', 'age': 40}

# 3. 빈 딕셔너리 생성
empty_dict = {}
empty_dict2 = dict()
```

## 딕셔너리 요소 다루기

### 1. 요소 조회

딕셔너리의 값에 접근할 때는 대괄호 `[]` 안에 키를 지정합니다.

```python
print(person["name"])  # 김철수
print(person["age"])   # 30
```

> **주의**: 존재하지 않는 키로 접근하면 `KeyError`가 발생합니다.

### 2. `get()` 메서드를 이용한 안전한 조회

`KeyError`를 피하고 싶을 때 `get()` 메서드를 사용하면 유용합니다. `get()`은 키가 존재하면 해당 값을 반환하고, **키가 존재하지 않으면 `None`을 반환**합니다. 기본값을 지정할 수도 있습니다.

```python
# 'country'라는 키는 없지만 오류가 발생하지 않음
print(person.get("country"))  # None

# 기본값 지정: 키가 없을 때 '한국'을 반환
print(person.get("country", "한국"))  # 한국
```

### 3. 요소 추가 및 수정

- **추가**: 존재하지 않는 키에 값을 할당하면 새로운 `키: 값` 쌍이 추가됩니다.
- **수정**: 이미 존재하는 키에 값을 할당하면 해당 키의 값이 새로운 값으로 변경됩니다.

```python
person = {"name": "김철수", "age": 30}

# 요소 추가
person["job"] = "개발자"
print(person)  # {'name': '김철수', 'age': 30, 'job': '개발자'}

# 요소 수정
person["age"] = 31
print(person)  # {'name': '김철수', 'age': 31, 'job': '개발자'}
```

### 4. 요소 삭제

`del` 키워드나 `pop()` 메서드를 사용해 요소를 삭제할 수 있습니다.

```python
# del 키워드 사용
del person["city"]  # 'city' 키와 값 삭제

# pop() 메서드 사용: 값을 반환하면서 삭제
removed_age = person.pop("age")
print(f"삭제된 나이: {removed_age}")  # 삭제된 나이: 31
print(person)  # {'name': '김철수', 'job': '개발자'}
```

## 자주 쓰는 딕셔너리 메서드

- **`keys()`**: 딕셔너리의 모든 키를 모아 `dict_keys` 객체로 반환합니다.
- **`values()`**: 딕셔너리의 모든 값을 모아 `dict_values` 객체로 반환합니다.
- **`items()`**: `(키, 값)` 쌍을 튜플 형태로 묶어 `dict_items` 객체로 반환합니다.

`dict_keys`, `dict_values`, `dict_items`는 리스트와 비슷하게 `for` 문에서 반복하여 사용할 수 있습니다.

```python
person = {"name": "김철수", "age": 31, "job": "개발자"}

# keys()
print(list(person.keys()))    # ['name', 'age', 'job']
for key in person.keys():
    print(f"키: {key}")

# values()
print(list(person.values()))  # ['김철수', 31, '개발자']
for value in person.values():
    print(f"값: {value}")

# items()
print(list(person.items()))   # [('name', '김철수'), ('age', 31), ('job', '개발자')]
for key, value in person.items():
    print(f"{key}: {value}")
```

- **`clear()`**: 딕셔너리의 모든 요소를 삭제합니다.
- **`update()`**: 다른 딕셔너리를 이용해 현재 딕셔너리를 업데이트하거나 확장합니다.

```python
# update() 예제
person = {"name": "김철수", "age": 31}
additional_info = {"job": "개발자", "city": "서울"}

person.update(additional_info)
print(person)  # {'name': '김철수', 'age': 31, 'job': '개발자', 'city': '서울'}
```

## 딕셔너리 컴프리헨션 (Dictionary Comprehension)

리스트 컴프리헨션과 유사하게, `for` 문과 `if` 문을 한 줄로 간결하게 작성하여 딕셔너리를 생성할 수 있습니다.

```python
# 1부터 5까지의 숫자를 키로, 그 숫자의 제곱을 값으로 하는 딕셔너리
squares = {x: x**2 for x in range(1, 6)}
print(squares)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# 기존 딕셔너리를 기반으로 새로운 딕셔너리 만들기
person = {"name": "김철수", "age": 31, "job": "개발자"}
person_upper = {key.upper(): str(value).upper() for key, value in person.items()}
print(person_upper) # {'NAME': '김철수', 'AGE': '31', 'JOB': '개발자'}
```

딕셔너리는 데이터를 의미 있는 이름(키)과 연관 지어 저장하므로, 가독성을 높이고 데이터 관리를 용이하게 만들어주는 매우 강력하고 실용적인 자료형입니다.
