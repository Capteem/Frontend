import { NavLink, useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import {Cookies} from 'react-cookie';
import { useEffect, useState } from 'react';
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
  return (
    <div className="Nav">

    <nav>
          {
            checkLogin === false ?
            <>
              <div>
                  <NavLink to="/">
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
                <NavLink to="/signin">
                  로그인
                </NavLink>
              </div>
            </>
            :
            <>
              <div>
          <NavLink to="/">
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
          <NavLink to="/usermanagement">
            사용자관리
          </NavLink>
        </div> 
        <div>
          <NavLink to="/servicemanagement">
            서비스관리
          </NavLink>
        </div>
        <div>
          <NavLink to="/complainmanagement">
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
              <NavLink to="/signup">
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
  )
}  

function removeToken(){
  const cookies = new Cookies();
  localStorage.removeItem('accesToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('userNickname');
  cookies.remove('refreshToken');
  cookies.remove('tmpBag');
}
  
  export default Admin_Nav;