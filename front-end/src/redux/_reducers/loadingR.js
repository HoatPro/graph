import actionTypes from '../_constants/actionTypes';

export const loading = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.LOADING_START:
            return {
                status: true,
                message: action.message
            };
        case actionTypes.LOADING_STOP:
            return {
                status: false,
                message: action.message
            };
        default:
            return state
    }
};