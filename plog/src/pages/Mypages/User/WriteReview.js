import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";

import axios from 'axios'

import '../../../styles/review.css'
import '../../../styles/smallModal.css';

function WriteReview(props){

    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);

    useEffect(()=>{
        const token = localStorage.getItem('accesToken');
        if(!token){
            navigate('/');
        }
    },[navigate])

    const [review, setReview] = useState("");
    let initialStar = [false, false, false, false, false];
    const [reviewScore, setReviewScore] = useState(0);
    const [starClick, setStarClick] = useState([false, false, false, false, false]);

    useEffect(()=>{
        setReviewScore(0);
        setStarClick(initialStar);
    },[])

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
        console.log(review);
        if(review === ""){
            alert("리뷰를 작성해주세요.")
        }else if(reviewScore === 0){
            alert("별점을 매겨주세요");
        }else{
            setModalShow(true);
        }
    }

    function sendReview(){
        const date = new Date();
        const tmp = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

        const send = {
            "reviewContent" : review,
            "reviewScore": reviewScore,
            "userId": localStorage.getItem('userId'),
            "userNickName": "string",
            "reviewDate": tmp.toISOString(),
            "providerId": 4
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
            console.log("리뷰 작성 성공");
        })
        .catch((error)=>{
            if(error.response.status === 401){
                alert("로그인 만료. 다시 로그인해주세요.")
                navigate('/signin', { replace: true });
            }else{
                alert('리뷰 작성 실패');
                console.log(error);
            }
        })
    }
    
    return(
        <div>
            <div className='review-body'>
                <div className='review-title'>
                    Review
                </div>
            </div>
            <div>
                별점
            </div>
            <div>
                {
                    starClick.map((item, index)=>{
                        return(
                            item === false ? 
                            <button className='review-star' onClick={()=>{checkStar(index);}} disabled={false}>
                                <GoStar />
                            </button>
                            :
                            <button className='review-starClick' onClick={()=>{checkStar(index);}} disabled={false}>
                                <GoStarFill />
                            </button>
                        )
                    })
                }
            </div>

            <textarea className='review-textarea' onChange={(event)=>{changeReview(event)}} placeholder="리뷰를 작성해주세요."/>
            <br/>
            <button className='calculate-button' onClick={()=>{checkWrite();}}>입력완료</button>

            {
                modalShow &&
                <div className='small-portfolio-modal' onClick={()=>{setModalShow(false)}}>
                    <div className='small-portfolio-modalBody'>
                        <div className='small-modal-big-text'>리뷰를 등록하시겠습니까?</div>
                        <button className='small-modal-button' onClick={()=>{
                            setModalShow(false);
                            sendReview();
                        }}>확인</button>
                        <button className='small-modal-button' onClick={()=>{setModalShow(false);}}>취소</button>
                    </div>
                </div>
            }

        </div>
    );
}

export default WriteReview;