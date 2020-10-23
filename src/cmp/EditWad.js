import React, {Component} from "react";
import {actionNavigationTitle, Navigation} from "./Navigation";
import Card from "react-bootstrap/Card";
import {connect} from "react-redux";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropTypes from 'prop-types';
import Actions from "../store/Actions";

// ################### ACTIONS ###################
export const actionWadRename = (oldName, newName) => ({
    type: Actions.WAD_RENAME,
    oldName,
    newName
})
// ################### ACTIONS ###################

// ################### REDUCER ###################
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
    }
    return newState;
}

// ################### REDUCER ###################

class Input extends Component {

    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.state = {error: null}
        this.initialValue = this.props.value;
        this.onChange = this.props.onChange
    }

    handleInput(event) {
        if (!this.onChange) {
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
        if (!this.onChange) {
            return;
        }
        const value = event.target.value;
        if (value && !this.state.error && value !== this.initialValue && value.trim !== "") {
            this.onChange(this.initialValue, value);
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
    type: PropTypes.string,
    value: PropTypes.any,
};


class EditWadTag extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.updateTitle();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.wad !== undefined;
    }

    render() {
        const {wad, validateWadName, handleNameChange} = this.props
        return (
            <Navigation>
                <Card bg="dark">
                    <Card.Body>
                        <div className="row">
                            <div className="col-md-6 offset-md-3">
                                <Form noValidate>
                                    <Input name="Name" value={wad.name} onChange={handleNameChange}
                                           validate={validateWadName}/>
                                    <Input name="Uploaded" value={wad.uploadTime}/>
                                    <Input name="Last Played" value={wad.lastPlayed}/>
                                    <Input name="Saves" value={wad.saves.length}/>
                                    <Input name="Total Play Time" value={wad.stats.totalPlayTimeMs}/>
                                    <Input name="Longest Session" value={wad.stats.longestSessionMs}/>
                                    <Input name="Last Session" value={wad.stats.lastSessionMs}/>
                                </Form>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Navigation>
        )
    }
}

EditWadTag.propTypes = {
    updateTitle: PropTypes.func,
    handleNameChange: PropTypes.func,
    validateWadName: PropTypes.func,
    wad: PropTypes.object,
    wadName: PropTypes.string,
};

const validateWadName = (allWadNames, editingName) => newName => {
    if (editingName === newName) {
        return;
    }
    if (allWadNames.filter(w => w === newName).length > 0) {
        return "Name already taken";
    }
}

const stateToProps = (state, wadName) => {
    const wads = {...state.wads};
    const wadNameStr = wadName.wadName;
    return {
        wad: wads.files.find(w => w.name === wadNameStr),
        validateWadName: validateWadName(wads.files.map(w => w.name), wadNameStr)
    }
};
const dispatchToProps = (dispatch, wadName) => {
    const wadNameStr = wadName.wadName;
    return {
        updateTitle: () => dispatch(actionNavigationTitle(wadNameStr)),
        handleNameChange: (oldName, newName) => dispatch(actionWadRename(oldName, newName))
    }
};
export const EditWad = connect(stateToProps, dispatchToProps)(EditWadTag);