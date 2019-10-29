import actionTypes from '../../_constants/actionTypes';
import moment from 'moment';
export const deploymentDevice = (state = {}, action) => {
    let pagination, value, data, current, error, validate, name,search;
    switch (action.type) {
        case actionTypes.GET_DEPLOYMENT_DEVICE_SUCCESS:
            value = action.value;
            pagination = value.pagination;  // pagination = value.pagination;
            data = value.data;
            return {
                ...state,
                pagination: pagination,  // pagination: pagination,
                list: data,
                loading: 0,
                action: '',
                open: false,
                searchLoading: false,

            };
        case actionTypes.GET_DEPLOYMENT_DEVICE_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
                open: false,
            };
        case actionTypes.FEEDBACK_DEPLOYMENT_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.FEEDBACK_DEPLOYMENT_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                },
                loading: 2
            };
        case actionTypes.FEEDBACK_DEPLOYMENT_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_DEPLOYMENT:
            name = action.name;
            value = action.value;
            search = state.search || {};
            return {
                ...state,
                pagination: {
                    currentPage: 0
                },
                timeSearch: moment(),
                search: {
                    ...search,
                    [name]: value
                },
                searchLoading: true
            };
        case actionTypes.UPDATE_CURRENT_DEPLOYMENT:
            current = state.current || {};
            data = action.value;
            validate = state.validate || {};
            name = action.name;
            error = action.error;
            if (['current'].indexOf(name) > -1) {
                value = action.value;
                return {
                    ...state,
                    current: {
                        ...current,
                        ...value
                    },
                };
            } else {
                value = action.value;
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
            }
        default:
            return state;
    }
};
