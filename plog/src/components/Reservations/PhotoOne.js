import noReview from '../../assets/noReview.png'
import '../../styles/shoppingBag.css'

function Photo(props){

    let url = props.src;
    let providerName = props.providername;

    const handleClick = props.onClick;

    return(
        <div style={{ flexDirection:'column', display:'flex', height:'150px'}}>
            <div style={{flex: 3, overflow:'hidden'}}>
            {
                url === null ? <img style={{width:'100%', height:'100%'}} onClick={()=>{handleClick();}} src={noReview} /> :
                    <img className='testtest' style={{objectFit:'cover', width:'100%', height:'100%'}} onClick={()=>{handleClick();}} src={url} />
            }
            </div>
            <div style={{flex: 1}}className='provider-name-change'>{providerName}</div>
        </div>
    )

}

export default Photo