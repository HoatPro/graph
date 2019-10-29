import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

export const locations = (state = {}, action) => {
    let pagination, value, data, name, parents, current, validate, error, list;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_LOCATION:
            value = action.value;
            return {
                ...state,
                ...value,
            };
        case actionTypes.GET_LOCATIONS_SUCCESS:
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
        case actionTypes.GET_LOCATIONS_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
            };
        case actionTypes.GET_LOCATION_PARENTS_SUCCESS:
            value = action.value || {};
            parents = value.data || [];
            return {
                ...state,
                parents: parents
            };
        case actionTypes.GET_LOCATION_PARENTS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_CURRENT_LOCATION:
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
        case actionTypes.VALIDATE_LOCATION:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_LOCATION_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_LOCATION_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    locationId: value.data.locationId
                },
                loading: 2
            };
        case actionTypes.INSERT_LOCATION_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.MODAL_LOCATION:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_DELETE_LOCATION:
            return {
                ...state,
                current: action.value,
                open: true,
                action: 'delete'
            };
        case actionTypes.HANDLE_UPDATE_LOCATION:
            return {
                ...state,
                current: action.value,
                open: false,
                action: 'update'
            };
        case actionTypes.DELETE_LOCATION_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_LOCATION_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {},
                loading: 2
            };
        case actionTypes.DELETE_LOCATION_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.GET_LOCATIONS_BY_ID_SUCCESS:
            value = action.value;
            data = value.data;
            return {
                ...state,
                current: data[0] || [],
            };
        case actionTypes.GET_LOCATIONS_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_LOCATION_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_LOCATION_SUCCESS:
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
        case actionTypes.UPDATE_LOCATION_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_LOCATION:
            return {
                ...state,
                search: {
                    str: action.value
                },
                searchLoading: true
            };
        case actionTypes.ON_PAGE_CHANGE_LOCATIONS:
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
