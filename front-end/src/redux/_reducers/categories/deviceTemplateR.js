import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

export const deviceTemplates = (state = {}, action) => {
    let pagination, value, data, name, parents, current, validate, error;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_DEVICE_TEMPLATE:
            value = action.value;
            return {
                ...state,
                ...value,
            };
        case actionTypes.GET_DEVICE_TEMPLATES_SUCCESS:
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
        case actionTypes.GET_DEVICE_TEMPLATES_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
            };

        case actionTypes.GET_DEVICE_TYPE_DEVICE_TEMPLATES_SUCCESS:
            value = action.value;
            data = value.data;
            return {
                ...state,
                deviceTypes: data,
            };
        case actionTypes.GET_DEVICE_TYPE_DEVICE_TEMPLATES_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        case actionTypes.GET_DEVICE_TEMPLATE_PARENTS_SUCCESS:
            value = action.value || {};
            parents = value.data || [];
            return {
                ...state,
                parents: parents
            };
        case actionTypes.GET_DEVICE_TEMPLATE_PARENTS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_CURRENT_DEVICE_TEMPLATE:
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
        case actionTypes.VALIDATE_DEVICE_TEMPLATE:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_DEVICE_TEMPLATE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_DEVICE_TEMPLATE_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    deviceTemplateId: value.data.deviceTemplateId
                },
                loading: 2
            };
        case actionTypes.INSERT_DEVICE_TEMPLATE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.IMPORT_DEVICE_TEMPLATE_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
            };
        case actionTypes.IMPORT_DEVICE_TEMPLATE_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        case actionTypes.MODAL_DEVICE_TEMPLATE:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_DELETE_DEVICE_TEMPLATE:
            return {
                ...state,
                current: action.value,
                open: true,
                action: 'delete'
            };
        case actionTypes.HANDLE_UPDATE_DEVICE_TEMPLATE:
            return {
                ...state,
                current: action.value,
                open: false,
                action: 'update'
            };
        case actionTypes.DELETE_DEVICE_TEMPLATE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_DEVICE_TEMPLATE_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {},
                loading: 2
            };
        case actionTypes.DELETE_DEVICE_TEMPLATE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.GET_DEVICE_TEMPLATES_BY_ID_SUCCESS:
            value = action.value;
            data = value.data;
            current = data[0] || {};
            return {
                ...state,
                current: current,
            };
        case actionTypes.GET_DEVICE_TEMPLATES_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_DEVICE_TEMPLATE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_DEVICE_TEMPLATE_SUCCESS:
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
        case actionTypes.UPDATE_DEVICE_TEMPLATE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_DEVICE_TEMPLATE:
            name = action.name;
            value = action.value;
            return {
                ...state,
                search: {
                    [name]: value
                },
                searchLoading: true
            };
        case actionTypes.ON_PAGE_CHANGE_DEVICE_TEMPLATES:
            value = action.value;
            pagination = state.pagination || {};
            return {
                ...state,
                pagination: {
                    ...pagination,
                    currentPage: value
                }
            };
        case actionTypes.GET_DEVICE_TEMPLATE_OTHER_SUCCESS:
            value = action.value;
            return {
                ...state,
                ...value
            };
        case actionTypes.GET_DEVICE_TEMPLATE_OTHER_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
