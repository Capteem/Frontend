import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Add this if using react-modal

function ServiceManagement() {
  const [servicelist, setServicelist] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]); // Change to an array to store multiple images
  const userId = localStorage.getItem('userId');
  const navigator = useNavigate();
  const accessToken = localStorage.getItem('accesToken');

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!accessToken) {
      navigator('/signin');
    } else if (role !== 'ADMIN') {
      navigator(-1);
    } else {
      getServiceList();
    }
  }, [accessToken, navigator]);

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
        navigator('/signin', { replace: true });
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
      } else if (response.status === 400) {
        alert('서비스 상태 변경을 실패하였습니다.');
      } else if (response.status === 401) {
        navigator('/signin');
      }
    } catch (error) {
      console.error('서비스 상태 변경을 실패하였습니다.', error);
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

  const ShowRegisteredPhoto = async (userId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/confirm/image/fileNames`,
        { userId },
        {
          headers: {
            'Auth-Token': accessToken,
          },
        }
      );

      if (response.status === 200) {
        const filenames = response.data.fileNameList;
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
        navigator('/signin', { replace: true });
      } else {
        console.error('이미지정보 가져오기에 실패하였습니다.', error);
      }
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalImages([]);
  };

  return (
    <div className='Table'>
      <h4>서비스 관리</h4>
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
                  {serviceinfo.providerType === 1
                    ? '사진작가'
                    : serviceinfo.providerType === 2
                    ? '스튜디오'
                    : '헤어,메이크업'}
                </td>
                <td>
                  {serviceinfo.providerType !== 2 && serviceinfo.providerStatus === 2 ? (
                    <button onClick={() => ShowRegisteredPhoto(serviceinfo.userId.id)}>등록사진보기</button>
                  ) : (
                    ''
                  )}
                </td>
                <td>
                  <select
                    value={selectedStatus[serviceinfo.providerId] || serviceinfo.providerStatus}
                    onChange={(e) => handleStatusChange(serviceinfo.providerId, e.target.value)}
                  >
                    <option value='1'>활성화</option>
                    <option value='2'>대기</option>
                    <option value='3'>정지</option>
                    <option value='4'>차단</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() =>
                      ServiceStateChange(serviceinfo.userId.id, serviceinfo.providerId, serviceinfo.providerName, serviceinfo.providerStatus)
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
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>등록된 사진</h2>
        {modalImages.map((image, index) => (
          <img key={index} src={image} alt={`등록된 사진 ${index + 1}`} />
        ))}
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}

export default ServiceManagement;
