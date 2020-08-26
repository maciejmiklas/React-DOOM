import React, {Component} from "react";
import {actionSetTitle, Navigation} from "./navigation";
import Dropzone from "react-dropzone";
import Card from "react-bootstrap/Card";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {arrayBufferToBase64} from "../util";
import {actionShowConfirm} from "./confirm";
import ACTIONS from "../store/actions";
import {actionSendMsg} from "./messages";

const FileUploader = ({dispatch, wads}) =>
    <Dropzone onDrop={files => uploadFiles(files, wads, dispatch)}>
        {({getRootProps, getInputProps}) => (
            <section>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <br/>
                    Drag 'n' drop some files here, or click to select files
                    <br/><br/>
                </div>
            </section>
        )}
    </Dropzone>

class UploadWadsTag extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(actionSetTitle("Upload WADs"))
    }

    render() {
        const {wads, dispatch} = this.props
        return (
            <Navigation>
                <Card bg="dark">
                    <Card.Body>
                        <FileUploader dispatch={dispatch} wads={wads}/>
                    </Card.Body>
                </Card>
            </Navigation>
        )
    }
}

const uploadFiles = (files, wads, dispatch) => (
    files.forEach(file => uploadFile(file, wads, dispatch))
)

function uploadFile(file, wads, dispatch) {
    const reader = new FileReader();
    reader.onload = function () {
        let base64 = arrayBufferToBase64(reader.result);

        if (wads.some(w => w.name === file.name)) {
            const callbacks = [{
                action: ACTIONS.WAD_UPLOADED,
                props: {
                    fileName: file.name,
                    content: base64
                }
            },
                {
                    action: ACTIONS.MESSAGES_SEND,
                    props: {
                        msg: `WAD overwritten: ${file.name}`
                    }
                }
            ];
            dispatch(actionShowConfirm(callbacks, "Overwrite?", "File '" + file.name + "' already exists, overwrite it?"));
        } else {
            dispatch(actionSendMsg(`WAD uploaded: ${file.name}`));
            dispatch(actionFileUploaded(file.name, base64));
        }

    }
    reader.readAsArrayBuffer(file);
}

export const actionFileUploaded = (fileName, content) => ({
    type: ACTIONS.WAD_UPLOADED,
    fileName,
    content
})

actionFileUploaded.propTypes = {
    file: PropTypes.object
}

const getWadName = (fileName) => {
    let newName = fileName;
    const dotIdx = fileName.lastIndexOf('.');
    if (dotIdx) {
        newName = fileName.substring(0, dotIdx);
    }

    return newName;
}

// TODO create function that will return initial data for new was instead hardcoding it here
export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
        case ACTIONS.WAD_UPLOADED:
            newState = {
                ...state,
                files: [
                    ...state.files,
                    {
                        name: getWadName(action.fileName),
                        content: action.content,
                        uploadTime: new Date(),
                        lastPlayed: 0,
                        saves: [],
                        stats: {
                            totalPlayTimeMs: 0,
                            longestSessionMs: 0,
                            lastSessionMs:0
                        }
                    }]
            }
    }
    return newState;
}

export const UploadWads = connect(state => ({wads: [...state.wads.files]}))(UploadWadsTag);