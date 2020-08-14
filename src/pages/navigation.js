import React, {Component} from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import {connect} from "react-redux";
import {actionGotoPage, PAGES} from "./router";
import PropTypes from 'prop-types';
import {Confirm} from "./confirm";
import {ArrowReturnLeft, JustifyLeft, Info} from 'react-bootstrap-icons';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.dispatch = props.dispatch
        this.title = props.title
    }

    render() {
        return (
            <Container>
                <div className="navigation">
                    <Navbar bg="dark">
                        <NavButton dispatch={this.dispatch}
                                   action={(dispatch) => dispatch(actionGotoPage(PAGES.MENU))} tooltipOn="bottom"
                                   tooltipText="Go to main menu">Menu</NavButton>
                        <Container>
                            <div className="navbarTitle"> {this.title}</div>
                        </Container>

                        <NavButton dispatch={this.dispatch}
                                   action={(dispatch) => dispatch(actionGotoPage(PAGES.MENU))} tooltipOn="bottom"
                                   tooltipText="Go back"><ArrowReturnLeft/></NavButton>
                    </Navbar>

                    <div className="navigationContent">
                        {this.props.children}
                    </div>

                    <Navbar bg="dark" variant="dark" sticky="bottom">
                        <NavButton dispatch={this.dispatch} action={() => console.log("about")} tooltipOn="top"
                                   tooltipText="About"><Info/></NavButton>
                        <Container/>
                        <NavButton dispatch={this.dispatch}
                                   action={(dispatch) => dispatch(actionGotoPage(PAGES.MENU))} tooltipOn="top"
                                   tooltipText="Messages"><JustifyLeft/></NavButton>
                    </Navbar>
                </div>
                <Confirm/>
            </Container>
        )
    }
}

Navigation.propTypes = {
    dispatch: PropTypes.func,
    title: PropTypes.string
};

Navigation.defaultProps = {
    dispatch: f => f,
    title: ""
};

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


export default connect(state => ({alertDialog: {...state.alertDialog}}))(Navigation)