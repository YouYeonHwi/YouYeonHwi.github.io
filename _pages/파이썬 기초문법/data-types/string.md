---
title: 문자열 (String)
layout: post
---

## 문자열(str)이란?

문자열(`str`)은 텍스트 데이터를 표현하고 다루기 위한 자료형입니다. 파이썬에서는 작은따옴표(`' '`)나 큰따옴표(`" "`)로 텍스트를 감싸서 문자열을 만듭니다. 여러 줄에 걸친 문자열은 삼중 따옴표(`'''...'''` 또는 `"""..."""`)를 사용합니다.

```python
# 문자열 생성 방법
s1 = "Hello, Python!"
s2 = '파이썬은 재미있어요.'
s3 = """
이것은
여러 줄에 걸친
문자열입니다.
"""

print(s1)
print(s2)
print(s3)
```

## 문자열의 주요 특징: 불변성(Immutability)

문자열은 **불변(immutable)** 자료형입니다. 이는 한 번 생성된 문자열의 내용은 직접 수정할 수 없음을 의미합니다.

```python
text = "Python"
# text[0] = 'J'  # TypeError: 'str' object does not support item assignment
```

문자열을 수정하려면, 기존 문자열의 일부를 이용해 새로운 문자열을 만들어야 합니다.

```python
new_text = 'J' + text[1:]  # 'J'와 'ython'을 합쳐 새로운 문자열 생성
print(new_text)  # "Jython"
```

## 인덱싱과 슬라이싱

문자열은 리스트처럼 순서가 있는 시퀀스(sequence) 자료형이므로, 인덱싱과 슬라이싱을 통해 개별 문자에 접근하거나 부분 문자열을 추출할 수 있습니다.

### 1. 인덱싱 (Indexing)

```python
text = "Life is too short"
print(text[0])   # 'L' (첫 번째 문자)
print(text[5])   # 'i' (여섯 번째 문자)
print(text[-1])  # 't' (마지막 문자)
```

### 2. 슬라이싱 (Slicing)

`문자열[시작:끝:간격]` 형태로 사용합니다.

```python
text = "Life is too short"
print(text[0:4])   # 'Life' (인덱스 0부터 4 전까지)
print(text[8:])    # 'too short' (인덱스 8부터 끝까지)
print(text[:7])    # 'Life is' (처음부터 인덱스 7 전까지)
print(text[::2])   # 'Lf s to srt' (처음부터 끝까지 2칸 간격으로)
print(text[::-1])  # 'trohs oot si efiL' (문자열 뒤집기)
```

## 문자열 포매팅 (String Formatting)

문자열 안에 변수의 값을 삽입하는 방법입니다.

### 1. f-string (Python 3.6+ 에서 가장 권장)

문자열 앞에 `f`를 붙이고, 중괄호 `{}` 안에 변수나 표현식을 직접 넣습니다. 가독성이 좋고 사용이 간편합니다.

```python
name = "Alice"
age = 30
print(f"저의 이름은 {name}이고, 나이는 {age}세입니다.")
# 출력: 저의 이름은 Alice이고, 나이는 30세입니다.

# f-string 안에서 연산도 가능
print(f"내년에는 {age + 1}세가 됩니다.")
```

### 2. `format()` 메서드

문자열의 `{}` 플레이스홀더를 `format()` 메서드에 전달된 인자로 치환합니다.

```python
print("저의 이름은 {}이고, 나이는 {}세입니다.".format(name, age))

# 인덱스나 이름으로 순서 지정 가능
print("나이는 {1}세이고, 이름은 {0}입니다.".format(name, age))
print("저의 이름은 {n}이고, 나이는 {a}세입니다.".format(n=name, a=age))
```

## 자주 쓰는 문자열 메서드

- **`upper()` / `lower()`**: 모든 문자를 대문자/소문자로 변환한 **새로운** 문자열을 반환합니다.
- **`strip()` / `lstrip()` / `rstrip()`**: 양쪽/왼쪽/오른쪽의 특정 문자(기본값: 공백)를 제거한 새 문자열을 반환합니다.
- **`replace(old, new)`**: 문자열의 `old` 부분을 `new`로 바꾼 새 문자열을 반환합니다.
- **`split(sep)`**: 문자열을 `sep`(구분자) 기준으로 나누어 리스트로 반환합니다. `sep`을 생략하면 공백 기준.
- **`join(iterable)`**: `iterable`(리스트 등)의 각 요소들을 문자열을 구분자로 하여 합친 새 문자열을 반환합니다.
- **`count(sub)`**: 문자열에 `sub`가 몇 번 나타나는지 개수를 셉니다.
- **`find(sub)` / `index(sub)`**: `sub`가 처음 나타나는 위치의 인덱스를 반환합니다. `find`는 없으면 `-1`을, `index`는 없으면 `ValueError`를 발생시킵니다.
- **`startswith(prefix)` / `endswith(suffix)`**: 문자열이 `prefix`로 시작하는지 / `suffix`로 끝나는지 확인하여 `True`/`False`를 반환합니다.

### 메서드 활용 예제

```python
s = "  Hello, World!  "

# 공백 제거
print(s.strip()) # "Hello, World!"

# 대소문자 변환
print(s.upper()) # "  HELLO, WORLD!  "

# 문자열 치환
print(s.replace("World", "Python")) # "  Hello, Python!  "

# 분리와 결합
csv = "사과,바나나,딸기"
fruits = csv.split(',')
print(fruits) # ['사과', '바나나', '딸기']

separator = " | "
print(separator.join(fruits)) # "사과 | 바나나 | 딸기"

# 검색 및 확인
text = "I love Python, Python is great."
print(text.count("Python")) # 2
print(text.find("love"))    # 2
print(text.startswith("I love")) # True
```

문자열은 텍스트 기반 데이터를 처리하는 모든 작업의 기본이 됩니다. 다양한 메서드를 숙지하면 원하는 형태로 텍스트를 손쉽게 가공할 수 있습니다.
