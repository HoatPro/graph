import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

export const zones = (state = {}, action) => {
    let pagination, value, data, name, parents, current, validate, error, image, dataCenters, rooms, search;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_ZONE:
            value = action.value;
            return {
                ...state,
                ...value,
            };
        case actionTypes.GET_ZONES_SUCCESS:
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
        case actionTypes.GET_ZONES_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
            };
        case actionTypes.GET_ZONE_PARENTS_SUCCESS:
            value = action.value || {};
            parents = value.data || [];
            return {
                ...state,
                parents: parents
            };
        case actionTypes.GET_ZONE_PARENTS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_CURRENT_ZONE:
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
        case actionTypes.VALIDATE_ZONE:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_ZONE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_ZONE_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    zoneId: value.data.zoneId
                },
                loading: 2
            };
        case actionTypes.INSERT_ZONE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.MODAL_ZONE:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_DELETE_ZONE:
            return {
                ...state,
                current: action.value,
                open: true,
                action: 'delete'
            };
        case actionTypes.HANDLE_UPDATE_ZONE:
            return {
                ...state,
                current: action.value,
                open: false,
                action: 'update'
            };
        case actionTypes.DELETE_ZONE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_ZONE_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {},
                loading: 2
            };
        case actionTypes.DELETE_ZONE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.GET_ZONES_BY_ID_SUCCESS:
            value = action.value;
            data = value.data;
            current = data[0] || {};
            return {
                ...state,
                current: current,
            };
        case actionTypes.GET_ZONES_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_ZONE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_ZONE_SUCCESS:
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
        case actionTypes.UPDATE_ZONE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_ZONE:
            name = action.name;
            value = action.value;
            search = state.search || {};
            if (name === 'locationId') {
                search = {
                    ...search,
                    [name]: value,
                    dataCenterId: '',
                    roomId: ''
                }
            } else {
                search = {
                    ...search,
                    [name]: value,
                }
            }
            return {
                ...state,
                pagination: {
                    currentPage: 0
                },
                search: search,
                searchLoading: true
            };
        case actionTypes.ON_PAGE_CHANGE_ZONES:
            value = action.value;
            pagination = state.pagination || {};
            return {
                ...state,
                pagination: {
                    ...pagination,
                    currentPage: value
                }
            };
        case actionTypes.GET_ZONE_OTHER_SUCCESS:
            value = action.value;
            return {
                ...state,
                ...value
            };
        case actionTypes.GET_ZONE_OTHER_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        case actionTypes.ONCHANGE_LOCATION_ZONE:
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
        case actionTypes.ONCHANGE_DATACENTER_ZONE:
            rooms = state.rooms || [];
            current = state.current || {};
            value = action.value;
            data = _.filter(rooms, item => {
                return (value === item.dataCenterId)
            })
            return {
                ...state,
                current: {
                    ...current,
                    roomId: ''
                },
                _rooms: data
            }
        case actionTypes.ONCHANGE_ROOM_ZONE:
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
            }
        case actionTypes.HANDLE_VIEW_IMAGE_ZONE:
            value = action.value;
            current = state.current;
            return {
                ...state,
                openImage: true,
                current: {
                    ...current,
                    ...value.current,
                }
            };
        case actionTypes.HANDLE_CLOSE_VIEW_IMAGE_ZONE:
            return {
                ...state,
                openImage: false,
                current: {}
            };
        default:
            return state;
    }
};
