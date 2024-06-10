import {Cookies} from 'react-cookie';

function remove(){

    const cookies = new Cookies();
    localStorage.removeItem('accesToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('userNickname');
    cookies.remove('tmpBag');
}

export default remove;