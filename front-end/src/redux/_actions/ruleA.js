import actionTypes from '../_constants/actionTypes';

export const ruleA = {
    set,
};

function set(rules) {
    return {type: actionTypes.SET_RULE, rules};
}

