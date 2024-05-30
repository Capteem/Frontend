import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

//Redux
import { useDispatch, useSelector } from "react-redux"

function Gallery(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem('accesToken');
        if(!token){
            navigate('/');
        }
    },[navigate]);

    const [portfolio, setPortfolio] = useState([]);
    useEffect(()=>{
        console.log("실행");
        axios.get(`${process.env.REACT_APP_URL}/service/confirmed`,
            {
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                }
            }
        )
        .then(function(result){
            console.log(result.data);
            setPortfolio(result.data);
        })
        .catch((error)=>{
            if(error.response.status === 401){
                alert("로그인 만료. 다시 로그인해주세요.")
                navigate('/signin', { replace: true });
            }else{
                alert('서버로부터 data 받아오는 것 실패');
                console.log(error);
            }
        })
    },[]);

    return(
        <div>
            갤러리
        </div>
    )

}

export default Gallery;