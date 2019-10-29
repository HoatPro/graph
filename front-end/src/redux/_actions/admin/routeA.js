import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {toast} from 'react-toastify';
import _ from "lodash";

export const routeA = {
    getRoutes,
    getRouteParents,
    getAllRoutes,
    insertRoute,
    validate,
    updateCurrent,
    updateRoute,
    deleteRoute,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getRouteById,
    handleSearch,
    onPageChange,
    getAllAction,
    checkAll
};

function getAllRoutes(params){
    return dispatch => {
        axios.get({
            url: api.get_all_route_action,
            params: params,
        }, resp => {
            let results=[];
            if (resp.status === 200) {
                const data = resp.data;
                const newData=Object.values(data.data);
                let arrayTest=[];
                for(let data of newData){
                    arrayTest.push(data);
                }
                let codeT=[];
                let codeR=[];
                arrayTest.map((data,i)=>{
                    if(data.code.length===3){
                        codeT.push(data);
                    }else{
                        codeR.push(data);
                    }
                });
                codeT.map((r,i)=>{
                    let code=r.code;
                    let parent={};
                    parent=_.find(results,{code:code});
                    if(parent){
                        parent={
                            key:i,
                            ...parent,
                            ...r
                        }
                    }else{
                        parent={
                            ...r,
                            children:[]
                        }
                    }
                    results.push(parent)
                });
                codeR.map((r,i)=>{
                    let code=r.code;
                    let parent={};
                    const slice=code.slice(0,3);
                    parent=_.find(results,{code:slice});
                    if(parent){
                        _.forEach(r._actions,a=>{
                            const index=_.findIndex(parent._actions,{actionId:a.actionId});
                            if(index===-1){
                                parent._actions.push(a);
                            }
                        });
                        parent.children.push(r)
                    }else{
                        parent={
                            code:slice,
                            children: [
                                ...r
                            ]
                        };
                        results.push(parent)
                    }
                })
                    // toast.success(data.message);

                    dispatch(success(results));

            } else {
                toast.error(resp.message);
                dispatch(failure(resp.message));
            }
        });

        function success(value) {
            return {type: actionTypes.GET_ALL_ROUTES_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_ALL_ROUTES_FAILURE, error}
        }
    }
}

function getRoutes(params) {
    return dispatch => {
        axios.get({
            url: api.get_routes,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    // toast.success(data.message);
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
            return {type: actionTypes.GET_ROUTES_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_ROUTES_FAILURE, error}
        }
    }
}

function getRouteParents(params) {
    return dispatch => {
        axios.get({
            url: api.get_route_parents,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    // dispatch(paginationActions.pagination(data.pagination));
                    // toast.success(data.message);
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
            return {type: actionTypes.GET_ROUTE_PARENTS_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_ROUTE_PARENTS_FAILURE, error}
        }
    }
}

function insertRoute(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_route,
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
        return {type: actionTypes.INSERT_ROUTE_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.INSERT_ROUTE_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.INSERT_ROUTE_FAILURE, error}
    }
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_ROUTE, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_ROUTE, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_ROUTE, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_ROUTE, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_ROUTE, value}
}

function deleteRoute(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_route,
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
        return {type: actionTypes.DELETE_ROUTE_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.DELETE_ROUTE_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.DELETE_ROUTE_FAILURE, error}
    }
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_ROUTE, value};
}

function getRouteById(params) {
    return dispatch => {
        axios.get({
            url: api.get_route_by_id,
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
            return {type: actionTypes.GET_ROUTES_BY_ID_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_ROUTES_BY_ID_FAILURE, error}
        }
    }
}

function updateRoute(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_route,
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
            return {type: actionTypes.UPDATE_ROUTE_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_ROUTE_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.UPDATE_ROUTE_FAILURE, error}
        }
    }
}

function handleSearch(value) {
    return {type: actionTypes.SEARCH_ROUTE, value};
}

function onPageChange(value) {
    return {type: actionTypes.ON_PAGE_CHANGE_ROUTES, value};
}

function getAllAction() {
    return dispatch => {
        axios.get({
            url: api.get_all_action,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    dispatch(success(data));
                } else {
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(failure(resp.message));
            }
        });

        function success(value) {
            return {type: actionTypes.GET_ALL_ACTION_ROUTE_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_ALL_ACTION_ROUTE_FAILURE, error}
        }
    }
}

function checkAll(value) {
    return {type: actionTypes.CHECK_ALL_ACTION_ROUTE, value}
}
