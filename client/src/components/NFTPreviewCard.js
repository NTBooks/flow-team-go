import React from 'react';
import { useSelector } from 'react-redux';

const NFTPreviewCard = (props) => {
    // Get NFT ID, load it from the gamestate

    const myNFT = useSelector(state => state.gamestate.loadedGallery.nfts[props.collectionID].find(x => x.id === props.nftID));

    return myNFT ? <>Not Loaded.</> : <>{myNFT.name}</>;


}

export default NFTPreviewCard;