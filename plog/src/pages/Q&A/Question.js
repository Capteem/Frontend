import { useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import '../../styles/multi.css';

function Question(){
    const complaintTitle = useRef();
    const complaintContent = useRef();
    const complaintType = useRef();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const [state, setState] = useState({
        complaintTitle : "",
        complaintContent : "",
        complaintType: "",
    });

    const handleSunmit = async (e) => {
        e.preventDefault();
        // 유효성 검사
        if(state.complaintTitle.length < 1){
            complaintTitle.current.focus();  
            alert("제목을 입력하세요"); 
            return; 
        };
        if(state.complaintContent.length < 1){
            complaintContent.focus();  
            alert("내용을 입력하세요"); 
            return; 
        };
        if(state.complaintType === 0){
            complaintContent.focus();  
            alert("질문종류를 선택하세요 입력하세요"); 
            return; 
        };
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_URL}/complaint/add`, {
                userId : userId,
                complaintTitle: state.complaintTitle,
                complaintContent:state.complaintContent,
                complaintDate: new Date().toISOString(),
                complaintType: state.complaintType,
            },
            {
                headers: {
                  'Auth-Token': localStorage.getItem('accesToken'),
                },
            }
        );
            
            if (response.status === 200) {
                alert("질문 등록에 성공하였습니다.");
                navigate('/answer');
            } else if (response.status === 400) {
                alert("질문 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            alert("질문 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    }

    const handleChangeState = (e) => {
        setState({
            ...state,
            [e.target.name] : e.target.value,
        }); 
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSunmit(e);
        }
    }
    

    return (
    <div className='multi'>
            <h4>질문하기</h4>
            <div>
                <select
                ref={complaintType}
                name = "complaintType"
                value={state.complaintType} 
                onChange={handleChangeState}
                onKeyDown={handleKeyDown}
                >
                    <option value = "0" >질문종류를 선택하세요</option>
                    <option value = "1">예약</option>
                    <option value = "2">결제</option>
                    <option value = "3">사기</option>
                    <option value = "3">기타</option>
                </select>
            </div>
            <div>
            <input 
            ref={complaintTitle}
            name = "complaintTitle"
            value={state.complaintTitle} 
            onChange={handleChangeState}
            onKeyDown={handleKeyDown}
            placeholder="제목"
            /> 
            </div>
            <div>
            <textarea 
            ref={complaintContent}
            name = "complaintContent"
            value={state.complaintContent} 
            onChange={handleChangeState}
            onKeyDown={handleKeyDown}
            placeholder="내용과 예약번호를 같이 작성해주세요"
            /> 
            </div> 
            <button onClick={handleSunmit}>질문하기</button>
    </div>)
}

export default Question