import React, {Component} from "react";
import {actionSetTitle, Navigation} from "./navigation";
import Card from "react-bootstrap/Card";
import {connect} from "react-redux";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

const handleNameChange = (newName) => {
    console.log("NEW NAME: " + newName)
}

const Property = ({title, value, onChange}) =>
    <InputGroup className="mb-3">
        <InputGroup.Prepend>
            <InputGroup.Text id={`${title}-ig`}>
                {title}
            </InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl id={`${title}-fc`} defaultValue={value} readOnly={onChange == null}
                     disabled={onChange == null}  onChange={onChange}/>
    </InputGroup>

class EditWadTag extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(actionSetTitle(this.props.wadName));
    }

    render() {
        const {dispatch, wads, wadName} = this.props;
        const wad = wads.files.find(w => w.name === wadName);

        return (
            <Navigation>
                <Card bg="dark">
                    <Card.Body>
                        <Property title="Name" value={wad.name} onChange={handleNameChange}/>
                        <Property title="Uploaded" value={wad.uploadTime}/>
                        <Property title="Last Played" value={wad.lastPlayed}/>
                        <Property title="Saves" value={wad.saves.length}/>
                        <Property title="Total Play Time" value={wad.stats.totalPlayTimeMs}/>
                        <Property title="Longest Session" value={wad.stats.longestSessionMs}/>
                        <Property title="Last Session" value={wad.stats.lastSessionMs}/>
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