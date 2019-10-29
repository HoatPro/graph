import actionTypes from '../../_constants/actionTypes';

export const deviceInRack = (state = {}, action) => {
    let pagination, value, data, name, parents, current, validate, error, search;
    switch (action.type) {

        case actionTypes.GET_DEVICE_IN_RACK_SUCCESS:
            value = action.value;
            pagination = value.pagination;
            data = value.data;
            return {
                ...state,
                pagination: pagination,
                list: data,
                current: {},
                searchLoading: false,
            };
        case actionTypes.SEARCH_DEVICE_IN_RACK:
            name = action.name;
            value = action.value;
            search = state.search || {};
            if (name === 'roomId') {
                search = {
                    ...search,
                    [name]: value,
                    zoneId: '',
                    rackId: ''
                }
            } else {
                search = {
                    ...search,
                    [name]: value,
                }
            }
            return {
                ...state,
                pagination: {
                    currentPage: 0
                },
                search: search,
                searchLoading: true
            };
        case actionTypes.GET_DEVICE_IN_RACK_OTHER_SUCCESS:
            value = action.value;
            return {
                ...state,
                ...value
            };
        case actionTypes.GET_DEVICE_IN_RACK_OTHER_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        case actionTypes.HANDLE_DELETE_DEVICE_IN_RACK:
            return {
                ...state,
                current: action.value,
                open: true,
                action: 'delete'
            };
        case actionTypes.MODAL_DEVICE_IN_RACK:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.UPDATE_CURRENT_DEVICE_IN_RACK:
            current = state.current || {};
            validate = state.validate || {};
            value = action.value;
            error = action.error;

            return {
                ...state,
                current: {
                    ...current,
                    ...value
                },
            };
        default:
            return state;
    }
};
