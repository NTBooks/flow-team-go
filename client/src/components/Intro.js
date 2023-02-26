import React, { useEffect, useState, useRef } from 'react';
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SelectableWrapper from './SelectableWrapper';
import { gameActions } from '../store/gamestate';
import SFXMenu from './SFXMenu';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import LoadWallet from './LoadWallet';
import uuid from 'react-native-uuid';
import { gameActions } from '../store/gamestate';
import GalleryEnterModal from './GalleryEnterModal';


// todo: right and left arrows navigate pages

const FadeContainer = styled.div`
opacity: 1;
transition: opacity ease-out 1s;
`

const TopContainer = styled.div`
  padding: 2rem 0 6rem 0;
  
`
const TitleImage = styled.div`
    width: 100%;
    height: 20rem;
    margin-top:2rem;
    background-size: contain;
    background-position: center center;
    image-rendering: pixelated;
    background-image: url(${require("../../public/ai_art/TitleScreen.png")});
    background-repeat: no-repeat;
`
const FlexItem = styled.div`

  width: 100%;
  height: 2rem;
  text-align: center;
`

const Pane = styled.div`
display:block;
position:fixed;
top:0;
left:0;
width: 100vw;
height: 0px;
pointer-events: none;
z-index: 50000;

`;



const Intro = (props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [exiting, setIsExiting] = useState(false);

    const [newGallery, setNewGallery] = useState('');
    const [newGalleryToken, setNewGalleryToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [submittedCreate, setSubmittedCreate] = useState(false);
    const [lastCreatedAddress, setLastCreatedAddress] = useState("");

    const [show, setShow] = useState(false);
    const [showGallery, setShowGallery] = useState();
    const [showGalleryError, setShowGalleryError] = useState();

    const handleClose = () => {
        setShow(false);
        dispatch(gameActions.disableKeylisteners({ set: false }));
    }


    useEffect(() => {

        setLastCreatedAddress(localStorage.getItem("gogallery"));
        getNewSecret();


    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // create the gallery then redirect

        if (e.target[0].value === '') {
            setErrorMessage("Wallet address cannot be empty.");
            return;
        }

        //${newGallery}
        setSubmittedCreate(true);

        //window.location.href = `/v1/`;
        try {

            setErrorMessage();
            const tempPassword = uuid.v4();

            localStorage.setItem("temp_" + newGallery, tempPassword);

            const fres = await fetch('/v1/create', { method: 'POST', headers: { 'authorization': newGalleryToken, 'content-type': 'application/json' }, body: JSON.stringify({ name: newGallery, wallet: e.target[0].value, pin: tempPassword }) })

            if (fres.status !== 200) {
                setErrorMessage("Server error.");
                setSubmittedCreate(false);
                return;
            }

            const fresjson = await fres.json();
            //console.log(fresjson);
            if (fresjson?.name === newGallery) {
                // it worked
                dispatch(gameActions.setUserWallet({ address: e.target[0].value, gallery: newGallery.split(",")[0], galleryName: newGallery.split(",")[1] }));
                dispatch(gameActions.setJwt({ jwt: `BEARER ${fresjson?.token}`, tempPin: true }));
                localStorage.setItem("gogallery", newGallery);
                navigate(`/${newGallery.split(",")[0]}/a_team/`);
                dispatch(gameActions.disableKeylisteners({ set: false }));

            } else {
                // setError to message
                setErrorMessage(fresjson.message);
                setSubmittedCreate(false);
            }

        } catch (ex) {
            console.log("FETCH EX", ex);
        }

    };



    const getNewSecret = async () => {
        const reg = await fetch('/v1/connect');
        const regjson = await reg.json();
        //console.log("REG", reg, regjson);
        setNewGalleryToken(regjson.token);
        setNewGallery(regjson.secret);

    };

    const loadHandler = async (galleryName) => {
        if (galleryName) {
            setShowGalleryError();
            const galleryExists = await fetch('/v1/galleryexists/' + galleryName);
            if (galleryExists.status === 403) {
                setShowGalleryError("Team does not exist.");
                return;
            }

            const galleryData = await galleryExists.json();
            const galleryParts = galleryData.userName.split(",");
            localStorage.setItem("gogallery", galleryData);

            dispatch(gameActions.setUserWallet({ gallery: galleryParts[0], galleryName: galleryParts[1], jwt: '' }));
            navigate(`/${galleryName}/a_team`);

        }
    }

    const mainMenuHandler = (action) => {

        dispatch(gameActions.setNetwork('http://access.mainnet.nodes.onflow.org:9000/'));

        if (!exiting) {

            dispatch(gameActions.toggleBGM({ set: action === '/demo' ? true : false }));
            dispatch(gameActions.toggleSFX({ set: action === '/demo' ? true : false }));

            if (action === 'NEW GAME') {
                dispatch(gameActions.disableKeylisteners({ set: true }));
                console.log("DISABLE");
                setShow(true);

            }
            if (action === 'LOAD') {
                dispatch(gameActions.disableKeylisteners({ set: true }));
                setShowGallery(true);
            }

            if (action === 'CONTINUE') {
                // TODO: Load Last Gallery, make this option only available if there's state data in localstate
                setIsExiting(true);

                const tempPin = localStorage.getItem("temp_" + lastCreatedAddress);


                if (tempPin) {
                    (async () => {

                        console.log("TEMP PIN", tempPin)
                        const fres = await fetch('/v1/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ gallery: lastCreatedAddress, pin: tempPin }) });
                        const fresjson = await fres.json();

                        if (fresjson?.token) {

                            console.log("SETTTTT")

                            dispatch(gameActions.setJwt({ jwt: `BEARER ${fresjson?.token}`, tempPin: true }));
                            localStorage.setItem("token_" + lastCreatedAddress, fresjson?.token);

                        }

                    })();
                }


                setTimeout(() => {
                    const lastGallery = lastCreatedAddress.split(",");
                    dispatch(gameActions.setUserWallet({ gallery: lastGallery[0], galleryName: lastGallery[1] }));
                    navigate(`/${lastGallery[0]}/a_team`);
                }, 500);
            }

        }
    };

    const selectableObjects = lastCreatedAddress ? [
        { ctrl: <SelectableWrapper> NEW TEAM </SelectableWrapper>, val: 'NEW GAME' },
        { ctrl: <SelectableWrapper> CONTINUE </SelectableWrapper>, val: 'CONTINUE' },
        { ctrl: <SelectableWrapper> LOAD </SelectableWrapper>, val: 'LOAD' }

    ] : [
        { ctrl: <SelectableWrapper> NEW TEAM </SelectableWrapper>, val: 'NEW GAME' },
        { ctrl: <SelectableWrapper> LOAD </SelectableWrapper>, val: 'LOAD' },

    ];

    return <><FadeContainer style={{ opacity: exiting ? 0 : 1 }}>
        <TitleImage />
        <TopContainer> {showGalleryError ? <FlexItem> <Alert>{showGalleryError}</Alert></FlexItem> : <FlexItem>2023 Nick Tantillo<br />released under MIT license.</FlexItem>}</TopContainer>
        <SFXMenu setkey="mmsfx" mainMenuHandler={mainMenuHandler} selectableObjects={selectableObjects} exiting={exiting} />
    </FadeContainer>

        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton >
                <Modal.Title>NEW TEAM</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {submittedCreate === false ? <>
                    <InputGroup className="mb-3">
                        <FormControl
                            type="hidden"
                            value={newGallery}
                            style={{ fontSize: "1rem" }}
                            name={'findorflow'}
                            required={true}
                            readOnly
                        />
                        <FormControl
                            type="text"
                            placeholder={'Save Name'}
                            value={newGallery.split(",")[1]}
                            style={{ fontSize: "1rem", border: '0.2rem solid black' }}
                            name={'displayval'}
                            required={true}
                            readOnly
                        />
                        <Button type="submit" variant={'secondary'} onClick={getNewSecret}>Re-Roll</Button>
                    </InputGroup>
                    <LoadWallet focus={show} label=".find or Flow Address" onSubmit={handleSubmit} pattern="(^0x[a-fA-F0-9]{16}$)|(.+\.[Ff][Ii][Nn][Dd])" />
                    {errorMessage && <Alert variant={'danger'}>{errorMessage}</Alert>}
                    <p style={{ textAlign: 'center' }}>Please enter your <img src={require('../../public/find_logo.png')} style={{ height: '1rem', marginTop: '-0.4rem' }} /> address <br />or your wallet address starting with "0x"</p>
                </> : <Alert variant={'info'}><Spinner></Spinner> Loading...</Alert>
                }

            </Modal.Body>
            {submittedCreate === false &&
                <Modal.Footer>
                    <p style={{ fontSize: '0.8rem', color: '#cccccc', textAlign: 'center' }}>
                        ...I could ask you to enter your wallet address one character at a time like a Game Genie but some 8-bit mechanics are better left in the past.
                    </p>
                </Modal.Footer>
            }
        </Modal>
        <GalleryEnterModal show={showGallery} onClose={(e) => { loadHandler(e); setShowGallery(false); dispatch(gameActions.disableKeylisteners({ set: false })); }} />
    </>;
}

export default Intro;