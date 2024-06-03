import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Table.css';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Pagination from 'react-js-pagination';
import NoData from '../../assets/noReview.png';

function ServiceRegistrationList() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const userId = localStorage.getItem('userId');
  const accessToken = localStorage.getItem('accesToken');
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 1000 ? 1 : 5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('providerName');
  
  useEffect(() => {
    if (!accessToken) {
      navigate("/signin");
    } else {
      getServiceRegistrationList(userId);
    }
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 1000 ? 1 : 5);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [accessToken, userId, navigate]);

  const handleServiceRegistrationClick = () => {
    navigate('/serviceregisteration');
  };

  const getServiceRegistrationList = async () => {
    try {
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
      }
    } catch (error) {
      console.error('서비스등록내역을 불러오는 중에 문제가 발생했습니다.', error);
      if (error.response && error.response.status === 400) {
        alert('잘못된 요청 형식입니다. 다시 시도해 주세요.');
      } else if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      } else {
        alert('서비스등록내역을 불러오는 중에 문제가 발생했습니다.');
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const sortRegistrations = (key) => {
    setSortKey(key);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (sortKey) {
      setRegistrations((prevList) => {
        return [...prevList].sort((a, b) => {
          if (a[sortKey] < b[sortKey]) {
            return -1;
          }
          if (a[sortKey] > b[sortKey]) {
            return 1;
          }
          return 0;
        });
      });
    }
  }, [sortKey]);

  const indexOfLastRegistration = currentPage * itemsPerPage;
  const indexOfFirstRegistration = indexOfLastRegistration - itemsPerPage;
  const currentRegistrations = registrations.slice(indexOfFirstRegistration, indexOfLastRegistration);

  return (
    <div className='Table'>
      <h4>서비스등록</h4>
      <div style={{
        display: "flex",
        justifyContent: "center", 
        alignItems: "center",
      }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="sort-buttons">
          <button className="sort" onClick={() => sortRegistrations('providerName')}>이름순</button>
          <button className="sort" onClick={() => sortRegistrations('providerType')}>종류순</button>
          <button className="sort" onClick={() => sortRegistrations('providerStatus')}>상태순</button>
        </div>
      </div>
      <button
        onClick={handleServiceRegistrationClick}
        style={{
          marginBottom: '10px',
          marginLeft: '15px',
        }}
      >
        서비스등록
      </button>
      </div>
      {registrations.length === 0 ? (
        <>
         <img 
         src={NoData} 
         alt=""
         style={{
           width : "20%",
           height : "20%",
         }}
         />
          <p  style={{fontSize : window.innerWidth < "500" ? "25px": "40px", border : "bold"}}>신청 이력이 없습니다.</p>
         </>
      ) : (
        <>
          <Table style={{ width: window.innerWidth <= 1000 ? '60%' : '40%'}}>
            <Thead>
              <Tr>
                <Th>서비스 이름</Th>
                <Th>서비스 종류</Th>
                <Th>상태</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentRegistrations.map((registration, index) => (
                <Tr key={index}>
                  <Td><div className='text'>{registration.providerName}</div></Td>
                  <Td>
                    <div className='text'>{registration.providerType === 1 ? "사진작가" :
                      registration.providerType === 2 ? "헤어,메이크업" :
                        "스튜디오"}
                    </div>
                  </Td>
                  <Td>
                    <div className='text'>
                      {registration.providerStatus === 1 ? "승인" :
                        registration.providerStatus === 2 ? "대기중" :
                          registration.providerStatus === 3 ? "정지" : "반려"
                      }
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={registrations.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default ServiceRegistrationList;
