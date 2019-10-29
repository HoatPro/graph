import React, {Component, Fragment} from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Modal, Message} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import CustomTable from '../../components/Table/Table';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {departmentA} from '../../redux/_actions/categories/departmentA';
import _ from 'lodash';
import moment from 'moment/moment';
import _config from '../../utils/config';
import {ToastContainer} from "react-toastify";
const prevURL = _config[_config.environment].prevURL;

class Departments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            timeout: null,
            checkPermission: []
        }
    }

    componentDidMount() {
        this.getData();
        document.title = "Department List";
        const data = localStorage.getItem('user');
        const userData = JSON.parse(data);
        let arrayData = userData.permissions;
        let children = [];
        arrayData.map(data => {
            if (data.routeKey === "/categories") children = data.children
        });
        let checkPermission = [];
        children.map(data => {
            if (data.routeKey === "/departments") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
    }

    componentWillReceiveProps = (nextProps) => {
        const {departments} = nextProps;
        const {action = '', loading = false, current = {}} = departments;
        if (action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData = (_search, _pagination) => {
        const {departments, dispatch} = this.props;
        const {search = {}, pagination = {}} = departments;
        dispatch(departmentA.getDepartments({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow = (id) => {
        const {departments, dispatch} = this.props;
        const {list = []} = departments;
        const find = _.find(list, {departmentId: id});
        if (find) {
            dispatch(departmentA.handleDeleteRow(find));
        }
    }

    handleUpdateRow = (id) => {
        const {departments, dispatch} = this.props;
        const {list = []} = departments;
        const find = _.find(list, {departmentId: id});
        if (find) {
            dispatch(departmentA.handleUpdateRow(find));
        }
    }

    handleClose = () => {
        this.props.dispatch(departmentA.modal(false));
    }

    onDelete = () => {
        const {departments} = this.props;
        const {current = {}} = departments;
        const id = current.departmentId;
        if (id) this.props.dispatch(departmentA.deleteDepartment({id: id}));
    }

    handleSearch = (e) => {
        const {name, value} = e.target;
        const {departments, dispatch} = this.props;
        let {search = {}, pagination = {}} = departments;
        search[name] = value;
        if (pagination.currentPage === 0) {
            new Promise(resolve => {
                dispatch(departmentA.handleSearch(value));
                resolve();
            }).then(() => {
                this.getData(search, pagination)
            })
        } else {
            dispatch(departmentA.getDepartments('pagination', {currentPage: 0}));
            new Promise(resolve => {
                dispatch(departmentA.handleSearch(value));
            }).then(() => {
                this.getData(search, pagination)
            })
        }

    }

    onPageChange = (e, data) => {
        const {activePage} = data;
        const {name, value} = e.target;
        const {departments} = this.props;
        const {search = {}, pagination = {}} = departments;
        search[name] = value;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    render() {
        const {departments} = this.props;
        const {checkPermission} = this.state;
        const {
            open = false, current = {
                departmentName: '',
                departmentId: ''
            }, search = {str: ''}, searchLoading = false, pagination = {currentPage: 0, countPage: 1}
        } = departments;
        let list = [];
        let insert = [];
        let checkRole = true;
        let _header = ['STT', 'Department', 'Description', 'Created date'];
        let _update = _.find(checkPermission, {actionKey: 'update'});
        let _delete = _.find(checkPermission, {actionKey: 'delete'});
        let _insert = _.find(checkPermission, {actionKey: 'insert'});
        let _view = _.find(checkPermission, {actionKey: 'view'});
        if (_insert) {
            insert = (
                <Grid.Column floated='right' textAlign="right" computer={3} largeScreen={3} tablet={5}
                             moblie={8}>
                    <Link to={prevURL + "/categories/department-edit"}><Button primary>Add</Button></Link>
                </Grid.Column>
            )
        }
        _.forEach(departments.list, (item, i) => {
            let temp = [];
            let index = 1;
            if (_.isNull(pagination.currentPage) || _.isUndefined(pagination.currentPage)) {
                index = i + 1;
            } else {
                index = (pagination.currentPage * pagination.sizePage) + i + 1;
            }
            temp.push(index);
            _.forEach(['departmentName', 'description', 'createdDate'], c => {
                let value = item[c];
                if (c === 'createdDate') value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                if (_.isNull(value)) value = '';
                temp.push(value);
            });
            const id = item.departmentId;
            let change = [];
            if (_.isNil(_view) && _.isNil(_update) && _.isNil(_delete)) {
                checkRole = false;
            } else {
                if (_.isNil(_update) && _.isNil(_delete)) {
                    _header = ['STT', 'Department', 'Description', 'Created date'];
                } else {
                    if (_update) {
                        change.push(<Link to={prevURL + '/categories/department-edit?id=' + id} key={index}>
                            <Button size="mini" icon onClick={() => this.handleUpdateRow(id)}>
                                <Icon name="pencil"/>
                            </Button>
                        </Link>)
                    }
                    _header = ['STT', 'Department', 'Description', 'Created date', ''];

                    if (_delete) {
                        change.push(<Button color="red" size="mini" icon onClick={() => this.handleDeleteRow(id)} key={-index}>
                            <Icon name="delete"/>
                        </Button>)
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
        let header = [_header];
        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>Department List</Header>
                        <ToastContainer enableMultiContainer/>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input icon='search' placeholder="Search..." name='str' loading={searchLoading}
                                       value={search.str} onChange={this.handleSearch}/>
                            </Grid.Column>
                            {/* <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input icon='search' placeholder="Department parent..." />
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
                            <Modal.Header>Remove Department</Modal.Header>
                            <Modal.Content>
                                <p>Do you want to remove the Department: {`"${current.departmentName}"`}?</p>
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

const mapStateToProps = ({departments}) => ({departments});

export default connect(mapStateToProps, null)(Departments);