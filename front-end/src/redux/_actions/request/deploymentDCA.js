import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {toast} from 'react-toastify';

export const deploymentDCA = {
    getDeploymentDevice,
    feedBackDeployment,
    handleSearch,
    updateCurrent,
};

function getDeploymentDevice(params) {
    return dispatch => {
        return new Promise(resolve => {
            axios.get({
                url: api.get_deployment_device,
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
                resolve();
            });
        });

        function success(value) {
            return {type: actionTypes.GET_DEPLOYMENT_DEVICE_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_DEPLOYMENT_DEVICE_FAILURE, error}
        }
    }
}

function feedBackDeployment(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.feedback_deployment,
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
        return {type: actionTypes.FEEDBACK_DEPLOYMENT_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.FEEDBACK_DEPLOYMENT_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.FEEDBACK_DEPLOYMENT_FAILURE, error}
    }
}

function handleSearch(name,value) {
    return {type: actionTypes.SEARCH_DEPLOYMENT, name, value};
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_DEPLOYMENT, name, value, error}
}