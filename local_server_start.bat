@echo off
cd /d "%~dp0"

echo Jekyll 로컬 서버를 가동합니다...
bundle exec jekyll serve --host 127.0.0.1 --trace --livereload
if %errorlevel% neq 0 (
    echo.
    echo [오류] Jekyll 실행에 실패했습니다. Ruby와 Bundler가 설치되어 있는지 확인해주세요.
    pause
)