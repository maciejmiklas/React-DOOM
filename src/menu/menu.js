import React, {Component} from "react";
import {Link} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {Nav} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';

const continuePlayingVisible = () => true
const continuePlayingAction = () => console.log("Continue Playing")

const manageWadsVisible = () => true
const manageWadsAction = () => console.log("Manage Wads")

const loadGameVisible = () => true
const loadGameAction = () => console.log("Load Game")

const saveGameVisible = () => true
const saveGameAction = () => console.log("Save Game")

const quickSaveVisible = () => true
const quickSaveAction = () => console.log("Quick Save")

const controlsVisible = () => true
const controlsAction = () => console.log("Controls")

const graphicsVisible = () => true
const graphicsAction = () => console.log("Graphics")

const soundVisible = () => true
const soundAction = () => console.log("Sound")

const loadFreeWadVisible = () => true
const loadFreeWadAction = () => console.log("Load Free Wad")

const menuElements = {
    continue_playing: {
        visible: continuePlayingVisible,
        action: continuePlayingAction,
        title: "CONTINUE PLAYING"
    },
    load_free_wad: {
        visible: loadFreeWadVisible,
        action: loadFreeWadAction,
        title: "LOAD FREE WAD"
    },
    load_game: {
        visible: loadGameVisible,
        action: loadGameAction,
        title: "LOAD GAME"
    },
    save_game: {
        visible: saveGameVisible,
        action: saveGameAction,
        title: "SAVE GAME"
    },
    quick_save: {
        visible: quickSaveVisible,
        action: quickSaveAction,
        title: "QUICK SAVE"
    },
    manage_wads: {
        visible: manageWadsVisible,
        action: manageWadsAction,
        title: "MANAGE WADS"
    },
    controls: {
        visible: controlsVisible,
        action: controlsAction,
        title: "CONTROLS SETUP"
    },
    graphics: {
        visible: graphicsVisible,
        action: graphicsAction,
        title: "GRAPHICS SETUP"
    },
    sound: {
        visible: soundVisible,
        action: soundAction,
        title: "SOUND SETUP"
    }
}

export default function Menu() {
    return (
        <Container>
            <div className="crt mainMenu">
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
                        <Button variant="outline-info">Search</Button>
                    </Form>
                </Navbar>

                <Row className="justify-content-md-center">
                    <div className="btn-group-vertical">
                        {Object.keys(menuElements).map((me, i) =>
                            <MenuButton action={menuElements[me].action} msg={menuElements[me].title} key={me}/>
                        )}
                    </div>
                </Row>

                <Navbar bg="dark" variant="dark" sticky="bottom">
                    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
                        <Button variant="outline-info">Search</Button>
                    </Form>
                </Navbar>
            </div>
        </Container>
    )
}


const MenuButton = ({action, msg}) =>
    <>
        <Button onClick={action} className="btn-nav-primary">{msg}</Button>
    </>

MenuButton.propTypes = {
    to: PropTypes.string,
    msg: PropTypes.string
}
