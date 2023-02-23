import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NFTPlacholderCard from './NFTPlaceholderCard';
import SFXMenu from './SFXMenu';
import SelectableWrapper from './SelectableWrapper';
import { useDispatch, useSelector, useStore } from 'react-redux';
import Card from 'react-bootstrap/Card';
import AnimatedText from 'react-animated-text-content';
import SelectNFTPane from './SelectNFTPane';
import { gameActions } from '../store/gamestate';
import NFTPreviewCard from './NFTPreviewCard';


const PixelContainer = styled.div`
background-image: URL('${require('../../public/PixelFrame.png')}');
image-rendering: pixelated;
background-size: contain;
 height: 11rem;
  width: 36rem; 
  background-repeat: no-repeat;
margin: 0.1rem auto 0.1rem auto;
opacity: 0.8;
`

const LoadingMessageContainer = styled.div`

`


const TeamPane = (props) => {

    const paneTeam1 = useSelector(state => props.letter === "A" ? state.gamestate.team_a[0] : state.gamestate.team_b[0]);
    const paneTeam2 = useSelector(state => props.letter === "A" ? state.gamestate.team_a[1] : state.gamestate.team_b[1]);
    const paneTeam3 = useSelector(state => props.letter === "A" ? state.gamestate.team_a[2] : state.gamestate.team_b[2]);

    const unboundGameState = useStore().getState().gamestate;

    console.log("Pane1", paneTeam1);

    const galleryData = useSelector(state => state.gamestate.loadedGallery);

    const [paneMode, setPaneMode] = useState('List'); // Select
    const [selectedSlot, setSelectedSlot] = useState(0); // Select
    const dispatch = useDispatch();

    const funnyLoadingMessages = [
        "Just catching some unicorns to power up the server...",
        "Counting up to infinity and beyond...",
        "Entertaining you with some dad jokes while we load...",
        "Making sure the hamsters are well-fed and running on their wheels...",
        "Running some diagnostics to ensure we don't accidentally summon Cthulhu...",
        "Making a cup of coffee for the server... it's a bit slow without caffeine!",
        "Teaching some JavaScript to the monkeys running the servers...",
        "Checking if we remembered to turn it off and on again...",
        "Counting the number of times we've had to load this page today... it's a lot.",
        "Trying to remember the password to unlock the loading screen...",
        "Giving the servers a pep talk to boost their confidence and speed...",
        "Drawing a doodle of a dinosaur to keep you entertained...",
        "Figuring out what's taking so long... probably the cat videos.",
        "Telling the servers to stop being so lazy and start working faster.",
        "Trying to catch up on the latest cat memes while the page loads...",
        "Making sure the server isn't too hot... it's a delicate balance.",
        "Showing the server some motivational cat videos to boost its speed...",
        "Checking if we remembered to feed the servers today...",
        "Wishing we had a time machine to make this page load faster...",
        "Waking up the servers... they were taking a little nap.",
        "Polishing the hamster wheels for maximum speed...",
        "Searching for the missing puzzle piece to make this page load faster...",
        "Running some stress tests to make sure the servers can handle your awesomeness.",
        "Blaming the lag on the full moon...",
        "Finding the source of the slowness... it's probably that guy in the corner.",
        "Playing some elevator music to make the wait more bearable...",
        "Giving the servers a virtual high-five to encourage them to work faster.",
        "Finding the reset button... again.",
        "Checking if anyone accidentally spilled coffee on the servers...",
        "Waiting for the hamsters to finish their snacks...",
        "Upgrading the servers to make sure they're ready for your awesomeness.",
        "Sending some good vibes to the servers to help them work faster...",
        "Taking a moment to appreciate the beauty of loading screens...",
        "Trying to figure out how to make a page load faster than light...",
        "Wishing we could just snap our fingers and make it load instantly...",
        "Trying to convince the server to work faster with a bribe of pizza...",
        "Running some code optimization techniques to speed things up...",
        "Trying to get the servers to do a dance to make the page load faster...",
        "Giving the servers a pat on the back and a pep talk to make them feel better.",
        "Blaming the slowness on the Mercury Retrograde...",
        "Just running a quick marathon to get some energy flowing...",
        "Apologizing to the servers for making them work so hard...",
        "Giving the servers a virtual hug to show our appreciation...",
        "Playing some upbeat music to keep your spirits high while we load...",
        "Trying to remember the lyrics to the 'Eye of the Tiger' to motivate the servers...",
        "Checking if the servers need a break... they've been working hard.",
        "Sending positive vibes to the servers to help them work faster...",
        "Trying to trick the servers into thinking they're racing to get them to work faster...",
        "Reticulating splines..."
    ];

    const menuHandler = (cmd) => {

        console.log(cmd);
        setPaneMode('Select');
        setSelectedSlot(cmd);

    };

    const [aniText, setAniText] = useState(null);
    const [aniTextInterval, setAniTextInterval] = useState(null);

    useEffect(() => {

        const interval = setInterval(() => {
            console.log("Interval: ", interval, galleryData);
            if (galleryData !== null) {
                console.log("Clear Interval");
                clearInterval(interval);
                return;
            }

            setAniText(funnyLoadingMessages[Math.floor(Math.random() * funnyLoadingMessages.length)]);
            // Create new animated text

        }, 6000);

        setAniTextInterval(interval);

        setTimeout(() => {
            setAniText(funnyLoadingMessages[Math.floor(Math.random() * funnyLoadingMessages.length)]);
        }, 1000);


        return () => {
            clearInterval(interval);
            setAniTextInterval(null);

        }

    }, []);

    // useEffect(() => {

    //     console.log(aniText, aniTextInterval, galleryData !== null);

    //     if (aniTextInterval && galleryData !== null) {

    //         clearInterval(aniTextInterval);
    //         setAniTextInterval(null);

    //     }
    // }, [aniText]);




    const addToTeam = (e) => {

        // Make sure not a dupe
        const allNFTs = [...unboundGameState.team_a, ...unboundGameState.team_b];
        console.log(allNFTs);
        if (allNFTs.find(x => x !== null && (x.collection === e.collection) && (x.id === e.id))) {
            return;
        }
        console.log("HERE", e)

        dispatch(gameActions.addToTeam({ team: props.letter, position: selectedSlot, collection: e.collection, nftid: e.id }));

    }

    const selectableObjects = [
        {
            ctrl: <SelectableWrapper key={'Slot 1'}>
                <PixelContainer>
                    {!paneTeam1 ? <NFTPlacholderCard /> : <NFTPreviewCard data={paneTeam1} />}
                </PixelContainer>
            </SelectableWrapper>, val: 0
        },
        {
            ctrl: <SelectableWrapper key={'Slot 2'}>
                <PixelContainer>
                    {!paneTeam2 ? <NFTPlacholderCard /> : <NFTPreviewCard data={paneTeam2} />}
                </PixelContainer>
            </SelectableWrapper>, val: 1
        },
        {
            ctrl: <SelectableWrapper key={'Slot 3'}>
                <PixelContainer>
                    {!paneTeam3 ? <NFTPlacholderCard /> : <NFTPreviewCard data={paneTeam3} />}
                </PixelContainer>
            </SelectableWrapper>, val: 2
        }
    ];

    return paneMode === 'List' ? <>
        <h1>Team {`${props.letter}`}</h1>
        {galleryData === null ?
            (aniText ?
                <div className={'nes-container with-title'} style={{ margin: '3rem', textAlign: 'center' }}>
                    <h3 className='title' style={{ fontSize: '2rem', marginTop: '-2.5rem' }}>Loading</h3>
                    <AnimatedText
                        type="chars" // animate words or chars
                        animation={{
                            x: '200px',
                            y: '-20px',
                            scale: 1.1,
                            ease: 'ease-in-out',
                        }}
                        animationType="bounce"
                        interval={0.06}
                        duration={0.8}
                        tag="p"
                        className="animated-paragraph"
                        includeWhiteSpaces
                        threshold={0.1}
                        rootMargin="20%"
                    >
                        {aniText}
                    </AnimatedText>
                </div> : <div style={{ textAlign: "center" }}>Checking cache...</div>) :
            <SFXMenu setkey="teamsfx" selectableObjects={selectableObjects} mainMenuHandler={menuHandler} />}




    </> : <SelectNFTPane pickNFTHandler={(e) => { console.log(e); if (e !== null) addToTeam(e); setPaneMode('List'); }} />;
}

export default TeamPane;
