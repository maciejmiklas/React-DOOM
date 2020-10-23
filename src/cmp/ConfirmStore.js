import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from 'prop-types';
import React, {Component} from "react";
import {connect} from "react-redux";
import Actions from "../store/Actions";

export const actionShowConfirm = (callbacksYes, callbacksNo = [], headerText, msgText) => ({
    type: Actions.CONFIRM_SHOW,
    callbacksYes, callbacksNo, headerText, msgText
})

actionShowConfirm.propTypes = {
    callbacks: PropTypes.object,
    headerText: PropTypes.string,
    msgText: PropTypes.string
};

export const actionHideConfirm = () => ({
    type: Actions.CONFIRM_HIDE
})

const actionCallback = (state) => ({
    type: state.action,
    ...state.props
})

export const reducer = (state = [], action) => {
    switch (action.type) {
        case Actions.CONFIRM_SHOW:
            return {
                visible: true,
                callbacksYes: action.callbacksYes,
                callbacksNo: action.callbacksNo,
                headerText: action.headerText,
                msgText: action.msgText
            }

        case Actions.CONFIRM_HIDE:
            return {
                visible: false,
                callbackAction: "-",
                callbacksYes: [],
                callbacksNo: [],
                headerText: "-",
                msgText: "-"
            }
    }
    return state;
}

class ConfirmCmp extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {visible, headerText, msgText, callbacksNo, callbacksYes, onYes, onNo} = this.props;
        if (!visible) {
            return null
        }
        return (
            <Modal show={visible} onHide={onNo}>
                <Modal.Header closeButton>
                    <Modal.Title>{headerText}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{msgText}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => onNo(callbacksNo)}>
                        No
                    </Button>
                    <Button variant="danger" onClick={() => onYes(callbacksYes)}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export const ConfirmStore = connect(
    state => ({...state.confirm}),
    dispatch => ({
            onYes(callbacksYes) {
                callbacksYes.forEach(c => dispatch(actionCallback(c)))
                dispatch(actionHideConfirm())
            },
            onNo(callbacksNo) {
                callbacksNo.forEach(c => dispatch(actionCallback(c)))
                dispatch(actionHideConfirm())
            }
        }
    )
)(ConfirmCmp)