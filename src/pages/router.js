import React, {Component} from "react";
import {connect} from "react-redux";
import playPage from "./playPage";
import Menu from "./menu";
import {ManageWads} from "./manageWads";
import {EditWad} from "./editWad";
import {UploadWads} from "./uploadWads";

import PropTypes from "prop-types";
import ACTIONS from "../store/actions";
import {MessageList} from "./messages";

const components = {
    PLAY_PAGE: connect(null, dispatch => ({
        onExit: () => dispatch(actionGotoPage(PAGES.PLAY_PAGE))
    }))(playPage),

    WAD_MANAGE: ManageWads,
    WAD_UPLOAD: UploadWads,
    WAD_EDIT: EditWad,
    MENU: Menu,
    MESSAGES: MessageList
}

class RouterComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {router} = this.props;
        const TagName = components[router.active.name]
        return (<TagName {...router.active.props}/>)
    }
}

export const actionGotoPrevious = () => ({
    type: ACTIONS.ROUTER_GOTO_PREVIOUS
})

export const actionGotoPage = (page, props) => ({
    type: ACTIONS.ROUTER_GOTO_PAGE,
    page,
    props
})

actionGotoPage.propTypes = {
    page: PropTypes.string,
    props: PropTypes.object
}

export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
        case ACTIONS.ROUTER_GOTO_PAGE:
            newState = {
                ...state,
                previous: state.active,
                active: {
                    name: action.page,
                    props: action.props
                }
            }
            break;
        case ACTIONS.ROUTER_GOTO_PREVIOUS: {
            const active = state.active;
            const previous = state.previous;
            newState = {
                ...state,
                previous: active,
                active: previous
            }
            break;
        }
    }
    return newState;
}

export const PAGES = {
    PLAY_PAGE: "PLAY_PAGE",
    WAD_MANAGE: "WAD_MANAGE",
    WAD_UPLOAD: "WAD_UPLOAD",
    WAD_EDIT: "WAD_EDIT",
    MENU: "MENU",
    "MESSAGES": "MESSAGES"
};

export const Router = connect(state => ({router: {...state.router}}))(RouterComponent)