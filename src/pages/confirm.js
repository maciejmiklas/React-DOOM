import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from 'prop-types';
import React from "react";
import {connect} from "react-redux";
import ACTIONS from "../store/actions";

export const actionShowConfirm = (callbacks, headerText, msgText) => ({
    type: ACTIONS.CONFIRM_SHOW,
    callbacks, headerText, msgText
})

actionShowConfirm.propTypes = {
    callbacks: PropTypes.object,
    headerText: PropTypes.string,
    msgText: PropTypes.string
};

export const actionHideConfirm = () => ({
    type: ACTIONS.CONFIRM_HIDE
})

const actionYes = (state) => ({
    type: state.action,
    ...state.props
})

export const reducer = (state = [], action) => {
    switch (action.type) {
        case ACTIONS.CONFIRM_SHOW:
            return {
                visible: true,
                callbacks: action.callbacks,
                headerText: action.headerText,
                msgText: action.msgText
            }

        case ACTIONS.CONFIRM_HIDE:
            return {
                visible: false,
                callbackAction: "-",
                callbacks: [],
                headerText: "-",
                msgText: "-"
            }
    }
    return state;
}

const dialog = ({state, onYes, onNo}) =>
    <Modal show={state.visible} onHide={onNo}>
        <Modal.Header closeButton>
            <Modal.Title>{state.headerText}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{state.msgText}</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onNo}>
                No
            </Button>
            <Button variant="danger" onClick={() => onYes(state)}>
                Yes
            </Button>
        </Modal.Footer>
    </Modal>

export const Confirm = connect(
    state => ({state: {...state.confirm}}),
    dispatch => ({
            onYes(state) {
                state.callbacks.forEach(c => dispatch(actionYes(c)))
                dispatch(actionHideConfirm())
            },
            onNo() {
                dispatch(actionHideConfirm())
            }
        }
    )
)(dialog)