import React, { useState, useEffect } from 'react';
import '../../styles/Table.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';



function ComplainManagement() {
  const [complainlist, setComplainlist] = useState([]);
  const [editingComplaintIndex, setEditingComplaintIndex] = useState(-1);
  const [newReplyContent, setNewReplyContent] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
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
//
  return (
    <div className='Table'>
      <h4>Q&A관리</h4>
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
                <div className='text'>
                  {editingComplaintIndex === index ? (
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
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}

export default ComplainManagement;
