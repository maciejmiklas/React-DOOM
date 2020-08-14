import React from "react";
import Navigation from "./navigation";
import Dropzone from "react-dropzone";
import Card from "react-bootstrap/Card";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {arrayBufferToBase64} from "../util";
import {actionShowConfirm} from "./confirm";
import ACTIONS from "../store/actions";

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


const uploadWadsTag = ({dispatch, wads}) =>
    (
        <Navigation title="Upload WADs">
            <Card bg="dark">
                <Card.Body>
                    <FileUploader dispatch={dispatch} wads={wads}/>
                </Card.Body>
            </Card>
        </Navigation>
    )


const uploadFiles = (files, wads, dispatch) => (
    files.forEach(file => uploadFile(file, wads, dispatch))
)

function uploadFile(file, wads, dispatch) {
    const reader = new FileReader();
    reader.onload = function () {
        let base64 = arrayBufferToBase64(reader.result);

        if (wads.some(w => w.name === file.name)) {
            dispatch(actionShowConfirm(ACTIONS.WADS_UPLOADED, {
                fileName: file.name,
                content: base64
            }, "Overwrite?", "File '" + file.name + "' already exists, overwrite it?"));
        } else {
            dispatch(actionFileUploaded(file.name, base64));
        }

    }
    reader.readAsArrayBuffer(file);
}

export const actionFileUploaded = (fileName, content) => ({
    type: ACTIONS.WADS_UPLOADED,
    fileName,
    content
})

actionFileUploaded.propTypes = {
    file: PropTypes.object
}

export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
        case ACTIONS.WADS_UPLOADED:
            newState = {
                ...state,
                files: [
                    ...state.files,
                    {
                        name: action.fileName,
                        content: action.content,
                        uploadTime: new Date(),
                        lastPlayed: 0,
                        saves: [],
                        stats: {
                            totalPlayTimeMs: 0,
                            longestSessionMs: 0
                        }
                    }]
            }
    }
    return newState;
}

export const uploadWads = connect(state => ({wads: [...state.wads.files]}))(uploadWadsTag);