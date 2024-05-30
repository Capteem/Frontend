import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/Table.css';
import ServiceDropdown from './ServiceDropdown'; 
import { useNavigate } from 'react-router-dom';

function ServiceList() {
  const [serviceList, setserviceList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    getServiceList();
  }, []);

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
        setserviceList(response.data); 
        console.log(response.data); 
      } else {
        alert("서비스리스트 가져오기에 실패하였습니다.");
      }
    } catch (error) {
      if(error.response.status === 401){
        alert("로그인 만료. 다시 로그인해주세요.")
        navigate('/signin', { replace: true });
      }else{
        console.log(error);
      }
    }
  }

  return (
    <div className='Table'>
    <h4>서비스리스트</h4>
    {serviceList.length === 0 ? (
      <p>서비스가 없습니다.</p>
    ) : (
    <table>
<thead>
  <tr>
    <th>번호</th>
    <th>서비스 이름</th>
    <th>서비스 종류</th>
    <th>서비스 주소</th>
    <th>서비스 전화번호</th>
    <th></th>
  </tr>
</thead>
<tbody>
  {serviceList.map((service, index) => (
    <tr key={index}>
      <td>{index+1}</td>
      <td>{service.providerName}</td>
      <td>
        {service.providerType === 1 ? "사진작가" : 
         service.providerType === 2 ? "스튜디오" : 
         "헤어,메이크업"}
      </td>
      <td>{service.providerAddress}</td>
      <td>{service.providerPhoneNum}</td>
      <td>
      <div className="dropdown">
                  <ServiceDropdown 
                    isOpen={isDropdownOpen}
                    toggleDropdown={toggleDropdown}
                    providerId = {service.providerId}
                  />
                </div>
      </td>
    </tr>
  ))}
</tbody>
</table>)}
</div>
);
}

export default ServiceList;