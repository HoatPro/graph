import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";
import moment from "moment";

export const users = (state = {}, action) => {
    let pagination, value, data, name, current, validate, error, search, groups, temp;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_USER:
            value = action.value;
            return {
                ...state,
                ...value,
            };
        case actionTypes.GET_USERS_SUCCESS:
            value = action.value;
            pagination = value.pagination;
            data = value.data;
            return {
                ...state,
                pagination: pagination,
                list: data,
                current: {},
                loading: 0,
                action: '',
                open: false,
                searchLoading: false,
            };
        case actionTypes.GET_USERS_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
                open: false,
            };
        case actionTypes.UPDATE_CURRENT_USER:
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
        case actionTypes.VALIDATE_USER:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_USER_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_USER_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    userId: value.data.userId
                },
                loading: 2
            };
        case actionTypes.INSERT_USER_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.MODAL_USER:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_DELETE_USER:
            return {
                ...state,
                current: action.value,
                open: true,
                action: 'delete'
            };
        case actionTypes.HANDLE_UPDATE_USER:
            value = action.value;
            groups = value.groups || [];
            temp = _.map(groups, o => o.roleId);
            return {
                ...state,
                current: {
                    ...value,
                    checked: temp
                },
                open: false,
                action: 'update'
            };
        case actionTypes.DELETE_USER_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_USER_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {},
                loading: 2,
            };
        case actionTypes.DELETE_USER_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0,

            };
        case actionTypes.GET_USERS_BY_ID_SUCCESS:
            value = action.value;
            data = value.data;
            data = data[0] || {};
            groups = data.groups || [];
            temp = _.map(groups, o => o.groupId);
            return {
                ...state,
                current: {
                    ...data,
                    checked: temp
                },
            };
        case actionTypes.GET_USERS_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_USER_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_USER_SUCCESS:
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
        case actionTypes.UPDATE_USER_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_USER:
            name = action.name;
            value = action.value;
            search = state.search || {};
            return {
                ...state,
                pagination: {
                    currentPage: 0,
                    countPage: 2,
                    sizePage: 10
                },
                timeSearch: moment(),
                search: {
                    ...search,
                    [name]: value
                },
                searchLoading: true
            };
        case actionTypes.ON_PAGE_CHANGE_USERS:
            value = action.value;
            pagination = state.pagination || {};
            return {
                ...state,
                pagination: {
                    ...pagination,
                    currentPage: value
                }
            };
        case actionTypes.GET_USER_OTHER_SUCCESS:
            value = action.value;
            return {
                ...state,
                ...value
            };
        case actionTypes.GET_USER_OTHER_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
