import React, {Component} from "react";
import {actionNavigationTitle, Navigation} from "./Navigation";
import Dropzone from "react-dropzone";
import Card from "react-bootstrap/Card";
import {connect} from "react-redux";
import {arrayBufferToBase64} from "../util";
import {actionShowConfirm} from "./Confirm";
import Actions from "../store/Actions";
import {actionSendMsg} from "./Messages";

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
        this.props.dispatch(actionNavigationTitle("Upload WADs"))
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
                action: Actions.WAD_UPLOAD,
                props: {
                    fileName: file.name,
                    content: base64
                }
            },
                {
                    action: Actions.MESSAGES_SEND,
                    props: {
                        msg: `WAD overwritten: ${file.name}`
                    }
                }
            ];
            dispatch(actionShowConfirm(callbacks, "Overwrite?", "File '" + file.name +
                "' already exists, overwrite it?"));
        } else {
            dispatch(actionSendMsg(`WAD uploaded: ${file.name}`));
            dispatch(actionWadUpload(file.name, base64));
        }

    }
    reader.readAsArrayBuffer(file);
}

export const actionWadUpload = (fileName, content) => ({
    type: Actions.WAD_UPLOAD,
    fileName,
    content
})

export const actionWadRename = (oldName, newName) => ({
    type: Actions.WAD_RENAME,
    oldName,
    newName
})

const getWadName = (fileName) => {
    let newName = fileName;
    const dotIdx = fileName.lastIndexOf('.');
    if (dotIdx) {
        newName = fileName.substring(0, dotIdx);
    }
    return newName;
}

export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
        case Actions.WAD_RENAME:
            const {oldName, newName} = action;
            newState = {
                ...state,
                files: [
                    {...state.files.find(wad => wad.name === oldName), name: newName},
                    ...state.files.filter(wad => wad.name !== oldName)
                ]
            }
            break;
        case Actions.WAD_UPLOAD:
            newState = {
                ...state,
                files: [
                    ...state.files,
                    {
                        // TODO create function that will return initial data for new was instead hardcoding it here
                        name: getWadName(action.fileName),
                        content: action.content,
                        uploadTime: new Date(),
                        lastPlayed: 0,
                        saves: [],
                        stats: {
                            totalPlayTimeMs: 0,
                            longestSessionMs: 0,
                            lastSessionMs: 0
                        }
                    }]
            }
            break;
    }
    return newState;
}

export const UploadWads = connect(state => ({wads: [...state.wads.files]}))(UploadWadsTag);