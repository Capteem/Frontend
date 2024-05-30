# Plog - 나만의 사진촬영 패키지를 만들어 보자
<img width="771" alt="SW캡스톤디자인_Capteem" src="https://github.com/Capteem/Frontend/assets/80399640/08f4c090-0b5c-472f-b4e4-52ce54e6b589">

## Plog 핵심기능

1. 예약 기능
<img width="1052" alt="image" src="https://github.com/Capteem/Frontend/assets/114418850/95f085cf-7682-4fbb-88f2-2c40da562264">
- 날짜를 우선적으로 선택하면 그 날짜에 예약할 수 있는 서비스들이 뜬다.
- 지역을 먼저 선택하면 그 지역에서 이용할 수 있는 서비스들만 화면에 뜬다.
- 서비스를 먼저 선택하면 선택한 서비스를 이용할 수 있는 날짜만 선택할 수 있게 활성화가 되고 다른 서비스들도 선택한 것에 기반해 선별해서 화면에 뜬다.

2. 서비스 등록
<img width="230" height="400" alt="image" src="https://github.com/Capteem/Frontend/assets/114418850/4fade5db-aa02-4622-a07d-dd33b8ced2ce">
<img width="230" height="400" alt="image" src="https://github.com/Capteem/Frontend/assets/114418850/a4d402be-22a2-4d1a-b0b4-66396212d311">
<img width="230" height="400" alt="image" src="https://github.com/Capteem/Frontend/assets/114418850/94c26700-bbbc-44b2-b7c8-97f517524563">
- 서비스 제공자로 활동하고 싶은 경우 서비스 등록을 할 수 있다.
- 스튜디오는 사업자 번호를 등록하면된다.
- 사진작가는 본인이 찍은 사진 10장, 헤어,메이크업은 자격증 사진을 등록하면된다.
- 관리자가 승인하면 서비스 제공자로 활동을 할 수 있다.

## 역할 분담
|이나경|박서현|
|:---:|:---:|
|DB설계|DB설계|
|API 명세서 작성 및 구현|API 명세서 작성 및 구현|
|리드미 작성|인프라 구축|

## 기술 스택
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

## 라이브러리

- Redux
- react-daum-postcode
- react-modal
- react-bootstrap
- react-cookie
- date-fns
- react-datepicker
- react-router-dom
- react-icos

## 프로젝트 폴더 구조
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
