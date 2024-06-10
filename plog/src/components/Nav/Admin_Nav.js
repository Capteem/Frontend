import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

import remove from "../../assets/remove";

import '../../styles/Nav.css';
import Plog from './../../assets/Ploglogo.png'

function Admin_Nav() {
  const [checkLogin, setCheckLogin] = useState(false);
  useEffect(()=>{
    const token = localStorage.getItem("accesToken");
    if(token){
      setCheckLogin(true);
    }
  })
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
    <div className="Nav">
    <nav>
          {
            checkLogin === false ?
            <>
              <div>
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
              <div>
                <NavLink to="/signin" onClick={()=>{handleNavigation('/signin');}}>
                  로그인
                </NavLink>
              </div>
            </>
            :
            <>
              <div>
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
        <div>
          <NavLink to="/usermanagement" onClick={()=>{handleNavigation('/usermanagement');}}>
            사용자관리
          </NavLink>
        </div> 
        <div>
          <NavLink to="/servicemanagement" onClick={()=>{handleNavigation('/servicemanagement');}}>
            서비스관리
          </NavLink>
        </div>
        <div>
          <NavLink to="/complainmanagement" onClick={()=>{handleNavigation('/complainmanagement');}}>
            Q&A관리
          </NavLink>
        </div>
              <div>
                <NavLink onClick={()=>{
                  setModalShow(true);
                }}>
                  로그아웃
                </NavLink>
              </div>
            </>
          }


        <div>
          {
            checkLogin === false ?
              <NavLink to="/signup" onClick={()=>{handleNavigation('/signup');}}>
                회원가입
              </NavLink>
            :
              null
          }
        </div>
      </nav>
      {
          modalShow &&
            <div className='small-portfolio-modal' onClick={()=>{setModalShow(false)}}>
              <div className='small-portfolio-modalBody'>
                <div className='small-modal-big-text'>로그아웃 하시겠습니까?</div>
                <button className='small-modal-button' onClick={()=>{
                  remove();
                  navigate("/");
                  setCheckLogin(false);
                  setModalShow(false);
                }}>확인</button>
                <button className='small-modal-button' onClick={()=>{setModalShow(false);}}>취소</button>
              </div>
            </div>
        }
    </div>
  )
}  
  
  export default Admin_Nav;