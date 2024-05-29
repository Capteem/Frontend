import React, { useRef, useState,useEffect } from 'react';
import axios from 'axios';
import '../styles/multi.css';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const id = useRef();
  const password = useRef();
  const password_re_entering = useRef();
  const name = useRef();
  const nickname = useRef();
  const phonenumber = useRef();
  const email = useRef();

  const [state, setState] = useState({
    id: "",
    password: "",
    password_re_entering: "",
    name: "",
    nickname: "",
    phonenumber: "",
    email: "",
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('accesToken');
    if (accessToken) {
      navigate('/');
    }
  }, [navigate]);

  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Regular expressions for validation
    const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 유효성 검사
    if (state.id.length < 5) {
      id.current.focus();
      alert("아이디를 5글자 이상 입력하세요");
      return;
    }
    if (state.password.length < 4) {
      password.current.focus();
      alert("비밀번호를 4글자 이상 입력하세요");
      return;
    }
    if (state.password !== state.password_re_entering) {
      password_re_entering.current.focus();
      alert("비밀번호가 다릅니다. 다시 입력하세요");
      return;
    }
    if (state.name.length < 2) {
      name.current.focus();
      alert("이름을 입력하세요");
      return;
    }
    if (state.nickname.length < 3) {
      nickname.current.focus();
      alert("닉네임을 3글자 이상 입력하세요");
      return;
    }
    if (!phoneRegex.test(state.phonenumber)) {
      phonenumber.current.focus();
      alert("전화번호를 000-0000-0000 또는 00-0000-0000 형식에 맞게 입력하세요");
      return;
    }
    if (!emailRegex.test(state.email)) {
      email.current.focus();
      alert("유효한 이메일을 입력하세요");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/sign-api/signup`, {
        id: state.id,
        password: state.password,
        name: state.name,
        email: state.email,
        nickname: state.nickname,
        phoneNum: state.phonenumber,
      }, {
        headers: {
          'Auth-Token': localStorage.getItem('accesToken'),
        },
      });

      // 상태 코드에 따른 처리
      if (response.status === 200) {
        alert("회원가입에 성공하였습니다.");
        navigate('/signin');
      } else if (response.status === 400) {
        alert("회원가입 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigator('/signin', { replace: true });
      } else {
        console.error('서비스리스트 가져오기에 실패하였습니다.', error);
      }
    }
  };

  return (
    <div className='multi'>
      <h4>회원가입</h4>
      <div>
        <input 
          ref={id}
          name="id"
          value={state.id}
          onChange={handleChangeState}
          onKeyDown={handleKeyDown}
          placeholder="아이디"
        /> 
      </div>
      <div>
        <input 
          ref={password}
          name="password"
          type="password"
          value={state.password}
          onChange={handleChangeState}
          onKeyDown={handleKeyDown}
          placeholder="비밀번호"
        /> 
      </div> 
      <div>
        <input 
          ref={password_re_entering}
          name="password_re_entering"
          type="password"
          value={state.password_re_entering}
          onChange={handleChangeState}
          onKeyDown={handleKeyDown}
          placeholder="비밀번호 재입력"
        /> 
      </div> 
      <div>
        <input 
          ref={name}
          name="name"
          value={state.name}
          onChange={handleChangeState}
          onKeyDown={handleKeyDown}
          placeholder="이름"
        /> 
      </div> 
      <div>
        <input 
          ref={nickname}
          name="nickname"
          value={state.nickname}
          onChange={handleChangeState}
          onKeyDown={handleKeyDown}
          placeholder="닉네임"
        /> 
      </div> 
      <div>
        <input 
          ref={phonenumber}
          name="phonenumber"
          value={state.phonenumber}
          onChange={handleChangeState}
          onKeyDown={handleKeyDown}
          placeholder="전화번호"
        /> 
      </div> 
      <div>
        <input 
          ref={email}
          name="email"
          value={state.email}
          onChange={handleChangeState}
          onKeyDown={handleKeyDown}
          placeholder="이메일"
        /> 
      </div> 
      <br/>
      <button onClick={handleSubmit}>회원가입하기</button>
    </div>
  );
}

export default SignUp;
