import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';

import Admin_Nav from './Admin_Nav';
import Small_Admin_Nav from './Small_Admin_Nav';

function All_Admin_Nav(){

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
        {
            windowSize.width > 900 ? <Admin_Nav/> : <Small_Admin_Nav/>
        }
        </>
    )
}

export default All_Admin_Nav