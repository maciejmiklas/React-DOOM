import React, {Component} from "react";
import {connect} from "react-redux";
import playPage from "./playPage";
import menu from "./menu";
import {manageWads} from "./manageWads";
import PropTypes from "prop-types";
import {uploadWads} from "./uploadWads";
import ACTIONS from "../store/actions";

const components = {
    PLAY_PAGE: connect(null, dispatch => ({
        onExit: () => dispatch(actionGotoPage(PAGES.PLAY_PAGE))
    }))(playPage),

    MANAGE_WADS: manageWads,
    UPLOAD_WADS: uploadWads,
    MENU: menu,
}

class RouterComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const TagName = components[this.props.router.active]
        return (<TagName/>)
    }
}

export const actionGotoPage = (page) => ({
    type: ACTIONS.ROUTER_GOTO_PAGE,
    page
})

actionGotoPage.propTypes = {
    page: PropTypes.string,
}

export const reducer = (state = [], action) => {
    switch (action.type) {
        case ACTIONS.ROUTER_GOTO_PAGE:
            return {
                ...state,
                active: action.page
            }
    }
    return state;
}

export const PAGES = {
    PLAY_PAGE: "PLAY_PAGE",
    MANAGE_WADS: "MANAGE_WADS",
    UPLOAD_WADS: "UPLOAD_WADS",
    MENU: "MENU"
};

export const Router = connect(state => ({router: {...state.router}}))(RouterComponent)