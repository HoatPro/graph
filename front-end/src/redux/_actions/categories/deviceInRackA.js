import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {loadingA} from '../loadingA';
import {toast} from 'react-toastify';
import _ from "lodash";

export const deviceInRackA = {
    getDeviceInRack,
    handleDeleteRow,
    handleSearch,
    modal,
    importDeviceToRack,
    updateCurrent,
    getOthers
};

function getDeviceInRack(params) {
    return dispatch => {
        dispatch(loadingA.start());
        return axios.get({
            url: api.get_device_in_rack,
            params: params,
        }, resp => {
            dispatch(loadingA.stop());
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    // dispatch(paginationActions.pagination(data.pagination));
                    toast.success(data.message)
                    dispatch(success(data));
                } else {
                    toast.error(data.message);
                }
            } else {
                dispatch(loadingA.stop());
                toast.error(resp.message);
            }
        });

        function success(value) {
            return {type: actionTypes.GET_DEVICE_IN_RACK_SUCCESS, value}
        }
    }
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_DEVICE_IN_RACK, value}
}

function handleSearch(name, value) {
    return {type: actionTypes.SEARCH_DEVICE_IN_RACK, name, value};
}

function modal(value) {
    return {type: actionTypes.MODAL_DEVICE_IN_RACK, value}
}

function importDeviceToRack(params) {
    return dispatch => {
        return axios.post({
            url: api.import_device_to_rack,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    toast.success(data.message);
                    dispatch(success(data));
                } else {
                    const message = data.message;
                    if (_.isArray(message)) {

                        dispatch(deviceInRackA.updateCurrent({openError: true, error: message}));
                        // toast.error(<div>{_.map(message, item => <div>{item}</div>)}</div>, {autoClose: false});
                    } else {
                        toast.error(message);
                    }
                }
            } else {
                toast.error(resp.message);
            }
        });
    };

    function success(value) {
        return {type: actionTypes.IMPORT_DEVICE_TO_RACK, value}
    }
}

function getOthers(params) {
    return dispatch => {
        let promises = [];
        const deviceTemplates = new Promise(resolve => {
            axios.get({
                url: api.get_all_device_template,
            }, resp => {
                let result = [];
                if (resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(deviceTemplates);

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
        const racks = new Promise(resolve => {
            axios.get({
                url: api.get_all_rack,
            }, resp => {
                let result = [];
                if (resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(racks);


        Promise.all(promises).then(resp => {
            const data = {
                deviceTemplates: resp[0],
                rooms: resp[1],
                zones: resp[2],
                racks: resp[3],
            };
            dispatch(success(data));
        }).catch(error => {
            dispatch(failure(error.toString()));
        });

    };

    function success(value) {
        return {type: actionTypes.GET_DEVICE_IN_RACK_OTHER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.GET_DEVICE_IN_RACK_OTHER_FAILURE, error}
    }
}


function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_DEVICE_IN_RACK, name, value, error}
}

