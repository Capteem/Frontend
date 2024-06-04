import React, {useState, useEffect} from 'react';
import '../../App.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

//Redux
import { useDispatch, useSelector } from "react-redux"
import {changeStudio, changePhotographer, changeHair, 
    changeArea, changeSubarea, changeCommonTimeList} from '../../assets/store.js';

import remove from '../../assets/remove.js';
import { debounce } from 'lodash';
import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";


import '../../styles/ImageGallery.css'; // CSS 파일 import
import '../../styles/review.css'
import '../../styles/shoppingBag.css'
import '../../styles/shoppingBag.css'
import shoppingBag from '../../assets/shoppingBag.jpg'
import noReview from '../../assets/noReview.png'

function PortfolioEnd(props){

    const navigate = useNavigate();

    //화면 크기 담는 state
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(()=>{
        window.addEventListener('resize', handleResize);
        return()=>{
            window.removeEventListener('resize', handleResize);
        };
    },[]);

    const handleResize = debounce(()=>{
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }, 500);
    //여기까진 화면

    //서버로부터 받은 data
    //todo: providerAll 초기값 변경
    const [providerAll, setProviderAll] = useState([]);
    const [serverStudio, setServerStudio] = useState([]);
    const [serverPhoto, setServerPhoto] = useState([]);
    const [serverHM, setServerHM] = useState([]);

    //보여줄 data
    const [showStudio, setShowStudio] = useState([]);
    const [showPhoto, setShowPhoto] = useState([]);
    const [showHM, setShowHM] = useState([]);

    //redux
    const dispatch = useDispatch();
    const checkSelect = useSelector((state)=>state.sendReservation);

    //서버한테 제공자들 데이터 받아옴
    useEffect(()=>{
        initialSetting(props.sendToPortfolio);
        setProviderAll(props.sendToPortfolio);
        getRep(props.sendToPortfolio);
    },[props.sendToPortfolio]);

    function initialSetting(props){
        console.log("initialSetting 실행");
        const studioTmp = [];
        const photoTmp = [];
        const hmTmp = [];
    
        props.map((item)=>{
            if(item.providerType === 1){
                photoTmp.push(item);
            }else if(item.providerType === 2){
                hmTmp.push(item);
            }else if(item.providerType === 3){
                studioTmp.push(item);
            }
        })
    
        console.log(studioTmp);
        setServerStudio(studioTmp);
        setServerPhoto(photoTmp);
        setServerHM(hmTmp);
        setShowStudio(studioTmp);
        setShowPhoto(photoTmp);
        setShowHM(hmTmp);
    }

    useEffect(()=>{
        console.log(showStudio);
        console.log(serverStudio);
    },[showStudio])

    //여기서부턴 날짜, 지역 선택 시
    useEffect(()=>{
        console.log("날짜 지역 선택");
        settingShowStudio(serverStudio);
        settingShowPhoto(serverPhoto);
        settingShowHM(serverHM);
        changeClick(0);
        setShow([]);
    },[checkSelect.finalDate, checkSelect.finalArea, checkSelect.finalSubarea])

    function settingShowStudio(props){
        console.log(props);
        const filteredData = props.filter(item => {
            return (checkDate(item.dateList) || checkSelect.finalDate === '') 
            && (item.providerArea === checkSelect.finalArea || checkSelect.finalArea === "") 
            && (item.providerSubArea === checkSelect.finalSubarea || checkSelect.finalSubarea === "");
        });

        console.log(showStudio);
        setShowStudio(filteredData);
    }
    function settingShowPhoto(props){

        const filteredData = props.filter(item => {
            return (checkDate(item.dateList) || checkSelect.finalDate === '') 
            && (item.providerArea === checkSelect.finalArea || checkSelect.finalArea === "") 
            && (item.providerSubArea === checkSelect.finalSubarea || checkSelect.finalSubarea === "");
        });

        setShowPhoto(filteredData);
    }
    function settingShowHM(props){

        const filteredData = props.filter(item => {
            return ( checkDate(item.dateList) || checkSelect.finalDate === "") 
            &&(item.providerArea === checkSelect.finalArea || checkSelect.finalArea === "") 
            && (item.providerSubArea === checkSelect.finalSubarea || checkSelect.finalSubarea === "");
        });

        setShowHM(filteredData);
    }
    function checkDate(props){
        const tmpDate = checkSelect.finalDate;
        const [finalDate, etc] = tmpDate.split('T');

        if(props !== undefined){
            const uniqueDates = [...new Set(props.map(item => item.date))];
            return(uniqueDates.includes(finalDate));
        }
    }
    //여기까지 날짜, 지역 우선선택

    //여기서부턴 시간 선택시
    const checkDateList = useSelector((state)=>state.includeDateList)
    useEffect(()=>{
        studioSettingWithDateList(serverStudio);
        photoSettingWithDateList(serverPhoto);
        hmSettingWithDateList(serverHM);
    }, [checkDateList]);

    function studioSettingWithDateList(props){
        settingShowStudio(props);
        if(checkDateList.includeDateList[0] !== ''){
            let resultArray = [];
            props.map((item, value)=>{
                for (const [date, times] of Object.entries(checkDateList.includeDateList)) {
                    let allTimesPresent = true;
                    for (const time of times) {
                        if (!item.dateList.some(item => item.date === date && item.time === time)) {
                            allTimesPresent = false;
                            break; // 하나라도 누락된 경우 루프 탈출
                        }
                    }
                    if (allTimesPresent) {
                        resultArray.push(item);
                    }
                }
            })
            setShowStudio(resultArray);
        }
    }
    function photoSettingWithDateList(props){
        settingShowPhoto(props);
        if(checkDateList.includeDateList[0] !== ''){
            let resultArray = [];
            props.map((item, value)=>{
                for (const [date, times] of Object.entries(checkDateList.includeDateList)) {
                    let allTimesPresent = true;
                    for (const time of times) {
                        if (!item.dateList.some(item => item.date === date && item.time === time)) {
                            allTimesPresent = false;
                            break; // 하나라도 누락된 경우 루프 탈출
                        }
                    }
                    if (allTimesPresent) {
                        resultArray.push(item);
                    }
                }
            })
            setShowPhoto(resultArray);
        }
    }
    function hmSettingWithDateList(props){
        settingShowHM(props);
        if(checkDateList.includeDateList[0] !== ''){
            let resultArray = [];
            props.map((item, value)=>{
                for (const [date, times] of Object.entries(checkDateList.includeDateList)) {
                    let allTimesPresent = true;
                    for (const time of times) {
                        if (!item.dateList.some(item => item.date === date && item.time === time)) {
                            allTimesPresent = false;
                            break; // 하나라도 누락된 경우 루프 탈출
                        }
                    }
                    if (allTimesPresent) {
                        resultArray.push(item);
                    }
                }
            })
            setShowHM(resultArray);
        }
    }
    //여기까지 시간 선택

    const [show, setShow] = useState([""]);
    const [click, setClick] = useState({
        studioClick:false,
        photoClick: false,
        hmClick:false,
        galleryClick:false,
    });
    useEffect(()=>{
        if(props.selectNum === 1){
            setShow(showPhoto);
        }else if(props.selectNum === 2){
            setShow(showHM);
        }else if(props.selectNum === 3){
            setShow(showStudio); 
        }
    }, [serverStudio, serverPhoto, serverHM, showPhoto, showHM, showStudio, checkSelect.finalDate, click])
    useEffect(()=>{
        setClick(prevClick => ({
            ...prevClick, // 이전 상태를 복사
            photoClick: false,
            studioClick: false,
            hmClick: false,
            galleryClick: false,
        }));
        setShow([]);
    }, [checkSelect.finalDate])

    useEffect(()=>{
        saveTimeListWithSelect();
    },[checkSelect.fianlStudio, checkSelect.finalPhotographer, checkSelect.finalHair]);
    
    function saveTimeListWithSelect(){
        const studio = checkSelect.fianlStudio.dateList;
        const hm = checkSelect.finalHair.dateList;
        const photo = checkSelect.finalPhotographer.dateList;

        let keysStudio = studio ? [...new Set(studio.map(item => item.date))] : [];
        let keysHM = hm ? [...new Set(hm.map(item => item.date))] : [];
        let keysPhoto = photo ? [...new Set(photo.map(item => item.date))] : [];

        let commonList = [];
        // 세 배열 중에서 데이터가 있는 배열만 필터링
        const arrays = [keysStudio, keysPhoto, keysHM].filter((array) => array && array.length > 0);

        if (arrays.length === 1) {
            // 하나의 배열만 데이터가 있다면 그 배열의 데이터를 새 배열에 저장
            commonList = arrays[0];
        } 
        else if(arrays.length > 1){
            // 두 개 이상의 배열에서 공통된 값을 찾음
            commonList = arrays.reduce((acc, currentArray) => 
                acc.filter(value => currentArray.includes(value))
            );
        }
        dispatch(changeCommonTimeList(commonList));
    }


    function setFinal(data, serviceType){
        if(serviceType === 1){
            dispatch(changePhotographer(data));
            dispatch(changeArea(data.providerArea));
            dispatch(changeSubarea(data.providerSubArea));
        }else if(serviceType === 2){
            dispatch(changeHair(data));
            dispatch(changeArea(data.providerArea));
            dispatch(changeSubarea(data.providerSubArea));
        }else if(serviceType === 3){
            dispatch(changeStudio(data));
            dispatch(changeArea(data.providerArea));
            dispatch(changeSubarea(data.providerSubArea));
        }
    }

    function changeClick(props){
        if(props === 3){
            setClick(prevClick => ({
                ...prevClick, // 이전 상태를 복사
                photoClick: false,
                studioClick: true,
                hmClick: false,
                galleryClick: true,
            }));
        }else if(props === 1){
            setClick(prevClick => ({
                ...prevClick, // 이전 상태를 복사
                photoClick: true,
                studioClick: false,
                hmClick: false,
                galleryClick: true,
            }));
        }else if(props === 2){
            setClick(prevClick => ({
                ...prevClick, // 이전 상태를 복사
                photoClick: false,
                studioClick: false,
                hmClick: true,
                galleryClick: true,
            }));
        }else{
            setClick(prevClick => ({
                ...prevClick, // 이전 상태를 복사
                photoClick: false,
                studioClick: false,
                hmClick: false,
                galleryClick: false,
            }));
        }
    }
    
    const [modalShow, setModalShow] = useState(false);
    const [detail, setDetail] = useState([]);
    //server한테 detail 받아옴
    function getDetail(props){
        setDetailPhoto([]);
        axios.get(`${process.env.REACT_APP_URL}/portfolio/data/${props.providerId}`,{
            headers:{
                'Auth-Token' : localStorage.getItem("accesToken")
            },
        })
        .then((result)=>{
            detailImg(result.data.portfolioList);          
        })
        .catch((error)=>{
            if(error.response && error.response.status === 404){
                // console.log("포트폴리오 존재 안함");
            }
            else if(error.response && error.response.status === 401){
                remove();
                navigate('/signin', { replace: true });
                alert("로그인 만료. 다시 로그인해주세요.")
            }else{
                // console.log(error);
            }
        })
        setDetail(props);
    }

    const [detailPhoto, setDetailPhoto] = useState([]);
    function detailImg(props){
        setDetailPhoto([]);
        props.map((item, index)=>{
            axios.get(`${process.env.REACT_APP_URL}/portfolio/image/${item.imgUrl}`,{
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                },
                responseType: "blob",
            })
            .then((result)=>{
                const newFile = new File([result.data], detailPhoto);   //blob 객체를 File 객체로 변환시켜줌
    
                const reader = new FileReader(); // 변환한 File 객체를 읽기 위해 FileReader 객체 생성(비동기)
                reader.onload = (event) => {
                    const previewImage = String(event.target?.result);
                    let tmp = {id: item.portfolioId, url:previewImage};
                    setDetailPhoto(detailPhoto => [...detailPhoto, tmp]);    
                };
                reader.readAsDataURL(newFile); // 변환한 파일 객체를 넘기면 브라우저가 이미지를 볼 수 있는 링크가 생성됨
            })
            .catch((error)=>{
                if(error.response && error.response.status === 401){
                    remove();
                    navigate('/signin', { replace: true });
                    alert("로그인 만료. 다시 로그인해주세요.")
                }else{
                    console.log("포폴 detail사진 재요청 에러");
                    console.log(error);
                }
            })
        })
    }

    const [repPhoto, setRepPhoto] = useState([]);
    function getRep(props){
        props.map((item, index)=>{
            axios.get(`${process.env.REACT_APP_URL}/portfolio/image/${item.providerRepPhotoPath}${item.providerRepPhoto}`,{
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                },
                responseType: "blob",
            })
            .then((result)=>{
                const newFile = new File([result.data], detailPhoto);   //blob 객체를 File 객체로 변환시켜줌
    
                const reader = new FileReader(); // 변환한 File 객체를 읽기 위해 FileReader 객체 생성(비동기)
                reader.onload = (event) => {
                    const previewImage = String(event.target?.result);
                    let tmp = {id: item.providerId, url:previewImage};
                    setRepPhoto(repPhoto => [...repPhoto, tmp]);    
                };
                reader.readAsDataURL(newFile); // 변환한 파일 객체를 넘기면 브라우저가 이미지를 볼 수 있는 링크가 생성됨
            })
            .catch((error)=>{
                if(error.response && error.response.status === 401){
                    remove();
                    navigate('/signin', { replace: true });
                    alert("로그인 만료. 다시 로그인해주세요.")
                }else{
                    console.log("대표사진 요청 에러");
                    console.log(error);
                }
            })

        })
    }

    const [detailReview, setDetailReview]= useState([]);
    const [score, setScore] = useState(0);
    function getReview(props){
        // console.log(props);
        setDetailPhoto([]);
        axios.get(`${process.env.REACT_APP_URL}/review/provider/get/${props.providerId}`,{
            headers:{
                'Auth-Token' : localStorage.getItem("accesToken")
            },
        })
        .then((result)=>{
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
        setDetail(props);
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

    const [imgReview, setImgReview] = useState(true)
    return(
        <>
        {/* {console.log(show)} */}
        {/* {console.log(showStudio)} */}
            {windowSize.width > 850 ?
                <div>
                    {click.studioClick === false ? <button className='portfolio-button' onClick={()=>{changeClick(3); setShow(showStudio);}}>스튜디오</button> :
                        <button className='portfolio-button-click' onClick={()=>{changeClick(3); setShow(showStudio);}}>스튜디오</button>}

                        {click.photoClick === false ? <button className='portfolio-button' onClick={()=>{changeClick(1); setShow(showPhoto);}}>사진작가</button> :
                            <button className='portfolio-button-click' onClick={()=>{changeClick(1); setShow(showPhoto);}}>사진작가</button>}
                        
                        {click.hmClick === false ? <button className='portfolio-button' onClick={()=>{changeClick(2); setShow(showHM);}}>헤어,메이크업</button> :
                            <button className='portfolio-button-click' onClick={()=>{changeClick(2); setShow(showHM);}}>헤어,메이크업</button>}
                
                </div>
                :
                null
            }
            {
                (click.studioClick === false && click.photoClick === false && click.hmClick === false && show.length === 0) &&
                <div className='shoppingBag-none'>
                    <img style={{width:200, height:200}}className='shoppingBag-noneBag' src={shoppingBag}/>
                    <div className='shoppingBag-noneText'>서비스를 선택하세요.</div>
                </div>
            }
            {
                (show.length === 0 && (click.studioClick === true || click.photoClick === true || click.hmClick === true)) &&
                <div className='shoppingBag-none'>
                    <img style={{width:200, height:200}}className='shoppingBag-noneBag' src={shoppingBag}/>
                    <div className='shoppingBag-noneText'>조건에 맞는 서비스가 존재하지 않습니다.</div>
                </div>
            }
            {show.length > 0 &&
                <div className="gallery-container">
                    {
                        show.map((value, index)=>{
                            let item = repPhoto.find(photo => photo.id === value.providerId);
                            let url = item ? item.url : null;
                            return(
                                <div style={{padding:1}}>
                                <div className='image-container-change'>
                                    <img key={index} src={url} onClick={()=>{
                                        getDetail(value);   //모달창에 보여주기 위한 세부정보
                                        getReview(value);
                                        setModalShow(true);
                                    }}/>
                                    <div className='provider-name-change'>{value.providerName}</div>
                                </div>
                                </div>
                            )
                        })
                    }
                </div>

            }
            {
                modalShow &&
                <div className='portfolio-modal' onClick={()=>{setModalShow(false); setScore(0);}}>
                    <div className='portfolio-modalBody' onClick={(event)=>{event.stopPropagation(); setModalShow(true);}}>
                        <pre className='portfolio-modal-text'>
                            이름 : {detail.providerName}<br/>
                            문의 번호 : {detail.providerPhone}<br/>
                            위치 : {detail.providerArea} {detail.providerSubArea} {detail.providerDetailArea}<br/>
                            가격 : {detail.providerPrice}<br/>
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
                            
                            detailPhoto && detailPhoto.map((item, index)=>{
                                return(
                                    <div className='image-container'>
                                        <img src={item.url}/>
                                    </div>
                                )
                            })
                        }
                        </div>
                        }

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
                        </div>
                        }

                        <div className='portfolio-selection'>
                            <button className='portfolio-chatting-button'>채팅</button>
                            <button className='portfolio-selection-button' onClick={(event)=>{
                                event.stopPropagation();
                                setFinal(detail, detail.providerType);
                                setModalShow(false);
                                setScore(0);
                            }}>선택</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default PortfolioEnd;