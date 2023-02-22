import React, { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { gameActions } from '../store/gamestate';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { useSelector } from "react-redux";

const GalleryLoader = (props) => {

    const dispatch = useDispatch();
    const [loaded, setLoaded] = useState(false);
    const [cacheExpired, setCacheExpired] = useState(false);
    const gallery = useSelector(state => state.gamestate.gallery);
    const loadedGallery = useSelector(state => state.gamestate.loadedGallery?.gallery);

    useEffect(() => {

        if (loadedGallery && (loadedGallery === gallery)) {
            setLoaded(true);
            return;
        }

        if (gallery) {
            (async () => {
                const data = await fetch(`/v1/getgallery/${gallery}`);
                dispatch(gameActions.setGalleryData({ data: await data.json() }));
                setLoaded(true);
                setTimeout(() => {
                    setCacheExpired(true);

                }, 5 * 60 * 1000);
            })();
        }

        // TODO: this is brute force but there should be more nuance especially for loading only known NFT IDs in the person's top 6. Although ownership still needs to be confirmed.

    }, [gallery]);

    return <>
        {
            gallery ? (loaded ? <Card>Loaded Wallet Data</Card> : <Card><Spinner> </Spinner>Loading NFT collection...</Card>) : <></>
        }

    </>


}

export default GalleryLoader;