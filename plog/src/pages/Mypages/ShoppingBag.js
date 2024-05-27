import { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

//css
import '../../styles/shoppingBag.css'
import shoppingBag from '../../assets/shoppingBag.jpg'

//쿠키에서 받아와서 띄움
function ShoppingBag(){

    const navigate = useNavigate();

    const [dataList, setDataList] = useState([]);
    const [listLength, setListLength] =useState(false);
    const [rendering, setRendering] = useState(false);
    useEffect(()=>{
        getData();
    },[rendering]);

    useEffect(()=>{
        console.log(dataList);
        if(dataList === undefined || dataList.length === 0){
            setListLength(false);
        }else{
            setListLength(true);
        }
    },[dataList])

    
    function getData(){
        const cookies = new Cookies();
        let tmpCookie = cookies.get('tmpBag');
        if(tmpCookie !== undefined){
            console.log(tmpCookie);
            let tmp = tmpCookie;
            console.log(tmp);
            setDataList(tmp);
        }
    }

    function date(props){
        let tmpDate = props.split("T");
        return tmpDate[0];
    }

    function remove(props){
        const newDataList = dataList.filter((item, i) => item !== props);
        setDataList(newDataList);
        cookie.remove("tmpBag");
        if(newDataList === undefined || newDataList.length === 0){
            
        }else{
            cookie.save("tmpBag", newDataList);
        }
    }

    //todo:결제 완료 후 삭제
    function sendPay(props){
        console.log(props);
        const sendList = [{
            "purchaseAmount": props.price,
            "purchaseName": "Plog",
            "reservationRequestDto": {
                "userId": localStorage.getItem('userId'),
                "reservationCameraId": props.photo === "" ? null : props.photoId,
                "reservationCameraName": props.photo === "" ? null : props.photoName,
                "reservationStudioId": props.studio === "" ? null : props.studioId,
                "reservationStudioName": props.studio === "" ? null : props.studioName,
                "reservationHairId": props.hm === "" ? null : props.hmId,
                "reservationHairName": props.hm === "" ? null : props.hmName,
                "reservationStartDate":  props.startDate,
                "reservationEndDate": props.endDate
            }
        }];
        console.log(sendList);
        navigate('/payment', { state: { sendList } });
        remove(props);
    }

    return(
        <div>
            {
                dataList.length === 0 ? 
                <div className='shoppingBag-none'>
                <img className='shoppingBag-noneBag' src={shoppingBag}/>
                <div className='shoppingBag-noneText'>장바구니가 텅 비었습니다</div>
                </div>
                : null
            }
            {
                dataList.length > 0 && <div className='shoppingBag-container-title'>
                    <div className='shoppingBag-date-title'>
                        <b>날짜</b>
                    </div>
                    <div className='shoppingBag-select-title'>
                        <b>선택</b>
                    </div>
                    <div className='shoppingBag-date-title'>
                    </div>
                </div>
            }
            {
                dataList && dataList.map((item, index)=>{
                    console.log(item);
                    let [tmpStartDate, tmpStartTime] = item.startDate.split("T");
                    let timeStart = tmpStartTime.split(":");

                    let [tmpEndDate, tmpEndTime] = item.endDate.split("T");
                    let timeEnd = tmpEndTime.split(":");

                    return(
                        <div key={index} className='shoppingBag-container'>
                            <div className='shoppingBag-date'>
                                {date(item.startDate)}
                                <br/>
                                {timeStart[0]}시 - {timeEnd[0]}시
                                {/* <br/> */}
                                {/* ({item.hours}시간) */}
                            </div>
                            <div className='shoppingBag-select'>
                                studio : {item.studioName === undefined ? "미선택" : item.studioName}
                                <br/>
                                photo : {item.photoName === undefined ? "미선택" : item.photoName}
                                <br/>
                                hair-makeup : {item.hmName === undefined ? "미선택" : item.hmName}
                                <br/>
                            </div>
                            <div className='shoppingBag-price'>
                                <b>총 {item.price}원</b>
                            </div>
                            <div className='shoppingBag-button'>
                                <button className='shoppingBag-calculate-button'
                                    onClick={()=>{
                                        sendPay(item);
                                    }}
                                >결제</button>
                                <br/>
                                <button className='shoppingBag-calculate-button' onClick={()=>{remove(item);}}>삭제</button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default ShoppingBag;