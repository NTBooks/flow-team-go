import { createSlice } from '@reduxjs/toolkit';

const initialGameState = {
    userWallet: "",
    team_a: [null, null, null],
    team_b: [null, null, null],
    bgm_toggle: false,
    sfx_toggle: false,
    currentBG: '',
    network: 'demo',
    jwt: '',
    galleryName: '',
    gallery: '',
    disableKeylisteners: false,
    loadedGallery: null

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
        setGalleryData(state, action) {
            state.loadedGallery = action.payload.data;
            if (action.payload.data === null) {
                // handle reset
                state.gallery = '';
            }
        },
        disableKeylisteners(state, action) {
            state.disableKeylisteners = action.payload.set;
        },
        addToTeam(state, action) {
            // TODO: write add to team logic
            // Needs Team (A or B)
            // Needs slot (0-2)

            const arg = { collection: action.payload.collection, id: action.payload.nftid };

            if (action.payload.team === 'A') {
                state.team_a[+action.payload.position] = arg;
            }

            if (action.payload.team === 'B') {
                state.team_b[+action.payload.position] = arg;
            }
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