import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/Dropdown.css';

function ServiceDropdown(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const {providerId} = props;
  console.log(props);
  return (
    <div className="dropdown">
      <button className="dropbtn" onClick={toggleDropdown} style={{background : "#E8EEE8", color : "black"}}>
        ...
      </button>
      {isOpen && (
        <div className="dropdown-content" style={{ backgroundColor: '#E8EEE8' }}>
          <Link to={`/servicelist/serviceinfo?providerId=${providerId}`}>포토폴리오 관리</Link>
          <Link to={`/servicelist/viewscheduledinformation?providerId=${providerId}`}>예약된 내역 관리</Link>
          <Link to={`/servicelist/review?providerId=${providerId}`}>리뷰 관리</Link>
          <Link to={`/servicelist/review?providerId=${providerId}`}>서비스 탈퇴하기</Link>
        </div>
      )}
    </div>
  );
}

export default ServiceDropdown;
