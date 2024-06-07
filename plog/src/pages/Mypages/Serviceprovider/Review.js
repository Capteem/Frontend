// 서비스 제공자 리뷰관리 페이지
import { useLocation } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import remove from '../../../assets/remove';
import Pagination from 'react-js-pagination';

import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";

import axios from 'axios'

import '../../../styles/review.css'
import '../../../styles/shoppingBag.css'
import noReview from '../../../assets/shoppingBag.jpg'

function Review(){
    const locate = useLocation();
    const queryParams = new URLSearchParams(locate.search);
    const providerId = queryParams.get('providerId');

    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem('accesToken');
        if(!token){
            navigate('/');
        }
    },[navigate])

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
            sort(result.data.reviewList);           
            calculateScore(result.data.reviewList);
        })
        .catch((error)=>{
            if(error.response && error.response.status === 401){
                remove();
                navigate('/signin', { replace: true });
                alert("로그인 만료. 다시 로그인해주세요.");
            }else{
                console.log(error);
                console.log("리뷰 리스트 받기 실패");
            }
        })
    }
    function sort(props){
        props.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));
        console.log(props);
        setReviewList(props);
    }

    const [score, setScore] = useState(0);
    function calculateScore(props){
        let tmpScore = 0;
        props && props.map((item,index)=>{
            tmpScore = tmpScore+item.reviewScore;
        })
        let averageScore = tmpScore / props.length;
        setScore(parseFloat(averageScore.toFixed(2)));
    }
    useEffect(()=>{
        initialcheckSetting();
        console.log("reviewList useEffect 실행중");
    },[reviewList])

    const [checkCommentChange, setCheckCommentChange] = useState([]);
    function initialcheckSetting(){
        let tmp = reviewList && reviewList.map(() => false);
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
            if(error.response && error.response.status === 401){
                remove();
                navigate('/signin', { replace: true });
                alert("로그인 만료. 다시 로그인해주세요.")
            }else{
                console.log(error);
                alert('comment 달기 실패');
            }
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
            if(error.response && error.response.status === 401){
                remove();
                navigate('/signin', { replace: true });
                alert("로그인 만료. 다시 로그인해주세요.");
            }else{
                console.log(error);
                alert('리뷰 댓글 수정 실패');
            }
        })
    }

    //pagination
    const [currentReview, setCurrentReview] = useState([]);
    const [page, setPage] = useState(1);

    const postPerPage = 2;
    const indexOfLastPost = page * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;

    const handlePageChange = (page) => {
        setPage(page);
    }

    useEffect(()=>{
        if(reviewList !== null){
            setCurrentReview(reviewList.slice(indexOfFirstPost, indexOfLastPost))
        }
    },[reviewList, page]);

    return(
        <div className='review-body'>
        <div className='review'>
            <div className='review-title'>
                Review
            </div>
            {
                (!reviewList) && 
                <div className='shoppingBag-none'>
                    <img className='shoppingBag-noneBag' src={noReview}/>
                    <div className='shoppingBag-noneText'>작성된 리뷰가 아직 없습니다.</div>
                </div>
            }

            {
                reviewList &&  <div className='review-score'>
                    <GoStarFill className='review-star-score'/> : {score}
                </div>
            }
           
            {reviewList && currentReview.map((item, index)=>{
                let [date, time] = item.reviewDate.split("T");
                let five = [1,2,3,4,5];

                return(
                    <div key={index} className='review-reviewBox'>
                        <div className='review-user'>
                            <span className='review-name'>{item.userNickName}</span>
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
                            <div className='review-content'>{item.reviewContent}</div>
                        </div>

                        <div>{
                            item.comment === null ?
                            <div>
                                <textarea className='review-textarea'
                                    disabled={checkCommentChange[index]}
                                    onChange={(event)=>{addComment(event, item)}}
                                    placeholder='답글을 달아주세요'
                                    maxLength={500}
                                />
                                <div className='review-button-left'>
                                <button className='review-button' onClick={()=>{sendComment();}}>완료</button>
                                </div>
                            </div>
                            :
                            <div>
                                <textarea className='review-textarea'
                                    disabled={!checkCommentChange[index]}
                                    onChange={(event)=>{addFixComment(event, item)}}
                                >
                                    {item.comment.commentContent}
                                </textarea>
                                <div>{
                                    checkCommentChange[index] === false ?
                                    <div className='review-button-left'>
                                    <button className='review-button' onClick={()=>{changeComment(index);}}>수정</button>
                                    </div>
                                    :
                                    <div className='review-button-left'>
                                        <button className='review-button' onClick={()=>{changeComplete(index); fixComment();}}>완료</button>
                                        <button className='review-button' onClick={()=>{changeComplete(index);}}>취소</button>
                                    </div>
                                }</div>
                            </div>
                        }</div>
                    </div>
                )
            })}
            {reviewList === null ? <Pagination
                activePage={page}
                itemsCountPerPage={postPerPage}
                totalItemsCount={reviewList !== null ? reviewList.length : null}
                pageRangeDisplayed={3}
                prevPageText={"<"}
                nextPageText={">"}
                onChange={handlePageChange}
            />:null}
        </div>
        </div>
    )
}

export default Review