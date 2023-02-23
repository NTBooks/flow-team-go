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
max-height: 10.4rem;
overflow: hidden;
`

const NFTTitle = styled.h3`
position: relative;
top: 0.5rem;
font-size: ${props => props.len < 15 ? '1.5rem' : (1.5 * (15 * 1 / props.len)) + 'rem'};
color: black;
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
                    <Container style={{ padding: '1rem' }}>
                        <Row>
                            <Col><NFTTitle len={myNFT.name.length}>{myNFT.name}</NFTTitle></Col>
                        </Row>
                        <Row>
                            <Col xs={9}>{myNFT.id} / ???</Col>
                            <Col xs={2}>:L1</Col>
                        </Row>
                        <Row>

                            <Col>HP<progress class="nes-progress is-error" value="10" max="100" style={{ height: '1rem', width: '18rem' }}></progress></Col>
                        </Row>
                        <Row>

                            <Col style={{ fontSize: '0.7rem' }}>{myNFT.description.length > 120 ? myNFT.description.substring(0, 120) + "..." : myNFT.description}</Col>
                        </Row>
                    </Container>

                </Col>
            </Row>
        </Container>
        </NFTBezel>

        ;


}

export default NFTPreviewCard;