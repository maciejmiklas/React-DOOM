import React, {Component} from "react";
import {actionNavigationTitle, Navigation} from "./Navigation";
import Dropzone from "react-dropzone";
import Card from "react-bootstrap/Card";
import {connect} from "react-redux";
import {actionShowOverwrite, ConfirmStore} from "./ConfirmStore";
import Actions from "../store/Actions";
import * as R from "ramda"

// ################### ACTIONS ###################
const actionWadOverwrite = (fileName, content) => [
    {
        action: Actions.WAD_OVERWRITE,
        props: {fileName, content}
    }
]
const actionWadOverwriteCancel = (fileName) => [
    {
        action: Actions.WAD_OVERWRITE_CANCEL,
        props: {fileName}
    }
]
export const actionWadUpload = (fileName, content) => ({
    type: Actions.WAD_UPLOAD,
    fileName,
    content
})
// ################### ACTIONS ###################

// ################### REDUCER ###################
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
// ################### REDUCER ###################

const FileUploader = ({callback}) =>
    <Dropzone onDrop={files => files.forEach(f => callback(f))}>
        {({getRootProps, getInputProps}) => (
            <section>
                <div {...getRootProps()} className="uploadDropzone">
                    <input {...getInputProps()} />
                    <br/><br/><br/>
                    Drag 'n' drop some files here, or click to select files
                </div>
            </section>
        )}
    </Dropzone>

class UploadWadsTag extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.updateTitle()
    }

    render() {
        const {wads, uploadNew, uploadExisting} = this.props
        const upload = uploadFile(wads, uploadNew, uploadExisting);
        return (
            <Navigation>
                <Card bg="card-tr">
                    <Card.Body>
                        <FileUploader callback={upload}/>
                    </Card.Body>
                </Card>
                <ConfirmStore/>
            </Navigation>
        )
    }
}

const wadExists = wads => fileName => R.pipe(normalizeWadName, norm => wads.some(w => w.name === norm))(fileName)

const uploadFile = (wads, uploadNew, uploadExisting) => file => {
    const reader = new FileReader();
    const fileName = file.name
    reader.onload = () => (wadExists(wads)(fileName) ? uploadExisting : uploadNew)(fileName, reader.result)
    reader.readAsArrayBuffer(file);
}

const normalizeWadName = (fileName) => fileName.split('.')[0];

const createWad = (fileName, content) => ({
    name: normalizeWadName(fileName),
    content: "TODO: WadParser.parse(content)",
    uploadTime: new Date(),
    lastPlayed: 0,
    saves: [],
    stats: {
        totalPlayTimeMs: 0,
        longestSessionMs: 0,
        lastSessionMs: 0
    }
})

const stateToProps = state => ({wads: [...state.wads.files]});
const dispatchToProps = dispatch => ({
    uploadNew: (fileName, content) => {
        dispatch(actionWadUpload(fileName, content))
    },
    uploadExisting: (fileName, content) => {
        dispatch(actionShowOverwrite(fileName)(actionWadOverwrite(fileName, content),
            actionWadOverwriteCancel(fileName)));
    },
    updateTitle: () => {
        dispatch(actionNavigationTitle("Upload WADs"))
    }
});
export const UploadWads = connect(stateToProps, dispatchToProps)(UploadWadsTag);