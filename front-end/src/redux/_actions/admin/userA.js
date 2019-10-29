import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {toast} from 'react-toastify';

export const userA = {
    getUsers,
    insertUser,
    validate,
    updateCurrent,
    updateUser,
    deleteUser,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getUserById,
    handleSearch,
    onPageChange,
    getOthers,
    resetPassword
};

function getUsers(params) {
    return dispatch => {
        axios.get({
            url: api.get_users,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    toast.success(data.message);
                    dispatch(success(data));
                } else {
                    // toast.error(data.message);
                    dispatch(failure(data.message));
                }
            } else {
                toast.error(resp.message);
                dispatch(failure(resp.message));
            }
        });

        function success(value) {
            return {type: actionTypes.GET_USERS_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_USERS_FAILURE, error}
        }
    }
}

function getOthers(params) {
    return dispatch => {
        let promises = [];
        const roles = new Promise(resolve => {
            axios.get({
                url: api.get_groups,
            }, resp => {
                let result = [];
                if (resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(roles);

        Promise.all(promises).then(resp => {
            const data = {
                groups: resp[0],
                expanded: ['all']
            };
            dispatch(success(data));
        }).catch(error => {
            dispatch(failure(error.toString()));
        });

    };

    function success(value) {
        return {type: actionTypes.GET_USER_OTHER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.GET_USER_OTHER_FAILURE, error}
    }
}

function insertUser(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_user,
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
                toast.error(resp.message);
                dispatch(failure(resp.message));
            }
        });
    };

    function request() {
        return {type: actionTypes.INSERT_USER_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.INSERT_USER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.INSERT_USER_FAILURE, error}
    }
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_USER, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_USER, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_USER, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_USER, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_USER, value}
}

function deleteUser(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_user,
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
                toast.error(resp.message);
                dispatch(failure(resp.message));
            }
        });

    };

    function request() {
        return {type: actionTypes.DELETE_USER_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.DELETE_USER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.DELETE_USER_FAILURE, error}
    }
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_USER, value}
}

function getUserById(params) {
    return dispatch => {
        axios.get({
            url: api.get_user_by_id,
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
                toast.error(resp.message);
                dispatch(failure(resp.message));
            }
        });

        function success(value) {
            return {type: actionTypes.GET_USERS_BY_ID_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_USERS_BY_ID_FAILURE, error}
        }
    }
}

function updateUser(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_user,
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
                toast.error(resp.message);
                dispatch(failure(resp.message));
            }
        });

        function request() {
            return {type: actionTypes.UPDATE_USER_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_USER_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.UPDATE_USER_FAILURE, error}
        }
    }
}

function handleSearch(name, value) {
    return {type: actionTypes.SEARCH_USER, name, value};
}

function onPageChange(value) {
    return {type: actionTypes.ON_PAGE_CHANGE_USERS, value};
}

function resetPassword(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.reset_password,
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
                toast.error(resp.message);
                dispatch(failure(resp.message));
            }
        });

        function request() {
            return {type: actionTypes.UPDATE_USER_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_USER_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.UPDATE_USER_FAILURE, error}
        }
    }
}