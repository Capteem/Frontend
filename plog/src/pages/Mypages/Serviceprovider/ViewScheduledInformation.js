import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import '../../../styles/Table.css';
import '../../../styles/Calendar.css';
import moment from "moment";
import Modal from 'react-modal';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Pagination from 'react-js-pagination';
import { FaCalendarAlt } from "react-icons/fa";
import NoData from '../../../assets/noReview.png';
import { MdCalendarToday } from "react-icons/md";

function ViewScheduledInformation() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accesToken');
  const role = localStorage.getItem('role');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [monthModalIsOpen, setMonthModalIsOpen] = useState(false);

  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  // providerid 받기
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const providerId = queryParams.get('providerId');

  // 예약 정보 리스트
  const [reservationList, setReservationList] = useState([]);

  // 캘린더
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [value, onChange] = useState(new Date());
  const [showCompleted, setShowCompleted] = useState(false);

  // 총 촬영완료된 금액
  const [profits, setProfits] = useState(0);

  // 페이징
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 1000 ? 1 : 5);

  const [showCalendarButton, setShowCalendarButton] = useState(true); // Add state for showing the calendar button

  useEffect(() => {
    if (!accessToken){
      navigate("/signin");
    }
    else if(role !== 'PROVIDER'){
      navigate("/");
    }
    else{
      getServiceReservationList();
    }

    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 1000 ? 1 : 5);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [accessToken, navigate, role]);

  const getServiceReservationList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/service/reservation`, {
        params: {
          providerId: providerId,
        },
        headers:{
          'Auth-Token' : localStorage.getItem('accesToken')
        },
      });
      if (response.status === 200) {
        setReservationList(response.data);
        console.log(response.data);
      } else {
        alert("서비스예약리스트 가져오기에 실패하였습니다.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      } else {
        alert("서비스예약리스트 불러오는 중에 문제가 발생했습니다.");
      }
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openMonthModal = () => {
    setMonthModalIsOpen(true);
  };

  const closeMonthModal = () => {
    setMonthModalIsOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedMonth(null); // Clear selected month when a date is selected
    onChange(date);
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    setSelectedDate(null); // Clear selected date when a month is selected
    onChange(date);
    closeMonthModal();
  };

  const clearSelectedDate = () => {
    setSelectedDate(null);
    setSelectedMonth(null); // Clear selected month as well
    onChange(new Date());
    setShowCompleted(false);
    setShowCalendarButton(true);
    window.location.reload();
  };

  const showCompletedReservations = () => {
    setCurrentPage(1); 
    setShowCompleted(true);
    setSelectedDate(null);
    setSelectedMonth(null); // Clear selected month as well
    setShowCalendarButton(false); // Hide the calendar button
    const completedReservations = reservationList.filter(reservation => reservation.reservationStatus === 2);
    const totalProfits = completedReservations.reduce((sum, reservation) => sum + reservation.reservationPrice, 0);
    setProfits(totalProfits);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

   // 예약확정
   const confirmReservation = async (reservationId) => {
    try {
      await axios.post(`${process.env.REACT_APP_URL}/service/accept`, null, { params: { reservationId: reservationId, providerId: providerId },
        headers:{
          'Auth-Token' : localStorage.getItem('accesToken')
        },
      });
      alert("예약확정에 성공하였습니다.");
      window.location.reload();
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
        alert("예약확정에 실패하였습니다.");
      } else {
        if (error.response && error.response.status === 401) {
          alert("로그인 만료. 다시 로그인해주세요.");
          navigate('/signin', { replace: true });
        } else {
          console.error('예약확정에 실패하였습니다.', error);
        }
      }
    }
  };

  // 촬영완료
  const completeFilming = async (reservationId) => {
    try {
      await axios.post(`${process.env.REACT_APP_URL}/service/complete`, null, { params: { reservationId: reservationId, providerId: providerId },
        headers:{
          'Auth-Token' : localStorage.getItem('accesToken')
        },
      });
      alert("촬영확정에 성공하였습니다.");
      window.location.reload();
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
        alert("촬영확정에 실패하였습니다.");
      } else {
        if (error.response && error.response.status === 401) {
          alert("로그인 만료. 다시 로그인해주세요.");
          navigate('/signin', { replace: true });
        } else {
          console.error('촬영확정에 실패하였습니다.', error);
        }
      }
    }
  };

  // 취소
  const cancelReservation = async (reservationId) => {
    try {
      await axios.post(`${process.env.REACT_APP_URL}/service/refuse`, null, { params: { reservationId: reservationId, providerId: providerId },
        headers:{
          'Auth-Token' : localStorage.getItem('accesToken')
        },
      });
      alert("예약취소에 성공하였습니다.");
      window.location.reload();
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
        alert("예약취소에 실패하였습니다.");
      } else {
        if (error.response && error.response.status === 401) {
          alert("로그인 만료. 다시 로그인해주세요.");
          navigate('/signin', { replace: true });
        } else {
          console.error('예약취소에 실패하였습니다.', error);
        }
      }
    }
  };

  const handleSort = (column) => {
    setSortColumn(column);
    setSortDirection('asc');
    const sortedReservation = [...reservationList].sort((a, b) => {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
      return 0;
    });
    setReservationList(sortedReservation);
  };

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
      : selectedMonth
        ? reservationList.filter(reservation => {
          const reservationMonth = new Date(reservation.reservationStartTime);
          return (
            reservationMonth.getFullYear() === selectedMonth.getFullYear() &&
            reservationMonth.getMonth() === selectedMonth.getMonth()
          );
        })
        : reservationList;

  const indexOfLastReservation = currentPage * itemsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - itemsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '5px', marginTop: '40px', }}>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)'
          },
          content: {
            width: '400px',
            height: '450px',
            margin: 'auto',
            border: '1px solid #ccc',
            borderRadius: '15px',
            padding: '20px'
          }
        }}
      >
        <h2>날짜 선택</h2>
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
      </Modal>
      <Modal
        isOpen={monthModalIsOpen}
        onRequestClose={closeMonthModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)'
          },
          content: {
            width: '400px',
            height: '450px',
            margin: 'auto',
            border: '1px solid #ccc',
            borderRadius: '15px',
            padding: '20px'
          }
        }}
      >
        <h2>월 선택</h2>
        <Calendar
          onChange={handleMonthChange}
          value={value}
          view="year"
          maxDetail="year"
          formatMonth={(locale, date) => moment(date).format("MMMM")}
          calendarType="gregory"
        />
      </Modal>
      <div className='Table' style={{ width: '100%', marginLeft: "10px" }}>
        <h4>예약정보조회</h4>
        <button
          onClick={clearSelectedDate}
          style={{
            marginBottom: '10px',
            marginLeft: '15px',
          }}
        >전체 내역 보기</button>
        <button
          onClick={showCompletedReservations}
          style={{
            marginBottom: '10px',
            marginLeft: '15px',
          }}
        >촬영완료 내역보기</button>
        <div className="sort-buttons">
          {showCalendarButton && (
            <>
            <button 
                onClick={openMonthModal}
                style={{
                  backgroundColor: '#E8EEE8',
                  border: "2px solid #E8EEE8"
                }}
              >
                <FaCalendarAlt style={{color : "black"}} /> <span style={{color : "black"}}>월</span>
              </button>
              <button 
                onClick={openModal}
                style={{
                  backgroundColor: '#E8EEE8',
                  border: "2px solid #E8EEE8",
                  marginRight: '10px'
                }}
              >
                <MdCalendarToday style={{color : "black"}} /> <span style={{color : "black"}}>날짜</span>
              </button>
            </>
          )}
          <button className="sort" onClick={() => handleSort('reservationStatus')}>상태순</button>
          <button className="sort" onClick={() => handleSort('reservationId')}>번호순</button>
          <button className="sort" onClick={() => handleSort('reservationPrice')}>가격</button>
        </div>

        {currentReservations.length === 0 ? (
          <>
            <img 
              src={NoData} 
              alt=""
              style={{
                width : "20%",
                height : "20%",
              }}
            />
            <p style={{fontSize : "40px", border : "bold"}}>예약 내역이 없습니다.</p>
          </>
        ) : (
          <>
            {showCompleted && (
              <div style={{ textAlign: 'right', fontWeight: 'bold', width:"90%" }}>
                총 촬영완료 금액: {profits}
              </div>
            )}
            <Table>
              <Thead>
                <Tr>
                  <Th>예약 번호</Th>
                  <Th>예약 상태</Th>
                  <Th>날짜</Th>
                  <Th>시작 시간</Th>
                  <Th>끝나는 시간</Th>
                  <Th>가격</Th>
                  <Th>상태 변경</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentReservations.map((reservation, index) => (
                  <Tr key={index}>
                    <Td><div className='text'>{reservation.reservationId}</div></Td>
                    <Td>
                      <div className='text'>{reservation.reservationStatus === 0 ? "예약대기" :
                        reservation.reservationStatus === 1 ? "예약확정" :
                          reservation.reservationStatus === 2 ? "촬영완료" :
                            "예약취소"}</div>
                    </Td>
                    <Td><div className='text'>{new Date(reservation.reservationStartTime).toLocaleDateString('ko-KR')}</div></Td>
                    <Td><div className='text'>{new Date(reservation.reservationStartTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</div></Td>
                    <Td><div className='text'>{new Date(reservation.reservationEndTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</div></Td>
                    <Td><div className='text'>{reservation.reservationPrice}</div></Td>
                    <Td>
                      <div className='text'>
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
                        {reservation.reservationStatus !== 0 && reservation.reservationStatus !== 1 && (
                          <span style={{color : "white"}}>null</span>
                        )}
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        )}
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={filteredReservations.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default ViewScheduledInformation;

