import React from "react";
import Alert from "react-bootstrap/Alert";
import PropTypes from "prop-types";

function PlayPage1({onExit}) {

    return (
        <Alert variant="danger" onClose={onExit} dismissible>
            <Alert.Heading>Play Page 1</Alert.Heading>
            <p>
                ONE!
            </p>
        </Alert>
    );
}


PlayPage1.propTypes = {
    onExit: PropTypes.func
}

export default PlayPage1;
