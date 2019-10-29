import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {toast} from 'react-toastify';

export const locationA = {
    getLocations,
    insertLocation,
    validate,
    updateCurrent,
    updateLocation,
    deleteLocation,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getLocationById,
    handleSearch,
    onPageChange
};

function getLocations(params) {
    return dispatch => {
        axios.get({
            url: api.get_locations,
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
            return {type: actionTypes.GET_LOCATIONS_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_LOCATIONS_FAILURE, error}
        }
    }
}

function insertLocation(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_location,
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
        return {type: actionTypes.INSERT_LOCATION_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.INSERT_LOCATION_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.INSERT_LOCATION_FAILURE, error}
    }
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_LOCATION, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_LOCATION, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_LOCATION, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_LOCATION, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_LOCATION, value}
}

function deleteLocation(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_location,
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
        return {type: actionTypes.DELETE_LOCATION_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.DELETE_LOCATION_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.DELETE_LOCATION_FAILURE, error}
    }
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_LOCATION, value};
}

function getLocationById(params) {
    return dispatch => {
        axios.get({
            url: api.get_location_by_id,
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
            return {type: actionTypes.GET_LOCATIONS_BY_ID_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_LOCATIONS_BY_ID_FAILURE, error}
        }
    }
}

function updateLocation(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_location,
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
            return {type: actionTypes.UPDATE_LOCATION_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_LOCATION_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.UPDATE_LOCATION_FAILURE, error}
        }
    }
}

function handleSearch(value) {
    return {type: actionTypes.SEARCH_LOCATION, value};
}

function onPageChange(value) {
    return {type: actionTypes.ON_PAGE_CHANGE_LOCATIONS, value};
}