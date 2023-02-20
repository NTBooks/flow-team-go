import { createSlice } from '@reduxjs/toolkit';

const initialGameState = {
    userWallet: "",
    team_a: [],
    team_b: [],
    bgm_toggle: false,
    sfx_toggle: false,
    currentBG: '',

};

const gameSlice = createSlice({
    name: 'gamestate',
    initialState: initialGameState,
    reducers: {
        setUserWallet(state, action) {
            state.userWallet = action.payload.address;
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
        loadDBState() {
            // TODO: accept state config that might be requested from a website

        }


    },
});


export const gameActions = gameSlice.actions;

export default gameSlice.reducer;