import actionTypes from '../../_constants/actionTypes';
import moment from 'moment';

export const datacenters = (state = {}, action) => {
    let pagination, value, data, name, parents, current, validate, error, list, search;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_DATACENTER:
            value = action.value;
            return {
                ...state,
                ...value,
            };
        case actionTypes.GET_DATACENTERS_SUCCESS:
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
        case actionTypes.GET_DATACENTERS_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
            };
        case actionTypes.GET_DATACENTER_PARENTS_SUCCESS:
            value = action.value || {};
            parents = value.data || [];
            return {
                ...state,
                parents: parents
            };
        case actionTypes.GET_DATACENTER_PARENTS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_CURRENT_DATACENTER:
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
        case actionTypes.VALIDATE_DATACENTER:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_DATACENTER_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_DATACENTER_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    dataCenterId: value.data.dataCenterId
                },
                loading: 2
            };
        case actionTypes.INSERT_DATACENTER_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.MODAL_DATACENTER:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_DELETE_DATACENTER:
            return {
                ...state,
                current: action.value,
                open: true,
                action: 'delete'
            };
        case actionTypes.HANDLE_UPDATE_DATACENTER:
            return {
                ...state,
                current: action.value,
                open: false,
                action: 'update'
            };
        case actionTypes.DELETE_DATACENTER_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_DATACENTER_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {},
                loading: 2
            };
        case actionTypes.DELETE_DATACENTER_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.GET_DATACENTERS_BY_ID_SUCCESS:
            value = action.value;
            data = value.data;
            return {
                ...state,
                current: data[0] || [],
            };
        case actionTypes.GET_DATACENTERS_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_DATACENTER_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_DATACENTER_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    ...value.data
                },
                loading: 2
            };
        case actionTypes.UPDATE_DATACENTER_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_DATACENTER:
            name = action.name;
            value = action.value;
            search = state.search || {};
            return {
                ...state,
                pagination: {
                    currentPage: 0
                },
                search: {
                    ...search,
                    [name]: value
                },
                searchLoading: true
            };
        case actionTypes.ON_PAGE_CHANGE_DATACENTERS:
            value = action.value;
            pagination = state.pagination || {};
            return {
                ...state,
                pagination: {
                    ...pagination,
                    currentPage: value
                }
            };
        case actionTypes.GET_DATACENTER_OTHER_SUCCESS:
            value = action.value;
            return {
                ...state,
                ...value
            };
        case actionTypes.GET_DATACENTER_OTHER_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
