import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {toast} from 'react-toastify';
import _ from 'lodash';
import {loadingA} from "../loadingA";

export const permissionA = {
    getOthers,
    handleUpdate,
    handleCancel,
    handleSave,
    updateCurrent,
    getPermission,
    test
};

function getOthers() {
    return dispatch => {
        dispatch(loadingA.start());
        const groups = new Promise(resolve => {
            axios.get({
                url: api.get_all_group,
            }, resp => {
                let result = [];
                if (resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });

        const actions = new Promise(resolve => {
            axios.get({
                url: api.get_all_action,
            }, resp => {
                let result = [];
                if (resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        })

        const routes = new Promise(resolve => {
            axios.get({
                url: api.get_all_route_action,
            }, resp => {
                let result = [];
                if (resp.status === 200) {
                    const data = resp.data;
                    const newData = Object.values(data.data);
                    let arrayTest = [];
                    for (let data of newData) {
                        arrayTest.push(data);
                    }
                    let codeT = [];
                    let codeR = [];
                    arrayTest.map((data, i) => {
                        if (data.code.length === 3) {
                            codeT.push(data);
                        } else {
                            codeR.push(data)
                        }
                    });
                    codeT.map((r, i) => {
                        let code = r.code;
                        let parent = {};
                        parent = _.find(result, {code: code});
                        if (parent) {
                            parent = {
                                key: i,
                                ...parent,
                                ...r
                            }
                        } else {
                            parent = {
                                ...r,
                                children: []
                            };

                        }
                        result.push(parent);
                    });
                    codeR.map((r, i) => {
                        let code = r.code;
                        let parent = {};
                        const slice = code.slice(0, 3);
                        parent = _.find(result, {code: slice});
                        if (parent) {
                            _.forEach(r._actions, a => {
                                const index = _.findIndex(parent._actions, {actionId: a.actionId});
                                if (index === -1) {
                                    parent._actions.push(a);
                                }
                            });
                            parent.children.push(r);
                        } else {
                            parent = {
                                code: slice,
                                children: [
                                    ...r
                                ]
                            };
                            result.push(parent);
                        }
                    })
                }
                resolve(result);
            });
        })

        Promise.all([groups, actions, routes]).then(resp => {

            const data = {
                groups: resp[0],
                actions: resp[1],
                routes: resp[2],
            };
            dispatch(loadingA.stop());
            const first = data.groups[0];
            dispatch(permissionA.updateCurrent('groupId', first.groupId));
            dispatch(permissionA.getPermission({groupId: first.groupId}));
            dispatch(success(data));
        }).catch(error => {
            const data = {
                groups: [],
                actions: [],
                routes: [],
            };
            dispatch(loadingA.stop());
            dispatch(success(data));
        });

        function success(value) {
            return {type: actionTypes.GET_PERMISSION_OTHER, value}
        }
    }
}

function handleUpdate(value) {
    return {type: actionTypes.HANDLE_UPDATE_PERMISSION, value}
}

function handleCancel(value) {
    return {type: actionTypes.HANDLE_CANCEL_PERMISSION, value}
}

function handleSave(params) {
    return dispatch => {
        dispatch(loadingA.start());
        axios.post({
            url: api.update_permission,
            params: params,
        }, resp => {
            dispatch(loadingA.stop());
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    toast.success(data.message);
                    dispatch(success(data));
                    dispatch(getPermission(params.groupId));
                } else {
                    toast.error(data.message);
                }
            } else {
                toast.error(resp.message);
            }
        });

    };

    function success(value) {
        return {type: actionTypes.HANDLE_SAVE_PERMISSION_SUCCESS, value}
    }
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_PERMISSION, name, value, error}
}

function getPermission(params) {
    return dispatch => {
        axios.get({
            url: api.get_permission,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    // toast.success(data.message);
                    dispatch(success(data.data));
                } else {
                    toast.error(data.message);
                }
            } else {
                toast.error(resp.message);
            }
        });

    };

    function success(value) {
        return {type: actionTypes.HANDLE_GET_PERMISSION_SUCCESS, value}
    }
}


function test(params) {
    return dispatch => {
        axios.get({
            url: api.get_test,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    // toast.success(data.message);
                    dispatch(success(data.data));
                } else {
                    toast.error(data.message);
                }
            } else {
                toast.error(resp.message);
            }
        });

    };

    function success(value) {
        return {type: actionTypes.GET_TEST_SUCCESS, value}
    }
}