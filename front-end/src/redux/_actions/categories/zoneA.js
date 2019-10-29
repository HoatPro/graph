import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {toast} from 'react-toastify';

export const zoneA = {
    getZones,
    insertZone,
    validate,
    updateCurrent,
    updateZone,
    deleteZone,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getZoneById,
    handleSearch,
    onPageChange,
    getOthers,
    onChangeLocation,
    onChangeDatCenter,
    onChangeRoom,
    handleViewImage,
    handleCloseViewImage,
};

function getZones(params) {
    return dispatch => {
        axios.get({
            url: api.get_zones,
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
            return {type: actionTypes.GET_ZONES_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_ZONES_FAILURE, error}
        }
    }
}

function insertZone(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_zone,
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
        return {type: actionTypes.INSERT_ZONE_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.INSERT_ZONE_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.INSERT_ZONE_FAILURE, error}
    }
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_ZONE, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_ZONE, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_ZONE, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_ZONE, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_ZONE, value}
}

function deleteZone(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_zone,
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
        return {type: actionTypes.DELETE_ZONE_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.DELETE_ZONE_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.DELETE_ZONE_FAILURE, error}
    }
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_ZONE, value};
}

function getZoneById(params, cb) {
    return dispatch => {
        function success(value) {
            return {type: actionTypes.GET_ZONES_BY_ID_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_ZONES_BY_ID_FAILURE, error}
        }

        return new Promise(resolve => {
            axios.get({
                url: api.get_zone_by_id,
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
                resolve();
            });
        })


    }
}

function updateZone(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_zone,
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
            return {type: actionTypes.UPDATE_ZONE_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_ZONE_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.UPDATE_ZONE_FAILURE, error}
        }
    }
}

function handleSearch(name, value) {
    return {type: actionTypes.SEARCH_ZONE, name, value};
}

function onPageChange(value) {
    return {type: actionTypes.ON_PAGE_CHANGE_ZONES, value};
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

        const rooms = new Promise(resolve => {
            axios.get({
                url: api.get_all_room,
            }, resp => {
                let result = [];
                if (resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(rooms);

        Promise.all(promises).then(resp => {
            const data = {
                locations: resp[0],
                dataCenters: resp[1],
                rooms: resp[2]
            };
            dispatch(success(data));
        }).catch(error => {
            dispatch(failure(error.toString()));
        });

    };

    function success(value) {
        return {type: actionTypes.GET_ZONE_OTHER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.GET_ZONE_OTHER_FAILURE, error}
    }
}

function onChangeLocation(value) {
    return {type: actionTypes.ONCHANGE_LOCATION_ZONE, value}
}

function onChangeDatCenter(value) {
    return {type: actionTypes.ONCHANGE_DATACENTER_ZONE, value}
}

function onChangeRoom(value) {
    return {type: actionTypes.ONCHANGE_ROOM_ZONE, value}
}

function handleViewImage(value) {
    return {type: actionTypes.HANDLE_VIEW_IMAGE_ZONE, value}
}

function handleCloseViewImage(value) {
    return {type: actionTypes.HANDLE_CLOSE_VIEW_IMAGE_ZONE, value}
}