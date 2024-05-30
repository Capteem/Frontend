import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from './DropDown';

function SmallWindow({ role }) {
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
        Menu
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <Link to="/reservation">예약</Link>
          <Link to="/serviceregistrationlist">서비스등록</Link>
          <Link to="/gallery">갤러리</Link>
          <Link to="/mypage/reviewlist">커뮤니티</Link>
          <Link to="/answer">Q&A</Link>
          <div className="dropdown">
            <Dropdown
              role = {role}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SmallWindow;
