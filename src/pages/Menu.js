import React from "react";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';
import Navigation from "./Navigation";
import {connect} from "react-redux";
import {actionGotoPage, PAGES} from "./Router";

const continuePlayingVisible = () => true
const continuePlayingAction = (dispatch) => dispatch(actionGotoPage(PAGES.PLAY_PAGE))

const manageWadsVisible = () => true
const manageWadsAction = (dispatch) => dispatch(actionGotoPage(PAGES.MANAGE_WADS))

const loadGameVisible = () => true
const loadGameAction = (dispatch) => console.log("Load Game")

const saveGameVisible = () => true
const saveGameAction = (dispatch) => console.log("Save Game")

const quickSaveVisible = () => true
const quickSaveAction = (dispatch) => console.log("Quick Save")

const controlsVisible = () => true
const controlsAction = (dispatch) => console.log("Controls")

const graphicsVisible = () => true
const graphicsAction = (dispatch) => console.log("Graphics")

const soundVisible = () => true
const soundAction = (dispatch) => console.log("Sound")

const loadFreeWadVisible = () => true
const loadFreeWadAction = (dispatch) => console.log("Load Free Wad")

const menuElements = {
    continue_playing: {
        visible: continuePlayingVisible,
        action: continuePlayingAction,
        title: "CONTINUE PLAYING"
    },
    load_free_wad: {
        visible: loadFreeWadVisible,
        action: loadFreeWadAction,
        title: "LOAD FREE WAD"
    },
    load_game: {
        visible: loadGameVisible,
        action: loadGameAction,
        title: "LOAD GAME"
    },
    save_game: {
        visible: saveGameVisible,
        action: saveGameAction,
        title: "SAVE GAME"
    },
    quick_save: {
        visible: quickSaveVisible,
        action: quickSaveAction,
        title: "QUICK SAVE"
    },
    manage_wads: {
        visible: manageWadsVisible,
        action: manageWadsAction,
        title: "MANAGE WADS"
    },
    controls: {
        visible: controlsVisible,
        action: controlsAction,
        title: "CONTROLS SETUP"
    },
    graphics: {
        visible: graphicsVisible,
        action: graphicsAction,
        title: "GRAPHICS SETUP"
    },
    sound: {
        visible: soundVisible,
        action: soundAction,
        title: "SOUND SETUP"
    }
}

function Menu({dispatch}) {
    return (
        <Navigation>
            <Row className="justify-content-md-center">
                <div className="btn-group-vertical">
                    {Object.keys(menuElements).map((me, i) =>
                        <MenuButton action={() => menuElements[me].action(dispatch)}
                                    key={me}>{menuElements[me].title}</MenuButton>
                    )}
                </div>
            </Row>
        </Navigation>
    )
}


const MenuButton = (props) =>
    <>
        <Button onClick={props.action} className="btn-nav-primary">{props.children}</Button>
    </>

MenuButton.propTypes = {
    to: PropTypes.string,
    msg: PropTypes.string
}

export default connect()(Menu);
