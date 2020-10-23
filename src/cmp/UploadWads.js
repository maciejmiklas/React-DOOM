import React, {Component} from "react";
import {actionNavigationTitle, Navigation} from "./Navigation";
import Dropzone from "react-dropzone";
import Card from "react-bootstrap/Card";
import {connect} from "react-redux";
import {actionShowConfirm, ConfirmStore} from "./ConfirmStore";
import Actions from "../store/Actions";
import {WadReader} from "../wad/WadReader";

const FileUploader = ({callback}) =>
    <Dropzone onDrop={files => files.forEach(f => callback(f))}>
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
        const upload = uploadFile(dispatch, wads);
        return (
            <Navigation>
                <Card bg="dark">
                    <Card.Body>
                        <FileUploader callback={upload}/>
                    </Card.Body>
                </Card>
                <ConfirmStore/>
            </Navigation>
        )
    }
}

const callbackWadOverwrite = (fileName, content) => [
    {
        action: Actions.WAD_OVERWRITE,
        props: {fileName, content}
    }
]

const callbackWadOverwriteCancel = (fileName) => [
    {
        action: Actions.WAD_OVERWRITE_CANCEL,
        props: {fileName}
    }
]

const uploadFile = (dispatch, wads) => file => {
    const reader = new FileReader();
    const fileName = file.name
    reader.onload = () => {
        const wadName = normalizeWadName(fileName);
        if (wads.some(w => w.name === wadName)) {
            dispatch(actionShowConfirm(callbackWadOverwrite(fileName, reader.result),
                callbackWadOverwriteCancel(fileName),
                "Overwrite?",
                `File '${fileName}' already exists, overwrite it?`)
            )
        } else {
            dispatch(actionWadUpload(fileName, reader.result))
        }
    }
    reader.readAsArrayBuffer(file);
}

export const actionWadUpload = (fileName, content) => ({
    type: Actions.WAD_UPLOAD,
    fileName,
    content
})

const normalizeWadName = (fileName) => fileName.split('.')[0];

const createWad = (fileName, content) => ({
    name: normalizeWadName(fileName),
    content: WadReader.parse(content),
    uploadTime: new Date(),
    lastPlayed: 0,
    saves: [],
    stats: {
        totalPlayTimeMs: 0,
        longestSessionMs: 0,
        lastSessionMs: 0
    }
})

export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
        case Actions.WAD_OVERWRITE:
            newState = {
                ...state,
                files: [
                    ...state.files.filter(f => f.name !== action.fileName),
                    createWad(action.fileName, action.content)]
            }
            break;
        case Actions.WAD_UPLOAD:
            newState = {
                ...state,
                files: [
                    ...state.files,
                    createWad(action.fileName, action.content)]
            }
            break;
    }
    return newState;
}

export const UploadWads = connect(state => ({wads: [...state.wads.files]}))(UploadWadsTag);