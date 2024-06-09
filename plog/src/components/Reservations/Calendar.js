import React, {useState, useEffect} from 'react';
import DatePicker, {registerLocale} from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import { addDays, subDays } from 'date-fns';
import { debounce } from 'lodash';

//redux
import {changeDate, changeDateShow, changeFinalStartDate, changeFinalEndDate} from '../../assets/store.js';
import {changeIncludeDateList, changeFinalHours} from '../../assets/store.js';
import { useDispatch, useSelector } from "react-redux"

import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/reserve.css'

//icon
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

function Calendar(){

    registerLocale('ko', ko);

    const dispatch = useDispatch();
    const checkFinal = useSelector((state)=>state.sendReservation);
    const checkDate = useSelector((state)=>state.includeTimes);

    const [startDate, setStartDate] = useState(new Date());

    //예약 가능 마지막 날짜
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);

    //여기서부터 시간 선택 버튼
    const times = [
        "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00",
        "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00",
    ];
    const [checkTimeSelect, setCheckTimeSelect] = useState([
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
    ]);
    const [cannotSelect, setCannotSelect] = useState([
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
    ]);

    const[handlebutton1, setHandlebutton1] = useState(100);
    const[handlebutton2, setHandlebutton2] = useState(100);

    const [finalDate, setFinalDate] = useState("");
    useEffect(()=>{
        setHandlebutton1(100);
        setHandlebutton2(100);
    }, [finalDate]);

    useEffect(()=>{
        if(checkFinal.finalStartDate === ''){
            setCheckTimeSelect([
                false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false,
            ]);
        }
    },[checkFinal.finalStartDate])

    function handleButton(index){
        if(handlebutton1 === 100){
            setHandlebutton1(index);
        }else if(handlebutton2 === 100){
            setHandlebutton2(index);
        }else{
            setHandlebutton1(index);
            setHandlebutton2(100);
        }
    }

    useEffect(()=>{
        if(handlebutton2 !== 100){
            setCheckTimeSelect(checkTimeSelect => checkTimeSelect.map((item, index) => 
                index > handlebutton1 && index <= handlebutton2 ? true : item
            ));
        }else{
            //우선 false로 세팅
            setCheckTimeSelect(checkTimeSelect => checkTimeSelect.map(item => item === true ? false : item));
            //첫번째 클릭만 클릭으로 바꿈
            setCheckTimeSelect(checkTimeSelect => [
                ...checkTimeSelect.slice(0, handlebutton1),
                true,
                ...checkTimeSelect.slice(handlebutton1+1),
            ]);
        }
        changeFormForIncludeDateList();
    },[handlebutton1, handlebutton2])
    //시간 선택 체크

    useEffect(()=>{
        if(checkFinal.finalStartDate !== '' && checkFinal.finalHours !== 0){
            if(checkFinal.finalEndDate !== ''){
                let tmp = checkFinal.finalEndDate.split("T");
                let tmpTime = tmp[1].split(':').slice(0, -1).join(':');

                console.log(tmp[1]);
                setHandlebutton2(times.indexOf(tmpTime));
            }

            let tmp = checkFinal.finalStartDate.split("T");
            let tmpTime = tmp[1].split(':').slice(0, -1).join(':');
            setHandlebutton1(times.indexOf(tmpTime) - 1);
        }

        if(checkFinal.finalStartDate !== ''){
            let tmp = new Date(checkFinal.finalStartDate);
            settingbutton(tmp);
            setStartDate(tmp);
        }
    },[])

    //includeDateList에 저장할 포맷
    function changeFormForIncludeDateList(){
        dispatch(changeFinalHours(0));
        if(handlebutton1 !== 100 && handlebutton2 === 100){
            dispatch(changeFinalHours(1));
            const [selectdate, time] = finalDate.split('T');
            const tmpTime = times[handlebutton1].split(":");
            const tmpHours = tmpTime[0].toString().padStart(2, '0') + ":00:00";
            const list = {
                [selectdate] : tmpHours,
            }

            const tmpTimeTwo = times[handlebutton1 + 1].split(":");
            const tmpHoursTwo = tmpTimeTwo[0].toString().padStart(2, '0') + ":00:00";

            const startDate = selectdate + "T" + tmpHours;
            const endDate = selectdate + "T" + tmpHoursTwo;

            dispatch(changeFinalStartDate(startDate));
            dispatch(changeFinalEndDate(endDate));

            dispatch(changeIncludeDateList(list));
        }else if(handlebutton1 !== 100 && handlebutton2 !== 100){
            const [selectdate, time] = finalDate.split('T');

            const timeList = [];
            checkTimeSelect.map((item, index) => {
                if(index >= handlebutton1 && index <= handlebutton2){
                    const tmpTime = times[index].split(":");
                    const tmpHours = tmpTime[0].toString().padStart(2, '0') + ":00:00";
                    timeList.push(tmpHours);
                }
            })

            const list = {
                [selectdate] : timeList
            };
            dispatch(changeIncludeDateList(list));

            console.log(handlebutton2);
            const tmpTimeTwo = times[handlebutton2].split(":");
            const tmpHoursTwo = tmpTimeTwo[0].toString().padStart(2, '0') + ":00:00";

            const endDate = selectdate + "T" + tmpHoursTwo;
            dispatch(changeFinalEndDate(endDate));

            dispatch(changeFinalHours(handlebutton2-handlebutton1 + 1));
        }
    }

    useEffect(()=>{
        settingbutton(startDate);
        if(checkSelect()){
            setCannotSelect([
                false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false,
            ]);
        }
    },[checkFinal.fianlStudio, checkFinal.finalPhotographer, checkFinal.finalHair])

    //포폴 선택시 시간 버튼 조절
    function settingbutton(props){
        const tmpTime = times;

        const timeList = [];
        tmpTime.map((item, index) => {
            const tmp = item.split(":");
            const tmpHours = tmp[0].toString().padStart(2, '0') + ":00:00";
            timeList.push(tmpHours);
        })

        const studio = checkFinal.fianlStudio.dateList;
        const hm = checkFinal.finalHair.dateList;
        const photo = checkFinal.finalPhotographer.dateList;

        const selectDate = props.getFullYear() + '-' + (props.getMonth()+1).toString().padStart(2,'0') 
        + '-' + props.getDate().toString().padStart(2, '0');

        let studioTime = [];
        let hmTime = [];
        let photoTime = [];
        if(studio !== undefined){
            studioTime = studio.filter(item => item.date === selectDate).map(item => item.time);
        }
        if(hm !== undefined){
            hmTime = hm.filter(item => item.date === selectDate).map(item => item.time);
        }
        if(photo !== undefined){
            photoTime = photo.filter(item => item.date === selectDate).map(item => item.time);
        }

        // 세 배열 중에서 데이터가 있는 배열만 필터링
        const arrays = [studioTime, hmTime, photoTime].filter((array) => array && array.length > 0);
        let commonList = [];
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

        //timeList, commonList 비교 timeList - studioTime인덱스
        // 공통 요소의 studioTime 배열 내 인덱스를 저장할 배열
        let indexList = [];
        if(commonList.length > 0){
            commonList.map((item, index) => {
                const indexInStudioTime = timeList.findIndex(studioItem => studioItem === item);
                // 공통 요소가 studioTime 배열 내에 존재하는 경우, 인덱스를 acc 배열에 추가
                if(indexInStudioTime !== -1) {
                    indexList.push(indexInStudioTime);
                }
            });

            const newCannotSelect = [...cannotSelect];
            times.map((item, index)=>{
                indexList.includes(index) ? newCannotSelect[index] = false
                : newCannotSelect[index] = true
            });
            setCannotSelect(newCannotSelect);
        }
    }


    //화면에 보여질 날짜
    function changeFormatDate(props){
        const offset = props.getTimezoneOffset() * 60000;
        const dateOffset = new Date(props.getTime() - offset);

        const tmp = props.getFullYear() + '-' + (props.getMonth()+1).toString().padStart(2,'0') 
            + '-' + props.getDate().toString().padStart(2, '0');
    
        dispatch(changeDateShow(tmp));
        dispatch(changeDate(dateOffset.toISOString()));
        setFinalDate(dateOffset.toISOString());
    }

    function generateAllDates(props){
        if(props){  //날짜 다 선택 활성화
            return [{start:subDays(new Date(), 0), end:addDays(new Date(),720)}];
        }
        else{
            return false;
        }
    }

    //스튜디오 등 먼저 선택하면 달력 날짜 선별하는 함수
    const commonTimeList = useSelector(state => state.commonTimeList);
    // useEffect(()=>{
    //     includeDate(checkSelect());
    // },[commonTimeList, checkSelect()])
    function includeDate(props){

        if(props){
            return commonTimeList.commonTimeList;
        }
        else{
            return false;
        }
    }

    //스튜디오 등 선택했는지 확인하는 함수
    function checkSelect(){ 
        if(checkFinal.fianlStudio[0] === "" && checkFinal.finalPhotographer[0] === "" && 
        checkFinal.finalHair[0] === ""){
            return true;
        }else{
            return false;
        }
    }

    //여기서부턴 달력 커스텀
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ]
    //여기까지 달력 커스텀

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

    return(
        <div>
            <DatePicker     
                //요일 커스텀
                locale="ko"
                formatWeekDay={(nameOfDay) => nameOfDay.substring(0,1)}
                renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) =>(
                    <div className='customHeaderContainer'>
                        <button className='monthButton' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                            <IoIosArrowBack/>
                        </button>
                        <b>{MONTHS[date.getMonth()]} {date.getFullYear()}</b>
                        <button className='monthButton-two' onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                            <IoIosArrowForward />
                        </button>
                    </div>
                )}
                //여기까지 커스텀
                selected={startDate}
                onChange={(date) => {
                    setStartDate(date);
                    changeFormatDate(date);
                    settingbutton(date);
                }}
                inline
                minDate={new Date()}
                maxDate={maxDate}

                //checkSelect true = 선택 안함. false = 선택함
                includeDates={
                    checkSelect() == true ? includeDate(false) : includeDate(true)
                }
                includeDateIntervals={
                    checkSelect() == true ? generateAllDates(true) : generateAllDates(false)
                }
            />
            <div>
            {
                checkFinal.finalDate && times.map((item, index)=>{
                    if(index === 15){
                        return null;
                    }
                    return(
                        <>
                            {windowSize.width > 300 ? index !== 0 ? index % 4 === 0 ? <br/> : null : null : null}
                            
                            {cannotSelect[index] === true ? 
                                <button disabled={true}
                                className='timeSelectbutton-notSelect'
                                onClick={()=>{handleButton(index); console.log(index);}}
                                >{item}</button>
                                :
                                checkTimeSelect[index] === false ?
                                    <button className='timeSelectbutton-notSelect'
                                        onClick={()=>{handleButton(index); console.log(index);}}
                                    >{item}</button>
                                :
                                    <button className='timeSelectbutton-select'
                                        onClick={()=>{handleButton(index); console.log(index);}}
                                    >{item}</button>
                            }
                        </>
                    )
                })
            }
            </div>
        </div>
    )
}

export default Calendar;