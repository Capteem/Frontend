import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Table.css';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sendList } = location.state || {};
    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('accesToken');

    console.log('sendList:', sendList);

    const [paymentInfo, setPaymentInfo] = useState(null);
    

    useEffect(() => {
        if (!accessToken) {
          navigate("/signin");
        } else {
            PaymentReady();
        }
      }, [accessToken, navigate]);

    const PaymentReady = async () => {
        try {
            // 결제 준비 API 호출
            const response = await axios.post(`${process.env.REACT_APP_URL}/payment/ready`, sendList[0],
                {
                    headers:{
                        'Auth-Token' : localStorage.getItem('accesToken')
                      },
                }
            );
            if (response.status === 200) {
                console.log(response.data);
                console.log(response.data.next_redirect_pc_url);
                window.open(response.data.next_redirect_pc_url, '_blank', 'width=500,height=700');
            } else if (response.status === 400) {
                alert("결제 준비 중 문제가 발생했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("로그인 만료. 다시 로그인해주세요.");
                navigate('/signin', { replace: true });
              } else {
                console.error('결제 준비 중 오류가 발생했습니다:', error);
              }
            return false;
        }
    };
    const handlepaymentinfo = async () => {
        try {
            // 결제 정보 API 호출
            const response = await axios.get(`${process.env.REACT_APP_URL}/payment/success/info`,{
                headers:{
                    'Auth-Token' : localStorage.getItem('accesToken')
                },
                params: {
                    userId: userId,
                },
            });
            if (response.status === 200) {
                setPaymentInfo(response.data);
                console.log(response.data);
            } else {
                alert("결제 정보를 가져오는 중 문제가 발생했습니다.");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("로그인 만료. 다시 로그인해주세요.");
                navigate('/signin', { replace: true });
              } else {
                console.error('결제 정보 가져오기 중 오류가 발생했습니다:', error);
            }
        }
    };

    return (
        <div className='Table'>
            <button
                onClick={handlepaymentinfo}
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
                결제완료
            </button>
            {paymentInfo && (
                <div>
                    <h2>결제 정보</h2>
                    <Table>
                        <Tbody>
                            <Tr>
                                <Th>결제 날짜</Th>
                                <Td>{new Date(paymentInfo.paymentDate).toLocaleString()}</Td>
                            </Tr>
                            <Tr>
                                <Th>결제 금액</Th>
                                <Td>{paymentInfo.paymentAmount}원</Td>
                            </Tr>
                            <Tr>
                                <Th>결제 방식</Th>
                                <Td>{paymentInfo.paymentType}</Td>
                            </Tr>
                            <Tr>
                                <Th>카카오 포인트</Th>
                                <Td>{paymentInfo.paymentPoint}</Td>
                            </Tr>
                            <Tr>
                                <Th>결제 ID</Th>
                                <Td>{paymentInfo.paymentId}</Td>
                            </Tr>
                            <Tr>
                                <Th>결제 상태</Th>
                                <Td>
                                    {paymentInfo.paymentStatus === 1 ? "결제완료" :
                                        paymentInfo.paymentStatus === 2 ? "결제취소" :
                                            "결제실패"
                                    }
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </div>
            )}
        </div>
    );
}

export default Payment;
