import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../../styles/Table.css';
import ServiceDropdown from './ServiceDropdown';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Pagination from 'react-js-pagination';

function ServiceList() {
  const [serviceList, setServiceList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 1000 ? 1 : 5);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const accessToken = localStorage.getItem('accesToken');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!accessToken){
      navigate("/signin");
    }
    else if(role !== 'PROVIDER'){
      navigate("/");
    }
    else{
      getServiceList();
    }

    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 1000 ? 1 : 5);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [accessToken, navigate, role]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getServiceList = async () => {
    try {
      const accessToken = localStorage.getItem('accesToken'); 
      const response = await axios.get(`${process.env.REACT_APP_URL}/service/user/provider`, {
        headers:{
          'Auth-Token' : accessToken
        },
        params: {
          userId: userId,
        },
      });
      if (response.status === 200) {
        setServiceList(response.data); 
        console.log(response.data); 
      } else {
        alert("서비스리스트 가져오기에 실패하였습니다.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      } else {
        console.error('서비스리스트 가져오기에 실패하였습니다.', error);
      }
    }
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (key) => {
    let order = 'asc';
    if (sortKey === key && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortKey(key);
    setSortOrder(order);
    sortServiceList(key, order);
  };

  const sortServiceList = (key, order) => {
    setServiceList((prevList) => {
      const sortedList = [...prevList].sort((a, b) => {
        if (a[key] < b[key]) {
          return order === 'asc' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return order === 'asc' ? 1 : -1;
        }
        return 0;
      });
      return sortedList;
    });
  };

  const indexOfLastService = currentPage * itemsPerPage;
  const indexOfFirstService = indexOfLastService - itemsPerPage;
  const currentServices = serviceList.slice(indexOfFirstService, indexOfLastService);

  return (
    <div className='Table'>
      <h4>서비스리스트</h4>
      <div className="sort-buttons">
        <button className="sort" onClick={() => handleSort('providerName')}>이름순</button>
        <button className="sort" onClick={() => handleSort('providerType')}>종류순</button>
      </div>
      {serviceList.length === 0 ? (
        <p>서비스가 없습니다.</p>
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>번호</Th>
                <Th>서비스 이름</Th>
                <Th>서비스 종류</Th>
                <Th>서비스 주소</Th>
                <Th>서비스 전화번호</Th>
                <Th>서비스 관리</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentServices.map((service, index) => (
                <Tr key={index}>
                  <Td><div className='text'>{index + 1 + (currentPage - 1) * itemsPerPage}</div></Td>
                  <Td><div className='text'>{service.providerName}</div></Td>
                  <Td>
                    <div className='text'>
                      {service.providerType === 1 ? "사진작가" : 
                       service.providerType === 2 ? "헤어,메이크업" : 
                       "스튜디오"}
                    </div>
                  </Td>
                  <Td><div className='text'>{service.providerAddress}</div></Td>
                  <Td><div className='text'>{service.providerPhoneNum}</div></Td>
                  <Td>
                    <div className='text'>
                      <div className="dropdown">
                        <ServiceDropdown 
                          isOpen={isDropdownOpen}
                          toggleDropdown={toggleDropdown}
                          providerId={service.providerId}
                        />
                      </div>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={serviceList.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default ServiceList;
