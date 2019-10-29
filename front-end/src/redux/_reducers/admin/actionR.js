import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

export const actions = (state = {}, action) => {
    let pagination, value, data, name, current, validate, error, temp;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_ACTION:
            value = action.value;
            return {
                ...state,
                ...value,
            };
        case actionTypes.GET_ACTIONS_SUCCESS:
            value = action.value;
            pagination = value.pagination;
            data = value.data;
            return {
                ...state,
                pagination: pagination,
                list: data,
                loading: 0,
                action: '',
                open: false,
                searchLoading: false,
            };
        case actionTypes.GET_ACTIONS_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
                open: false,
            };
        case actionTypes.UPDATE_CURRENT_ACTION:
            current = state.current || {};
            validate = state.validate || {};
            name = action.name;
            value = action.value;
            error = action.error;

            return {
                ...state,
                current: {
                    ...current,
                    [name]: value
                },
                validate: {
                    ...validate,
                    [name]: error
                }
            };
        case actionTypes.VALIDATE_ACTION:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_ACTION_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_ACTION_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    actionId: value.data.actionId
                },
                loading: 2
            };
        case actionTypes.INSERT_ACTION_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.MODAL_ACTION:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_DELETE_ACTION:
            return {
                ...state,
                current: action.value,
                open: true,
                action: 'delete'
            };
        case actionTypes.HANDLE_UPDATE_ACTION:
            value = action.value;
            return {
                ...state,
                current: {
                    ...value,
                },
                open: false,
                action: 'update'
            };
        case actionTypes.DELETE_ACTION_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_ACTION_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {},
                loading: 2,
            };
        case actionTypes.DELETE_ACTION_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0,

            };
        case actionTypes.GET_ACTIONS_BY_ID_SUCCESS:
            value = action.value;
            data = value.data;
            data = data[0] || {};
            return {
                ...state,
                current: {
                    ...data,
                },
            };
        case actionTypes.GET_ACTIONS_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_ACTION_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_ACTION_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    ...value.data
                },
                loading: 2,
            };
        case actionTypes.UPDATE_ACTION_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_ACTION:
            return {
                ...state,
                search: {
                    str: action.value
                },
                searchLoading: true
            };
        case actionTypes.ON_PAGE_CHANGE_ACTIONS:
            value = action.value;
            pagination = state.pagination || {};
            return {
                ...state,
                pagination: {
                    ...pagination,
                    currentPage: value
                }
            };
        default:
            return state;
    }
};
