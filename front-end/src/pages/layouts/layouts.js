import React from 'react';
import PropTypes from "prop-types";
import {Button, Header, Grid, Segment, Label, Dropdown, Icon, Message} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {Router} from 'react-router-dom';
import {connect} from 'react-redux';
import {layoutA} from '../../redux/_actions/layoutA';
import {rackA} from '../../redux/_actions/categories/rackA';
import _ from 'lodash';
import 'react-contexify/dist/ReactContexify.min.css';
import {Menu, Item, contextMenu} from 'react-contexify';
import {
    Layer,
    Stage,
} from 'react-konva';
import Rectangle from '../../components/Shapes/Rectangle';
import DrawImage from '../../components/Shapes/Image';
import _config from '../../utils/config';
import {zoneA} from "../../redux/_actions/categories/zoneA";
import {loadingA} from "../../redux/_actions/loadingA";
import Base from '../../assets/js/base';
import _var from '../../assets/js/var';
import RackEdit from '../../components/Modal/RackEdit';
import moment from "moment";

const config = _config[_config.environment];
const prevURL = config.prevURL;
const originBackend = config.originBackend;
const prevOrigin = config.prevOrigin;

// eslint-disable-next-line no-use-before-define
class CustomMenu extends React.Component {
    render() {
        const {handleAddRack, handleEditRackInfo, handleDeleteRack, handleViewRack, action} = this.props;
        if (action === 'insert') {
            return <Menu id='ctmRack'>
                <Item onClick={handleAddRack}><Icon name='plus'/> Add rack info</Item>
                <Item onClick={handleDeleteRack}><Icon name='remove'/> Remove rack</Item>
            </Menu>
        } else {
            return <Menu id='ctmRack'>
                <Item onClick={handleEditRackInfo}><Icon name='pencil'/> Edit rack info</Item>
                <Item onClick={handleViewRack}><Icon name='search'/> View rack</Item>
                <Item onClick={handleDeleteRack}><Icon name='remove'/> Remove rack</Item>
            </Menu>
        }
    }
}

CustomMenu.defaultProps = {
    handleAddRack: () => {
    },
    handleEditRackInfo: () => {
    },
    handleDeleteRack: () => {
    },
    handleViewRack: () => {
    },
    action: 'insert'
};

CustomMenu.propTypes = {
    handleAddRack: PropTypes.func,
    handleEditRackInfo: PropTypes.func,
    handleDeleteRack: PropTypes.func,
    handleViewRack: PropTypes.func,
    action: PropTypes.oneOf(['insert', 'update'])
};

class Layouts extends React.Component {

    constructor(props) {
        super(props);
        this.base = new Base();
        this.state = {
            checkPermission: []
        }

    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(layoutA.getOthers()).then(() => {
            this.loadLayout();
        });
        const userData = localStorage.getItem('user');
        const test = JSON.parse(userData);
        let arrayData = test.permissions;
        let children = []
        arrayData.map(data => {
            if (data.routeKey === "/layouts") {
                children = data.children;
            }
        });
        let checkPermission = [];
        console.log(children);
        children.map(data => {
            if (data.routeKey === "/layout") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
        document.title = "Layouts"
    }

    componentWillReceiveProps = (nextProps) => {
        const {layouts = {}, racks = {}, dispatch} = nextProps;
        const _current = racks.current || {};
        const {action = '', loading = false, current = {}} = layouts;// eslint-disable-line no-use-before-define

        // if(action === 'delete' && loading && _.size(current) === 0) {
        //     dispatch(layoutA.getRackByZone({zoneId: current.zoneId}));
        // }
        if (racks.action === 'insert' && racks.loading === 2 && _current.rackId) {
            const {draw = {}} = current;
            const {shapes = []} = draw;
            const find = _.find(shapes, {name: _current.name});
            if (find && find.id === '') {
                find.id = _current.rackId;
                // dispatch(layoutA.updateCurrent('current', current));
                dispatch(rackA.updateCurrent('current', {}));
            }
        }
    }

    loadLayout = () => {
        const {dispatch, layouts = {}} = this.props;
        let {rooms = [], current = {}} = layouts;
        // const zoneId = current.zoneId;
        // const find = _.find(zones, {zoneId: zoneId});
        const roomId = current.roomId;
        const find1 = _.find(rooms, {roomId: roomId});
        // const img = new Image();
        // if(find) {
        //     const img = document.createElement('img');
        //     img.addEventListener('load', this.onLoad);
        //     img.src = `${originBackend + prevOrigin}/uploads/rooms/${current.roomId}/${current.image}`;
        //     dispatch(layoutA.updateCurrent('current', current));
        //     setTimeout(() => {
        //         dispatch(layoutA.getRackByZone({zoneId: zoneId}));
        //     }, 500);
        //
        // }

        if (find1) {
            const img = document.createElement('img');
            img.addEventListener('load', this.onLoad);
            img.src = `${originBackend + prevOrigin}/uploads/rooms/${current.roomId}/${current.image}`;
            new Promise(resolve => {
                dispatch(layoutA.updateCurrent('current', current));
                resolve();
            }).then(() => {
                dispatch(layoutA.getRackByRoom({roomId: roomId}));
            });
        }
    }

    handleDeleteRack = (e) => {
        const {layouts = {}, dispatch} = this.props;
        const {current = {}} = layouts;
        if (current.rackId) {
            dispatch(layoutA.deleteRackLayout({id: current.rackId}));
        } else {
            const {draw = {}} = current;
            let {shapes = []} = draw;
            const index = _.findIndex(shapes, {name: current.name});
            if (index > -1) {
                shapes.splice(index, 1);
                const data = {
                    ...current,
                    draw: {
                        ...draw,
                        shapes: shapes
                    }
                };
                dispatch(layoutA.updateCurrent('current', data));
            }
        }
    }

    handleUpdateRow = (id) => {
        const {layouts, dispatch} = this.props;
        const {list = []} = layouts;
        const find = _.find(list, {layoutId: id});
        if (find) {
            dispatch(layoutA.handleUpdateRow(find));
        }
    }

    onLoad = (e) => {
        const {target} = e;
        const {dispatch, layouts = {}} = this.props;
        const {current = {}} = layouts;
        const {draw = {}, zoneGroup = [], racks = [], zoneId = null} = current;
        const name = this.makeRandomName();
        const img = {
            x: 0,
            y: 0,
            image: target,
            type: 'image',
            name: name,
            zIndex: 0
        };
        // push background image
        const index = _.findIndex(draw.shapes, {type: 'image'});
        let shapes = [];
        if (index > -1) {
            shapes = [];
        }
        shapes.push(img);

        //push zone to background
        _.forEach(zoneGroup, item => {
            let visible = true;

            if (zoneId && item.zoneId !== zoneId) {
                visible = false;
            }

            shapes.push({
                x: item.x,
                y: item.y,
                width: item.width,
                height: item.height,
                draggable: false,
                stroke: _var.strokeZone,
                strokeWidth: 2,
                visible,
                name: 'zone',
                id: item.zoneGroupId,
                zoneGroupId: item.zoneGroupId,
                zoneId: item.zoneId,
                // stroke: '#0093fb',
                // strokeWidth: 4
            });
        });

        // push racks
        _.forEach(racks, item => {
            shapes.push({
                x: item.x,
                y: item.y,
                width: item.width,
                height: item.height,
                draggable: true,
                stroke: _var.strokeRack,
                // strokeWidth: 1,
                name: this.makeRandomName(),
                id: item.rackId,
                rackId: item.rackId,
                zoneId: item.zoneId,
                zoneGroupId: item.zoneGroupId
                // stroke: '#0093fb',
                // strokeWidth: 4
            });
        });

        const data = {
            ...current,
            draw: {
                ...draw,
                stage: {
                    width: target.width,
                    height: target.height
                },
                shapes: shapes
            }
        };
        dispatch(loadingA.stop());
        dispatch(layoutA.updateCurrent('current', data));
    }

    makeRandomName = (length) => {
        let result = '';
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        length = length ? length : possible.length;

        for (let i = 0; i < 5; i++)
            result += possible.charAt(Math.floor(Math.random() * length));

        return result;
    }

    handleSelect = async (e, data) => {
        const {dispatch, layouts = {}} = this.props;
        const {name, value} = data;
        const {zones = [], rooms = [], current = {}} = layouts;
        const {draw = {}} = current;

        let temp = '';


        if (name === 'zoneId') {
            const find = _.find(zones, {zoneId: value});
            const {shapes = []} = draw;

            if (find) {
                _.forEach(shapes, shape => {
                    if (shape.zoneId !== value) {
                        shape.visible = false;
                    } else {
                        shape.visible = true;
                    }
                });

                temp = {
                    zoneName: find.zoneName,
                    zoneGroupId: find.zoneGroupId,
                    zoneGroup: find.zoneGroup,
                    zoneId: value,
                    draw: {
                        ...draw,
                        shapes: shapes
                    }
                };
                // dispatch(loadingA.start());
                await new Promise(resolve => {
                    dispatch(layoutA.updateCurrent('current', temp));
                    resolve();
                });
            } else {
                _.forEach(shapes, shape => {
                    shape.visible = true;
                });
                temp = {
                    zoneName: '',
                    zoneGroupId: '',
                    zoneGroup: [],
                    zoneId: '',
                    draw: {
                        ...draw,
                        shapes: shapes
                    }
                };
                dispatch(layoutA.updateCurrent('current', temp));
            }

        } else if (name === 'roomId') {

            // console.log('select room', rooms, value);
            const find = _.find(rooms, {roomId: value});
            if (find) {
                temp = {
                    image: find.image,
                    roomId: value,
                };
                this.resize();
                dispatch(loadingA.start());
                await new Promise(resolve => {
                    dispatch(layoutA.updateCurrent('current', temp));
                    resolve();
                });
                dispatch(layoutA.getRackByRoom({roomId: value})).then(() => {
                    const img = document.createElement('img');
                    img.addEventListener('load', this.onLoad);
                    img.src = `${originBackend + prevOrigin}/uploads/rooms/${value}/${find.image}`;
                })

            } else {
                this.resize(0);
                temp = {
                    image: '',
                    roomId: '',
                    zoneGroup: [],
                    racks: [],
                    draw: {
                        ...draw,
                        shapes: []
                    }
                };
                dispatch(layoutA.updateCurrent('current', temp));

            }
        } else if (name === 'dataCenterId') {
            let data = {
                dataCenterId: value,
                image: '',
                roomId: '',
                zoneGroup: [],
                racks: [],
                draw: {
                    ...draw,
                    shapes: []
                }
            };
            if (!value) {
                this.resize(0);
            }
            dispatch(layoutA.updateCurrent('current', data));
        } else {
            dispatch(layoutA.updateCurrent(name, value));
        }
    }

    handleChecked = () => {
        const {layouts = {}, dispatch} = this.props;
        const {current = {}} = layouts;
        const {drawMode = true} = current;

        dispatch(layoutA.updateCurrent('drawMode', !drawMode));
    }

    handleClose = () => {
        this.props.dispatch(zoneA.modal(false));
    }

    handleCloseEdit = () => {
        this.props.dispatch(layoutA.updateCurrent('current', {openEdit: false}));
    }

    onDelete = () => {
        const {racks = {}} = this.props;
        const {current = {}} = racks;
        const id = current.rackId;

        if (id) this.props.dispatch(rackA.deleteRack({id: id}));
    }

    handleStageMouseDown = (e) => {
        const target = e.target;
        const evt = e.evt;
        const {dispatch, layouts = {}} = this.props;
        const {current = {}} = layouts;
        const {drawMode = true, isDrawing = false, draw = {}} = current;
        const atrrs = target.getAttrs();
        // right click
        if (evt.which === 3 || evt.button === 2) {
            dispatch(layoutA.updateCurrent('selectedShapeName', ''));
            return;
        }

        // drawing mode is false
        if (!drawMode) {
            const layer = target.getLayer();
            layer.getChildren((node) => {
                if (node.className === 'Rect') {
                    node.draggable(false);
                    return node;
                }
            });
            dispatch(layoutA.updateCurrent('menuSetting', null));
            return;
        }
        // if we are drawing a shape, a click finishes the drawing
        if (isDrawing) {
            dispatch(layoutA.updateCurrent('isDrawing', !isDrawing));
            return;
        }

        if (target === target.getStage() || target.className === 'Image' || atrrs.name === 'zone') {
            if (atrrs.name === 'zone') {
                const newShapes = draw.shapes.slice();
                const name = this.makeRandomName();
                newShapes.push({
                    x: evt.layerX,
                    y: evt.layerY,
                    width: 0,
                    height: 0,
                    stroke: 'red',
                    draggable: true,
                    name: name,
                    id: '',
                    zoneId: atrrs.zoneId,
                    zoneGroupId: atrrs.zoneGroupId
                });

                const data = {
                    ...current,
                    isDrawing: true,
                    selectedShapeName: '',
                    menuSetting: null,
                    draw: {
                        ...draw,
                        shapes: newShapes,
                    }
                };
                dispatch(layoutA.updateCurrent('current', data))
            } else {
                dispatch(layoutA.updateCurrent('current', {
                    selectedShapeName: '',
                    menuSetting: null
                }));
            }
            return;
        }
    };

    handleStageMouseUp = (e) => {
        const {layouts = {}, dispatch} = this.props;
        const {current = {}} = layouts;
        const {drawMode = true, isDrawing = false, isMoving = null, draw = {}} = current;
        const {shapes = []} = draw;

        let newShapes = _.filter(shapes, s => {
            if (s.width === 0 && s.height === 0) return false;
            return true;
        });

        if (_.size(newShapes) !== _.size(shapes)) {
            dispatch(layoutA.updateCurrent('current', {
                draw: {
                    ...draw,
                    shapes: newShapes
                }
            }));
        }


        if (!drawMode) return;

        if (isDrawing) {
            return dispatch(layoutA.updateCurrent('isDrawing', !isDrawing));
        }

        if (isMoving) {
            return dispatch(layoutA.updateCurrent('current', {
                isMoving: null,
                ctrl: false,
                copy: null,
                selectedShapeName: null,
            }));
        }
    };

    handleMouseMove = (e) => {
        const {dispatch, layouts = {}} = this.props;
        const {current = {}} = layouts;
        const {
            drawMode = true,
            isDrawing = false,
            copy = null,
            ctrl = false,
            draw = {},
            racks = [],
            menuSetting = null
        } = current;
        let {shapes = []} = draw;
        const {evt, currentTarget} = e;
        const {targetShape} = currentTarget;
        const konva = document.getElementsByClassName('konvajs-content')[0];
        if (!drawMode) {
            konva.style.cursor = 'default';
            return;
        }

        const mouseX = evt.layerX;
        const mouseY = evt.layerY;
        konva.style.cursor = 'crosshair';

        // update the current rectangle's width and height based on the mouse position
        if (isDrawing) {
            // get the current shape (the last shape in this.state.shapes)
            const currShapeIndex = draw.shapes.length - 1;
            const currShape = draw.shapes[currShapeIndex];
            const newWidth = mouseX - currShape.x;
            const newHeight = mouseY - currShape.y;

            const newShapesList = draw.shapes.slice();
            const oldShape = newShapesList[currShapeIndex];
            newShapesList[currShapeIndex] = {
                ...oldShape,
                x: currShape.x,   // keep starting position the same
                y: currShape.y,
                width: newWidth,  // new width and height
                height: newHeight,
            };
            const data = {
                draw: {
                    ...draw,
                    shapes: newShapesList
                }
            };
            return dispatch(layoutA.updateCurrent('current', data));
        }

        if (ctrl && copy) {
            konva.style.cursor = 'copy';
            let newShapesList = shapes.slice();
            let rect;
            const find = _.find(newShapesList, {name: copy});
            if (find) {
                rect = {
                    ...find,
                    x: mouseX,
                    y: mouseY
                };
                return dispatch(layoutA.updateCurrent('current', {
                    ...current,
                    isMoving: rect.name,
                    draw: {
                        ...draw,
                        shapes: newShapesList
                    }
                }));
            }
        }

        if (targetShape && !menuSetting) {
            const attrs = targetShape.attrs;
            const rackId = attrs.rackId;
            if (rackId) {
                const rack = _.find(racks, {rackId: rackId});
                let content;
                if (rack) {
                    const date = rack.createdDate;
                    const dateFormat = moment(date).format("DD/MM/YYYY HH:mm:ss");
                    rack.sums.map(data => {
                        content = (<div>
                            <b>{rack.rackName} </b>
                            <p>Space: {data.dtHeight} / {rack.uNumber} U</p>
                            <p>Weight: {data.dtWeight} /{rack.maxWeight} </p>
                            <p>Power: {data.dtMaxPower} /{rack.maxPower}</p>
                        </div>)
                    });


                    contextMenu.show({
                        id: "menu",
                        event: evt,
                        position: {
                            x: mouseX,
                            y: mouseY
                        }

                    });
                    return dispatch(layoutA.updateCurrent('current', {
                        ...current,
                        tooltip: {
                            // x: mouseX,
                            // y: mouseY,
                            content: content,
                            visible: true
                        }
                    }));
                }

            } else {
                contextMenu.hideAll();
            }
        }

    };

    onChange = (index, newProps) => {
        const {dispatch, layouts = {}} = this.props;
        const {current = {}} = layouts;
        const {draw = {}} = current;
        const rectangles = draw.shapes.slice();

        rectangles[index] = newProps;
        const data = {
            draw: {
                ...draw,
                shapes: rectangles
            }
        };
        dispatch(layoutA.updateCurrent('current', data));
    };

    onKeyDown = (e) => {
        const {layouts = {}, dispatch} = this.props;
        const {current = {}} = layouts;
        const {draw = {}, selectedShapeName = '', ctrl = false} = current;
        let shapes = draw.shapes || [];
        const keyCode = e.keyCode || e.which;
        const index = _.findIndex(draw.shapes, {name: selectedShapeName});
        let update = true;

        if (index > -1) {
            let shape = shapes[index];
            switch (keyCode) {
                case 17: // ctrl (copy)
                    if (!ctrl && selectedShapeName) {
                        const name = this.makeRandomName(5);
                        let rect = {
                            ...shape,
                            oldName: shape.name,
                            name: name,
                        };
                        delete rect.rackId;
                        current.ctrl = true;
                        current.copy = name;
                        shapes.push(rect);
                    }

                    break;
                case 37: // arrow left
                    shape.x -= 1;
                    break;
                case 38: // arrow up
                    shape.y -= 1;
                    break;
                case 39: // arrow right
                    shape.x += 1;
                    break;
                case 40: // arrow down
                    shape.y += 1;
                    break;
                case 46:
                    shapes.splice(index, 1);
                    break;
                default:
                    update = false;
                    break;

            }
            if (update) {
                dispatch(zoneA.updateCurrent('current', {
                    ...current,
                    draw: {
                        ...draw,
                        shapes: shapes
                    }
                }))
            }
            e.preventDefault();
        }
    };

    onKeyUp = (e) => {
        const {layouts = {}, dispatch} = this.props;
        let {current = {}} = layouts;
        const {isMoving = null, draw = {}} = current;
        let {shapes = []} = draw;
        const keyCode = e.keyCode || e.which;

        if (keyCode === 17) {
            if (isMoving) {
                let indexCopy = _.findIndex(shapes, {name: isMoving});

                if (indexCopy > -1) {
                    const copy = shapes[indexCopy];
                    const old = _.find(shapes, {name: copy.oldName});

                    if (old && copy.x === old.x && copy.y === old.y && copy.width === old.width && copy.height === old.height) {
                        shapes.splice(indexCopy, 1);
                    }
                }
                dispatch(layoutA.updateCurrent('current', {
                    isMoving: null,
                    ctrl: false,
                    copy: null,
                    selectedShapeName: null,
                    draw: {
                        ...draw,
                        shapes: shapes
                    }
                }));
            } else {
                dispatch(layoutA.updateCurrent('current', {
                    ctrl: false,
                }));
            }
        }
    };


    onSelect = (e, name) => {
        const {layouts = {}, dispatch} = this.props;
        const {current = {}} = layouts;
        const {drawMode = true} = current;
        const target = e.target;

        if (!drawMode) return;
        if (target.getAttr('name') === 'zone') return;
        dispatch(layoutA.updateCurrent('current', {
            selectedShapeName: name,
            menuSetting: null
        }));
    }

    menuSetting = (event) => {
        const evt = event.evt;
        if ((evt.which === 3 || evt.button === 2) && event.target.getAttr('name') !== 'zone') {

            const {layouts = {}, dispatch} = this.props;
            const {current = {}} = layouts;
            const {racks = []} = current;

            // const racks = this.props.racks.items.data;
            const target = event.currentTarget;
            const attrs = target.attrs;
            const id = attrs.rackId ? attrs.rackId : '';
            const zoneId = current.zoneId ? current.zoneId : attrs.zoneId;
            let rack = {};
            const find = _.find(racks, {rackId: id});
            if (_.size(find) === 0) {
                rack = {
                    rackId: '',
                    model: '',
                    uNumber: null,
                    SNMP: '',
                    maxPower: null,
                    wattage: null,
                    maxWeight: null,
                    dataCenterId: current.dataCenterId,
                    roomId: current.roomId,
                    _zoneId: zoneId,
                    x: attrs.x,
                    y: attrs.y,
                    width: attrs.width,
                    height: attrs.height,
                    rackDepth: null,
                    rackWidth: null,
                    rackHeight: null,
                    description: '',
                    parentId: '',
                    status: true,
                    background: '',
                    rackName: ''
                };
            } else {
                rack = {...find};
                rack.dataCenterId = current.dataCenterId;
                // rack.roomId = current.roomId;
                rack._zoneId = rack.zoneId;
                rack.zoneId = '';
                delete rack.draw;
            }

            // hide tooltip
            contextMenu.hideAll();

            contextMenu.show({
                id: 'ctmRack',
                event: evt,
            });
            dispatch(layoutA.updateLoading(0));
            dispatch(layoutA.updateCurrent('current', {
                ...rack,
                name: attrs.name,
                menuSetting: evt
            }));

            evt.preventDefault();
            evt.stopPropagation();
            return false;
        }
    }

    handleEditRackInfo = () => {
        this.props.dispatch(layoutA.updateCurrent('current', {openEdit: true, title: 'Edit rack'}));
        // Router.push(prevURL + '/categories/rack-edit?id=' + current.rackId);

    }

    handleAddRack = (e) => {
        this.props.dispatch(layoutA.updateCurrent('current', {openEdit: true, title: 'Insert rack'}));
        // Router.push(prevURL + '/categories/rack-edit');
    }

    handleViewRack = () => {
        const {layouts = {}} = this.props;
        const {current = {},} = layouts;
        if (current.rackId) {
            Router.push(prevURL + '/categories/rack-view?id=' + current.rackId);
        }
    }

    handleSave = () => {
        const {layouts = {}, dispatch} = this.props;
        const {current = {}} = layouts;
        const {draw = {}, racks = []} = current;
        const {shapes = []} = draw;
        let result = [];

        _.forEach(shapes, s => {
            if (s.rackId) {
                const exist = _.findIndex(racks, {x: s.x, y: s.y, width: s.width, height: s.height, rackId: s.rackId});

                if (exist === -1) {
                    result.push(s);
                }
            }
        });

        if (_.size(result) > 0) {
            dispatch(layoutA.updateDraw({racks: result}));
        }
    }

    resize = (height) => {
        const content = document.querySelector('.main-content');
        const contentLayout = document.querySelector('.content-layout');
        const segment = document.querySelector('.content-layout .segment');
        const layout = document.querySelector('#divLayout');
        const header = document.querySelector('.ui.header');
        const toolbar = document.querySelector('.ui.grid-toolbar');
        const segmentPT = this.base.getStyle(segment, 'paddingTop');
        const toolbarPT = this.base.getStyle(toolbar, 'paddingTop');
        const contentLayoutPT = this.base.getStyle(contentLayout, 'paddingTop');
        const maxHeight = !_.isUndefined(height) ? height : content.clientHeight - header.clientHeight - toolbar.clientHeight - parseInt(segmentPT.replace('px', '')) * 2 - parseInt(toolbarPT.replace('px', '')) * 2 - parseInt(contentLayoutPT.replace('px', '')) * 2;
        const width = !_.isUndefined(height) ? height : segment.clientWidth - parseInt(segmentPT.replace('px', '')) * 2;

        layout.style.height = maxHeight + 'px';
        layout.style.width = width + 'px';

    }

    // onMouseMove = (e) => {
    //     const target = e.target;
    //     const evt = e.evt;
    //     const {dispatch, layouts = {}} = this.props;
    //     const {current = {}} = layouts;
    //     const {drawMode = true, isDrawing = false, draw = {}} = current;
    //     const atrrs = target.getAttrs();
    // }
    onMouseOut = (e) => {
        const target = e.target;
        const evt = e.evt;
        const {dispatch, layouts = {}} = this.props;
        const {current = {}} = layouts;
        const {drawMode = true, isDrawing = false, draw = {}} = current;
        const atrrs = target.getAttrs();
    };

    validate = () => {
        let {layouts, dispatch} = this.props;
        let {current = {}} = layouts;

        let rackName = '';
        let zoneId = '';
        if (!current.rackName) {
            rackName = 'May be not empty';
        }

        if (!current._zoneId && !current.zoneId) {
            zoneId = 'May be not empty';
        }

        if (!rackName && !zoneId) {
            return true;
        }
        dispatch(layoutA.validate({
            rackName: rackName,
            zoneId: zoneId,
        }));
        return false;
    }

    handleSaveEditRack = (e) => {
        if (!this.validate()) return false;
        const {layouts, dispatch} = this.props;
        let {current = {}} = layouts;
        let data = {
            rackName: current.rackName,
            model: current.model,
            uNumber: current.uNumber,
            SNMP: current.SNMP,
            maxPower: current.maxPower,
            wattage: current.wattage,
            maxWeight: current.maxWeight,
            x: current.x,
            y: current.y,
            width: current.width,
            height: current.height,
            rackWidth: current.rackWidth,
            rackHeight: current.rackHeight,
            rackDepth: current.rackDepth,
            zoneId: current.zoneId,
            roomId: current.roomId,
            _zoneId: current._zoneId,
            description: current.description,
            rackId: current.rackId,

        };

        if (!data.zoneId) {
            data.zoneId = current._zoneId;
        }
        if (data.rackId) {
            dispatch(layoutA.updateRackLayout(data)).then(() => {
                dispatch(layoutA.updateCurrent('current', {openEdit: false, title: ''}));
            });

        } else {
            dispatch(layoutA.insertRackLayout(data)).then(() => {
                dispatch(layoutA.updateCurrent('current', {openEdit: false, title: ''}));
            });
        }
    }

    handleChangeInput = (e) => {
        const {layouts, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = layouts;
        let _error = '';
        if (!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(layoutA.updateCurrent(name, value, _error));
    }

    render() {
        const {layouts = {}} = this.props;
        const {checkPermission} = this.state;
        let {
            current = {},
            dataCenters = [],
            _rooms = [],
            rooms = [],
            zones = [],
            _zones = [],
            open = false,
            validate = {},

        } = layouts;
        const {
            drawMode = true,
            menuSetting,
            selectedShapeName = '',
            openEdit = false,
            tooltip = {},
            title = '',
        } = current;
        const {
            x = 0,
            y = 0,
            visible = false,
            content = "",
            idTooltip = "content"
        } = tooltip;
        const draw = current.draw || {};
        const stage = draw.stage || {};
        let shapes = draw.shapes || [];
        const _dataCenters = _.map(dataCenters, item => ({text: item.dataCenterName, value: item.dataCenterId}));
        if (current.dataCenterId && _.size(_rooms) === 0) {
            _rooms = _.filter(rooms, item => {
                return (current.dataCenterId === item.dataCenterId)
            });
        }
        _rooms = _.map(_rooms, item => ({text: item.roomName, value: item.roomId}));
        if (current.roomId && _.size(_zones) === 0) {
            _zones = _.filter(zones, item => {
                return (current.roomId === item.roomId)
            });
        }
        _zones = _.map(_zones, item => ({text: item.zoneName, value: item.zoneId}));
        let _update = _.find(checkPermission, {actionKey: 'update'});
        let _delete = _.find(checkPermission, {actionKey: 'delete'});
        let _insert = _.find(checkPermission, {actionKey: 'insert'});
        let _view = _.find(checkPermission, {actionKey: 'view'});
        let component = [];
        let insert = [];
        if (_.isNil(_view) && _.isNil(_update) && _.isNil(_delete)) {
            component = (
                <Message negative>
                    <Message.Header style={{textAlign: "center"}}>You don't have permission to view this
                        page!</Message.Header>
                </Message>
            )
        } else {
            let save = [];

            if (_.isNil(_update) && _.isNil(_delete)) {
                save = [];
            } else {
                if (_update) {
                    save = (<Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8} className='draw-mode'>
                        <Button primary onClick={this.handleSave.bind(this)}>Save</Button>
                    </Grid.Column>)
                }
            }
            component = (<Segment>
                <Header>Data Center Layout</Header>
                <Grid className='grid-toolbar' doubling stackable>
                    <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                        <Label>Data Center</Label>
                        <Dropdown
                            name='dataCenterId'
                            fluid
                            placeholder='Select...'
                            search
                            selection
                            clearable
                            options={_dataCenters}
                            onChange={this.handleSelect}
                            value={current.dataCenterId}
                        />
                    </Grid.Column>
                    <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                        <Label>Room</Label>
                        <Dropdown
                            name='roomId'
                            fluid
                            placeholder='Select...'
                            search
                            selection
                            clearable
                            options={_rooms}
                            onChange={this.handleSelect}
                            value={current.roomId}
                        />
                    </Grid.Column>
                    <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                        <Label>Zone</Label>
                        <Dropdown
                            name='zoneId'
                            fluid
                            placeholder='Select...'
                            search
                            selection
                            clearable
                            options={_zones}
                            onChange={this.handleSelect}
                            value={current.zoneId}
                        />
                    </Grid.Column>
                    {save}
                </Grid>
                <div id="divLayout" data-tip={content} data-for="content" tabIndex={1}
                     onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp}>
                    <Stage

                        width={stage.width}
                        height={stage.height}
                        onMouseDown={this.handleStageMouseDown}
                        onMouseUp={this.handleStageMouseUp}
                        onContentMouseMove={this.handleMouseMove}
                        onMouseMove={this.onMouseMove}
                        onMouseOut={this.onMouseOut}
                    >
                        <Layer
                            ref='layer'
                        >
                            {_.size(shapes) === 0 ? null : shapes.map((shape, index) => {
                                console.log(shape);
                                if (shape.type === 'image') {
                                    return (
                                        <DrawImage
                                            key={index}
                                            {...shape}
                                        />
                                    )
                                } else {
                                    return (
                                        <Rectangle
                                            shapeProps={shape}
                                            isSelected={shape.name === selectedShapeName}
                                            onMenu={(e) => this.menuSetting(e)}
                                            onSelect={(e) => {
                                                this.onSelect(e, shape.name);
                                            }}
                                            onChange={newAttrs => {
                                                this.onChange(index, newAttrs);
                                            }}
                                        />

                                    );
                                }
                            })}
                        </Layer>
                    </Stage>

                    <Menu id="menu">
                        <Item>{content}</Item>
                    </Menu>


                    <CustomMenu
                        handleAddRack={this.handleAddRack}
                        handleEditRackInfo={this.handleEditRackInfo}
                        handleDeleteRack={this.handleDeleteRack}
                        handleViewRack={this.handleViewRack}
                        action={current.rackId ? 'update' : 'insert'}
                    />
                </div>
                <RackEdit
                    title={title}
                    open={openEdit}
                    dataCenters={_dataCenters}
                    rooms={_rooms}
                    zones={_zones}
                    current={current}
                    onClose={(e) => this.handleCloseEdit(e)}
                    onSave={e => this.handleSaveEditRack(e)}
                    onChange={(e) => this.handleChangeInput(e)}
                    validate={validate}
                />
            </Segment>)
        }
        return (
            <div>
                {/*<Loading type="PacmanLoader" />*/}
                <DashboardLayout>
                    {component}
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({layouts, racks}) => ({layouts, racks});

export default connect(mapStateToProps, null)(Layouts);