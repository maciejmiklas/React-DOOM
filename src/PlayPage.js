import React from "react";
import Alert from "react-bootstrap/Alert";
import PropTypes from "prop-types";

function PlayPage({onExit}) {

    return (
        <Alert variant="danger" onClose={onExit} dismissible>
            <Alert.Heading>Play Page 0</Alert.Heading>
            <p>
                Initial Game ;)
            </p>
        </Alert>
    );
}


PlayPage.propTypes = {
    onExit: PropTypes.func
}

export default PlayPage;
