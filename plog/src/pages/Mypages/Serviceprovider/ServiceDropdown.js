import { Link, useNavigate } from "react-router-dom";
import '../../../styles/Dropdown.css';
import { FaPhotoFilm } from "react-icons/fa6";
import { MdCalendarMonth } from "react-icons/md";
import { MdRateReview } from "react-icons/md";
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";
import React, { useEffect, useState } from 'react';

function ServiceDropdown(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();
  const [checkLogin, setCheckLogin] = useState(false);
  const [myPage, setMyPage] = useState(false);
  useEffect(()=>{
    const token = localStorage.getItem("accesToken");
    if(token){
      setCheckLogin(true);
    }
  })

  const handleNavigation = (path) => {
    if (window.location.pathname === path) {
        window.location.reload(); // 현재 페이지를 새로고침합니다.
    } else {
        navigate(path); // 다른 경로로 이동합니다.
    }
  };

  const providerId = props.providerId;
  const providerName = props.providerName
  console.log(props.providerName);
  return (
    <div className="dropdown">
      <button className="dropbtn" onClick={toggleDropdown} style={{background : "#E8EEE8", color : "black"}}>
        ...
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <Link to={`/servicelist/serviceinfo?providerId=${providerId}`} 
          onClick={()=>{ setMyPage(false); handleNavigation(`/servicelist/serviceinfo?providerId=${providerId}&providerName=${providerName}`)}}>
          <FaPhotoFilm /> 포토폴리오 관리
          </Link>
          <Link to={`/servicelist/viewscheduledinformation?providerId=${providerId}&providerName=${providerName}`}
          onClick={()=>{ setMyPage(false); handleNavigation(`/servicelist/viewscheduledinformation?providerId=${providerId}`)}}>
          <MdCalendarMonth /> 예약된 내역 관리
          </Link>
          <Link to={`/servicelist/review?providerId=${providerId}`} 
          onClick={()=>{ setMyPage(false); handleNavigation(`/servicelist/review?providerId=${providerId}&providerName=${providerName}`)}}>
          <MdRateReview/> 리뷰 관리
          </Link>
          <Link to={`/servicelist/chatlist?userId=${localStorage.getItem('userId')}&providerId=${providerId}&providerName=${providerName}`}
          onClick={()=>{ setMyPage(false); handleNavigation(`/servicelist/chatlist?userId=${localStorage.getItem('userId')}&providerId=${providerId}&providerName=${providerName}`)}}>
          <MdOutlineMarkUnreadChatAlt/> 1:1 채팅 관리
          </Link>
        </div>
      )}
    </div>
  );
}

export default ServiceDropdown;
