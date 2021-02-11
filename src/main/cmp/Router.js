import React, {Component} from "react";
import {connect} from "react-redux";
import PlayPage from "./PlayPage";
import Menu from "./Menu";
import {ManageWads} from "./ManageWads";
import {EditWad} from "./EditWad";
import {UploadWads} from "./UploadWads";
import PropTypes from "prop-types";
import Actions from "../store/Actions";
import {MessageList} from "./Messages";
import {actionNavigationBack} from "./Navigation";
import {ManageStorage} from "./ManageStorage";
import {WadViewer} from "./WadViewer";

// ################### ACTIONS ###################
export const actionGotoPrevious = () => ({
    type: Actions.ROUTER_GOTO_PREVIOUS
})

export const actionGotoPage = (pageName, pageProps) => ({
    type: Actions.ROUTER_GOTO_PAGE,
    pageName,
    pageProps
})
actionGotoPage.propTypes = {
    pageName: PropTypes.string,
    pageProps: PropTypes.object
}
// ################### ACTIONS ###################

// ################### REDUCER ###################
export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
        case Actions.ROUTER_GOTO_PAGE:
            let previous = state.active;
            newState = {
                ...state,
                previous,
                active: {
                    pageName: action.pageName,
                    pageProps: action.pageProps
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
            if (previousNotSupported.find(v => v === previous.pageName)) {
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
// ################### REDUCER ###################

class RouterComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {pageName, pageProps} = this.props;
        const TagName = components[pageName]
        return (<TagName {...pageProps}/>)
    }
}

export const PAGES = {
    PLAY_PAGE: "PLAY_PAGE",
    WAD_MANAGE: "WAD_MANAGE",
    WAD_UPLOAD: "WAD_UPLOAD",
    STORAGE: "STORAGE",
    WAD_EDIT: "WAD_EDIT",
    WAD_VIEW: "WAD_VIEW",
    MENU: "MENU",
    MESSAGES: "MESSAGES",
};

const previousNotSupported = [PAGES.WAD_EDIT]

const components = {
    PLAY_PAGE: connect(null, dispatch => ({
        onExit: () => dispatch(actionGotoPage(PAGES.PLAY_PAGE))
    }))(PlayPage),

    WAD_MANAGE: ManageWads,
    WAD_UPLOAD: UploadWads,
    WAD_EDIT: EditWad,
    MENU: Menu,
    MESSAGES: MessageList,
    STORAGE: ManageStorage,
    WAD_VIEW: WadViewer
}

const configureBack = (action, previous) => {
    action.asyncDispatch(actionNavigationBack(previousNotSupported.find(v => v === previous.pageName) === undefined));
}

export const Router = connect(state => ({...state.router.active}))(RouterComponent)