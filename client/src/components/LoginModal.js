import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useStore } from 'react-redux';
import { gameActions } from '../store/gamestate';

const LoginModal = (props) => {

    const dispatch = useDispatch();

    const unboundGameState = useStore().getState().gamestate;
    const gallery = `${unboundGameState.gallery},${unboundGameState.galleryName}`;

    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState();

    const handleClose = async () => {
        props.onClose();
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

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


    const loginModal = <Modal show={props.show} onHide={handleClose}>
        <Modal.Body>
            <Form onSubmit={handleLoginSubmit}>
                <Form.Group>
                    <Form.Label>Enter password for {unboundGameState.galleryName}</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            pattern='^.{4,}$'
                            required
                        />
                        <Button variant="primary" type="submit">
                            Log In
                        </Button>
                    </InputGroup>
                    {loginError && <Alert variant='danger' style={{ marginTop: '2rem' }}>{loginError}</Alert>}
                </Form.Group>
            </Form>
        </Modal.Body>
    </Modal>;
    return loginModal;

}

export default LoginModal;