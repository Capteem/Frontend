import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function ChatList(){

    // providerid 받기
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const providerId = queryParams.get('providerId');
    const userId = queryParams.get('userId');
    const id = (providerId === null) ? userId : providerId;
    console.log(id);

    return (<div>

    </div>)
}

export default ChatList;