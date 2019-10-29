import actionTypes from '../../_constants/actionTypes';

export const contracts = (state = {}, action) => {
    let pagination, value, data, name, parents, current, validate, error, list;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_CONTRACT:
            value = action.value;
            return {
                ...state,
                ...value,
            };
        case actionTypes.GET_CONTRACTS_SUCCESS:
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
        case actionTypes.GET_CONTRACTS_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
            };
        case actionTypes.GET_CONTRACT_PARENTS_SUCCESS:
            value = action.value || {};
            parents = value.data || [];
            return {
                ...state,
                parents: parents
            };
        case actionTypes.GET_CONTRACT_PARENTS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_CURRENT_CONTRACT:
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
        case actionTypes.VALIDATE_CONTRACT:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_CONTRACT_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_CONTRACT_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    contractId: value.data.contractId
                },
                loading: 2
            };
        case actionTypes.INSERT_CONTRACT_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.MODAL_CONTRACT:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_DELETE_CONTRACT:
            return {
                ...state,
                current: action.value,
                open: true,
                action: 'delete'
            };
        case actionTypes.HANDLE_UPDATE_CONTRACT:
            return {
                ...state,
                current: action.value,
                open: false,
                action: 'update'
            };
        case actionTypes.DELETE_CONTRACT_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_CONTRACT_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {},
                loading: 2
            };
        case actionTypes.DELETE_CONTRACT_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.GET_CONTRACTS_BY_ID_SUCCESS:
            value = action.value;
            data = value.data;
            return {
                ...state,
                current: data[0] || [],
            };
        case actionTypes.GET_CONTRACTS_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_CONTRACT_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_CONTRACT_SUCCESS:
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
        case actionTypes.UPDATE_CONTRACT_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_CONTRACT:
            return {
                ...state,
                search: {
                    str: action.value
                },
                searchLoading: true
            };
        case actionTypes.ON_PAGE_CHANGE_CONTRACTS:
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
