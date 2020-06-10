import React from "react";
import './css/react_doom.scss'
import {render} from "react-dom";
import {MainMenu} from "./menu/menu";
import {createStore} from "redux";
import {Provider} from "react-redux";

function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1
        case 'DECREMENT':
            return state - 1
        default:
            return state
    }
}

const store = createStore(state => counter)
store.subscribe(() => console.log(store.getState()))

const main =
    <Provider store={store}>
        <MainMenu/>
    </Provider>
render(main, document.getElementById("react-container"));