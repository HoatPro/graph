import actionTypes from '../_constants/actionTypes';

export const alerts = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.ALERT_SUCCESS:
            return {
                type: 'success',
                message: action.message
            };
        case actionTypes.ALERT_WARNING:
            return {
                type: 'warn',
                message: action.message
            };
        case actionTypes.ALERT_ERROR:
            return {
                type: 'error',
                message: action.message
            };
        case actionTypes.ALERT_CLEAR:
            return {};
        default:
            return state
    }
}