import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; 
import { MdInsertPhoto } from "react-icons/md";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Pagination from 'react-js-pagination';
import { IoSearch } from "react-icons/io5";

Modal.setAppElement('#root');

function ServiceManagement() {
  const [servicelist, setServicelist] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]); 
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accesToken');
  const role = localStorage.getItem('role');
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 1000 ? 1 : 5);
  const [searchQuery, setSearchQuery] = useState(''); 
 
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
 
  

  useEffect(() => {
    if (!accessToken) {
      navigate('/signin');
    } else if (role !== 'ADMIN') {
      navigate("/");
    } else {
      getServiceList();
    }
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 1000 ? 1 : 5);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [accessToken, navigate, role]);

  const getServiceList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/admin/provider`, {
        params: {
          adminId: userId,
        },
        headers: {
          'Auth-Token': accessToken,
        },
      });

      if (response.status === 200) {
        setServicelist(response.data);
        console.log(response.data);
      } else if (response.status === 400) {
        alert('서비스리스트 가져오기에 실패하였습니다.');
      } 
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      } else {
        console.error('서비스리스트 가져오기에 실패하였습니다.', error);
      }
    }
  };

  const handleStatusChange = (providerId, providerStatus) => {
    setSelectedStatus((prevState) => ({
      ...prevState,
      [providerId]: providerStatus,
    }));
  };

  const ServiceStateChange = async (userId, providerId, providerName, providerStatus) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/admin/provider/change`,
        {
          userId: userId,
          providerId: providerId,
          providerStatus: selectedStatus[providerId] || providerStatus,
        },
        {
          headers: {
            'Auth-Token': localStorage.getItem('accesToken'),
          },
        }
      );

      if (response.status === 200) {
        alert(`${providerName}의 상태를 ${getStatusText(selectedStatus[providerId] || providerStatus)}로 변경하였습니다.`);
        window.location.reload();
      } else if (response.status === 400) {
        alert('서비스 상태 변경을 실패하였습니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      } 
      else if (error.response && error.response.status === 400) {
        alert('서비스 상태 변경을 실패하였습니다.');
        window.location.reload();
      } 
      else {
        console.error('서비스 상태 변경을 실패하였습니다.', error);
      }
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case '1':
        return '활성화';
      case '2':
        return '대기';
      case '3':
        return '정지';
      case '4':
        return '차단';
      default:
        return '';
    }
  };

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
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      } else {
        console.error('이미지정보 가져오기에 실패하였습니다.', error);
      }
    }
  };
  
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const sortServiceList = (column) => {
    const sortedList = [...servicelist].sort((a, b) => {
      switch (column) {
        case 'serviceName':
          return a.providerName.localeCompare(b.providerName);
        case 'serviceType':
          return a.providerType - b.providerType;
        case 'status':
          return a.providerStatus - b.providerStatus;
        case 'serviceId':
          return a.providerId - b.providerId;
        default:
          return 0;
      }
    });

    setServicelist(sortedList);
  };

  const handleSort = (column) => {
    sortServiceList(column);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalImages([]);
  };

  const filteredServices = servicelist.filter((service) => {
    const id = service.userId.id.toLowerCase();
    const serviceName = service.providerName.toLowerCase();
    const serviceType = service.providerType.toString();
    const status = service.providerStatus.toString();
    const serviceId = service.providerId.toString();

    return (
      id.includes(searchQuery.toLowerCase()) ||
      serviceName.includes(searchQuery.toLowerCase()) ||
      serviceType.includes(searchQuery.toLowerCase()) ||
      status.includes(searchQuery.toLowerCase()) ||
      serviceId.includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastService = currentPage * itemsPerPage;
  const indexOfFirstService = indexOfLastService - itemsPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

  return (
    <div className='Table'>
      <h4>서비스 관리</h4>
      <div style={{
      display: "flex",
      justifyContent: "center", 
      alignItems: "center", 
      }}>
        <div className="search" style={{ position: "relative" }}>
          <IoSearch style={{ position: "absolute", top: "20%", left: "5%", zIndex: 1 }} />
          <input
            type="text"
            placeholder="검색"
            value={searchQuery}
            onChange={handleSearch}
            style={{
              padding: "3px",
              paddingLeft: "25px",
              textAlign: "center",
              border: "1px solid #162617",
              marginRight: "10px"
            }}
          />
        </div>
        <div className="sort-buttons">
          <button className="sort" onClick={() => handleSort('serviceName')}>이름순</button>
          <button className="sort" onClick={() => handleSort('serviceType')}>종류순</button>
          <button className="sort" onClick={() => handleSort('status')}>상태순</button>
          <button className="sort" onClick={() => handleSort('serviceId')}>서비스아이디순</button>
        </div>
      </div>
      {servicelist.length === 0 ? (
        <p>등록된 유저가 없습니다.</p>
      ) : filteredServices.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>아이디</Th>
                <Th>서비스 아이디</Th>
                <Th>서비스 이름</Th>
                <Th>서비스 종류</Th>
                <Th>제출자료</Th>
                <Th>상태</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentServices.map((serviceinfo, index) => (
                <Tr key={index}>
                  <Td><div className='text'>{serviceinfo.userId.id}</div></Td>
                  <Td><div className='text'>{serviceinfo.providerId}</div></Td>
                  <Td><div className='text'>{serviceinfo.providerName}</div></Td>
                  <Td>
                  <div className='text'>{serviceinfo.providerType === 1
                      ? '사진작가'
                      : serviceinfo.providerType === 2
                      ? '헤어,메이크업'
                      : '스튜디오'}
                  </div>
                  </Td>
                  <Td>
                  <div className='text'>
                    {serviceinfo.providerType !== 3 ? (
                      <button onClick={() => ShowRegisteredPhoto(serviceinfo.providerUuid)}><MdInsertPhoto /></button>
                    ) : (
                      <span style = {{color : "white"}}>null</span>
                    )}
                  </div>
                  </Td>
                  <Td>
                  <div className='text'>
                    <select
                      value={selectedStatus[serviceinfo.providerId] || serviceinfo.providerStatus}
                      onChange={(e) => handleStatusChange(serviceinfo.providerId, e.target.value)}
                    >
                      <option value='1'>활성화</option>
                      <option value='2'>대기</option>
                      <option value='3'>정지</option>
                      <option value='4'>차단</option>
                    </select>
                    <button
                      onClick={() =>
                        ServiceStateChange(serviceinfo.userId.id, serviceinfo.providerId, serviceinfo.providerName, serviceinfo.providerStatus)
                      }
                    >
                      상태변경
                    </button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={filteredServices.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        </>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ content: { height: '67%', width: '50%', margin: 'auto' } }}>
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
                width: window.innerWidth < 800 ? '200px' : modalImages.length === 1 ? '450px' : '200px',
                height: window.innerWidth < 800 ? '200px' : modalImages.length === 1 ? '400px' : '200px',
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

export default ServiceManagement;