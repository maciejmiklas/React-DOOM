import {applyMiddleware, combineReducers, createStore} from 'redux'
import {initial} from "./initial";
import {reducer as router} from "../pages/router";
import {reducer as uploadWads} from "../pages/uploadWads";
import {reducer as manageWads} from "../pages/manageWads";
import {reducer as confirm} from "../pages/confirm"
import {reducer as menu} from "../pages/menu"
import reduceReducers from "reduce-reducers";

const storeName = 'react-doom';

const saver = store => next => action => {
    let result = next(action);
    //localStorage[storeName] = JSON.stringify(store.getState());
    return result
};
let updateCount = 1
const logger = store => next => action => {
    let result;
    console.groupCollapsed("Store Update " + updateCount++, action.type);
    console.log('prev state', store.getState());
    console.log('action', action);
    result = next(action);
    console.log('next state', store.getState());
    console.groupEnd();
    return result
};

const wads = reduceReducers(initial, uploadWads, manageWads);
const reducers = combineReducers({router, wads, confirm, menu});
const preloadedState = (localStorage[storeName]) ? JSON.parse(localStorage[storeName]) : initial;
const store = applyMiddleware(logger, saver)(createStore)(reducers, preloadedState);

export default store;