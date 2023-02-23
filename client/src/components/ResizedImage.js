// Note: This is using private resources. You'll need to get your own gateway if you want to do server side resizes.
// The MIT license does not entitle you to use any server resouces in any other projects.

import React, { useState } from 'react';

const GatewayImage = (props) => {

    const [imgError, setImgError] = useState(false);

    const errorHandler = (e) => {
        setImgError(true);
    };

    const privateGatewayState = process.env.PRIVATE_GATEWAY;

    const imgIPFS = props.src?.indexOf("ipfs://") === 0;

    const imageResizerBypass = process.env.IMAGE_RESIZER_BYPASS.split(",");

    let bypass = false;

    // TODO: Add a pref for image bypass

    imageResizerBypass.forEach(x => {
        if (props.src.indexOf(x) > -1) {
            bypass = true;
        }
    })

    const newSrc = imgIPFS ? `${privateGatewayState}/ipfs/${props.src.replace('ipfs://', '')}?img-onerror=redirect&img-fit=scale-down&img-anim=true&img-width=${props.maxWidth}` :
        bypass ? props.src : process.env.IMAGE_RESIZER.replace('%URL%', encodeURIComponent(props.src)).replace("%WIDTH%", props.maxWidth);

    return <img src={imgError ? require('../../public/GoLogoPNG.png') : newSrc} style={props.style} onError={errorHandler} />;



}

export default GatewayImage;