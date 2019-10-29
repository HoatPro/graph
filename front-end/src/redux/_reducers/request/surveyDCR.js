import actionTypes from '../../_constants/actionTypes';
// import _ from "lodash";

export const surveyDevice = (state = {}, action) => {
    let pagination, value, data, current, validate, name, error, search;
    switch (action.type) {
        case actionTypes.GET_SURVEY_DEVICE_SUCCESS:
            value = action.value;
            pagination = value.pagination;  // pagination = value.pagination;
            data = value.data;
            return {
                ...state,
                pagination: pagination,  // pagination: pagination,
                list: data,
                current: {},
                loading: 0,
                action: '',
                open: false,
                searchLoading: false,

            };
        case actionTypes.UPDATE_SURVEY_DEVICE:
            value = action.value;
            return {
                ...state,
                pagination: pagination,  // pagination: pagination,
                list: value,
                current: {},
                searchLoading: false,
                loading: 0,
                action: '',
                open: false,
            };
        case actionTypes.GET_SURVEY_DEVICE_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
                open: false,
            };
        case actionTypes.FEEDBACK_SURVEY_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.FEEDBACK_SURVEY_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                },
                loading: 2
            };
        case actionTypes.FEEDBACK_SURVEY_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_SURVEY:
            search = state.search || {};
            name = action.name ;
            value=action.value;
            return {
                ...state,
                search: {
                    ...search,
                    [name]: value
                },
                searchLoading: true
            };
        case actionTypes.UPDATE_CURRENT_SURVEY:
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
