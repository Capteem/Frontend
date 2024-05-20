import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Home from './pages/Home.js'

// Component
import Home_Nav from './components/Nav/Home_Nav.js';
import Admin_Nav from './components/Nav/Admin_Nav.js';

// pages
import SignIn from './pages/SignIn';
import SingUp from './pages/SignUp';
import FindId from './pages/FindId.js'
import FindPassword from './pages/FindPassword.js'
import KaKaoAuthHandler from './pages/KaKaoAuthHandler.js'

// Home_Nav
// 예약
import Reservation from './pages/Reservation/Reservation.js';
import Payment from './pages/Reservation/Payment.js';
//서비스등록
import ServiceRegistration from './pages/ServiceRegistration/ServiceRegistration.js';
import ServiceRegistrationList from './pages/ServiceRegistration/ServiceRegistrationList.js';
//Q&A
import Answer from './pages/Q&A/Answer.js';
import Question from './pages/Q&A/Question.js';

// MyPage_Nav
// user
import UserInfo from './pages/Mypages/User/UserInfo.js';
import ViewReservation from './pages/Mypages/User/ViewReservation.js';
import ShoppingBag from './pages/Mypages/ShoppingBag.js';

//serviceprovider
import ServiceList from './pages/Mypages/Serviceprovider/ServiceList.js';
import ServiceInfo from './pages/Mypages/Serviceprovider/ServiceInfo.js';
import ViewScheduledInformation from './pages/Mypages/Serviceprovider/ViewScheduledInformation.js';
import Review from './pages/Mypages/Serviceprovider/Review.js';


// Admin_Nav
import ComplainManagement from './pages/Admin/ComplainManagement.js';
import UserManagement from './pages/Admin/UserManagement.js';
import ServiceManagement from './pages/Admin/ServiceManagement.js';

function App() {

  const userId = localStorage.getItem('userId');
  return (
    <BrowserRouter>
      {userId === 'admin' ?  <Admin_Nav/>: <Home_Nav/>}
      
      <div className="App">
      <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/signin' element={<SignIn/>} />
      <Route path='/signup' element={<SingUp/>} />
      <Route path='/findid' element={<FindId/>} />
      <Route path='/findpassword' element={<FindPassword/>} />
      <Route path='/auth' element={<KaKaoAuthHandler/>} />
      {/* Home_Nav */}
      <Route path='/reservation' element={<Reservation/>} />
      <Route path='/payment' element={<Payment/>} />
      <Route path='/serviceregisteration' element={<ServiceRegistration/>} />
      <Route path='/serviceregistrationlist' element={<ServiceRegistrationList/>} />ß
      <Route path='/answer/' element={<Answer/>} />
      <Route path='/question/' element={<Question/>} />
      
      {/* Mypage_Nav */}
      {/* User */}
      <Route path='/mypage/userinfo' element={<UserInfo/>} />
      <Route path='/mypage/viewreservation' element={<ViewReservation/>} />
      <Route path='/mypage/shoppingbag' element={<ShoppingBag/>} />
      
      {/* ServiceProvider */}
      
      {/* ServiceList */}
      <Route path='/mypage/servicelist' element={<ServiceList/>} />
      <Route path='/servicelist/viewscheduledinformation' element={<ViewScheduledInformation/>} />
      <Route path='/servicelist/serviceinfo' element={<ServiceInfo/>} />
      <Route path='/servicelist/review' element={<Review/>} />

      {/*admin_Nav*/}
      <Route path='/usermanagement' element={<UserManagement/>}/>
      <Route path='/complainmanagement' element={<ComplainManagement/>} />
      <Route path='/servicemanagement' element={<ServiceManagement/>} />
      
      </Routes>
      </div> 
    </BrowserRouter>


  );
}

export default App;