import Actions from "../store/Actions";
import moment from "moment/moment";
import React, {Component} from "react";
import {actionNavigationTitle, Navigation} from "./Navigation";
import Table from "react-bootstrap/Table";
import {connect} from "react-redux";

export const actionSendMsg = (msg) => ({
    type: Actions.MESSAGES_SEND,
    msg
})

export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
        case Actions.MESSAGES_SEND:
            newState = [
                ...state.slice(0, 500),
                {
                    time: moment().format('YYYY-MM-DD h:mm:ss '),
                    msg: action.msg
                }
            ]
            break;
    }
    return newState;
}

class MessagesListTag extends Component {
    constructor(pros) {
        super(pros);
    }

    componentDidMount() {
        this.props.dispatch(actionNavigationTitle("Messages"));
    }

    render() {
        const {messages} = this.props;
        return (<Navigation>
            <Table striped bordered hover variant="dark">
                <tbody>
                {messages.map((msg, idx) =>
                    <tr key={idx}>
                        <td>{msg.time}</td>
                        <td className="msg-text">{msg.msg}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Navigation>)
    }
}


export const MessageList = connect(state => ({messages: [...state.messages]}))(MessagesListTag)