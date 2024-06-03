import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import * as StompJs from '@stomp/stompjs';
import { useSelector } from "react-redux";

import { FaRegArrowAltCircleUp } from "react-icons/fa";
import { GiPaperFrog } from "react-icons/gi";

function ChatRoom() {
  // 메시지들 저장
  const [chatList, setChatList] = useState([]);
  // 보낼 메시지 저장
  const [chat, setChat] = useState('');
  // 채팅방 번호
  const { apply_id } = useParams();
  // STOMP 클라이언트를 위한 ref. 웹소켓 연결을 유지하기 위해 사용
  const client = useRef(null);
  // Redux store에서 현재 사용자 정보 가져오기
  const currentUser = useSelector((state) => state.user);
  // 채팅 메시지 목록의 끝을 참조하는 ref. 이를 이용해 새 메시지가 추가될 때 스크롤을 이동
  const messagesEndRef = useRef(null);

  useEffect(() => {
    connect();
    fetchMessages();
    // 컴포넌트 언마운트 시 웹소켓 연결 해제
    return () => disconnect();
  }, [apply_id]);

  // 메시지 목록이 업데이트될 때마다 스크롤을 최하단으로 이동시키는 함수
  useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 웹소켓 연결 설정
  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: `${process.env.REACT_APP_URL}/chat`, // 환경 변수에서 URL 가져오기
      onConnect: () => {
        console.log('WebSocket connected');
        subscribe();
      },
      debug: function (str) {
        console.log(new Date(), str);
      },
    });
    client.current.activate();
  };

  // 웹소켓 연결 해제
  const disconnect = () => {
    if (client.current) {
      client.current.deactivate();
    }
  };

  // 기존 채팅 메시지를 서버로부터 가져오는 함수
  const fetchMessages = () => {
    axios.get(`/api/chatroom/${apply_id}/messages`)
      .then((response) => {
        console.log("메시지 목록", response.data);
        setChatList(response.data);
      })
      .catch((error) => console.error("Failed to fetch chat messages.", error));
  };

  // 채널 구독하기
  const subscribe = () => {
    client.current.subscribe(`/room/${apply_id}`, (message) => {
      const newMessage = JSON.parse(message.body);
      setChatList((prevChatList) => [...prevChatList, newMessage]);
    });
  };

  // 메시지 보내기
  const publish = (chat) => {
    if (!client.current || !client.current.connected || !chat) return;
    client.current.publish({
      destination: '/send/room/roomid',
      body: JSON.stringify({
        applyId: apply_id,
        chat: chat,
        senderSeq: currentUser.userSeq,
        sender: currentUser.userId,
      }),
    });
    setChat(''); // 입력 필드 초기화
  };

  return (
    <div>
      {/* 상단 네비게이션 */}
      <div>
        <span>상대방 이름</span>
        <GiPaperFrog onClick={() => console.log('Report')} />
      </div>

      {/* 채팅 리스트 */}
      <div>
        {chatList.map((msg, index) => (
          <div key={index}>{msg.chat}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 하단 입력폼 */}
      <form onSubmit={(e) => { e.preventDefault(); publish(chat); }}>
        <FaRegArrowAltCircleUp />
        <div>
          <div>
            <input
              type="text"
              id="msg"
              value={chat}
              placeholder="메시지 보내기"
              onChange={(e) => setChat(e.target.value)}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  publish(chat);
                }
              }}
            />
          </div>
          <FaRegArrowAltCircleUp
            value="전송"
            onClick={() => publish(chat)}
          />
        </div>
      </form>
    </div>
  );
}

export default ChatRoom;
