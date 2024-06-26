import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { FaRegArrowAltCircleUp, FaArrowLeft } from "react-icons/fa";
import NoData from '../../assets/noReview.png';
import remove from '../../assets/remove';

function ChatRoom() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const providerId = queryParams.get('providerId');
  const providerName = queryParams.get('providerName');
  const userId = queryParams.get('userId');
  const role = queryParams.get('role');
  const roomId = queryParams.get('roomId');
  const userNickname = queryParams.get('userNickName') || localStorage.getItem('userNickname');
  const accessToken = localStorage.getItem('accesToken');
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [chatList, setChatList] = useState([]);
  const [chat, setChat] = useState('');
  const client = useRef(null);
  const messagesEndRef = useRef(null);
  const sender = role === 'USER' ? userNickname : providerName;

  useEffect(() => {
    if (!accessToken) {
      navigate("/signin");
    }
    if (!roomId) {
      createChatRoom();
    } else {
      fetchMessages();
    }
    connectWebSocket();
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      disconnectWebSocket();
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const createChatRoom = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/ch`,
        {
          userId: userId,
          userNickName: userNickname,
          providerId: providerId,
          providerName: providerName,
          creationDate: new Date().toISOString(),
        },
        {
          headers: {
            'Auth-Token': accessToken
          }
        }
      );
      if (response.status === 200) {
        const newRoomId = response.data.roomId;
        navigate(`/chattingroom?userId=${userId}&roomId=${newRoomId}&providerId=${providerId}&providerName=${providerName}&role=USER`);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        remove();
        navigate('/signin', { replace: true });
        alert("로그인 만료. 다시 로그인해주세요.");
      } else if (error.response && error.response.status === 409) {
        console.log("채팅방이 존재합니다");
        navigate(`/chatlist?userId=${userId}&filterId=${providerId}`);
      } else {
        console.error('Failed to create chat room.', error);
      }
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/ch/${roomId}`, {
        headers: {
          'Auth-Token': accessToken
        }
      });
      if (response.status === 200) {
        setChatList(response.data.chatMessageDtoList || []);
        console.log("Fetched messages:", response.data.chatMessageDtoList);
      } else {
        alert("Failed to fetch chat messages.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        remove();
        navigate('/signin', { replace: true });
        alert("로그인 만료. 다시 로그인해주세요.");
      } else if (error.response && error.response.status === 404) {
        console.log("채팅방이 존재하지 않습니다.");
      } else {
        console.error('Failed to fetch chat messages.', error);
      }
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS(`${process.env.REACT_APP_URL}/chat`);
    client.current = Stomp.over(socket);
    client.current.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      subscribeToChannel();
    }, (error) => {
      console.error('Error connecting to WebSocket:', error);
    });
  };

  const disconnectWebSocket = () => {
    if (client.current) {
      client.current.disconnect(() => {
        console.log('Disconnected');
      });
    }
  };

  const subscribeToChannel = () => {
    client.current.subscribe(`/room/${roomId}`, (message) => {
      const newMessage = JSON.parse(message.body);
      setChatList((prevChatList) => [...prevChatList, newMessage]);
    });
  };

  const sendMessage = () => {
    if (!roomId) {
      alert("채팅방을 생성할 수 없습니다.");
      navigate(-1);
    }

    if (chat && client.current) {
      const chatMessage = {
        roomId: roomId,
        sender: sender,
        senderType: role,
        message: chat,
        sendDate: new Date().toISOString().split('.')[0],
      };
      console.log("Sending message:", chatMessage);
      client.current.send(`/send/${roomId}`, {}, JSON.stringify(chatMessage));
      setChat('');
    }
  };

  const handleChangePage = () => {
    navigate(-1);
    disconnectWebSocket();
  }

  return (
    <div className="multi">
      <div style={{ display: "flex" }}>
        <button
          style={{ border: "none", width: "20%", height: "20%", marginBottom: "20px" }}
          onClick={handleChangePage}
        ><FaArrowLeft /></button>
        <h4 style={{ marginTop: "5px", marginLeft: "10px" }}>{(role === "USER" || !role) ? providerName : userNickname}</h4>
      </div>
      <label
        style={{
          height: "350px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {chatList.length === 0 ? (
          <img
            src={NoData}
            alt="No Data"
            style={{ width: "50%", height: "50%" }}
          />
        ) : (
          <div id="messageArea">
            {chatList.map((message, index) => (
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    role === "USER"
                      ? message.senderType === "USER"
                        ? "flex-end"
                        : "flex-start"
                      : message.senderType === "PROVIDER"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: "10px",
                }}
                key={index}
              >
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: message.senderType === "USER" ? "#162617" : "#E8EEE8",
                    color: message.senderType === "USER" ? "white" : "black",
                    fontSize: "15px",
                    maxWidth: "60%",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {message.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </label>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          id="message"
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          placeholder="message"
        />
        <button onClick={sendMessage} style={{ border: "none", width: "20%" }}><FaRegArrowAltCircleUp /></button>
      </div>
    </div>
  );
}

export default ChatRoom;
