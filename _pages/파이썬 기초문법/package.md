---
title: 파이썬 패키지 (Package)
layout: post
category: 파이썬 기초 문법
weight: 14
---

## 1. 패키지(Package)란 무엇일까?

프로젝트의 규모가 커지면 수많은 모듈 파일(`.py`)들이 생겨납니다. 이 모듈들을 단순히 한 디렉터리에 모두 모아두면 관리하기가 점점 어려워집니다. 이때 **관련 있는 모듈들을 하나의 디렉터리 구조로 묶어 관리**하는 방법이 바로 **패키지(Package)**입니다.

패키지는 '점(.)으로 구분된 모듈 이름'을 사용하여 모듈들을 계층적인 구조로 관리할 수 있게 해줍니다. 예를 들어, `sound.effects.echo`는 `sound`라는 패키지 안의 `effects`라는 하위 패키지(디렉터리)에 포함된 `echo` 모듈(파일)을 의미합니다.

**패키지를 사용하는 이유:**
- **모듈의 체계적인 관리**: 기능적으로 관련된 모듈들을 디렉터리별로 그룹화하여, 전체 프로젝트의 구조를 명확하게 파악하고 관리할 수 있습니다.
- **이름 충돌 방지**: 서로 다른 패키지 안에 동일한 이름의 모듈이 존재할 수 있습니다. 패키지 경로 전체가 고유 식별자 역할을 하므로 모듈 이름의 충돌을 방지할 수 있습니다. (예: `image.filter.grayscale`와 `audio.filter.equalizer`)
- **모듈 배포 및 공유**: 잘 만들어진 패키지는 다른 개발자들이 쉽게 설치하고 사용할 수 있는 형태로 배포될 수 있습니다. (예: PyPI를 통해 `pip`로 설치하는 라이브러리들)

---

## 2. 패키지의 구조와 생성

패키지는 단순히 디렉터리와 파이썬 파일(`.py`)로 구성됩니다. 파이썬 3.3 버전부터는 디렉터리 안에 `__init__.py` 파일이 있으면 해당 디렉터리를 패키지로 인식합니다. `__init__.py` 파일은 비어 있어도 되지만, 패키지의 초기화 코드를 담는 중요한 역할을 합니다.

**패키지 구조 예시:**
```
my_project/
├── main.py
└── my_package/
    ├── __init__.py
    ├── math/
    │   ├── __init__.py
    │   ├── arithmetic.py  # 덧셈, 뺄셈 모듈
    │   └── geometry.py    # 원, 사각형 넓이 계산 모듈
    └── string/
        ├── __init__.py
        └── utils.py       # 문자열 처리 모듈
```

위 구조에서 `my_package`가 최상위 패키지이며, `math`와 `string`은 `my_package`의 하위 패키지(서브 패키지)입니다.

**각 모듈 파일 내용 (예시):**

**`my_package/math/arithmetic.py`**
```python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b
```

**`my_package/math/geometry.py`**
```python
PI = 3.14

def circle_area(radius):
    return PI * radius * radius
```

**`my_package/string/utils.py`**
```python
def reverse_str(s):
    return s[::-1]
```

---

## 3. 패키지 사용하기: `import`

패키지 안의 모듈을 불러오는 방법은 모듈을 임포트할 때와 유사하지만, `.`을 사용하여 경로를 지정합니다.

**`main.py` 에서 패키지 사용하기:**
```python
# main.py

# 1. from 패키지.모듈 import 함수
# 가장 일반적이고 권장되는 방법
from my_package.math import arithmetic

result_add = arithmetic.add(10, 5)
print(f"덧셈 결과: {result_add}")

# 2. from 패키지.모듈 import 함수 as 별명
from my_package.math.geometry import circle_area as ca
print(f"반지름 5인 원의 넓이: {ca(5)}")

# 3. from 패키지.서브패키지 import 모듈
from my_package.string import utils
print(f"'hello'를 뒤집으면: {utils.reverse_str('hello')}")

# 4. import 패키지.서브패키지.모듈
# 모듈 전체를 임포트. 사용할 때는 전체 경로를 다 써줘야 함
import my_package.math.arithmetic
result_sub = my_package.math.arithmetic.subtract(10, 5)
print(f"뺄셈 결과: {result_sub}")

# 5. import 패키지.서브패키지.모듈 as 별명
import my_package.math.geometry as geo
print(f"원주율: {geo.PI}")
```
> **주의**: `import my_package.math` 처럼 중간 디렉터리까지만 임포트하면 `my_package.math.arithmetic` 과 같은 방식으로 바로 접근할 수 없습니다. 파이썬은 기본적으로 마지막 단계가 모듈 파일이 아닐 경우, 하위 모듈들을 자동으로 임포트하지 않기 때문입니다. (이는 `__init__.py`에서 제어할 수 있습니다.)

---

## 4. `__init__.py`의 역할과 활용 (꿀팁!)

`__init__.py` 파일은 여러 중요한 역할을 수행합니다.

**1. 디렉터리를 패키지로 인식시킴**
   - 이 파일이 있는 디렉터리는 파이썬 패키지의 일부임을 나타냅니다.

**2. 패키지 초기화 코드 실행**
   - 패키지가 처음 임포트될 때, `__init__.py` 안의 코드가 단 한 번 실행됩니다. 여기에 패키지 수준에서 필요한 초기 설정 코드를 넣을 수 있습니다.

**3. `__all__` 변수로 임포트 제어**
   - `from my_package import *` 와 같이 `*`를 사용해 임포트할 때, 어떤 모듈들을 외부에 노출할지 `__all__` 이라는 리스트 변수로 명시할 수 있습니다.
   
   **`my_package/math/__init__.py`**
   ```python
   # math 패키지를 임포트할 때, arithmetic과 geometry 모듈을 외부에 노출
   __all__ = ["arithmetic", "geometry"] 
   ```
   이렇게 설정하면 다른 파일에서 `from my_package.math import *` 를 실행했을 때 `arithmetic`과 `geometry` 모듈만 임포트됩니다.

**4. 하위 모듈/패키지를 더 쉽게 접근하도록 만들기**
   - `__init__.py`를 이용하면 긴 경로를 짧게 줄여 사용자의 편의성을 높일 수 있습니다.

   **`my_package/__init__.py`**
   ```python
   # my_package를 임포트할 때, 하위 모듈의 주요 함수를 바로 접근 가능하게 함
   from .math.arithmetic import add, subtract
   from .string.utils import reverse_str 
   ```
   > 여기서 `.`은 현재 패키지 디렉터리를 의미합니다.
   
   이렇게 `my_package`의 `__init__.py`를 설정해두면, `main.py`에서 다음과 같이 코드를 훨씬 간결하게 작성할 수 있습니다.

   **`main.py` (수정 후)**
   ```python
   import my_package

   # 원래는 my_package.math.arithmetic.add(10, 5) 처럼 써야 했음
   print(my_package.add(10, 5)) 

   # 원래는 my_package.string.utils.reverse_str('hello') 처럼 써야 했음
   print(my_package.reverse_str('hello'))
   ```
   많은 유명 라이브러리들이 `__init__.py`를 이런 방식으로 활용하여 사용자가 라이브러리의 핵심 기능에 쉽게 접근할 수 있도록 돕습니다.

---

## 5. 상대 경로와 절대 경로 임포트

패키지 내에서 다른 모듈을 임포트할 때, 경로를 지정하는 두 가지 방법이 있습니다.

- **절대 경로 (Absolute Path)**: `from my_package.math import geometry` 처럼, 프로젝트의 최상위 디렉터리부터 시작하는 전체 경로를 사용합니다. 코드가 명확하고 직관적이지만, 패키지 이름이 바뀌면 수정이 필요합니다.

- **상대 경로 (Relative Path)**: 현재 모듈의 위치를 기준으로 다른 모듈의 위치를 나타냅니다.
  - `.` : 현재 디렉터리
  - `..`: 부모 디렉터리

  **`my_package/math/geometry.py` 에서 `arithmetic.py` 임포트하기**
  ```python
  # geometry.py 와 arithmetic.py는 같은 디렉터리(math)에 있음
  from . import arithmetic # 방법 1
  from .arithmetic import add # 방법 2

  def some_function():
      return add(1, 2)
  ```
  **`my_package/string/utils.py` 에서 `geometry.py` 임포트하기**
  ```python
  # utils.py는 string에, geometry.py는 math에 있음. 부모(my_package)로 올라가야 함
  from ..math import geometry

  def another_function():
      return geometry.PI
  ```
  상대 경로는 패키지 내부 구조가 복잡할 때 경로 길이를 줄여주지만, 현재 파일의 위치를 항상 고려해야 하므로 헷갈릴 수 있습니다. 일반적으로는 구조 파악이 쉬운 **절대 경로 임포트가 더 권장**됩니다.

패키지는 단순한 모듈의 모음을 넘어, 파이썬 프로젝트의 전체적인 설계와 구조를 결정하는 중요한 요소입니다. 좋은 패키지 구조를 설계하는 능력은 대규모 프로젝트를 성공적으로 이끄는 핵심 역량 중 하나입니다.
