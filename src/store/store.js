import reducers from './reducers';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

const middleware = getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
    thunk: true,
});

export default configureStore({
    reducer: { ...reducers },
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
});
