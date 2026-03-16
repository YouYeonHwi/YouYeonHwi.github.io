---
title: 파이썬 라이브러리 (Library)
layout: post
category: 파이썬 기초 문법
weight: 15
---

## 1. 라이브러리(Library)란 무엇일까?

라이브러리는 **특정 기능과 관련된 모듈(module)과 패키지(package)의 집합**입니다. 마치 도서관(library)에 가면 다양한 주제의 책들이 정리되어 있어 필요할 때 찾아볼 수 있듯이, 파이썬 라이브러리는 프로그래밍에 필요한 수많은 기능들을 미리 만들어 제공함으로써 개발자가 모든 것을 처음부터 만들지 않아도 되게 해줍니다.

파이썬의 가장 큰 강점 중 하나는 바로 이 **"풍부하고 강력한 라이브러리 생태계"**입니다. 데이터 분석, 웹 개발, 머신러닝, 게임 제작 등 거의 모든 분야에 걸쳐 상상할 수 있는 대부분의 기능들이 이미 라이브러리로 구현되어 있습니다.

파이썬 라이브러리는 크게 **표준 라이브러리**와 **외부 라이브러리(서드파티 라이브러리)**로 나눌 수 있습니다.

---

## 1. 표준 라이브러리 (Standard Library)

**표준 라이브러리**는 파이썬을 설치할 때 **기본적으로 함께 설치되는 라이브러리**입니다. 따라서 별도의 설치 과정 없이 `import` 문만으로 바로 불러와 사용할 수 있습니다. 파이썬의 '기본 구성품'이라고 할 수 있으며, 모든 파이썬 환경에서 안정적으로 동작함이 보장됩니다.

### 자주 사용되는 표준 라이브러리 모듈 예시

- **`math`**: 수학 계산에 필요한 함수와 상수들을 제공합니다. (예: `math.sqrt()`-제곱근, `math.pi`-원주율)
  ```python
  import math
  
  # 원의 넓이 계산
  radius = 5
  area = math.pi * (radius ** 2)
  print(f"반지름이 {radius}인 원의 넓이: {area}")
  
  # 제곱근 계산
  print(f"16의 제곱근: {math.sqrt(16)}")
  ```

- **`random`**: 난수(random number) 생성과 관련된 함수들을 제공합니다. (예: `random.random()`-0과 1사이의 임의의 실수, `random.randint(a, b)`-a와 b사이의 임의의 정수, `random.choice(seq)`-시퀀스에서 임의의 요소 선택)
  ```python
  import random
  
  # 1부터 6까지의 임의의 정수 (주사위 던지기)
  dice_roll = random.randint(1, 6)
  print(f"주사위를 던져 나온 수: {dice_roll}")
  
  # 리스트에서 임의의 메뉴 선택
  menus = ["짜장면", "피자", "치킨"]
  today_menu = random.choice(menus)
  print(f"오늘의 점심 메뉴: {today_menu}")
  ```

- **`datetime`**: 날짜와 시간을 다루기 위한 클래스와 함수들을 제공합니다. (예: `datetime.now()`-현재 날짜/시간, `timedelta`-시간 간격 계산)
  ```python
  from datetime import datetime, timedelta
  
  now = datetime.now()
  print(f"현재 시간: {now}")
  
  # 100일 후의 날짜 계산
  after_100_days = now + timedelta(days=100)
  print(f"100일 후: {after_100_days.strftime('%Y년 %m월 %d일')}")
  ```

- **`os`**: 운영체제(Operating System)와 상호작용하기 위한 함수들을 제공합니다. 파일 시스템 관리(디렉터리 생성, 파일 경로 확인 등)에 주로 사용됩니다. (예: `os.getcwd()`-현재 작업 디렉터리, `os.path.join()`-경로 합치기)
  ```python
  import os
  
  current_directory = os.getcwd()
  print(f"현재 작업 디렉터리: {current_directory}")
  
  # 운영체제에 맞는 경로 구분자로 파일 경로 생성
  file_path = os.path.join(current_directory, "data", "my_file.txt")
  print(f"생성된 파일 경로: {file_path}")
  ```
- **`json`**: JSON(JavaScript Object Notation) 형식의 데이터를 파싱하고 생성하는 함수들을 제공합니다. 웹 API 통신 등에서 데이터를 교환하는 표준 형식으로 널리 쓰입니다.
  ```python
  import json

  # 파이썬 딕셔너리
  person = {"name": "Alice", "age": 30, "city": "Seoul"}

  # 딕셔너리를 JSON 문자열로 변환 (직렬화)
  json_string = json.dumps(person, ensure_ascii=False, indent=4)
  print("--- JSON 문자열 ---")
  print(json_string)

  # JSON 문자열을 다시 파이썬 딕셔너리로 변환 (역직렬화)
  parsed_dict = json.loads(json_string)
  print("
--- 파이썬 딕셔너리 ---")
  print(parsed_dict)
  ```

---

## 2. 외부 라이브러리 (Third-Party Library)

**외부 라이브러리**는 파이썬 표준 라이브러리에 포함되지 않아 **별도의 설치가 필요한 라이브러리**입니다. 전 세계의 수많은 개발자들이 만들어 공유한 것으로, 특정 분야에 특화된 강력한 기능들을 제공합니다.

### 패키지 관리자 `pip`

외부 라이브러리는 **`pip`**라는 파이썬의 공식 패키지 관리 도구를 통해 쉽게 설치하고 관리할 수 있습니다. `pip`는 보통 파이썬 설치 시 함께 설치됩니다.

**터미널 또는 명령 프롬프트(cmd)에서 사용하는 `pip` 명령어:**
- **라이브러리 설치**: `pip install 라이브러리이름`
- **특정 버전으로 설치**: `pip install 라이브러리이름==버전` (예: `pip install requests==2.25.0`)
- **라이브러리 삭제**: `pip uninstall 라이브러리이름`
- **설치된 라이브러리 목록 확인**: `pip list`
- **라이브러리 업그레이드**: `pip install --upgrade 라이브러리이름`

### 대표적인 외부 라이브러리 예시

- **`Requests`**: HTTP 통신을 위한 라이브러리. 웹 페이지 정보를 가져오거나 API를 호출할 때 매우 편리하고 직관적인 방법을 제공하여 사실상의 표준으로 쓰입니다.
  ```python
  # pip install requests 먼저 실행 필요
  import requests

  response = requests.get("https://api.github.com")
  print(f"상태 코드: {response.status_code}") # 200 이면 성공
  print(response.json()) # 응답을 JSON 형식으로 파싱
  ```

- **`NumPy`**: 수치 계산, 특히 대규모 다차원 배열과 행렬 연산을 위한 핵심 라이브러리입니다. 데이터 과학과 머신러닝 분야의 기반이 됩니다.
  ```python
  # pip install numpy 먼저 실행 필요
  import numpy as np

  # 파이썬 리스트
  my_list = [1, 2, 3, 4, 5]
  
  # NumPy 배열로 변환
  my_array = np.array(my_list)
  
  print(f"배열의 평균: {my_array.mean()}")
  print(f"배열의 표준편차: {my_array.std()}")
  ```

- **`Pandas`**: 데이터 분석 및 조작을 위한 라이브러리. `DataFrame`이라는 표 형태의 자료구조를 제공하여, 엑셀이나 데이터베이스 테이블처럼 데이터를 쉽게 다룰 수 있게 해줍니다.
  ```python
  # pip install pandas 먼저 실행 필요
  import pandas as pd

  data = {'Name': ['Alice', 'Bob', 'Charlie'],
          'Age': [25, 30, 35],
          'City': ['Seoul', 'Busan', 'Incheon']}
  
  df = pd.DataFrame(data)
  print(df)

  # 'Age'가 30 이상인 데이터만 필터링
  print("
--- 30세 이상 ---")
  print(df[df['Age'] >= 30])
  ```

- **`BeautifulSoup4` & `Scrapy`**: 웹 스크레이핑(크롤링) 라이브러리. HTML 및 XML 파일에서 원하는 데이터를 손쉽게 추출할 수 있게 돕습니다.
- **`Flask` & `Django`**: 웹 프레임워크. 웹 사이트나 웹 API 서버를 개발할 때 필요한 다양한 기능(라우팅, 템플릿, 데이터베이스 연동 등)을 제공합니다.
- **`TensorFlow` & `PyTorch`**: 머신러닝 및 딥러닝 프레임워크. 복잡한 신경망 모델을 구축하고 학습시키는 데 사용됩니다.

파이썬의 진정한 힘은 이 방대한 라이브러리 생태계에 있습니다. 내가 만들려는 기능이 이미 훌륭한 라이브러리로 구현되어 있을 확률이 매우 높습니다. 따라서 "바퀴를 재발명"하기보다는, 필요한 라이브러리를 찾아서 효율적으로 활용하는 능력이 매우 중요합니다.
