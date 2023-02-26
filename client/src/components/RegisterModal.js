import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useStore } from 'react-redux';
import { gameActions } from '../store/gamestate';

const RegisterModal = (props) => {
    const dispatch = useDispatch();

    const unboundGameState = useStore().getState().gamestate;
    const gallery = `${unboundGameState.gallery},${unboundGameState.galleryName}`;

    const [password, setPassword] = useState("");
    const [changePinError, setChangePinError] = useState();

    const handleClose = async () => {
        props.onClose();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setChangePinError();

        const fres = await fetch('/v1/changepin', { method: 'POST', headers: { 'authorization': unboundGameState.jwt, 'content-type': 'application/json' }, body: JSON.stringify({ pin: password }) });
        setPassword('');

        if (fres.status !== 200) {
            setChangePinError("Invalid pin. Must be 4 or more characters.");
            return;
        }

        const fresjson = await fres.json();
        console.log("Change Pin Result", fresjson);
        if (fresjson?.message === "SUCCESS") {
            localStorage.removeItem("temp_" + gallery);
            localStorage.setItem("token_" + gallery, fresjson?.token);
            dispatch(gameActions.setJwt({ tempPin: false }));
            setPassword('');
            handleClose();
        }
    };


    const registerModal = <Modal show={props.show} onHide={handleClose}>

        <Modal.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label style={{ fontSize: '1.5rem' }}>Set Pin for the {unboundGameState.galleryName}</Form.Label>

                    <InputGroup className="mb-3">
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            pattern='^.{4,}$'
                        />
                        <Button variant="primary" type="submit">
                            Claim!
                        </Button>
                        <p style={{ color: '#999', textAlign: 'center', paddingTop: '1rem' }}>
                            It should be 4 or more characters (more is better.)
                        </p>
                    </InputGroup>
                    {changePinError && <Alert variant='danger' style={{ marginTop: '2rem' }}>{changePinError}</Alert>}
                </Form.Group>

            </Form>
        </Modal.Body>
    </Modal>;

    return registerModal;

}

export default RegisterModal;