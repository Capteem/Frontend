import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Table.css';

function ServiceRegistrationList() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    getServiceRegistrationList(userId);
  }, [userId]);

  const handleServiceRegistrationClick = () => {
    navigate('/serviceregisteration');
  };

  const getServiceRegistrationList = async () => {
    try {
      const accessToken = localStorage.getItem('accesToken'); 

      const response = await axios.get(`${process.env.REACT_APP_URL}/service/check`, {
        params: {
          userId: userId,
        },
        headers: {
          'Auth-Token': accessToken, 
        },
      });

      if (response.status === 200) {
        setRegistrations(response.data);
        console.log(response.data);
      } else {
        console.error('서비스등록내역 가져오기에 실패하였습니다.', response.data);
        alert('서비스등록내역 가져오기에 실패하였습니다.');
      }
    } catch (error) {
      console.error('서비스등록내역을 불러오는 중에 문제가 발생했습니다.', error);
      if (error.response && error.response.status === 400) {
        alert('잘못된 요청 형식입니다. 다시 시도해 주세요.');
      } else {
        alert('서비스등록내역을 불러오는 중에 문제가 발생했습니다.');
      }
    }
  };

  return (
    <div className='Table'>
      <h4>서비스등록하기</h4>
      <button 
      onClick={handleServiceRegistrationClick}
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
      >서비스등록</button>
      {registrations.length === 0 ? (
        <p>서비스 등록을 신청한 이력이 없습니다.</p>
      ) : (
      <table>
  <thead>
    <tr>
      <th>서비스 이름</th>
      <th>서비스 종류</th>
      <th>상태</th>
    </tr>
  </thead>
  <tbody>
    {registrations.map((registration, index) => (
      <tr key={index}>
        <td>{registration.providerName}</td>
        <td>
          {registration.providerType === 1 ? "사진작가" : 
           registration.providerType === 2 ?  "헤어,메이크업": 
           "스튜디오"}
        </td>
        <td>
          {registration.providerStatus === 1 ? "승인" :
          registration.providerStatus === 2 ? "대기중" : 
          registration.providerStatus === 3 ? "정지" : "반려"
          }
      </td>
      </tr>
    ))}
  </tbody>
  </table>)}
  </div>
  );
}

export default ServiceRegistrationList;

