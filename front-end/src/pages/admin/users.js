import React from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Modal, Message} from 'semantic-ui-react';
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {Link} from "react-router-dom";
import CustomTable from "../../components/Table/Table";
import {connect} from 'react-redux';
import {userA} from "../../redux/_actions/admin/userA";
import _ from 'lodash';
import moment from 'moment/moment';
import _config from "../../utils/config";
import {ToastContainer} from 'react-toastify';

const prevURL = _config[_config.environment].prevURL;

class Users extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeout: null,
            checkPermission: []
        }
    }

    componentDidMount() {
        document.title = "Users List";
        this.getData();
        const data = localStorage.getItem('user');
        const userInfo = JSON.parse(data);
        let arrayData = userInfo.permissions;
        let children = [];
        arrayData.map(data => {
            if (data.routeKey === "/admin") children = data.children;
        });
        let checkPermission = [];
        children.map(data => {
            if (data.routeKey === "/users") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })

    }

    componentWillReceiveProps(nextProps) {
        const {users} = nextProps;
        const {action = '', loading = false, current = {}} = users;
        if (action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData = (_search, _pagination) => {
        const {users = {}, dispatch} = this.props;
        const {search = {}, pagination = {}} = users;
        dispatch(userA.getUsers({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow = (id) => {
        const {users, dispatch} = this.props;
        const {list = []} = users;
        const find = _.find(list, {userId: id});
        console.log(find);
        if (find) {
            dispatch(userA.handleDeleteRow(find));
        }
    }

    handleUpdateRow = (id) => {
        const {users = {}, dispatch} = this.props;
        const {list = []} = users;
        const find = _.find(list, {userId: id});
        if (find) {
            dispatch(userA.handleUpdateRow(find));
        }
    }

    handleClose = () => {
        this.props.dispatch(userA.modal(false));
    }

    onDelete = () => {
        const {users = {}, dispatch} = this.props;
        const {current = {}} = users;
        const id = current.userId;
        if (id) {
            dispatch(userA.deleteUser({id: id}));
        }
    }

    handleSearch = async (e) => {
        const {name, value} = e.target;
        const {dispatch, users = {}} = this.props;
        const {search = {}, pagination = {}} = users;
        search[name] = value;
        if (pagination.currentPage === 0) {
            await new Promise(resolve => {
                dispatch(userA.handleSearch(name, value));
                resolve();
            }).then(() => {
                this.getData(search, pagination)
            })
        } else {
            dispatch(userA.getUsers('pagination', {currentPage: 0}));
            await new Promise(resolve => {
                dispatch(userA.handleSearch(name, value));
            }).then(() => {
                this.getData(search, pagination)
            })
        }
    }

    onSearch = () => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.getData();
        }, 500);
    }

    onPageChange = (e, data) => {
        const {activePage} = data;
        const {name, value} = e.target;
        const {users = {}} = this.props;
        const {search = {}, pagination = {}} = users;
        search[name] = value;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    render() {
        const {users = {}} = this.props;
        const {checkPermission} = this.state;
        const {
            open = false,
            current = {username: '', userId: ''},
            search = {str: ''},
            searchLoading = false,
            pagination = {currentPage: 0, countPage: 1},
            list = []
        } = users;
        let insert = [];
        let checkRole = true;
        let _list = [];
        let _header = ['STT', 'Tên tài khoản', 'Họ tên', 'Email', 'Nhóm quyền', 'Admin', 'Mô tả', 'Ngày tạo'];
        let _update = _.find(checkPermission, {actionKey: 'update'});
        let _delete = _.find(checkPermission, {actionKey: 'delete'});
        let _insert = _.find(checkPermission, {actionKey: 'insert'});
        let _view = _.find(checkPermission, {actionKey: 'view'});
        if (_insert) {
            insert = (<Grid.Column
                floated='right'
                textAlign="right"
                computer={3}
                largeScreen={3}
                tablet={5}
                moblie={8}>

                <Link to={prevURL + "/admin/user-edit"}><Button primary>Insert</Button></Link>
            </Grid.Column>)
        }
        _.forEach(list, (item, i) => {
            let index = (pagination.currentPage * pagination.sizePage) + i + 1;
            let children = [index];
            _.forEach(['username', 'fullName', 'email', 'groups', 'type', 'description', 'createdDate'], c => {
                let value = item[c];
                if (c === 'createdDate') {
                    value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                } else if (c === 'groups') {
                    let temp = [];
                    _.forEach(value, v => {
                        temp.push(v.groupName);
                    });
                    value = temp.join(', ');
                } else if (c === 'type') {
                    value = value === 1 ? <Icon className='icon-success' name="check"/> : '';
                }
                if (_.isNull(value)) value = '';
                children.push(value);
            });
            const id = item.userId;
            let test = [];
            if (_.isNil(_view) && _.isNil(_update) && _.isNil(_delete)) {
                checkRole = false
            } else {
                if (_.isNil(_update) && _.isNil(_delete)) {
                    _header = ['STT', 'Tên tài khoản', 'Họ tên', 'Email', 'Nhóm quyền', 'Admin', 'Mô tả', 'Ngày tạo'];
                } else {
                    if (_update) {
                        test.push(
                            <Link to={`${prevURL}/admin/user-edit?id=${id}`} key={index}>
                                <Button size="mini" icon onClick={() => this.handleUpdateRow(id)}>
                                    <Icon name="pencil"/>
                                </Button>
                            </Link>
                        )
                    }
                    if (_delete) {
                        test.push(<Button color="red" size="mini" icon onClick={() => this.handleDeleteRow(id)}
                                          key={-index}>
                            <Icon name="delete"/>
                        </Button>)
                    }
                    _header = ['STT', 'Tên tài khoản', 'Họ tên', 'Email', 'Nhóm quyền', 'Admin', 'Mô tả', 'Ngày tạo', ''];
                    children.push({
                        cell: (<React.Fragment>
                            {test}
                        </React.Fragment>),
                        props: {
                            textAlign: 'center'
                        }
                    });
                }
                _list.push(children);
            }

        });
        const header = [_header];
        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>User List</Header>
                        <ToastContainer enableMultiContainer/>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input icon='search' placeholder="Tìm kiếm..." name='str' loading={searchLoading}
                                       value={search.str} onChange={this.handleSearch}/>
                            </Grid.Column>
                            {insert}
                        </Grid>
                        {checkRole ? <CustomTable
                            header={header}
                            body={_list}
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
                            <Modal.Header>Xóa User</Modal.Header>
                            <Modal.Content>
                                <p>Bạn có muốn xóa User: {`"${current.username}"`} không?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose}>Không</Button>
                                <Button positive icon='checkmark' labelPosition='right' content='Có'
                                        onClick={this.onDelete}/>
                            </Modal.Actions>
                        </Modal>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({users}) => ({users});

export default connect(mapStateToProps, null)(Users);