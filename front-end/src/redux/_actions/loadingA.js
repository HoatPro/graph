import actionTypes from '../_constants/actionTypes';

export const loadingA = {
    start,
    stop,
};

function start(message) {
    return {type: actionTypes.LOADING_START, message};
}

function stop() {
    return {type: actionTypes.LOADING_STOP};
}

