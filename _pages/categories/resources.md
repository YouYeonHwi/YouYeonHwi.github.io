---
title: 리소스 모음
layout: post
permalink: /categories/resources/
---

유용한 자료 모음.

{% if site.categories['resources'] %}
{% for post in site.categories['resources'] %}
- [{{ post.title }}]({{ post.url }})
{% endfor %}
{% else %}
아직 게시글이 없습니다.
{% endif %}
