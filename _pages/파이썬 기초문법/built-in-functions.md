---
title: 파이썬 내장 함수 (Built-in Functions)
layout: post
category: 파이썬 기초 문법
weight: 11
---

## 내장 함수(Built-in Function)란?

내장 함수는 파이썬 인터프리터를 설치하면 **기본적으로 포함되어 있어 `import` 문 없이 언제든지 바로 사용할 수 있는 함수**들입니다. 프로그래밍 시 매우 빈번하게 사용되는 기본적인 기능들을 미리 구현해 놓은 것으로, 이를 잘 활용하면 코드 작성의 효율성과 가독성을 크게 높일 수 있습니다.

예를 들어, 화면에 값을 출력하는 `print()`, 객체의 길이를 구하는 `len()`, 데이터 타입을 변환하는 `int()`, `str()` 등이 모두 내장 함수입니다.

파이썬에는 약 70여 개의 내장 함수가 있으며, 여기서는 그중에서도 가장 중요하고 자주 사용되는 함수들을 기능별로 나누어 자세히 알아보겠습니다.

> 전체 내장 함수 목록은 [파이썬 공식 문서](https://docs.python.org/ko/3/library/functions.html)에서 확인할 수 있습니다.

---

## 1. 입출력 (Input/Output)

- **`print(*objects, sep=' ', end='
', file=sys.stdout, flush=False)`**
  - 주어진 객체(`objects`)를 화면(또는 파일)에 출력합니다.
  - `sep`: 여러 객체를 출력할 때 그사이에 들어갈 구분자를 지정합니다. (기본값: 공백)
  - `end`: 출력의 마지막에 추가될 문자를 지정합니다. (기본값: 줄바꿈 `
`)
  ```python
  print("Hello", "Python", "World")       # Hello Python World
  print("Hello", "Python", sep="-")         # Hello-Python
  print("첫째 줄", end=" / ")
  print("이어서 둘째 줄")                      # 첫째 줄 / 이어서 둘째 줄
  ```

- **`input([prompt])`**
  - 사용자로부터 한 줄의 문자열을 입력받습니다. 선택적으로 `prompt` 메시지를 화면에 보여줄 수 있습니다.
  - **주의**: `input()`으로 받은 값은 **항상 문자열(`str`)**이므로, 숫자로 사용하려면 `int()`나 `float()`으로 형 변환이 필요합니다.
  ```python
  name = input("이름을 입력하세요: ")
  print(f"안녕하세요, {name}님!")
  
  age_str = input("나이를 입력하세요: ")
  age = int(age_str) # 숫자로 변환
  print(f"내년에는 {age + 1}세가 되시는군요.")
  ```

---

## 2. 형 변환 (Type Conversion)

- **`int(x)`**, **`float(x)`**, **`str(x)`**, **`list(x)`**, **`tuple(x)`**, **`set(x)`**, **`dict(x)`**, **`bool(x)`**
  - 주어진 객체 `x`를 지정된 자료형으로 변환합니다.
  ```python
  print(int("123"))      # 123 (문자열 -> 정수)
  print(float("3.14"))   # 3.14 (문자열 -> 실수)
  print(str(100))        # '100' (숫자 -> 문자열)
  print(list("hello"))   # ['h', 'e', 'l', 'l', 'o'] (문자열 -> 리스트)
  print(set([1, 2, 2, 3])) # {1, 2, 3} (리스트 -> 집합, 중복 제거)
  print(bool(0))         # False (Truthiness 규칙에 따라)
  print(bool([1, 2]))    # True
  ```

---

## 3. 수학 연산 (Mathematical Operations)

- **`abs(x)`**: 숫자 `x`의 절댓값을 반환합니다.
- **`sum(iterable)`**: 리스트, 튜플 등 `iterable`의 모든 요소의 합계를 반환합니다.
- **`min(iterable)`**, **`max(iterable)`**: `iterable`의 최소/최대 값을 반환합니다.
- **`round(number, ndigits)`**: 숫자를 `ndigits` 소수점 자리까지 반올림합니다. `ndigits`를 생략하면 정수로 반올림.
- **`pow(base, exp)`**: `base`의 `exp` 거듭제곱을 반환합니다. (`base ** exp`와 동일)
- **`divmod(a, b)`**: `a`를 `b`로 나눈 몫과 나머지를 `(몫, 나머지)` 형태의 튜플로 반환합니다.
  ```python
  numbers = [1, 5, -2, 8, 3]
  print(f"abs(-10): {abs(-10)}")          # 10
  print(f"sum of numbers: {sum(numbers)}")  # 15
  print(f"min of numbers: {min(numbers)}")  # -2
  print(f"max of numbers: {max(numbers)}")  # 8
  print(f"round(3.14159, 2): {round(3.14159, 2)}") # 3.14
  print(f"divmod(10, 3): {divmod(10, 3)}") # (3, 1)
  ```

---

## 4. 시퀀스 처리 (Sequence Handling)

- **`len(s)`**: 시퀀스(리스트, 문자열, 튜플 등)의 길이(요소의 개수)를 반환합니다.
- **`range(start, stop, step)`**: 지정된 범위의 정수 시퀀스를 생성합니다. 반복문과 함께 매우 자주 사용됩니다.
- **`enumerate(iterable)`**: `iterable`을 순회하면서 (인덱스, 값) 형태의 튜플을 반환합니다. `for`문에서 인덱스가 필요할 때 유용합니다.
- **`zip(*iterables)`**: 여러 개의 `iterable`을 동일한 인덱스끼리 묶어 튜플로 반환합니다.
- **`sorted(iterable, reverse=False)`**: `iterable`의 요소를 정렬한 **새로운 리스트**를 반환합니다. `reverse=True`이면 내림차순. (리스트의 `sort()` 메서드는 원본을 바꾸지만, `sorted()`는 원본을 유지하고 새 리스트를 만듭니다.)
  ```python
  fruits = ["apple", "banana", "cherry"]
  print(f"len(fruits): {len(fruits)}") # 3

  for i, fruit in enumerate(fruits):
      print(f"Index {i}: {fruit}")
  # Index 0: apple
  # Index 1: banana
  # Index 2: cherry

  names = ["Alice", "Bob"]
  ages = [25, 30]
  for name, age in zip(names, ages):
      print(f"{name} is {age} years old.")
  # Alice is 25 years old.
  # Bob is 30 years old.

  nums = [3, 1, 4, 1, 5, 9]
  sorted_nums = sorted(nums)
  print(f"Original: {nums}, Sorted: {sorted_nums}")
  # Original: [3, 1, 4, 1, 5, 9], Sorted: [1, 1, 3, 4, 5, 9]
  ```

---

## 5. 객체 및 정보 확인

- **`type(object)`**: 객체의 자료형을 반환합니다.
- **`id(object)`**: 객체의 고유한 메모리 주소를 반환합니다. 두 변수가 같은 객체를 가리키는지 확인할 때 사용.
- **`isinstance(object, classinfo)`**: 객체가 특정 클래스(또는 튜플로 지정된 여러 클래스 중 하나)의 인스턴스인지 확인하여 `True`/`False`를 반환합니다. 상속 관계도 고려합니다.
- **`dir([object])`**: 객체가 가지고 있는 변수, 메서드 등의 속성 목록을 리스트로 반환합니다. 디버깅 시 유용.
- **`help([object])`**: 객체에 대한 도움말 정보(docstring 등)를 보여줍니다.
  ```python
  x = 10
  print(type(x))  # <class 'int'>
  print(id(x))    # (메모리 주소 출력)

  class Animal: pass
  class Dog(Animal): pass
  my_dog = Dog()
  print(isinstance(my_dog, Dog))    # True
  print(isinstance(my_dog, Animal)) # True (부모 클래스에도 해당)
  
  print(dir(x)) # 정수 객체가 가진 메서드 목록 출력
  help(len)   # len 함수에 대한 도움말 출력
  ```

---

## 6. 유용한 기타 함수 (꿀팁!)

- **`all(iterable)`**: `iterable`의 **모든 요소가 참(True)이면 `True`를 반환**합니다. 하나라도 거짓이면 `False`를 반환. (AND 조건)
- **`any(iterable)`**: `iterable`의 **요소 중 하나라도 참(True)이면 `True`를 반환**합니다. 모든 요소가 거짓일 때만 `False`를 반환. (OR 조건)

  ```python
  list1 = [True, 1, "hello"] # 모든 요소가 Truthy
  list2 = [True, 0, "hello"] # 0이 Falsy
  list3 = [False, 0, ""]     # 모든 요소가 Falsy

  print(f"all(list1): {all(list1)}") # True
  print(f"all(list2): {all(list2)}") # False

  print(f"any(list2): {any(list2)}") # True
  print(f"any(list3): {any(list3)}") # False
  ```
  > `all()`과 `any()`는 여러 개의 불리언 조건을 간결하게 검사할 때 매우 유용합니다. 예를 들어, 리스트 컴프리헨션과 결합하여 "모든 숫자가 10보다 큰가?" (`all(x > 10 for x in nums)`) 와 같은 코드를 쉽게 작성할 수 있습니다.

- **`map(function, iterable)`**: `iterable`의 각 요소에 `function`을 적용한 결과를 반환하는 `map` 객체를 만듭니다. 보통 `list()`와 함께 사용해 결과를 확인합니다.
- **`filter(function, iterable)`**: `iterable`의 각 요소에 `function`을 적용했을 때 결과가 `True`인 것들만 걸러서 반환하는 `filter` 객체를 만듭니다.

  ```python
  # map: 모든 숫자를 문자열로 변환하기
  numbers = [1, 2, 3, 4, 5]
  str_numbers = list(map(str, numbers))
  print(str_numbers) # ['1', '2', '3', '4', '5']

  # filter: 짝수만 걸러내기
  def is_even(n):
      return n % 2 == 0
  
  even_numbers = list(filter(is_even, numbers))
  print(even_numbers) # [2, 4]
  
  # filter와 lambda를 함께 사용하면 더 간결해짐
  odd_numbers = list(filter(lambda x: x % 2 != 0, numbers))
  print(odd_numbers) # [1, 3, 5]
  ```

파이썬 내장 함수들은 프로그래밍의 '기초 체력'과 같습니다. 어떤 기능들이 있는지 미리 알아두고, 필요할 때 적재적소에 활용하는 능력은 파이썬을 얼마나 효율적으로 사용하는지를 결정하는 중요한 척도입니다.
