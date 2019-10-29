import actionTypes from '../../_constants/actionTypes';
import _ from 'lodash';

export const permissions = (state = {}, action) => {
    let value, data, name, current, _auth, temp;
    switch (action.type) {

        case actionTypes.GET_TEST_SUCCESS:
            value = action.value;
            current = state.current;
            data = value.data;
            return {
                ...state,
                list: data,
            };
        case actionTypes.GET_PERMISSION_OTHER:
            value = action.value;
            return {
                ...state,
                ...value
            };
        case actionTypes.HANDLE_UPDATE_PERMISSION:
            value = action.value;
            current = state.current;

            return {
                ...state,
                current: {
                    ...current,
                    update: !current.update
                }
            };
        case actionTypes.HANDLE_CANCEL_PERMISSION:
            value = action.value;
            current = state.current || {};
            _auth = current._auth || [];
            temp = _.map(_auth, item => {
                return {routeActionId: item.routeActionId, routeId: item.routeId, actionId: item.actionId}
            });
            return {
                ...state,
                current: {
                    ...current,
                    update: !current.update,
                    auth: temp
                }
            };
        case actionTypes.HANDLE_SAVE_PERMISSION_SUCCESS:
            value = action.value;
            current = state.current;

            return {
                ...state,
                current: {
                    ...current,
                    update: !current.update
                }
            };
        case actionTypes.UPDATE_CURRENT_PERMISSION:
            current = state.current || {};
            name = action.name;
            value = action.value;

            return {
                ...state,
                current: {
                    ...current,
                    [name]: value
                },
            };
        case actionTypes.HANDLE_GET_PERMISSION_SUCCESS:
            value = action.value;
            current = state.current;
            temp = _.map(value, item => {
                return {routeActionId: item.routeActionId, routeId: item.routeId, actionId: item.actionId}
            });
            return {
                ...state,
                current: {
                    ...current,
                    _auth: value,
                    auth: temp
                }
            };

        default:
            return state;
    }
};
