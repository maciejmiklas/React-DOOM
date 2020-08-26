import React, {Component} from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import {connect} from "react-redux";
import {actionGotoPage, actionGotoPrevious, PAGES} from "./router";
import {Confirm} from "./confirm";
import {ArrowReturnLeft, Info, JustifyLeft} from 'react-bootstrap-icons';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ACTIONS from "../store/actions";
import Popover from "react-bootstrap/Popover";

const aboutPopover = (
    <Popover>
        <Popover.Title as="h3">DOOM by Maciej Miklas </Popover.Title>
        <Popover.Content>
            Implemented in React/Redux on Apache 2.0 Open Source License
        </Popover.Content>
    </Popover>
);

class NavigationTag extends Component {

    constructor(props) {
        super(props);
        this.props.dispatch(actionSetTitle(""))
    }

    render() {
        const {dispatch, nav, children} = this.props;
        return (
            <Container>
                <div className="navigation">
                    <Navbar bg="dark">
                        <NavButton dispatch={dispatch}
                                   action={(dispatch) => dispatch(actionGotoPage(PAGES.MENU))} tooltipOn="bottom"
                                   tooltipText="Go to main Menu">Menu</NavButton>
                        <Container>
                            <div className="navbar-title"> {nav.title}</div>
                        </Container>

                        <NavIcon dispatch={dispatch}
                                 action={(dispatch) => dispatch(actionGotoPrevious())} tooltipOn="bottom"
                                 tooltipText="Go back"><ArrowReturnLeft/></NavIcon>
                    </Navbar>

                    <div className="navigation-content">
                        {children}
                    </div>

                    <Navbar bg="dark" variant="dark" sticky="bottom">

                        <NavIcon dispatch={dispatch} tooltipOn="right" tooltipText="About">
                            <OverlayTrigger trigger="click" placement="top" overlay={aboutPopover}>
                                <Info/>
                            </OverlayTrigger>
                        </NavIcon>
                        <Container/>

                        <NavIcon dispatch={dispatch}
                                 action={(dispatch) => dispatch(actionGotoPage(PAGES.MESSAGES))} tooltipOn="top"
                                 tooltipText="Messages"><JustifyLeft/></NavIcon>
                    </Navbar>
                </div>
                <Confirm/>
            </Container>
        )
    }
}

export const actionSetTitle = (title) => ({
    type: ACTIONS.NAVIGATION_SET_TITLE,
    title
})

export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
        case ACTIONS.NAVIGATION_SET_TITLE:
            newState = {
                ...state,
                title: action.title
            }
    }
    return newState;
}

const NavIcon = ({dispatch, children, action, tooltipOn = "top", tooltipText = ""}) =>
    <NavButton dispatch={dispatch} children={children} action={action}
               tooltipOn={tooltipOn} tooltipText={tooltipText}/>

const NavButton = ({dispatch, children, action, className = "", tooltipOn = "top", tooltipText = ""}) =>
    <OverlayTrigger
        placement={tooltipOn}
        overlay={
            <Tooltip id={`tooltip-${tooltipOn}`}>
                {tooltipText}
            </Tooltip>
        }
    >
        <Button onClick={() => action(dispatch)} variant="outline-secondary"
                className={`${className} navbarButton`}>{children}
        </Button>
    </OverlayTrigger>


export const Navigation = connect(state => ({nav: {...state.navigation}}))(NavigationTag)
