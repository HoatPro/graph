import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {toast} from 'react-toastify';

export const datacenterA = {
    getDatacenters,
    insertDatacenter,
    validate,
    updateCurrent,
    updateDatacenter,
    deleteDatacenter,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getDatacenterById,
    handleSearch,
    handleStopSearch,
    onPageChange,
    getOthers
};

function getDatacenters(params) {
    return dispatch => {
        axios.get({
            url: api.get_datacenters,
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
            return {type: actionTypes.GET_DATACENTERS_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_DATACENTERS_FAILURE, error}
        }
    }
}

function insertDatacenter(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_datacenter,
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
        return {type: actionTypes.INSERT_DATACENTER_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.INSERT_DATACENTER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.INSERT_DATACENTER_FAILURE, error}
    }
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_DATACENTER, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_DATACENTER, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_DATACENTER, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_DATACENTER, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_DATACENTER, value}
}

function deleteDatacenter(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_datacenter,
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
        return {type: actionTypes.DELETE_DATACENTER_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.DELETE_DATACENTER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.DELETE_DATACENTER_FAILURE, error}
    }
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_DATACENTER, value};
}

function getDatacenterById(params) {
    return dispatch => {
        axios.get({
            url: api.get_datacenter_by_id,
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
            return {type: actionTypes.GET_DATACENTERS_BY_ID_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_DATACENTERS_BY_ID_FAILURE, error}
        }
    }
}

function updateDatacenter(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_datacenter,
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
            return {type: actionTypes.UPDATE_DATACENTER_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_DATACENTER_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.UPDATE_DATACENTER_FAILURE, error}
        }
    }
}

function handleSearch(name, value) {
    return {type: actionTypes.SEARCH_DATACENTER, name, value};
}

function handleStopSearch() {
    return {type: actionTypes.STOP_SEARCH_DATACENTER};
}


function onPageChange(value) {
    return {type: actionTypes.ON_PAGE_CHANGE_DATACENTERS, value};
}

function getOthers(params) {
    return dispatch => {
        let promises = [];
        const locations = new Promise(resolve => {
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
        promises.push(locations);

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
        return {type: actionTypes.GET_DATACENTER_OTHER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.GET_DATACENTER_OTHER_FAILURE, error}
    }
}