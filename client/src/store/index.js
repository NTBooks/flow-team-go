import gameSlice from './gamestate'

import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: { gamestate: gameSlice }
});

export default store;