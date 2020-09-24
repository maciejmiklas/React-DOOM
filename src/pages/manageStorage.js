import React, {Component} from "react";
import {actionNavigationTitle, Navigation} from "./navigation";
import Card from "react-bootstrap/Card";
import {connect} from "react-redux";
import {JsonEditor} from 'jsoneditor-react';

// https://github.com/josdejong/jsoneditor
// https://github.com/vankop/jsoneditor-react
// https://github.com/thlorenz/brace
// https://github.com/vankop/jsoneditor-react/issues/41

class StorageTag extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(actionNavigationTitle("Application Storage"))
    }

    render() {
        return (
            <Navigation>
                <Card bg="dark">
                    <Card.Body>
                        <div className="json-editor">
                            <JsonEditor value={this.props.root} mode="view"/>
                        </div>
                    </Card.Body>
                </Card>
            </Navigation>
        )
    }
}

export const ManageStorage = connect(state => ({root: {...state}}))(StorageTag)

