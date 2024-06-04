import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/multi.css';
import { useNavigate } from 'react-router-dom';

function FindId() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleChangeState = (e) => {
    setEmail(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSunmit();
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accesToken');
    if (accessToken) {
      navigate('/');
    }
  }, [navigate]);

  const isValidEmail = (email) => {
    // 이메일 형식의 정규 표현식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSunmit = async () => {
    if (email === '') {
      emailRef.current.focus();
      alert('이메일을 입력하세요');
      return;
    }

    if (!isValidEmail(email)) {
      emailRef.current.focus();
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/user/checkemail`, {
        email: email,
      });

      if (response.status === 200) {
        setIsEmailSent(true);
        alert('인증번호 전송 성공');
      } else {
        alert('이메일 전송 중 문제가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
        console.error('이메일 전송에 실패하였습니다.', error);
    }
  };

  const handleVerification = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/confirm/checkAuthNumber`, {
        email: email,
        auth: verificationCode,
      });
      console.log(response);
      console.log('인증 성공');
      alert(`${response.data.message}`);
      navigate('/signin');
      if(response.status === 400) {
        alert('이메일 인증 문제가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
        console.error('이메일 인증에 실패하였습니다..', error);
    }
  };

  return (
    <div className="multi">
      <h4>아이디 찾기</h4>
      <input
        ref={emailRef}
        name="email"
        value={email}
        onChange={handleChangeState}
        onKeyDown={handleKeyDown}
        placeholder="이메일"
      />
      <button onClick={handleSunmit}>인증번호 전송</button>
      {isEmailSent && (
        <div>
          <input
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="인증번호"
          />
          <button onClick={handleVerification}>확인</button>
        </div>
      )}
    </div>
  );
}

export default FindId;
