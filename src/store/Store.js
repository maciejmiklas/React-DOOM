import {applyMiddleware, combineReducers, createStore} from 'redux'
import {initial} from "./initial";
import {reducer as router} from "../pages/Router";
import {reducer as uploadWads} from "../pages/UploadWads";
import {reducer as manageWads} from "../pages/ManageWads";
import {reducer as editWad} from "../pages/EditWad";
import {reducer as messages} from "../pages/Messages";
import {reducer as confirm} from "../pages/Confirm"
import {reducer as navigation} from "../pages/Navigation"
import {reducer as menu} from "../pages/Menu"
import reduceReducers from "reduce-reducers";

const storeName = 'react-doom';

const asyncDispatchMiddleware = store => next => action => {
    let syncActivityFinished = false;
    let actionQueue = [];

    function flushQueue() {
        actionQueue.forEach(a => store.dispatch(a)); // flush queue
        actionQueue = [];
    }

    function asyncDispatch(asyncAction) {
        actionQueue = actionQueue.concat([asyncAction]);

        if (syncActivityFinished) {
            flushQueue();
        }
    }

    const actionWithAsyncDispatch =
        Object.assign({}, action, {asyncDispatch});

    next(actionWithAsyncDispatch);
    syncActivityFinished = true;
    flushQueue();
};

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

const wads = reduceReducers(initial, uploadWads, manageWads, editWad);
const reducers = combineReducers({router, wads, confirm, menu, navigation, messages});
const preloadedState = (localStorage[storeName]) ? JSON.parse(localStorage[storeName]) : initial;
const store = applyMiddleware(logger, saver, asyncDispatchMiddleware)(createStore)(reducers, preloadedState);

export default store;