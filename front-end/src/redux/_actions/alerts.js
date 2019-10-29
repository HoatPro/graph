import types from '../_constants/ActionTypes';

export const alertActions = {
    success,
    warning,
    error,
    clear
};

function success(message) {
    return {type: types.ALERT_SUCCESS, message};
}

function warning(message) {
    return {type: types.ALERT_WARNING, message};
}

function error(message) {
    return {type: types.ALERT_ERROR, message};
}

function clear() {
    return {type: types.ALERT_CLEAR};
}