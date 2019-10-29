import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {toast} from 'react-toastify';

export const customerA = {
    getCustomers,
    insertCustomer,
    validate,
    updateCurrent,
    updateCustomer,
    deleteCustomer,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getCustomerById,
    handleSearch,
    onPageChange,
    getOthers
};

function getCustomers(params) {
    return dispatch => {
        axios.get({
            url: api.get_customers,
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
            return {type: actionTypes.GET_CUSTOMERS_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_CUSTOMERS_FAILURE, error}
        }
    }
}

function insertCustomer(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_customer,
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
        return {type: actionTypes.INSERT_CUSTOMER_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.INSERT_CUSTOMER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.INSERT_CUSTOMER_FAILURE, error}
    }
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_CUSTOMER, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_CUSTOMER, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_CUSTOMER, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_CUSTOMER, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_CUSTOMER, value}
}

function deleteCustomer(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_customer,
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
        return {type: actionTypes.DELETE_CUSTOMER_REQUEST}
    }

    function success(value) {
        return {type: actionTypes.DELETE_CUSTOMER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.DELETE_CUSTOMER_FAILURE, error}
    }
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_CUSTOMER, value};
}

function getCustomerById(params) {
    return dispatch => {
        axios.get({
            url: api.get_customer_by_id,
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
            return {type: actionTypes.GET_CUSTOMERS_BY_ID_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.GET_CUSTOMERS_BY_ID_FAILURE, error}
        }
    }
}

function updateCustomer(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_customer,
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
            return {type: actionTypes.UPDATE_CUSTOMER_REQUEST}
        }

        function success(value) {
            return {type: actionTypes.UPDATE_CUSTOMER_SUCCESS, value}
        }

        function failure(error) {
            return {type: actionTypes.UPDATE_CUSTOMER_FAILURE, error}
        }
    }
}

function handleSearch(value) {
    return {type: actionTypes.SEARCH_CUSTOMER, value};
}

function onPageChange(value) {
    return {type: actionTypes.ON_PAGE_CHANGE_CUSTOMERS, value};
}

function getOthers(params) {
    return dispatch => {
        let promises = [];
        const roles = new Promise(resolve => {
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
        promises.push(roles);

        Promise.all(promises).then(resp => {
            const data = {
                locations: resp[0],
            };
            dispatch(success(data));
        }).catch(error => {
            dispatch(failure(error.toString()));
        });

    };

    function success(value) {
        return {type: actionTypes.GET_CUSTOMER_OTHER_SUCCESS, value}
    }

    function failure(error) {
        return {type: actionTypes.GET_CUSTOMER_OTHER_FAILURE, error}
    }
}