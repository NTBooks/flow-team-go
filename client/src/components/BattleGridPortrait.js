import React, { useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { gameActions } from '../store/gamestate';
import ResizedImage from './ResizedImage';

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

    const myNFT = props.nft_data;
    const trackedNFTData = useSelector(state => myNFT ? state.gamestate.nftStats.find(x => x.collection === myNFT.collection && x.nftid == myNFT.id) : undefined);
    const nftData = trackedNFTData && trackedNFTData.content ? JSON.parse(trackedNFTData.content) : null;
    const playerHealth = props.hp ? props.hp.hp : -1;

    console.log(playerHealth);

    const dispatch = useDispatch();

    useEffect(() => {

        if (!trackedNFTData?.content) {
            (async () => {
                const TrackedNFTRequest = await fetch(`/v1/nft/${myNFT.collection}/${myNFT.id}`);
                const TrackedNFTRequestData = await TrackedNFTRequest.json();
                if (TrackedNFTRequestData.nftdata) {
                    console.log("FOUND", TrackedNFTRequestData.nftdata);
                    dispatch(gameActions.addNFTStats({ nftdata: TrackedNFTRequestData.nftdata }))

                }
            })();
        }

    }, [trackedNFTData]);

    return !nftData ? <NFTTitle style={{ fondSize: '1rem', padding: '3rem 0 0 1.5rem' }}><Spinner> </Spinner> </NFTTitle> :
        <NFTBezel>
            <Clipper>
                <ResizedImage style={{ width: '8rem', imageRendering: "pixelated" }} src={nftData.thumbnail} maxWidth={32} />
            </Clipper>
            <NFTTitle style={{ top: '1rem', textShadow: '0 0 0.1rem white', textAlign: 'right' }} len={3}>{trackedNFTData ? (trackedNFTData.level > 0 ? `:L${trackedNFTData.level}` : ':NEW!') : `:L0`}</NFTTitle>
            {playerHealth == 0 ? <div style={{ color: 'red', top: '3rem', position: 'absolute', textAlign: 'center', left: '1.5rem' }}>KO!</div> : <></>}
            <div style={{ height: '0.5rem', width: '3rem', border: '0.1rem solid black', marginLeft: '1rem', display: 'inline-block', top: '-1.5rem', position: 'relative' }}><ProgressBar style={{ height: '0.3rem' }} variant="danger" now={+playerHealth >= 0 ? playerHealth : (trackedNFTData ? trackedNFTData.health : 100)} max="100"></ProgressBar></div>
            <NFTTitle className='hideSmall' style={{ top: '6.6rem', textAlign: 'center' }} len={nftData.name.length + nftData.id.toString().length + 2}>{nftData.name} #{nftData.id}</NFTTitle>
        </NFTBezel>
}

export default BattleGridPortrait;