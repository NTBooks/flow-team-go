import React, { useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { gameActions } from '../store/gamestate';
import ResizedImage from './ResizedImage';

const Clipper = styled.div`
width: 9rem;
height: 9rem;
overflow: hidden;
display: flex;
    align-items: center;
    justify-content: center; 
    position: relative;
    top: 0.5rem;
    border-radius: 1rem;
`
const NFTBezel = styled.div`
max-height: 9.4rem;
overflow: hidden;
`
const NFTTitle = styled.h3`
position: relative;
top: 0.5rem;
font-size: ${props => props.len < 15 ? '1.5rem' : (1.5 * (15 * 1 / props.len)) + 'rem'};
color: black;
`
const NFTPreviewCard = (props) => {

    const myNFT = useSelector(state => state.gamestate.loadedGallery.nfts[props.data.collection]?.find(x => x.id == props.data.id));
    const trackedNFTData = useSelector(state => state.gamestate.nftStats.find(x => x.collection === props.data.collection && x.nftid == props.data.id));
    const dispatch = useDispatch();

    useEffect(() => {
        if (!trackedNFTData) {
            (async () => {
                const TrackedNFTRequest = await fetch(`/v1/nft/${props.data.collection}/${props.data.id}`);
                const TrackedNFTRequestData = await TrackedNFTRequest.json();
                if (TrackedNFTRequestData.nftdata) {

                    dispatch(gameActions.addNFTStats({ nftdata: TrackedNFTRequestData.nftdata }))

                }
            })();
        }

    }, []);

    return !props.data || !myNFT ? <NFTTitle>Not Loaded. </NFTTitle> :
        <NFTBezel>
            <Container fluid={true}>
                <Row>
                    <Col xs={3}>
                        <Clipper>
                            <ResizedImage style={{ width: '8rem', imageRendering: "pixelated" }} src={myNFT.thumbnail} maxWidth={64} />
                        </Clipper>
                    </Col>
                    <Col xs={9}>
                        <Container style={{ padding: '1rem' }}>
                            <Row>
                                <Col><NFTTitle len={myNFT.name.length}>{myNFT.name}</NFTTitle></Col>
                            </Row>
                            <Row>
                                <Col xs={9}>{myNFT.id} / ???</Col>
                                <Col xs={2}>{trackedNFTData ? (trackedNFTData.level > 0 ? `:L${trackedNFTData.level}` : ':NEW!') : `:L0`}</Col>
                            </Row>
                            <Row>
                                <Col>HP<div style={{ height: '1rem', width: '17rem', border: '0.2rem solid black', marginLeft: '0.5rem', display: 'inline-block', top: '-0.3rem', position: 'relative' }}><ProgressBar variant="danger" now={trackedNFTData ? trackedNFTData.health : 100} max="100"></ProgressBar></div></Col>
                            </Row>
                            <Row>
                                <Col style={{ fontSize: '0.7rem' }}>{myNFT.description.length > 120 ? myNFT.description.substring(0, 120) + "..." : myNFT.description}</Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </NFTBezel>;
}

export default React.memo(NFTPreviewCard);