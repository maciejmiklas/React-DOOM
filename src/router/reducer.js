import {actions as A} from "./constants";

export const router = (state = [], action) => {

    switch (action.type) {
        case A.GOTO_PAGE:
            return {
                ...state,
                active: action.page
            }
    }
    return state;
}