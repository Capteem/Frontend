import React, { useState, useEffect } from 'react';
import '../../styles/Table.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Pagination from 'react-js-pagination';
import { IoSearch } from "react-icons/io5";

function ComplainManagement() {
  const [complainlist, setComplainlist] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 1000 ? 1 : 5);
  const [sortColumn, setSortColumn] = useState('complaintId');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Define currentPage state
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const accessToken = localStorage.getItem('accesToken');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!accessToken){
      navigate("/signin");
    }
    else if(role !== 'ADMIN'){
      navigate("/");
    }
    else{
      getComplainList();
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 1000 ? 1 : 5);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getComplainList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/complaint/get`, {
        params: { userId: userId },
        headers: { 'Auth-Token': accessToken }
      });

      if (response.status === 200) {
        setComplainlist(response.data);
      } else if (response.status === 400) {
        alert('Q&A리스트 가져오기에 실패하였습니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      } else {
        console.error('Q&A리스트 가져오기에 실패하였습니다.', error);
      }
    }
  };

  const handleSort = (column) => {
    setSortColumn(column);
    setSortDirection('asc');
    const sortedComplains = [...complainlist].sort((a, b) => {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
      return 0;
    });
    setComplainlist(sortedComplains);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredComplains = complainlist.filter((complaint) => {
    const complaintId = typeof complaint.complaintId === 'string' ? complaint.complaintId : '';
    
    return (
      complaintId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.complaintType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.complaintTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.complaintContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.complaintStatus.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  

  const indexOfLastComplaint = currentPage * itemsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - itemsPerPage;
  const currentComplains = filteredComplains.slice(indexOfFirstComplaint, indexOfLastComplaint);

  return (
    <div className='Table'>
      <h4>Q&A관리</h4>
      <div style={{
      display: "flex",
      justifyContent: "center", 
      alignItems: "center",
      }}>
      <div className="search" style={{ position: "relative" }}>
    <IoSearch style={{ position: "absolute", top: "20%", left: "5%", zIndex: 1 }} />
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
        <button className="sort" onClick={() => handleSort('complaintId')}>신고번호순</button>
        <button className="sort" onClick={() => handleSort('complaintType')}>신고 유형순</button>
        <button className="sort" onClick={() => handleSort('complaintStatus')}>신고 상태순</button>
      </div>
    </div>
      <Table>
        <Thead>
          <Tr>
            <Th>신고 번호</Th>
            <Th>사용자 아이디</Th>
            <Th>신고 유형</Th>
            <Th>신고 제목</Th>
            <Th>신고 내용</Th>
            <Th>신고 날짜</Th>
            <Th>신고 상태</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentComplains.map((complaint, index) => (
            <Tr key={index}>
              <Td><div className='text'>{complaint.complaintId}</div></Td>
              <Td><div className='text'>{complaint.userId}</div></Td>
              <Td><div className='text'>{complaint.complaintType === 1 ? '예약' 
                  : complaint.complaintType === 2 ? '결제'
                  : complaint.complaintType === 3 ? '사기' 
                  : "기타"
              }</div></Td>
              <Td><div className='text'>{complaint.complaintTitle}</div></Td>
              <Td><div className='text'>{complaint.complaintContent}</div></Td>
              <Td><div className='text'>{new Date(complaint.complaintDate).toLocaleString()}</div></Td>
              <Td><div className='text'>{complaint.complaintStatus === 0 ? '처리미완료' : '처리완료'}</div></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Pagination // Render pagination component
        activePage={currentPage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={filteredComplains.length}
        pageRangeDisplayed={5}
        onChange={setCurrentPage} // Update currentPage on page change
      />
    </div>
  );
}

export default ComplainManagement;
