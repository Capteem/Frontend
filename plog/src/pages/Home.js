import React, { useState, useEffect } from 'react';
import HomeImage from '../assets/home.jpg'

function Home() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [textAlignment, setTextAlignment] = useState('center');

  useEffect(() => {
    // 초기 화면 크기 감지
    const updateTextAlignment = () => {
      if (window.innerWidth >= 768) {
        setTextAlignment('left');
      } else {
        setTextAlignment('center');
      }
    };

    updateTextAlignment();

    const handleResize = () => {
      // 화면 크기 변경 감지
      setWindowWidth(window.innerWidth);
      updateTextAlignment();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <img 
        src={HomeImage} 
        style={{
          width: '100%',
          height: `${window.innerHeight * 0.9}px`,
          objectFit: 'cover',
          margin: '-20px'
        }}
        alt="Home Background" 
      />
      <div 
        style={{ 
          position: 'absolute', 
          top: '57%', 
          left: textAlignment === 'center' ? '50%' : '23%', 
          transform: 'translate(-50%, -50%)', 
          textAlign: textAlignment 
        }}
      >
        <h1 
          style={{ 
            color: 'white', 
            fontSize: `${windowWidth * 0.04}px`, // 화면 크기에 비례한 글씨 크기
            marginBottom: '1rem' 
          }}
        >
          직접 커스텀할 수 있는 <br/>
          <span style={{color: "#efbb54"}}>
            사진촬영 패키지
          </span>
        </h1>
        <p 
          style={{ 
            color: 'white', 
            fontSize: `${windowWidth * 0.014}px`, // 화면 크기에 비례한 글씨 크기
            marginBottom: '2rem' 
          }}
        >
          스튜디오 | 사진작가 | 헤어&메이크업까지 <span style={{color: "#efbb54"}}>한번에</span> 예약해보세요
        </p>
      </div>
    </div>
  );
}

export default Home;
