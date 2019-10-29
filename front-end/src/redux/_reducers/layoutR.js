import actionTypes from '../_constants/actionTypes';
import _ from "lodash";

const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const layouts = (state = {}, action) => {
    let pagination, value, data, draw, shapes, parents, current, validate, error, image, racks, dataCenters, rooms,
        find, name, zoneGroup;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_LAYOUT:
            value = action.value;
            return {
                ...state,
                ...value,
            };
        case actionTypes.GET_LAYOUTS_SUCCESS:
            current = state.current || {};
            value = action.value;
            pagination = value.pagination;
            data = value.data;
            return {
                ...state,
                pagination: pagination,
                list: data,
                current: {...current},
                loading: 0,
                action: '',
                open: false,
                searchLoading: false,
            };
        case actionTypes.GET_LAYOUTS_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
            };
        case actionTypes.GET_LAYOUT_PARENTS_SUCCESS:
            value = action.value || {};
            parents = value.data || [];
            return {
                ...state,
                parents: parents
            };
        case actionTypes.GET_LAYOUT_PARENTS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.DELETE_CURRENT_LAYOUT:
            current = state.current || {};
            name=action.name;
            value = action.value;
            return {
                ...state,
                current: {},
                [name]: value
            };

        case actionTypes.UPDATE_CURRENT_LAYOUT:
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
            }
            if (name === 'new') {
                value = action.value;
                return {
                    ...state,
                    current: {
                        ...current,
                        ...value
                    },
                };
            } else if (name === 'current') {
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

        case actionTypes.VALIDATE_LAYOUT:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_RACK_LAYOUT_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_RACK_LAYOUT_SUCCESS:
            value = action.value;
            data = value.data;
            current = state.current || {};
            draw = current.draw || {};
            shapes = draw.shapes || [];
            racks = state.racks || [];
            find = _.findIndex(racks, {rackId: data.rackId});
            if (find === -1) racks.push(data);
            find = _.find(shapes, {name: data.name});
            if (find) find.id = data.rackId;
            return {
                ...state,
                current: {
                    ...current,
                    rackId: data.rackId
                },
                loading: 2
            };
        case actionTypes.INSERT_RACK_LAYOUT_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.MODAL_LAYOUT:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_UPDATE_LAYOUT:
            return {
                ...state,
                current: action.value,
                open: false,
                action: 'update'
            };
        case actionTypes.DELETE_RACK_LAYOUT_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_RACK_LAYOUT_SUCCESS:
            value = action.value;
            current = state.current || {};
            draw = current.draw || {};
            racks = state.racks || [];
            shapes = draw.shapes || [];
            find = _.findIndex(shapes, {id: parseInt(value.data.rackId)});
            if (find > -1) {
                shapes.splice(find, 1);
            }
            find = _.findIndex(racks, {rackId: parseInt(value.data.rackId)});
            if (find > -1) {
                racks.splice(find, 1);
            }
            return {
                ...state,
                loading: 2
            };
        case actionTypes.DELETE_RACK_LAYOUT_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.GET_LAYOUTS_BY_ID_SUCCESS:
            value = action.value;
            data = value.data;
            current = action.current;
            const _current = data[0] || {};
            return {
                ...state,
                current: {
                    ...current,
                    ..._current
                },
            };
        case actionTypes.GET_LAYOUTS_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_RACK_LAYOUT_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_RACK_LAYOUT_SUCCESS:
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
        case actionTypes.UPDATE_RACK_LAYOUT_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_LAYOUT:
            return {
                ...state,
                search: {
                    str: action.value
                },
                searchLoading: true
            };
        case actionTypes.ON_PAGE_CHANGE_LAYOUTS:
            value = action.value;
            pagination = state.pagination || {};
            return {
                ...state,
                pagination: {
                    ...pagination,
                    currentPage: value
                }
            };
        case actionTypes.GET_LAYOUT_OTHER_SUCCESS:
            value = action.value;
            return {
                ...state,
                ...value
            };
        case actionTypes.GET_LAYOUT_OTHER_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        case actionTypes.ONCHANGE_LOCATION_LAYOUT:
            dataCenters = state.dataCenters || [];
            rooms = state.rooms || [];
            current = state.current || {};
            value = action.value;
            data = _.filter(dataCenters, item => {
                return (value === item.locationId)
            });
            return {
                ...state,
                current: {
                    ...current,
                    dataCenterId: ''
                },
                _dataCenters: data
            }
        case actionTypes.ONCHANGE_DATACENTER_LAYOUT:
            rooms = state.rooms || [];
            current = state.current || {};
            value = action.value;
            data = _.filter(rooms, item => {
                return (value === item.roomId)
            });
            return {
                ...state,
                current: {
                    ...current,
                    roomId: ''
                },
                _rooms: data
            };
        case actionTypes.ONCHANGE_ROOM_LAYOUT:
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
        case actionTypes.GET_RACKS_BY_ZONE_REQUEST:
            return {
                ...state,
                loading: 1,
            };
        case actionTypes.GET_RACKS_BY_ZONE_SUCCESS:
            value = action.value;
            data = value.data;
            current = state.current || {};
            draw = current.draw || {};
            shapes = draw.shapes || [];
            racks = current.racks || [];
            name = '';


            _.forEach(data, r => {
                shapes.push({
                    x: r.x,
                    y: r.y,
                    id: r.rackId,
                    width: r.width,
                    height: r.height,
                    draggable: true,
                    zoneId: r.zoneId,
                    rackId: r.rackId,
                    zoneGroupId: r.zoneGroupId,
                    name: possible.charAt(Math.floor(Math.random() * possible.length))
                });
            })
            // if(_.size(shapes) > 0) {

            // }
            return {
                ...state,
                current: {
                    ...current,
                    draw: {
                        ...draw,
                        shapes: shapes
                    },
                    racks: [
                        ...racks,
                        ...data
                    ],
                },

                loading: 2
            };
        case actionTypes.GET_RACKS_BY_ZONE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.GET_RACK_BY_ID2_SUCCESS:
            value = action.value;
            current = state.current || {};
            // current = value.data || {};
            return {
                ...state,
                current: {
                    ...current,
                    ...value.data || {}
                },
            };
        case actionTypes.GET_RACK_BY_ID2_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case actionTypes.UPDATE_LOADING_LAYOUT:
            value = action.value;
            return {
                ...state,
                loading: value
            };
        case actionTypes.GET_RACKS_BY_ROOM_REQUEST:
            return {
                ...state,
                loading: 1,
            };
        case actionTypes.GET_RACKS_BY_ROOM_SUCCESS:
            value = action.value;
            data = value.data;
            current = state.current || {};
            draw = current.draw || {};
            shapes = [];
            racks = [];
            name = '';
            zoneGroup = [];
            // console.log('get rack by room', data);

            _.forEach(data, item => {
                let zone = {
                    roomId: item.roomId,
                    zoneGroupId: item.zoneGroupId,
                    zoneId: item.zoneId,
                    x: item.x,
                    y: item.y,
                    width: item.width,
                    height: item.height,
                    name: possible.charAt(Math.floor(Math.random() * possible.length))
                };
                zoneGroup.push(zone);
                if (_.size(item.racks) > 0) {
                    const temp = _.map(item.racks, r => {
                        return {...r, zoneGroupId: item.zoneGroupId, zoneId: item.zoneId}
                    });
                    racks = [...racks, ...temp];
                }

            });

            return {
                ...state,
                current: {
                    ...current,
                    racks: racks,
                    zoneGroup: zoneGroup,
                },
                loading: 2
            };
        case actionTypes.GET_RACKS_BY_ROOM_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        default:
            return state;
    }
};
