import React, {useEffect, useState} from 'react';

import axios from 'axios'

import '../../../styles/review.css'
import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";

function ReviewList(){

    useEffect(()=>{
        getReviewList();
    },[])

    const [reviewList, setReviewList] = useState([]);

    //todo: 서비스 제공자도 받아오기
    function getReviewList(){

        axios.post(`${process.env.REACT_APP_URL}/review/user/get`,
        {
            "userId": localStorage.getItem("userId")
        },
        {
            headers: {
              'Auth-Token': localStorage.getItem("accesToken"),
            },
        })
        .then(function(result){
            console.log(result.data.reviewList);
            setReviewList(result.data.reviewList);
        })
        .catch((error)=>{
            console.log(error);
            alert('리뷰 받아오기 실패');
        })
    }

    useEffect(()=>{
        initialcheckSetting();
        console.log("reviewList useEffect 실행중");
    },[reviewList])

    const [checkChange, setCheckChange] = useState([]);
    function initialcheckSetting(){
        let tmp = reviewList.map(() => true);
        setCheckChange(tmp);
    }

    function changeReview(index){   //리뷰 수정
        let tmp = [...checkChange];
        tmp[index] = false;
        setCheckChange(tmp);
    }

    function changeComplete(index){
        let tmp = [...checkChange];
        tmp[index] = true;
        setCheckChange(tmp);
    }

    //todo:리뷰 삭제 실패
    function deleteReview(props){
        axios.delete(`${process.env.REACT_APP_URL}/review/${props}`,
        {
            headers: {
              'Auth-Token': localStorage.getItem("accesToken"),
            },
        }
        )
        .then(function(result){
            console.log(result);
            console.log("리뷰 삭제 성공");
            getReviewList();
        })
        .catch((error)=>{
            console.log(error);
            alert('리뷰 삭제 실패');
        })
    }

    const [send, setSend] = useState([]);
    function changeComment(event, item){
        console.log(item);
        const date = new Date();
        const tmp = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

        let tmpSend = {
            "reviewId": item.reviewId,
            "reviewContent": event.target.value,
            "reviewScore": item.reviewScore,
            "userId": item.userId,
            "userNickName": "string",
            "reviewDate": tmp.toISOString()
        }
        setSend(tmpSend);
    }

    function rewriteReview(){
        axios.put(`${process.env.REACT_APP_URL}/review`, send,
            {
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                }
            }
        )
        .then(function(result){
            console.log(result);
            console.log("리뷰 수정 성공");
            getReviewList();
        })
        .catch((error)=>{
            console.log(error);
            alert('리뷰 수정 실패');
        })
    }

    return(
            <div className='review-body'>
                <div className='review'>
                    <div className='review-title'>
                        Review List
                    </div>

                    {reviewList && reviewList.map((item, index)=>{
                let [date, time] = item.reviewDate.split("T");
                let five = [1,2,3,4,5];

                return(
                    <div key={index}>
                        <span className='review-time'>{date} {time}</span>
                        <div style={{marginBottom:2, marginTop:-5}}>{
                                five.map((score, index)=>{
                                    return(
                                        <span>{
                                            score <= item.reviewScore ?
                                                <GoStarFill className='review-starClick'/>
                                            :
                                                <GoStar className='review-star'/>
                                        }</span>
                                    )
                                })
                        }</div>
                        <textarea className='review-textarea'
                            disabled={checkChange[index]}
                            onChange={(event)=>{changeComment(event, item)}}
                        >
                            {item.reviewContent}
                        </textarea>

                        {
                            checkChange[index] === true ? 
                            <div className='review-button-left'>
                                <button className='review-button' onClick={()=>{changeReview(index);}}>수정</button>
                                <button className='review-button' onClick={()=>{deleteReview(item.reviewId);}}>삭제</button>
                            </div>
                            :
                            <div className='review-button-left'>
                                <button className='review-button' onClick={()=>{changeComplete(index); rewriteReview();}}>완료</button>
                                <button className='review-button' onClick={()=>{changeComplete(index);}}>취소</button>
                            </div>
                        }
                    </div>
                )
            })}
                </div>
                
            </div>
    )
}

export default ReviewList;