import React, {Component, Fragment} from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Modal, Image, Dropdown, Loader, Message} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import CustomTable from '../../components/Table/Table';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {roomA} from '../../redux/_actions/categories/roomA';
import _ from 'lodash';
import moment from 'moment/moment';
import _config from '../../utils/config';
import ReactImageMagnify from 'react-image-magnify';
import {ToastContainer} from 'react-toastify';

const config = _config[_config.environment];
const prevURL = config.prevURL;
const originBackend = config.originBackend;
const prevOrigin = config.prevOrigin;

class Rooms extends Component {

    constructor(props) {
        super(props);
        this.state = {
            timeout: null,
            image: '',
            openImage: false,
            checkPermission: []
        }
    }

    componentDidMount() {
        this.props.dispatch(roomA.getOthers());
        this.getData();
        document.title = "Room List";
        const data = localStorage.getItem('user');
        const userData = JSON.parse(data);
        let arrayData = userData.permissions;
        let children = [];
        arrayData.map(data => {
            if (data.routeKey === "/categories") children = data.children
        });
        let checkPermission = [];
        children.map(data => {
            if (data.routeKey === "/rooms") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
    }

    componentWillReceiveProps = (nextProps) => {
        const {rooms} = nextProps;
        const {action = '', loading = false, current = {}} = rooms;
        if (action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData = (_search, _pagination) => {
        const {rooms, dispatch} = this.props;
        const {search = {}, pagination = {}} = rooms;
        dispatch(roomA.getRooms({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow = id => {
        const {rooms, dispatch} = this.props;
        const {list = []} = rooms;
        const find = _.find(list, {roomId: id});
        if (find) {
            dispatch(roomA.handleDeleteRow(find));
        }
    }

    handleUpdateRow = id => {
        const {rooms, dispatch} = this.props;
        const {list = []} = rooms;
        const find = _.find(list, {roomId: id});
        if (find) {
            dispatch(roomA.handleUpdateRow(find));
        }
    }

    handleClose = () => {
        this.props.dispatch(roomA.modal(false));
    }

    handleCloseView = () => {
        this.setState({
            image: '',
            openImage: false
        })
    }

    onDelete = () => {
        const {rooms} = this.props;
        const {current = {}} = rooms;
        const id = current.roomId;
        if (id) this.props.dispatch(roomA.deleteRoom({id: id}));
    }

    handleSearch = async (e) => {
        const {name, value} = e.target;
        const {rooms, dispatch} = this.props;
        let {search = {}, pagination = {}} = rooms;
        search[name] = value;
        dispatch(roomA.handleSearch(value));
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.getData(search, pagination);
        }, 500);
        await new Promise(resolve => {
            dispatch(roomA.handleSearch(name, value));
            resolve();
        });
        this.onSearch();

    }

    handleViewImage = (id, value) => {
        const path = `${originBackend + prevOrigin}/uploads/rooms/${id}/${value}`;
        this.setState({
            openImage: true,
            image: path
        });
    }

    onPageChange = (e, data) => {
        const {activePage} = data;
        const {name, value} = e.target;
        const {rooms} = this.props;
        let {dispatch, search = {}, pagination = {}} = rooms;
        search[name] = value
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    handleSelect = async (e, data) => {
        const {dispatch} = this.props;
        const {name, value} = data;

        await new Promise(resolve => {
            dispatch(roomA.handleSearch(name, value));
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

    render() {
        const {rooms} = this.props;
        const {checkPermission, image, openImage} = this.state;
        const {
            open = false,
            current = {roomName: '', roomId: ''},
            search = {room_code: ''},
            searchLoading = false,
            pagination = {currentPage: 0, countPage: 1},
            locations = [],
            dataCenters = [],
        } = rooms;
        const {
            room_code = '',
            locationId = '',
            dataCenterId = '',
        } = search;
        const _locations = locations.map(item => {
            return {text: item.locationName, value: item.locationId}
        });
        let _dataCenters = [];
        if (locationId) {
            _.forEach(dataCenters, item => {
                if (locationId === item.locationId) {
                    _dataCenters.push({text: item.dataCenterName, value: item.dataCenterId});
                }
            });
        }
        let list = [];
        let insert = [];
        let checkRole = true;
        let _header = ['Index', 'Room', 'Code room', 'Width', 'Height', 'Capacity', 'Image', 'Location', 'DataCenter', 'Description', 'Created date'];
        let _update = _.find(checkPermission, {actionKey: 'update'});
        let _delete = _.find(checkPermission, {actionKey: 'delete'});
        let _insert = _.find(checkPermission, {actionKey: 'insert'});
        let _view = _.find(checkPermission, {actionKey: 'view'});
        if (_insert) {
            insert = (<Grid.Column floated='right' textAlign="right" computer={3} largeScreen={3} tablet={5}
                                   moblie={8}>

                    <Link to={prevURL + "/categories/room-edit"}><Button primary>Add</Button></Link>
                </Grid.Column>

            )
        }
        _.forEach(rooms.list, (item, i) => {
            let temp = [];
            let index = 1;
            if (_.isNull(pagination.currentPage) || _.isUndefined(pagination.currentPage)) {
                index = i + 1;
            } else {
                index = (pagination.currentPage * pagination.sizePage) + i + 1;
            }
            temp.push(index);
            _.forEach(['roomName', 'codeRoom', 'width', 'height', 'capacity', 'image', 'locationName', 'dataCenterName', 'description', 'createdDate'], c => {
                let value = item[c];
                if (c === 'createdDate') value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                if (c === 'image') {
                    const image = item[c];
                    value = <Button size="mini" icon onClick={() => this.handleViewImage(item.roomId, image)}><Icon
                        name="eye"/></Button>;
                }
                if (_.isNull(value)) value = '';
                temp.push(value);
            });
            const id = item.roomId;
            let change = [];
            if (_.isNil(_view) && _.isNil(_update) && _.isNil(_delete)) {
                checkRole = false;
            } else {
                if (_.isNil(_update) && _.isNil(_delete)) {
                    _header = ['Index', 'Room', 'Code room', 'Width', 'Height', 'Capacity', 'Image', 'Location', 'DataCenter', 'Description', 'Created date'];
                } else {
                    if (_update) {
                        change.push(
                            <Link to={prevURL + '/categories/room-edit?id=' + id} key={index}>
                                <Button size="mini" icon onClick={() => this.handleUpdateRow(id)} >
                                    <Icon name="pencil"/>
                                </Button>
                            </Link>
                        )
                    }
                    _header = ['Index', 'Room', 'Code room', 'Width', 'Height', 'Capacity', 'Image', 'Location', 'DataCenter', 'Description', 'Created date', ''];
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
                <DashboardLayout>
                    <Segment>
                        <Header>Room List</Header>
                        <ToastContainer enableMultiContainer/>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input
                                    fluid
                                    icon='search'
                                    placeholder="Room/Code room..."
                                    name='room_code'
                                    value={room_code || ''}
                                    onChange={this.handleSearch}
                                />
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Dropdown
                                    fluid
                                    name='locationId'
                                    placeholder='Location...'
                                    search
                                    selection
                                    clearable
                                    options={_locations}
                                    onChange={this.handleSelect}
                                    value={locationId || ''}
                                />
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Dropdown
                                    fluid
                                    name='dataCenterId'
                                    placeholder='DataCenter...'
                                    search
                                    selection
                                    clearable
                                    options={_dataCenters}
                                    onChange={this.handleSelect}
                                    value={dataCenterId || ''}
                                />
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
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

                        <Modal size={'mini'} open={open}
                               onClose={this.handleClose}
                               closeOnEscape={true}
                               closeOnDimmerClick={false}
                        >
                            <Modal.Header>Remove Room</Modal.Header>
                            <Modal.Content>
                                <p>Do you want to remove the Room: {`"${current.roomName}"`} ?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose}>Cancel</Button>
                                <Button positive icon='checkmark' labelPosition='right' content='Yes'
                                        onClick={this.onDelete}/>
                            </Modal.Actions>
                        </Modal>
                        <Modal open={openImage} closeIcon onClose={this.handleCloseView}>
                            <Modal.Content image className='center' style={{marginLeft: -400}}>
                                {/*<Image wrapped size='large' src={image} />*/}
                                <ReactImageMagnify {...{
                                    smallImage: {
                                        alt: 'image',
                                        isFluidWidth: true,
                                        src: `${image}`
                                    },
                                    largeImage: {
                                        src: `${image}`,
                                        width: 1500,
                                        height: 1500
                                    }
                                }} />
                            </Modal.Content>
                        </Modal>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({rooms}) => ({rooms});

export default connect(mapStateToProps, null)(Rooms);