import React, { useRef, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import axios from 'axios';
import Modal from 'react-modal';

import {useNavigate } from 'react-router-dom';
import '../../styles/multi.css';

function ServiceRegistration(){
    const provider_name = useRef();
    const address = useRef();
    const detail_address = useRef();
    const provider_service = useRef();
    const provider_submission = useRef();
    const provider_phonenumber = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const formData = new FormData();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const [state, setState] = useState({
        provider_name : "",
        address : "",
        detail_address: "",
        provider_service : 0,
        provider_submission : "",
        provider_phonenumber: "",
    });

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

    const handleSunmit = async (e) => {
        e.preventDefault();
        // 유효성 검사
        if(state.provider_name.length < 1){
            provider_name.current.focus();  
            alert("서비스이름을 입력하세요"); 
            return; 
        };
        if(state.detail_address.length < 1){
            detail_address.current.focus();  
            alert("상세주소를 입력하세요"); 
            return; 
        };
    
        try {
            const addressParts = state.address.split(" ");
            const area = addressParts[0];
            const subarea = addressParts[1];
            const detail = `${addressParts.slice(2).join(" ")} ${state.detail_address}`;
            const response = await axios.post(`${process.env.REACT_APP_URL}/service/service`, {
                userId : userId,
                providerName: state.provider_name,
                providerType: Number(state.provider_service),
                providerArea: area,
                providerSubArea: subarea,
                providerDetail: detail,
                //providerTypeAuth:state.provider_submission,
                providerPhoneNum : state.provider_phonenumber,
            });
            console.log("등록" + response);
            // 상태 코드에 따른 처리
            if (response.status === 200) {
                alert("서비스 등록에 성공하였습니다.");
                navigate('/serviceregisteration');
            } else if (response.status === 400) {
                alert("서비스 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
            }
            
        } catch (error) {
            alert("서비스 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    }
    // 지역선택 완료 처리하기
    const handlecomplete = (data) => {
        setState({
            ...state,
            address: data.address,
        });
        setIsOpen(false);
    };
    
    // 모달 띄우기
    const openModal = () => {
        setIsOpen(true);
      };
    
    const closeModal = () => {
        setIsOpen(false);
    };
   
    const handlesubmission = async(e)=>{
        try {
            const response = await axios.get(`${process.env.REACT_APP_URL}/confirm/check`, {
                params: {
                    businessNumber:state.provider_submission,
                  },
            });
           if (response.status === 200) {
              alert("사업자 번호가 맞습니다");
          }else if (response.status === 201) {
            alert("사업자 번호가 없습니다");
        }
           else if (response.status === 400) {
              alert("사업자 번호 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
          }
          } catch (error) {
              alert("사업자 번호 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
          }
        };
    //사진처리
    const handleFileUpload = async (event) => {
        try {
          const file = event.target.files[0];
      
          const formData = new FormData();
          formData.append('providerPhotoName', file);
          formData.append('providerName', provider_name);
      
          const response = await axios.post(`${process.env.REACT_APP_URL}/service/photo`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }, 
          });
          console.log("사진" + response);
          // 렌더링 : 사진 1장당 url리스트순차적으로 보내면 먼저온것부터 보여줌 
         // 상태 코드에 따른 처리
         if (response.status === 200) {
            alert("사진 등록에 성공하였습니다.");
        } else if (response.status === 400) {
            alert("사진 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
        } catch (error) {
            alert("사진 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
      };
    
    return (
        <div className='multi'>
            <h4>서비스등록</h4>
            <div>
            <input 
            ref={provider_name}
            name = "provider_name"
            value={state.provider_name} 
            onChange={handleChangeState}
            onKeyDown={handleKeyDown}
            placeholder="서비스이름"
            /> 
            </div>
            <div>
            <input 
            ref={address}
            name = "address"
            value={state.address} 
            onChange={handleChangeState}
            onKeyDown={handleKeyDown}
            placeholder="서비스주소"
            /> 
            <button onClick={openModal}>주소찾기</button>
            <Modal isOpen={isOpen} onRequestClose={closeModal}>
                <DaumPostcode
                    onComplete={handlecomplete}
                />
            </Modal>
            </div>
            <div>
            <input 
            ref={detail_address}
            name = "detail_address"
            value={state.detail_address} 
            onChange={handleChangeState}
            onKeyDown={handleKeyDown}
            placeholder="상세주소"
            /> 
            </div>
            <div>
                <select
                ref={provider_service}
                name = "provider_service"
                value={state.provider_service} 
                onChange={handleChangeState}
                onKeyDown={handleKeyDown}
                placeholder="서비스종류"
                >
                    <option value = "0" >서비스종류를 선택하세요</option>
                    <option value = "1">사진작가</option>
                    <option value = "2">헤어, 메이크업</option>
                    <option value = "3">스튜디오</option>
                </select>
            </div>
            {state.provider_service === '1' && (
             <div>
            <label
            className="input file"
            onChange={handleFileUpload}
            >
            <h6>사진을 10장 업로드해주세요</h6>
            <input
             type='file'
             multiple= 'multiple'
            ref={provider_submission}
            name="provider_submission"
            value={state.provider_submission}
            onChange={handleChangeState}
            onKeyDown={handleKeyDown}
            placeholder="자격증 번호를 입력하세요"
            />
            
            </label>
             </div>
            )}
            {state.provider_service === '2' && (
            <div >
            <label
            className="input file"
            onChange={handleFileUpload}
            >
            <h6>자격증 사진을 업로드해주세요</h6>
            <input
             type='file'
             multiple= 'multiple'
            ref={provider_submission}
            name="provider_submission"
            value={state.provider_submission}
            onChange={handleChangeState}
            onKeyDown={handleKeyDown}
            placeholder="자격증 번호를 입력하세요"
            />
            
            </label>
             </div>
            )}
            {state.provider_service === '3' && (
             <div>
             <input
            ref={provider_submission}
            name="provider_submission"
            value={state.provider_submission}
            onChange={handleChangeState}
            onKeyDown={handleKeyDown}
            placeholder="사업자 번호를 입력하세요"
            />
            <button onClick={handlesubmission}>사업자번호조회</button>
             </div>
            )}
             <div>
             <input
            ref={provider_phonenumber}
            name="provider_phonenumber"
            value={state.provider_phonenumber}
            onChange={handleChangeState}
            onKeyDown={handleKeyDown}
            placeholder="서비스 전화번호를 입력하세요"
            />
             </div>
            <button onClick={handleSunmit}>서비스등록하기</button>
        </div>
    );
}

export default ServiceRegistration