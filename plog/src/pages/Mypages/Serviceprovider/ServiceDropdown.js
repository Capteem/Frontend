import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/Dropdown.css';
import { FaPhotoFilm } from "react-icons/fa6";
import { MdCalendarMonth } from "react-icons/md";
import { MdRateReview } from "react-icons/md";
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";

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
        <div className="dropdown-content">
          <Link to={`/servicelist/serviceinfo?providerId=${providerId}`}><FaPhotoFilm /> 포토폴리오 관리</Link>
          <Link to={`/servicelist/viewscheduledinformation?providerId=${providerId}`}><MdCalendarMonth /> 예약된 내역 관리</Link>
          <Link to={`/servicelist/review?providerId=${providerId}`}><MdRateReview/> 리뷰 관리</Link>
          <Link><MdOutlineMarkUnreadChatAlt/> 1:1 채팅 관리</Link>
        </div>
      )}
    </div>
  );
}

export default ServiceDropdown;
