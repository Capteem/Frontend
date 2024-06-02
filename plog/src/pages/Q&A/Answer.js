import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Table.css';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Pagination from 'react-js-pagination';
import Modal from 'react-modal';
import { MdContentCopy } from "react-icons/md";

function Answer() {
  const navigate = useNavigate();
  const [complainlist, setComplainlist] = useState([]);
  const userId = localStorage.getItem('userId');
  const accessToken = localStorage.getItem('accesToken');
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 1000 ? 1 : 5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [isReply, setIsReply] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      navigate("/signin");
    } else {
      getAnswerList();
    }
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 1000 ? 1 : 5);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [accessToken, navigate]);

  const handleQuestion = () => {
    navigate('/question');
  };

  const getAnswerList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/complaint/get`, {
        params: {
          userId: userId,
        },
        headers: {
          'Auth-Token': accessToken,
        },
      });

      if (response.status === 200) {
        if(response.data !== "불만 신고가 없습니다.") {
          setComplainlist(response.data);
        }
      } else if (response.status === 400) {
        alert('Q&A리스트 가져오기에 실패하였습니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      } else {
        console.error('Q&A리스트 가져오기에 실패하였습니다.', error);
      }
    }
  };

  const openModal = (contentArray, isReply) => {
    setModalContent(contentArray);
    setIsReply(isReply);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastComplaint = currentPage * itemsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - itemsPerPage;
  const currentComplains = complainlist.slice(indexOfFirstComplaint, indexOfLastComplaint);

  return (
    <div className='Table'>
      <h4>Q&A</h4>
      <button
        onClick={handleQuestion}
        style={{
          width: '15%',
          padding: '5px',
          marginBottom: '10px',
          boxSizing: 'border-box',
          borderRadius: '15px',
          backgroundColor: '#162617',
          color: '#E8EEE8',
          fontWeight: 'bold'
        }}
      >
        질문하기
      </button>
      {complainlist.length === 0 ? (
        <p>등록된 질문이 없습니다.</p>
      ) : (
        <>
          <Table style = {{width: "70%"}}>
            <Thead>
              <Tr>
                <Th>Q&A 번호</Th>
                <Th>유형</Th>
                <Th>제목</Th>
                <Th>내용</Th>
                <Th>상태</Th>
                <Th>답변</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentComplains.map((complaint, index) => (
                <Tr key={index}>
                  <Td><div className='text'>{complaint.complaintId}</div></Td>
                  <Td><div className='text'>{complaint.complaintType === 1 ? '예약'
                    : complaint.complaintType === 2 ? '결제'
                      : complaint.complaintType === 3 ? '사기'
                        : "기타"
                  }</div></Td>
                  <Td><div className='text'>{complaint.complaintTitle}</div></Td>
                  <Td>
                  <div className='text'>
                    <button onClick={() => openModal([
                      `질문 날짜: ${new Date(complaint.complaintDate).toLocaleDateString()}`,
                      `질문 내용: ${complaint.complaintContent}`], false)}>
                      <MdContentCopy />
                    </button>
                    </div>
                  </Td>
                  <Td><div className='text'>{complaint.complaintStatus === 0 ? '처리미완료' : '처리완료'}</div></Td>
                  <Td>
                  <div className='text'>
                  {complaint.complaintAnswerTable?.complaintReplyContent ? (
                      <button onClick={() => openModal([
                        `답변 날짜: ${new Date(complaint.complaintAnswerTable.complaintReplyDate).toLocaleDateString()}`,
                        `답변 내용: ${complaint.complaintAnswerTable.complaintReplyContent}`,
                      ], true)} style={{padding : "0px 5px 0px 5px", backgroundColor : "#E8EEE8", border : "2px solid #E8EEE8"}}>
                        <MdContentCopy color='#162617'/>
                      </button>
                     ) : (
                      <span style={{color:'white'}}>null</span>
                    )}
                  </div></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={complainlist.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={{
              content: {
                height: '40%',
                width: '40%',
                margin: 'auto',
                textAlign: 'center',
                border: '1px solid #333',
                background: '#fff',
                WebkitOverflowScrolling: 'touch',
                borderRadius: '4px',
                outline: 'none',
              }
            }}
          >
            <div>
              {modalContent.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}

export default Answer;
