import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Table.css';
import { useNavigate } from "react-router-dom";

function UserManagement() {
  const [userlist, setuserlist] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accesToken');
    const role = localStorage.getItem('role');
    if (!accessToken){
      navigate("/signin");
    }
    else if(role !== 'ADMIN'){
      navigate(-1);
    }
    else{
      getUserList();
    }
  }, []);
  
  const getUserList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/admin/user`, {
        params: {
          adminId: userId,
        },
        headers: {
            'Auth-Token': localStorage.getItem('accesToken'),
        },     
      });

      if (response.status === 200) {
        setuserlist(response.data);
        console.log(response.data);
      } 
      else if (response.status === 400) {
        alert('유저리스트 가져오기에 실패하였습니다.');
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

  const handleStatusChange = (userId, status) => {
    setSelectedStatus((prevState) => ({
      ...prevState,
      [userId]: status,
    }));
  };

  const UserStateChange = async (userId, status) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/admin/user/change`, {
        userId: userId,
        status: selectedStatus[userId] || status,
      },
      {
      headers: {
        'Auth-Token': localStorage.getItem('accesToken'),
      },
    }
    );
      console.log(userId);
      console.log(selectedStatus[userId] || status);
      if (response.status === 200) {
        alert(`${userId}의 상태를 ${(selectedStatus[userId] || status) === '1' ? '활성화' : (selectedStatus[userId] || status) === '2' ? '정지' : '차단'}로 변경하였습니다.`);
      } else if (response.status === 400) {
        alert('유저 상태변화에 실패하였습니다.');
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
    <div className='Table'>
      <h4>사용자 관리</h4>
      {userlist.length === 0 ? (
      <p>등록된 유저가 없습니다.</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>아이디</th>
            <th>이름</th>
            <th>닉네임</th>
            <th>유형</th>
            <th>전화번호</th>
            <th>상태</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {userlist.map((userinfo, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{userinfo.id}</td>
              <td>{userinfo.name}</td>
              <td>{userinfo.nickname}</td>
              <td>{userinfo.role}</td>
              <td>{userinfo.phonenum}</td>
              <td>
                <select
                  value={selectedStatus[userinfo.id] || userinfo.status}
                  onChange={(e) => handleStatusChange(userinfo.id, e.target.value)}
                >
                  <option value="1">활성화</option>
                  <option value="2">정지</option>
                  <option value="3">차단</option>
                </select>
              </td>
              <td>
                <button onClick={() => UserStateChange(userinfo.id, userinfo.status)}>
                상태변경
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
    )}
    </div>
  );
}

export default UserManagement;
