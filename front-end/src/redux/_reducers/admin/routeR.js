import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

export const routes = (state = {}, action) => {
    let pagination, value, data, name, parents, current, validate, error, actions, actionList;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_ROUTE:
            value = action.value;
            return {
                ...state,
                ...value,
            };
        case actionTypes.GET_ALL_ROUTES_SUCCESS:
            value = action.value;
            return {
                ...state,
                 allRoutes: [...value]
            };
        case actionTypes.GET_ROUTES_SUCCESS:
            value = action.value;
            pagination = value.pagination;
            data = value.data;
            return {
                ...state,
                pagination: pagination,
                list: data,
                current: {
                    actions: []
                },
                loading: 0,
                action: '',
                open: false,
                searchLoading: false,
            };
        case actionTypes.GET_ROUTES_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
            };
        case actionTypes.GET_ROUTE_PARENTS_SUCCESS:
            value = action.value || {};
            parents = value.data || [];
            return {
                ...state,
                parents: parents
            };
        case actionTypes.GET_ROUTE_PARENTS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_CURRENT_ROUTE:
            current = state.current || {
                actions: []
            };
            validate = state.validate || {};
            actions = current.actions || [];
            actionList = state.actions || [];
            name = action.name;
            value = action.value;
            error = action.error;
            validate[name] = error;
            if (name === 'actions') {
                // neu ton tai va !checked => unchecked
                if (actions.indexOf(value.value) > -1 && !value.checked) {
                    _.remove(actions, a => {
                        return a === value.value;
                    });
                    if (actions.length === 1 && actions.indexOf('view') > -1) {
                        current.viewReadOnly = false;
                    }
                } else if (actions.indexOf(value.value) === -1 && value.checked) {
                    // check bat ky role nao khac view => check view va view readonly
                    if (actions.indexOf('view') === -1 && value.value !== 'view') {
                        actions.push('view');
                    }
                    current.viewReadOnly = true;
                    actions.push(value.value);
                }
                if (actions.length < actionList.length) {
                    current.indeterminate = true;
                } else if (actions.length === actionList.length) {
                    current.indeterminate = false;
                }
                current.actions = actions;
            } else {
                if (_.isObject(value)) {
                    current = {
                        ...current,
                        ...value
                    }
                } else {
                    current[name] = value;
                }
            }
            return {
                ...state,
                current: {
                    ...current,
                },
                validate: {
                    ...validate,
                }
            };
        case actionTypes.VALIDATE_ROUTE:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_ROUTE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_ROUTE_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    routeId: value.data.routeId
                },
                loading: 2
            };
        case actionTypes.INSERT_ROUTE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.MODAL_ROUTE:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_DELETE_ROUTE:
            return {
                ...state,
                current: action.value,
                open: true,
                action: 'delete'
            };
        case actionTypes.HANDLE_UPDATE_ROUTE:
            return {
                ...state,
                current: action.value,
                open: false,
                action: 'update'
            };
        case actionTypes.DELETE_ROUTE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_ROUTE_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {},
                loading: 2
            };
        case actionTypes.DELETE_ROUTE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.GET_ROUTES_BY_ID_SUCCESS:
            value = action.value;
            data = value.data;
            actions = state.actions || [];
            parents = state.parents || [];
            current = data[0] || {};
            current.actions = _.map(current._actions, a => a.actionKey);
            current.indeterminate = current.actions.length > 0 && current.actions.length < actions.length;
            const code = current.code;
            if (code.length === 3) {
                current.isParent = true;
            } else {
                const parentCode = code.slice(0, 3);
                const parent = _.find(parents, {code: parentCode});
                if (parent) current.parentId = parent.routeId;
                current.isParent = false;
            }
            return {
                ...state,
                current: current,
            };
        case actionTypes.GET_ROUTES_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_ROUTE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_ROUTE_SUCCESS:
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
        case actionTypes.UPDATE_ROUTE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_ROUTE:
            return {
                ...state,
                search: {
                    str: action.value
                },
                searchLoading: true
            };
        case actionTypes.ON_PAGE_CHANGE_ROUTES:
            value = action.value;
            pagination = state.pagination || {};
            return {
                ...state,
                pagination: {
                    ...pagination,
                    currentPage: value
                }
            };
        case actionTypes.GET_ALL_ACTION_ROUTE_SUCCESS:
            value = action.value || {};
            // actions = value.data ||[];
            return {
                ...state,
                actions: value.data || []
            };
        case actionTypes.GET_ALL_ACTION_ROUTE_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.CHECK_ALL_ACTION_ROUTE:
            value = action.value;
            current = state.current || {};
            actions = current.actions || [];
            if (value) {
                const _actions = state.actions;
                actions = _.map(_actions, a => {
                    return a.actionKey
                });

            } else {
                actions = [];
            }
            current.indeterminate = false;
            current.actions = actions;
            return {
                ...state,
                current
            };
        default:
            return state;
    }
};
