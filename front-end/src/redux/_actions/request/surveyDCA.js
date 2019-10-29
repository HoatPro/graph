import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {toast} from 'react-toastify';
import {loadingA} from './../loadingA';

export const surveyDCA = {
    getSurveyDevice,
    feedbackSurvey,
    handleSearch,
    updateCurrent,
    // updateSurveyDevice
};

function getSurveyDevice(params) {
    return dispatch => {
        return new Promise(resolve => {
            axios.get({
                url: api.get_survey_device,
                params: params,
            }, resp => {
                if (resp.status === 200) {
                    const data = resp.data;
                    if (data.status === 200) {
                        // dispatch(paginationActions.pagination(data.pagination));
                        toast.success(data.message)
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

        })

        function success(value) {
            return {type: actionTypes.GET_SURVEY_DEVICE_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_SURVEY_DEVICE_FAILURE, error}
        }
    }
}

function feedbackSurvey(params) {
    return dispatch => {
        dispatch(loadingA.start());
        dispatch(request({}));
        return new Promise(resolve => {
            axios.post({
                url: api.feedback_survey,
                params: params,
            }, resp => {
                dispatch(loadingA.stop());
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
                resolve();
            });
        })
    };

    function request() {
        return {type: actionTypes.FEEDBACK_SURVEY_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.FEEDBACK_SURVEY_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.FEEDBACK_SURVEY_FAILURE, error}
    }
}

function handleSearch(name, value) {
    return {type: actionTypes.SEARCH_SURVEY, name, value};
}


function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_SURVEY, name, value, error}
}
