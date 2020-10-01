import React, {Component} from "react";
import {actionNavigationTitle, Navigation} from "./Navigation";
import Card from "react-bootstrap/Card";
import {connect} from "react-redux";
import {JsonEditor} from 'jsoneditor-react';
import Button from "react-bootstrap/Button";
import {actionSendMsg} from "./Messages";

class StorageTag extends Component {
    constructor(props) {
        super(props);
        this.downloadStorage = this.downloadStorage.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(actionNavigationTitle("Application Storage (React State)"))
    }

    saveData(data, fileName) {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.download = fileName;
        const url = window.URL.createObjectURL(new Blob([data], {type: "octet/stream"}));
        a.href = url;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    downloadStorage() {
        const json = JSON.stringify(this.props.root, null, "\t");
        this.saveData(json, 'storage.json');
        this.props.dispatch(actionSendMsg("Storage downloaded"));
    }

    render() {
        return (
            <Navigation>
                <Card bg="dark">
                    <Card.Body>
                        <SButton title="Download Storage" onClick={this.downloadStorage}/>&nbsp;
                        <SButton title="Upload Storage" disabled={true}/>
                    </Card.Body>
                </Card>
                <div className="card-separator"/>
                <Card bg="dark">
                    <Card.Body>
                        <JsonEditor value={this.props.root} mode="view" name="Storage Content"/>
                    </Card.Body>
                </Card>
            </Navigation>
        )
    }
}

const SButton = ({onClick, title, disabled = false}) =>
    <Button onClick={onClick} variant="outline-secondary" className="navbarButton" disabled={disabled}>
        {title}
    </Button>


export const ManageStorage = connect(state => ({root: {...state}}))(StorageTag)