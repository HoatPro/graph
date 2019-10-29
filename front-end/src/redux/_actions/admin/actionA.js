import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {toast} from 'react-toastify';
import {alertA} from "../alertA";

export const actionA = {
    getActions,
    insertAction,
    validate,
    updateCurrent,
    updateAction,
    deleteAction,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getActionById,
    handleSearch,
    onPageChange,
};

function getActions(params) {
    return dispatch => {
        axios.get({
            url: api.get_actions,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    // dispatch(paginationActions.pagination(data.pagination));
                    toast.success(data.message);
                    dispatch(success(data));
                } else {
                    toast.error(data.message);
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });

        function success(value) {
            return {type: actionTypes.GET_ACTIONS_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_ACTIONS_FAILURE, error}
        }
    }
}

function insertAction(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_action,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    toast.success(data.message);
                    dispatch(success(data));
                } else {
                    toast.error(data.message);
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });
    };

    function request() {
        return {type: actionTypes.INSERT_ACTION_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.INSERT_ACTION_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.INSERT_ACTION_FAILURE, error}
    }
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_ACTION, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_ACTION, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_ACTION, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_ACTION, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_ACTION, value}
}

function deleteAction(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_action,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    toast.success(data.message);
                    dispatch(success(data));
                } else {
                    toast.error(data.message);
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });

    };

    function request() {
        return {type: actionTypes.DELETE_ACTION_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.DELETE_ACTION_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.DELETE_ACTION_FAILURE, error}
    }
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_ACTION, value}
}

function getActionById(params) {
    return dispatch => {
        axios.get({
            url: api.get_action_by_id,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    // dispatch(paginationActions.pagination(data.pagination));
                    dispatch(success(data));
                } else {
                    toast.error(data.message);
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });

        function success(value) {
            return {type: actionTypes.GET_ACTIONS_BY_ID_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_ACTIONS_BY_ID_FAILURE, error}
        }
    }
}

function updateAction(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_action,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    toast.success(data.message);
                    dispatch(success(data));
                } else {
                    toast.error(data.message);
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });

        function request() {
            return {type: actionTypes.UPDATE_ACTION_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_ACTION_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.UPDATE_ACTION_FAILURE, error}
        }
    }
}

function handleSearch(value) {
    return {type: actionTypes.SEARCH_ACTION, value};
}

function onPageChange(value) {
    return {type: actionTypes.ON_PAGE_CHANGE_ACTIONS, value};
}