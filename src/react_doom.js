import React from "react";
import './css/react_doom.scss'
import {render} from "react-dom";
import {Router} from "./pages/Router";
import {Provider} from "react-redux";
import store from "./store/store";

const main =
    <Provider store={store}>
        <Router/>
    </Provider>

render(main, document.getElementById("react-container"));