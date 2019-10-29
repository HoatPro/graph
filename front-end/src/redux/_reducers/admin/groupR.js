import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

export const groups = (state = {}, action) => {
    let pagination, value, data, name, current, validate, error, list, roles, temp;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_GROUP:
            value = action.value;
            return {
                ...state,
                ...value,
            };
        case actionTypes.GET_GROUPS_SUCCESS:
            value = action.value;
            pagination = value.pagination;
            data = value.data;
            return {
                ...state,
                pagination: pagination,
                list: data,
                // current: {},
                loading: 0,
                action: '',
                open: false,
                searchLoading: false,
            };
        case actionTypes.GET_GROUPS_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
                open: false,
            };
        case actionTypes.UPDATE_CURRENT_GROUP:
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
        case actionTypes.VALIDATE_GROUP:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_GROUP_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_GROUP_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    groupId: value.data.groupId
                },
                loading: 2
            };
        case actionTypes.INSERT_GROUP_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.MODAL_GROUP:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_DELETE_GROUP:
            return {
                ...state,
                current: action.value,
                open: true,
                action: 'delete'
            };
        case actionTypes.HANDLE_UPDATE_GROUP:
            value = action.value;
            roles = value.roles || [];
            temp = _.map(roles, o => o.roleId);
            return {
                ...state,
                current: {
                    ...value,
                    checked: temp
                },
                open: false,
                action: 'update'
            };
        case actionTypes.DELETE_GROUP_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_GROUP_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {},
                loading: 2,
            };
        case actionTypes.DELETE_GROUP_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0,

            };
        case actionTypes.GET_GROUPS_BY_ID_SUCCESS:
            value = action.value;
            data = value.data;
            data = data[0] || {};
            roles = data.roles || [];
            temp = _.map(roles, o => o.roleId);
            return {
                ...state,
                current: {
                    ...data,
                    checked: temp
                },
            };
        case actionTypes.GET_GROUPS_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_GROUP_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_GROUP_SUCCESS:
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
        case actionTypes.UPDATE_GROUP_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_GROUP:
            return {
                ...state,
                search: {
                    str: action.value
                },
                searchLoading: true
            };
        case actionTypes.ON_PAGE_CHANGE_GROUPS:
            value = action.value;
            pagination = state.pagination || {};
            return {
                ...state,
                pagination: {
                    ...pagination,
                    currentPage: value
                }
            };
        case actionTypes.GET_GROUP_OTHER_SUCCESS:
            value = action.value;
            return {
                ...state,
                ...value
            };
        case actionTypes.GET_GROUP_OTHER_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
