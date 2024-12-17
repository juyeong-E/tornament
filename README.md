# 품질관리 시스템 (프론트)

## 🖥 소개

-   품질관리 서비스를 제공
-   ERP로 관리하던 일을 웹으로 이전.

## 개발 환경

-   언어 : Javascript
-   프레임워크 : React, Next
-   NodeJs 버전 : 18.17.0
-   ReactJs 버전 : 18.1.0
-   NextJs 버전 : 13.5.6

## 주요 라이브러리

-   상태(state)관리 라이브러리 : Redux, Redux-saga. immer
    (Redux Store를 통해 상태 정보를 저장. Reducer를 사용하여 상태반환)
-   서버사이드 환경에서 리덕스 스토어에 접근하기 위해서는 "next", "next-redux-wrapper" 라이브 없이 불가능.
-   스타일 라이브러리 : styled-components , Mui 라이브러리 - 5.16.7ver (https://mui.com/), (https://v5.mui.com/material-ui/getting-started/installation/?_gl=1*712a51*_gcl_au*MTUzNTAxODQ3MS4xNzMxNTU5MDc4*_ga*MjQ5MDc5MjI1LjE3MjcxNjE0MzM.*_ga_5NXDQLC2ZK*MTczMzQ1MTI1OS4xNy4xLjE3MzM0NTEzMTkuNjAuMC4w)
-   Table Grid : AG Grid(https://www.ag-grid.com/)

## API 통신

-   REST API : GET, POST, PUT, DELETE
-   Swagger API 활용
    : 개발 테스트 시 백엔드 프로젝트 설치 후 확인.
    예) http://localhost:8080/swagger-ui/index.html 이런식 호출.
-   정의서 및 API 정보 : https://bodyfriend.atlassian.net/wiki/spaces/amZK2rP1E3sz/pages/424903034/API

## 서버 아키텍처

-   프론트 엔드 : 페이지 라우트 방식. 인증은 JWT(Json Web Token) 같은 인증 정보를 쿠키에 저장하여 관리하는 구조를 따릅니다.
-   로그인 요청: 사용자가 통합 로그인 사이트로 이동하여 로그인 요청을 합니다.
-   로그인 완료 및 쿠키 발급: 로그인 성공 시, JWT를 포함한 쿠키를 클라이언트(브라우저)에 발급합니다.
    이 쿠키는 사용자의 인증 정보를 담고 있으며, 일반적으로 HttpOnly 속성으로 설정해 클라이언트 쪽 스크립트에서 접근하지 못하도록 보호합니다.
    쿠키 자동 전송: 브라우저는 동일한 도메인에서 요청할 때 자동으로 쿠키를 서버에 전송합니다. 이 쿠키에는 로그인 시 받은 인증 정보(세션 ID 또는 JWT)가 포함되어 있습니다.
    백엔드 : JWT를 디코딩하여 서명(Signature)을 검증한 후, 페이로드에 담긴 유효 기간 및 사용자 정보를 확인. 세션 또는 JWT가 유효하다면, 사용자 요청은 정상적으로 처리되며, 로그인된 상태로 접근가능.

-   정리.
    로그인 시 토큰 발급하여 쿠키 저장.
    페이지 렌더링 시, Next.js 서버사이드에서 요청이 발생할 때마다 쿠키 여부 체크.
    API 호출 마다 백엔드에서 JWT 토큰 체크하여 데이터 전달.
    인증 만료 및 토큰이 틀릴 경우 로그아웃 처리.

-   쿠키 확인: 브라우저 개발자 도구(Chrome의 경우 F12 → Application → Cookies)에서 로그인 후 설정된 쿠키를 확인할 수 있습니다. 발급된 세션 ID나 JWT가 쿠키에 저장되어 있는지, HttpOnly, Secure 속성들이 설정되었는지 확인

-   쿠키 보안 고려사항
    HttpOnly: 쿠키에 HttpOnly 옵션을 설정하여 클라이언트 측에서 자바스크립트를 통해 쿠키에 접근할 수 없도록 합니다.
    Secure: Secure 옵션을 통해 HTTPS 통신에서만 쿠키가 전송되도록 보안 강화.
    CORS 및 SameSite: 쿠키 전송 시 도메인 간 인증을 위한 CORS 정책과 SameSite 속성 설정을 통해 CSRF 공격을 방지합니다.

## 배포 및 환경설정

-   .env 파일 관리 형식

## 디버깅 라이브러리

-   디버깅 라이브러리 : redux-devtools-extension

## 프로젝트 세팅 정보

-   지라 컨플루언스 : https://bodyfriend.atlassian.net/wiki/spaces/amZK2rP1E3sz/overview?homepageId=425001224

## 🍕 소스 관리

-   https://github.com/bf-sw/quality-front

## 🚢 배포

### 운영

-

### 개발

-
# tornament
