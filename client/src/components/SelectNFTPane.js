import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SelectableWrapper from './SelectableWrapper';
import styled from 'styled-components';
import SFXMenu from './SFXMenu';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ScrollContainer = styled.div`
overflow-y: scroll;
overflow-x: hidden;
width:100%;
height:31rem;
margin-top:-1rem;
margin-left:-1rem;

`;

const SelectNFTPane = () => {

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
                        <Container style={{ width: '30rem', textAlign: 'left', marginTop: '1rem', borderBottom: '0.2rem solid #cccccc' }}>
                            <Row>
                                <Col xs={1}><img src={value[0].collectionSquareImage} style={{ width: '2rem' }} /></Col>
                                <Col xs={11}>{value[0].collectionName}</Col>
                            </Row>
                        </Container>


                    </SelectableWrapper>, val: key
                })
            }
        }

    }

    if (selectedCollection) {
        console.log(selectedCollection);
        selectableNFTs = galleryData.nfts[selectedCollection] ? galleryData.nfts[selectedCollection].map(x => {

            return {
                ctrl: <SelectableWrapper key={'wrapper' + x.id}>
                    <Container style={{ width: '30rem', textAlign: 'left', marginTop: '1rem', borderBottom: '0.2rem solid #cccccc' }}>
                        <Row>
                            <Col xs={1}><img src={x.thumbnail} style={{ width: '2rem' }} /></Col>
                            <Col xs={11}>{x.name}</Col>
                        </Row>
                    </Container>


                </SelectableWrapper>, val: x.id
            }

        }) : [];

        selectableNFTs = [{
            ctrl: <SelectableWrapper key={'backbutton'}>
                <Container style={{ width: '30rem', textAlign: 'left', marginTop: '1rem', borderBottom: '0.2rem solid #cccccc' }}>
                    <Row>
                        <Col xs={1}>&lt;</Col>
                        <Col xs={11}>Return to Collections</Col>
                    </Row>
                </Container>


            </SelectableWrapper>, val: 'BACK'
        }, ...selectableNFTs];

        console.log(selectableNFTs);
    }

    const collectionMenuHandler = (cmd) => {

        setSelectedCollection(cmd);

    };

    const nftMenuHandler = (cmd) => {

        if (cmd === "BACK") setSelectedCollection(null);

    };



    return <div className={'nes-container with-title'} style={{ width: '38rem', margin: '3rem 1rem 1rem 1rem', height: '33rem', padding: '0 0 0 0' }}>
        <h3 className='title' style={{ fontSize: '2rem', marginTop: '-1.3rem', marginLeft: '1rem' }}>Select NFT</h3>
        <ScrollContainer>
            {selectedCollection ?

                <SFXMenu setkey="nftsfx" mainMenuHandler={nftMenuHandler} selectableObjects={selectableNFTs} onCancel={() => { setSelectedCollection(null) }} />


                :



                <SFXMenu setkey="colsfx" mainMenuHandler={collectionMenuHandler} selectableObjects={selectableCategories} />


            }

        </ScrollContainer>
    </div >;

}

export default SelectNFTPane;