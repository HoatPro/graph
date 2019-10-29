import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
// import {alertA} from '../alertA';
import {toast} from 'react-toastify';

export const contractA = {
    getContracts,
    insertContract,
    validate,
    updateCurrent,
    updateContract,
    deleteContract,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getContractById,
    handleSearch,
    onPageChange
};

function getContracts(params) {
    return dispatch => {
        axios.get({
            url: api.get_contracts,
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
            return {type: actionTypes.GET_CONTRACTS_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_CONTRACTS_FAILURE, error}
        }
    }
}

function insertContract(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_contract,
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
        return {type: actionTypes.INSERT_CONTRACT_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.INSERT_CONTRACT_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.INSERT_CONTRACT_FAILURE, error}
    }
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_CONTRACT, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_CONTRACT, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_CONTRACT, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_CONTRACT, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_CONTRACT, value}
}

function deleteContract(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_contract,
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
        return {type: actionTypes.DELETE_CONTRACT_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.DELETE_CONTRACT_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.DELETE_CONTRACT_FAILURE, error}
    }
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_CONTRACT, value};
}

function getContractById(params) {
    return dispatch => {
        axios.get({
            url: api.get_contract_by_id,
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
            return {type: actionTypes.GET_CONTRACTS_BY_ID_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_CONTRACTS_BY_ID_FAILURE, error}
        }
    }
}

function updateContract(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_contract,
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
            return {type: actionTypes.UPDATE_CONTRACT_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_CONTRACT_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.UPDATE_CONTRACT_FAILURE, error}
        }
    }
}

function handleSearch(value) {
    return {type: actionTypes.SEARCH_CONTRACT, value};
}

function onPageChange(value) {
    return {type: actionTypes.ON_PAGE_CHANGE_CONTRACTS, value};
}