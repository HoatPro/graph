import actionTypes from '../_constants/actionTypes';

export const sideMenuA = {
    toggleMenu,
    activeItem,
    sendIndex
};

function toggleMenu(value) {
    return ({type: actionTypes.TOGGLE_MENU, value: value})
}

function activeItem(name) {
    return dispatch => {
        dispatch({type: actionTypes.ACTIVE_ITEM, name: name})
    }
}

function sendIndex(index) {
    return dispatch => {
        dispatch({type: actionTypes.ACTIVE_INDEX_SIDEBAR, index: index})
    }
}
