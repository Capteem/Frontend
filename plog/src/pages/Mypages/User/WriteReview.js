import React, {useEffect, useState} from 'react';

import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";

import axios from 'axios'

import '../../../styles/review.css'

function WriteReview(props){

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
            sendReview();
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
            "providerId": 2
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
            console.log(error);
            alert('리뷰 작성 실패');
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

        </div>
    );
}

export default WriteReview;