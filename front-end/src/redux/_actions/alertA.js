import actionTypes from '../_constants/actionTypes';

export const alertA = {
    success,
    warning,
    error,
    clear
};

function success(message) {
    return {type: actionTypes.ALERT_SUCCESS, message};
}

function warning(message) {
    return {type: actionTypes.ALERT_WARNING, message};
}

function error(message) {
    return {type: actionTypes.ALERT_ERROR, message};
}

function clear() {
    return {type: actionTypes.ALERT_CLEAR};
}