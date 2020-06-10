import PropTypes from 'prop-types';
import {actions as A} from "./constants";

export const gotoPage = (page) => ({
    type: A.GOTO_PAGE,
    page: page
})

gotoPage.propTypes = {
    page: PropTypes.string,
}


