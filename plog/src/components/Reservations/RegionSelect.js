import React, {useState, useEffect} from 'react';
import {areas} from '../../assets/RegionList';

import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

import {changeArea, changeSubarea} from '../../assets/store.js';
import { useDispatch, useSelector } from "react-redux"

//css
import '../../styles/reserve.css'

//todo: 선택완료했으면 props 변경해주기
function RegionSelect(){

    const dispatch = useDispatch();
    const checkArea = useSelector((state)=>state.sendReservation);

    const [selectedArea, setSelectedArea] = useState(""); // 선택된 지역의 이름
    const [selectedSubArea, setSelectedSubArea] = useState(""); // 선택된 하위 지역

    //서버 전송용
    // const [finalArea, setFinalArea] = useState("");
    // const [finalSubArea, setFinalSubArea] = useState("");

    function check(){
        if(checkArea.fianlStudio[0] === "" && checkArea.finalPhotographer[0] === "" && 
        checkArea.finalHair[0] === ""){
            return true;
        }else{
            return false;
        }
    }

    useEffect(()=>{
        if((checkArea.finalArea === undefined || checkArea.finalArea === "") && (checkArea.finalSubArea == undefined || checkArea.finalSubArea == "")){
            setSelectedArea("");
            setSelectedSubArea("");
            // setFinalArea("");
            // setFinalSubArea("");
        }else if(checkArea.finalArea !== undefined && (checkArea.finalSubArea === undefined || checkArea.finalSubArea === "")){
            setSelectedSubArea("");
            // setFinalSubArea("");
        }
    },[checkArea.finalArea, checkArea.finalSubArea])

    //선택시 변수들 업데이트
    const handleAreaChange = (event) => {   //지역 선택
        setSelectedArea(event.target.value);
        // setFinalArea(event.target.value);
        dispatch(changeArea(event.target.value));
        setSelectedSubArea("");
        dispatch(changeSubarea(""));
    };
    const handleSubAreaChange = (event) => {    //서브 지역 선택
        setSelectedSubArea(event.target.value);
        // setFinalSubArea(event.target.value);
        dispatch(changeSubarea(event.target.value));
    };

    return (
        <div>
            <br/>
            <Form.Select bsPrefix='region-select-box' disabled={!check()} aria-label="Default select example" onChange={handleAreaChange} value={selectedArea}>
                <option value="">지역을 선택하세요.</option>
                {checkArea.length > 0 ? checkArea.includeArea.map((area, index) => (
                <option key={index} value={area}>{area}</option>
                )) : areas.map((area, index) => (
                    <option key={index} value={area.name}>{area.name}</option>
                    ))}
            </Form.Select>

            {selectedArea && (
                <div>
                    <Form.Select bsPrefix='region-select-box' disabled={!check()} aria-label="Default select example" onChange={handleSubAreaChange} value={selectedSubArea}>
                        <option value="">하위 지역을 선택하세요.(선택)</option>
                        {areas.find(area => area.name === selectedArea).subArea.map((subArea, index) => (
                        <option>{subArea}</option>
                        ))}
                    </Form.Select>
                </div>
            )}

            {/* <br/>
            {check() == false ? null : 
                <button 
                    className='calculate-button'
                    onClick={()=>{
                    setSelectedArea("");
                    setSelectedSubArea("");
                    setFinalArea("");
                    setFinalSubArea("");
                    dispatch(changeArea(""));
                    dispatch(changeSubarea(""));
            }}>지역 초기화</button>} */}
        </div>
    );
}

export default RegionSelect;