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
    useEffect(()=>{
        const token = localStorage.getItem('accesToken');
        if(!token){
            navigate('/');
        }
    },[navigate])

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

    const [calculateModal, setCalculateModal] = useState(false);
    const [itemModal, setItemModal] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    

    return(
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <div style={{maxWidth:1000, width:'90%'}}>
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
                                        setCalculateModal(true);
                                        setItemModal(item);
                                    }}
                                >결제</button>
                                <br/>
                                <button className='shoppingBag-calculate-button' onClick={()=>{setDeleteModal(true); setItemModal(item);}}>삭제</button>
                            </div>
                        </div>
                    )
                })
            }

            {/* 결제 모달 창 */}
            {
                calculateModal &&
                <div className='portfolio-modal' onClick={()=>{setCalculateModal(false)}}>
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
                                            {itemModal.startDate.split("T")[0]}
                                            <br/>
                                            ({itemModal.startDate.split("T")[1].split(":")[0]}시-{itemModal.endDate.split("T")[1].split(":")[0]}시)
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>스튜디오</th>
                                        <td>
                                            {itemModal.studioName}
                                            {itemModal.studioName === undefined ? <span className='reservation-not-selected'>미선택</span> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>사진작가</th>
                                        <td>
                                            {itemModal.photoName}
                                            {itemModal.photoName === undefined ? <span className='reservation-not-selected'>미선택</span> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>헤.메</th>
                                        <td>
                                            {itemModal.hmName}
                                            {itemModal.hmName === undefined ? <span className='reservation-not-selected'>미선택</span> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>총가격</th>
                                        <td>{itemModal.price}원</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className='reservation-calculate'>
                                <button className='calculate-button' onClick={()=>{
                                    setCalculateModal(false);
                                    sendPay(itemModal);
                                }}>결제</button>
                                <button className='calculate-button' onClick={()=>{
                                    setCalculateModal(false);
                                }}>취소</button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {
                deleteModal &&
                <div className='small-portfolio-modal' onClick={()=>{setDeleteModal(false)}}>
                <div className='small-portfolio-modalBody'>
                    <div className='small-modal-big-text'>삭제하시겠습니까?</div>
                    <button className='small-modal-button' onClick={()=>{
                        remove(itemModal);
                        setDeleteModal(false);
                    }}>확인</button>
                    <button className='small-modal-button' onClick={()=>{setDeleteModal(false);}}>취소</button>
                </div>
                </div>
            }
        </div>
        </div>
    );
}

export default ShoppingBag;