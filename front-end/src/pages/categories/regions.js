import React from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Modal, Message} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import CustomTable from '../../components/Table/Table';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {regionA} from '../../redux/_actions/categories/regionA';
import _ from 'lodash';
import moment from 'moment/moment';
import _config from '../../utils/config';
import {ToastContainer} from 'react-toastify';

const prevURL = _config[_config.environment].prevURL;

class Regions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeout: null,
            checkPermission: []
        }
    }

    componentDidMount() {
        document.title = "Region List";
        this.getData();
        const data = localStorage.getItem('user');
        const userData = JSON.parse(data);
        let arrayData = userData.permissions;
        let children = [];
        arrayData.map(data => {
            if (data.routeKey === "/categories") children = data.children
        });
        let checkPermission = [];
        children.map(data => {
            if (data.routeKey === "/regions") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
    }


    componentWillReceiveProps = (nextProps) => {
        const {regions} = nextProps;
        const {action = '', loading = false, current = {}} = regions;
        if (action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }


    getData = (_search, _pagination) => {
        const {regions, dispatch} = this.props;
        const {search = {}, pagination = {}} = regions;
        dispatch(regionA.getRegions({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow = id => {
        const {regions, dispatch} = this.props;
        const {list = []} = regions;
        const find = _.find(list, {regionId: id});
        if (find) {
            dispatch(regionA.handleDeleteRow(find));
        }
    }

    handleUpdateRow = id => {
        const {regions, dispatch} = this.props;
        const {list = []} = regions;
        const find = _.find(list, {regionId: id});
        if (find) {
            dispatch(regionA.handleUpdateRow(find));
        }
    }

    handleClose = () => {
        this.props.dispatch(regionA.modal(false));
    }

    onDelete = () => {
        const {regions} = this.props;
        const {current = {}} = regions;
        const id = current.regionId;
        if (id) this.props.dispatch(regionA.deleteRegion({id: id}));
    }

    handleSearch = e => {
        const {name, value} = e.target;
        const {regions, dispatch} = this.props;
        let {search = {}, pagination = {}} = regions;
        search[name] = value;
        if (pagination.currentPage === 0) {
            dispatch(regionA.handleSearch(value));
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.getData(search, pagination);
            }, 500);
        } else {
            dispatch(regionA.getRegions('pagination', {currentPage: 0}));
            dispatch(regionA.handleSearch(value));
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.getData(search, pagination);
            }, 500);
        }

    }

    onPageChange = (e, data) => {
        const {activePage} = data;
        const {name, value} = e.target;
        const {regions} = this.props;
        const {search = {}, pagination = {}} = regions;
        search[name] = value
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    render() {
        const {regions} = this.props;
        const {checkPermission} = this.state;
        const {
            open = false, current = {
                regionName: '',
                regionId: ''
            }, search = {str: ''}, searchLoading = false, pagination = {currentPage: 0, countPage: 1}
        } = regions;
        let list = [];
        let _header = ['Index', 'Region', 'Description', 'Department', 'Created date'];
        let insert = [];
        let checkRole = true;
        let _update = _.find(checkPermission, {actionKey: 'update'});
        let _delete = _.find(checkPermission, {actionKey: 'delete'});
        let _insert = _.find(checkPermission, {actionKey: 'insert'});
        let _view = _.find(checkPermission, {actionKey: 'view'});
        if (_insert) {
            insert = (
                <Grid.Column floated='right' textAlign="right" computer={3} largeScreen={3} tablet={5}
                             moblie={8}>
                    <Link to={prevURL + "/categories/region-edit"}><Button primary>Add</Button></Link>
                </Grid.Column>
            )
        }
        _.forEach(regions.list, (item, i) => {
            let temp = [];
            let index = 1;
            if (_.isNull(pagination.currentPage) || _.isUndefined(pagination.currentPage)) {
                index = i + 1;
            } else {
                index = (pagination.currentPage * pagination.sizePage) + i + 1;
            }
            temp.push(index);
            _.forEach(['regionName', 'description', 'departmentName', 'createdDate'], c => {
                let value = item[c];
                if (c === 'createdDate') value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                if (_.isNull(value)) value = '';
                temp.push(value);
            });
            const id = item.regionId;
            let change = [];
            if (_.isNil(_view) && _.isNil(_update) && _.isNil(_delete)) {
                checkRole = false;
            } else {
                if (_.isNil(_update) && _.isNil(_delete)) {
                    let _header = ['Index', 'Region', 'Description', 'Department', 'Created date'];
                } else {
                    if (_update) {
                        change.push(
                            <Link to={prevURL + '/categories/region-edit?id=' + id}  key={index}>
                                <Button size="mini" icon onClick={() => this.handleUpdateRow(id)}>
                                    <Icon name="pencil"/>
                                </Button>
                            </Link>
                        )
                    }
                    _header = ['Index', 'Region', 'Description', 'Department', 'Created date', ''];
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
        let header = [_header];
        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>Region List</Header>
                        <ToastContainer enableMultiContainer/>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input icon='search' placeholder="Search..." name='str' loading={searchLoading}
                                       value={search.str} onChange={this.handleSearch.bind(this)}/>
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
                        </Message>
                        }
                        <Modal size={'mini'} open={open}
                               onClose={this.handleClose}
                               closeOnEscape={true}
                               closeOnDimmerClick={false}
                        >
                            <Modal.Header>Remove Region</Modal.Header>
                            <Modal.Content>
                                <p>Do you want to remove the Region: {`"${current.regionName}"`}?</p>
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

const mapStateToProps = ({regions}) => ({regions});

export default connect(mapStateToProps, null)(Regions);