import { NavLink, useNavigate } from "react-router-dom";
import {Cookies} from 'react-cookie';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import '../../styles/Nav.css';
import '../../styles/smallModal.css';
import Dropdown from './DropDown'; 
import Plog from './../../assets/Ploglogo.png'

function Nav(){
  const role = localStorage.getItem('role');
  //console.log(role)

  //여기서부터
  const [checkLogin, setCheckLogin] = useState(false);
  useEffect(()=>{
    const token = localStorage.getItem("accesToken");
    if(token){
      setCheckLogin(true);
    }
  })
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();
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
                  <NavLink to="/reservation">
                    예약
                  </NavLink>
                </div>
                <div>
                  <NavLink to="/serviceregistrationlist">
                    서비스등록
                  </NavLink>
                </div>
                <div>
                  <NavLink to="/gallery">
                      갤러리
                  </NavLink>
                </div>
                <div>
                  <NavLink to="/answer">
                      Q&A
                  </NavLink>
                </div>
                <div>
                <div className="dropdown">
                  <Dropdown
                    role = {role}
                  />
                </div>
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
    )
}

//로그아웃 토큰 다 삭제
//todo: 장바구니 삭제
function removeToken(){
  const cookies = new Cookies();
  localStorage.removeItem('accesToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  cookies.remove('tmpBag');
}

export default Nav;
