import React, {Component} from "react";
import {connect} from "react-redux";
import playPage from "./PlayPage";
import Menu from "./Menu";
import {ManageWads} from "./ManageWads";
import {EditWad} from "./EditWad";
import {UploadWads} from "./UploadWads";

import PropTypes from "prop-types";
import Actions from "../store/Actions";
import {MessageList} from "./Messages";
import {actionNavigationBack} from "./Navigation";
import {ManageStorage} from "./ManageStorage";

export const PAGES = {
    PLAY_PAGE: "PLAY_PAGE",
    WAD_MANAGE: "WAD_MANAGE",
    WAD_UPLOAD: "WAD_UPLOAD",
    STORAGE: "STORAGE",
    WAD_EDIT: "WAD_EDIT",
    MENU: "MENU",
    MESSAGES: "MESSAGES",
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
    MESSAGES: MessageList,
    STORAGE: ManageStorage
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
    type: Actions.ROUTER_GOTO_PREVIOUS
})

export const actionGotoPage = (page, props) => ({
    type: Actions.ROUTER_GOTO_PAGE,
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
        case Actions.ROUTER_GOTO_PAGE:
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
        case Actions.ROUTER_GOTO_PREVIOUS: {
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