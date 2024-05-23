import React, {useEffect, useState} from 'react';
import { TiStarOutline } from "react-icons/ti";

import axios from 'axios'

function WriteReview(props){

    let initialStar = [false, false, false, false, false];
    const [starClick, setStarClick] = useState([false, false, false, false, false]);
    
    function sendReview(){

        axios.post(`${process.env.REACT_APP_URL}/review/add`,
            {
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                }
            }
        )
        .then(function(result){
            
        })
        .catch((error)=>{
            console.log(error);
            alert('리뷰 작성 실패');
        })

    }
    
    return(
        <div>
            <h4>리뷰쓰기</h4>
            <div>
                <span>별점</span>
                {
                    starClick.map((item, index)=>{
                        return(
                            <button onClick={console.log("별 클릭")} disabled={false}>  {/*calender 보고 css 참고하기*/}
                                <TiStarOutline />
                            </button>
                        )
                    })
                }
            </div>

            <textarea placeholder="리뷰를 입력하시오."/>
            <br/>
            <button onClick={()=>{sendReview();}}>입력완료</button>

        </div>
    );
}

export default WriteReview;