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
    loadedGallery: null,
    nftStats: [],
    tempPin: false

};

const gameSlice = createSlice({
    name: 'gamestate',
    initialState: initialGameState,
    reducers: {
        setUserWallet(state, action) {
            state.userWallet = action.payload.address;
            state.gallery = action.payload.gallery;
            state.galleryName = action.payload.galleryName;

            if (action.payload.jwt && action.payload.jwt !== '')
                state.jwt = action.payload.jwt;
        },
        setGalleryData(state, action) {
            state.loadedGallery = action.payload.data;
            if (action.payload.data === null) {
                // handle reset
                state.gallery = '';
            }

            try {
                if (action.payload.data.teams) {
                    const teamArray = JSON.parse(action.payload.data.teams);

                    state.team_a = teamArray.slice(0, 3);
                    state.team_b = teamArray.slice(3);
                }
            } catch {

            }
        },
        disableKeylisteners(state, action) {
            state.disableKeylisteners = action.payload.set;
        },
        addNFTStats(state, action) {

            action.payload.nftdata.parsed = action.payload.nftdata.content ? JSON.parse(action.payload.nftdata.content) : null;

            const foundExisting = state.nftStats.findIndex(x => x.nftid == action.payload.nftdata.nftid && x.collection == action.payload.nftdata.collection);

            if (foundExisting > -1) {
                state.nftStats[foundExisting] = action.payload.nftdata;
            }
            else {
                state.nftStats = [...state.nftStats, action.payload.nftdata];
            }
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
        },
        setJwt(state, action) {
            if (action.payload.jwt) {
                state.jwt = action.payload.jwt;
            }

            if (action.payload.tempPin !== undefined) {
                state.tempPin = action.payload.tempPin;
            }
        }


    },
});


export const gameActions = gameSlice.actions;

export default gameSlice.reducer;