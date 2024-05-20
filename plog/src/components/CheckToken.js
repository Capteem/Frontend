import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie'; //useCookies

/**
 * 로직 설명
 * 서버 요청할 때 header에 accesToken담아서 보냄 이 때 거부당하면
 * CheckToken함수 실행
 * props로 요청할 url전달
 * 토큰 만료 전이면 result 값 return으로 전달
 * 
 * get, post, delete등 다 다르게?
 * 파라미터 전달유무에 따라서 또 다르게?
 */

//유저 권한들 확인 예정
function CheckToken(props){

    try {
        //todo: refreshToken key값 뭔지
        const tokenTmp = useCookies(['refreshToken']);
        const response = axios.post('url/checkuser', {
            headers:{
                'Auth-Token' : tokenTmp
            }
        });
       
        // 상태 코드에 따른 처리
        if (response.status === "?") {  //refreshToken 만료시
            localStorage.removeItem("accessToken");
            removeCookie('refreshToken');

            alert("로그인 만료. 다시 로그인하세요");
            //todo : 로그인 창으로 감

        } else if (response.status === "?") {   //refreshToekn 만료 안됨 accesToken 재발급 받음
            //accesstoken 다시 저장
            localStorage.setItem('accessToken', response.data.accesToken);
            return null;
        }
        
    } catch (error) {
        alert("error");
    }
}

export default CheckToken;