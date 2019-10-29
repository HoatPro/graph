import actionTypes from '../_constants/actionTypes';

const initialState = {
    smallMenu: false,
    activeItem: '/',
    activeIndex: -1
};

export const sideMenuR = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_MENU:
            const value = action.value;
            return {
                ...state,
                smallMenu: typeof value === 'undefined' ? !state.smallMenu : value
            };
        case actionTypes.ACTIVE_ITEM:
            return {
                ...state,
                activeItem: action.name
            };
        case actionTypes.ACTIVE_INDEX_SIDEBAR:
            return {
                ...state,
                activeIndex: action.index
            };
        default:
            return state;
    }
};
