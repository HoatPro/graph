import React from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Modal, Message} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import CustomTable from '../../components/Table/Table';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {locationA} from '../../redux/_actions/categories/locationA';
import _ from 'lodash';
import moment from 'moment/moment';
import _config from '../../utils/config';
import {ToastContainer} from 'react-toastify';

const prevURL = _config[_config.environment].prevURL;

class Locations extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeout: null,
            checkPermission: []
        }
    }

    componentDidMount() {
        document.title = " Location List ";
        this.getData();
        const data = localStorage.getItem('user');
        const userInfo = JSON.parse(data);
        let arrayData = userInfo.permissions;
        let children = [];
        arrayData.map(data => {
            if (data.routeKey === "/categories") {
                children = data.children;
            }
        });
        let checkPermission = [];
        children.map(data => {
            if (data.routeKey === "/locations") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
    }

    componentWillReceiveProps = (nextProps) => {
        const {locations} = nextProps;
        const {action = '', loading = false, current = {}} = locations;
        if (action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData = (_search, _pagination) => {
        const {locations, dispatch} = this.props;
        const {search = {}, pagination = {}} = locations;
        dispatch(locationA.getLocations({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow = id => {
        const {locations, dispatch} = this.props;
        const {list = []} = locations;
        const find = _.find(list, {locationId: id});
        if (find) {
            dispatch(locationA.handleDeleteRow(find));
        }
    }

    handleUpdateRow = id => {
        const {locations, dispatch} = this.props;
        const {list = []} = locations;
        const find = _.find(list, {locationId: id});
        if (find) {
            dispatch(locationA.handleUpdateRow(find));
        }
    }


    handleClose = () => {
        this.props.dispatch(locationA.modal(false));
    }

    onDelete = () => {
        const {locations, dispatch} = this.props;
        const {current = {}} = locations;
        const id = current.locationId;
        if (id) dispatch(locationA.deleteLocation({id: id}));
    }

    handleSearch = e => {
        let {name, value} = e.target;
        const {locations, dispatch} = this.props;
        let {search = {}, pagination = {}} = locations;
        search[name] = value;
        if (pagination.currentPage === 0) {
            dispatch(locationA.handleSearch(value));
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.getData(search, pagination);
            }, 500);
        } else {
            dispatch(locationA.getLocations('pagination', {currentPage: 0}));
            dispatch(locationA.handleSearch(value));
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.getData(search, pagination);
            }, 500);
        }

    }

    onPageChange = (e, data) => {
        const {activePage} = data;
        const {name, value} = e.target;
        const {locations} = this.props;
        const {search = {}, pagination = {}} = locations;
        search[name] = value;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    render() {
        const {locations} = this.props;
        const {checkPermission} = this.state;
        const {
            parents = [], open = false, current = {
                locationName: '',
                locationId: ''
            }, search = {str: ''}, searchLoading = false, pagination = {currentPage: 0, countPage: 1}
        } = locations;
        let insert = [];
        let list = [];
        let checkRole = true;
        let _header = ['Index', 'Name', 'Descriptions', 'Created Date'];
        let _update = _.find(checkPermission, {actionKey: 'update'});
        let _delete = _.find(checkPermission, {actionKey: 'delete'});
        let _insert = _.find(checkPermission, {actionKey: 'insert'});
        let _view = _.find(checkPermission, {actionKey: 'view'});
        if (_insert) {
            insert = (
                <Grid.Column floated='right' textAlign="right" computer={3} largeScreen={3} tablet={5}
                             moblie={8}>
                    <Link to={prevURL + "/categories/location-edit"}>
                        <Button primary>Add</Button></Link>
                </Grid.Column>
            )
        }
        _.forEach(locations.list, (item, i) => {
            let temp = [];
            let index = 1;
            if (_.isNull(pagination.currentPage) || _.isUndefined(pagination.currentPage)) {
                index = i + 1;
            } else {
                index = (pagination.currentPage * pagination.sizePage) + i + 1;
            }
            temp.push(index);
            _.forEach(['locationName', 'description', 'createdDate'], c => {
                let value = item[c];
                if (c === 'createdDate') value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                if (c === 'parentId') {
                    const find = _.find(parents, {locationId: value});
                    if (find) {
                        value = find.locationName;
                    }
                }
                if (_.isNull(value)) value = '';
                temp.push(value);
            });
            const id = item.locationId;
            let change = [];
            if (_.isNil(_view) && _.isNil(_update) && _.isNil(_delete)) {
                checkRole = false;
            } else {
                if (_.isNil(_update) && _.isNil(_delete)) {
                    _header = ['Index', 'Name', 'Descriptions', 'Created Date'];
                } else {
                    if (_update) {
                        change.push(
                            <Link to={prevURL + '/categories/location-edit?id=' + id} key={index}>
                                <Button size="mini" icon onClick={() => this.handleUpdateRow(id)}>
                                    <Icon name="pencil"/>
                                </Button>
                            </Link>
                        )
                    }
                    _header = ['Index', 'Name', 'Descriptions', 'Created Date', ''];
                    if (_delete) {
                        change.push(
                            <Button color="red" size="mini" icon onClick={() => this.handleDeleteRow(id)} key={-index}>
                                <Icon name="delete"/>
                            </Button>
                        )
                    }
                    temp.push({
                        cell: (<React.Fragment>
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
                <DashboardLayout>
                    <Segment>
                        <Header>Location List</Header>
                        <ToastContainer enableMultiContainer/>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input
                                    icon='search'
                                    placeholder="Search..."
                                    name='str'
                                    loading={searchLoading}
                                    value={search.str}
                                    onChange={this.handleSearch}/>
                            </Grid.Column>
                            {/* <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input icon='search' placeholder="Location parent..." />
                            </Grid.Column> */}
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
                            <Modal.Header>Remove Location</Modal.Header>
                            <Modal.Content>
                                <p>Do you want to remove the {`"${current.locationName}"`} location?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose}>No</Button>
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

const mapStateToProps = ({locations}) => ({locations});

export default connect(mapStateToProps, null)(Locations);