import React, { useState } from 'react';
import { useDispatch, useStore } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { gameActions } from '../store/gamestate';

const GalleryEnterModal = (props) => {

    const dispatch = useDispatch();

    const unboundGameState = useStore().getState().gamestate;
    const gallery = `${unboundGameState.gallery},${unboundGameState.galleryName}`;

    const [galleryName, setGalleryName] = useState("");
    const [loginError, setLoginError] = useState();

    const handleClose = async () => {
        props.onClose();
    }

    const handleGallerySubmit = async (e) => {
        e.preventDefault();
        // Perform some action with the password

        setLoginError();


        const fres = await fetch('/v1/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ gallery: gallery, pin: loginPassword }) });
        if (fres.status !== 200) {
            setLoginError("Server error.")
            return;
        }

        const fresjson = await fres.json();

        if (fresjson?.token) {
            dispatch(gameActions.setJwt({ jwt: `BEARER ${fresjson?.token}`, setPin: false }));

            localStorage.setItem("token_" + gallery, fresjson?.token);

            localStorage.setItem("gogallery", gallery);

            handleClose();

        } else {

            setLoginError(fresjson.message);
        }



    };


    const galleryEnterModal = <Modal show={props.show} onHide={handleClose}>

        <Modal.Body>
            <Form onSubmit={handleGallerySubmit}>
                <Form.Group>
                    <Form.Label>Enter Team Name ([YY][City][Animal])</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="text"
                            value={loginPassword}
                            onChange={(e) => setGalleryName(e.target.value)}
                            pattern='^\d\d[A-Za-z]{8,}$'
                            required
                        />
                        <Button variant="primary" type="submit">
                            Go!
                        </Button>

                    </InputGroup>
                    {galleryError && <Alert variant='danger' style={{ marginTop: '2rem' }}>{galleryError}</Alert>}
                </Form.Group>

            </Form>
        </Modal.Body>
    </Modal>;
    return galleryEnterModal;

}

export default GalleryEnterModal;