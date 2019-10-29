import React from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Modal, Message} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import CustomTable from '../../components/Table/Table';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {actionA} from '../../redux/_actions/admin/actionA';
import _ from 'lodash';
import moment from 'moment/moment';
import _config from '../../utils/config';
import {ToastContainer} from 'react-toastify';

const prevURL = _config[_config.environment].prevURL;

class Actions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeout: null,
            checkPermission: []
        }
    }

    componentDidMount() {
        document.title = " Action list ";
        this.getData();
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
            if (data.routeKey === "/actions") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
    }

    componentWillReceiveProps = (nextProps) => {
        const {actions} = nextProps;
        const {action = '', loading = false, current = {}} = actions;
        if (action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData = (_search, _pagination) => {
        const {actions = {}, dispatch} = this.props;
        const {search = {}, pagination = {}} = actions;
        dispatch(actionA.getActions({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow = (id) => {
        const {actions, dispatch} = this.props;
        const {list = []} = actions;
        const find = _.find(list, {actionId: id});
        if (find) {
            dispatch(actionA.handleDeleteRow(find));
        }
    }

    handleUpdateRow = (id) => {
        const {actions = {}, dispatch} = this.props;
        const {list = []} = actions;
        const find = _.find(list, {actionId: id});
        if (find) {
            dispatch(actionA.handleUpdateRow(find));
        }
    }

    handleClose = () => {
        this.props.dispatch(actionA.modal(false));
    }

    onDelete = () => {
        const {actions = {}} = this.props;
        const {current = {}} = actions;
        const id = current.actionId;
        if (id) this.props.dispatch(actionA.deleteAction({id: id}));
    }

    handleSearch = (e) => {
        const {name, value} = e.target;
        const {actions, dispatch} = this.props;
        let {search = {}, pagination = {}} = actions;
        search[name] = value;
        dispatch(actionA.handleSearch(value));
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log(value);
            this.getData(search, pagination);
        }, 500);
    }

    onPageChange = (e, data) => {
        const {activePage} = data;
        const {search = {}, pagination = {}} = this.props;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    render() {
        const {actions = {}} = this.props;
        const {checkPermission} = this.state;
        const {
            open = false, operations = [], current = {
                actionName: '',
                actionId: ''
            }, search = {str: ''}, searchLoading = false, pagination = {currentPage: 0, countPage: 1}, list = []
        } = actions;

        let insert = [];
        let _list = [];
        let _header = ['Index', 'Action Name', ' Action Key', ' Icon', ' Description', ' Create date'];
        let checkRole = true;
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
                <Link to={prevURL + "/admin/action-edit"}><Button primary>Insert</Button></Link>
            </Grid.Column>)
        }
        _.forEach(list, (item, i) => {
            let index = (pagination.currentPage * pagination.sizePage) + i + 1;
            let children = [index];
            _.forEach(['actionName', 'actionKey', 'icon', 'description', 'createdDate'], c => {
                let value = item[c];
                if (c === 'createdDate') {
                    value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                    children.push(value);
                } else {
                    children.push(value);
                }
            });
            const id = item.actionId;
            let change = [];
            if (_.isNil(_view) && _.isNil(_update) && _.isNil(_delete)) {
                checkRole = false
            } else {
                if (_.isNil(_update) && _.isNil(_delete)) {
                    checkRole = true
                } else {
                    if (_update) {
                        change.push(
                            <Link to={`${prevURL}/admin/action-edit?id=${id}`} key={index}>
                                <Button size="mini" icon onClick={() => this.handleUpdateRow(id)}>
                                    <Icon name="pencil"/>
                                </Button>
                            </Link>
                        )

                    }
                    _header = ['Index', 'Action Name', ' Action Key', ' Icon', ' Description', ' Create date', ''];

                    if (_delete) {
                        change.push(
                            <Button color="red" size="mini" icon onClick={() => this.handleDeleteRow(id)} key={-index}>
                                <Icon name="delete"/>
                            </Button>
                        )
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
                        <Header>Action list</Header>
                        <ToastContainer enableMultiContainer/>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input icon='search' placeholder="Search..." name='str' loading={searchLoading}
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
                            <Modal.Header>Delete Action</Modal.Header>
                            <Modal.Content>
                                <p>Do you want to delete the action: {`"${current.actionName}"`}?</p>
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

const mapStateToProps = ({actions}) => ({actions});

export default connect(mapStateToProps, null)(Actions);