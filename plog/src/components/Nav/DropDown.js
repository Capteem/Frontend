import React, { useState } from 'react';
import { Link } from 'react-router-dom';
function Dropdown({ role }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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
          <Link to="/mypage/userinfo">회원 정보</Link>
          <Link to="/mypage/viewreservation">예약 내역</Link>
          <Link to="/mypage/shoppingbag">장바구니</Link>
          <Link to="/mypage/reviewlist">리뷰</Link>
          {role === "PROVIDER" && (
            <Link to="/mypage/servicelist">서비스 관리</Link>
          )}
        </div>
      )}
    </div>
  );
}

export default Dropdown
