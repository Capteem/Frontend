import { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'; //useCookies
import { NavLink, useNavigate } from "react-router-dom";

import '../styles/multi.css';
import KakaoImage from '../assets/kakaologo.png';


//todo: 로그인 했는지 체크 + 로그아웃(token 다 삭제) 기능
function SignIn(){

    console.log(process.env.REACT_APP_URL);
    let [id, setId] = useState('');
    let [password, setPassword] = useState('');

    const [cookies, setCookie, removeCookie] = useCookies();
    
    let navigate = useNavigate();

    //enter키로 로그인
    const activeEnter = (e) => {
        if(e.key == "Enter"){
            onClickLogin();
        }
    }

    // 서버 한테 id, pw 넘겨줌
    const onClickLogin = () => {
        if(id === "" && password === ""){
            alert("id, password를 입력하세요.");
        } else if(password === ""){
            alert("password를 입력하세요.");
        } else if(id === ""){
            alert("id를 입력하세요.");
        }

        else{   //전부 맞게 입력했을 경우
            // //todo: url 확인
            axios.post(`${process.env.REACT_APP_URL}/sign-api/signin`,{
                id : id,
                password: password,
            })
            .then(function(result){
                console.log(result.data);
                localStorage.setItem("accesToken", result.data.accessToken);
                localStorage.setItem("userId", id);
                localStorage.setItem("role", result.data.role);
                localStorage.setItem("userNickname", result.data.userNickname);
                navigate('/', { replace: true });
                window.location.reload();
            })
            .catch((error)=>{   //존재하지않는 회원 또는 오류
                console.log("로그인 오류. 다시 시도해주세요.");
                console.log(error);
                if(error.response != undefined){
                    if(error.response.status === 406)
                        alert("정지된 회원입니다.");
                    else if(error.response.status === 404)
                        alert("존재하지 않는 회원입니다.")
                    else if(error.response.status === 400)
                        alert("패스워드가 일치하지 않습니다.")
                }
            })
        }
    };

    const REST_API_KEY = 'f6beecf93404eca27071b9f472f53da4';
    const REDIRECT_URL = 'http://localhost:3000/auth';
    const KAKAO_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URL}&response_type=code`
    
    const handleLogin = ()=>{
        window.location.href = KAKAO_URL;
    }       

    return(
        <div className='multi'>
            <h4>로그인</h4>
            <div>
            <input type="text" name="id" placeholder="id" 
                onChange={ (e)=>{setId(e.target.value)}}
                onKeyDown={(e) => activeEnter(e)}
            />
            </div>
            <div>
            <input type="password" name="pw" placeholder="pw" 
                onChange={ (e)=>{setPassword(e.target.value)}}
                onKeyDown={(e) => activeEnter(e)}
            />
            </div>

            <div className='font-custom'>
                <NavLink to="/signup">
                    <u className='font-custom-two'>회원가입</u>
                </NavLink>
                <span className='font-custom-two'> | </span>
                <NavLink to="/findid">
                    <u className='font-custom-two'>id 찾기</u>
                </NavLink>
                <span className='font-custom-two'> | </span>
                <NavLink to="/findpassword">
                    <u className='font-custom-two'>pw 찾기</u>
                </NavLink>
            </div>

            <br/>
            <button className='login-button' onClick={()=>{onClickLogin()}}>로그인</button>
            <div>
            <button 
            onClick={handleLogin}
            style={{
                backgroundColor: "#FEE500",
                border: "none",
                color: "black",
                fontWeight: "blod",
            }}
            ><img 
            src={KakaoImage}
            style={{width:"25px", height:"25px"}}
            />               카카오로그인</button>
            
            </div>
        </div>
    )
}

export default SignIn