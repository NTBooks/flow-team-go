import React from 'react';
import styled from 'styled-components';

const PlaceholderBezel = styled.div`
padding-top: 1rem;
`;

const NFTPlacholderCard = (props) => {
    return <PlaceholderBezel>
        <h2>Empty</h2>
    </PlaceholderBezel>
}

export default NFTPlacholderCard;