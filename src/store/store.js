import {combineReducers, createStore} from "redux";
import {initial} from "./initial";
import {router} from "../router/reducer";

const reducer1 = (state = [], action) => {
    return state;
}

let reducers = combineReducers({reducer1, router});
const store = createStore(reducers, initial)
store.subscribe(() => console.log(">Store State> " + JSON.stringify(store.getState())))
export default store;