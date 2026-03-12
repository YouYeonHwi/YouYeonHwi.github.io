---
title: 파이썬 예외 처리 (Exception Handling)
layout: post
---

## 예외(Exception)란 무엇일까?

프로그램을 실행하는 도중 예기치 않은 문제가 발생하여 더 이상 진행할 수 없을 때, 파이썬은 이를 **'예외(Exception)'**라고 알리며 프로그램을 중단시킵니다. 예를 들어, 0으로 숫자를 나누려고 하거나, 존재하지 않는 파일을 열려고 하거나, 리스트의 범위를 벗어난 인덱스에 접근하려 할 때 예외가 발생합니다.

**예외 처리(Exception Handling)**란, 이처럼 예외가 발생했을 때 프로그램이 비정상적으로 종료되는 것을 막고, **문제를 파악하고 적절하게 대응하여 프로그램을 계속 진행할 수 있도록 처리하는 과정**을 말합니다.

**예외 처리를 하는 이유:**
- **프로그램의 안정성**: 예기치 않은 오류가 발생해도 프로그램이 갑자기 멈추는 것을 방지하여 안정성을 높입니다.
- **오류 추적 및 디버깅**: 오류가 발생한 지점과 원인을 명확하게 파악하여 디버깅을 용이하게 합니다.
- **사용자 경험 향상**: 사용자에게 친절한 오류 메시지를 보여주거나, 대체 경로를 안내하는 등 더 나은 사용자 경험을 제공할 수 있습니다.

---

## `try...except`: 가장 기본적인 예외 처리 구문

`try...except` 블록은 예외 처리를 위한 가장 기본적인 구조입니다.
- **`try` 블록**: 예외가 발생할 가능성이 있는 코드를 이 블록 안에 넣습니다.
- **`except` 블록**: `try` 블록 안에서 예외가 발생했을 때 실행할 코드를 이 블록 안에 넣습니다. `try` 블록에서 예외가 발생하지 않으면 `except` 블록은 실행되지 않습니다.

**기본 구조:**
```python
try:
    # 예외 발생 가능성이 있는 코드
    ...
except 예외종류:
    # 지정된 '예외종류'의 예외가 발생했을 때 실행될 코드
    ...
```

**예제 1: `ZeroDivisionError` 처리**
```python
try:
    numerator = 10
    denominator = 0
    result = numerator / denominator # 0으로 나누려고 시도
    print(result)
except ZeroDivisionError:
    print("오류: 0으로 나눌 수 없습니다.")

print("프로그램이 정상적으로 계속 진행됩니다.")
# 출력:
# 오류: 0으로 나눌 수 없습니다.
# 프로그램이 정상적으로 계속 진행됩니다.
```
> `try` 블록에서 `ZeroDivisionError`가 발생하자마자, 파이썬은 즉시 `except ZeroDivisionError` 블록으로 이동하여 해당 코드를 실행합니다. 덕분에 프로그램이 멈추지 않고 끝까지 실행될 수 있습니다.

**예제 2: `ValueError` 처리**
```python
try:
    user_input = input("숫자를 입력하세요: ")
    number = int(user_input) # 숫자가 아닌 값을 입력하면 ValueError 발생
    print(f"입력한 숫자의 두 배는 {number * 2}입니다.")
except ValueError:
    print("오류: 유효한 숫자를 입력해주세요.")
```

---

## 다양한 예외 처리 방법

### 여러 종류의 예외를 한 번에 처리하기

하나의 `try` 블록에서 여러 다른 종류의 예외가 발생할 수 있습니다. 이들을 한 번에 묶어서 처리하려면 `except`에 튜플로 예외들을 묶어줍니다.

```python
my_list = [1, 2, 3]

try:
    index = int(input("접근할 인덱스를 입력하세요: "))
    print(my_list[index] / index)
except (ValueError, IndexError):
    # ValueError (숫자 아닌 값 입력) 또는 IndexError (범위 밖 인덱스)를 함께 처리
    print("오류: 잘못된 인덱스를 입력했거나, 숫자가 아닙니다.")
except ZeroDivisionError:
    print("오류: 0번 인덱스로는 나눌 수 없습니다.")
```

### 예외 객체 정보 얻기 (꿀팁!)

`except 예외종류 as 변수:` 형태로 작성하면, 발생한 예외 객체 자체를 변수에 담아 더 자세한 오류 정보를 확인할 수 있습니다.

```python
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"오류가 발생했습니다: {e}") # 오류 메시지 직접 출력
    # 출력: 오류가 발생했습니다: division by zero
```

### `except`만 사용하기 (주의!)

`except:` 처럼 예외 종류를 명시하지 않으면 **모든 종류의 예외**를 다 잡습니다. 편리해 보일 수 있지만, 이는 매우 위험한 습관입니다.

> **꿀팁 (매우 중요)**: **절대로 `except:`만 단독으로 사용하지 마세요!** 이를 'bare except'라고 부르며, 심각한 문제를 야기할 수 있습니다.
> - **버그 은폐**: 개발자가 예상치 못한 심각한 버그(`NameError`, `TypeError` 등)까지 모두 숨겨버려 디버깅을 극도로 어렵게 만듭니다.
> - **프로그램 종료 방해**: 사용자가 `Ctrl+C`로 프로그램을 강제 종료할 때 발생하는 `KeyboardInterrupt` 예외까지 잡아버려, 프로그램을 끌 수도 없는 상황이 발생할 수 있습니다.
>
> 모든 예외를 잡고 싶다면, 최소한 `except Exception as e:` 처럼 `Exception` 클래스를 명시하여 `SystemExit`나 `KeyboardInterrupt` 같은 시스템 종료 관련 예외는 잡지 않도록 해야 합니다.

---

## `else` 와 `finally`: 예외 처리의 완성

### `else` 블록
- `try` 블록에서 **예외가 발생하지 않았을 때만** 실행됩니다.
- `try` 블록에는 예외가 발생할 가능성이 있는 최소한의 코드만 남기고, 나머지 정상 실행 코드를 `else` 블록으로 옮기면 코드의 가독성이 좋아집니다.

### `finally` 블록
- 예외 발생 **여부와 상관없이 항상, 반드시** 실행됩니다.
- 주로 파일을 닫거나(`f.close()`), 네트워크 연결을 해제하는 등 **중요한 마무리(clean-up) 작업**을 할 때 사용됩니다.

**구조 및 실행 순서:**
```python
try:
    # 1. 코드 실행 시도
    ...
except:
    # 2. (예외 발생 시) 예외 처리
    ...
else:
    # 3. (예외 미발생 시) 이어서 실행
    ...
finally:
    # 4. (예외 발생 여부와 관계없이) 항상 마지막에 실행
    ...
```

**예제:**
```python
try:
    file = open("nonexistent_file.txt", "r") # FileNotFoundError 발생
    content = file.read()
except FileNotFoundError:
    print("파일을 찾을 수 없습니다.")
else:
    print("--- 파일 내용 ---")
    print(content)
finally:
    # file 변수가 성공적으로 생성되었을 때만 close() 호출
    if 'file' in locals() and not file.closed:
        file.close()
        print("파일 객체를 닫았습니다.")
    print("프로그램을 종료합니다.")
```
> 위 예제에서 `FileNotFoundError`가 발생하므로 `except` 블록과 `finally` 블록만 실행됩니다. 만약 파일이 존재했다면 `else` 블록과 `finally` 블록이 실행되었을 것입니다.

---

## 예외 발생시키기: `raise`

파이썬이 자동으로 발생시키는 예외 외에도, 프로그래머가 **특정 조건에서 의도적으로 예외를 발생**시켜야 할 때가 있습니다. 이때 `raise` 키워드를 사용합니다.

```python
def set_age(age):
    if age < 0:
        # 유효하지 않은 나이 값에 대해 ValueError를 의도적으로 발생시킴
        raise ValueError("나이는 음수일 수 없습니다.")
    print(f"나이가 {age}세로 설정되었습니다.")

try:
    set_age(25)  # 정상 실행
    set_age(-5)  # 여기서 ValueError 발생
except ValueError as e:
    print(f"나이 설정 중 오류: {e}")
```

---

## 사용자 정의 예외 (Custom Exceptions)

때로는 파이썬이 제공하는 기본 예외만으로는 부족하여, **자신만의 애플리케이션에 특화된 예외**를 만들고 싶을 때가 있습니다. 이럴 때는 파이썬의 `Exception` 클래스를 상속받아 새로운 예외 클래스를 만들 수 있습니다.

**꿀팁:** 사용자 정의 예외를 만들면, 오류의 원인을 훨씬 더 명확하고 의미론적으로 표현할 수 있습니다. 예를 들어, `ValueError` 대신 `InvalidNicknameError`라고 하면 "닉네임 규칙에 맞지 않아 발생한 오류"임을 바로 알 수 있습니다.

```python
# Exception 클래스를 상속받아 새로운 예외를 정의
class InvalidNicknameError(Exception):
    pass # 별도의 로직은 필요 없음

def set_nickname(nickname):
    if len(nickname) < 2 or len(nickname) > 8:
        raise InvalidNicknameError("닉네임은 2자 이상 8자 이하로 만들어주세요.")
    print(f"'{nickname}' 닉네임이 설정되었습니다.")

try:
    set_nickname("ValidNick")
    set_nickname("A")
except InvalidNicknameError as e:
    print(f"닉네임 생성 오류: {e}")
```

예외 처리는 단순히 오류를 숨기는 것이 아니라, **오류를 예상하고 통제하여 프로그램의 견고함을 높이는** 중요한 프로그래밍 기술입니다. `try...except`의 기본부터 `finally`, `raise`, 사용자 정의 예외까지 잘 익혀두면, 어떤 상황에서도 안정적으로 동작하는 신뢰도 높은 코드를 작성할 수 있습니다.
