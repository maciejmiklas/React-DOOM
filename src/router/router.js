import React, {Component} from "react";
import {connect} from "react-redux";
import PlayPage from "../PlayPage";
import {pages as P} from "./constants";
import {gotoPage} from "./actions"
import PlayPage1 from "../PlayPage1";
import Menu from "../menu/menu";

const components = {
    PLAY_PAGE: connect(null, dispatch => ({
        onExit: () => dispatch(gotoPage(P.PLAY_PAGE1))
    }))(PlayPage),

    PLAY_PAGE1: connect(null, dispatch => ({
        onExit: () => dispatch(gotoPage(P.PLAY_PAGE))
    }))(PlayPage1),

    MENU: connect(null, dispatch => ({
        onExit: () => dispatch(gotoPage(P.MENU))
    }))(Menu),

}

class Router extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const TagName = components[this.props.router.active]
        return (<TagName/>)
    }
}

export default connect(state => ({router: {...state.router}}))(Router)