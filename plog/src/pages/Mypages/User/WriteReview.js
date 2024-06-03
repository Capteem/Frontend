import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";

import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";

import axios from 'axios'

import '../../../styles/reserve.css'
import '../../../styles/review.css'
import '../../../styles/smallModal.css';

function WriteReview(){

    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);

    useEffect(()=>{
        const token = localStorage.getItem('accesToken');
        if(!token){
            navigate('/');
        }
    },[navigate]);

    const [review, setReview] = useState("");
    let initialStar = [false, false, false, false, false];
    const [reviewScore, setReviewScore] = useState(0);
    const [starClick, setStarClick] = useState([false, false, false, false, false]);

    const { state } = useLocation();
    console.log(state);

    useEffect(()=>{
        setReviewScore(0);
        setStarClick(initialStar);
        getIdName();
        // checkReview();
    },[])

    const [studioCheck, setStudioCheck] = useState(3);
    const [photoCheck, setPhotoCheck] = useState(1);
    const [hmCheck, setHmCheck] = useState(0);

    const [studioName, setStudioName] = useState("D");
    const [photoName, setPhotoName] = useState("B");
    const [hmName, setHmName] = useState("");

    const [studioDisable, setStudioDisable] = useState(false);
    const [photoDisable, setphotoDisable] = useState(false);
    const [hmDisable, sethmDisable] = useState(false);
    //값 추출
    async function getIdName(){
        if(state.reservationCameraId !== "C"){
            setPhotoCheck(state.reservationCameraId);
            setPhotoName(state.reservationCameraName);
            let send = {
                "userId": localStorage.getItem('userId'),
                "providerId": state.reservationCameraId,
                "reservationId": state.reservationTableId,
            }
            checkReview(send, 3);
        }
        if(state.reservationHairId !== "C"){
            setHmCheck(state.reservationHairId);
            setHmName(state.reservationHairName);
            let send = {
                "userId": localStorage.getItem('userId'),
                "providerId": state.reservationHairId,
                "reservationId": state.reservationTableId,
            }
            checkReview(send, 2);
        }
        if(state.reservationStudioId !== "C"){
            setStudioCheck(state.reservationStudioId);
            setStudioName(state.reservationStudioName);
            let send = {
                "userId": localStorage.getItem('userId'),
                "providerId": state.reservationStudioId,
                "reservationId": state.reservationTableId,
            }
            checkReview(send, 1);
        }
    }

    function checkReview(props, num){

        axios.post(`${process.env.REACT_APP_URL}/review/check`, props,
            {
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                }
            }
        )
        .then(function(result){
            console.log(result);
            if(num === 1){
                setStudioDisable(false);
            }else if(num === 2){
                sethmDisable(false);
            }else if(num === 3){
                setphotoDisable(false);
            }
        })
        .catch((error)=>{
            console.log(error);
            if(num === 1){
                setStudioDisable(true);
            }else if(num === 2){
                sethmDisable(true);
            }else if(num === 3){
                setphotoDisable(true);
            }
        })
    }

    function checkStar(props){
        let tmp = initialStar;
        starClick.map((item, index)=>{
            if(index <= props){
                tmp[index] = true;
            }else{
                tmp[index] = false;
            }
        });
        setReviewScore(props + 1);
        setStarClick(tmp);
    }

    function changeReview(event){
        setReview(event.target.value);
    }

    function checkWrite(){
        if(review === ""){
            alert("리뷰를 작성해주세요.")
        }else if(reviewScore === 0){
            alert("별점을 매겨주세요");
        }else{
            setModalShow(true);
        }
    }

    function checkWriting(props){
        if(review !== ""){
            alert("작성중인 리뷰를 등록해주세요.");
        }else if(reviewScore !== 0){
            alert("작성중인 리뷰를 등록해주세요.");
        }else if(props === 1){
            setCurrentProvider(studioCheck);
            setCurrentService(1);
            setCurrentName(studioName);
        }else if(props === 2){
            setCurrentProvider(photoCheck);
            setCurrentService(2);
            setCurrentName(photoName);
        }else if(props === 3){
            setCurrentProvider(hmCheck);
            setCurrentService(3);
            setCurrentName(hmName);
        }
    }

    useEffect(()=>{
        if(studioDisable && photoDisable && hmDisable){
            navigate("/mypage/viewreservation");
        }
    },[studioDisable, photoDisable, hmDisable])

    //todo: providerId 바꿔야함
    function sendReview(){
        const date = new Date();
        const tmp = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

        const send = {
            "reviewContent" : review,
            "reviewScore": reviewScore,
            "userId": localStorage.getItem('userId'),
            "userNickName": localStorage.getItem('userNickname'),
            "reviewDate": tmp.toISOString(),
            "reservationId": state.reservationTableId,
            "providerId": currentProvider
        }

        console.log(send);
        axios.post(`${process.env.REACT_APP_URL}/review/add`, send,
            {
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                }
            }
        )
        .then(function(result){
            console.log(result);
            if(currentService === 1){
                setStudioDisable(true);
            }else if(currentService === 2){
                sethmDisable(true);
            }else if(currentService === 3){
                setphotoDisable(true);
            }
            console.log("리뷰 작성 성공");
            setClick(false);
        })
        .catch((error)=>{
            if(error.response && error.response.status === 401){
                navigate('/signin', { replace: true });
                alert("로그인 만료. 다시 로그인해주세요.");      
            }else{
                alert('리뷰 작성 실패');
                console.log(error);
            }
        })
    }
    
    //현재 제공자
    const [currentProvider, setCurrentProvider] = useState(0);
    const [currentService, setCurrentService] = useState(0);
    const [currentName, setCurrentName] = useState("");
    const [click, setClick] = useState(false);

    const [studioBtn, setStudioBtn] = useState(false);
    const [photoBtn, setPhotoBtn] = useState(false);
    const [hmBtn, setHmBtn] = useState(false);
    return(
        <div>
            {console.log(review)}
            <div className='review-body'>
                {studioBtn === false ? 
                    <button className='portfolio-button'
                    onClick={()=>{
                        setClick(true);
                        checkWriting(1);
                        setStudioBtn(true);
                        setPhotoBtn(false);
                        setHmBtn(false);
                    }} disabled={studioDisable}
                    >스튜디오</button> 
                    :
                    <button className='portfolio-button-click'
                    onClick={()=>{
                        setClick(true);
                        checkWriting(1);
                    }} disabled={studioDisable}
                    >스튜디오</button>
                }
                {photoBtn === false ? 
                    <button className='portfolio-button'
                    onClick={()=>{
                        setClick(true);
                        checkWriting(2);
                        setStudioBtn(false);
                        setPhotoBtn(true);
                        setHmBtn(false);
                    }} disabled={photoDisable}
                    >사진작가</button> 
                    :
                    <button className='portfolio-button-click'
                    onClick={()=>{
                        setClick(true);
                        checkWriting(2);
                    }} disabled={photoDisable}
                    >사진작가</button>
                }
                {hmBtn === false ? 
                    <button className='portfolio-button'
                    onClick={()=>{
                        setClick(true);
                        checkWriting(3);
                        setStudioBtn(false);
                        setPhotoBtn(false);
                        setHmBtn(true);
                    }} disabled={hmDisable}
                    >헤어,메이크업</button> 
                    :
                    <button className='portfolio-button-click'
                    onClick={()=>{
                        setClick(true);
                        checkWriting(3);
                    }} disabled={hmDisable}
                    >헤어,메이크업</button>
                }
            </div>

            

            {click && <>
                <div className='review-body'>
                    <span className='review-title'>{currentName}</span>
                </div>
                <div style={{marginBottom:10}}>
                    <span className='writeReview-score'>Score</span>
                    {
                        starClick.map((item, index)=>{
                            return(
                                item === false ? 
                                <button key={index} className='review-star' onClick={()=>{checkStar(index);}} disabled={false}>
                                    <GoStar />
                                </button>
                                :
                                <button key={index} className='review-starClick' onClick={()=>{checkStar(index);}} disabled={false}>
                                    <GoStarFill />
                                </button>
                            )
                        })
                    }
                </div>

                <textarea className='review-textarea' onChange={(event)=>{changeReview(event)}} placeholder="리뷰를 작성해주세요."/>
                <br/>
                <button style={{marginTop:10}} className='calculate-button' onClick={()=>{checkWrite();}}>입력완료</button>
            </>
            }

            {
                modalShow &&
                <div className='small-portfolio-modal' onClick={()=>{setModalShow(false)}}>
                    <div className='small-portfolio-modalBody'>
                        <div className='small-modal-big-text'>리뷰를 등록하시겠습니까?</div>
                        <button className='small-modal-button' onClick={()=>{
                            setModalShow(false);
                            sendReview();
                            setReview("");
                        }}>확인</button>
                        <button className='small-modal-button' onClick={()=>{setModalShow(false);}}>취소</button>
                    </div>
                </div>
            }

        </div>
    );
}

export default WriteReview;