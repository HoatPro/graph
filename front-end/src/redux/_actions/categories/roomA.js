import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {toast} from 'react-toastify';

export const roomA = {
    getRooms,
    insertRoom,
    validate,
    updateCurrent,
    updateRoom,
    deleteRoom,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getRoomById,
    handleSearch,
    onPageChange,
    getOthers,
    onChangeLocation,
};

function getRooms(params) {
    return dispatch => {
        axios.get({
            url: api.get_rooms,
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
            return {type: actionTypes.GET_ROOMS_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_ROOMS_FAILURE, error}
        }
    }
}

function insertRoom(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_room,
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
        return {type: actionTypes.INSERT_ROOM_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.INSERT_ROOM_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.INSERT_ROOM_FAILURE, error}
    }
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_ROOM, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_ROOM, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_ROOM, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_ROOM, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_ROOM, value}
}

function deleteRoom(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_room,
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
        return {type: actionTypes.DELETE_ROOM_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.DELETE_ROOM_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.DELETE_ROOM_FAILURE, error}
    }
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_ROOM, value};
}

function getRoomById(params) {
    return dispatch => {
        axios.get({
            url: api.get_room_by_id,
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
            return {type: actionTypes.GET_ROOMS_BY_ID_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_ROOMS_BY_ID_FAILURE, error}
        }
    }
}

function updateRoom(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_room,
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
            return {type: actionTypes.UPDATE_ROOM_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_ROOM_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.UPDATE_ROOM_FAILURE, error}
        }
    }
}

function handleSearch(name, value) {
    return {type: actionTypes.SEARCH_ROOM, name, value};
}

function onPageChange(value) {
    return {type: actionTypes.ON_PAGE_CHANGE_ROOMS, value};
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

        const dataCenters = new Promise(resolve => {
            axios.get({
                url: api.get_all_datacenter,
            }, resp => {
                let result = [];
                if (resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(dataCenters);

        Promise.all(promises).then(resp => {
            const data = {
                locations: resp[0],
                dataCenters: resp[1],
            };
            dispatch(success(data));
        }).catch(error => {
            dispatch(failure(error.toString()));
        });

    };

    function success(value) {
        return {type: actionTypes.GET_ROOM_OTHER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.GET_ROOM_OTHER_FAILURE, error}
    }
}

function onChangeLocation(value) {
    return {type: actionTypes.ONCHANGE_LOCATION_ROOM, value}
}