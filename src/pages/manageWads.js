import React from "react";
import Navigation from "./navigation";
import Card from "react-bootstrap/Card";
import {connect} from "react-redux";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import ACTIONS from "../store/actions";

const WadItem = ({dispatch, wad}) =>
    <div className="wad-propsA">
        <Card bg="dark">
            <Card.Header as="h5">{wad.name}</Card.Header>
            <Card.Body>
                <ListGroup as="ul" variant="dark">
                    <ListGroup.Item as="li" variant="dark">
                        AAafdasd fasdf asdf:
                        <Badge variant="dark">Dark</Badge>
                    </ListGroup.Item>

                    <ListGroup.Item as="li" variant="dark">
                        AAafdasd:
                        <Badge variant="dark">Dark</Badge>
                    </ListGroup.Item>

                    <ListGroup.Item as="li" variant="dark">
                        AAafdasd fasdf asdf:
                        <Badge variant="dark">Dark dfg g </Badge>
                    </ListGroup.Item>

                    <ListGroup.Item as="li" variant="dark">
                        asdf:
                        <Badge variant="dark">Dark</Badge>
                    </ListGroup.Item>

                    <ListGroup.Item as="li" variant="dark">
                        AAafdasd fasdf asdf:
                        <Badge variant="dark">Dark</Badge>
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    </div>

const ListWads = ({dispatch, wads}) =>
    <ListGroup>
        {wads.map(wad =>
            <ListGroup.Item action key={wad.name} onClick={() => dispatch(actionWadEdit(wad))} variant="dark">
                {wad.name}
            </ListGroup.Item>
        )}
    </ListGroup>

const actionWadEdit = (wad) => ({
    type: ACTIONS.WADS_EDIT_START,
    wad
})

export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
        case ACTIONS.WADS_EDIT_START:
            newState = {
                ...state,
                edit: {
                    name: action.wad.name
                }
            }
            break;
        case ACTIONS.WADS_EDIT_END:
            newState = {
                ...state,
                edit: {
                    name: null
                }
            }
    }
    return newState;
}

const manageWadsTag = ({dispatch, wads}) =>
    (
        <Navigation title="Manage WADs">
            <br/>
            {wads.edit.name ?
                <WadItem dispatch={dispatch} wad={wads.edit.name}/> :
                <ListWads dispatch={dispatch} wads={wads.files}/>}
        </Navigation>
    )

export const manageWads = connect(state => ({wads: {...state.wads}}))(manageWadsTag);