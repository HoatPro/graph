import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

export const racks = (state = {}, action) => {
    let pagination, value, data, name, parents, current, validate, error, image, locations, dataCenters, rooms,
        bookingU, bookingUs, devices, addDevice, moveU, search;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_RACK:
            value = action.value;
            return {
                ...state,
                ...value,
            };
        case actionTypes.GET_RACKS_SUCCESS:
            value = action.value;
            pagination = value.pagination;
            data = value.data;
            return {
                ...state,
                pagination: pagination,
                list: data,
                current: {},
                loading: 0,
                action: '',
                open: false,
                searchLoading: false,
            };
        case actionTypes.GET_RACKS_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
            };
        case actionTypes.GET_RACK_PARENTS_SUCCESS:
            value = action.value || {};
            parents = value.data || [];
            return {
                ...state,
                parents: parents
            };
        case actionTypes.GET_RACK_PARENTS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_CURRENT_RACK:
            current = state.current || {};
            validate = state.validate || {};
            name = action.name;
            error = action.error;
            if (['crop', 'current'].indexOf(name) > -1) {
                value = action.value;
                return {
                    ...state,
                    current: {
                        ...current,
                        ...value
                    },
                };
            } else {
                value = action.value;
                return {
                    ...state,
                    current: {
                        ...current,
                        [name]: value
                    },
                    validate: {
                        ...validate,
                        [name]: error
                    }
                };
            }
        case actionTypes.VALIDATE_RACK:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_RACK_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_RACK_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    rackId: value.data.rackId
                },
                loading: 2
            };
        case actionTypes.INSERT_RACK_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.MODAL_RACK:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_DELETE_RACK:
            return {
                ...state,
                current: action.value,
                open: true,
                action: 'delete'
            };
        case actionTypes.HANDLE_UPDATE_RACK:
            return {
                ...state,
                current: action.value,
                open: false,
                action: 'update',
            };
        case actionTypes.DELETE_RACK_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_RACK_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {},
                loading: 2
            };
        case actionTypes.DELETE_RACK_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.GET_RACK_BY_ID_SUCCESS:
            value = action.value;
            current = value.data || {};
            return {
                ...state,
                current: current,
            };
        case actionTypes.GET_RACK_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_RACK_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_RACK_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    ...value.data
                },
                loading: 2
            };
        case actionTypes.UPDATE_RACK_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_RACK:
            name = action.name;
            value = action.value;
            search = state.search || {};
            if (name === 'locationId') {
                search = {
                    ...search,
                    [name]: value,
                    dataCenterId: '',
                    roomId: '',
                    zoneId: ''
                }
            } else {
                search = {
                    ...search,
                    [name]: value,
                }
            }
            return {
                ...state,
                search: search,
                searchLoading: true
            };
        case actionTypes.ON_PAGE_CHANGE_RACKS:
            value = action.value;
            pagination = state.pagination || {};
            return {
                ...state,
                pagination: {
                    ...pagination,
                    currentPage: value
                }
            };
        case actionTypes.GET_RACK_OTHER_SUCCESS:
            value = action.value;
            return {
                ...state,
                ...value
            };
        case actionTypes.GET_RACK_OTHER_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        case actionTypes.GET_RACK_OTHER_PLUS_SUCCESS:
            value = action.value;
            return {
                ...state,
                ...value
            };
        case actionTypes.GET_RACK_OTHER_PLUS_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        case actionTypes.ONCHANGE_LOCATION_RACK:
            dataCenters = state.dataCenters || [];
            rooms = state.rooms || [];
            current = state.current || {};
            value = action.value;
            data = _.filter(dataCenters, item => {
                return (value === item.locationId)
            })
            return {
                ...state,
                current: {
                    ...current,
                    dataCenterId: ''
                },
                _dataCenters: data
            }
        case actionTypes.ONCHANGE_DATACENTER_RACK:
            rooms = state.rooms || [];
            current = state.current || {};
            value = action.value;
            data = _.filter(rooms, item => {
                return (value === item.roomId)
            })
            return {
                ...state,
                current: {
                    ...current,
                    roomId: ''
                },
                _rooms: data
            }
        case actionTypes.ONCHANGE_ROOM_RACK:
            rooms = state.rooms || [];
            current = state.current || {};
            value = action.value;
            data = null;
            image = '';
            data = _.find(rooms, {roomId: value});
            if (data) {
                image = data.image;
            }
            return {
                ...state,
                current: {
                    ...current,
                    image: image
                },
            };
        case actionTypes.HANDLE_BOOKING_U_RACK:
            bookingU = state.bookingU || {};
            value = action.value;
            bookingU = value;
            return {
                ...state,
                bookingU: bookingU,
                validate: {}
            };
        case actionTypes.BOOKING_U_RACK_SUCCESS:
            bookingU = {
                ...state.bookingU,
                saveSuccess: true
            };
            // console.log('bU', bookingU);
            return {
                ...state,
                bookingU: bookingU
            };
        case actionTypes.HANDLE_ADD_DEVICE:
            addDevice = action.value;
            return {
                ...state,
                addDevice:addDevice,
                validate: {}
            };
        case actionTypes.ADD_DEVICE_RACK_SUCCESS:
            addDevice = {
                ...state.addDevice,
                saveSuccess: true
            };
            return {
                ...state,
                addDevice: addDevice
            }
        case actionTypes.HANDLE_MOVE_U:
            moveU = action.value;
            return {
                ...state,
                moveU: moveU,
                validate: {}
            }
        case actionTypes.SAVE_MOVE_U_SUCCESS:
            moveU = {
                ...state.moveU,
                saveSuccess: true
            }
            return {
                ...state,
                moveU: moveU
            }
        case actionTypes.GET_DEVICE_BY_ID_SUCCESS:
            value = action.value;
            current = action.current || {};

            return {
                ...state,
                current: {
                    ...current,
                    ...value,
                }
            };
        default:
            return state;
    }
};
