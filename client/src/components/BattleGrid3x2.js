import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useStore } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Alert from 'react-bootstrap/Alert';
import { Spinner } from 'react-bootstrap';
import BattleGridPortrait from './BattleGridPortrait';

const ColStyle = { padding: '0' };

const BattleGrid3x2 = (props) => {
    //props.data contains the battle data
    const TeamData = props.data;


    return TeamData ?
        <Container style={{ width: '16rem', height: '16rem' }}>
            <Row>
                <Col style={ColStyle}>
                    <BattleGridPortrait nft_data={TeamData[0]} />

                </Col>
                <Col style={ColStyle}>

                    <BattleGridPortrait nft_data={TeamData[1]} />
                </Col>
                <Col style={ColStyle}>
                    <BattleGridPortrait nft_data={TeamData[2]} />

                </Col>
            </Row>
            <Row>
                <Col style={ColStyle}>
                    <BattleGridPortrait nft_data={TeamData[3]} />

                </Col>
                <Col style={ColStyle}>

                    <BattleGridPortrait nft_data={TeamData[4]} />
                </Col>
                <Col style={ColStyle}>
                    <BattleGridPortrait nft_data={TeamData[5]} />

                </Col>
            </Row>

        </Container >

        : <></>;


};

export default BattleGrid3x2;