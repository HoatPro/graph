import React, {Component, Fragment} from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Modal, Dropdown, Loader, Message} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import CustomTable from '../../components/Table/Table';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {zoneA} from '../../redux/_actions/categories/zoneA';
import _ from 'lodash';
import moment from 'moment/moment';
import defaultImage from '../../static/images/default_image.png';
import "cropperjs/dist/cropper.css";
import _config from "../../utils/config";
import _var from '../../assets/js/var';
import {
    Layer,
    Stage,
} from 'react-konva';
import DrawImage from "../../components/Shapes/Image";
import DrawRect from "../../components/Shapes/Rect";
import Base from "../../assets/js/base";
import {ToastContainer} from 'react-toastify';

const config = _config[_config.environment];
const prevURL = config.prevURL;
const originBackend = config.originBackend;
const prevOrigin = config.prevOrigin;


class Zones extends Component {

    constructor(props) {
        super(props);
        this.state = {
            timeout: null,
            image: defaultImage,
            openImage: false,
            checkPermission: []
        }
        this.base = new Base();
    }

    componentDidMount() {
        this.props.dispatch(zoneA.getOthers());
        this.getData();
        document.title = "Zone List";
        const data = localStorage.getItem('user');
        const userData = JSON.parse(data);
        let arrayData = userData.permissions;
        let children = [];
        arrayData.map(data => {
            if (data.routeKey === "/categories") children = data.children
        });
        let checkPermission = [];
        children.map(data => {
            if (data.routeKey === "/zones") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
    }

    componentWillReceiveProps = (nextProps) => {
        const {zones} = nextProps;
        const {action = '', loading = false, current = {}} = zones;
        if (action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData = (_search, _pagination) => {
        const {zones = {}, dispatch} = this.props;
        const {search = {}, pagination = {}} = zones;
        dispatch(zoneA.getZones({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow = id => {
        const {zones, dispatch} = this.props;
        const {list = []} = zones;
        const find = _.find(list, {zoneId: id});
        if (find) {
            dispatch(zoneA.handleDeleteRow(find));
        }
    }

    handleUpdateRow = id => {
        const {zones, dispatch} = this.props;
        const {list = []} = zones;
        const find = _.find(list, {zoneId: id});
        if (find) {
            dispatch(zoneA.handleUpdateRow(find));
        }
    }

    handleClose = () => {
        this.props.dispatch(zoneA.modal(false));
    }

    handleCloseView = () => {
        this.props.dispatch(zoneA.handleCloseViewImage({
            image: defaultImage,
            openImage: false,
            current: {}
        }));
    }

    onDelete = () => {
        const {zones} = this.props;
        const {current = {}} = zones;
        const id = current.zoneId;
        if (id) this.props.dispatch(zoneA.deleteZone({id: id}));
    }

    handleSearch = async (e) => {
        const {name, value} = e.target;
        const {zones, dispatch} = this.props;
        let {search = {}, pagination = {}} = zones;
        search[name] = value;
        dispatch(zoneA.handleSearch(name, value));
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.getData(search, pagination);
        }, 500);
        await new Promise(resolve => {
            dispatch(zoneA.handleSearch(name, value));
            resolve();
        });
        this.onSearch();
    }

    handleViewImage = (zoneId, roomId, value) => {
        const {zones = {}, dispatch} = this.props;
        const {list = [], current = {}} = zones;
        const {draw = {}} = current;

        const find = _.find(list, {zoneId: zoneId});
        if (find) {
            const path = `${originBackend + prevOrigin}/uploads/rooms/${roomId}/${value}`;
            const img = document.createElement('img');
            const modalContent = document.querySelector("#mdViewImage .content");
            const styles = this.base.getStyle(modalContent, 'offsetTop');
            img.addEventListener('load', (e) => {
                const {target} = e;
                const {draw = {}, zoneGroup = []} = find;

                const img = {
                    x: 0,
                    y: 0,
                    image: target,
                    type: 'image',
                    name: this.makeRandomName(),
                    zIndex: 0
                };
                const index = _.findIndex(draw.shapes, {type: 'image'});
                let shapes = [];
                if (index > -1) {
                    shapes = [];
                }
                shapes.push(img);
                // push zone to background
                _.forEach(zoneGroup, item => {
                    shapes.push({
                        x: item.x,
                        y: item.y,
                        width: item.width,
                        height: item.height,
                        draggable: false,
                        stroke: _var.strokeZone,
                        strokeWidth: 2,
                        name: this.makeRandomName(),
                        id: item.zoneGroupId
                    });
                });

                const data = {
                    openImage: true,
                    image: path,
                    current: {
                        ...find,
                        draw: {
                            ...draw,
                            stage: {
                                width: target.width,
                                height: target.height
                            },
                            shapes: shapes
                        }
                    }
                };
                dispatch(zoneA.handleViewImage(data));
            });
            img.src = path;
        }
    }

    makeRandomName = () => {
        let result = '';
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++)
            result += possible.charAt(Math.floor(Math.random() * possible.length));

        return result;
    }

    onPageChange = (e, data) => {
        const {activePage} = data;
        const {dispatch, search = {}, pagination = {}} = this.props;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    handleSelect = async (e, data) => {
        const {dispatch} = this.props;
        const {name, value} = data;
        await new Promise(resolve => {
            dispatch(zoneA.handleSearch(name, value));
            resolve();
        });
        this.onSearch();
    }

    onSearch = () => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.getData();
        }, 500);
    }

    handleMountView = (e) => {
        const {zones = {}} = this.props;
        const {current = {}} = zones;
        const {draw = {}} = current;
        const {stage = {}} = draw;
        const modals = document.querySelector('.ui.modals');
        const modal = document.querySelector('.ui.modal');
        const content = document.querySelector('#mdViewImage .content');

        if (content) {
            const view = document.querySelector('.view-content');
            const heightMs = this.convertFloat(this.base.getStyle(modals, 'height'));
            const paddingTopMs = this.convertFloat(this.base.getStyle(modals, 'paddingTop'));
            const widthM = this.convertFloat(this.base.getStyle(modal, 'width'));
            const marginTopM = this.convertFloat(this.base.getStyle(modal, 'marginTop'));
            const paddingLeftC = this.convertFloat(this.base.getStyle(content, 'paddingLeft'));
            const width = widthM - paddingLeftC * 2;
            const height = heightMs - paddingTopMs * 2 - marginTopM * 2;

            view.style.width = stage.width < width ? stage.width : width + 'px';
            view.style.height = stage.height < height ? stage.height : height + 'px';
            view.style.overflow = 'auto';
        }

    }

    // element : 45px
    convertFloat = (element) => {
        return parseFloat(element.replace('px', ''));
    }

    render() {
        const {zones = {}} = this.props;
        const {checkPermission} = this.state;
        const {
            open = false,
            current = {zoneName: '', zoneId: '', draw: {}}, search = {str: ''},
            searchLoading = false,
            pagination = {currentPage: 0, countPage: 1},
            openImage = false,
            locations = [],
            dataCenters = [],
            rooms = []
        } = zones;
        const {
            zoneName = '',
            locationId = '',
            dataCenterId = '',
            roomId = '',
        } = search;
        let draw = current.draw || {};
        const stage = draw.stage || {};
        let shapes = draw.shapes || [];
        const _locations = locations.map(item => {
            return {text: item.locationName, value: item.locationId}
        });
        let _zones = [];
        let _rooms = [];
        let _dataCenters = [];

        if (locationId) {
            _.forEach(dataCenters, item => {
                if (locationId === item.locationId) {
                    _dataCenters.push({text: item.dataCenterName, value: item.dataCenterId});
                }
            });
        }
        if (dataCenterId) {
            _.forEach(rooms, item => {
                if (dataCenterId === item.dataCenterId) {
                    _rooms.push({text: item.roomName, value: item.roomId});
                }
            });
        }
        if (roomId) {
            _.forEach(zones, item => {
                if (roomId === item.roomId) {
                    _zones.push({text: item.zoneName, value: item.zoneId});
                }
            });
        }
        let list = [];
        let insert = [];
        let checkRole = true;
        let _header = ['Index', 'Zone', 'Image', 'Location', 'DataCenter', 'Room', 'Created date'];
        let _update = _.find(checkPermission, {actionKey: 'update'});
        let _delete = _.find(checkPermission, {actionKey: 'delete'});
        let _insert = _.find(checkPermission, {actionKey: 'insert'});
        let _view = _.find(checkPermission, {actionKey: 'view'});
        if (_insert) {
            insert = (<Grid.Column floated='right' textAlign="right" computer={3} largeScreen={3} tablet={5}
                                   moblie={8}>

                <Link to={prevURL + "/categories/zone-edit"}><Button primary>Add</Button></Link>
            </Grid.Column>)
        }
        _.forEach(zones.list, (item, i) => {
            let temp = [];
            let index = 1;
            if (_.isNull(pagination.currentPage) || _.isUndefined(pagination.currentPage)) {
                index = i + 1;
            } else {
                index = (pagination.currentPage * pagination.sizePage) + i + 1;
            }
            temp.push(index);
            _.forEach(['zoneName', 'image', 'locationName', 'dataCenterName', 'roomName', 'createdDate'], c => {
                let value = item[c];
                if (c === 'createdDate') value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                if (c === 'image') {
                    const image = item[c];
                    value = <Button size="mini" icon
                                    onClick={() => this.handleViewImage(item.zoneId, item.roomId, image)}><Icon
                        name="eye"/></Button>;
                }
                if (_.isNull(value)) value = '';
                temp.push(value);
            });
            const id = item.zoneId;
            let change = [];
            if (_.isNil(_view) && _.isNil(_update) && _.isNil(_delete)) {
                checkRole = false;
            } else {
                if (_.isNil(_update) && _.isNil(_delete)) {
                    _header = ['Index', 'Zone', 'Image', 'Location', 'DataCenter', 'Room', 'Created date']
                } else {
                    if (_update) {
                        change.push(<Link to={prevURL + '/categories/zone-edit?id=' + id}  key={index}>
                            <Button size="mini" icon onClick={() => this.handleUpdateRow(id)}>
                                <Icon name="pencil"/>
                            </Button>
                        </Link>)
                    }
                    _header = ['Index', 'Zone', 'Image', 'Location', 'DataCenter', 'Room', 'Created date', ''];
                    if (_delete) {
                        change.push(
                            <Button color="red" size="mini" icon onClick={() => this.handleDeleteRow(id)} key={-index}>
                                <Icon name="delete"/>
                            </Button>
                        )
                    }
                    temp.push({
                        cell: (<Fragment>
                            {change}
                        </Fragment>),
                        props: {
                            textAlign: 'center'
                        }
                    });
                }
                list.push(temp);
            }
        });
        const header = [_header];
        return (
            <div>
                {/*<Head>*/}
                {/*    <title>Zone List</title>*/}
                {/*</Head>*/}
                <DashboardLayout>
                    <Segment>
                        <Header>Zone List</Header>
                        <ToastContainer enableMultiContainer/>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8}>
                                <Input
                                    fluid
                                    icon='search'
                                    placeholder="Zone..."
                                    name='zoneName'
                                    value={search.zoneName}
                                    onChange={this.handleSearch}
                                />
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8}>
                                <Dropdown
                                    fluid
                                    name='locationId'
                                    placeholder='Location...'
                                    search
                                    selection
                                    clearable
                                    options={_locations}
                                    onChange={this.handleSelect}
                                    value={search.locationId || ''}
                                />
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8}>
                                <Dropdown
                                    fluid
                                    name='dataCenterId'
                                    placeholder='DataCenter...'
                                    search
                                    selection
                                    clearable
                                    options={_dataCenters}
                                    onChange={this.handleSelect}
                                    value={search.dataCenterId || ''}
                                />
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8}>
                                <Dropdown
                                    fluid
                                    name='roomId'
                                    placeholder='Room...'
                                    search
                                    selection
                                    clearable
                                    options={_rooms}
                                    onChange={this.handleSelect}
                                    value={search.roomId || ''}
                                />
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8}>
                                <Loader active={searchLoading}/>
                            </Grid.Column>
                            {insert}
                        </Grid>
                        {checkRole ? <CustomTable
                            header={header}
                            body={list}
                            pagination={true}
                            paginationProps={{
                                defaultActivePage: pagination.currentPage + 1,
                                totalPages: pagination.countPage
                            }}
                            onPageChange={this.onPageChange}
                        /> : <Message negative>
                            <Message.Header style={{textAlign: "center"}}>You don't have permission to view this
                                page!</Message.Header>
                        </Message>}
                        <Modal
                            id="mdViewImage"
                            className="modal-full-screen"
                            open={openImage}
                            closeIcon
                            size="fullscreen"
                            onClose={this.handleCloseView}
                            onMount={this.handleMountView}
                        >
                            <Modal.Content image className='center'>
                                {openImage ? <div className='view-content'>
                                    <Stage
                                        width={stage.width}
                                        height={stage.height}
                                    >
                                        <Layer ref='layer'>
                                            {_.size(shapes) === 0 ? null : shapes.map((shape, index) => {
                                                if (shape.type === 'image') {
                                                    return (
                                                        <DrawImage
                                                            key={index}
                                                            {...shape}
                                                        />
                                                    )
                                                } else {
                                                    return (
                                                        <DrawRect
                                                            key={index}
                                                            {...shape}
                                                            isDrawingMode={false}
                                                            // menuSetting={this.menuSetting}
                                                            // pass isDrawingMode so we know when we can click on a shape
                                                        />
                                                    );
                                                }
                                            })}
                                        </Layer>
                                        {/*<Layer ref="scroll">*/}
                                        {/*    <DrawRect*/}
                                        {/*        width={5}*/}
                                        {/*        height*/}
                                        {/*        draggable={true}*/}
                                        {/*        // menuSetting={this.menuSetting.bind(this)}*/}

                                        {/*        // pass isDrawingMode so we know when we can click on a shape*/}
                                        {/*    />*/}
                                        {/*</Layer>*/}
                                    </Stage>
                                </div> : null}
                            </Modal.Content>
                        </Modal>
                        <Modal size={'mini'} open={open}
                               onClose={this.handleClose}
                               closeOnEscape={true}
                               closeOnDimmerClick={false}
                        >
                            <Modal.Header>Remove Zone</Modal.Header>
                            <Modal.Content>
                                <p>Do you want to remove the Zone: {`"${current.zoneName}"`} ?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose}>Cancel</Button>
                                <Button positive icon='checkmark' labelPosition='right' content='Yes'
                                        onClick={this.onDelete.bind(this)}/>
                            </Modal.Actions>
                        </Modal>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({zones}) => ({zones});

export default connect(mapStateToProps, null)(Zones);