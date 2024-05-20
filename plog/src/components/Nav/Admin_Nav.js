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

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const navigate = useNavigate();
  function write(){
    return(
      <>
        진짜 로그아웃??
        <button onClick={()=>{
          removeToken();
          closeModal();
          navigate("/");
          setCheckLogin(false);
          
        }}>확인</button>
        <button onClick={()=>{closeModal();}}>취소</button>
      </>
    )
  }
  //여기까지 로그아웃 관련 로직

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
                    openModal();
                  }}>
                    로그아웃
                </NavLink>
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                  {write()}
                </Modal>
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

    </div>
  )
}  

function removeToken(){
  const cookies = new Cookies();
  localStorage.removeItem('accesToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  cookies.remove('refreshToken');
  cookies.remove('tmpBag');
}
  
  export default Admin_Nav;