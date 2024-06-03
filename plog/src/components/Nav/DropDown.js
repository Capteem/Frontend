import { FaFrog } from "react-icons/fa";
import { FaList } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import { MdMiscellaneousServices } from "react-icons/md";
import { IoChatboxEllipses } from "react-icons/io5"
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
function Dropdown({ role }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  //페이지 새로고침
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (window.location.pathname === path) {
        window.location.reload(); // 현재 페이지를 새로고침합니다.
    } else {
        navigate(path); // 다른 경로로 이동합니다.
    }
  };

  return (
    <div className="dropdown">
      <button className="dropbtn" onClick={toggleDropdown} 
      style={{
        fontWeight: "bold",
        fontSize: "16px",
        fontFamily : 'GmarketSansMedium, sans-serif',
      }}>
        마이페이지
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <Link to="/mypage/userinfo" onClick={()=>{handleNavigation('/mypage/userinfo');}}><FaFrog/> 회원 정보</Link>
          <Link to="/mypage/viewreservation" onClick={()=>{handleNavigation('/mypage/viewreservation');}}><FaList/> 예약 내역</Link>
          <Link to="/mypage/shoppingbag" onClick={()=>{handleNavigation('/mypage/shoppingbag');}}><FaShoppingBag/> 장바구니</Link>
          <Link to="/mypage/reviewlist" onClick={()=>{handleNavigation('/mypage/reviewlist');}}><MdOutlineRateReview/> 리뷰 관리</Link>
          <Link><IoChatboxEllipses/> 1:1 채팅</Link>
          {role === "PROVIDER" && (
            <Link to="/mypage/servicelist" style={{ backgroundColor : "#efbb54", borderRadius : "0px 0px 15px 15px"}}
              onClick={()=>{handleNavigation('/mypage/servicelist');}}
            >
              <MdMiscellaneousServices/> 서비스 리스트</Link>
          )}
        </div>
      )}
    </div>
  );
}

export default Dropdown
