import React, { useState, useEffect } from 'react';
import '../../styles/Table.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Pagination from 'react-js-pagination';
import { IoSearch } from "react-icons/io5";
import Modal from 'react-modal';
import { MdContentCopy } from "react-icons/md";


function ComplainManagement() {
  const [complainlist, setComplainlist] = useState([]);
  const [editingComplaintIndex, setEditingComplaintIndex] = useState(-1);
  const [newReplyContent, setNewReplyContent] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accesToken');
  const role = localStorage.getItem('role');
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 1000 ? 1 : 5);
  const [sortColumn, setSortColumn] = useState('complaintId');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null); // State to store selected complaint
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to control modal open/close
  
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
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 1000 ? 1 : 5);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [accessToken, navigate, role]);


  const getComplainList = async () => {
    try {
      const accessToken = localStorage.getItem('accesToken');
      const response = await axios.get(`${process.env.REACT_APP_URL}/complaint/get`, {
        params: {
          userId: userId,
        },
        headers: {
          'Auth-Token': accessToken,
        },
      });

      if (response.status === 200) {
        console.log(response.data);
        if(response.data !== "불만 신고가 없습니다."){
          setComplainlist(response.data);
        }
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

  const handleReplyEdit = (index) => {
    setEditingComplaintIndex(index);
    setNewReplyContent(complainlist[index].complaintAnswerTable?.complaintReplyContent || '');
  };

  const handleReplyContentChange = (e) => {
    setNewReplyContent(e.target.value);
  };

  const handleReplySubmit = async (index) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/admin/reply`, {
        complaintId: complainlist[index].complaintId,
        complaintReplyContent: newReplyContent,
        complaintReplyDate: new Date().toISOString(),
      }, 
      {
        headers: {
          'Auth-Token': localStorage.getItem('accesToken'),
        },
      }
    );
      if (response.status === 200) {
        alert(`답글 등록에 성공하였습니다.`);
        getComplainList(); // 리스트 다시 가져오기
        setEditingComplaintIndex(-1);
        setNewReplyContent('');
      } else if (response.status === 400) {
        alert('답글 등록에 실패하였습니다.');
      } 
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      } else {
        console.error('답글 등록에 실패하였습니다.', error);
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
    setCurrentPage(1); 
  };

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedComplaint(null);
    setModalIsOpen(false);
  };

  const filteredComplains = complainlist.filter((complaint) => {
    const complaintId = typeof complaint.complaintId === 'string' ? complaint.complaintId : '';
    const complaintType = typeof complaint.complaintType === 'string' ? complaint.complaintType.toLowerCase() : '';
    
    return (
      complaintId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaintType.includes(searchQuery.toLowerCase()) ||
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
      {complainlist.length === 0 ? (
      <p>Q&A가 없습니다.</p>
    ) : (
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
              <Th>답변</Th>
            </Tr>
          </Thead>
          <Tbody>
            {complainlist.map((complaint, index) => (
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
                <Td>
                <div className='text'>{editingComplaintIndex === index ? (
                    <div>
                      <textarea
                        value={newReplyContent}
                        onChange={handleReplyContentChange}
                      />
                      <button onClick={() => handleReplySubmit(index)}>답글 저장</button>
                    </div>
                  ) : (
                    <div>
                      {complaint.complaintAnswerTable?.complaintReplyContent && (
                        <div>
                          <p>답변 내용: {complaint.complaintAnswerTable.complaintReplyContent}</p>
                          <p>답변 날짜: {new Date(complaint.complaintAnswerTable.complaintReplyDate).toLocaleString()}</p>
                        </div>
                      )}
                      {complaint.complaintStatus === 0 && (
                        <button onClick={() => handleReplyEdit(index)}>답변 달기</button>
                      )}
                    </div>
                  )}
                </div></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}

export default ComplainManagement;
