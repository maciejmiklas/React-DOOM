import React from "react";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import PlayPage from "./PlayPage";

export default function Navigation() {
    return (
        <BrowserRouter>

            <Container>
                <Navbar bg="dark" variant="dark">
                    <Link to="/play" className="navbar-brand">Play</Link>
                    <Nav className="mr-auto">
                        <Link to="/wads" className="nav-link">Manage WADs</Link>
                        <Link to="/uwad" className="nav-link">Upload WAD</Link>
                    </Nav>

                    <Nav fill="true">
                        <Link to="/about" className="nav-link">About</Link>
                    </Nav>
                </Navbar>
            </Container>

            <Switch>
                <Route path="/play">
                    <PlayPage/>
                </Route>
                <Route path="/wads">
                    <ManageWads/>
                </Route>
                <Route path="/uwad">
                    <UploadWad/>
                </Route>
                <Route path="/about">
                    <About/>
                </Route>

            </Switch>
        </BrowserRouter>
    );
}

function ManageWads() {
    return (
        <div>
            <h2>wads</h2>
        </div>
    );
}

function UploadWad() {
    return (
        <div>
            <h2>uwad</h2>
        </div>
    );
}

function About() {
    return (
        <div>
            <h2>About</h2>
        </div>
    );
}
