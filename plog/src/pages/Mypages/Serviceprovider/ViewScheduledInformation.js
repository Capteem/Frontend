import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import axios from 'axios';
import '../../../styles/Table.css';
import '../../../styles/Calendar.css';
import moment from "moment";

function ViewScheduledInformation() {
  // providerid 받기
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const providerId = queryParams.get('providerId');
  //console.log(providerId);

  // 예약 정보 리스트
  const [reservationList, setreservationList] = useState([]);

  // 캘린더
  const [selectedDate, setSelectedDate] = useState(null);
  const [value, onChange] = useState(new Date());
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    getServiceReservationList();
  }, []);

  const getServiceReservationList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/service/reservation`, {
        params: {
          providerId: providerId,
        },
      });
      if (response.status === 200) {
        setreservationList(response.data);
        console.log(response.data);
      } else {
        alert("서비스예약리스트 가져오기에 실패하였습니다.");
      }
    } catch (error) {
      alert("서비스예약리스트 불러오는 중에 문제가 발생했습니다.");
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onChange(date);
  };

  const clearSelectedDate = () => {
    setSelectedDate(null);
    onChange(new Date());
    window.location.reload();

  };

  const showCompletedReservations = () => {
    setShowCompleted(true);
    setSelectedDate(null);
  };


  //예약확정
  const confirmReservation = async(reservationId) => {
    try {
      const response = axios.post(`${process.env.REACT_APP_URL}/service/accept`, null ,{ params : {reservationId : reservationId, providerId : providerId} })
      alert("예약확정에 성공하였습니다.");
      window.location.reload();
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
        alert("예약확정에 실패하였습니다.");
      } else {
        console.error(error);
        alert("예약확정 중에 문제가 발생했습니다.");
      }
    }
  }
  //촬영완료
  const completeFilming = async(reservationId) => {
    try {
      const response = axios.post(`${process.env.REACT_APP_URL}/service/complete`, null ,{ params : {reservationId : reservationId, providerId : providerId} })
      alert("촬영확정에 성공하였습니다.");
      window.location.reload();
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
        alert("촬영확정에 실패하였습니다.");
      } else {
        console.error(error);
        alert("촬영확정에 중에 문제가 발생했습니다.");
      }
    }
  }
  //취소
  const cancelReservation = async(reservationId) => {
    try {
      const response = axios.post(`${process.env.REACT_APP_URL}/service/refuse`, null ,{ params : {reservationId : reservationId, providerId : providerId} })
      alert("예약취소에 성공하였습니다.");
      window.location.reload();
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
        alert("예약취소에 실패하였습니다.");
      } else {
        console.error(error);
        alert("예약취소에 중에 문제가 발생했습니다.");
      }
    }
  }   
  
  const filteredReservations = showCompleted
  ? reservationList.filter(reservation => reservation.reservationStatus === 2)
  : selectedDate
  ? reservationList.filter(reservation => {
      const reservationDay = new Date(reservation.reservationStartTime);
      return (
        reservationDay.getFullYear() === selectedDate.getFullYear() &&
        reservationDay.getMonth() === selectedDate.getMonth() &&
        reservationDay.getDate() === selectedDate.getDate()
      );
    })
  : reservationList;

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '5px', marginTop: '40px' }}>
      <Calendar
        onChange={handleDateChange}
        value={value}
        formatDay={(locale, date) => moment(date).format("D")}
        formatYear={(locale, date) => moment(date).format("YYYY")}
        formatMonthYear={(locale, date) => moment(date).format("YYYY MM")}
        calendarType="gregory"
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
      />
      <div className='Table' style={{ width: '100%', marginLeft: "10px" }}>
        <h4>예약정보조회</h4>
        <button
          onClick={clearSelectedDate}
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
        >전체 내역 보기</button>
        <button
          onClick={showCompletedReservations}
          style={{
            width: '15%',
            padding: '5px',
            marginBottom: '10px',
            marginLeft: '10px',
            boxSizing: 'border-box',
            borderRadius: '15px',
            backgroundColor: '#162617',
            color: '#E8EEE8',
            fontWeight: 'bold'
          }}
        >촬영 완료 내역 보기</button>
        <table>
          <thead>
            <tr>
              <th>예약 번호</th>
              <th>예약 상태</th>
              <th>날짜</th>
              <th>시작 시간</th>
              <th>끝나는 시간</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr>
              </tr>
            ) : (
              filteredReservations.map((reservation, index) => (
                <tr key={index}>
                  <td>{reservation.reservationId}</td>
                  <td>
                    {reservation.reservationStatus === 0 ? "예약 대기" :
                      reservation.reservationStatus === 1 ? "예약 확정" :
                        reservation.reservationStatus === 2 ? "촬영 완료" :
                          "예약 취소"}
                  </td>
                  <td>{new Date(reservation.reservationStartTime).toLocaleDateString('ko-KR')}</td>
                  <td>{new Date(reservation.reservationStartTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{new Date(reservation.reservationEndTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>
                    {reservation.reservationStatus === 0 && (
                      <>
                        <button onClick={() => confirmReservation(reservation.reservationId)}>예약 확정</button>
                        <button onClick={() => cancelReservation(reservation.reservationId)}>예약 취소</button>
                      </>
                    )}
                    {reservation.reservationStatus === 1 && (
                      <>
                        <button onClick={() => completeFilming(reservation.reservationId)}>촬영 완료</button>
                        <button onClick={() => cancelReservation(reservation.reservationId)}>예약 취소</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewScheduledInformation;