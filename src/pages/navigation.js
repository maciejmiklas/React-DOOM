import React, {Component} from "react";
import Container from "react-bootstrap/Container";
import {Nav} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import {connect} from "react-redux";
import {actionGotoPage, PAGES} from "./router";
import PropTypes from 'prop-types';
import {Confirm} from "./confirm";

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
                    <Navbar bg="dark" variant="dark">
                        <NavButton dispatch={this.dispatch}
                                   action={(dispatch) => dispatch(actionGotoPage(PAGES.MENU))}>Menu</NavButton>
                        <Navbar.Brand className="mx-auto"> {this.title}</Navbar.Brand>
                    </Navbar>

                    <div className="navigationContent">
                        {this.props.children}
                    </div>

                    <Navbar bg="dark" variant="dark" sticky="bottom">
                        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                        <Nav className="navigationTitle">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#features">Features</Nav.Link>
                            <Nav.Link href="#pricing">Pricing</Nav.Link>
                        </Nav>
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

const NavButton = ({dispatch, children, action}) =>
    <>
        <Button onClick={() => action(dispatch)} variant="outline-info"
                className="navbarButton">{children}</Button>
    </>


export default connect(state => ({alertDialog: {...state.alertDialog}}))(Navigation)