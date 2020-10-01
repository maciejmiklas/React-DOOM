import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from 'prop-types';
import React from "react";
import {connect} from "react-redux";
import Actions from "../store/Actions";

export const actionShowConfirm = (callbacks, headerText, msgText) => ({
    type: Actions.CONFIRM_SHOW,
    callbacks, headerText, msgText
})

actionShowConfirm.propTypes = {
    callbacks: PropTypes.object,
    headerText: PropTypes.string,
    msgText: PropTypes.string
};

export const actionHideConfirm = () => ({
    type: Actions.CONFIRM_HIDE
})

const actionYes = (state) => ({
    type: state.action,
    ...state.props
})

export const reducer = (state = [], action) => {
    switch (action.type) {
        case Actions.CONFIRM_SHOW:
            return {
                visible: true,
                callbacks: action.callbacks,
                headerText: action.headerText,
                msgText: action.msgText
            }

        case Actions.CONFIRM_HIDE:
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

const ConfirmComp = ({state, onYes, onNo}) =>
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
)(ConfirmComp)