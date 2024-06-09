import noReview from '../../assets/noReview.png'

function Photo(props){

    let url = props.src;
    let providerName = props.providername;
    // console.log(providerName);
    return(
        <>
            {
                url === null ? <img src={noReview} /> :
                    <img src={url} />
            }
            <div className='provider-name-change'>{providerName}</div>
        </>
    )

}

export default Photo