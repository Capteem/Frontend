import React, {useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import remove from '../assets/remove';

import {changeStudio, changePhotographer, changeHair, 
    changeArea, changeSubarea} from '../assets/store.js';

import '../styles/ImageGallery.css';
import '../styles/review.css'
import '../styles/shoppingBag.css'
import noReview from '../assets/noReview.png'

import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { RiChatSmileLine } from "react-icons/ri";
import { TbPhotoSquareRounded } from "react-icons/tb";
import { TiPhoneOutline } from "react-icons/ti";
import { IoLocationOutline } from "react-icons/io5";
import { LiaWonSignSolid } from "react-icons/lia";

//Redux
import { useDispatch } from "react-redux"

function Gallery(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem('accesToken');
        if(!token){
            navigate('/');
        }
    },[navigate]);

    useEffect(()=>{
        getImgPerPage();
    },[]);

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, [loading]);

    // 페이지를 증가시키는 함수
    const loadMoreImages = () => {
        setPage(prevPage => prevPage + 1);
    };

    // 스크롤 이벤트를 감지하는 함수
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 100 < document.documentElement.offsetHeight || loading) return;
        loadMoreImages();
    };   

    const [page, setPage] = useState(1);
    useEffect(()=>{
        getImgPerPage();
    },[page]);

    //img url 무한으로 받아옴
    function getImgPerPage(){
        setLoading(true);
        axios.get(`${process.env.REACT_APP_URL}/portfolio/random?page=${page}`,
            {
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                }
            }
        )
        .then(function(result){
            console.log(result.data);
            getImg(result.data, 1);
        })
        .catch((error)=>{
            if(error.response && error.response.status === 401){
                navigate('/signin', { replace: true });
                alert("로그인 만료. 다시 로그인해주세요.")
            } if(error.response && error.response.status === 404){
                console.log("data 다 불러옴");
                setHasMore(false);
            }else{
                alert('서버로부터 data 받아오는 것 실패');
                console.log(error);
            }
        })
    }

    //포폴 받아오기
    const [detailPhotoInfo, setDetailPhotoInfo] = useState([]);
    function getPhoto(props){
        setDetailPhotoInfo([]);
        axios.get(`${process.env.REACT_APP_URL}/portfolio/data/${props}`,{
            headers:{
                'Auth-Token' : localStorage.getItem("accesToken")
            },
        })
        .then((result)=>{
            console.log(result.data.portfolioList);
            setDetailPhotoInfo(result.data.portfolioList);
            getImg(result.data.portfolioList, 2);       
        })
        .catch((error)=>{
            if(error.response && error.response.status === 404){
                console.log("포트폴리오 존재 안함");
            }
            else if(error.response && error.response.status === 401){
                remove();
                navigate('/signin', { replace: true });
                alert("로그인 만료. 다시 로그인해주세요.")
            }else{
                // console.log(error);
            }
        })
    }

    const [imgList, setImgList] = useState([]);
    const [imgListDetail, setImgListDetail] = useState([]);
    function getImg(props, num){    //num === 1 > 대표사진(imgList) num === 2 > detail사진(imgListDetail)
        setImgListDetail([]);
        props.map((item, index)=>{
            axios.get(`${process.env.REACT_APP_URL}/portfolio/image/${item.imgUrl}`,{
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                },
                responseType: "blob",
            })
            .then((result)=>{
                console.log("사진 받기 성공");
                if(num === 1){
                    const newFile = new File([result.data], imgList);   //blob 객체를 File 객체로 변환시켜줌
                    const reader = new FileReader(); // 변환한 File 객체를 읽기 위해 FileReader 객체 생성(비동기)
                    reader.onload = (event) => {
                        const previewImage = String(event.target?.result);
                        let tmp = {id: item.providerId, url:previewImage};
                        setImgList(imgList => [...imgList, tmp]);    
                    };
                    reader.readAsDataURL(newFile); // 변환한 파일 객체를 넘기면 브라우저가 이미지를 볼 수 있는 링크가 생성됨
                
                }else if(num === 2){
                    const newFile = new File([result.data], imgListDetail);   //blob 객체를 File 객체로 변환시켜줌
                    const reader = new FileReader(); // 변환한 File 객체를 읽기 위해 FileReader 객체 생성(비동기)
                    reader.onload = (event) => {
                        const previewImage = String(event.target?.result);
                        let tmp = {id: item.providerId, url:previewImage};
                        setImgListDetail(imgListDetail => [...imgListDetail, tmp]);    
                    };
                    reader.readAsDataURL(newFile); // 변환한 파일 객체를 넘기면 브라우저가 이미지를 볼 수 있는 링크가 생성됨
                }
            
            })
            .catch((error)=>{
                if(error.response && error.response.status === 401){
                    alert("로그인 만료. 다시 로그인해주세요.")
                    navigate('/signin', { replace: true });
                }else{
                    // console.log("대표사진 요청 에러");
                    // console.log(error);
                }
            })
        })
        setLoading(false);
    }

    //세부정보 받기
    const [modalShow, setModalShow] = useState(false);
    const [detail, setDetail] = useState([]);
    function getDetail(props){
        axios.get(`${process.env.REACT_APP_URL}/service/info?providerId=${props}`,
        {
            headers:{
                'Auth-Token' : localStorage.getItem("accesToken")
            },
        })
        .then((result)=>{
            console.log(result.data);
            setDetail(result.data);
            setID(result.data.uerId);
        })
        .catch((error)=>{
            if(error.response && error.response.status === 401){
                remove();
                alert("로그인 만료. 다시 로그인해주세요.")
                navigate('/signin', { replace: true });
            }else{
                // console.log("세부사항 정보 가져오기 실패");
                // console.log(error);
            }
        })

    }

    //review 받기
    const [detailReview, setDetailReview]= useState([]);
    const [score, setScore] = useState(0);
    function getReview(props){
        setScore(0);
        // console.log(props);
        axios.get(`${process.env.REACT_APP_URL}/review/provider/get/${props}`,{
            headers:{
                'Auth-Token' : localStorage.getItem("accesToken")
            },
        })
        .then((result)=>{
            console.log(result);
            setDetailReview(result.data.reviewList);
            calculateScore(result.data.reviewList);      
        })
        .catch((error)=>{
            if(error.response && error.response.status === 401){
                remove();
                navigate('/signin', { replace: true });
                alert("로그인 만료. 다시 로그인해주세요.")
            }else{
                console.log("review받기 실패");
                console.log(error);
            }
        })
    }
    function calculateScore(props){
        // console.log(props);
        let tmpScore = 0;
        props && props.map((item,index)=>{
            tmpScore = tmpScore+item.reviewScore;
        })
        let averageScore = tmpScore / props.length;
        setScore(parseFloat(averageScore.toFixed(2)));
    }

    //선택 > redux
    function select(data){

        //todo: 지역 선택
        let tmpArea = data.providerAddress.split(" ");

        if(data.providerType === 1){
            dispatch(changePhotographer(data));
            dispatch(changeArea(tmpArea[0]));
            dispatch(changeSubarea(tmpArea[1]));
            navigate('/reservation');
        }else if(data.providerType === 2){
            dispatch(changeHair(data));
            dispatch(changeArea(tmpArea[0]));
            dispatch(changeSubarea(tmpArea[1]));
            navigate('/reservation');
        }else if(data.providerType === 3){
            dispatch(changeStudio(data));
            dispatch(changeArea(tmpArea[0]));
            dispatch(changeSubarea(tmpArea[1]));
            navigate('/reservation');
        }
    }

    const [Id, setID] = useState(null);
    function handleChatButtonClick(props){
        const userId = localStorage.getItem('userId');
        if(userId === Id){
            alert("본인의 서비스와 채팅할 수 없습니다.");
        }else{
            navigate(`/chattingroom?userId=${userId}&providerId=${props.providerId}&providerName=${props.providerName}`);
        }
    };

    const [imgReview, setImgReview] = useState(true);

    return(
        <>
            <div className='gallery-gallery-text'>Photo Gallery</div>
            <div className='gallery-gallery-subtext'>Take a look at the photos and if you have any experts you want, make a reservation</div>
            <div style={{display:'flex', justifyContent:'center'}}>
                <div className="gallery-container-gallery">
                    {
                        imgList.map((value, index)=>{
                            return(
                                <div className='image-container-gallery'>
                                <img key={index} src={value.url} 
                                    onClick={()=>{
                                        getDetail(value.id);   //모달창에 보여주기 위한 세부정보
                                        getPhoto(value.id);
                                        getReview(value.id);
                                        setModalShow(true);
                                        console.log(value);
                                    }}
                                />
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {(loading && hasMore) && <div style={{
                fontSize:15,
                fontWeight:600,
                color:'grey',
                marginTop:10
            }}
            ><TbPhotoSquareRounded  style={{fontSize:20}}/>loading..<TbPhotoSquareRounded  style={{fontSize:20}}/>
            </div> }
            {!hasMore && <div style={{
                fontSize:15,
                fontWeight:600,
                color:'grey',
                marginTop:8,
                marginBottom:20
            }}
            >All images have been loaded! <RiChatSmileLine style={{fontSize:20}}/>
            </div> }

            {
                modalShow &&
                <div className='portfolio-modal' onClick={()=>{setModalShow(false); setImgReview(true); setScore(0);}}>
                    <div className='portfolio-modalBody' onClick={(event)=>{event.stopPropagation(); setModalShow(true);}}>
                        <pre className='portfolio-modal-text'>
                            <div style={{fontWeight:700, fontSize:18}}>{detail.providerName}</div>
                            <TiPhoneOutline style={{fontSize:15, color:'#456547'}}/> {detail.providerPhoneNum}<br/>
                            <IoLocationOutline style={{fontSize:15, color:'#456547'}}/> {detail.providerAddress}<br/>
                            <LiaWonSignSolid style={{fontSize:15, color:'#456547'}}/> {detail.providerPrice}<br/>
                        </pre>

                        {
                            imgReview === true ? 
                            <>
                                <button className='portfolio-button-click' onClick={()=>{setImgReview(true); setModalShow(true);}}>Portfolio</button>
                                <button className='portfolio-button' onClick={()=>{setImgReview(false); setModalShow(true);}}>Review</button>
                            </>
                            :
                            <>
                                <button className='portfolio-button' onClick={()=>{setImgReview(true); setModalShow(true);}}>Portfolio</button>
                                <button className='portfolio-button-click' onClick={()=>{setImgReview(false); setModalShow(true);}}>Review</button>
                            </>
                        }

                        {imgReview && <div className="gallery-container-modal">
                        {
                            imgListDetail && imgListDetail.map((item, index)=>{
                                return(
                                    <div className='image-container' key={index}>
                                        <img src={item.url}/>
                                    </div>
                                )
                            })
                        }
                        </div>}

                        {(!imgReview) && <div className="gallery-container-review-modal">
                            {((!imgReview) && (!detailReview)) &&
                                <div className='shoppingBag-none'>
                                    <img style={{width:150, height:150}} className='shoppingBag-noneBag' src={noReview}/>
                                    <div className='shoppingBag-noneText'>작성된 리뷰가 없습니다.</div>
                                </div>
                            }
                            {
                                detailReview && <div className='review-score'>
                                    <GoStarFill className='review-star-score'/> : {score}
                                </div>
                            }
                            {
                                detailReview && detailReview.map((item, index)=>{
                                    let five = [1,2,3,4,5];
                                    const [date, time] = item.reviewDate.split("T");
                                    let dateComment = item.comment === null ? 0 : item.comment.commentDate.split("T");

                                    return(
                                        <div className='review-box'>
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
                                            {
                                                item.comment && 
                                                <div className='portfolio-modal-review'>
                                                    <MdOutlineSubdirectoryArrowRight />
                                                    <div className='review-provider'>
                                                        <span style={{fontSize:14}} className='review-name'>{detail.providerName}</span>
                                                        <span className='review-time'>{dateComment[0]} {dateComment[1]}</span>
                                                        <div className='review-content'>{item.comment.commentContent}</div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>}

                        <div className='portfolio-selection'>
                             <button className='portfolio-chatting-button'
                                onClick={()=>{
                                    handleChatButtonClick(detail);
                                }}
                             >
                                채팅
                            </button>
                            <button className='portfolio-selection-button' onClick={(event)=>{
                                event.stopPropagation();
                                select(detail);
                                setModalShow(false);
                                setScore(0);
                                console.log(detail);
                            }}>예약하기</button>
                        </div>
                    </div>
                </div>
            }
        </>
    )

}

export default Gallery;