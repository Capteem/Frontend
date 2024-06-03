import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NavLink, useNavigate } from "react-router-dom";
import {Cookies} from 'react-cookie';

import '../../styles/Nav.css';
import '../../styles/smallModal.css';
import Plog from './../../assets/Ploglogo.png'

import { RiMenu3Line } from "react-icons/ri";
import { FaFrog } from "react-icons/fa";
import { FaList } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import { IoChatboxEllipses } from "react-icons/io5"

function SmallNav() {

  const role = localStorage.getItem('role');

  //여기서부터
  const [checkLogin, setCheckLogin] = useState(false);
  const [myPage, setMyPage] = useState(false);
  useEffect(()=>{
    const token = localStorage.getItem("accesToken");
    if(token){
      setCheckLogin(true);
    }
  })
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  //페이지 새로고침
  const handleNavigation = (path) => {
    if (window.location.pathname === path) {
        window.location.reload(); // 현재 페이지를 새로고침합니다.
    } else {
        navigate(path); // 다른 경로로 이동합니다.
    }
  };


  return (
    <>
      <div className="Nav_small">
        <nav>
          <div className='nav-small-left'>
            <NavLink to="/" onClick={()=>{handleNavigation('/');}}>
              <div style={{display:"flex"}}>
                <img
                  src={Plog} alt=""
                  style={{width : "50px",}}
                />
                <h4 style={{paddingTop:"10px", fontWeight: "bold", fontFamily : 'GmarketSansMedium, sans-serif',}}>Plog</h4>
              </div>
                </NavLink>
          </div>
          <div className='nav-small-right'>
          {
            checkLogin === false ?
              <>
                <div>
                  <NavLink to="/signin" onClick={()=>{handleNavigation('/signin');}}>
                    로그인
                  </NavLink>
                </div>
              </>
              :
              <>
                <div className="dropdown">
                  <RiMenu3Line className="dropbtn-icon" onClick={()=>{toggleDropdown();}}/>
                  {isOpen && (
                    <div className="dropdown-content">
                      <Link to="/reservation" onClick={()=>{ setMyPage(false); handleNavigation('/reservation');}}>예약</Link>
                      <Link to="/serviceregistrationlist" onClick={()=>{ setMyPage(false); handleNavigation('/serviceregistrationlist');}}>서비스등록</Link>
                      <Link to="/gallery" onClick={()=>{ setMyPage(false); handleNavigation('/gallery');}}>갤러리</Link>
                      <Link to="/answer" onClick={()=>{ setMyPage(false); handleNavigation('/answer');}}>Q&A</Link>
                      <Link onClick={()=>{ setModalShow(true);}}>로그아웃</Link>
                      <Link onClick={()=>{ setMyPage(!myPage);}}>마이페이지</Link>
                      {
                        myPage &&
                        <div>
                          <Link to="/mypage/userinfo" onClick={()=>{ setMyPage(false); handleNavigation('/mypage/userinfo');}}><FaFrog/> 회원 정보</Link>
                          <Link to="/mypage/viewreservation" onClick={()=>{ setMyPage(false); handleNavigation('/mypage/viewreservation');}}><FaList/> 예약 내역</Link>
                          <Link to="/mypage/shoppingbag" onClick={()=>{ setMyPage(false); handleNavigation('/mypage/shoppingbag');}}><FaShoppingBag/> 장바구니</Link>
                          <Link to="/mypage/reviewlist" onClick={()=>{ setMyPage(false); handleNavigation('/mypage/reviewlist');}}><MdOutlineRateReview/> 리뷰 관리</Link>
                          <Link><IoChatboxEllipses/> 1:1 채팅</Link>
                            {role === "PROVIDER" && (
                              <Link to="/mypage/servicelist" style={{ backgroundColor : "#efbb54", borderRadius : "0px 0px 15px 15px"}}
                              onClick={()=>{ setMyPage(false); handleNavigation('/mypage/servicelist');}}>서비스 리스트</Link>
                            )}
                        </div>
                      }
                    </div>
                  )}
                </div>
              </>
          }
          </div>
          <>
            {
              checkLogin === false ?
                <NavLink to="/signup" onClick={()=>{handleNavigation('/signup');}}>
                  회원가입
                </NavLink>
              :
                null
            }
          </>
        </nav>
        {
          modalShow &&
          <div className='small-portfolio-modal' onClick={()=>{setModalShow(false)}}>
            <div className='small-portfolio-modalBody'>
              <div className='small-modal-big-text'>로그아웃 하시겠습니까?</div>
              <div className='small-modal-text'>
                로그아웃하면 장바구니 내역이 삭제됩니다
              </div>
              <button className='small-modal-button' onClick={()=>{
                removeToken();
                navigate("/");
                setCheckLogin(false);
                setModalShow(false);
              }}>확인</button>
              <button className='small-modal-button' onClick={()=>{setModalShow(false);}}>취소</button>
            </div>
          </div>
        }
      </div>
    </>
  );
}

//로그아웃 토큰 다 삭제
//todo: 장바구니 삭제
function removeToken(){
  const cookies = new Cookies();
  localStorage.removeItem('accesToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('userNickname');
  cookies.remove('tmpBag');
}

export default SmallNav;
