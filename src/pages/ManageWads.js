import React from "react";
import Navigation from "./Navigation";
import Dropzone from "react-dropzone";
import Card from "react-bootstrap/Card";
import PropTypes from "prop-types";

export function ManageWads() {

    return (
        <Navigation title="Manage WADs">
            <Card bg="dark">
                <Card.Body>
                    <Dropzone onDrop={files => actionFilesUploaded(files)}>
                        {({getRootProps, getInputProps}) => (
                            <section>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    Drag 'n' drop some files here, or click to select files
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </Card.Body>
            </Card>
        </Navigation>
    );
}

const ACTIONS = {
    FILE_UPLOADED: "FILE_UPLOADED",
    FILES_UPLOADED: "FILES_UPLOADED"
}

export const actionFilesUploaded = (file) => {
    console.log(file);
    return {
        type: ACTIONS.FILE_UPLOADED,
        file
    };
}

export const actionFileUploaded = (file) => ({
    type: ACTIONS.FILE_UPLOADED,
    file
})

actionFileUploaded.propTypes = {
    file: PropTypes.object
}

export const reducer = (state = [], action) => {

    switch (action.type) {
        case ACTIONS.FILE_UPLOADED:
            console.log(action.file);
            return {
                ...state,
                active: action.page
            }
    }
    return state;
}