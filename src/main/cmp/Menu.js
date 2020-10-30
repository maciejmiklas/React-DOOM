import React from "react";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import {Navigation} from "./Navigation";
import {connect} from "react-redux";
import {actionGotoPage, PAGES} from "./Router";
import Actions from "../store/Actions";

const EL_CONTINUE_PLAYING = "CONTINUE_PLAYING";
const EL_LOAD_FREE_WAD = "LOAD_FREE_WAD";
const EL_LOAD_GAME = "LOAD_GAME";
const EL_SAVE_GAME = "SAVE_GAME";
const EL_QUICK_SAVE = "QUICK_SAVE";
const EL_MANAGE_WADS = "MANAGE_WADS";
const EL_UPLOAD_WADS = "UPLOAD_WADS";
const EL_CONTROLS = "CONTROLS";
const EL_GRAPHICS = "GRAPHICS";
const EL_SOUND = "SOUND";
const EL_STORAGE = "STORAGE";

// ################### ACTIONS ###################

// ################### ACTIONS ###################

// ################### REDUCER ###################
export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
        case Actions.WAD_UPLOAD:
            newState = addMenuElement(state, EL_MANAGE_WADS);
    }
    return newState;
}

const addMenuElement = (state, element) => {
    let newState = state;
    if (!state.visible.includes(element)) {
        newState = {
            ...state,
            visible: [...state.visible, element]
        }
    }
    return newState;
}
// ################### REDUCER ###################

const menuElements = new Map();

menuElements.set(EL_CONTINUE_PLAYING, {
    action: () => actionGotoPage(PAGES.PLAY_PAGE),
    title: "CONTINUE PLAYING"
});

menuElements.set(EL_LOAD_FREE_WAD, {
    action: () => ({}),
    title: "LOAD FREE WAD"
});

menuElements.set(EL_LOAD_GAME, {
    action: () => ({}),
    title: "LOAD GAME"
});

menuElements.set(EL_SAVE_GAME, {
    action: () => ({}),
    title: "SAVE GAME"
});

menuElements.set(EL_QUICK_SAVE, {
    action: () => ({}),
    title: "QUICK SAVE"
});

menuElements.set(EL_MANAGE_WADS, {
    action: () => actionGotoPage(PAGES.WAD_MANAGE),
    title: "MANAGE WADS"
});

menuElements.set(EL_UPLOAD_WADS, {
    action: () => actionGotoPage(PAGES.WAD_UPLOAD),
    title: "UPLOAD WADS"
});

menuElements.set(EL_CONTROLS, {
    action: () => ({}),
    title: "CONTROLS"
});

menuElements.set(EL_GRAPHICS, {
    action: () => ({}),
    title: "GRAPHICS"
});

menuElements.set(EL_SOUND, {
    action: () => ({}),
    title: "SOUND"
});

menuElements.set(EL_STORAGE, {
    action: () => actionGotoPage(PAGES.STORAGE),
    title: "STORAGE"
});

function visible(menu, name) {
    return menu.visible.includes(name);
}

function Menu({menu, goto}) {
    return (
        <Navigation>
            <Row className="menu">
                <div className="btn-group-vertical">
                    {[...menuElements.keys()].map(key =>
                        <MenuButton visible={visible(menu, key)} action={() => goto(key)}
                                    key={key}>{menuElements.get(key).title}</MenuButton>
                    )}
                </div>
            </Row>
        </Navigation>
    )
}

const MenuButton = (props) => props.visible ?
    <Button onClick={props.action} className="btn-nav-primary">{props.children}</Button> : null

const stateToProps = state => ({menu: {...state.menu}});
const dispatchToProps = dispatch => ({
    goto: key => dispatch(menuElements.get(key).action())
});
export default connect(stateToProps, dispatchToProps)(Menu);