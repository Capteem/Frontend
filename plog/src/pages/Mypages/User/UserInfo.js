import { IoPersonSharp } from "react-icons/io5";
import { FaFrog } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/Table.css';

function UserInfo() {
  const [userInfo, setUserInfo] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState(null);
  const [isPasswordChangeMode, setIsPasswordChangeMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordReEnter, setNewPasswordReEnter] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('url/user/getinfo', {
          params: {
            userId: localStorage.getItem('userId'),
          },
        });
        console.log(response.data);
        setUserInfo(response.data);
        setEditedUserInfo({ ...response.data });
      } catch (error) {
        console.error('회원정보 불러오기에 실패하였습니다. 다시 시도해주세요');
      }
    };
    fetchUserInfo();
  }, []);

  const handleEditMode = async () => {
    if (showInput) {
      try {
        const response = await axios.post('url/user/getconfirm', {
          id: localStorage.getItem('userId'),
          password: inputPassword,
        });
        if (response.status === 200) {
          setIsEditMode(true);
          setShowInput(false);
        } else {
          alert('비밀번호가 일치하지 않습니다.');
        }
      } catch (error) {
        console.error('비밀번호 확인 중 오류가 발생했습니다.');
      }
    } else {
      setShowInput(true);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.post('url/user/changeinfo', editedUserInfo);
      setUserInfo(editedUserInfo);
      setIsEditMode(false);
      window.location.reload();
    } catch (error) {
      console.error('회원정보 수정시 오류가 발생했습니다.');
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
        await axios.post('url/user/changePwd', { id: localStorage.getItem('userId'), password: newPassword });
        setIsPasswordChangeMode(false);
        setNewPassword('');
        setNewPasswordReEnter('');
      } catch (error) {
        console.error('비밀번호 변경 중 오류가 발생했습니다.');
      }
    } else {
      alert('비밀번호를 다시 입력해주세요');
    }
  };

  const handleInputPasswordChange = (event) => {
    setInputPassword(event.target.value);
  };

  return (
    <div className="Table">
      <h4>회원정보</h4>
      <label style={{ width: "50%" }}>
        <div style={{
          backgroundColor: '#f0f0f0',
          display: 'inline-block',
          padding: '10px',
          height: "100%",
          boxShadow: '1px 2px 2px 1px #888888',
        }}>
          <FaFrog size="100" color="#162617" />
        </div>
        <table style={{ width: '100%', marginTop: '10px' }}>
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
                  <input
                    type="text"
                    value={editedUserInfo.nickname}
                    onChange={(e) => handleInputChange('nickname', e.target.value)}
                  />
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
                    value={editedUserInfo.phoneNum}
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
                  <input
                    type="email"
                    value={editedUserInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
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
                  onChange={handleInputPasswordChange}
                />
                <button style={{ marginTop: '10px' }} onClick={handleEditMode}>비밀번호 확인</button>
              </>
            ) : (
              <>
                <button style={{ marginTop: '10px' }} onClick={handleEditMode}>회원정보수정하기</button>
                <button style={{ marginTop: '10px', marginLeft: '10px' }}>회원탈퇴하기</button>
              </>
            )}
          </>
        )}
      </label>
    </div>
  );
}

export default UserInfo;
