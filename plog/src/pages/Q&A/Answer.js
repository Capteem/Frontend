import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Table.css';

function Answer() {
  const navigate = useNavigate();
  const [complainlist, setComplainlist] = useState([]);
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    getAnswerList();
  }, []);

  const handleQuestion = () => {
    navigate('/question');
  };

  const getAnswerList = async () => {
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
      console.error('Q&A리스트 가져오기에 실패하였습니다', error);
    }
  };

  return(
    <div className='Table'>
      <h4>Q&A</h4>
      <button 
      onClick={handleQuestion}
      style={{
        width: '15%',
        padding: '5px',
        marginBottom: '10px',
        boxSizing: 'border-box',
        borderRadius: '15px',
        backgroundColor: '#162617',
        color: '#E8EEE8',
        fontWeight: 'bold'
      }}
      >질문하기</button>
      {complainlist.length === 0 ? (
        <p>등록된 질문이 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>신고 번호</th>
              <th>신고 유형</th>
              <th>신고 제목</th>
              <th>신고 내용</th>
              <th>신고 날짜</th>
              <th>신고 상태</th>
              <th>답변</th>
            </tr>
          </thead>
          <tbody>
            {complainlist.map((complaint, index) => (
              <tr key={index}>
                <td>{complaint.complaintId}</td>
                <td>{complaint.complaintType === 1 ? '예약' 
                : complaint.complaintType === 2 ? '결제'
                : complaint.complaintType === 3 ? '사기' 
                : "기타"
                }</td>
                <td>{complaint.complaintTitle}</td>
                <td>{complaint.complaintContent}</td>
                <td>{new Date(complaint.complaintDate).toLocaleString()}</td>
                <td>{complaint.complaintStatus === 0 ? '처리미완료' : '처리완료'}</td>
                <td>{complaint.complaintAnswerTable?.complaintReplyContent && (
                        <div>
                          <p>답변 내용: {complaint.complaintAnswerTable.complaintReplyContent}</p>
                          <p>답변 날짜: {new Date(complaint.complaintAnswerTable.complaintReplyDate).toLocaleString()}</p>
                        </div>
                      )}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

}

export default Answer;
