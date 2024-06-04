import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaFrog } from "react-icons/fa";
import axios from 'axios';
import NoData from '../../assets/noReview.png';
import Pagination from 'react-js-pagination';

function ChatList() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const providerId = queryParams.get('providerId');
  const userId = queryParams.get('userId');
  const accessToken = localStorage.getItem('accesToken');
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [chatlist, setChatList] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingComplaintIndex, setEditingComplaintIndex] = useState(-1);

  useEffect(() => {
    if (!accessToken || localStorage.getItem('userId') !== userId) {
      navigate("/signin");
    } else {
      if (providerId === null) {
        getUserChatList();
      } else {
        getProviderChatList();
      }
    }
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [accessToken, navigate]);

  const getUserChatList = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/ch/user`,
        {
          "userId": `${userId}`
        },
        {
          headers: {
            'Auth-Token': accessToken
          }
        }
      );
      if (response.status === 200) {
        setChatList(response.data.chatRoomDtoList);
        console.log(response.data.chatRoomDtoList);
      } else {
        alert("사용자 채팅리스트 가져오기에 실패하였습니다.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      }
      else if (error.response && error.response.status === 409) {
        alert("채팅방이 존재하지 않습니다");
      }
      else {
        console.error('사용자 채팅리스트 가져오기에 실패하였습니다.', error);
      }
    }
  }

  const getProviderChatList = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/ch/provider`,
        {
          "providerId": `${providerId}`
        },
        {
          headers: {
            'Auth-Token': accessToken
          }
        }
      );
      if (response.status === 200) {
        setChatList(response.data.chatRoomDtoList);
        console.log(response.data.chatRoomDtoList);
      } else {
        alert("제공자 채팅리스트 가져오기에 실패하였습니다.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      }
      else if (error.response && error.response.status === 409) {
        alert("채팅방이 존재하지 않습니다");
      }
      else {
        console.error('제공자 채팅리스트 가져오기에 실패하였습니다.', error);
      }
    }
  }

  const deleteChatRoom = async (roomId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_URL}/ch/${roomId}`,
        {
          headers: {
            'Auth-Token': accessToken
          }
        }
      );
      if (response.status === 200) {
        window.location.reload();
      } else {
        alert("채팅 삭제에 실패하였습니다.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      }
      else if (error.response && error.response.status === 404) {
        alert("채팅방이 존재하지 않습니다");
      }
      else {
        console.error('채팅 삭제에 실패하였습니다.', error);
      }
    }
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = chatlist.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className='multi'>
      <h4>1:1채팅방 리스트</h4>
      {chatlist.length === 0 ? (
        <>
          <img
            src={NoData}
            alt=""
            style={{ width: "40%", height: "40%" }}
          />
          <p style={{ fontSize: window.innerWidth < "500" ? "25px" : "40px", border: "bold" }}>채팅방이 없습니다.</p>
        </>
      ) : (
        <>
          {currentItems.map(chatRoom => (
            <div key={chatRoom.roomId} style={{ marginBottom: "5px", padding: "10px", border: "1px solid #ccc ", borderRadius: "8px", background: "white" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#4CAF50", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <FaFrog style={{ color: "white", fontSize: "24px" }} />
                </div>
                <p style={{ marginLeft: "10px", flex: 1 }}>
                  {chatRoom.providerId === parseInt(providerId) ? chatRoom.userNickName : chatRoom.providerName}
                </p>
                <div>
                  <button
                    style={{ margin: "0px", padding: "0px", width: "70%", paddingBottom: "1px",  paddingTop: "1px", border: "none" }}
                    onClick={() => navigate(`/chattingroom?userId=${userId}&roomId=${chatRoom.roomId}`)}>참여</button>
                  <button
                    style={{ margin: "0px", padding: "0px", width: "70%", paddingTop: "1px",paddingBottom: "1px", border: "none" }}
                    onClick={() => deleteChatRoom(chatRoom.roomId)}>삭제</button>
                </div>
              </div>
            </div>
          ))}
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={chatlist.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default ChatList;
