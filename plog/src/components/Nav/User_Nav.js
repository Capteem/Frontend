import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';

import Home_Nav from './Home_Nav';
import Small_Home_Nav from './Small_Home_Nav';

function User_Nav(){

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
    }, 500);

    return(
        <>
        {console.log(windowSize)}
        {
            windowSize.width > 900 ? <Home_Nav/> : <Small_Home_Nav/>
        }
        </>
    )
}

export default User_Nav