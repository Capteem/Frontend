import React, { useState, useEffect } from 'react'
import axios from 'axios';

function ServiceManagement() {
const [servicelist, setServicelist] = useState([]);
const [selectedStatus, setSelectedStatus] = useState({});
const userId = localStorage.getItem('userId');

useEffect(() => {
  getServiceList();
}, []);

const getServiceList = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.get(`${process.env.REACT_APP_URL}/admin/provider`, {
      params: {
        adminId: userId,
      },
      headers: {
        'Auth-Token': accessToken,
      },
    });

    if (response.status === 200) {
      console.log(response.data);
      setServicelist(response.data);
    } else if (response.status === 400) {
      alert('서비스리스트 가져오기에 실패하였습니다.');
    }
  } catch (error) {
    console.error('서비스리스트 가져오기에 실패하였습니다.', error);
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
    const response = await axios.post(`${process.env.REACT_APP_URL}/admin/provider/change`, {
      userId: userId,
      providerId: providerId,
      providerStatus: selectedStatus[providerId] || providerStatus,
    });
    
    if (response.status === 200) {
      //1 활성화 2 대기 3 정지 4 차단
      alert(`${providerName}의 상태를 ${(selectedStatus[providerId] || providerStatus) === '1' ? '활성화' : 
      (selectedStatus[providerId] || providerStatus) === '2' ? '대기' : 
      (selectedStatus[providerId] || providerStatus) === '3' ? '정지' : 
      '차단'}로 변경하였습니다.`);
    } else if (response.status === 400) {
      alert('서비스 상태 변경을 실패하였습니다.');
    }
  } catch (error) {
    console.error('서비스 상태 변경을 실패하였습니다.', error);
  }
};

return (
  <div className='Table'>
    <h4>서비스관리 관리</h4>
    {servicelist.length === 0 ? (
      <p>등록된 유저가 없습니다.</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>사용자 아이디</th>
            <th>서비스제공자 아이디</th>
            <th>서비스 이름</th>
            <th>서비스 종류</th>
            <th>제출자료</th>
            <th>상태</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {servicelist.map((serviceinfo, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{serviceinfo.userId.id}</td>
              <td>{serviceinfo.providerId}</td>
              <td>{serviceinfo.providerName}</td>
              <td>
                {serviceinfo.providerType === 0
                  ? "사진작가"
                  : serviceinfo.providerType === 1
                  ? "스튜디오"
                  : "헤어,메이크업"}
              </td>
              <td>제출자료api</td>
              <td>
                <select
                  value={
                    selectedStatus[serviceinfo.providerId] ||
                    serviceinfo.providerStatus
                  }
                  onChange={(e) =>
                    handleStatusChange(serviceinfo.providerId, e.target.value)
                  }
                >
                  <option value="1">활성화</option>
                  <option value="2">대기</option>
                  <option value="3">정지</option>
                  <option value="4">차단</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() =>
                    ServiceStateChange(
                      serviceinfo.userId.id,
                      serviceinfo.providerId,
                      serviceinfo.providerName,
                      serviceinfo.providerStatus
                    )
                  }
                >
                  상태변경
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
}
export default ServiceManagement

