import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import remove from '../../../assets/remove';
import { debounce } from 'lodash';

import selectImage from '../../../assets/select-image.png';
import addImg from '../../../assets/addImg.png';

//css
import '../../../styles/ImageGallery.css';
import '../../../styles/serviceInfo.css';
import '../../../styles/reserve.css';

//포폴 조회, 등록, 수정
function ServiceInfo(){

  const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem('accesToken');
        if(!token){
            navigate('/');
        }
    },[navigate])

  const locate = useLocation();
  const queryParams = new URLSearchParams(locate.search);
  const providerId = queryParams.get('providerId');

  const [serviceName, setServiceName] = useState("");
  const [servicePhoneNumber, setServicePhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(0);

  const [change, setChange] = useState(true);

  //서버에서 받아와 화면에 띄울 사진 url들
  const [url, setImageURL] = useState([]);

  //포폴 사진들 조회
  useEffect(()=>{
    console.log(providerId);
    getPhotoList();
    getInfo();
  },[])

  function getInfo(){
    axios.get(`${process.env.REACT_APP_URL}/service/info?providerId=${providerId}`,{
        headers:{
            'Auth-Token' : localStorage.getItem("accesToken")
        },
    })
    .then((result)=>{
      console.log(result.data);
      setServiceName(result.data.providerName);
      settmpServiceName(result.data.providerName);
      repPhoto(result.data);
      setServicePhoneNumber(result.data.providerPhoneNum);
      settmpServicePhoneNumber(result.data.providerPhoneNum);
      setLocation(result.data.providerAddress);
      setPrice(result.data.providerPrice);
      settmpPrice(result.data.providerPrice);
      if(result.data.dateList.length > 0){
        console.log("일정 실행");
        deleteSameTime(result.data.dateList);
      }
    })
    .catch((error)=>{
      if(error.response && error.response.status === 401){
        remove();
        navigate('/signin', { replace: true });
        alert("로그인 만료. 다시 로그인해주세요.")
      }else{
        console.log(error.response);
        console.log("정보 받기 실패");
      }
    })
  }
  function getInfoForRep(){
    axios.get(`${process.env.REACT_APP_URL}/service/info?providerId=${providerId}`,{
        headers:{
            'Auth-Token' : localStorage.getItem("accesToken")
        },
    })
    .then((result)=>{
      console.log(result.data);
      repPhoto(result.data);      
    })
    .catch((error)=>{
      if(error.response && error.response.status === 401){
        remove();
        navigate('/signin', { replace: true });
        alert("로그인 만료. 다시 로그인해주세요.")
      }else{
        console.log(error);
        console.log("정보 받기 실패");
      }
    })
  }

  function getPhotoList(){
    axios.get(`${process.env.REACT_APP_URL}/portfolio/data/${providerId}`,{
        headers:{
            'Auth-Token' : localStorage.getItem("accesToken")
        },
    })
    .then((result)=>{
      detailPhoto(result.data.portfolioList);          
    })
    .catch((error)=>{
        if(error.response.status === 404){
            console.log("포트폴리오 존재 안함");
        } else if(error.response.status === 401){
          remove();
          navigate('/signin', { replace: true });
          alert("로그인 만료. 다시 로그인해주세요.")
        }else{
          console.log(error);
          console.log("정보 받기 실패");
        }
    })
  }

  function detailPhoto(props){
    setImageURL([]);
    props.map((item, index)=>{
        axios.get(`${process.env.REACT_APP_URL}/portfolio/image/${item.imgUrl}`,{
            headers:{
                'Auth-Token' : localStorage.getItem("accesToken")
            },
            responseType: "blob", //바이너리 파일을 사용자가 볼 수 있는 형태로 변환해줌
        })
        .then((result)=>{
            const newFile = new File([result.data], url);   //blob 객체를 File 객체로 변환시켜줌

            const reader = new FileReader(); // 변환한 File 객체를 읽기 위해 FileReader 객체 생성(비동기)
            reader.onload = (event) => {
                const previewImage = String(event.target?.result);
                let tmp = {id: item.portfolioId, url:previewImage};
                setImageURL(url => [...url, tmp]);    
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

  //todo:대표사진 불러오기
  const [repImg, setRepImg] = useState("");
  function repPhoto(props){
    axios.get(`${process.env.REACT_APP_URL}/portfolio/image/${props.providerRepPhotoPath}${props.providerRepPhoto}`,{
      headers:{
        'Auth-Token' : localStorage.getItem("accesToken")
      },
      responseType: "blob", //바이너리 파일을 사용자가 볼 수 있는 형태로 변환해줌
    })
    .then((result)=>{
      const newFile = new File([result.data], url);   //blob 객체를 File 객체로 변환시켜줌
      const reader = new FileReader(); // 변환한 File 객체를 읽기 위해 FileReader 객체 생성(비동기)
      reader.onload = (event) => {
      const previewImage = String(event.target?.result);
      let tmp = previewImage;
      setRepImg(tmp); 
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
  }

  const fileInputRef = useRef();
  function handleClick(){
    fileInputRef.current.click();
  }

  function uploadPhoto(event){
    event.preventDefault();

    let fileArr = event.target.files;

    // FormData 인스턴스 생성
    const formData = new FormData();
    formData.append('providerId', providerId);

    if(fileArr != undefined){
      for (let i = 0; i < fileArr.length; i++) {
        formData.append('portfolioUploadFiles', fileArr[i]);
      }

      axios.post(`${process.env.REACT_APP_URL}/portfolio/upload`,formData, {
          headers:{
              'Content-Type': 'multipart/form-data',
              'Auth-Token' : localStorage.getItem("accesToken"),
          },
      })
      .then((result)=>{
          console.log("성공");
          if(result.status === 200){
              console.log("업로드 성공");
              getPhotoList();
          }
      })
      .catch((error)=>{
        if(error.response && error.response.status === 401){
          remove();
          navigate('/signin', { replace: true });
          alert("로그인 만료. 다시 로그인해주세요.");
        }else{
          console.log(error);
          alert("사진 추가 실패");
        }
      })

    }
  }

  const repInputRef = useRef();
  function handleClickRep(){
    repInputRef.current.click();
  }
  function uploadRep(event){
    event.preventDefault();

    let fileArr = event.target.files[0];

    // FormData 인스턴스 생성
    const formData = new FormData();
    formData.append('providerId', providerId);

    if(fileArr != undefined){
      formData.append('providerRepFile', fileArr);

      axios.post(`${process.env.REACT_APP_URL}/service/rep`,formData, {
          headers:{
              'Content-Type': 'multipart/form-data',
              'Auth-Token' : localStorage.getItem("accesToken"),
          },
      })
      .then((result)=>{
          if(result.status === 200){
              console.log("대표사진 업로드 성공");
              //todo:대표사진 불러오기
              getInfoForRep();
          }
      })
      .catch((error)=>{
        if(error.response && error.response.status === 401){
          remove();
          navigate('/signin', { replace: true });
          alert("로그인 만료. 다시 로그인해주세요.")
        }else{
            console.log(error);
        }
      })
    }
  }

  function removeImg(index, item){
    // url
    let tmp = [...url];
    tmp.splice(index, 1);
    console.log(item);

    axios.delete(`${process.env.REACT_APP_URL}/portfolio/${item.id}`,{
      headers:{
        'Auth-Token' : localStorage.getItem("accesToken")
      }
    })
    .then((response) => {
        setImageURL(tmp);
    })
    .catch((error) => {
      if(error.response && error.response.status === 401){
        remove();
        navigate('/signin', { replace: true });
        alert("로그인 만료. 다시 로그인해주세요.")
      }else{
          console.log(error);
      }
    })
  }
  //여기까지 이미지

  //근무시간 관련
  const day = ["일", "월", "화", "수", "목", "금", "토",];
  const dayEnglish = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY",];
  const [checkDay, setCheckDay] = useState([false, false, false, false, false, false, false]);
  const time = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00",
    "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",];
  const [checkTime, setCheckTime] = useState([false, false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false,]);
  const [timeShow, setTimeShow] = useState(false);
  const [clickDay, setClickDay] = useState(0);

  const [timeCheck, setTimeCheck] = useState([
    [false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false,],
    [false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false,],
    [false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false,],
    [false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false,],
    [false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false,],
    [false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false,],
    [false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false,],
  ]);

  const [originDate, setOriginDate] = useState([]); //날짜,시간,요일
  const [originWorkdate, setOriginWorkdate] = useState([]); //시간, 요일
  const [deleteDate, setDeleteDate] = useState([]); //지우는 날짜
  const [addDate, setAddDate] = useState([]);

  function setChangeDay(dayIndex){
    let tmp = [false, false, false, false, false, false, false,];
    tmp[dayIndex] = true;
    setCheckDay(tmp);
  }

  function resetDay(){
    let tmp = [false, false, false, false, false, false, false,];
    setCheckDay(tmp);
  }

  function checkTimeReset(){
    let tmp = [false, false, false, false, false, false, false, false, false, 
      false, false, false, false, false, false,];
    setCheckTime(tmp);
  }
  function chagneTimeSelect(timeIndex){
    let tmp = [...checkTime];

    if(tmp[timeIndex] === true){
      tmp[timeIndex] = false;
    }
    else{
      tmp[timeIndex] = true;
    }

    setCheckTime(tmp);
    console.log(checkTime);
  }

  function checkTimeList(dayIndex, timeIndex){
    console.log(dayIndex + "," + timeIndex);
    if(timeCheck[dayIndex][timeIndex] === false){
      let tmp = timeCheck
      tmp[dayIndex][timeIndex] = true;
      setTimeCheck(tmp);
    }else {
      let tmp = timeCheck
      tmp[dayIndex][timeIndex] = false;
      setTimeCheck(tmp);
    }
  }

  function checkBeforeSend(){

    const checkPhNum = /^\d{3}-\d{4}-\d{4}$/;

    if(!(tmpserviceName.trim().length > 0)){
      alert("서비스 이름을 입력해주세요.");
    }else if(!checkPhNum.test(tmpservicePhoneNumber)){
      alert("서비스 번호를 입력해주세요.\n(ex.000-0000-0000)");
    }else if(tmpprice <= 0){
      alert("가격을 입력해주세요.");
    }else{
      sendChangeInfo();
      resetDay();
      checkOrigin();
      setChange(true);
    }

  }

  //일정 체크 로직
  const sendDateList = [];
  function checkOrigin(){
    console.log("checkOrigin함수 안");
    console.log(originDate);
    if(originDate.length === 0){
      createDate();
    }else{  //추가 또는 삭제
      let tmpCheckDay = [];
      timeCheck.map((dayItem, dayIndex)=>{
        dayItem.map((timeItem, timeIndex)=>{
          if(timeItem === true){
            tmpCheckDay.push({
              day: dayEnglish[dayIndex],
              time: time[timeIndex]+':00', 
            })
          }
        })
      })
      console.log(tmpCheckDay);

      let tmpAdd = tmpCheckDay.filter(tmpItem => 
        !originWorkdate.some(oItem => oItem.day === tmpItem.day && oItem.time === tmpItem.time));
      setAddDate(tmpAdd);
      let tmpDelete = originWorkdate.filter(oItem => 
        !tmpCheckDay.some(tmpItem => tmpItem.day === oItem.day && tmpItem.time === oItem.time));
      setDeleteDate(tmpDelete);

      if(tmpAdd.length > 0){
        addday(tmpAdd);
      }
      if(tmpDelete.length > 0){
        console.log(tmpDelete);
        deleteday(tmpDelete);
      }
    }
  }
  function deleteday(props){
    console.log("deleteday 함수 안");
    let tmpDelete = originDate.filter(origin => 
      props.some(oItem => oItem.day === origin.day && oItem.time === origin.time));

    console.log("deleteTime함수 실행 전");
    sendDeleteTime(tmpDelete, providerId);
  }

  function sendDeleteTime(props, id){
    console.log("deleteTime 함수 안");
    let tmp = {
      "providerId" : id,
      "dateList" : props
    };
    console.log(tmp);
    axios.post(`${process.env.REACT_APP_URL}/service/delete/workdate`, tmp,
    {
      headers:{
          'Auth-Token' : localStorage.getItem("accesToken")
      }
    })
    .then(function(result){
      console.log(result);
    })
    .catch((error)=>{
      if(error.response && error.response.status === 401){
        remove();
        navigate('/signin', { replace: true });
        alert("로그인 만료. 다시 로그인해주세요.")
      }
      console.log(error);
    })
  }

  function addday(props){
    console.log("addday 함수 안")
    console.log(props);

    let tmpSend = [];

    const today = new Date();
    const twoMonthsLater = new Date(today);
    twoMonthsLater.setMonth(today.getMonth() + 3);

    props.map((item, dayIndex)=>{
      let currentDay = new Date(today);
      let dayindex = dayEnglish.indexOf(item.day);
      if (currentDay.getDay() !== dayindex) {
        currentDay.setDate(today.getDate() + ((dayindex + 7 - today.getDay()) % 7));
      }
      while(currentDay <= twoMonthsLater){
        let tmpdate = new Date(currentDay);
        const sendDateServer = tmpdate.getFullYear() + '-' + (tmpdate.getMonth()+1).toString().padStart(2,'0') 
            + '-' + tmpdate.getDate().toString().padStart(2, '0');
        
        tmpSend.push({
          date: sendDateServer,
          time : item.time,
          day : item.day
        })

        currentDay.setDate(currentDay.getDate() + 7);
      }
    })
    console.log(tmpSend);
    console.log("sendTime함수 전");
    sendTime(tmpSend, providerId);
  }
  function sendTime(props, id){
    console.log("sendTime 함수 안");
    console.log(props);
    let tmp = {
      "providerId" : id,
      "dateList" : props
    };
    axios.post(`${process.env.REACT_APP_URL}/service/workdate`, tmp,
    {
      headers:{
          'Auth-Token' : localStorage.getItem("accesToken")
      }
    })
    .then(function(result){
      console.log(result);
    })
    .catch((error)=>{
      console.log(error);
    })
  }

  function createDate(){  //날짜 최초등록
    const today = new Date();
    const twoMonthsLater = new Date(today);
    twoMonthsLater.setMonth(today.getMonth() + 1);

    day.map((item, dayIndex)=>{
      let currentDay = new Date(today);
      if (currentDay.getDay() !== dayIndex) {
        currentDay.setDate(today.getDate() + ((dayIndex + 7 - today.getDay()) % 7));
      }
      while(currentDay <= twoMonthsLater){
        timeCheck.map((item, timeIndex)=>{
          if(timeCheck[dayIndex][timeIndex] == true){
            let tmp = time[timeIndex] + ":00";
            let tmpdate = new Date(currentDay);
            const sendDateServer = tmpdate.getFullYear() + '-' + (tmpdate.getMonth()+1).toString().padStart(2,'0') 
            + '-' + tmpdate.getDate().toString().padStart(2, '0');

            sendDateList.push({
              date: sendDateServer,
              time : tmp,
              day : dayEnglish[dayIndex]
            })
          }
        })
        currentDay.setDate(currentDay.getDate() + 7);
      }
    })
    console.log(sendDateList);
    if(sendDateList.length > 0){
      if(originWorkdate.length == 0){
        console.log("sendTime함수 전");
        sendTime(sendDateList, providerId);
      }
    }
  }

  //서버한테 받은 시간 중복 없애기
  function deleteSameTime(props){
    setOriginDate(props);
    // 중복을 확인하기 위한 Set 생성
    const uniqueSet = new Set();
    
    // 중복되지 않는 time과 day 조합만을 저장할 새로운 배열
    const uniqueTimeAndDay = [];
    
    props.forEach(({time, day}) => {
      const combination = `${time}-${day}`;
      if (!uniqueSet.has(combination)) {
        uniqueSet.add(combination);
        uniqueTimeAndDay.push({time, day});
      }
    });
    
    setOriginWorkdate(uniqueTimeAndDay);
    settingWithOriginDate(uniqueTimeAndDay);
  }

  function settingWithOriginDate(props){
    console.log(props);

    props.map((item)=>{
      let dayIndex = dayEnglish.indexOf(item.day);
      let tmpTime = item.time.slice(0,-3);
      let timeIndex = time.indexOf(tmpTime);

      let tmpTimecheck = [... timeCheck];
      tmpTimecheck[dayIndex][timeIndex] = true;
      setTimeCheck(tmpTimecheck);
    })
  }

  useEffect(()=>{
    console.log(timeCheck);
  },[timeCheck])


  const [checkChangeInfo, setCheckChangeInfo] = useState(false);
  const [tmpserviceName, settmpServiceName] = useState("");
  const [tmpservicePhoneNumber, settmpServicePhoneNumber] = useState("");
  const [tmpprice, settmpPrice] = useState(0);
  function sendChangeInfo(){
    if(checkChangeInfo === true){
      let tmp = {
        "providerId": providerId,
        "providerName": tmpserviceName,
        "providerPhoneNum": tmpservicePhoneNumber,
        "providerPrice": tmpprice
      };
      console.log(tmp);
      axios.post(`${process.env.REACT_APP_URL}/service/info`,tmp, {
        headers:{
            'Auth-Token' : localStorage.getItem("accesToken"),
        },
      })
      .then((result)=>{
        console.log(result);
        console.log("정보 수정 완료");
        getInfo();
      })
      .catch((error)=>{
        if(error.response && error.response.status === 401){
          remove();
          navigate('/signin', { replace: true });
          alert("로그인 만료. 다시 로그인해주세요.")
        }else{
          console.log(error);
          alert("정보 수정 실패");
          getInfo();
        }
      })

    }
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

  const [imgRemove, setImgRemove] = useState(true);
  return (
    <div className='information-container'>
      <div className='information-block'>
        <div className='information-RefPhoto'>
          {
            repImg === "" ? 
            <div>
              <form onSubmit={(event)=>{uploadRep(event)}}>
                <img className='serviceinfo-repImg' src={selectImage} onClick={()=>{handleClickRep();}}/>
                <input className='input-delete' accept='.png, .jpg' type='file' multiple={true} 
                  ref={repInputRef}
                  disabled={change}
                  onChange={(event)=>{uploadRep(event)}}/>
              </form>
            </div>
            :
            <div>
              <form onSubmit={(event)=>{uploadRep(event)}}>
                <img className='serviceinfo-repImg' src={repImg} onClick={()=>{handleClickRep();}}/>
                <input className='input-delete' accept='.png, .jpeg, .jpg' type='file' multiple={true} 
                  ref={repInputRef}
                  onChange={(event)=>{uploadRep(event)}}/>
              </form>
            </div>
          }
        </div>
        <div className='information-information'>
          <div className='input-group'>
              <span>서비스명</span>
              <input type="text" placeholder={serviceName}
              onChange={(e)=>{settmpServiceName(e.target.value); setCheckChangeInfo(true);}} 
              disabled={change} />
          </div>
          <div className='input-group'>
              <span>문의번호</span>
              <input type="text" placeholder={servicePhoneNumber}
              onChange={(e)=>{settmpServicePhoneNumber(e.target.value); setCheckChangeInfo(true);}} 
              disabled={change} />
          </div>
          <div className='input-group'>
              <span>주소</span>
              <input type="text" placeholder={location} disabled={true} />
          </div>
          <div className='input-group'>
              <span>가격</span>
              <input type="text" placeholder={price}
              onChange={(e)=>{settmpPrice(e.target.value); setCheckChangeInfo(true);}}
              disabled={change} />
          </div>
        </div>
      </div>

      <div className='information-workdate'>
        <div className='information-text'>
          <b>서비스 제공시간</b>
        </div>
        <div className='information-day'>
          {
            day.map((item, index)=>{
              return(
                <>
                {
                  checkDay[index] === true ?
                  <button className="information-daybutton-click" onClick={()=>{
                    setTimeShow(true);
                    setClickDay(index);
                    setChangeDay(index);
                    checkTimeReset();
                  }}>{item}</button>
                  :
                  <button className="information-daybutton" onClick={()=>{
                    setTimeShow(true);
                    setClickDay(index);
                    setChangeDay(index);
                    checkTimeReset();
                  }}>{item}</button>
                }
                </>
              )
            })
          }
        </div>

        <div>{
          timeShow && time.map((item, index)=>{
            return(
              <>
                {
                  timeCheck[clickDay][index] === true ?
                  <button className='timeSelectbutton-select' disabled={change} onClick={()=>{
                    checkTimeList(clickDay, index);
                    chagneTimeSelect(index);
                  }}>{item}</button>
                  :
                  <button className='timeSelectbutton-notSelect' disabled={change} onClick={()=>{
                    checkTimeList(clickDay, index);
                    chagneTimeSelect(index);
                  }}>{item}</button>
                }

                {windowSize.width > 550 ? index !== 0 ? index % 7 === 0 ? <br/> : null : null : null}
              </>
          )})
        }</div>      
      </div>


      <div className='information-portfolio'>
          <b>포트폴리오</b>
      </div>
      {
        url.length === 0 ? 
        <div className='shoppingBag-none'>
          <img className='shoppingBag-noneImg' src={addImg}/>
          <div className='shoppingBag-noneText'>사진을 추가해주세요.</div>
        </div>
        : null
      }
      {url.length > 0 && <div className="gallery-container">
        {url && url.map((item, index) => (
          <div className="image-container">
            <img alt={item.url} src={item.url}/>
            {!imgRemove && <button type="button" className='information-delete-button' onClick={()=>{removeImg(index, item)}}>
              X
            </button>}
          </div>
        ))}
      </div>
      }
      {!change && 
        <>
          <div className='information-removePhoto'>
          {imgRemove === true ?
              <button className='information-finish-button' onClick={()=>{setImgRemove(false)}}>사진 삭제</button>
            :
              <button className='information-finish-button' onClick={()=>{setImgRemove(true)}}>삭제 완료</button>
          }
          {imgRemove === true ?
            <form onSubmit={(event)=>{uploadPhoto(event)}}>
              <button className='information-finish-button' onClick={()=>{handleClick();}}>사진 추가</button>
              <input className='input-delete' accept='.png, .jpeg, .jpg' type='file' multiple={true} 
                ref={fileInputRef}
                onChange={(event)=>{uploadPhoto(event)}}/>
            </form>
            :
              null
          }
          </div>
        </>
      }
      
      <div className='information-change'>
        {change === true ?
          <button className='information-daybutton-click' onClick={()=>{
            setChange(false); setTimeShow(false);
            resetDay();
          }}>수정</button>
            :
          <div>
            <br/>
              <button className='information-finish-button' onClick={()=>{setTimeShow(false);
                console.log("수정완료 버튼 클릭");
                checkBeforeSend();
              }}>수정 완료</button>
          </div>
        }
      </div>
    </div>
  );
}

export default ServiceInfo;