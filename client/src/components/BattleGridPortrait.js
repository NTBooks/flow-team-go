import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch, useSelector } from 'react-redux';
import ResizedImage from './ResizedImage';
import styled from 'styled-components';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { gameActions } from '../store/gamestate';

const Clipper = styled.div`
width: 5rem;
height: 6rem;
overflow: hidden;
display: flex;
    align-items: center;
    justify-content: center; 
    position: relative;
    top: 0.5rem;
    border-radius: 1rem;

`

const NFTBezel = styled.div`
width: 4rem;
height: 7rem;
position: relative;
`

const NFTTitle = styled.h3`
position: absolute;
width: 5rem;
font-size: ${props => props.len < 15 ? '0.5rem' : (1.5 * (5 / props.len)) + 'rem'};
color: black;
`

const BattleGridPortrait = (props) => {
    // Get NFT ID, load it from the gamestate

    const myNFT = props.nft_data;
    const trackedNFTData = useSelector(state => myNFT ? state.gamestate.nftStats.find(x => x.collection === myNFT.collection && x.nftid == myNFT.id) : undefined);

    const nftData = trackedNFTData ? JSON.parse(trackedNFTData.content) : null;

    const playerHealth = props.hp ? props.hp.hp : -1;

    console.log(playerHealth);

    const dispatch = useDispatch();

    useEffect(() => {

        if (!trackedNFTData) {
            (async () => {
                const TrackedNFTRequest = await fetch(`/v1/nft/${myNFT.collection}/${myNFT.id}`);
                const TrackedNFTRequestData = await TrackedNFTRequest.json();
                if (TrackedNFTRequestData.nftdata) {
                    console.log("FOUND");
                    dispatch(gameActions.addNFTStats({ nftdata: TrackedNFTRequestData.nftdata }))

                } else {
                    console.log("NOT FOUND");
                    // Doesn't exist, so stub it in so it won't repeat the request
                    dispatch(gameActions.addNFTStats({ nftdata: { nftid: myNFT.id, health: 100, level: -1, collection: myNFT.collection } }))
                }


            })();


        }

    }, []);

    // 

    return !nftData ? <NFTTitle>Not Loaded. </NFTTitle> :
        <NFTBezel>
            <Clipper>
                <ResizedImage style={{ width: '8rem', imageRendering: "pixelated" }} src={nftData.thumbnail} maxWidth={32} />



            </Clipper>
            <NFTTitle style={{ top: '1rem', textShadow: '0 0 0.1rem white', textAlign: 'right' }} len={3}>{trackedNFTData ? (trackedNFTData.level > 0 ? `:L${trackedNFTData.level}` : ':NEW!') : `:L0`}</NFTTitle>
            {playerHealth == 0 ? <div style={{ color: 'red', top: '3rem', position: 'absolute', textAlign: 'center', left: '1.5rem' }}>KO!</div> : <></>}
            <div style={{ height: '0.5rem', width: '3rem', border: '0.1rem solid black', marginLeft: '1rem', display: 'inline-block', top: '-1.5rem', position: 'relative' }}><ProgressBar style={{ height: '0.3rem' }} variant="danger" now={+playerHealth >= 0 ? playerHealth : (trackedNFTData ? trackedNFTData.health : 100)} max="100"></ProgressBar></div>
            <NFTTitle style={{ top: '6.6rem' }} len={nftData.name.length + nftData.id.toString().length + 2}>{nftData.name} #{nftData.id}</NFTTitle>

        </NFTBezel>

        ;


}

export default React.memo(BattleGridPortrait);