import { FaFrog } from "react-icons/fa";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../../styles/Table.css';
import { useNavigate } from "react-router-dom";
import remove from "../../../assets/remove";

function UserInfo() {
  const [userInfo, setUserInfo] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordChangeMode, setIsPasswordChangeMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordReEnter, setNewPasswordReEnter] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showInput, setShowInput] = useState(false);
  const accessToken = localStorage.getItem('accesToken');
  const navigate = useNavigate();
  const nicknameRef = useRef(null);
  const phoneNumRef = useRef(null);
  const emailRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [emailDuplicate, setEmailDuplicate] = useState(true);
  const [NicknameDuplicate, setNicknameDuplicate] = useState(true);
  const [editedUserInfo, setEditedUserInfo] = useState({});
  const [initialUserInfo, setInitialUserInfo] = useState({});

  useEffect(() => {
    if (!accessToken) {
      navigate("/signin");
    } else {
      fetchUserInfo();
    }
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [accessToken, navigate]);

  useEffect(() => {
    setEmailDuplicate(false);
  }, [editedUserInfo.email]);

  useEffect(() => {
    setNicknameDuplicate(false);
  }, [editedUserInfo.nickname]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/user/getinfo`, {
        params: {
          userId: localStorage.getItem('userId'),
        },
        headers: {
          'Auth-Token': localStorage.getItem('accesToken'),
        },
      });
      console.log(response.data);
      setUserInfo(response.data);
      setEditedUserInfo({ ...response.data });
      setInitialUserInfo({ ...response.data }); // Save the initial state
    } catch (error) {
      if (error.response && error.response.status === 401) {
        remove();
        navigate('/signin', { replace: true });
        alert("로그인 만료. 다시 로그인해주세요.");
      } else {
        console.error('회원정보 가져오기에 실패하였습니다.', error);
      }
    }
  };

  const handleEditMode = async () => {
    if (showInput) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_URL}/user/getconfirm`, {
          id: localStorage.getItem('userId'),
          password: inputPassword,
        }, {
          headers: {
            'Auth-Token': localStorage.getItem('accesToken'),
          },
        });
        if (response.status === 200) {
          setIsEditMode(true);
          setShowInput(false);
        } else {
          alert('비밀번호가 일치하지 않습니다.');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          remove();
          navigate('/signin', { replace: true });
          alert("로그인 만료. 다시 로그인해주세요.");
        } else {
          console.error('비밀번호 확인에 실패하였습니다.', error);
        }
      }
    } else {
      setShowInput(true);
    }
  };

  const handleSaveChanges = async () => {
    const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 유효성 검사
    if (editedUserInfo.nickname.length < 1) {
      nicknameRef.current.focus();
      alert("닉네임을 입력하세요");
      return;
    }
    if (editedUserInfo.nickname !== initialUserInfo.nickname && !NicknameDuplicate) {
      alert("닉네임 중복 확인하세요.");
      return;
    }
    if (!phoneRegex.test(editedUserInfo.phoneNum)) {
      phoneNumRef.current.focus();
      alert("전화번호를 올바른 형식으로 입력하세요 (예: 010-1234-5678)");
      return;
    }
    if (!emailRegex.test(editedUserInfo.email)) {
      emailRef.current.focus();
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }
    if (editedUserInfo.email !== initialUserInfo.email && !emailDuplicate) {
      alert("이메일 중복 확인하세요.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/user/changeinfo`, editedUserInfo, {
        headers: {
          'Auth-Token': localStorage.getItem('accesToken'),
        },
      });
      console.log(response);
      setUserInfo(editedUserInfo);
      setIsEditMode(false);
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        remove();
        navigate('/signin', { replace: true });
        alert("로그인 만료. 다시 로그인해주세요.");
      } else {
        console.error('회원정보 수정에 실패하였습니다.', error);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUserInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handlePasswordChange = () => {
    setIsPasswordChangeMode(true);
  };

  const handlePasswordSave = async () => {
    if (newPassword === newPasswordReEnter && newPassword.length > 3) {
      try {
        await axios.post(`${process.env.REACT_APP_URL}/user/changePwd`, { id: localStorage.getItem('userId'), password: newPassword }, {
          headers: {
            'Auth-Token': localStorage.getItem('accesToken'),
          },
        });
        setIsPasswordChangeMode(false);
        setNewPassword('');
        setNewPasswordReEnter('');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          remove();
          navigate('/signin', { replace: true });
          alert("로그인 만료. 다시 로그인해주세요.");
        } else {
          console.error('비밀번호 변경 중 오류가 발생했습니다.');
        }
      }
    } else {
      alert('비밀번호를 다시 입력해주세요');
    }
  };

  const handleInputPasswordChange = (event) => {
    setInputPassword(event.target.value);
  };

  const checkEmailDuplicate = async () => {
    if (!editedUserInfo.email) {
      alert("이메일을 입력하세요.");
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/sign-api/checkEmail`, {
        params: {
          email: editedUserInfo.email
        }
      });
      if (response.status === 200) {
        alert("사용 가능한 이메일입니다.");
        setEmailDuplicate(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 400){
        alert("이미 사용 중인 이메일입니다.");
      } else {
        console.error('이메일 중복 확인에 실패하였습니다.', error);
      }
    }
  };
  
  const checkNicknameDuplicate = async () => {
    if (!editedUserInfo.nickname) {
      alert("닉네임을 입력하세요.");
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/sign-api/checkNickname`, {
        params: {
          nickname: editedUserInfo.nickname
        }
      });
      if (response.status === 200) {
        alert("사용 가능한 닉네임입니다.");
        setNicknameDuplicate(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 400){
        alert("이미 사용 중인 닉네임입니다.");
      } else {
        console.error('닉네임 중복 확인에 실패하였습니다.', error);
      }
    }
  };
  return (
    <div className="Table">
      <h4>회원정보</h4>
      <label style={{ width: window.innerWidth <= 1000 ? '80%' : '60%'}}>
        <div style={{
          backgroundColor: '#f0f0f0',
          display: 'inline-block',
          padding: '10px',
          height: "100%",
          boxShadow: '1px 2px 2px 1px #888888',
        }}>
          <FaFrog size="100" color="#162617" />
        </div>
        <table style={{ width: window.innerWidth <= 1000 ? '100%' : '70%', marginTop: '10px' }}>
  
          <tbody>
            <tr>
              <th scope="row">아이디</th>
              <td>{userInfo.id}</td>
            </tr>
            <tr>
              <th scope="row">비밀번호</th>
              <td>
                {isPasswordChangeMode ? (
                  <div>
                    <div>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="새비밀번호"
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        value={newPasswordReEnter}
                        onChange={(e) => setNewPasswordReEnter(e.target.value)}
                        placeholder="새비밀번호 재입력"
                      />
                    </div>
                    <button onClick={handlePasswordSave}>비밀번호 변경하기</button>
                  </div>
                ) : (
                  <div>
                    ********
                    {isEditMode && (
                      <button style={{ marginLeft: '10px' }} onClick={handlePasswordChange}>
                        비밀번호 변경
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
  
            <tr>
              <th scope="row">닉네임</th>
              <td>
                {isEditMode ? (
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      ref={nicknameRef}
                      value={editedUserInfo.nickname}
                      style={{width : "40%"}}
                      onChange={(e) => handleInputChange('nickname', e.target.value)}
                    />
                    <button onClick={checkNicknameDuplicate} style={{height : "50%"}}>중복 확인</button>
                  </div>
                ) : (
                  userInfo.nickname
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">전화번호</th>
              <td>
                {isEditMode ? (
                  <input
                    type="text"
                    ref={phoneNumRef}
                    value={editedUserInfo.phoneNum}
                    style={{width : "40%"}}
                    onChange={(e) => handleInputChange('phoneNum', e.target.value)}
                  />
                ) : (
                  userInfo.phoneNum
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">이메일</th>
              <td>
                {isEditMode ? (
                  <div style={{ display: "flex" }}>
                    <input
                      type="email"
                      ref={emailRef}
                      value={editedUserInfo.email}
                      style={{width : "40%"}}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                    <button 
                    onClick={checkEmailDuplicate}
                    style={{height : "50%"}}
                    >중복 확인</button>
                  </div>
                ) : (
                  userInfo.email
                )}
              </td>
            </tr>
          </tbody>
        </table>
  
        {isEditMode ? (
          <button style={{ marginTop: '10px' }} onClick={handleSaveChanges}>수정 완료</button>
        ) : (
          <>
            {showInput ? (
              <>
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={inputPassword}
                  style={{width : "30%"}}
                  onChange={handleInputPasswordChange}
                />
                <button style={{ marginTop: '10px', }} onClick={handleEditMode}>비밀번호 확인</button>
              </>
            ) : (
              <>
                <button style={{ marginTop: '10px' }} onClick={handleEditMode}>회원정보수정하기</button>
              </>
            )}
          </>
        )}
      </label>
    </div>
  );
}

export default UserInfo;