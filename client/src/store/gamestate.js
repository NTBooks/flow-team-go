import { createSlice } from '@reduxjs/toolkit';

const initialGameState = {
    userWallet: "",
    team_a: [],
    team_b: [],
    bgm_toggle: false,
    sfx_toggle: false,
    currentBG: '',
    network: 'demo',
    jwt: '',
    galleryName: '',
    gallery: '',
    disableKeylisteners: false

};

const gameSlice = createSlice({
    name: 'gamestate',
    initialState: initialGameState,
    reducers: {
        setUserWallet(state, action) {
            state.userWallet = action.payload.address;
            state.gallery = action.payload.gallery;
            state.galleryName = action.payload.galleryName;
            state.jwt = action.payload.jwt;
        },
        disableKeylisteners(state, action) {
            state.disableKeylisteners = action.payload.set;
        },
        addToTeam(state, action) {
            // TODO: write add to team logic
        },
        removeFromTeam(state, action) {
            // TODO: write remove from team logic
        },
        toggleBGM(state, action) {
            // TODO: write logic to turn BGM on or off

            state.bgm_toggle = action.payload.set;
        },
        toggleSFX(state, action) {
            // TODO: write logic to turn SFX on or off
            state.sfx_toggle = action.payload.set;
        },
        loadDBState(state, action) {
            // TODO: accept state config that might be requested from a website

        },
        setNetwork(state, action) {
            state.network = action.payload.network;
        }


    },
});


export const gameActions = gameSlice.actions;

export default gameSlice.reducer;