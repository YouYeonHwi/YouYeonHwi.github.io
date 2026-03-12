---
title: 문자열
layout: post
---

문자열(`str`)은 텍스트 데이터를 다루는 자료형입니다.

## 핵심 포인트

- 작은따옴표 `' '` 또는 큰따옴표 `" "`로 표현
- 인덱싱, 슬라이싱 가능
- 불변(immutable) 자료형

## 예제

```python
text = "Python"
print(text[0])      # P
print(text[-1])     # n
print(text[1:4])    # yth
```

## 자주 쓰는 메서드

```python
msg = " hello, python "
print(msg.strip())          # 양쪽 공백 제거
print(msg.upper())          # 대문자 변환
print(msg.replace("python", "world"))
print("-".join(["2026", "03", "12"]))
```
