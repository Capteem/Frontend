import React, {useState, useEffect} from 'react';
import '../../App.css'
import axios from 'axios';

//Redux
import { useDispatch, useSelector } from "react-redux"
import {changeStudio, changePhotographer, changeHair, 
    changeArea, changeSubarea, changeCommonTimeList} from '../../assets/store.js';

import { debounce } from 'lodash';

import '../../styles/ImageGallery.css'; // CSS 파일 import

function PortfolioEnd(props){

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
        getRep(props.sendToPortfolio)
    },[props.sendToPortfolio]);

    function initialSetting(props){
        const studioTmp = [];
        const photoTmp = [];
        const hmTmp = [];
    
        props.forEach((provider) => {
            switch (provider.providerType) {
                case 1:
                    photoTmp.push(provider);
                    break;
                case 2:
                    hmTmp.push(provider);
                    break;
                case 3:
                    studioTmp.push(provider);
                    break;
                default:
                    break;
            }
        });
    
        setServerStudio(studioTmp);
        setServerPhoto(photoTmp);
        setServerHM(hmTmp);
        setShowStudio(studioTmp);
        setShowPhoto(photoTmp);
        setShowHM(hmTmp);
    }

    //여기서부턴 날짜, 지역 선택 시
    useEffect(()=>{
        settingShowStudio(serverStudio);
        settingShowPhoto(serverPhoto);
        settingShowHM(serverHM);
    },[checkSelect.finalDate, checkSelect.finalArea, checkSelect.finalSubarea])

    function settingShowStudio(props){

        const filteredData = props.filter(item => {
            return (checkDate(item.dateList) || checkSelect.finalDate === '') 
            && (item.providerArea === checkSelect.finalArea || checkSelect.finalArea === "") 
            && (item.providerSubArea === checkSelect.finalSubarea || checkSelect.finalSubarea === "");
        });

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
    }, [serverStudio, serverPhoto, serverHM, showPhoto, showHM, showStudio, click, checkSelect.finalDate])
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
        }
    }

    const [modalShow, setModalShow] = useState(false);
    const [detail, setDetail] = useState([]);
    //server한테 detail 받아옴
    function getDetail(props){
        setDetailPhoto([]);
        axios.get(`http://222.251.241.116:8084/portfolio/data/${props.providerId}`,{
            headers:{
                'Auth-Token' : localStorage.getItem("accesToken")
            },
        })
        .then((result)=>{
            detailImg(result.data.portfolioList);          
        })
        .catch((error)=>{
            if(error.response.status === 404){
                console.log("포트폴리오 존재 안함");
            }
        })
        setDetail(props);
    }

    const [detailPhoto, setDetailPhoto] = useState([]);
    function detailImg(props){
        setDetailPhoto([]);
        props.map((item, index)=>{
            axios.get(`http://222.251.241.116:8084/portfolio/image/${item.imgUrl}`,{
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
                console.log("포폴 detail사진 재요청 에러");
                console.log(error);
            })
        })
    }

    const [repPhoto, setRepPhoto] = useState([]);
    function getRep(props){
        console.log(props);
        props.map((item, index)=>{
            axios.get(`http://222.251.241.116:8084/portfolio/image/${item.providerRepPhotoPath}${item.providerRepPhoto}`,{
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                },
                responseType: "blob",
            })
            .then((result)=>{
                console.log("대표사진 성공");
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
                console.log("대표사진 요청 에러");
                console.log(error);
            })

        })
    }

    return(
        <>
            {windowSize.width > 768 ?
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
            <div className="gallery-container">
                {
                    show.map((value, index)=>{
                        let item = repPhoto.find(photo => photo.id === value.providerId);
                        let url = item ? item.url : null;
                        return(
                            <div className='image-container'>
                            <img key={index} src={url} onClick={()=>{
                                getDetail(value);   //모달창에 보여주기 위한 세부정보
                                setModalShow(true);
                            }}/>
                            </div>
                        )
                    })
                }
            </div>
            {
                modalShow &&
                <div className='portfolio-modal' onClick={()=>{setModalShow(false)}}>
                    <div className='portfolio-modalBody'>
                        <pre>
                            이름 : {detail.providerName}<br/>
                            문의 번호 : {detail.providerPhone}<br/>
                            위치 : {detail.providerArea} {detail.providerSubArea} {detail.providerDetailArea}<br/>
                            가격 : {detail.providerPrice}<br/>
                        </pre>

                        <div className="gallery-container-modal">
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

                        <div className='portfolio-selection'>
                            <button className='portfolio-selection-button' onClick={()=>{
                                setFinal(detail, detail.providerType);
                                setModalShow(false);
                            }}>선택</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default PortfolioEnd;