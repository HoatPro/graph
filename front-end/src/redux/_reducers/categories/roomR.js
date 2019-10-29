import actionTypes from "../../_constants/actionTypes";
import _ from 'lodash';


export const rooms = (state = {}, action) => {
    let pagination, value, data, name, parents, current, validate, error, list, locations, dataCenters, search;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_ROOM:
            value = action.value;
            return {
                ...state,
                ...value,
            };
        case actionTypes.GET_ROOMS_SUCCESS:
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
        case actionTypes.GET_ROOMS_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
            };
        case actionTypes.GET_ROOM_PARENTS_SUCCESS:
            value = action.value || {};
            parents = value.data || [];
            return {
                ...state,
                parents: parents
            };
        case actionTypes.GET_ROOM_PARENTS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_CURRENT_ROOM:
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
        case actionTypes.VALIDATE_ROOM:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_ROOM_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_ROOM_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    roomId: value.data.roomId
                },
                loading: 2
            };
        case actionTypes.INSERT_ROOM_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.MODAL_ROOM:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_DELETE_ROOM:
            return {
                ...state,
                current: action.value,
                open: true,
                action: 'delete'
            };
        case actionTypes.HANDLE_UPDATE_ROOM:
            return {
                ...state,
                current: action.value,
                open: false,
                action: 'update'
            };
        case actionTypes.DELETE_ROOM_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_ROOM_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {},
                loading: 2
            };
        case actionTypes.DELETE_ROOM_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.GET_ROOMS_BY_ID_SUCCESS:
            value = action.value;
            data = value.data;
            current = data[0] || {};
            return {
                ...state,
                current: current,
            };
        case actionTypes.GET_ROOMS_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_ROOM_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_ROOM_SUCCESS:
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
        case actionTypes.UPDATE_ROOM_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_ROOM:
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
        case actionTypes.ON_PAGE_CHANGE_ROOMS:
            value = action.value;
            pagination = state.pagination || {};
            return {
                ...state,
                pagination: {
                    ...pagination,
                    currentPage: value
                }
            };
        case actionTypes.GET_ROOM_OTHER_SUCCESS:
            value = action.value;
            return {
                ...state,
                ...value
            };
        case actionTypes.GET_ROOM_OTHER_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        case actionTypes.ONCHANGE_LOCATION_ROOM:
            dataCenters = state.dataCenters || [];
            current = state.current || {};
            value = action.value;
            data = _.filter(dataCenters, item => {
                return (value === item.locationId)
            })
            return {
                ...state,
                current: {
                    ...current,
                    dataCenterId: ''
                },
                _dataCenters: data
            }
        default:
            return state;
    }
};
