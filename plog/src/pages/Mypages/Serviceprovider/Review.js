// 서비스 제공자 리뷰관리 페이지
import { useLocation } from 'react-router-dom';
import React, {useEffect, useState} from 'react';

import axios from 'axios'

function Review(){
    const locate = useLocation();
    const queryParams = new URLSearchParams(locate.search);
    const providerId = queryParams.get('providerId');

    useEffect(()=>{
        getInfo();
    },[])

    const [reviewList, setReviewList] = useState([]);
    function getInfo(){
        axios.get(`${process.env.REACT_APP_URL}/review/provider/get/${providerId}`,{
            headers:{
                'Auth-Token' : localStorage.getItem("accesToken")
            },
        })
        .then((result)=>{
            console.log(result.data.reviewList);            
            setReviewList(result.data.reviewList);
        })
        .catch((error)=>{
            console.log(error);
            console.log("리뷰 리스트 받기 실패");
        })
    }
    useEffect(()=>{
        initialcheckSetting();
        console.log("reviewList useEffect 실행중");
    },[reviewList])

    const [checkCommentChange, setCheckCommentChange] = useState([]);
    function initialcheckSetting(){
        let tmp = reviewList.map(() => false);
        setCheckCommentChange(tmp);
    }

    function changeComment(index){   //리뷰 답글 달기
        console.log('수정중');
        let tmp = [...checkCommentChange];
        tmp[index] = true;
        setCheckCommentChange(tmp);
    }

    function changeComplete(index){
        let tmp = [...checkCommentChange];
        tmp[index] = false;
        setCheckCommentChange(tmp);
    }

    const [send, setSend] = useState([]);
    function addComment(event, item){
        const date = new Date();
        const tmp = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

        let tmpSend = {
            "reviewId": item.reviewId,
            "commentContent": event.target.value,
            "commentDate": tmp.toISOString()
        }
        setSend(tmpSend);
    }

    function sendComment(){
        console.log(send);
        axios.post(`${process.env.REACT_APP_URL}/review/comment`, send,
            {
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                }
            }
        )
        .then(function(result){
            console.log(result);
            console.log("comment 달기 성공");
            getInfo();
        })
        .catch((error)=>{
            console.log(error);
            alert('comment 달기 실패');
        })
    }

    const [fixsend, setFixSend] = useState([]);
    function addFixComment(event, item){
        const date = new Date();
        const tmp = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

        let tmpSend = {
            "commentId": item.comment.commentId,
            "commentContent": event.target.value,
            "commentDate": tmp.toISOString(),      
        }
        setFixSend(tmpSend);
    }
    function fixComment(){
        axios.put(`${process.env.REACT_APP_URL}/review/comment`, fixsend,
            {
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                }
            }
        )
        .then(function(result){
            console.log(result);
            console.log("리뷰 댓글 수정 성공");
            getInfo();
        })
        .catch((error)=>{
            console.log(error);
            alert('리뷰 댓글 수정 실패');
        })
    }

    return(
        <div>
            서비스에 달린 리뷰들
            {reviewList && reviewList.map((item, index)=>{
                let [date, time] = item.reviewDate.split("T");
                return(
                    <div key={index}>
                        <div>
                            <div>{date} {time}</div>
                            <div>{item.reviewScore}</div>
                            <div>
                                {item.reviewContent}
                            </div>
                        </div>
                        <div>{
                            item.comment === null ?
                            <div>
                                <textarea disabled={checkCommentChange[index]}
                                    onChange={(event)=>{addComment(event, item)}}
                                    placeholder='답글을 달아주세요'
                                />
                                <button onClick={()=>{sendComment();}}>완료</button>
                            </div>
                            :
                            <div>
                                <textarea disabled={!checkCommentChange[index]}
                                    onChange={(event)=>{addFixComment(event, item)}}
                                >
                                    {item.comment.commentContent}
                                </textarea>
                                <div>{
                                    checkCommentChange[index] === false ?
                                    <button onClick={()=>{changeComment(index);}}>수정</button>
                                    :
                                    <div>
                                        <button onClick={()=>{changeComplete(index); fixComment();}}>완료</button>
                                        <button onClick={()=>{changeComplete(index);}}>취소</button>
                                    </div>
                                }</div>
                            </div>
                        }</div>
                    </div>
                )
            })}
        </div>
    )
}

export default Review