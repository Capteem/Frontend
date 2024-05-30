import React, { useRef, useState, useEffect } from 'react';
import DaumPostcode from 'react-daum-postcode';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import '../../styles/multi.css';
import { v4 as uuidv4 } from 'uuid';

function ServiceRegistration() {
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
    const [isBusinessNumberValid, setIsBusinessNumberValid] = useState(false);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const accessToken = localStorage.getItem('accesToken');
    const uuid = 0;
    const [state, setState] = useState({
        provider_name: "",
        address: "",
        detail_address: "",
        provider_service: "0",
        provider_submission: "",
        provider_phonenumber: "",
    });

    useEffect(() => {
        if (!accessToken) {
            navigate("/signin");
        }
        else{
            uuid = uuidv4();
            console.log(uuid);
        }
        
    }, [accessToken,navigate]);

    const handleChangeState = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;

        // 유효성 검사
        if (state.provider_name.length < 3) {
            provider_name.current.focus();
            alert("서비스이름을 3글자 이상 입력하세요");
            return;
        }
        if (state.address.length < 1) {
            address.current.focus();
            alert("서비스주소를 입력하세요");
            return;
        }
        if (state.detail_address.length < 1) {
            detail_address.current.focus();
            alert("상세주소를 입력하세요");
            return;
        }
        if (state.provider_service === "0") {
            provider_service.current.focus();
            alert("서비스종류를 선택하세요");
            return;
        }
        if (state.provider_service === "3" && !isBusinessNumberValid) {
            provider_submission.current.focus();
            alert("사업자 번호를 인증해주세요");
            return;
        }

        if ((state.provider_service === "1" || state.provider_service === "2") && !isFileUploaded) {
            alert("사진을 업로드해주세요");
            return;
        }
        if (!phoneRegex.test(state.provider_phonenumber)) {
            provider_phonenumber.current.focus();
            alert("전화번호를 올바른 형식으로 입력하세요 (예: 010-1234-5678)");
            return;
        }
        
        try {
            const addressParts = state.address.split(" ");
            const area = addressParts[0];
            const subarea = addressParts[1];
            const detail = `${addressParts.slice(2).join(" ")} ${state.detail_address}`;
            const response = await axios.post(`${process.env.REACT_APP_URL}/service/service`, {
                userId: userId,
                providerName: state.provider_name,
                providerType: Number(state.provider_service),
                providerArea: area,
                providerSubArea: subarea,
                providerDetail: detail,
                providerPhoneNum: state.provider_phonenumber,
                uuid : uuid,
            }, {
                headers: {
                    'Auth-Token': localStorage.getItem('accesToken')
                },
            });
            console.log("등록" + response);
            // 상태 코드에 따른 처리
            if (response.status === 200) {
                alert("서비스 등록에 성공하였습니다.");
                navigate('/serviceregistrationlist');
            } else if (response.status === 400) {
                alert("서비스 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
            }

        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("로그인 만료. 다시 로그인해주세요.");
                navigate('/signin', { replace: true });
              } else {
                alert("서비스 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
              }
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

    const handleSubmission = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_URL}/confirm/check`, {
                params: {
                    businessNumber: state.provider_submission,
                },
                headers: {
                    'Auth-Token': localStorage.getItem('accesToken')
                },
            });
            if (response.status === 200) {
                alert("사업자 번호가 맞습니다");
                setIsBusinessNumberValid(true);
            } else if (response.status === 201) {
                alert("사업자 번호가 없습니다");
                setIsBusinessNumberValid(false);
            } else if (response.status === 400) {
                alert("사업자 번호 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
                setIsBusinessNumberValid(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("로그인 만료. 다시 로그인해주세요.");
                navigate('/signin', { replace: true });
              } else {
                alert("사업자 번호 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
                setIsBusinessNumberValid(false);
              }
        }
    };

    // 사진처리
    const handleFileUpload = (event) => {
        const files = event.target.files;
        const validFileTypes = ['image/jpeg', 'image/png'];
        let allFilesValid = true;

        for (let file of files) {
            if (!validFileTypes.includes(file.type)) {
                allFilesValid = false;
                break;
            }
        }

        if (!allFilesValid) {
            alert("png와 jpg 파일만 업로드 가능합니다.");
            return;
        }

        if (state.provider_service === "1" && files.length !== 10) {
            alert("사진작가는 10장의 사진을 등록해야 합니다.");
            setIsFileUploaded(false);
            return;
        }

        setIsFileUploaded(true);

        // 추가 업로드 처리
        const formData = new FormData();
        for (let file of files) {
            formData.append('providerCheckFiles', file);
        }
        formData.append('userId', userId);
        formData.append('uuid', uuid);

        axios.post(`${process.env.REACT_APP_URL}/confirm/checkProvider`, formData, {
            headers: {
                'uuid' : uuid,
                'userId': userId,
                'providerCheckFiles': 'multipart/form-data',
                'Auth-Token': localStorage.getItem('accesToken')
            },
        })
        .then(response => {
                console.log("사진" + response);
                if (response.status === 200) {
                    alert("사진 등록에 성공하였습니다.");
                } else if (response.status === 400) {
                    alert("사진 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    alert("로그인 만료. 다시 로그인해주세요.");
                    navigate('/signin', { replace: true });
                  } else {
                    alert("사진 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
                  }
            });
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
            >
            <h6>사진을 10장 업로드해주세요</h6>
            <input
             type='file'
             multiple= 'multiple'
            ref={provider_submission}
            name="provider_submission"
            value={state.provider_submission}
            onChange={handleFileUpload}
            />
            </label>
        </div>
    )}
    {state.provider_service === "2" && (
        <div>
            <label className="input file">
                <h6>자격증 사진을 업로드해주세요</h6>
                <input
                    type='file'
                    multiple='multiple'
                    ref={provider_submission}
                    name="provider_submission"
                    onChange={handleFileUpload}
                />
            </label>
        </div>
    )}
    {state.provider_service === "3" && (
        <div>
            <input
                ref={provider_submission}
                name="provider_submission"
                value={state.provider_submission}
                onChange={handleChangeState}
                onKeyDown={handleKeyDown}
                placeholder="사업자 번호를 입력하세요"
            />
            <button onClick={handleSubmission}>사업자번호조회</button>
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
    <button onClick={handleSubmit}>서비스등록하기</button>
</div>
);
}

export default ServiceRegistration;