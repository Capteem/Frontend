import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../../styles/Table.css';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Pagination from 'react-js-pagination';
import NoData from '../../../assets/noReview.png';
import remove from '../../../assets/remove';

function ViewReservation() {
  const [reservations, setReservations] = useState([]);
  const [showCompletedReservations, setShowCompletedReservations] = useState(false);
  const [totalCompletedAmount, setTotalCompletedAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accesToken');
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 1000 ? 1 : 3);
  const [sortColumn, setSortColumn] = useState('reservationTableId');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    if (!accessToken) {
      navigate("/signin");
    } else {
      getReservationInfoList(userId);
    }
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 1000 ? 1 : 3);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [userId, showCompletedReservations, accessToken, navigate]);


  const getReservationInfoList = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/reservation/list`, {
        userId: userId
      }, {
        headers: {
          'Auth-Token': accessToken
        }
      });
      if (response.status === 200) {
        setReservations(response.data);
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
        remove();
        navigate('/signin', { replace: true });
        alert("로그인 만료. 다시 로그인해주세요.");
      } else {
        alert("예약 정보를 불러오는 중에 문제가 발생했습니다.");
      }
    }
  }

  const handleCancel = async (tid) => {
    try {
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
        remove();
        navigate('/signin', { replace: true });
        alert("로그인 만료. 다시 로그인해주세요.");
      } else {
        alert("예약 취소 중에 문제가 발생했습니다.");
      }
    }
  }

  const handleShowCompletedReservations = () => {
    setShowCompletedReservations(!showCompletedReservations);
  }

  // Pagination에서 페이지 변경시 호출되는 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (column) => {
    setCurrentPage(1); 
    setSortColumn(column);
    setSortDirection('asc');
    const sortedUsers = [...reservations].sort((a, b) => {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
      return 0;
    });
    setReservations(sortedUsers);
  };

  // Pagination을 위한 계산
  const indexOfLastReservation = currentPage * itemsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - itemsPerPage;
  const currentReservations = reservations
    .filter(reservation => showCompletedReservations ? reservation.status === 2 : true)
    .slice(indexOfFirstReservation, indexOfLastReservation);

    return (
      <div className='Table'>
        <h2>{showCompletedReservations ? '촬영 완료 내역' : '전체 예약 내역'}</h2>
        <div style={{
        display: window.innerWidth < 500 ? "": "flex",
        justifyContent: "center", 
        alignItems: "center",
        marginBottom : "10px",
        marginTop : "10px"
      }}>
        <div className="sort-buttons">
        <button className="sort" onClick={() => handleSort('reservationTableId')}>번호순</button>
        <button className="sort" onClick={() => handleSort('reservationStartDate')}>날짜순</button>
        <button className="sort" onClick={() => handleSort('status')}>상태순</button>
        <button className="sort" onClick={() => handleSort('amount')}>가격순</button>
        </div>
        <button onClick={handleShowCompletedReservations}
        style={{
          marginBottom: '10px',
          marginLeft: '15px',
        }}
        >
        {showCompletedReservations ? '전체 내역 보기' : '촬영완료 내역 보기'}
        </button>
       
        </div>
        {reservations.length === 0 ? (
          <>
           <img 
           src={NoData} 
           alt=""
           style={{
             width : "20%",
             height : "20%",
           }}
           />
           <p  style={{fontSize : window.innerWidth < "500" ? "25px": "40px", border : "bold"}}>
   예약내역이 없습니다.</p>
   </>
        ) : (
          <>
             {showCompletedReservations && (
              <div style={{ textAlign: 'right', fontWeight: 'bold', width:"80%" }}>
                총 결제금액: {totalCompletedAmount}
              </div>
            )}
            <Table style={{width : "60%"}}>
              <Thead>
                <Tr>
                  <Th>예약 번호</Th>
                  <Th>서비스 이름</Th>
                  <Th>예약한 날짜</Th>
                  <Th>총 가격</Th>
                  <Th>예약 상태</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentReservations.map((reservation, index) => (
                  <Tr key={index}>
                    <Td><div className='text'>{reservation.reservationTableId}</div></Td>
                    <Td>
                      <div className='text'>
                        {reservation.reservationCameraName && <p>사진작가 : {reservation.reservationCameraName}</p>}
                        {reservation.reservationStudioName && <p>스튜디오 : {reservation.reservationStudioName}</p>}
                        {reservation.reservationHairName && <p>헤어,메이크업 : {reservation.reservationHairName}</p>}
                      </div>
                    </Td>
                    <Td><div className='text'>{new Date(reservation.reservationStartDate).toLocaleDateString()}</div></Td>
                    <Td><div className='text'>{reservation.amount} </div></Td>
                    <Td>
                      <div className='text'>
                           {reservation.status === 0 ? '예약대기' :
                             reservation.status === 1 ? '예약확정' :
                             reservation.status === 2 ? '촬영완료' :
                             '예약취소'}
                           {(reservation.status === 0 || reservation.status === 1) && (
                             <button onClick={() => handleCancel(reservation.tid)} style={{marginLeft : "5px",}}>
                               예약취소
                               </button>
                           )}
                           {(reservation.status === 2) && (
                             <button style={{ background: "#efbb54", borderColor: "#efbb54", marginLeft : "5px", padding : "0px, ipx, 0px, 1px"}}
                             onClick={() => { navigate('/mypage/writereview', { state: reservation }); console.log(reservation); }}
                             >
                              리뷰쓰기
                              </button>
                           )}
                         </div>
                     </Td>

                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={itemsPerPage}
              totalItemsCount={reservations.filter(reservation => showCompletedReservations ? reservation.status === 2 : true).length}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
            />
          </>
        )}
      </div>
    );
    
}

export default ViewReservation;
