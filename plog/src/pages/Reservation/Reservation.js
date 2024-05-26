// 패키지 예약 페이지
import Calendar from '../../components/Reservations/Calendar.js';
import RegionSelect from '../../components/Reservations/RegionSelect.js';
import React, {useEffect, useState} from 'react';
import PortfolioEnd from '../../components/Reservations/PortfolioEnd.js';
import { debounce } from 'lodash';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import axios from 'axios'

//react-bootstrap
import Accordion from 'react-bootstrap/Accordion';

//Redux
import { useDispatch, useSelector } from "react-redux"
import {reset, changeStudio, changePhotographer, changeHair, changeArea, changeSubarea, changeDate, changeDateShow} from '../../assets/store.js';


//css
import '../../styles/reserve.css'
import '../../styles/Table.css';

// todo: 로그인 했는지 확인
function Reservation(){
    const dispatch = useDispatch();
    //여기서부터 수정중
    const [sendToPortfolio, setSendToPortfolio] = useState([]);
    //서버한테 제공자들 데이터 받아옴
    useEffect(()=>{
        console.log("실행");
        dispatch(reset());
        axios.get(`${process.env.REACT_APP_URL}/service/confirmed`,
            {
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                }
            }
        )
        .then(function(result){
            console.log(result.data);
            const tmp = result.data;;
            setSendToPortfolio(tmp);
        })
        .catch((error)=>{
            console.log(error);
            alert('서버로부터 data 받아오는 것 실패');
        })
    },[]);

    const navigate = useNavigate();
    const checkFinal = useSelector((state)=>state.sendReservation);

    function resetArea(){
        if(checkFinal.fianlStudio[0] === "" && checkFinal.finalPhotographer[0] === "" && 
        checkFinal.finalHair[0] === ""){
            dispatch(changeArea(""));
            dispatch(changeSubarea(""));
        }
    }

    //필수적인것들 체크했는지 확인
    //todo: server check
    //todo: 스튜디오 등 선택 체크
    function checkSelect(){
        if(checkFinal.finalDate === ""){
            alert("날짜를 선택하세요.");
            return false;
        } else if(checkFinal.fianlStudio[0] === "" && checkFinal.finalPhotographer[0] === "" && 
        checkFinal.finalHair[0] === ""){
            alert("옵션을 선택하세요.");
            return false;
        }else{
            return true;
            // sendServer();
        }
    }

    //가격체크
    const[price, setPrice] = useState(0);
    useEffect(()=>{
        calculatePrice();
    }, [checkFinal.finalHours, checkFinal.fianlStudio, checkFinal.finalPhotographer, checkFinal.finalHair]);

    function calculatePrice(){

        let studioPrice = checkFinal.fianlStudio.providerPrice === undefined ? 0 : checkFinal.fianlStudio.providerPrice;
        let photoPrice = checkFinal.finalPhotographer.providerPrice === undefined ? 0 : checkFinal.finalPhotographer.providerPrice; 
        let hmPrice = checkFinal.finalHair.providerPrice === undefined ? 0 : checkFinal.finalHair.providerPrice;

        setPrice(checkFinal.finalHours*
            (studioPrice + photoPrice + hmPrice));

    }

    function shoppingBag(){
        const cookies = new Cookies();
        let tmpCookie = cookies.get('tmpBag');

        let storeInCookie= [];
        console.log(tmpCookie);
        if(tmpCookie === undefined){
            storeInCookie = [{
                studioId :  checkFinal.fianlStudio === "" ? " " : checkFinal.fianlStudio.providerId,
                studioName: checkFinal.fianlStudio === "" ? " " : checkFinal.fianlStudio.providerName,
                photoId : checkFinal.finalPhotographer === "" ? " " : checkFinal.finalPhotographer.providerId,
                photoName : checkFinal.finalPhotographer === "" ? " " : checkFinal.finalPhotographer.providerName,
                hmId : checkFinal.finalHair === "" ? " " : checkFinal.finalHair.providerId,
                hmName : checkFinal.finalHair === "" ? " " : checkFinal.finalHair.providerName,
                price : price,
                startDate : checkFinal.finalStartDate,
                endDate : checkFinal.finalEndDate,
                hours : checkFinal.finalHours,
            },]
        }else{
            console.log("쿠키 차있음")
            storeInCookie = [...tmpCookie, {
                studioId :  checkFinal.fianlStudio === "" ? " " : checkFinal.fianlStudio.providerId,
                studioName: checkFinal.fianlStudio === "" ? " " : checkFinal.fianlStudio.providerName,
                photoId : checkFinal.finalPhotographer === "" ? " " : checkFinal.finalPhotographer.providerId,
                photoName : checkFinal.finalPhotographer === "" ? " " : checkFinal.finalPhotographer.providerName,
                hmId : checkFinal.finalHair === "" ? " " : checkFinal.finalHair.providerId,
                hmName : checkFinal.finalHair === "" ? " " : checkFinal.finalHair.providerName,
                price : price,
                startDate : checkFinal.finalStartDate,
                endDate : checkFinal.finalEndDate,
                hours : checkFinal.finalHours,
            }]
        }
        cookies.remove("tmpBag");
        cookies.set("tmpBag", storeInCookie, {path: '/'});
    }

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
    }, 1000);

    const [selectNum, setSelectNum] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [modalShoppingShow, setmMdalShoppingShow] = useState(false);

    function sendPay(){
        const sendList = [{
            "purchaseAmount": price,
            "purchaseName": "Plog",
            "reservationRequestDto": {
                "userId": localStorage.getItem('userId'),
                "reservationCameraId": checkFinal.finalPhotographer === "" ? null : checkFinal.finalPhotographer.providerId,
                "reservationCameraName": checkFinal.finalPhotographer === "" ? null : checkFinal.finalPhotographer.providerName,
                "reservationStudioId": checkFinal.fianlStudio === "" ? null : checkFinal.fianlStudio.providerId,
                "reservationStudioName": checkFinal.fianlStudio === "" ? null : checkFinal.fianlStudio.providerName,
                "reservationHairId": checkFinal.finalHair === "" ? null : checkFinal.finalHair.providerId,
                "reservationHairName": checkFinal.finalHair === "" ? null : checkFinal.finalHair.providerName,
                "reservationStartDate":  checkFinal.finalStartDate,
                "reservationEndDate": checkFinal.finalEndDate
            }
        }];
        console.log(sendList);
        navigate('/payment', { state: { sendList } });
    }

    return(

        <div className='reservation-start-container'>
            {windowSize.width > 768 ?
                <div className="reservation-container">
                    <div className="calendar">
                        <Calendar/>
                        <RegionSelect/>
                    </div>
                    <div className="portfolio">
                        <PortfolioEnd sendToPortfolio={sendToPortfolio} />
                    </div>
                    <div className="selection">
                        <div>
                            <h6 className='reservation-h6'><b>날짜</b></h6>
                            <span className='reservation-align'>
                                {checkFinal.finalDateShow}
                                {checkFinal.finalDateShow === '' ? <span className='reservation-not-selected'>미선택</span> : 
                                    <button className='reservation-x-button'
                                        onClick={()=>{ dispatch(changeDate("")); dispatch(changeDateShow(''));}}
                                >x</button>}
                            </span>
                        </div>
    
                        <div>
                            <h6 className='reservation-h6'><b>스튜디오</b></h6>
                            <span className='reservation-align'>
                                {checkFinal.fianlStudio.providerName}
                                {checkFinal.fianlStudio.providerName === undefined ? <span className='reservation-not-selected'>미선택</span> : <button
                                    className='reservation-x-button'
                                    onClick={()=>{dispatch(changeStudio([""])); resetArea();}}
                                >x</button>}
                            </span>
                        </div>
        
                        <div>
                            <h6 className='reservation-h6'><b>사진작가</b></h6>
                            <span className='reservation-align'>
                                {checkFinal.finalPhotographer.providerName}
                                {checkFinal.finalPhotographer.providerName === undefined ? <span className='reservation-not-selected'>미선택</span> : <button
                                    className='reservation-x-button'
                                    onClick={()=>{dispatch(changePhotographer([""])); resetArea();}}
                                >x</button>}
                            </span>
                        </div>
        
                        <div>
                            <h6 className='reservation-h6'><b>헤어 메이크업</b></h6>
                            <span className='reservation-align'>
                                {checkFinal.finalHair.providerName}
                                {checkFinal.finalHair.providerName === undefined ? <span className='reservation-not-selected'>미선택</span> : <button
                                    className='reservation-x-button'
                                    onClick={()=>{dispatch(changeHair([""])); resetArea();}}
                                >x</button>}
                            </span>
                        </div>
        
                        <div>
                            <h6 className='reservation-h6'><b>지역</b></h6>
                            <span className='reservation-align'>
                                {checkFinal.finalArea} {checkFinal.finalSubarea}
                                {checkFinal.finalArea === "" ? <span className='reservation-not-selected'>미선택</span> : <button
                                    className='reservation-x-button'
                                    onClick={()=>{dispatch(changeArea("")); dispatch(changeSubarea(""));}}
                                >x</button>}
                            </span>
                        </div>

                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <div className='reservation-price'>
                            {isNaN(price) ? <>총가격:0원</> :
                                <>총가격:{price}원</>
                            }
                        </div>
                        <div className='reservation-caculate-design'>
                        <button className='calculate-button' onClick={()=>{
                            if(checkSelect()){
                                setmMdalShoppingShow(true);
                            }
                        }}>장바구니</button>
                        <button className='calculate-button'
                            onClick={()=>{
                                if(checkSelect()){
                                    setModalShow(true);
                                }
                            }}
                        >결제하기</button>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                날짜:{checkFinal.finalDateShow} 
                                    {checkFinal.finalDateShow === '' ? "미선택" : <button
                                        className='reservation-x-button'
                                        onClick={()=>{ dispatch(changeDate("")); dispatch(changeDateShow(''));}}
                                    >x</button>}
                            </Accordion.Header>
                            <Accordion.Body>
                                <Calendar/>
                                <RegionSelect/>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header onClick={()=>{setSelectNum(3);}}>
                                스튜디오:{checkFinal.fianlStudio.providerName}
                                {checkFinal.fianlStudio.providerName === undefined ? null : <button
                                    className='reservation-x-button'
                                    onClick={()=>{dispatch(changeStudio([""])); resetArea();}}
                                >x</button>}
                            </Accordion.Header>
                            <Accordion.Body>
                                <PortfolioEnd sendToPortfolio={sendToPortfolio} selectNum={3}/>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="2">
                            <Accordion.Header onClick={()=>{setSelectNum(1)}}>
                                사진작가:{checkFinal.finalPhotographer.providerName}
                                {checkFinal.finalPhotographer.providerName === undefined ? null : <button
                                    className='reservation-x-button'
                                    onClick={()=>{dispatch(changePhotographer([""])); resetArea();}}
                                >x</button>}
                            </Accordion.Header>
                            <Accordion.Body>
                                <PortfolioEnd sendToPortfolio={sendToPortfolio} selectNum={1}/>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="3">
                            <Accordion.Header onClick={()=>{setSelectNum(2)}}>
                                헤메:{checkFinal.finalHair.providerName}
                                {checkFinal.finalHair.providerName === undefined ? null : <button
                                    className='reservation-x-button'
                                    onClick={()=>{dispatch(changeHair([""])); resetArea();}}
                                >x</button>}
                            </Accordion.Header>
                            <Accordion.Body>
                                <PortfolioEnd sendToPortfolio={sendToPortfolio} selectNum={2}/>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    {isNaN(price) ? <h3>총가격:0원</h3> :
                        <h3>총가격:{price}원</h3>
                    }
                    <button className='calculate-button' onClick={()=>{
                        if(checkSelect()){
                            setmMdalShoppingShow(true);
                        }
                    }}>장바구니</button>

                    <button className='calculate-button'
                        onClick={()=>{
                            if(checkSelect()){
                                setModalShow(true);
                            }
                        }}
                    >결제하기</button>
                </div>
            }

            {/* 결제 모달 창 */}
            {
                modalShow &&
                <div className='portfolio-modal' onClick={()=>{setModalShow(false)}}>
                    <div className='portfolio-modalBody'>
                        <div className='reservation-center-bottom'>
                            <div className='reservation-center'>
                                <h5>결제하시겠습니까?</h5>
                            </div>
                            <br/>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>날짜</th>
                                        <td>
                                            {checkFinal.finalDateShow}
                                            {checkFinal.finalDateShow === '' ? <span className='reservation-not-selected'>미선택</span> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>스튜디오</th>
                                        <td>
                                            {checkFinal.fianlStudio.providerName}
                                            {checkFinal.fianlStudio.providerName === undefined ? <span className='reservation-not-selected'>미선택</span> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>사진작가</th>
                                        <td>
                                            {checkFinal.finalPhotographer.providerName}
                                            {checkFinal.finalPhotographer.providerName === undefined ? <span className='reservation-not-selected'>미선택</span> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>헤어 메이크업</th>
                                        <td>
                                            {checkFinal.finalHair.providerName}
                                            {checkFinal.finalHair.providerName === undefined ? <span className='reservation-not-selected'>미선택</span> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>지역</th>
                                        <td>
                                        {checkFinal.finalArea} {checkFinal.finalSubarea}
                                        {checkFinal.finalArea === "" ? <span className='reservation-not-selected'>미선택</span> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>총가격</th>
                                        <td>{price}원</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className='reservation-calculate'>
                                <button className='calculate-button' onClick={()=>{
                                    setModalShow(false);
                                    sendPay();
                                }}>결제</button>
                                <button className='calculate-button' onClick={()=>{
                                    setModalShow(false);
                                }}>취소</button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {
                modalShoppingShow &&
                <div className='portfolio-modal' onClick={()=>{setmMdalShoppingShow(false)}}>
                    <div className='portfolio-modalBody'>
                        <div className='reservation-center-bottom'>
                            <div className='reservation-center'>
                                <h5>장바구니에 담으시겠습니까?</h5>
                            </div>
                            <br/>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>날짜</th>
                                        <td>
                                            {checkFinal.finalDateShow}
                                            {checkFinal.finalDateShow === '' ? <span className='reservation-not-selected'>미선택</span> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>스튜디오</th>
                                        <td>
                                            {checkFinal.fianlStudio.providerName}
                                            {checkFinal.fianlStudio.providerName === undefined ? <span className='reservation-not-selected'>미선택</span> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>사진작가</th>
                                        <td>
                                            {checkFinal.finalPhotographer.providerName}
                                            {checkFinal.finalPhotographer.providerName === undefined ? <span className='reservation-not-selected'>미선택</span> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>헤어 메이크업</th>
                                        <td>
                                            {checkFinal.finalHair.providerName}
                                            {checkFinal.finalHair.providerName === undefined ? <span className='reservation-not-selected'>미선택</span> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>지역</th>
                                        <td>
                                        {checkFinal.finalArea} {checkFinal.finalSubarea}
                                        {checkFinal.finalArea === "" ? <span className='reservation-not-selected'>미선택</span> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>총가격</th>
                                        <td>{price}원</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className='reservation-calculate'>
                                <button className='calculate-button' onClick={()=>{
                                    shoppingBag();
                                    setModalShow(false);
                                }}>확인</button>
                                <button className='calculate-button' onClick={()=>{
                                    setmMdalShoppingShow(false);
                                }}>취소</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>

    )
}

export default Reservation;