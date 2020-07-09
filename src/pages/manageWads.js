import React from "react";
import Navigation from "./navigation";
import Dropzone from "react-dropzone";
import Card from "react-bootstrap/Card";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {arrayBufferToBase64} from "../util";
import {actionShowConfirm} from "./confirm";
import Carousel from "react-bootstrap/Carousel";

const manageWadsTag = ({dispatch, wads}) =>
    (
        <Navigation title="Manage WADs">
            <Card bg="dark">
                <Card.Body>
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
                </Card.Body>
            </Card>
            <br/>
            <Card bg="dark">
                <Card.Body>
                    <Card.Body>
                        {(!wads.length || wads.length === 0) ?
                            <p>No WADs uploaded</p> :
                            <Carousel>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src="holder.js/800x400?text=First slide&bg=373940"
                                        alt="First slide"
                                    />
                                    <Carousel.Caption>
                                        <h3>First slide label</h3>
                                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                                    </Carousel.Caption>
                                </Carousel.Item>

                            </Carousel>
                        }

                    </Card.Body>
                </Card.Body>
            </Card>
        </Navigation>
    )

const ACTIONS = {
    FILE_UPLOADED: "FILE_UPLOADED"
}

const uploadFiles = (files, wads, dispatch) => (
    files.forEach(file => uploadFile(file, wads, dispatch))
)

function uploadFile(file, wads, dispatch) {
    const reader = new FileReader();
    reader.onload = function () {
        let base64 = arrayBufferToBase64(reader.result);
        if (wads[file.name]) {
            dispatch(actionShowConfirm(ACTIONS.FILE_UPLOADED, {
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
    type: ACTIONS.FILE_UPLOADED,
    fileName,
    content
})

actionFileUploaded.propTypes = {
    file: PropTypes.object
}

export const reducer = (state = [], action) => {

    switch (action.type) {
        case ACTIONS.FILE_UPLOADED:
            return {
                ...state,
                [action.fileName]: {
                    content: action.content,
                    uploadTime: new Date(),
                    lastPlayed: "-"
                }
            }
    }
    return state;
}

export const manageWads = connect(state => ({wads: {...state.wads}}))(manageWadsTag);