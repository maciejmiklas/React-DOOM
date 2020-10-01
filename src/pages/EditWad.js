import React, {Component} from "react";
import {actionNavigationTitle, Navigation} from "./Navigation";
import Card from "react-bootstrap/Card";
import {connect} from "react-redux";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropTypes from 'prop-types';
import {actionWadRename} from "./UploadWads";
import {actionSendMsg} from "./Messages";

const handleNameChange = (name, oldName, newName, dispatch) => {
    dispatch(actionSendMsg("Rename WAD from '" + oldName + "' to '" + newName + "'"))
    dispatch(actionWadRename(oldName, newName));
};

class Input extends Component {

    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.state = {error: null}
        this.dispatch = this.props.dispatch;
        this.initialValue = this.props.value;
        this.name = this.props.name;
    }

    handleInput(event) {
        if (!this.props.onChange) {
            return;
        }
        const value = event.target.value;
        let error = null;
        const {validate} = this.props;
        if (validate) {
            error = validate(value);
            if (this.state.error !== error) {
                this.setState({error});
            }
        }
    }

    handleUpdate(event) {
        if (!this.props.onChange) {
            return;
        }
        const value = event.target.value;
        if (value && !this.state.error && value !== this.initialValue && value.trim !== "") {
            this.props.onChange(this.name, this.initialValue, value, this.dispatch);
        }
    }

    render() {
        const {name, type, value, onChange} = this.props;
        return (
            <Form.Group as={Row} controlId={name}>
                <Form.Label column sm={4}>{name}</Form.Label>
                <Col sm={6}>
                    <Form.Control type={type} placeholder={value} readOnly={onChange == null}
                                  onChange={this.handleInput} isInvalid={this.state.error} onBlur={this.handleUpdate}/>
                    <Form.Control.Feedback type="invalid">
                        {this.state.error}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>)
    }
}

Input.propTypes = {
    onChange: PropTypes.func,
    validate: PropTypes.func,
    dispatch: PropTypes.func,
    type: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.any,
};

class EditWadTag extends Component {
    constructor(props) {
        super(props);
        this.wads = this.props.wads;
        this.wadName = this.props.wadName;
        this.wad = this.wads.files.find(w => w.name === this.wadName);
        this.dispatch = this.props.dispatch;
        this.validateName = this.validateName.bind(this);
    }

    validateName(value) {
        if (this.wad.name === value) {
            return;
        }
        if (this.wads.files.filter(w => w.name === value).length > 0) {
            return "Name already taken";
        }
    }

    componentDidMount() {
        this.dispatch(actionNavigationTitle(this.props.wadName));
    }

    render() {
        return (
            <Navigation>
                <Card bg="dark">
                    <Card.Body>
                        <div className="row">
                            <div className="col-md-6 offset-md-3">
                                <Form noValidate>
                                    <Input name="Name" value={this.wad.name} onChange={handleNameChange}
                                           validate={this.validateName} dispatch={this.dispatch}/>
                                    <Input name="Uploaded" value={this.wad.uploadTime}/>
                                    <Input name="Last Played" value={this.wad.lastPlayed}/>
                                    <Input name="Saves" value={this.wad.saves.length}/>
                                    <Input name="Total Play Time" value={this.wad.stats.totalPlayTimeMs}/>
                                    <Input name="Longest Session" value={this.wad.stats.longestSessionMs}/>
                                    <Input name="Last Session" value={this.wad.stats.lastSessionMs}/>
                                </Form>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Navigation>
        )
    }
}

Input.propTypes = {
    wads: PropTypes.object,
    wadName: PropTypes.string,
};


export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
    }
    return newState;
}

export const EditWad = connect(state => ({wads: {...state.wads}}))(EditWadTag);