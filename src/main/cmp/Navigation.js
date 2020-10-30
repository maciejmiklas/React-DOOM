import React, {Component} from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import {connect} from "react-redux";
import {actionGotoPage, actionGotoPrevious, PAGES} from "./Router";
import {ArrowReturnLeft, Info, JustifyLeft} from 'react-bootstrap-icons';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Actions from "../store/Actions";
import Popover from "react-bootstrap/Popover";

// ################### ACTIONS ###################
export const actionNavigationBack = (backEnabled) => ({
    type: Actions.NAVIGATION_ENABLE_BACK,
    backEnabled
})

export const actionNavigationTitle = (title, backEnabled = true) => ({
    type: Actions.NAVIGATION_SET_TITLE,
    title
})
// ################### ACTIONS ###################

// ################### REDUCER ###################
export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
        case Actions.NAVIGATION_ENABLE_BACK:
            newState = {
                ...state,
                backEnabled: action.backEnabled
            }
            break;
        case Actions.NAVIGATION_SET_TITLE:
            newState = {
                ...state,
                title: action.title
            }
            break;
    }
    return newState;
}
// ################### REDUCER ###################

const aboutPopover = (
    <Popover>
        <Popover.Title as="h3">DOOM by Maciej Miklas</Popover.Title>
        <Popover.Content>
            Implemented in React/Redux on Apache 2.0 Open Source License
        </Popover.Content>
    </Popover>
);

class NavigationTag extends Component {

    constructor(props) {
        super(props);
        this.props.clearTitle()
    }

    render() {
        const {nav, children, goToMenu, goToPrevious, goToMessages} = this.props;
        return (
            <Container>
                <Navbar bg="nav">
                    <NavButton onClick={goToMenu} tooltipOn="bottom"
                               tooltipText="Go to main Menu">Menu</NavButton>
                    <Container>
                        <div className="navbar-title"> {nav.title}</div>
                    </Container>

                    <NavIcon onClick={goToPrevious} tooltipOn="bottom"
                             tooltipText="Go back" enabled={nav.backEnabled}><ArrowReturnLeft/></NavIcon>
                </Navbar>

                <div className="navigation-content">
                    {children}
                </div>

                <Navbar bg="nav" variant="dark" sticky="bottom">
                    <NavIcon tooltipOn="right" tooltipText="About">
                        <OverlayTrigger trigger="click" placement="top" overlay={aboutPopover}>
                            <Info/>
                        </OverlayTrigger>
                    </NavIcon>
                    <Container/>
                    <NavIcon onClick={goToMessages} tooltipOn="top" tooltipText="Messages"><JustifyLeft/></NavIcon>
                </Navbar>
            </Container>
        )
    }
}

const NavIcon = ({children, onClick, tooltipOn = "top", tooltipText = "", enabled = true}) =>
    <NavButton children={children} onClick={onClick} tooltipOn={tooltipOn} tooltipText={tooltipText} enabled={enabled}/>

const NavButton = ({children, onClick, className = "", tooltipOn = "top", tooltipText = "", enabled = true}) =>
    <OverlayTrigger
        placement={tooltipOn}
        overlay={
            <Tooltip id={`tooltip-${tooltipOn}`}>
                {tooltipText}
            </Tooltip>
        }
    >
        <Button onClick={onClick} variant="outline-secondary"
                className={`${className} navbarButton`} hidden={!enabled}>{children}
        </Button>
    </OverlayTrigger>

const stateToProps = state => ({nav: {...state.navigation}});
const dispatchToProps = dispatch => ({
    goToMenu: () => dispatch(actionGotoPage(PAGES.MENU)),
    goToPrevious: () => dispatch(actionGotoPrevious()),
    goToMessages: () => dispatch(actionGotoPage(PAGES.MESSAGES)),
    clearTitle: () => dispatch(actionNavigationTitle(""))
})
export const Navigation = connect(stateToProps, dispatchToProps)(NavigationTag)
