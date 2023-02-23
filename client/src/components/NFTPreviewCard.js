import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useSelector } from 'react-redux';
import ResizedImage from './ResizedImage';
import styled from 'styled-components';

const Clipper = styled.div`
width: 10rem;
height: 10rem;
overflow: hidden;
display: flex;
    align-items: center;
    justify-content: center; 
    position: relative;
    top: 0.5rem;
    border-radius: 1rem;
`

const NFTBezel = styled.div`

`

const NFTTitle = styled.h3`
position: relative;
top: 0.5rem;
font-size: ${props => props.len < 15 ? '1.5rem' : (2 * (15 * 1 / props.len)) + 'rem'};
`

const NFTPreviewCard = (props) => {
    // Get NFT ID, load it from the gamestate

    const myNFT = useSelector(state => state.gamestate.loadedGallery.nfts[props.data.collection].find(x => x.id === props.data.id));

    console.log(myNFT);

    return !props.data || !myNFT ? <NFTTitle>Not Loaded. </NFTTitle> :
        <NFTBezel>        <Container>
            <Row>
                <Col xs={3}><Clipper><ResizedImage style={{ width: '10rem', imageRendering: "pixelated" }} src={myNFT.thumbnail} maxWidth={64} /> </Clipper></Col>
                <Col xs={9}>
                    <Container>
                        <Row>
                            <Col><NFTTitle len={myNFT.name.length}>{myNFT.name}</NFTTitle></Col>
                        </Row>
                        <Row>
                            <Col>{myNFT.id} / ???</Col>
                        </Row>
                    </Container>

                </Col>
            </Row>
        </Container>
        </NFTBezel>

        ;


}

export default NFTPreviewCard;