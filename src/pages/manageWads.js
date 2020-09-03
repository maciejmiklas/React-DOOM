import React, {Component} from "react";
import {actionSetTitle, Navigation} from "./navigation";
import {connect} from "react-redux";
import ListGroup from "react-bootstrap/ListGroup";
import {actionGotoPage, PAGES} from "./router";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class ManageWadsTag extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(actionSetTitle("Manage WADs"))
    }

    render() {
        const {wads, dispatch} = this.props;
        return (
            <Navigation>
                <Card bg="dark">
                    <Card.Body>
                        <ListGroup className="wads-list" as={Row}>
                            {wads.map(wad =>
                                <Col sm={4} key={wad.name}>
                                    <ListGroup.Item action variant="dark"
                                                    onClick={() => dispatch(actionGotoPage(PAGES.WAD_EDIT, {wadName: wad.name}))}>
                                        {wad.name}
                                    </ListGroup.Item>
                                </Col>
                            )}
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Navigation>)
    }
}

export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
    }
    return newState;
}

export const ManageWads = connect(state => ({wads: [...state.wads.files]}))(ManageWadsTag);