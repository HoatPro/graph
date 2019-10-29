import React from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Modal, Message} from 'semantic-ui-react';
import DashboardLayout from "../../components/Layout/DashboardLayout";
import CustomTable from "../../components/Table/Table";
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import {groupA} from "../../redux/_actions/admin/groupA";
import _ from 'lodash';
import moment from 'moment/moment';
import _config from "../../utils/config";
import {ToastContainer} from 'react-toastify';

const prevURL = _config[_config.environment].prevURL;

class Groups extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeout: null,
            checkPermission: []
        }
    }

    componentDidMount() {
        this.getData();
        document.title = "Group list";
        const data = localStorage.getItem('user');
        const userInfo = JSON.parse(data);
        let arrayData = userInfo.permissions;
        let children = []
        arrayData.map(data => {
            if (data.routeKey === "/admin") {
                children = data.children;
            }
        });
        let checkPermission = [];
        children.map(data => {
            if (data.routeKey === "/groups") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
    }

    componentWillReceiveProps = (nextProps) => {
        const {groups} = nextProps;
        const {action = '', loading = false, current = {}} = groups;
        if (action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData = (_search, _pagination) => {
        const {groups = {}, dispatch} = this.props;
        const {search = {}, pagination = {}} = groups;
        dispatch(groupA.getGroups({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow = id => {
        const {groups, dispatch} = this.props;
        const {list = []} = groups;
        const find = _.find(list, {groupId: id});
        if (find) {
            dispatch(groupA.handleDeleteRow(find));
        }
    }

    handleUpdateRow = id => {
        const {groups = {}, dispatch} = this.props;
        const {list = []} = groups;
        const find = _.find(list, {groupId: id});
        if (find) {
            dispatch(groupA.handleUpdateRow(find));
        }
    }

    handleClose = () => {
        this.props.dispatch(groupA.modal(false));
    }

    onDelete = () => {
        const {groups = {}} = this.props;
        const {current = {}} = groups;
        const id = current.groupId;
        if (id) this.props.dispatch(groupA.deleteGroup({id: id}));
    }

    handleSearch = e => {
        const {name, value} = e.target;
        const {groups, dispatch} = this.props;
        let {search = {}, pagination = {}} = groups;
        search[name] = value;
        if (pagination.currentPage === 0) {
            dispatch(groupA.handleSearch(value));
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.getData(search, pagination);
            }, 500);
        } else {
            dispatch(groupA.getGroups('pagination', {currentPage: 0}))
            dispatch(groupA.handleSearch(value));
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.getData(search, pagination);
            }, 500);
        }

    }

    onPageChange = (e, data) => {
        const {activePage} = data;
        const {name, value} = e.target;
        const {groups = {}} = this.props;
        const {search = {}, pagination = {}} = groups;
        search[name] = value;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    render() {
        const {groups = {}} = this.props;
        const {checkPermission} = this.state;
        const {
            open = false, current = {
                groupName: '',
                groupId: ''
            }, search = {str: ''}, searchLoading = false, pagination = {currentPage: 0, countPage: 1}, list = []
        } = groups;
        let insert = [];
        let checkRole = true;
        let _list = [];
        let _header = ['Index', 'Group name', 'Description', 'Created date'];
        let _update = _.find(checkPermission, {actionKey: 'update'});
        let _delete = _.find(checkPermission, {actionKey: 'delete'});
        let _insert = _.find(checkPermission, {actionKey: 'insert'});
        let _view = _.find(checkPermission, {actionKey: 'view'});
        if (_insert) {
            insert.push(<Grid.Column
                floated='right'
                textAlign="right"
                computer={3}
                largeScreen={3}
                tablet={5}
                moblie={8}
                key={-1}
            >
                <Link to={prevURL + "/admin/group-edit"}><Button primary>Insert</Button></Link>
            </Grid.Column>)
        }

        _.forEach(list, (item, i) => {
            let index = (pagination.currentPage * pagination.sizePage) + i + 1;
            let children = [index];
            _.forEach(['groupName', 'description', 'createdDate'], c => {
                let value = item[c];
                if (c === 'createdDate') {
                    value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                } else if (c === 'roles') {
                    let temp = [];
                    _.forEach(value, v => {
                        temp.push(v.roleName);
                    });
                    value = temp.join(', ');
                }
                if (_.isNull(value)) value = '';
                children.push(value);
            });
            const id = item.groupId;
            let change = [];
            if (_.isNil(_view) && _.isNil(_update) && _.isNil(_delete)) {
                checkRole = false
            } else {
                if (_.isNil(_update) && _.isNil(_delete)) {
                    _header = ['Index', 'Group name', 'Description', 'Created date'];
                } else {
                    if (_update) {
                        change.push(<Link to={`${prevURL}/admin/group-edit?id=${id}`} key={index}>
                            <Button size="mini" icon onClick={() => this.handleUpdateRow(id)}>
                                <Icon name="pencil"/>
                            </Button>
                        </Link>)
                    }
                    _header = ['Index', 'Group name', 'Description', 'Created date', ''];
                    if (_delete) {
                        change.push(<Button color="red" size="mini" icon onClick={() => this.handleDeleteRow(id)}
                                            key={-index}>
                            <Icon name="delete"/>
                        </Button>)
                    }

                    children.push({
                        cell: (<React.Fragment>
                            {change}
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
                        <Header>Group List</Header>
                        <ToastContainer enableMultiContainer/>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input icon='search' placeholder="Search..." name='str' loading={searchLoading}
                                       value={search.str} onChange={this.handleSearch}/>
                            </Grid.Column>
                            {insert}
                        </Grid>
                        {
                            checkRole ? <CustomTable
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
                            </Message>
                        }

                        <Modal size={'mini'} open={open}
                               onClose={this.handleClose}
                               closeOnEscape={true}
                               closeOnDimmerClick={false}
                        >
                            <Modal.Header>Xóa Group</Modal.Header>
                            <Modal.Content>
                                <p>Bạn có muốn xóa Group: {`"${current.groupName}"`} không?</p>
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

const mapStateToProps = ({groups}) => ({groups});

export default connect(mapStateToProps, null)(Groups);