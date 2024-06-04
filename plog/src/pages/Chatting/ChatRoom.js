import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import * as StompJs from '@stomp/stompjs';
import { useSelector } from "react-redux";

function ChatRoom() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const providerId = queryParams.get('providerId');
  const providerName = queryParams.get('providerName');
  const userId = queryParams.get('userId');
  const roomId = queryParams.get('roomId');
  const userNickname = localStorage.getItem('userNickname');
  const accessToken = localStorage.getItem('accesToken');
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [chatList, setChatList] = useState([]);
  const [chat, setChat] = useState('');
  //const { roomId } = useParams();
  const client = useRef(null);
  const currentUser = useSelector((state) => state.user);
  const messagesEndRef = useRef(null);
  console.log(roomId);

  useEffect(() => {
    if (roomId === null) {
      // roomid가 없으면 채팅방 생성 API를 호출하여 새로운 채팅방 생성
      createChatRoom();
    } else {
      // roomid가 있으면 채팅 메시지를 불러옴
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const createChatRoom = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/ch`,
        {
          "userId": userId,
          "userNickName": userNickname,
          "providerId": providerId,
          "providerName": providerName,
          "creationDate" : new Date().toISOString(),
        },
        {
          headers: {
            'Auth-Token': accessToken
          }
        }
      );
      if (response.status === 200) {
        const newRoomId = response.data.roomId;
        navigate(`/chattingroom?userId=${userId}&roomId=${newRoomId}`);
      } else {
        alert("채팅방 생성에 실패하였습니다.");
      }
    } catch (error) {
      console.error('채팅방 생성에 실패하였습니다.', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get( `wss://api.picturewithlog.com/ch/${roomId}`);
      if (response.status === 200) {
        setChatList(response.data.chatMessageDtoList);
        console.log(response.data.chatMessageDtoList);
      } else {
        alert("채팅 메시지 불러오기에 실패하였습니다.");
      }
    } catch (error) {
      console.error('채팅 메시지 불러오기에 실패하였습니다.', error);
    }
  };

  const connectWebSocket = () => {
    client.current = new StompJs.Client({
      brokerURL: `wss://api.picturewithlog.com/chat`,
      onConnect: () => {
        console.log('WebSocket connected');
        subscribeToChannel();
      },
      debug: (str) => {
        console.log(new Date(), str);
      },
    });
    client.current.activate();
  };

  const disconnectWebSocket = () => {
    if (client.current) {
      client.current.deactivate();
    }
  };

  const subscribeToChannel = () => {
    client.current.subscribe(`wss://api.picturewithlog.com/ch/${roomId}`, (message) => {
      const newMessage = JSON.parse(message.body);
      setChatList((prevChatList) => [...prevChatList, newMessage]);
    });
  };

  
  const publishMessage = () => {
    if (!client.current || !client.current.connected || !chat) return;
    client.current.publish({
      destination: `wss://api.picturewithlog.com/send/${roomId}`,
      body: JSON.stringify({
        roomId: roomId,
        message: chat,
        sender: currentUser.userId,
      }),
    });
    setChat('');
  };

  return (
    <div>
      <div>
        {chatList.map((message, index) => (
          <div key={index}>
            <p>{message.sender}: {message.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input type="text" value={chat} onChange={(e) => setChat(e.target.value)} />
      <button onClick={publishMessage}>Send</button>
    </div>
  );
}

export default ChatRoom;