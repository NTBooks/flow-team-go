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

    const hp_array = props.hp;

    // TODO: add a mode that shows only the active panel at a time
    const battlereply = props.battlereply;
    // Check for top row being all KO'd. Change opacity or background for active Row


    return TeamData ?
        <Container style={{ width: '16rem', height: '16rem' }}>
            <Row>
                <Col style={ColStyle}>
                    <BattleGridPortrait nft_data={TeamData[0]} hp={hp_array ? hp_array[0] : null} />

                </Col>
                <Col style={ColStyle}>

                    <BattleGridPortrait nft_data={TeamData[1]} hp={hp_array ? hp_array[1] : null} />
                </Col>
                <Col style={ColStyle}>
                    <BattleGridPortrait nft_data={TeamData[2]} hp={hp_array ? hp_array[2] : null} />

                </Col>
            </Row>
            <Row>
                <Col style={ColStyle}>
                    <BattleGridPortrait nft_data={TeamData[3]} hp={hp_array ? hp_array[3] : null} />

                </Col>
                <Col style={ColStyle}>

                    <BattleGridPortrait nft_data={TeamData[4]} hp={hp_array ? hp_array[4] : null} />
                </Col>
                <Col style={ColStyle}>
                    <BattleGridPortrait nft_data={TeamData[5]} hp={hp_array ? hp_array[5] : null} />

                </Col>
            </Row>

        </Container >

        : <></>;


};

export default BattleGrid3x2;