import actionTypes from '../_constants/actionTypes';
import axios from './axios_base';
import api from './api';
import {loadingA} from './loadingA';
import {toast} from 'react-toastify';

export const layoutA = {
    getLayouts,
    insertRackLayout,
    validate,
    updateCurrent,
    deleteCurrent,
    updateRackLayout,
    deleteRackLayout,
    modal,
    handleDeleteRack,
    handleUpdateRow,
    initUpdate,
    getLayoutById,
    handleSearch,
    onPageChange,
    getOthers,
    onChangeLocation,
    onChangeDatCenter,
    onChangeRoom,
    getRackByZone,
    getRackByZones,
    getRackByRoom,
    getRackById,
    updateLoading,
    updateDraw,
};

function getLayouts(params) {
    return dispatch => {
        axios.get({
            url: api.get_layouts,
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
                toast.error(resp.message);
                dispatch(failure(resp.message));
            }
        });

        function success(value) {
            return {type: actionTypes.GET_LAYOUTS_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_LAYOUTS_FAILURE, error}
        }
    }
}

function insertRackLayout(params) {
    return dispatch => {
        dispatch(loadingA.start());
        dispatch(request({}));
        return new Promise(resolve => {
            axios.post({
                url: api.insert_rack,
                params: params,
            }, resp => {

                if (resp.status === 200) {
                    const data = resp.data;
                    if (data.status === 200) {
                        toast.success(data.message);
                        // dispatch(alertA.success(data.message));
                        dispatch(success(data));
                    } else {
                        toast.error(data.message);
                        // dispatch(dispatch(alertA.error(data.message)));
                        // dispatch(failure(data.message));
                    }
                } else {
                    toast.error(resp.message);
                    // dispatch(alertA.error(resp.message));
                    // dispatch(failure(resp.message));
                }
                dispatch(loadingA.stop());
                resolve();
            });
        })
    };

    function request() {
        return {type: actionTypes.INSERT_RACK_LAYOUT_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.INSERT_RACK_LAYOUT_SUCCESS, value}
    }

    // function failure(error) {return {type: actionTypes.INSERT_RACK_LAYOUT_FAILURE, error}}
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_LAYOUT, name, value, error}
}

function deleteCurrent( name,value) {
    return {type: actionTypes.DELETE_CURRENT_LAYOUT, name, value}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_LAYOUT, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_LAYOUT, value}
}

function handleDeleteRack(value) {
    return {type: actionTypes.HANDLE_DELETE_RACK_LAYOUT, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_LAYOUT, value}
}

function deleteRackLayout(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_rack,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    toast.success(data.message);
                    // dispatch(alertA.success(data.message));
                    dispatch(success(data));
                } else {
                    toast.error(data.message);
                    // dispatch(dispatch(alertA.error(data.message)));
                    dispatch(failure(data.message));
                }
            } else {
                toast.error(resp.message);
                // dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });

    };

    function request() {
        return {type: actionTypes.DELETE_RACK_LAYOUT_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.DELETE_RACK_LAYOUT_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.DELETE_RACK_LAYOUT_FAILURE, error}
    }
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_LAYOUT, value};
}

function getLayoutById(params) {
    return dispatch => {
        axios.get({
            url: api.get_layout_by_id,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    // dispatch(paginationActions.pagination(data.pagination));
                    dispatch(success(data));
                } else {
                    toast.error(data.message);
                    // dispatch(dispatch(alertA.error(data.message)));
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(failure(resp.message));
            }
        });

        function success(value) {
            return {type: actionTypes.GET_LAYOUTS_BY_ID_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_LAYOUTS_BY_ID_FAILURE, error}
        }
    }
}

function updateRackLayout(params) {
    return dispatch => {
        dispatch(loadingA.start());
        dispatch(request({}));
        return new Promise(resolve => {
            axios.put({
                url: api.update_rack,
                params: params,
            }, resp => {
                dispatch(loadingA.stop());
                if (resp.status === 200) {
                    const data = resp.data;
                    if (data.status === 200) {
                        toast.success(data.message);
                        // dispatch(alertA.success(data.message));
                        dispatch(success(data));
                    } else {
                        toast.error(data.message);
                        // dispatch(dispatch(alertA.error(data.message)));
                        // dispatch(failure(data.message));
                    }
                } else {
                    toast.error(resp.message);
                    // dispatch(alertA.error(resp.message));
                    // dispatch(failure(resp.message));
                }
                resolve();
            });
        });

        function request() {
            return {type: actionTypes.UPDATE_RACK_LAYOUT_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_RACK_LAYOUT_SUCCESS, value}
        }

        // function failure(error) { return {type: actionTypes.UPDATE_RACK_LAYOUT_FAILURE, error} }
    }
}

function handleSearch(value) {
    return {type: actionTypes.SEARCH_LAYOUT, value};
}

function onPageChange(value) {
    return {type: actionTypes.ON_PAGE_CHANGE_LAYOUTS, value};
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

        const zones = new Promise(resolve => {
            axios.get({
                url: api.get_all_zone,
            }, resp => {
                let result = [];
                if (resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(zones);

        return Promise.all(promises).then(resp => {
            const data = {
                locations: resp[0],
                dataCenters: resp[1],
                rooms: resp[2],
                zones: resp[3]
            };
            dispatch(success(data));
        }).catch(error => {
            toast.error(JSON.stringify(error));
            dispatch(failure(error.toString()));
        });

    };

    function success(value) {
        return {type: actionTypes.GET_LAYOUT_OTHER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.GET_LAYOUT_OTHER_FAILURE, error}
    }
}

function onChangeLocation(value) {
    return {type: actionTypes.ONCHANGE_LOCATION_LAYOUT, value}
}

function onChangeDatCenter(value) {
    return {type: actionTypes.ONCHANGE_DATACENTER_LAYOUT, value}
}

function onChangeRoom(value) {
    return {type: actionTypes.ONCHANGE_ROOM_LAYOUT, value}
}

function getRackByZone(params) {
    return dispatch => {
        dispatch(request({}));
        return new Promise(resolve => {
            axios.get({
                url: api.get_rack_by_zone,
                params: params,
            }, resp => {
                if (resp.status === 200) {
                    const data = resp.data;
                    if (data.status === 200) {
                        dispatch(success(data));
                    } else {
                        toast.error(data.message);
                        // dispatch(dispatch(alertA.error(data.message)));
                        dispatch(failure(data.message));
                    }
                } else {
                    toast.error(resp.message);
                    // dispatch(alertA.error(resp.message));
                    dispatch(failure(resp.message));
                }
                resolve();
            });
        });

        function request() {
            return {type: actionTypes.GET_RACKS_BY_ZONE_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.GET_RACKS_BY_ZONE_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_RACKS_BY_ZONE_FAILURE, error}
        }
    }
}

function getRackByZones(params) {
    return dispatch => {
        dispatch(request({}));
        return axios.get({
            url: api.get_rack_by_zones,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    dispatch(success(data));
                } else {
                    toast.error(data.message);
                    // dispatch(dispatch(alertA.error(data.message)));
                    dispatch(failure(data.message));
                }
            } else {
                toast.error(resp.message);
                // dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });

        function request() {
            return {type: actionTypes.GET_RACKS_BY_ZONES_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.GET_RACKS_BY_ZONES_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_RACKS_BY_ZONES_FAILURE, error}
        }
    }
}

function getRackById(params) {
    return dispatch => {
        axios.get({
            url: api.get_rack_by_id,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    // dispatch(paginationActions.pagination(data.pagination));
                    dispatch(success(data));
                } else {
                    toast.error(data.message);
                    // dispatch(dispatch(alertA.error(data.message)));
                    dispatch(failure(data.message));
                }
            } else {
                toast.error(resp.message);
                dispatch(failure(resp.message));
            }
        });

        function success(value) {
            return {type: actionTypes.GET_RACK_BY_ID2_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_RACK_BY_ID2_FAILURE, error}
        }
    }
}

function updateLoading(value) {
    return {type: actionTypes.UPDATE_LOADING_LAYOUT, value}
}

function getRackByRoom(params) {
    return dispatch => {
        dispatch(request({}));
        return new Promise(resolve => {
            axios.get({
                url: api.get_rack_by_room,
                params: params,
            }, resp => {
                if (resp.status === 200) {
                    const data = resp.data;
                    if (data.status === 200) {
                        dispatch(success(data));
                    } else {
                        toast.error(data.message);
                        // dispatch(dispatch(alertA.error(data.message)));
                        dispatch(failure(data.message));
                    }
                } else {
                    toast.error(resp.message);
                    // dispatch(alertA.error(resp.message));
                    dispatch(failure(resp.message));
                }
                resolve();
            });
        });


        function request() {
            return {type: actionTypes.GET_RACKS_BY_ROOM_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.GET_RACKS_BY_ROOM_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_RACKS_BY_ROOM_FAILURE, error}
        }
    }
}

function updateDraw(params) {
    return dispatch => {
        dispatch(loadingA.start());
        axios.post({
            url: api.update_draw_rack,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    toast.success(data.message);
                    dispatch(success(data));
                } else {
                    toast.error(data.message);
                }
            } else {
                toast.error(resp.message);
            }
            dispatch(loadingA.stop());
        });
    };

    function success(value) {
        return {type: actionTypes.UPDATE_DRAW_RACK_LAYOUT_SUCCESS, value}
    }
}