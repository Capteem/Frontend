# Plog - 나만의 사진촬영 패키지를 만들어 보자
<img width="771" alt="SW캡스톤디자인_Capteem" src="https://github.com/Capteem/Frontend/assets/80399640/08f4c090-0b5c-472f-b4e4-52ce54e6b589">

## 0. 목차
1. [Plog 서비스 소개](#1-Plog-서비스-소개)
2. [Plog 핵심기능](#2-Plog-핵심기능)
3. [역할 분담](#3-역할-분담)
4. [기술 스택](#4-기술-스택)
5. [라이브러리](#5-라이브러리)
6. [프로젝트 폴더 구조](#6-프로젝트-폴더-구조)

## 1. Plog 서비스 소개
### Plog - 사진 촬영 서비스 통합 플랫폼
현재 사진 촬영을 원하는 사용자들은 사진작가, 스튜디오, 메이크업 아티스트 등 다양한 서비스 제공자와 개별적으로 연락하고 일정을 조율해야 하는 번거로움을 겪고 있다. 또한 각 서비스 제공자의 가격 정보를 직접 수집하고 비교해야 하는 어려움이 있다.

Plog는 이러한 문제를 해결하기 위해 <b>서비스 제공자가 자신의 일정을 먼저 공유하는 방식을 채택</b>하고, 서비스 제공자의 정보(위치, 포트폴리오, 가격 등)를 한 곳에서 확인할 수 있는 통합 솔루션을 제공한다. 이를 통해 사용자는 편리하게 사진 촬영 서비스를 예약하고 가격을 비교할 수 있다

## 2. Plog 핵심기능

1. 예약 기능
<img width="1052" alt="image" src="https://github.com/Capteem/Frontend/assets/114418850/95f085cf-7682-4fbb-88f2-2c40da562264">

- 날짜를 우선적으로 선택하면 그 날짜에 예약할 수 있는 서비스들이 뜬다.<br/>
- 지역을 먼저 선택하면 그 지역에서 이용할 수 있는 서비스들만 화면에 뜬다.<br/>
- 서비스를 먼저 선택하면 선택한 서비스를 이용할 수 있는 날짜만 선택할 수 있게 활성화가 되고 다른 서비스들도 선택한 것에 기반해 선별해서 화면에 뜬다.<br/>
<br/>

2. 서비스 등록
<img width="230" height="400" alt="image" src="https://github.com/Capteem/Frontend/assets/114418850/4fade5db-aa02-4622-a07d-dd33b8ced2ce">
<img width="230" height="400" alt="image" src="https://github.com/Capteem/Frontend/assets/114418850/a4d402be-22a2-4d1a-b0b4-66396212d311">
<img width="230" height="400" alt="image" src="https://github.com/Capteem/Frontend/assets/114418850/94c26700-bbbc-44b2-b7c8-97f517524563">

- 서비스 제공자로 활동하고 싶은 경우 서비스 등록을 할 수 있다.<br/>
- 스튜디오는 사업자 번호를 등록하면된다.<br/>
- 사진작가는 본인이 찍은 사진 10장, 헤어,메이크업은 자격증 사진을 등록하면된다.<br/>
- 관리자가 승인하면 서비스 제공자로 활동을 할 수 있다.<br/>

## 3. 역할 분담
|이나경|박서현|
|:---:|:---:|
|회원가입<br/>홈 페이지<br/>관리자 페이지<br/>사용자 페이지<br/>서비스제공자페이지<br/>Q&A|로그인<br/>예약 페이지<br/>리뷰 페이지<br/>장바구니<br/>서비스 정보 수정|

## 4. 기술 스택
<div>
  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> 
  <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> 
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 
  <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"/>
</div>
<div>
  <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
</div>

## 5. 라이브러리

- Redux
- react-daum-postcode
- react-modal
- react-bootstrap
- react-cookie
- date-fns
- react-datepicker
- react-router-dom
- react-icos

## 6. 프로젝트 폴더 구조
```
📦src
 ┣ 📂assets
 ┃ ┣ 📜Ploglogo.png
 ┃ ┣ 📜RegionList.js
 ┃ ┣ 📜addImg.png
 ┃ ┣ 📜home.jpg
 ┃ ┣ 📜kakao_login_large_narrow.png
 ┃ ┣ 📜kakao_login_large_wide.png
 ┃ ┣ 📜kakao_login_medium_narrow.png
 ┃ ┣ 📜kakaologo.png
 ┃ ┣ 📜select-image.png
 ┃ ┣ 📜shoppingBag.jpg
 ┃ ┗ 📜store.js
 ┣ 📂components
 ┃ ┣ 📂Nav
 ┃ ┃ ┣ 📜Admin_Nav.js
 ┃ ┃ ┣ 📜DropDown.js
 ┃ ┃ ┣ 📜Home_Nav.js
 ┃ ┃ ┣ 📜Small_Home_Nav.js
 ┃ ┃ ┗ 📜User_Nav.js
 ┃ ┗ 📂Reservations
 ┃ ┃ ┣ 📜Calendar.js
 ┃ ┃ ┣ 📜PortfolioEnd.js
 ┃ ┃ ┗ 📜RegionSelect.js
 ┣ 📂error
 ┃ ┗ 📜test.js
 ┣ 📂pages
 ┃ ┣ 📂Admin
 ┃ ┃ ┣ 📜ComplainManagement.js
 ┃ ┃ ┣ 📜ServiceManagement.js
 ┃ ┃ ┗ 📜UserManagement.js
 ┃ ┣ 📂Mypages
 ┃ ┃ ┣ 📂Serviceprovider
 ┃ ┃ ┃ ┣ 📜Review.js
 ┃ ┃ ┃ ┣ 📜ServiceDropdown.js
 ┃ ┃ ┃ ┣ 📜ServiceInfo copy.js
 ┃ ┃ ┃ ┣ 📜ServiceInfo.js
 ┃ ┃ ┃ ┣ 📜ServiceList.js
 ┃ ┃ ┃ ┗ 📜ViewScheduledInformation.js
 ┃ ┃ ┣ 📂User
 ┃ ┃ ┃ ┣ 📜ReviewList.js
 ┃ ┃ ┃ ┣ 📜UserInfo.js
 ┃ ┃ ┃ ┣ 📜ViewReservation.js
 ┃ ┃ ┃ ┗ 📜WriteReview.js
 ┃ ┃ ┗ 📜ShoppingBag.js
 ┃ ┣ 📂Q&A
 ┃ ┃ ┣ 📜Answer.js
 ┃ ┃ ┗ 📜Question.js
 ┃ ┣ 📂Reservation
 ┃ ┃ ┣ 📜Payment.js
 ┃ ┃ ┗ 📜Reservation.js
 ┃ ┣ 📂ServiceRegistration
 ┃ ┃ ┣ 📜ServiceRegistration.js
 ┃ ┃ ┗ 📜ServiceRegistrationList.js
 ┃ ┣ 📜FindId.js
 ┃ ┣ 📜FindPassword.js
 ┃ ┣ 📜Gallery.js
 ┃ ┣ 📜Home.js
 ┃ ┣ 📜KaKaoAuthHandler.js
 ┃ ┣ 📜SignIn.js
 ┃ ┗ 📜SignUp.js
 ┣ 📂styles
 ┃ ┣ 📜Calendar.css
 ┃ ┣ 📜Dropdown.css
 ┃ ┣ 📜ImageGallery.css
 ┃ ┣ 📜Nav.css
 ┃ ┣ 📜Table.css
 ┃ ┣ 📜multi.css
 ┃ ┣ 📜reserve.css
 ┃ ┣ 📜review.css
 ┃ ┣ 📜serviceInfo.css
 ┃ ┣ 📜shoppingBag.css
 ┃ ┗ 📜smallModal.css
 ┣ 📜App.css
 ┣ 📜App.js
 ┣ 📜index.css
 ┗ 📜index.js
```
