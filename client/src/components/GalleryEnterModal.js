import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';

const GalleryEnterModal = (props) => {

    const [galleryName, setGalleryName] = useState("");
    const [galleryError, setGalleryError] = useState();

    const handleClose = async () => {
        props.onClose(null);
    }

    const handleGallerySubmit = async (e) => {
        e.preventDefault();

        setGalleryError();

        props.onClose(galleryName);
    };


    const galleryEnterModal = <Modal show={props.show} onHide={handleClose}>
        <Modal.Body>
            <Form onSubmit={handleGallerySubmit}>
                <Form.Group>
                    <Form.Label>Enter Team Name<br />([YY][City][Animal])</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="text"
                            value={galleryName}
                            onChange={(e) => setGalleryName(e.target.value)}
                            pattern='^\d\d[A-Za-z]{8,}$'
                            required
                        />
                        <Button variant="primary" type="submit">
                            Go!
                        </Button>
                    </InputGroup>
                    {galleryError && <Alert variant='danger' style={{ marginTop: '2rem' }}>{galleryError}</Alert>}
                    <p>ex. 84TampaLions</p>
                </Form.Group>
            </Form>
        </Modal.Body>
    </Modal>;
    return galleryEnterModal;

}

export default GalleryEnterModal;