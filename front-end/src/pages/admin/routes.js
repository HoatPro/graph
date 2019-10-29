import React, {Component, Fragment} from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Modal, Message} from 'semantic-ui-react';
import DashboardLayout from "../../components/Layout/DashboardLayout";
import CustomTable from "../../components/Table/Table";
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import {routeA} from "../../redux/_actions/admin/routeA";
import _ from 'lodash';
import moment from 'moment/moment';
import _config from "../../utils/config";
import {toast, ToastContainer} from 'react-toastify';


const prevURL = _config[_config.environment].prevURL;

class Routes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            timeout: null,
            checkPermission: []
        }
    }

    componentDidMount() {
        this.props.dispatch(routeA.getAllAction());
        this.props.dispatch(routeA.getAllRoutes());
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
            if (data.routeKey === "/routes") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
        document.title = "Router List"
    }

    componentWillReceiveProps = (nextProps) => {
        const {routes} = nextProps;
        const {action = '', loading = false, current = {}} = routes;
        if (action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData = (_search, _pagination) => {
        const {routes, dispatch} = this.props;
        const {search = {}, pagination = {}} = routes;
        dispatch(routeA.getRouteParents());
        dispatch(routeA.getRoutes({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow = (id) => {
        const {routes, dispatch} = this.props;
        const {list = [], allRoutes = {}} = routes;
        const find = _.find(list, {routeId: id});
        if (find) {
            if (find.code.length === 6) {
                dispatch(routeA.handleDeleteRow(find))
            } else {
                const parentChild = allRoutes.filter(item => item.children.length === 0);
                _.forEach(parentChild, data => {
                    if (data.routeId === find.routeId) {
                        dispatch(routeA.handleDeleteRow(find))
                    } else {
                        toast.error("Can't delete Parent with more Children");
                        return null;
                    }
                })

            }
        }

    }

    handleUpdateRow = (id) => {
        const {routes = {}, dispatch} = this.props;
        const {list = [], parents = [], actions = []} = routes;
        const find = _.find(list, {routeId: id});
        if (find) {
            let _find = {...find};
            const code = _find.code;
            _find._actions = find.actions;
            _find.actions = _.map(_find.actions, a => a.actionKey);
            if (_find.actions.length > 0 && _find.actions.length < actions.length) {
                _find.indeterminate = true;
            }
            if (code.length > 3) {
                const parent = _.find(parents, {code: code.slice(0, 3)});
                _find.isParent = false;
                _find.parentId = parent.routeId;
            } else {
                _find.isParent = true;
            }
            dispatch(routeA.handleUpdateRow(_find));
        }
    }

    handleClose = () => {
        const {dispatch} = this.props;
        dispatch(routeA.modal(false));
    }

    onDelete = () => {
        const {routes} = this.props;
        const {current = {}} = routes;
        const id = current.routeId;
        if (id) this.props.dispatch(routeA.deleteRoute({id: id}));
    }

    handleSearch = (e) => {
        const {name, value} = e.target;
        const {routes, dispatch} = this.props;
        let {search = {}, pagination = {}} = routes;
        search[name] = value;
        dispatch(routeA.handleSearch(value));
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.getData(search, pagination);
        }, 500);
    }

    onPageChange = (e, data) => {
        const {activePage} = data;
        const {name, value} = e.target;
        const {routes = {}} = this.props;
        const {search = {}, pagination = {}} = routes;
        search[name] = value;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    render() {
        const {routes = {}} = this.props;
        const {checkPermission} = this.state;
        const {
            parents = [], actions = [], open = false, current = {
                routeName: '',
                routeId: '',
            }, search = {str: ''}, searchLoading = false, pagination = {currentPage: 0, countPage: 1}
        } = routes;
        let insert = [];
        let list = [];
        let checkRole = true;
        let _update = _.find(checkPermission, {actionKey: 'update'});
        let _delete = _.find(checkPermission, {actionKey: 'delete'});
        let _insert = _.find(checkPermission, {actionKey: 'insert'});
        let _view = _.find(checkPermission, {actionKey: 'view'});
        let actionLength = actions.length;
        let cellActions = actionLength === 0 ? [
            {cell: <label>View</label>, props: {className: 'cell-border-left text-center'}},
            {cell: <label>Insert</label>, props: {className: 'text-center'}},
            {cell: <label>Update</label>, props: {className: 'text-center'}},
            {cell: <label>Delete</label>, props: {className: 'text-center'}},
        ] : _.map(actions, (a, index) => {
            return {
                cell: <label>{a.actionName}</label>,
                props: index === 0 ? {className: 'cell-border-left text-center'} : {className: 'text-center'}
            };
        });
        let _header = [
            {cell: <label>Index</label>, props: {rowSpan: 2}},
            {cell: <label>Route name</label>, props: {rowSpan: 2}},
            {cell: <label>Route link</label>, props: {rowSpan: 2}},
            {cell: <label>Route parent</label>, props: {rowSpan: 2}},
            {cell: <label>Actions</label>, props: {colSpan: cellActions.length, className: 'text-center'}},
            {cell: <label>Description</label>, props: {rowSpan: 2}},
            {cell: <label>Created date</label>, props: {rowSpan: 2}}
        ];
        if (_insert) {
            insert = (
                <Grid.Column
                    floated='right'
                    textAlign="right"
                    computer={3}
                    largeScreen={3}
                    tablet={5}
                    moblie={8}>
                    <Link to={prevURL + "/admin/route-edit"}><Button primary>Insert</Button></Link>
                </Grid.Column>)
        }
        _.forEach(routes.list, (item, i) => {
            let temp = [];
            let index = 1;
            if (_.isNull(pagination.currentPage) || _.isUndefined(pagination.currentPage)) {
                index = i + 1;
            } else {
                index = (pagination.currentPage * pagination.sizePage) + i + 1;
            }
            temp.push(index);
            _.forEach(['routeName', 'routeKey', 'parentId', 'actions', 'description', 'createdDate'], c => {
                let value = item[c]
                if (c === 'actions') {
                    if (actionLength === 0) actionLength = 4;
                    _.forEach(actions, a => {
                        const index = _.findIndex(value, {actionId: a.actionId});
                        let text = '';
                        if (index > -1) {
                            text = <Icon name="check" color="green"/>;
                        }
                        temp.push({
                            cell: <label>{text}</label>,
                            props: {
                                className: 'text-center'
                            }
                        });
                    })
                    return;
                }

                if (c === 'createdDate') value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                if (c === 'parentId' && item.code.length > 3) {
                    const find = _.find(parents, {code: item.code.slice(0, 3)});
                    if (find) {
                        value = find.routeName;
                    }
                }
                if (_.isNull(value)) value = '';
                temp.push(value);
            });
            const id = item.routeId;
            let change = [];
            if (_.isNil(_view) && _.isNil(_update) && _.isNil(_delete)) {
                checkRole = false
            } else {
                if (_.isNil(_update) && _.isNil(_delete)) {
                    _header = [
                        {cell: <label>Index</label>, props: {rowSpan: 2}},
                        {cell: <label>Route name</label>, props: {rowSpan: 2}},
                        {cell: <label>Route link</label>, props: {rowSpan: 2}},
                        {cell: <label>Route parent</label>, props: {rowSpan: 2}},
                        {cell: <label>Actions</label>, props: {colSpan: cellActions.length, className: 'text-center'}},
                        {cell: <label>Description</label>, props: {rowSpan: 2}},
                        {cell: <label>Created date</label>, props: {rowSpan: 2}}
                    ]
                } else {
                    if (_update) {
                        change.push(
                            <Link to={prevURL + '/admin/route-edit?id=' + id} key={index}>
                                <Button size="mini" icon onClick={() => this.handleUpdateRow(id)}>
                                    <Icon name="pencil"/>
                                </Button>
                            </Link>
                        )
                    }
                    _header = [

                        {cell: <label>Index</label>, props: {rowSpan: 2}},
                        {cell: <label>Route name</label>, props: {rowSpan: 2}},
                        {cell: <label>Route link</label>, props: {rowSpan: 2}},
                        {cell: <label>Route parent</label>, props: {rowSpan: 2}},
                        {
                            cell: <label>Actions</label>,
                            props: {colSpan: cellActions.length, className: 'text-center'}
                        },
                        {cell: <label>Description</label>, props: {rowSpan: 2}},
                        {cell: <label>Created date</label>, props: {rowSpan: 2}},
                        {cell: <label></label>, props: {rowSpan: 2}}
                    ];
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

            }
            list.push(temp);
        });
        const header = [_header, cellActions];
        const columnCount = header[0].length + header[1].length - 1;
        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>Route list</Header>
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
                            body={list}
                            pagination={true}
                            paginationProps={{
                                defaultActivePage: pagination.currentPage + 1,
                                totalPages: pagination.countPage
                            }}
                            onPageChange={this.onPageChange}
                            columnCount={columnCount}
                        /> : <Message negative>
                            <Message.Header style={{textAlign: "center"}}>You don't have permission to view this
                                page!</Message.Header>
                        </Message>}

                        <Modal size={'mini'} open={open}
                               onClose={this.handleClose}
                               closeOnEscape={true}
                               closeOnDimmerClick={false}
                        >
                            <Modal.Header>Delete Route</Modal.Header>
                            <Modal.Content>
                                <p>Do you want to delete the Route: {`"${current.routeName}"`}?</p>
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

const mapStateToProps = ({routes}) => ({routes});

export default connect(mapStateToProps, null)(Routes);