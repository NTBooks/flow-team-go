import React, { useState, useRef, useEffect } from 'react';
import { Form, FormControl, Button, InputGroup } from 'react-bootstrap';

const LoadWallet = (props) => {

    const [walletAddress, setWalletAddress] = useState();
    const walletTextBox = useRef(null);

    useEffect(() => {
        if (props.focus === true) {
            walletTextBox.current.focus();
        }
    }, [props.focus]);

    return <>
        <Form onSubmit={props.onSubmit}>
            <InputGroup className="mb-3">
                <FormControl
                    style={{ fontSize: '1.4rem', border: '0.2rem solid black' }}
                    type="text"
                    placeholder={props.label}
                    value={walletAddress ? walletAddress : props.default}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    pattern={props.pattern}
                    ref={walletTextBox}
                />
                <Button type="submit"><img src={require('../../public/GoLogoPNG.png')} style={{ imageRendering: 'pixelated', height: '4rem' }} /></Button>
            </InputGroup>
        </Form>
    </>;

};

export default LoadWallet;