import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../../styles/Table.css';

function ViewReservation() {
  const [reservations, setReservations] = useState([]);
  const [showCompletedReservations, setShowCompletedReservations] = useState(false);
  const [totalCompletedAmount, setTotalCompletedAmount] = useState(0);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accesToken');
  
  useEffect(() => {
    if (!accessToken){
      navigate("/signin");
    }
    else{
      getReservationInfoList(userId);
    }
  }, [userId, showCompletedReservations, accessToken, navigate]);

  const getReservationInfoList = async () => {
    try {
      const accessToken = localStorage.getItem('accesToken'); 
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
        if (showCompletedReservations) {
          const totalAmount = response.data
            .filter(reservation => reservation.status === 2)
            .reduce((sum, reservation) => sum + reservation.amount, 0);
          setTotalCompletedAmount(totalAmount);
        }
      } else {
        alert("예약내역 가져오기에 실패하였습니다.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      } else {
        alert("예약 정보를 불러오는 중에 문제가 발생했습니다.");
      }
    }
  }

  const handleCancel = async (tid) => {
    try {
      const accessToken = localStorage.getItem('accesToken'); 
      const response = await axios.post(`${process.env.REACT_APP_URL}/payment/refund`, {
        userId: userId, 
        tid: tid,
      },
      {
        headers: {
          'Auth-Token': accessToken 
        }
      });
      if (response.status === 200) {
        alert("예약을 취소하였습니다.");
        window.location.reload();
      } else {
        alert("예약 취소에 실패하였습니다.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      } else {
        alert("예약 취소 중에 문제가 발생했습니다.");
      }
    }
  }

  const handleShowCompletedReservations = () => {
    setShowCompletedReservations(!showCompletedReservations);
  }

  return (
    <div className='Table'>
      <h2>{showCompletedReservations ? '촬영 완료 내역' : '전체 예약 내역'}</h2>
      <button onClick={handleShowCompletedReservations}>
        {showCompletedReservations ? '전체 내역 보기' : '촬영완료 내역 보기'}
      </button>
      {reservations.length === 0 ? (
      <p style={{marginTop : "10px"}}>예약내역이 없습니다.</p>
      ) : (
      <table>
        <thead>
          <tr>
            <th>예약 ID</th>
            <th>서비스 제공자</th>
            <th>예약한 날짜</th>
            <th>총 가격</th>
            <th>예약 상태</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {reservations.filter(reservation => 
            showCompletedReservations ? reservation.status === 2 : true
          ).map((reservation, index) => (
            <tr key={index}>
              <td>{reservation.reservationTableId}</td>
              <td>
                <div>
                  {reservation.reservationCameraName && <p>사진작가 : {reservation.reservationCameraName}</p>}
                  {reservation.reservationStudioName && <p>스튜디오 : {reservation.reservationStudioName}</p>}
                  {reservation.reservationHairName && <p>헤어,메이크업 : {reservation.reservationHairName}</p>}
                </div>
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
                {(reservation.status === 2) &&(
                  <button style={{background : "#efbb54", borderColor : "#efbb54"}}>
                    리뷰쓰기
                  </button>
                )}
              </td>
            </tr>
          ))}
          {showCompletedReservations && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold' }}>총 결제금액:</td>
              <td colSpan="3" style={{ fontWeight: 'bold' }}>{totalCompletedAmount}</td>
            </tr>
          )}
        </tbody>
      </table>)}
    </div>
  )
}

export default ViewReservation;
