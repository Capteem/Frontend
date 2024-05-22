import React, { useRef, useState } from 'react';
import axios from 'axios';
import '../styles/multi.css';
import {useNavigate } from 'react-router-dom';
// 완료되면 로그인 페이지로 넘어가기
function FindId() {
    const navigate = useNavigate();
  const emailRef = useRef(null);
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState('');

  const handleChangeState = (e) => {
    setEmail(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSunmit();
    }
  };

  const handleSunmit = async () => {
    if (email === '') {
      emailRef.current.focus();
      alert('이메일을 입력하세요');
      return;
    }
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/user/checkemail`, {
        email: email,
      });

      if (response.status === 200) {
        setIsEmailSent(true);
        console.log('이메일 전송 성공');
      } else {
        alert('이메일 전송 중 문제가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('이메일 전송 중 문제가 발생했습니다. 다시 시도해주세요.');
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
    } catch (error) {
      alert('인증 실패. 다시 시도해주세요.');
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
