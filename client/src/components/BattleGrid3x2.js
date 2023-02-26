import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import BattleGridPortrait from './BattleGridPortrait';

const ColStyle = { padding: '0' };

const BattleGrid3x2 = (props) => {

    const TeamData = props.data;

    const hp_array = props.hp;

    const BSquad = hp_array ? hp_array.slice(0, 3).reduce((curr, acc) => { return curr + acc.hp }, 0) == 0 : false;
    const AllKO = hp_array ? hp_array.reduce((curr, acc) => { return curr + acc.hp }, 0) == 0 : false;

    return TeamData ?
        <Container style={{ width: '16rem', height: '14.5rem' }}>
            <Row style={BSquad || AllKO ? { filter: 'grayscale(1)' } : { animation: `hueshiftcss 3s linear infinite` }}>
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
            <Row style={!BSquad || AllKO ? { filter: 'grayscale(1)' } : { animation: `hueshiftcss 3s linear infinite` }}>
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