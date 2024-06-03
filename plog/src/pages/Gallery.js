import React, {useEffect, useState, useRef} from 'react';
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

    useEffect(()=>{
        getImgPerPage();
    },[]);

    // const [randomImg, setRandomImg] = useState([]);
    const [page, setPage] = useState(1);
    function getImgPerPage(){
        setLoading(true);
        axios.get(`${process.env.REACT_APP_URL}/portfolio/random?page=${page}`,
            {
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                }
            }
        )
        .then(function(result){
            console.log(result.data);
            // setRandomImg(result.data);
            getRep(result.data)
        })
        .catch((error)=>{
            if(error.response && error.response.status === 401){
                navigate('/signin', { replace: true });
                alert("로그인 만료. 다시 로그인해주세요.")
            }else{
                alert('서버로부터 data 받아오는 것 실패');
                console.log(error);
            }
        })
    }

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    // 페이지를 증가시키는 함수
    const loadMoreImages = () => {
        setPage(prevPage => prevPage + 1);
    };

    // 스크롤 이벤트를 감지하는 함수
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
        loadMoreImages();
    };

    useEffect(()=>{
        getImgPerPage();
    },[page])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, [loading]);

    const [imgList, setImgList] = useState([]);
    function getRep(props){
        props.map((item, index)=>{
            axios.get(`${process.env.REACT_APP_URL}/portfolio/image/${item.imgUrl}`,{
                headers:{
                    'Auth-Token' : localStorage.getItem("accesToken")
                },
                responseType: "blob",
            })
            .then((result)=>{
                console.log("사진 받기 성공");
                const newFile = new File([result.data], imgList);   //blob 객체를 File 객체로 변환시켜줌
    
                const reader = new FileReader(); // 변환한 File 객체를 읽기 위해 FileReader 객체 생성(비동기)
                reader.onload = (event) => {
                    const previewImage = String(event.target?.result);
                    let tmp = {id: item.providerId, url:previewImage};
                    setImgList(imgList => [...imgList, tmp]);    
                };
                reader.readAsDataURL(newFile); // 변환한 파일 객체를 넘기면 브라우저가 이미지를 볼 수 있는 링크가 생성됨
            })
            .catch((error)=>{
                if(error.response && error.response.status === 401){
                    alert("로그인 만료. 다시 로그인해주세요.")
                    navigate('/signin', { replace: true });
                }else{
                    console.log("대표사진 요청 에러");
                    console.log(error);
                }
            })
        })
        setLoading(false);
    }

    return(
        <div>
            갤러리
            <div className="gallery-container">
                {
                    imgList.map((value, index)=>{
                        return(
                            <div className='image-container'>
                            <img key={index} src={value.url} 
                            // onClick={()=>{
                            //     getDetail(value);   //모달창에 보여주기 위한 세부정보
                            //     getReview(value);
                            //     setModalShow(true);
                            // }}
                            />
                            </div>
                        )
                    })
                }

                {loading && <h4>Loading...</h4>}
                {!hasMore && <p>All images have been loaded!</p>}
            </div>
        </div>
    )

}

export default Gallery;