import storage from "redux-persist/lib/storage";
import {persistStore, persistReducer} from 'redux-persist'
import reducer from "./reducers";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";

const persistConfig = {
    key: 'root',
    storage
}

const persistedReducer = persistReducer(persistConfig, reducer)
export const store = createStore(persistedReducer, applyMiddleware(thunk))
export const persistor = persistStore(store)