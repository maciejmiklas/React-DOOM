import {combineReducers, createStore} from "redux";
import {initial} from "./initial";
import {reducer as router} from "../pages/Router";
import {reducer as wads} from "../pages/ManageWads";

let reducers = combineReducers({router, wads});
const store = createStore(reducers, initial)
store.subscribe(() => console.log(">Store State> " + JSON.stringify(store.getState())))
export default store;