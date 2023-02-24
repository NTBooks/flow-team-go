// TODO: toggles state of item below to selected and sets a class
// TODO: Responds to keyboard state?
import React, { useState } from 'react';
import styled from 'styled-components';

const PixelImage = styled.img`
image-rendering:pixelated;
width: 1rem;
position: relative;
top: -0.2rem;
margin-left: 0.2rem;
margin-right: 0.2rem;
opacity: 0.8;

&.hover {
opacity: 0.5;
}

`

const InlineChildren = styled.div`
display: inline-block;

`

const SelectableWrapper = (props) => {


    const [isHover, setIsHover] = useState(false);


    return <>
        <div>
            {props.isSelected || isHover ? <PixelImage className={!props.isSelected && isHover ? 'hover' : ''} src={require("../../public/SelectArrow.png")} /> : <PixelImage src={require("../../public/EmptyArrow.png")} />}
            <InlineChildren onClick={props.onClick} onMouseEnter={(e) => { setIsHover(true) }} onMouseLeave={(e) => { setIsHover(false) }}>{props.children}</InlineChildren>
        </div>
    </>;

}

export default React.memo(SelectableWrapper);