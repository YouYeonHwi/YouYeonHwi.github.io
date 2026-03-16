---
title: 파이썬 API 활용 (API Usage)
layout: post
category: 파이썬 기초 문법
weight: 18
---

## API(Application Programming Interface)란 무엇일까?

**API(Application Programming Interface)**는 한 프로그램이 다른 프로그램이나 서비스의 데이터와 기능을 사용할 수 있도록 연결해 주는 **'창구' 또는 '약속'**입니다. 마치 식당에서 손님(클라이언트)이 메뉴판을 보고 웨이터(API)에게 주문을 하면, 주방(서버)에서 요리를 만들어 가져다주는 것과 같은 원리입니다.

파이썬은 풍부한 라이브러리를 통해 외부 데이터(날씨 정보, 주식 시세, SNS 데이터 등)를 가져오거나, 다른 서비스의 기능(번역, 인공지능 분석 등)을 연동하는 데 매우 강력한 도구입니다.

---

## 1. API 준비하기: `requests` 라이브러리

파이썬에서 API와 통신할 때 가장 널리 쓰이는 표준적인 라이브러리는 `requests`입니다. 사람이 읽기 쉽고 사용법이 매우 직관적입니다.

먼저 터미널에서 `requests` 라이브러리를 설치해야 합니다.
```bash
pip install requests
```

---

## 2. GET 요청: 데이터 가져오기

가장 기본적인 작업인 데이터를 요청하고 받아오는 `GET` 방식의 예시입니다. 무료로 제공되는 테스트용 API를 사용해 보겠습니다.

```python
import requests

# 1. API 주소 설정
url = "https://jsonplaceholder.typicode.com/posts/1"

# 2. GET 요청 보내기
response = requests.get(url)

# 3. 상태 코드 확인 (200은 성공)
if response.status_code == 200:
    print("성공적으로 데이터를 가져왔습니다!")
    # 데이터 출력
    data = response.json()
    print(f"제목: {data['title']}")
else:
    print(f"요청 실패. 상태 코드: {response.status_code}")
```

---

## 3. POST 요청: 데이터 전송하기

서버에 새로운 데이터를 생성하거나 보낼 때는 `POST` 요청을 사용합니다. `json` 파라미터를 사용하면 딕셔너리를 자동으로 JSON 형식으로 변환하여 보냅니다.

```python
new_data = {
    "title": "안녕 파이썬!",
    "body": "API 활용은 정말 재밌어요.",
    "userId": 1
}

response = requests.post("https://jsonplaceholder.typicode.com/posts", json=new_data)

if response.status_code == 201: # 201은 'Created'를 의미
    print("서버에 성공적으로 저장되었습니다!")
    print(response.json())
```

---

## 4. 응답 데이터 처리와 JSON

대부분의 현대적인 API는 데이터를 **JSON(JavaScript Object Notation)** 형식으로 주고받습니다. 파이썬의 `dict`와 구조가 매우 비슷하여 변환이 쉽습니다.

### 복잡한 JSON 데이터 파싱 (Advanced Parsing)
API 응답이 리스트 안에 딕셔너리가 있고, 그 안에 또 리스트가 있는 복잡한 구조일 때가 많습니다. 이때는 차근차근 키 값을 따라가면 됩니다.

```python
response = requests.get("https://jsonplaceholder.typicode.com/users")
users = response.json()

# 첫 번째 유저의 회사 이름 추출
company_name = users[0]['company']['name']
print(f"첫 번째 유저의 회사: {company_name}")

# 모든 유저의 이메일 리스트 만들기
emails = [user['email'] for user in users]
```

---

## 5. 인증(Authentication)과 보안

유료 API나 개인 정보를 다루는 API는 대부분 '열쇠'가 필요합니다. 주로 `headers`에 **API Key**나 **Bearer Token**을 담아 보냅니다.

```python
headers = {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json'
}

response = requests.get("https://api.example.com/private-data", headers=headers)
```

---

## 6. 세션(Session) 객체 활용하기 (꿀팁!)

동일한 서버에 여러 번 요청을 보낼 때는 `requests.Session()`을 사용하는 것이 훨씬 빠릅니다. 한 번 맺은 연결을 재사용하기 때문입니다.

```python
with requests.Session() as session:
    # 세션 수준에서 공통 헤더 설정 가능
    session.headers.update({'x-test': 'true'})
    
    response1 = session.get('https://httpbin.org/get')
    response2 = session.get('https://httpbin.org/ip')
```

---

## 7. 💡 API 활용 꿀팁과 실전 가이드

실제 개발에서 API를 다룰 때 꼭 알아두어야 할 핵심 팁입니다.

### 1. 쿼리 파라미터(Query Parameters) 사용하기
웹 주소 뒤에 `?key=value` 형태로 붙는 파라미터를 딕셔너리로 깔끔하게 전달할 수 있습니다.
```python
params = {'city': 'Seoul', 'units': 'metric', 'appid': 'your_api_key'}
response = requests.get("https://api.openweathermap.org/data/2.5/weather", params=params)
```

### 2. 타임아웃과 예외 처리 (강력 권장!)
네트워크 문제는 언제든 발생할 수 있습니다. `timeout`을 설정하고 예외 처리를 하는 습관을 들이세요.
```python
try:
    # 5초 안에 응답이 없으면 에러 발생
    response = requests.get(url, timeout=5)
    response.raise_for_status() # 4xx, 5xx 에러 발생 시 예외 발생
except requests.exceptions.Timeout:
    print("네트워크 지연으로 요청 시간이 초과되었습니다.")
except requests.exceptions.HTTPError as err:
    print(f"HTTP 에러 발생: {err}")
except Exception as e:
    print(f"알 수 없는 오류 발생: {e}")
```

### 3. API 키 보안 관리
API 키를 코드에 직접 적지 마세요. `.env` 파일이나 환경 변수를 사용해 보안을 지키는 것이 기본입니다.

---

이제 여러분도 파이썬을 이용해 세상의 다양한 데이터와 연결될 수 있습니다!
