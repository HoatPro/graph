import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {toast} from 'react-toastify';

export const departmentA = {
    getDepartments,
    insertDepartment,
    validate,
    updateCurrent,
    updateDepartment,
    deleteDepartment,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getDepartmentById,
    handleSearch,
    onPageChange,
    getOthers
};

function getDepartments(params) {
    return dispatch => {
        axios.get({
            url: api.get_departments,
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
                toast.error(resp.message);
                dispatch(failure(resp.message));
            }
        });

        function success(value) {
            return {type: actionTypes.GET_DEPARTMENTS_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_DEPARTMENTS_FAILURE, error}
        }
    }
}

function insertDepartment(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_department,
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
        return {type: actionTypes.INSERT_DEPARTMENT_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.INSERT_DEPARTMENT_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.INSERT_DEPARTMENT_FAILURE, error}
    }
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_DEPARTMENT, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_DEPARTMENT, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_DEPARTMENT, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_DEPARTMENT, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_DEPARTMENT, value}
}

function deleteDepartment(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_department,
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
        return {type: actionTypes.DELETE_DEPARTMENT_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.DELETE_DEPARTMENT_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.DELETE_DEPARTMENT_FAILURE, error}
    }
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_DEPARTMENT, value};
}

function getDepartmentById(params) {
    return dispatch => {
        axios.get({
            url: api.get_department_by_id,
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
                dispatch(failure(resp.message));
            }
        });

        function success(value) {
            return {type: actionTypes.GET_DEPARTMENTS_BY_ID_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_DEPARTMENTS_BY_ID_FAILURE, error}
        }
    }
}

function updateDepartment(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_department,
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
            return {type: actionTypes.UPDATE_DEPARTMENT_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_DEPARTMENT_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.UPDATE_DEPARTMENT_FAILURE, error}
        }
    }
}

function handleSearch(value) {
    return {type: actionTypes.SEARCH_DEPARTMENT, value};
}

function onPageChange(value) {
    return {type: actionTypes.ON_PAGE_CHANGE_DEPARTMENTS, value};
}

function getOthers(params) {
    return dispatch => {
        let promises = [];
        const roles = new Promise(resolve => {
            axios.get({
                url: api.get_all_location,
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
                locations: resp[0],
            };
            dispatch(success(data));
        }).catch(error => {
            dispatch(failure(error.toString()));
        });

    };

    function success(value) {
        return {type: actionTypes.GET_DEPARTMENT_OTHER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.GET_DEPARTMENT_OTHER_FAILURE, error}
    }
}