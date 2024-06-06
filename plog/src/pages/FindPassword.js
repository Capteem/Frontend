import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/multi.css';
import { useNavigate } from 'react-router-dom';

function FindPassword() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const idRef = useRef(null);
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPassword_re_entering, setNewPassword_re_entering] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('accesToken');
    if (accessToken) {
      navigate('/');
    }
  }, [navigate]);

  const handleChangeState = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else {
      setId(e.target.value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateId = (id) => {
    return id.length >= 1;
  };

  const handleSubmit = async () => {
    if (!validateId(id)) {
      idRef.current.focus();
      alert('아이디 입력해주세요.');
      return;
    }

    if (!validateEmail(email)) {
      emailRef.current.focus();
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    if (email === '' || id === '') {
      emailRef.current.focus();
      idRef.current.focus();
      alert('아이디와 이메일을 입력하세요.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/user/checkemail`, {
        email: email,
        id: id,
      });
      if (response.status === 200) {
        setIsEmailSent(true);
        alert('인증번호 전송 성공');
      } else {
        alert('인증번호 전송 중 문제가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('인증번호 전송 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleVerification = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/confirm/checkAuthNumber`, {
        userId: id,
        email: email,
        auth: verificationCode,
      });
      
      if (response.status === 200) {
        console.log('인증 성공');
        setIsVerified(true);
      } else {
        alert('인증 실패. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('인증 실패. 다시 시도해주세요.');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== newPassword_re_entering) {
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/user/changePwd`, {
        id: id,
        password: newPassword,
      });
      if (response.status === 200) {
        alert('비밀번호 재설정 완료');
        navigate('/signin');
      } else {
        alert('비밀번호 재설정 실패. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('비밀번호 재설정 실패. 다시 시도해주세요.');
    }
  };

  return (
    <div className="multi">
      <h4>비밀번호 찾기</h4>
      <input
        ref={idRef}
        name="id"
        value={id}
        onChange={handleChangeState}
        onKeyDown={handleKeyDown}
        placeholder="아이디"
      />
      <input
        ref={emailRef}
        name="email"
        value={email}
        onChange={handleChangeState}
        onKeyDown={handleKeyDown}
        placeholder="이메일"
      />
      <button onClick={handleSubmit}>인증번호 전송</button>
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
      {isVerified && (
        <div>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호"
          />
          <input
            type="password"
            value={newPassword_re_entering}
            onChange={(e) => setNewPassword_re_entering(e.target.value)}
            placeholder="새 비밀번호 재입력"
          />
          <button onClick={handleResetPassword}>비밀번호 재설정</button>
        </div>
      )}
    </div>
  );
}

export default FindPassword;
