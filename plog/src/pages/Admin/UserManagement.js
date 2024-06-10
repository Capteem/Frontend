import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Table.css';
import { useNavigate } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Pagination from 'react-js-pagination';
import { IoSearch } from "react-icons/io5";
import NoData from '../../assets/noReview.png';
import remove from '../../assets/remove';

function UserManagement() {
  const [userlist, setUserlist] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 1000 ? 1 : 5);
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const accessToken = localStorage.getItem('accesToken');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!accessToken) {
      navigate("/signin");
    } else if (role !== 'ADMIN') {
      navigate("/");
    } else {
      getUserList();
    }

    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 500 ? 1 : window.innerWidth < 1000 ? 1 :5);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [accessToken, navigate, role]);

  const getUserList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/admin/user`, {
        params: { adminId: userId },
        headers: { 'Auth-Token': accessToken }
      });

      if (response.status === 200) {
        setUserlist(response.data);
      } else if (response.status === 400) {
        alert('사용자리스트 가져오기에 실패하였습니다.');
      }
      
    } catch (error) {
      if (error.response && error.response.status === 401) {
        remove();
        navigate('/signin', { replace: true });
        alert("로그인 만료. 다시 로그인해주세요.");
      } else {
        console.error('사용자리스트 가져오기에 실패하였습니다.', error);
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
      }, {
        headers: { 'Auth-Token': accessToken }
      });

      if (response.status === 200) {
        alert(`${userId}의 상태를 ${(selectedStatus[userId] || status) === '1' ? '활성화' : (selectedStatus[userId] || status) === '2' ? '정지' : '차단'}로 변경하였습니다.`);
        window.location.reload();
      } else if (response.status === 400) {
        alert('사용자 상태변화에 실패하였습니다.');
      }
      
    } catch (error) {
      if (error.response && error.response.status === 401) {
        remove();
        navigate('/signin', { replace: true });
        alert("로그인 만료. 다시 로그인해주세요.");
      } else {
        console.error('사용자 상태변화에 실패하였습니다.', error);
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (column) => {
    setSortColumn(column);
    setSortDirection('asc');
    const sortedUsers = [...userlist].sort((a, b) => {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
      return 0;
    });
    setUserlist(sortedUsers);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = userlist.filter((user) => {
    const status = typeof user.status === 'string' ? user.status.toLowerCase() : '';
    return (
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phonenum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      status.includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className='Table'>
      <h4>사용자 관리</h4>
      <div style={{
      display: window.innerWidth < 500 ? "": "flex",
      justifyContent: "center", 
      alignItems: "center", 
      }}>
      <div className="search" style={{ position: "relative" }}>
    <IoSearch style={{ 
      position: "absolute", 
      top: "20%", 
      left: window.innerWidth < 500 ? "30%" :"5%", 
      zIndex: 1 }} />
    <input
        type="text"
        placeholder="검색"
        value={searchQuery}
        onChange={handleSearch}
        style={{
            padding: "3px",
            paddingLeft: "25px", 
            textAlign: "center",
            border: "1px solid #162617",
            marginRight : "10px"
        }}
      />
    </div>

      <div className="sort-buttons">
        <button className="sort" onClick={() => handleSort('status')}>상태순</button>
        <button className="sort" onClick={() => handleSort('id')}>아이디순</button>
        <button className="sort" onClick={() => handleSort('role')}>유형순</button>
      </div>
      </div>
      {userlist.length === 0 ? (
        <>
         <img 
        src={NoData} 
        alt=""
        style={{
          width : "20%",
          height : "20%",
        }}
        />
        <p  style={{fontSize : window.innerWidth < "500" ? "25px": "40px", border : "bold"}}>사용자가 없습니다.</p>
        </>
      ) : filteredUsers.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>번호</Th>
                <Th>아이디</Th>
                <Th>이름</Th>
                <Th>닉네임</Th>
                <Th>유형</Th>
                <Th>전화번호</Th>
                <Th>이메일</Th>
                <Th>상태</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentUsers.map((userinfo, index) => (
                <Tr key={index}>
                  <Td><div className='text'>{indexOfFirstUser + index + 1}</div></Td>
                  <Td><div className='text'>{userinfo.id}</div></Td>
                  <Td><div className='text'>{userinfo.name}</div></Td>
                  <Td><div className='text'>{userinfo.nickname}</div></Td>
                  <Td><div className='text'>{userinfo.role}</div></Td>
                  <Td><div className='text'>{userinfo.phonenum}</div></Td>
                  <Td><div className='text'>{userinfo.email}</div></Td>
                  <Td>
                    <div className='text'>
                      <select 
                        value={selectedStatus[userinfo.id] || userinfo.status}
                        onChange={(e) => handleStatusChange(userinfo.id, e.target.value)}
                        style={{marginRight : "5px"}}
                      >
                        <option value="1">활성화</option>
                        <option value="2">정지</option>
                        <option value="3">차단</option>
                      </select>
                      <button onClick={() => UserStateChange(userinfo.id, userinfo.status)}>
                        상태변경
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={filteredUsers.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default UserManagement;
