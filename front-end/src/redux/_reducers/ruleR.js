import actionTypes from '../_constants/actionTypes';

export const rule = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.SET_RULE:
            return {
                ...state,
                rule: action.rules
            };
        default:
            return state
    }
};