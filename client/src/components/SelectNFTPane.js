import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import ResizedImage from './ResizedImage';
import SelectableWrapper from './SelectableWrapper';
import SFXMenu from './SFXMenu';

const ScrollContainer = styled.div`
overflow-y: scroll;
overflow-x: hidden;
width:100%;
height:31rem;
margin-top:-1rem;
margin-left:-1rem;
`;

const SelectNFTPane = (props) => {

    // Mode switches between selecting a collection then selecting an NFT
    // User needs to be able to go back from the NFT mode to select a different collection
    // First list is scrollable list of collections
    // Second list is scrollable list of NFTs in the collection

    const [selectedCollection, setSelectedCollection] = useState();
    const galleryData = useSelector(state => state.gamestate.loadedGallery);

    let selectableCategories = [];
    let selectableNFTs = [];

    if (galleryData && galleryData.nfts) {

        for (let [key, value] of Object.entries(galleryData.nfts)) {

            if (value.length > 0) {
                selectableCategories.push({
                    ctrl: <SelectableWrapper key={'wrapper' + key}>
                        <Container style={{ width: '30rem', textAlign: 'left', margin: '0.5rem 0 0 0', paddingBottom: '0.5rem', borderBottom: '0.2rem solid #cccccc', minHeight: '2rem' }}>
                            <Row>
                                <Col xs={1} style={{ minHeight: '2rem' }}><ResizedImage src={value[0].collectionSquareImage} style={{ width: '2rem', imageRendering: "pixelated" }} maxWidth={32} /></Col>
                                <Col xs={11}>{value[0].collectionName}</Col>
                            </Row>
                        </Container>
                    </SelectableWrapper>, val: key
                })
            }
        }

        selectableCategories = [{
            ctrl: <SelectableWrapper key={'backbutton0'}>
                <Container style={{ width: '30rem', textAlign: 'left', margin: '0.5rem 0 0 0', paddingBottom: '0.5rem', borderBottom: '0.2rem solid #cccccc', minHeight: '4rem' }}>
                    <Row>
                        <Col xs={1}>&lt;</Col>
                        <Col xs={11}>Return to Team</Col>
                    </Row>
                </Container>
            </SelectableWrapper>, val: 'BACK'
        }, ...selectableCategories];

    }

    if (selectedCollection) {
        selectableNFTs = galleryData.nfts[selectedCollection] ? galleryData.nfts[selectedCollection].map(x => {

            return {
                ctrl: <SelectableWrapper key={'wrapper' + x.id}>
                    <Container style={{ width: '30rem', textAlign: 'left', margin: '0.5rem 0 0 0', paddingBottom: '0.5rem', borderBottom: '0.2rem solid #cccccc' }}>
                        <Row>
                            <Col xs={2}><ResizedImage src={x.thumbnail} style={{ width: '4rem', imageRendering: "pixelated" }} maxWidth={32} /></Col>
                            <Col xs={10}>{x.name}</Col>
                        </Row>
                    </Container>
                </SelectableWrapper>, val: x.id
            }
        }) : [];

        selectableNFTs = [{
            ctrl: <SelectableWrapper key={'backbutton'}>
                <Container style={{ width: '30rem', textAlign: 'left', margin: '0.5rem 0 0 0', paddingBottom: '0.5rem', borderBottom: '0.2rem solid #cccccc' }}>
                    <Row>
                        <Col xs={1}>&lt;</Col>
                        <Col xs={11}>Return to Collections</Col>
                    </Row>
                </Container>
            </SelectableWrapper>, val: 'BACK'
        }, ...selectableNFTs];
    }

    const collectionMenuHandler = (cmd) => {
        if (cmd === "BACK") {
            props.pickNFTHandler(null);
        }
        setSelectedCollection(cmd);
    };

    const nftMenuHandler = (cmd) => {
        if (cmd === "BACK") {
            setSelectedCollection(null);
        }
        props.pickNFTHandler({ collection: selectedCollection, id: cmd })
    };

    return <div className={'nes-container with-title'} style={{ width: '38rem', margin: '3rem 1rem 1rem 1rem', height: '33rem', padding: '0 0 0 0' }}>
        <h3 className='title' style={{ fontSize: '2rem', marginTop: '-1.3rem', marginLeft: '1rem' }}>Select NFT</h3>
        <ScrollContainer>
            {selectedCollection ?
                <>
                    <p style={{ textAlign: 'center', fontSize: '1rem', color: '#cc0000' }}>{selectedCollection}</p>
                    <SFXMenu setkey="nftsfx" mainMenuHandler={nftMenuHandler} selectableObjects={selectableNFTs} onCancel={() => { setSelectedCollection(null) }} />
                </>
                : <SFXMenu setkey="colsfx" mainMenuHandler={collectionMenuHandler} selectableObjects={selectableCategories} onCancel={() => { props.pickNFTHandler(null) }} />
            }
        </ScrollContainer>
    </div >;
}

export default React.memo(SelectNFTPane);