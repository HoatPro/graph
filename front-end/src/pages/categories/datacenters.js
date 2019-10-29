import React from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Modal, Form, Loader, Message} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import CustomTable from '../../components/Table/Table';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {datacenterA} from '../../redux/_actions/categories/datacenterA';
import _ from 'lodash';
import moment from 'moment/moment';
import _config from '../../utils/config';
import {ToastContainer} from 'react-toastify';

const prevURL = _config[_config.environment].prevURL;

class Datacenters extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeout: null,
            checkPermission: []
        }
        this.count = 0;
    }

    componentDidMount() {
        this.props.dispatch(datacenterA.getOthers());
        this.getData();
        document.title = "DataCenter List";
        const data = localStorage.getItem('user');
        const userInfo = JSON.parse(data);
        let arrayData = userInfo.permissions;
        let children = [];
        arrayData.map(data => {
            if (data.routeKey === "/categories") children = data.children;
        })
        let checkPermission = [];
        children.map(data => {
            if (data.routeKey === "/datacenters") {
                checkPermission = data.actions
            }
        })
        this.setState({
            checkPermission: checkPermission
        })
    }

    componentWillReceiveProps = (nextProps) => {
        const {datacenters} = nextProps;
        const {action = '', loading = false, current = {}} = datacenters;
        if (action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData = (_search, _pagination) => {
        const {datacenters, dispatch} = this.props;
        const {search = {}, pagination = {}} = datacenters;
        dispatch(datacenterA.getDatacenters({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow = id => {
        const {datacenters, dispatch} = this.props;
        const {list = []} = datacenters;
        const find = _.find(list, {dataCenterId: id});
        if (find) {
            dispatch(datacenterA.handleDeleteRow(find));
        }
    }

    handleUpdateRow = id => {
        const {datacenters, dispatch} = this.props;
        const {list = []} = datacenters;
        const find = _.find(list, {dataCenterId: id});
        if (find) {
            dispatch(datacenterA.handleUpdateRow(find));
        }
    }

    handleClose = () => {
        this.props.dispatch(datacenterA.modal(false));
    }

    onDelete = () => {
        const {datacenters} = this.props;
        const {current = {}} = datacenters;
        const id = current.dataCenterId;
        if (id) this.props.dispatch(datacenterA.deleteDatacenter({id: id}));
    }


    handleSearch = async (e) => {
        const {name, value} = e.target;
        const {datacenters, dispatch} = this.props;
        let {search = {}, pagination = {}} = datacenters;
        search[name] = value;
        dispatch(datacenterA.handleSearch(name, value));
        this.timeout = setTimeout(() => {
            this.getData(search, pagination);
        }, 500);

        await new Promise(resolve => {
            dispatch(datacenterA.handleSearch(name, value));
            resolve();
        })
        this.onSearch();
    }

    onPageChange = (e, data) => {
        const {activePage} = data;
        const {datacenters} = this.props;
        const {search = {}, pagination = {}} = datacenters;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    handleSelect = async (e, data) => {
        const {dispatch} = this.props;
        const {name, value} = data;
        await new Promise(resolve => {
            dispatch(datacenterA.handleSearch(name, value));
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
        const {datacenters} = this.props;
        const {checkPermission} = this.state;
        const {
            open = false,
            current = {dataCenterName: '', dataCenterId: ''},
            search = {},
            searchLoading = false,
            pagination = {currentPage: 0, countPage: 1},
            locations = []
        } = datacenters;
        let list = [];
        let insert = [];
        let checkRole = true;
        let _header = ['Index', 'Name', 'Code', 'Total Room', 'Location', 'Description', 'Created Date'];
        let _update = _.find(checkPermission, {actionKey: 'update'});
        let _delete = _.find(checkPermission, {actionKey: 'delete'});
        let _insert = _.find(checkPermission, {actionKey: 'insert'});
        let _view = _.find(checkPermission, {actionKey: 'view'});
        if (_insert) {
            insert = (
                <Grid.Column floated='right' textAlign="right" computer={3} largeScreen={3} tablet={5}
                             moblie={8}>

                    <Link to={prevURL + "/categories/datacenter-edit"}><Button primary>Add</Button></Link>
                </Grid.Column>
            )
        }
        const _locations = locations.map(item => {
            return {text: item.locationName, value: item.locationId}
        });

        _.forEach(datacenters.list, (item, i) => {
            let temp = [];
            let index = 1;
            if (!pagination.currentPage) {
                index = i + 1;
            } else {
                index = (pagination.currentPage * pagination.sizePage) + i + 1;
            }
            temp.push(index);
            _.forEach(['dataCenterName', 'dataCenterKey', 'totalRoom', 'locationName', 'description', 'createdDate'], c => {
                let value = item[c];
                if (c === 'createdDate') value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                if (_.isNull(value)) value = '';
                temp.push(value);
            });
            const id = item.dataCenterId;
            let change = [];
            if (_.isNil(_view) && _.isNil(_update) && _.isNil(_delete)) {
                checkRole = false;
            } else {
                if (_.isNil(_update) && _.isNil(_delete)) {
                    _header = ['Index', 'Name', 'Code', 'Total Room', 'Location', 'Description', 'Created Date'];
                } else {
                    if (_update) {
                        change.push(
                            <Link to={prevURL + '/categories/datacenter-edit?id=' + id} key={index}>
                                <Button size="mini" icon onClick={() => this.handleUpdateRow(id)}>
                                    <Icon name="pencil"/>
                                </Button>
                            </Link>
                        )
                    }
                    _header = ['Index', 'Name', 'Code', 'Total Room', 'Location', 'Description', 'Created Date', ''];
                    if (_delete) {
                        change.push(<Button color="red" size="mini" icon onClick={() => this.handleDeleteRow(id)}
                                          key={-index}>
                            <Icon name="delete"/>
                        </Button>)
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
                        <Header>DataCenter List</Header>
                        <ToastContainer enableMultiContainer/>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input
                                    fluid
                                    icon='search'
                                    placeholder="Name/Short name"
                                    name='dataCenterName_dataCenterKey'
                                    value={search.dataCenterName_dataCenterKey || ''}
                                    onChange={this.handleSearch}
                                />
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Dropdown
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
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Loader active={searchLoading}/>
                            </Grid.Column>
                            {insert}
                        </Grid>
                        {checkRole?    <CustomTable
                            header={header}
                            body={list}
                            pagination={true}
                            paginationProps={{
                                defaultActivePage: pagination.currentPage + 1,
                                totalPages: pagination.countPage
                            }}
                            onPageChange={this.onPageChange}
                        />: <Message negative>
                            <Message.Header style={{textAlign: "center"}}>You don't have permission to view this
                                page!</Message.Header>
                        </Message>}
                        <Modal size={'mini'} open={open}
                               onClose={this.handleClose}
                               closeOnEscape={true}
                               closeOnDimmerClick={false}
                        >
                            <Modal.Header>Remove DataCenter</Modal.Header>
                            <Modal.Content>
                                <p>Do you want to remove {`"${current.dataCenterName}"`} datacenter?</p>
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

const mapStateToProps = ({datacenters}) => ({datacenters});

export default connect(mapStateToProps, null)(Datacenters);