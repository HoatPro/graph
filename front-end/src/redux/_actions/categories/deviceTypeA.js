import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {loadingA} from '../loadingA';
import {toast} from 'react-toastify';

export const deviceTypeA = {
    getDeviceTypes,
    insertDeviceType,
    validate,
    updateCurrent,
    updateDeviceType,
    deleteDeviceType,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getDeviceTypeById,
    handleSearch,
    onPageChange,
    importDeviceType,
};

function getDeviceTypes(params) {
    return dispatch => {
        axios.get({
            url: api.get_device_types,
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
            return {type: actionTypes.GET_DEVICE_TYPES_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_DEVICE_TYPES_FAILURE, error}
        }
    }
}

function insertDeviceType(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_device_type,
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
                dispatch(getDeviceTypes());
            } else {
                toast.error(resp.message);
                dispatch(failure(resp.message));
            }
        });
    };

    function request() {
        return {type: actionTypes.INSERT_DEVICE_TYPE_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.INSERT_DEVICE_TYPE_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.INSERT_DEVICE_TYPE_FAILURE, error}
    }
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_DEVICE_TYPE, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_DEVICE_TYPE, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_DEVICE_TYPE, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_DEVICE_TYPE, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_DEVICE_TYPE, value}
}

function deleteDeviceType(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_device_type,
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
        return {type: actionTypes.DELETE_DEVICE_TYPE_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.DELETE_DEVICE_TYPE_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.DELETE_DEVICE_TYPE_FAILURE, error}
    }
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_DEVICE_TYPE, value};
}

function getDeviceTypeById(params) {
    return dispatch => {
        axios.get({
            url: api.get_device_type_by_id,
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
            return {type: actionTypes.GET_DEVICE_TYPES_BY_ID_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_DEVICE_TYPES_BY_ID_FAILURE, error}
        }
    }
}

function updateDeviceType(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_device_type,
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
            return {type: actionTypes.UPDATE_DEVICE_TYPE_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_DEVICE_TYPE_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.UPDATE_DEVICE_TYPE_FAILURE, error}
        }
    }
}

function handleSearch(value) {
    return {type: actionTypes.SEARCH_DEVICE_TYPE, value};
}

function onPageChange(value) {
    return {type: actionTypes.ON_PAGE_CHANGE_DEVICE_TYPES, value};
}

function importDeviceType(params) {
    return dispatch => {
        axios.post({
            url: api.import_device_type,
            params: params,
        }, resp => {
            dispatch(loadingA.stop());

            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    toast.success(data.message);
                    dispatch(success(data));
                } else {
                    toast.error(data.message, {autoClose: false});
                    dispatch(failure(data.message));
                }
            } else {
                toast.error(resp.message);
                dispatch(failure(resp.message));
            }
        });
    };

    function success(value) {
        return {type: actionTypes.IMPORT_DEVICE_TYPE_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.IMPORT_DEVICE_TYPE_FAILURE, error}
    }
}