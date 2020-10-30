import React from "react";
import Alert from "react-bootstrap/Alert";
import PropTypes from "prop-types";
import {Navigation} from "./Navigation";
import * as R from "ramda";

// ################### ACTIONS ###################

// ################### ACTIONS ###################

// ################### REDUCER ###################

// ################### REDUCER ###################

function PlayPage({onExit}) {
    return (
        <Navigation>
            <Alert variant="danger" onClose={onExit} dismissible>
                <Alert.Heading>Play Page 0</Alert.Heading>
                <p>
                    Initial Game ;)
                </p>
            </Alert>
        </Navigation>
    );
}


PlayPage.propTypes = {
    onExit: PropTypes.func
}

export default PlayPage;
