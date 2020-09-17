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
import {actionNavigationBack} from "./navigation";

export const PAGES = {
    PLAY_PAGE: "PLAY_PAGE",
    WAD_MANAGE: "WAD_MANAGE",
    WAD_UPLOAD: "WAD_UPLOAD",
    STORAGE: "STORAGE",
    WAD_EDIT: "WAD_EDIT",
    MENU: "MENU",
    MESSAGES: "MESSAGES"
};

const previousNotSupported = [PAGES.WAD_EDIT]

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
    dispatch: PropTypes.object,
    page: PropTypes.string,
    props: PropTypes.object
}

const configureBack = (action, previous) => {
    action.asyncDispatch(actionNavigationBack(previousNotSupported.find(v => v === previous.name) === undefined));
}

export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
        case ACTIONS.ROUTER_GOTO_PAGE:
            let previous = state.active;
            newState = {
                ...state,
                previous,
                active: {
                    name: action.page,
                    props: action.props
                },
                previousEnabled: true
            }
            configureBack(action, previous);
            break;
        case ACTIONS.ROUTER_GOTO_PREVIOUS: {
            const previous = state.previous;
            const active = state.active;
            if (!previous || !active) {
                break;
            }
            if (previousNotSupported.find(v => v === previous.name)) {
                break;
            }
            newState = {
                ...state,
                previous: active,
                active: previous
            }
            configureBack(action, active);
            break;
        }
    }
    return newState;
}

export const Router = connect(state => ({router: {...state.router}}))(RouterComponent)