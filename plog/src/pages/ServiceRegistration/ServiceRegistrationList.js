import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Table.css';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Pagination from 'react-js-pagination';
import Modal from 'react-modal'; 
import NoData from '../../assets/noReview.png';
import remove from '../../assets/remove';
import { MdInsertPhoto } from "react-icons/md";
function ServiceRegistrationList() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const userId = localStorage.getItem('userId');
  const accessToken = localStorage.getItem('accesToken');
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 1000 ? 1 : 5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('providerName');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]); 
  Modal.setAppElement('#root');
  
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
        console.log(response.data);
      }
    } catch (error) {
      console.error('서비스등록내역을 불러오는 중에 문제가 발생했습니다.', error);
      if (error.response && error.response.status === 400) {
        alert('잘못된 요청 형식입니다. 다시 시도해 주세요.');
      } else if (error.response && error.response.status === 401) {
        remove();
        navigate('/signin', { replace: true });
        alert("로그인 만료. 다시 로그인해주세요.");
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
  const closeModal = () => {
    setModalIsOpen(false);
    setModalImages([]);
  };

  const indexOfLastRegistration = currentPage * itemsPerPage;
  const indexOfFirstRegistration = indexOfLastRegistration - itemsPerPage;
  const currentRegistrations = registrations.slice(indexOfFirstRegistration, indexOfLastRegistration);

  const ShowRegisteredPhoto = async (uuid) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/confirm/image/fileNames`,
        { 
          uuid : uuid,
        },
        {
          headers: {
            'Auth-Token': accessToken,
          },
        }
      );

      if (response.status === 200) {
        const filenames = response.data.fileNameList;
        console.log(filenames);
        const imagePromises = filenames.map(filename => 
          axios.get(`${process.env.REACT_APP_URL}/confirm/image/${filename}`, {
            headers: {
              'Auth-Token': accessToken,
            },
            responseType: 'blob',
          })
        );

        const imageResponses = await Promise.all(imagePromises);
        const imageUrls = await Promise.all(
          imageResponses.map(async (res) => {
            const newFile = new File([res.data], 'image.jpg', { type: res.data.type });
            const reader = new FileReader();
            return new Promise((resolve) => {
              reader.onload = (event) => resolve(String(event.target.result));
              reader.readAsDataURL(newFile);
            });
          })
        );

        setModalImages(imageUrls);
        setModalIsOpen(true);
      } else if (response.status === 400) {
        alert('이미지정보 가져오기에 실패하였습니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        remove();
        navigate('/signin', { replace: true });
        alert("로그인 만료. 다시 로그인해주세요.");
      } else {
        console.error('이미지정보 가져오기에 실패하였습니다.', error);
      }
    }
  };

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
          <Table style={{ width: '90%'}}>
            <Thead>
              <Tr>
                <Th>이름</Th>
                <Th>종류</Th>
                <Th>주소</Th>
                <Th>전화번호</Th>
                <Th>제출 자료</Th>
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
                    <div className='text'>{registration.providerAddress}
                    </div>
                  </Td>
                  <Td>
                    <div className='text'>{registration.providerPhoneNum}
                    </div>
                  </Td>
                  <Td>
                  <div className='text'>
                  {(registration.providerType !== 3 && registration.providerStatus===2)? (
                      <button onClick={() => ShowRegisteredPhoto(registration.providerUuid)}><MdInsertPhoto /></button>
                    ) : (
                      <span style = {{color : "white"}}>null</span>
                    )}
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
            <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ content: { height: '60%', width: '50%', margin: 'auto', marginTop : "15%" } }}>
        <div style={{ display: 'flex', marginBottom: "10px" }}>
          <button
            onClick={closeModal}
            style={{
              borderRadius: '15px',
              backgroundColor: '#162617',
              color: '#E8EEE8',
              fontWeight: 'bold',
              cursor: 'pointer',
              alignSelf: 'center'
            }}
          >
            Close
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {modalImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`등록된 사진 ${index + 1}`}
              style={{
                width: window.innerWidth < 800 ? '90%' : modalImages.length === 1 ? '50%' : '200px',
                height: window.innerWidth < 800 ? '90%' : modalImages.length === 1 ? '50%' : '200px',
                marginRight: '2px',
                marginBottom: '5px'
              }}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default ServiceRegistrationList;
