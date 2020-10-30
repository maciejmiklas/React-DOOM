import React, {Component} from "react";
import {actionNavigationTitle, Navigation} from "./Navigation";
import {connect} from "react-redux";
import ListGroup from "react-bootstrap/ListGroup";
import {actionGotoPage, PAGES} from "./Router";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// ################### ACTIONS ###################

// ################### ACTIONS ###################

// ################### REDUCER ###################
export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
    }
    return newState;
}
// ################### REDUCER ###################

class ManageWadsTag extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.updateTitle();
    }

    render() {
        const {wads, editWad} = this.props;
        return (
            <Navigation>
                <Card bg="card-tr">
                    <Card.Body>
                        <ListGroup className="wads-list" as={Row}>
                            {wads.map(wad =>
                                <Col sm={4} key={wad.name}>
                                    <ListGroup.Item action variant="transparent" onClick={() => editWad(wad.name)}>
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

const stateToProps = state => ({wads: [...state.wads.files]});
const dispatchToProps = dispatch => ({
    editWad: wadName => {
        dispatch(actionGotoPage(PAGES.WAD_EDIT, {wadName}))
    },
    updateTitle: () => {
        dispatch(actionNavigationTitle("Manage WADs"))
    }
});
export const ManageWads = connect(stateToProps, dispatchToProps)(ManageWadsTag);