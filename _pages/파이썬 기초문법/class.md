---
title: 파이썬 클래스 (Class) - 심화편
layout: post
category: 파이썬 기초 문법
weight: 12
---

## 클래스(Class)란 무엇일까?

클래스는 객체 지향 프로그래밍(Object-Oriented Programming, OOP)의 핵심 개념으로, **객체를 만들어내기 위한 '설계도' 또는 '틀'**이라고 할 수 있습니다. 클래스는 관련된 데이터(속성, attribute)와 그 데이터를 처리하는 함수(메서드, method)를 하나로 묶어 관리합니다.

우리가 주변에서 보는 '자동차'를 예로 들어봅시다.
- 모든 자동차는 '색상', '모델명', '현재 속도'와 같은 **데이터(속성)**를 가집니다.
- 또한, '시동 걸기', '가속하기', '정지하기'와 같은 **행동(메서드)**을 할 수 있습니다.

여기서 '자동차'라는 개념 자체가 바로 **클래스**입니다. 그리고 이 설계도를 바탕으로 만들어진 '빨간색 소나타', '흰색 아반떼'와 같은 실제 자동차 하나하나가 바로 **객체(object)** 또는 **인스턴스(instance)**가 됩니다.

**클래스를 사용하는 이유:**
- **코드의 재사용성**: 하나의 클래스를 만들어두면, 필요할 때마다 여러 객체를 쉽게 생성하여 재사용할 수 있습니다.
- **코드의 구조화**: 관련된 데이터와 함수를 하나의 단위로 묶어주므로, 코드의 구조가 명확해지고 관리가 용이해집니다.
- **추상화**: 복잡한 내부 동작을 감추고, 사용자가 필요한 기능만 노출하여 프로그램을 더 쉽게 이해하고 사용할 수 있도록 합니다.

---

## 클래스의 기본 구조와 객체 생성

**기본 문법:**
```python
class 클래스이름:
    # 클래스 변수: 모든 인스턴스가 공유
    class_variable = "모든 인스턴스가 공유하는 값"

    # 초기화 메서드 (Initializer / Constructor)
    def __init__(self, 매개변수1, 매개변수2):
        # 인스턴스 변수: 각 인스턴스마다 독립적으로 저장
        self.instance_variable1 = 매개변수1
        self.instance_variable2 = 매개변수2

    # 인스턴스 메서드 (Instance Method)
    def instance_method(self):
        # self를 통해 인스턴스 변수에 접근
        print(f"인스턴스 변수: {self.instance_variable1}")
```
- **`__init__(self, ...)`**: 객체가 생성될 때 **가장 먼저 자동으로 호출**되는 특별한 메서드로, 객체의 초기 상태(인스턴스 변수)를 설정합니다.
- **`self`**: **생성된 인스턴스 자기 자신**을 가리키는 특별한 매개변수입니다. 모든 인스턴스 메서드의 첫 번째 매개변수로 `self`를 명시해야 합니다.

**객체 생성 및 사용:**
```python
# 클래스 정의
class Car:
    maker = "현대자동차" # 클래스 변수

    def __init__(self, model, color):
        self.model = model
        self.color = color
        self.speed = 0

    def accelerate(self, amount):
        self.speed += amount
        print(f"현재 속도: {self.speed}km/h")

# 객체(인스턴스) 생성
my_car = Car("소나타", "빨간색")

# 속성 접근 및 메서드 호출
print(my_car.model)       # 소나타
print(Car.maker)          # 현대자동차 (클래스 이름으로도 접근 가능)
my_car.accelerate(50)     # 현재 속도: 50km/h
```

---

## 스페셜 메서드 (Special/Dunder Methods)

파이썬 클래스에는 `__이름__`처럼 양쪽에 더블 언더스코어(Double Underscore, 줄여서 Dunder)가 붙은 특별한 메서드들이 있습니다. 이 메서드들은 우리가 직접 호출하기보다, 특정 상황에서 파이썬에 의해 자동으로 호출됩니다.

### `__str__(self)` 와 `__repr__(self)` (꿀팁!)

- **`__str__(self)`**: `print(객체)`나 `str(객체)`처럼, 객체를 **사용자가 보기 좋은 형태의 문자열**로 변환해야 할 때 호출됩니다.
- **`__repr__(self)`**: `객체`를 인터프리터에서 그대로 입력하거나, 디버깅할 때처럼 **객체를 명확하게 표현하는 공식적인 문자열**로 변환해야 할 때 호출됩니다. `eval(repr(객체))`를 실행하면 원래 객체와 동일한 객체를 만들 수 있도록 작성하는 것이 이상적입니다.

> **꿀팁**: `__repr__`은 개발자를 위해, `__str__`은 최종 사용자를 위해 구현한다고 생각하면 쉽습니다. `__str__`이 정의되지 않은 경우, 파이썬은 대신 `__repr__`을 호출합니다. 따라서 둘 다 정의하는 것이 가장 좋지만, 최소한 `__repr__`이라도 정의해두는 것이 디버깅에 매우 유리합니다.

**예제:**
```python
class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    def __str__(self):
        return f"『{self.title}』 (지은이: {self.author})"

    def __repr__(self):
        return f"Book(title='{self.title}', author='{self.author}')"

my_book = Book("어린 왕자", "생텍쥐페리")

print(my_book)         # __str__ 호출: 『어린 왕자』 (지은이: 생텍쥐페리)
print(str(my_book))    # __str__ 호출
print(repr(my_book))   # __repr__ 호출: Book(title='어린 왕자', author='생텍쥐페리')

# 리스트 안에 있을 때는 __repr__이 호출됨
books = [my_book]
print(books) # [Book(title='어린 왕자', author='생텍쥐페리')]
```

---

## 정적 메서드와 클래스 메서드 (Decorators)

메서드는 크게 인스턴스 메서드, 정적 메서드, 클래스 메서드로 나뉩니다. 데코레이터(`@`)를 사용하여 구분합니다.

### `@staticmethod`: 정적 메서드
- `self`나 `cls`를 받지 않으며, 인스턴스나 클래스의 상태와는 무관하게 동작하는 메서드입니다. 클래스에 소속되어 있지만, 사실상 일반 함수와 같습니다. 클래스와 관련된 유틸리티 함수를 만들 때 유용합니다.

### `@classmethod`: 클래스 메서드
- 첫 번째 인자로 인스턴스(`self`) 대신 **클래스 자체(`cls`)**를 받습니다. 인스턴스를 통하지 않고도 호출할 수 있으며, 클래스 변수를 다루거나, 클래스의 상태에 기반한 동작을 할 때 사용됩니다.

**꿀팁: 클래스 메서드를 팩토리(Factory)로 활용하기**
클래스 메서드는 객체를 생성하는 다양한 방법을 제공하는 '팩토리 메서드'로 자주 활용됩니다.

**예제:**
```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @staticmethod
    def is_adult(age):
        """나이가 성인인지 판단하는 유틸리티 함수"""
        return age >= 19

    @classmethod
    def create_from_birth_year(cls, name, birth_year):
        """출생 연도로부터 나이를 계산하여 Person 객체를 생성"""
        import datetime
        this_year = datetime.date.today().year
        age = this_year - birth_year
        return cls(name, age) # cls는 Person 클래스를 가리킴

# 정적 메서드 호출
print(f"25세는 성인인가? {Person.is_adult(25)}") # True

# 일반적인 방법으로 객체 생성
person1 = Person("홍길동", 30)

# 클래스 메서드(팩토리)를 이용한 객체 생성
person2 = Person.create_from_birth_year("임꺽정", 1995)

print(f"{person2.name}의 나이: {person2.age}세")
```

---

## `@property`: 속성을 메서드처럼 다루기 (꿀팁!)

`@property` 데코레이터를 사용하면, 메서드를 마치 인스턴스 변수처럼 `()` 없이 이름으로만 호출할 수 있게 만들어줍니다. 이는 외부에서 클래스의 속성에 직접 접근하는 것을 막고(정보 은닉), 속성 값을 가져오거나 설정할 때 특정 로직을 거치도록 하고 싶을 때 매우 유용합니다.

**예제: 온도를 섭씨(Celsius)로 저장하고, 화씨(Fahrenheit)로도 접근하기**
```python
class Temperature:
    def __init__(self, celsius):
        self._celsius = float(celsius) # 실제 값은 _celsius에 저장

    @property
    def celsius(self):
        """섭씨 온도를 반환 (Getter)"""
        return self._celsius

    @property
    def fahrenheit(self):
        """섭씨를 화씨로 변환하여 반환 (Getter)"""
        return (self._celsius * 9/5) + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        """화씨 값을 입력받아 섭씨로 변환하여 저장 (Setter)"""
        print("화씨 온도를 설정합니다.")
        self._celsius = (float(value) - 32) * 5/9

temp = Temperature(25)

# @property 덕분에 메서드지만 변수처럼 접근
print(f"섭씨: {temp.celsius}°C")         # 섭씨: 25.0°C
print(f"화씨: {temp.fahrenheit}°F")     # 화씨: 77.0°F

# @fahrenheit.setter 호출
temp.fahrenheit = 86 
# "화씨 온도를 설정합니다." 출력

# _celsius 값이 자동으로 변환되어 저장됨
print(f"새로운 섭씨: {temp.celsius}°C") # 새로운 섭씨: 30.0°C
print(f"새로운 화씨: {temp.fahrenheit}°F") # 새로운 화씨: 86.0°F
```

---

## 상속 (Inheritance)과 다형성

상속은 **부모 클래스의 속성과 메서드를 물려받아 자식 클래스를 만드는 것**입니다.

### 메서드 오버라이딩 (Method Overriding)
부모 클래스의 메서드를 자식 클래스에서 재정의하여, 자식 클래스에 특화된 동작을 구현합니다.

### `super()`
자식 클래스 안에서 부모 클래스의 메서드를 호출할 때 사용합니다.

```python
class Animal:
    def speak(self):
        return "동물이 웁니다."

class Dog(Animal):
    def speak(self): # 메서드 오버라이딩
        return "멍멍!"

class Cat(Animal):
    def speak(self): # 메서드 오버라이딩
        # super()로 부모 메서드 활용 가능
        parent_sound = super().speak() 
        return f"고양이가 '{parent_sound}' 대신 야옹!"

animals = [Dog(), Cat()]
for animal in animals:
    # 같은 animal.speak() 호출이지만, 인스턴스의 클래스에 따라 다른 결과가 나옴 (다형성)
    print(animal.speak()) 
# 멍멍!
# 고양이가 '동물이 웁니다.' 대신 야옹!
```
- **다형성(Polymorphism)**: 위 예제처럼, 같은 `speak()` 메서드를 호출했지만 어떤 객체(Dog, Cat)이냐에 따라 실제 동작이 달라지는 특성을 다형성이라고 합니다.

---

## 데이터 클래스 (`dataclasses`) (Python 3.7+ 꿀팁!)

데이터를 담는 것을 주 목적으로 하는 클래스를 작성할 때, `__init__`, `__repr__`, `__eq__`(동등성 비교) 등의 메서드를 자동으로 생성해주는 매우 유용한 기능입니다.

```python
from dataclasses import dataclass

@dataclass
class PersonData:
    name: str
    age: int
    city: str = "Unknown" # 기본값 지정 가능

# 위 코드는 아래의 긴 코드와 거의 동일하게 동작합니다.
# class Person:
#     def __init__(self, name, age, city="Unknown"):
#         self.name = name
#         self.age = age
#         self.city = city
#
#     def __repr__(self):
#         return f"Person(name='{self.name}', age={self.age}, city='{self.city}')"
#
#     def __eq__(self, other):
#         ...

p1 = PersonData("Alice", 30)
p2 = PersonData("Alice", 30)

print(p1)  # PersonData(name='Alice', age=30, city='Unknown') -> __repr__ 자동 생성
print(p1 == p2) # True -> __eq__ 자동 생성
```
> 데이터 구조를 표현하는 클래스를 만들 때는 `@dataclass`를 사용하면 코드가 극도로 간결해지고 생산성이 크게 향상됩니다.

클래스는 파이썬 프로그래밍을 한 단계 더 높은 수준으로 이끌어주는 강력한 도구입니다. 처음에는 개념이 다소 복잡하게 느껴질 수 있지만, 스페셜 메서드, 데코레이터, 데이터 클래스 등의 고급 기능을 익히면 코드의 품질과 효율성을 크게 향상시킬 수 있습니다.
