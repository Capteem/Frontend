import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/Table.css';

function ViewReservation() {
  const [reservations, setReservations] = useState([]);
  const [showCompletedReservations, setShowCompletedReservations] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    getReservationInfoList(userId);
  }, [userId, showCompletedReservations]);

  const getReservationInfoList = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken'); 
      const response = await axios.post(`${process.env.REACT_APP_URL}/reservation/list`, {
        userId: userId
      }, {
        headers: {
          'Auth-Token': accessToken 
        }
      });
      if (response.status === 200) {
        setReservations(response.data); 
        console.log(response.data); 
      } else {
        alert("예약내역 가져오기에 실패하였습니다.");
      }
    } catch (error) {
      alert("예약 정보를 불러오는 중에 문제가 발생했습니다.");
    }
  }

  const handleCancel = async (tid) => {
    try {
      const accessToken = localStorage.getItem('accessToken'); 
      const response = await axios.post(`${process.env.REACT_APP_URL}/payment/refund`, {
        userId: userId, 
        tid: tid,
      });
      if (response.status === 200) {
        alert("예약을 취소하였습니다.");
        window.location.reload();
      } else {
        alert("예약 취소에 실패하였습니다.");
      }
    } catch (error) {
      alert("예약 취소 중에 문제가 발생했습니다.");
    }
  }

  const handleShowCompletedReservations = () => {
    setShowCompletedReservations(!showCompletedReservations);
  }

  return (
    <div className='Table'>
      <h2>예약 내역</h2>
      <button onClick={handleShowCompletedReservations}>
        {showCompletedReservations ? '전체 내역 보기' : '촬영완료 내역 보기'}
      </button>
      <table>
        <thead>
          <tr>
            <th>예약 ID</th>
            <th>서비스 제공자</th>
            <th>예약한 날짜</th>
            <th>총 가격</th>
            <th>예약 상태</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {reservations.filter(reservation => 
            showCompletedReservations ? reservation.status === 2 : true
          ).map((reservation, index) => (
            <tr key={index}>
              <td>{reservation.reservationTableId}</td>
              <td>
                {
                  <div>
                    {reservation.reservationCameraName && <p>사진작가 : {reservation.reservationCameraName}</p>}
                    {reservation.reservationStudioName && <p>스튜디오 : {reservation.reservationStudioName}</p>}
                    {reservation.reservationHairName && <p>헤어,메이크업 : {reservation.reservationHairName}</p>}
                  </div>
                }
              </td>
              <td>{new Date(reservation.reservationStartDate).toLocaleString()}</td>
              <td>{reservation.amount}</td>
              <td>
                {reservation.status === 0 ? '예약대기' :
                 reservation.status === 1 ? '예약확정' :
                 reservation.status === 2 ? '촬영완료' :
                 '예약취소'}
              </td>
              <td>
                {(reservation.status === 0 || reservation.status === 1) && (
                  <button onClick={() => handleCancel(reservation.tid)}>
                    예약취소
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewReservation;
