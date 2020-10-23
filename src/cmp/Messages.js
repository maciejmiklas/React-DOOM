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

const msg = (state, msg) => [
    ...state.slice(0, 500),
    {
        time: moment().format('YYYY-MM-DD h:mm:ss '),
        msg: msg
    }
]

export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
        case Actions.MESSAGES_SEND:
            newState = msg(state, action.msg)
            break;

        case Actions.WAD_RENAME:
            newState = msg(state, `Rename WAD from '${action.oldName}' to '${action.newName}'`)
            break;

        case Actions.WAD_OVERWRITE_CANCEL:
            newState = msg(state, `WAD '${action.fileName}' upload canceled`)
            break;

        case Actions.WAD_OVERWRITE:
            newState = msg(state, `WAD overwritten: ${action.fileName}`)
            break;

        case Actions.STORAGE_DOWNLOADED:
            newState = msg(state, "Storage downloaded")
            break;

        case Actions.WAD_UPLOAD:
            newState = msg(state, `WAD uploaded: ${action.fileName}, file size: ${action.content.length}`)
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