import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {toast} from 'react-toastify';

export const regionA = {
    getRegions,
    insertRegion,
    validate,
    updateCurrent,
    updateRegion,
    deleteRegion,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getRegionById,
    handleSearch,
    onPageChange,
    getOthers
};

function getRegions(params) {
    return dispatch => {
        axios.get({
            url: api.get_regions,
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
            return {type: actionTypes.GET_REGIONS_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_REGIONS_FAILURE, error}
        }
    }
}

function insertRegion(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_region,
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
        return {type: actionTypes.INSERT_REGION_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.INSERT_REGION_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.INSERT_REGION_FAILURE, error}
    }
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_REGION, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_REGION, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_REGION, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_REGION, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_REGION, value}
}

function deleteRegion(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_region,
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
        return {type: actionTypes.DELETE_REGION_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.DELETE_REGION_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.DELETE_REGION_FAILURE, error}
    }
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_REGION, value};
}

function getRegionById(params) {
    return dispatch => {
        axios.get({
            url: api.get_region_by_id,
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
            return {type: actionTypes.GET_REGIONS_BY_ID_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_REGIONS_BY_ID_FAILURE, error}
        }
    }
}

function updateRegion(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_region,
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
            return {type: actionTypes.UPDATE_REGION_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_REGION_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.UPDATE_REGION_FAILURE, error}
        }
    }
}

function handleSearch(value) {
    return {type: actionTypes.SEARCH_REGION, value};
}

function onPageChange(value) {
    return {type: actionTypes.ON_PAGE_CHANGE_REGIONS, value};
}

function getOthers(params) {
    return dispatch => {
        let promises = [];
        const departments = new Promise(resolve => {
            axios.get({
                url: api.get_all_department,
            }, resp => {
                let result = [];
                if (resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(departments);

        Promise.all(promises).then(resp => {
            const data = {
                departments: resp[0],
            };
            dispatch(success(data));
        }).catch(error => {
            dispatch(failure(error.toString()));
        });

    };

    function success(value) {
        return {type: actionTypes.GET_REGION_OTHER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.GET_REGION_OTHER_FAILURE, error}
    }
}