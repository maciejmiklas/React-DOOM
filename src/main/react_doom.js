import React from "react";
import './css/react_doom.scss'
import {render} from "react-dom";
import {Router} from "./cmp/Router";
import {Provider} from "react-redux";
import store from "./store/Store";

const main =
    <Provider store={store}>
        <Router/>
    </Provider>

render(main, document.getElementById("react-container"));