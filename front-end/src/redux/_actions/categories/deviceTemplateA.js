import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {alertA} from '../alertA';
import {toast} from 'react-toastify';
import {loadingA} from "../loadingA";

export const deviceTemplateA = {
    getDeviceTemplates,
    insertDeviceTemplate,
    validate,
    updateCurrent,
    updateDeviceTemplate,
    deleteDeviceTemplate,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getDeviceTemplateById,
    handleSearch,
    onPageChange,
    getOthers,
    getDeviceTypes,
    importDeviceTemplate,
};

function getDeviceTemplates(params) {
    return dispatch => {
        axios.get({
            url: api.get_device_templates,
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
            return {type: actionTypes.GET_DEVICE_TEMPLATES_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_DEVICE_TEMPLATES_FAILURE, error}
        }
    }
}

function getDeviceTypes() {
    return dispatch => {
        axios.get({
            url: api.get_all_device_type,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    // dispatch(paginationActions.pagination(data.pagination));
                    dispatch(success(data));
                } else {
                    // toast.error(data.message);
                    dispatch(failure(data.message));
                }
            } else {
                // toast.error(resp.message);
                dispatch(failure(resp.message));
            }
        });

        function success(value) {
            return {type: actionTypes.GET_DEVICE_TYPE_DEVICE_TEMPLATES_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_DEVICE_TYPE_DEVICE_TEMPLATES_FAILURE, error}
        }
    }
}

function insertDeviceTemplate(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_device_template,
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
        return {type: actionTypes.INSERT_DEVICE_TEMPLATE_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.INSERT_DEVICE_TEMPLATE_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.INSERT_DEVICE_TEMPLATE_FAILURE, error}
    }
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_DEVICE_TEMPLATE, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_DEVICE_TEMPLATE, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_DEVICE_TEMPLATE, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_DEVICE_TEMPLATE, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_DEVICE_TEMPLATE, value}
}

function deleteDeviceTemplate(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_device_template,
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
        return {type: actionTypes.DELETE_DEVICE_TEMPLATE_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.DELETE_DEVICE_TEMPLATE_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.DELETE_DEVICE_TEMPLATE_FAILURE, error}
    }
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_DEVICE_TEMPLATE, value};
}

function getDeviceTemplateById(params) {
    return dispatch => {
        axios.get({
            url: api.get_device_template_by_id,
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
            return {type: actionTypes.GET_DEVICE_TEMPLATES_BY_ID_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_DEVICE_TEMPLATES_BY_ID_FAILURE, error}
        }
    }
}

function updateDeviceTemplate(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_device_template,
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
            return {type: actionTypes.UPDATE_DEVICE_TEMPLATE_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_DEVICE_TEMPLATE_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.UPDATE_DEVICE_TEMPLATE_FAILURE, error}
        }
    }
}

function handleSearch(name, value) {
    return {type: actionTypes.SEARCH_DEVICE_TEMPLATE, name, value};
}

function onPageChange(value) {
    return {type: actionTypes.ON_PAGE_CHANGE_DEVICE_TEMPLATES, value};
}

function getOthers(params) {
    return dispatch => {
        let promises = [];
        const types = new Promise(resolve => {
            axios.get({
                url: api.get_all_device_type,
            }, resp => {
                let result = [];
                if (resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(types);

        Promise.all(promises).then(resp => {
            const data = {
                deviceTypes: resp[0],
            };
            dispatch(success(data));
        }).catch(error => {
            dispatch(failure(error.toString()));
        });

    };

    function success(value) {
        return {type: actionTypes.GET_DEVICE_TEMPLATE_OTHER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.GET_DEVICE_TEMPLATE_OTHER_FAILURE, error}
    }
}


function importDeviceTemplate(params) {
    return dispatch => {
        axios.post({
            url: api.import_device_template,
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
                dispatch(getDeviceTemplates());

            } else {
                toast.error(resp.message);
                dispatch(failure(resp.message));
            }
        });
    };

    function success(value) {
        return {type: actionTypes.IMPORT_DEVICE_TEMPLATE_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.IMPORT_DEVICE_TEMPLATE_FAILURE, error}
    }
}