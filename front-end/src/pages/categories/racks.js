import React from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Modal, Loader, Dropdown, Message} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import CustomTable from '../../components/Table/Table';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {rackA} from '../../redux/_actions/categories/rackA';
import _ from 'lodash';
import moment from 'moment/moment';
import defaultImage from '../../static/images/default_image.png';
// import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import _config from '../../utils/config';
import history from "../history";
import {ToastContainer} from 'react-toastify';

const config = _config[_config.environment];
const prevURL = config.prevURL;
const originBackend = config.originBackend;
const prevOrigin = config.prevOrigin;

class Racks extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeout: null,
            checkPermission: []
        }
    }

    componentDidMount() {
        this.props.dispatch(rackA.getOthers());
        this.getData();
        document.title = "Rack List";
        const data = localStorage.getItem('user');
        const userData = JSON.parse(data);
        let arrayData = userData.permissions;
        let children = [];
        arrayData.map(data => {
            if (data.routeKey === "/categories") children = data.children
        });
        let checkPermission = [];
        children.map(data => {
            if (data.routeKey === "/racks") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
    }

    componentWillReceiveProps = (nextProps) => {
        const {racks} = nextProps;
        const {action = '', loading = false, current = {}} = racks;
        if (action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData = (_search, _pagination) => {
        const {racks = {}, dispatch} = this.props;
        const {search = {}, pagination = {}} = racks;
        dispatch(rackA.getRacks({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow = id => {
        const {racks, dispatch} = this.props;
        const {list = []} = racks;
        const find = _.find(list, {rackId: id});
        if (find) {
            dispatch(rackA.handleDeleteRow(find));
        }
    }

    handleUpdateRow = async (id) => {
        const {racks, dispatch} = this.props;
        const {list = []} = racks;
        const find = _.find(list, {rackId: id});
        if (find) {
            Promise.resolve(dispatch(rackA.handleUpdateRow(find))).then(() => {
                history.push(`${prevURL}/categories/rack-edit?id=${id}`);
            });
        }
    }

    handleClose = () => {
        const {dispatch} = this.props;
        dispatch(rackA.modal(false));
    }

    handleCloseView = () => {
        const {dispatch} = this.props;
        dispatch(rackA.updateCurrent('current', {
            rackId: '',
            x: '',
            y: '',
            height: '',
            width: '',
            locationId: '',
            dataCenterId: '',
            roomId: '',
            rackName: '',
            image: ''
        }));
        this.setState({
            image: defaultImage,
            openImage: false
        })
    }

    onDelete = () => {
        const {racks} = this.props;
        const {current = {}} = racks;
        const id = current.rackId;
        if (id) this.props.dispatch(rackA.deleteRack({id: id}));
    }

    handleViewImage = (rackId, roomId, value) => {
        const {racks = {}, dispatch} = this.props;
        const {list = []} = racks;
        const find = _.find(list, {rackId: rackId});
        if (find) dispatch(rackA.updateCurrent('current', find));
        const path = `${originBackend + prevOrigin}/uploads/rooms/${roomId}/${value}`;
        this.setState({
            openImage: true,
            image: path
        });
    }

    onPageChange = (e, data) => {
        const {activePage} = data;
        const {name, value} = e.target;
        const {racks = {}} = this.props;
        const {search = {}, pagination = {}} = racks;
        search[name] = value;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    handleSearch = async (e) => {
        const {name, value} = e.target;
        const {racks = {}, dispatch} = this.props;
        const {search = {}, pagination = {}} = racks;
        search[name] = value;
        if (pagination.currentPage === 0) {
            await new Promise(resolve => {
                dispatch(rackA.handleSearch(name, value));
                resolve();
            }).then(() => {
                this.getData(search, pagination);
            })
        } else {
            dispatch(rackA.getRacks('pagination', {currentPage: 0}));
            await new Promise(resolve => {
                dispatch(rackA.handleSearch(name, value));
            }).then(() => {
                this.getData(search, pagination);
            })
        }

    }


    handleSelect = async (e, data) => {
        const {dispatch} = this.props;
        const {name, value} = data;
        await new Promise(resolve => {
            dispatch(rackA.handleSearch(name, value));
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
        const {racks = {}} = this.props;
        const {checkPermission} = this.state;
        const {
            open = false,
            current = {},
            search = {str: ''},
            searchLoading = false,
            pagination = {currentPage: 0, countPage: 1},
            locations = [],
            dataCenters = [],
            rooms = [],
            zones = []
        } = racks;
        const {
            locationId = '',
            dataCenterId = '',
            roomId = '',
            zoneId = '',
        } = search;
        const {openError = false, rackName = '', error = null} = current;
        const _locations = locations.map(item => {
            return {text: item.locationName, value: item.locationId}
        });
        let _zones = [];
        let _rooms = [];
        let _dataCenters = [];
        let _racks = [];
        if (locationId) {
            _.forEach(dataCenters, item => {
                if (locationId === item.locationId) {
                    _dataCenters.push({text: item.dataCenterName, value: item.dataCenterId})
                }
            });
        }
        if (dataCenterId) {
            _.forEach(rooms, item => {
                if (dataCenterId === item.dataCenterId) {
                    _rooms.push({text: item.roomName, value: item.roomId})
                }
            })
        }
        if (roomId) {
            _.forEach(zones, item => {
                if (roomId === item.roomId) {
                    _zones.push({text: item.zoneName, value: item.zoneId})
                }
            })
        }
        if (zoneId) {
            _.forEach(racks, item => {
                if (zoneId === item.zoneId) {
                    _racks.push({text: item.rackName, value: item.rackId})
                }
            })

        }
        let list = [];
        let insert = [];
        let checkRole = true;
        let _header = ['Index', 'Rack', 'Zone', 'Room', 'DataCenter Name', 'Location Name', 'Created By', 'Created date'];
        let _update = _.find(checkPermission, {actionKey: 'update'});
        let _delete = _.find(checkPermission, {actionKey: 'delete'});
        let _insert = _.find(checkPermission, {actionKey: 'insert'});
        let _view = _.find(checkPermission, {actionKey: 'view'});
        if (_insert) {
            insert = (
                <Grid.Column floated='right' textAlign="right" computer={3} largeScreen={3} tablet={5}
                             moblie={8}>
                    <Link to={prevURL + "/categories/rack-edit"}><Button primary>Add</Button></Link>
                </Grid.Column>
            )
        }
        _.forEach(racks.list, (item, i) => {
            let temp = [];
            let index = 1;
            if (_.isNull(pagination.currentPage) || _.isUndefined(pagination.currentPage)) {
                index = i + 1;
            } else {
                index = (pagination.currentPage * pagination.sizePage) + i + 1;
            }
            temp.push(index);
            _.forEach(['rackName', 'zoneName', 'roomName', 'dataCenterName', 'locationName', 'createdBy', 'createdDate'], c => {
                let value = item[c];
                if (c === 'createdDate') value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                if (c === 'image') {
                    const image = item[c];
                    value = <Button size="mini" icon
                                    onClick={() => this.handleViewImage(item.rackId, item.roomId, image)}><Icon
                        name="eye"/></Button>;
                }
                if (_.isNull(value)) value = '';
                temp.push(value);
            });
            const id = item.rackId;
            let change = [];
            if (_.isNil(_view) && _.isNil(_update) && _.isNil(_delete)) {
                checkRole = false;
            } else {
                if (_.isNil(_update) && _.isNil(_delete)) {
                    _header = ['Index', 'Rack', 'Zone', 'Room', 'DataCenter Name', 'Location Name', 'Created By', 'Created date'];
                } else {
                    if (_update) {
                        change.push(
                            <Button size="mini" icon onClick={() => this.handleUpdateRow(id)} key={index}>
                                <Icon name="pencil"/>
                            </Button>)
                    }
                    _header = ['Index', 'Rack', 'Zone', 'Room', 'DataCenter Name', 'Location Name', 'Created By', 'Created date', ''];
                    if (_delete) {
                        change.push(<Button color="red" size="mini" icon onClick={() => this.handleDeleteRow(id)} key={-index}>
                            <Icon name="delete"/>
                        </Button>)
                    }
                    temp.push({
                        cell: (<React.Fragment>
                            <Link to={prevURL + '/categories/rack-view?id=' + id}>
                                <Button size="mini" icon>
                                    <Icon name="eye"/>
                                </Button>
                            </Link>
                            {change}

                        </React.Fragment>),
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
                {/*<Loading type="PacmanLoader" />*/}
                <DashboardLayout>
                    <Segment>
                        <Header>Rack List</Header>
                        <ToastContainer enableMultiContainer/>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8} style={{marginRight: 28}}>
                                <Input
                                    fluid
                                    icon='search'
                                    placeholder="Search..."
                                    name='rackName'
                                    value={search.rackName}
                                    onChange={this.handleSearch}/>
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
                                <Dropdown
                                    fluid
                                    name='zoneId'
                                    placeholder='Zone...'
                                    search
                                    selection
                                    clearable
                                    options={_zones}
                                    onChange={this.handleSelect}
                                    value={search.zoneId || ''}
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
                        <Modal size={'mini'} open={open}
                               onClose={this.handleClose}
                               closeOnEscape={true}
                               closeOnDimmerClick={false}
                        >
                            <Modal.Header>Remove Rack</Modal.Header>
                            <Modal.Content scolling>
                                <p>Do you want to remove the Rack: {`"${rackName}"`} ?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose}>Cancel</Button>
                                <Button positive icon='checkmark' labelPosition='right' content='Yes'
                                        onClick={this.onDelete}/>
                            </Modal.Actions>
                        </Modal>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({racks}) => ({racks});

export default connect(mapStateToProps, null)(Racks);