import React, {Component} from "react";
import {connect} from "react-redux";
import playPage from "./playPage";
import menu from "./menu";
import {manageWads} from "./manageWads";
import PropTypes from "prop-types";

const components = {
    PLAY_PAGE: connect(null, dispatch => ({
        onExit: () => dispatch(actionGotoPage(PAGES.PLAY_PAGE))
    }))(playPage),

    MANAGE_WADS: manageWads,
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
    type: ACTIONS.GOTO_PAGE,
    page
})

actionGotoPage.propTypes = {
    page: PropTypes.string,
}

export const ACTIONS = {
    GOTO_PAGE: "GOTO_PAGE",
}

export const reducer = (state = [], action) => {
    switch (action.type) {
        case ACTIONS.GOTO_PAGE:
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
    MENU: "MENU"
};

export const Router = connect(state => ({router: {...state.router}}))(RouterComponent)