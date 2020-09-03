import React, {Component} from "react";
import {actionSetTitle, Navigation} from "./navigation";
import Card from "react-bootstrap/Card";
import {connect} from "react-redux";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {reduxForm} from 'redux-form'
import Button from "react-bootstrap/Button";

const handleNameChange = (newName) => {
    console.log("NEW NAME: " + newName)
}
const FormEl = ({name, value, onChange, type = ""}) =>
    <Form.Group as={Row} controlId={name}>
        <Form.Label column sm={4}>{name}</Form.Label>
        <Col sm={6}>
            <Form.Control type={type} placeholder={value} readOnly={onChange == null} onChange={onChange}/>
        </Col>
    </Form.Group>

const validate = values => {
    const errors = {}
    if (!values.name) {
        errors.username = 'Required'
    }
    return errors
}

let WadForm = (props) => {
    const {handleSubmit, wads, wadName} = props
    const wad = wads.files.find(w => w.name === wadName);
    return (
        <Form noValidate onSubmit={handleSubmit}>
            <FormEl name="Name" value={wad.name} onChange={handleNameChange}/>
            <FormEl name="Uploaded" value={wad.uploadTime}/>
            <FormEl name="Last Played" value={wad.lastPlayed}/>
            <FormEl name="Saves" value={wad.saves.length}/>
            <FormEl name="Total Play Time" value={wad.stats.totalPlayTimeMs}/>
            <FormEl name="Longest Session" value={wad.stats.longestSessionMs}/>
            <FormEl name="Last Session" value={wad.stats.lastSessionMs}/>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>)
}
WadForm = reduxForm({
    form: 'wadForm',
    validate
})(WadForm)
WadForm = connect(state => ({wads: {...state.wads}}))(WadForm);

class EditWadTag extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(actionSetTitle(this.props.wadName));
    }

    render() {
        return (
            <Navigation>
                <Card bg="dark">
                    <Card.Body>
                        <div className="row">
                            <div className="col-md-6 offset-md-3">
                                <WadForm wadName={this.props.wadName}/>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Navigation>
        )
    }
}


export const reducer = (state = [], action) => {
    let newState = state;
    switch (action.type) {
    }
    return newState;
}

export const EditWad = connect(state => ({wads: {...state.wads}}))(EditWadTag);