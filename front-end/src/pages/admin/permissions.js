import React from 'react';
import {
    Sticky,
    Table,
    Popup,
    Grid,
    Segment,
    Icon,
    Accordion,
    Checkbox,
    Input,
    Button,
    Message
} from 'semantic-ui-react';
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {connect} from 'react-redux';
import {permissionA} from "../../redux/_actions/admin/permissionA";
import _ from 'lodash';
import Base from '../../assets/js/base';
import _config from "../../utils/config";

const prevURL = _config[_config.environment].prevURL;

class Permissions extends React.Component {

    constructor(props) {
        super(props);
        this.base = new Base();
        this.state = {
            checkPermission: []
        };
    }

    componentDidMount() {
        this.getData();
        this.getData2();
        document.title = "Permissions List";
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
            if (data.routeKey === "/permissions") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
    }

    // componentWillReceiveProps(nextProps) {
    //     const {permissions = {}, dispatch} = this.props;
    //     const {routes = [], groups = [], current = {}} = permissions;
    //     const _permissions = nextProps.permissions || {};
    //     const _groups = _permissions.groups || {};
    //     const _routes = _permissions.routes || {};
    //     console.log(_routes);
    //     // if(_.size(groups) === 0 && _.size(_groups) > 0) {
    //     //     const first = _groups[0];
    //     //     dispatch(permissionA.updateCurrent('groupId', first.groupId));
    //     //     dispatch(permissionA.getPermission({groupId: first.groupId}));
    //     // }
    // }

    getData = (_search, _pagination) => {
        const {dispatch} = this.props;
        dispatch(permissionA.getOthers());
    }

    getData2() {
        const {dispatch} = this.props;
        dispatch(permissionA.test());
    }

    getHeader = (data) => {
        let max = 0;
        let header = [];
        let routeActive = {};
        const show = {0: 'view', 1: 'insert', 2: 'update', 3: 'delete'};
        // find max of actions length
        _.forEach(data, (r, i) => {
            if (i === 0) data = r;
            const children = r.children || [];
            if (_.size(children) === 0) {
                routeActive = r;
            } else {
                routeActive = children[0];
            }
            const length = r._actions.length || 0;
            if (length > max) max = length;
        });
        for (let i = 0; i < max; i++) {
            let action = show[i] || '';
            let item = {
                icon: 'setting',
                actionKey: '',
                actionName: 'Other'
            };
            if (action) {
                const actions = routeActive._actions;
                let find = _.find(actions, {actionKey: action});
                if (find) {
                    item = {
                        icon: find.icon,
                        actionKey: find.actionKey,
                        actionName: find.actionName
                    }
                }
            }
            header.push(item);
        }
        return header;
    }

    handleClickRow = e => {
        const {permissions = {}, dispatch} = this.props;
        const {current = {}, routes = []} = permissions;
        let {update = false, auth = [], expand = 0} = current;
        const {target} = e;
        const row = target.tagName === 'TR' ? target : this.base.getParent(target, 'tr');
        const isChild = row.classList.contains('sub-route-item');
        const parent = target.offsetParent;

        if (parent.classList.contains('checkbox')) {
            return false;
        } else if (!isChild) {
            let index = row.getAttribute('index');
            if (index) {
                index = parseInt(index);
                if (index === expand) {
                    dispatch(permissionA.updateCurrent('expand', null));
                } else {
                    dispatch(permissionA.updateCurrent('expand', index));
                }
            }
        }
    }

    handleCheckbox = (e, data) => {
        const {permissions = {}, dispatch} = this.props;
        const {current = {}, routes = []} = permissions;
        let {update = false, auth = [], expand = 0} = current;
        const {target} = e;
        const checked = data.checked;
        let actionId = data['action-id'];
        let isParent = data['is-parent'];
        let routeActionId = data['route-action-id'];
        const row = this.base.getParent(target, 'tr');
        let routeId = row.id;
        routeId = routeId ? parseInt(routeId) : routeId;

        if (!update) return false;
        actionId = parseInt(actionId);
        routeActionId = parseInt(routeActionId);

        if (isParent) {
            const route = _.find(routes, {routeId: routeId});

            if (route) {
                const children = route.children;

                _.forEach(children, c => {
                    const find = _.find(c._actions, {actionId: actionId});

                    if (find) {
                        const index = _.findIndex(auth, {routeId: c.routeId, actionId: actionId});
                        if (checked && index === -1) {
                            auth.push({routeActionId: find.routeActionId, routeId: c.routeId, actionId: actionId});
                        } else if (!checked) auth.splice(index, 1);
                    }
                });
                dispatch(permissionA.updateCurrent('auth', auth));
            }
            return false;
        }

        let index = _.findIndex(auth, {routeId: routeId, actionId: actionId});

        if (index > -1 && !checked) {
            auth.splice(index, 1);
        } else if (index === -1 && checked) {
            auth.push({routeId: routeId, actionId: actionId, routeActionId: routeActionId});
        }

        dispatch(permissionA.updateCurrent('auth', auth));
    }

    handleUpdate = e => {
        const {permissions = {}, dispatch} = this.props;
        const {current = {}} = permissions;
        const {update = false} = current;
        dispatch(permissionA.updateCurrent('update', !update));
    }

    handleCancel = e => {
        const {permissions = {}, dispatch} = this.props;
        const {current = {}} = permissions;
        const {update = false} = current;
        dispatch(permissionA.handleCancel(!update));
    }

    handleSave = e => {
        const {permissions = {}, dispatch} = this.props;
        const {current = {}} = permissions;
        const {auth = [], groupId = null} = current;
        const data = {
            groupId: groupId,
            auth: auth
        };
        dispatch(permissionA.handleSave(data));

    }

    handleClickGroup = e => {
        const {target} = e;
        const {dispatch} = this.props;
        const tr = target.tagName === 'TR' ? target : this.base.getParent(target, 'tr');
        if (tr) {
            let id = tr.id;
            id = parseInt(id);
            dispatch(permissionA.updateCurrent('groupId', id));
            dispatch(permissionA.getPermission({groupId: id}));
        }
    }

    getRouteHasAction = (routes, auth, actionId) => {
        let maxCount = 0;
        let existCount = 0;

        // tim cac route con da dc cap quyen
        _.forEach(routes, r => {
            if (_.findIndex(r._actions, {actionId: actionId}) > -1) {
                if (_.findIndex(auth, {routeId: r.routeId, actionId: actionId}) > -1) {
                    existCount++;
                }
                maxCount++;
            }
        });

        // tim cac route con co the co quyen

        return {
            maxCount, existCount
        };
    }

    renderRow = (route, index, header, parent) => {
        const {permissions = {}} = this.props;
        const {current = {}} = permissions;
        // auth: quyen khi update, _auth: quyen load tu db
        let {auth = [], expand = 0} = current;
        let cells = [];
        let temp = [];
        let diff = null;
        const fix = ['view', 'insert', 'update', 'delete'];
        const _actions = route._actions;
        const routeId = route.routeId;
        const children = route.children;
        const childrenCount = _.size(children);
        const isParent = childrenCount > 0 ? 1 : 0;
        let name = '';

        if (index === expand && !parent) name = 'angle down';
        else if (index !== expand && !parent) name = 'angle right';

        cells.push(<Table.Cell key={routeId}><Icon className='arrow-icon' name={name}/>{route.routeName}</Table.Cell>);
        _.forEach(header, (h, i) => {
            let check = false;
            let indeterminate = false;

            if (fix.indexOf(h.actionKey) > -1) {
                let find = _.find(_actions, {actionKey: h.actionKey});

                if (find) {
                    const routeActionId = find.routeActionId;
                    const actionId = find.actionId;
                    const routeHasAction = this.getRouteHasAction(children, auth, actionId);

                    if (isParent) {
                        indeterminate = routeHasAction.maxCount !== routeHasAction.existCount && routeHasAction.existCount > 0;
                        check = routeHasAction.maxCount === routeHasAction.existCount;
                    } else {
                        if (_.findIndex(auth, {routeId: routeId, actionId: actionId}) > -1) check = true;
                    }

                    cells.push(<Table.Cell key={i}>
                        <Checkbox
                            route-action-id={routeActionId}
                            action-id={actionId}
                            route-id={routeId}
                            is-parent={isParent}
                            checked={check}
                            label={h.actionKey}
                            indeterminate={indeterminate}
                            onChange={this.handleCheckbox.bind(this)}
                        /></Table.Cell>);
                    temp.push(find);
                } else {
                    cells.push(<Table.Cell key={h.actionKey}>{''}</Table.Cell>);
                }
            } else {
                if (!diff) diff = _.differenceWith(_actions, temp, _.isEqual);
                _.forEach(diff, d => {
                    const routeActionId = d.routeActionId;
                    const actionId = d.actionId;
                    check = false;
                    const routeHasAction = this.getRouteHasAction(children, auth, actionId);
                    if (isParent === 1) {
                        indeterminate = routeHasAction.maxCount !== routeHasAction.existCount && routeHasAction.existCount > 0;
                        check = routeHasAction.maxCount === routeHasAction.existCount;
                    } else {
                        if (_.findIndex(auth, {routeId: routeId, actionId: actionId}) > -1) check = true;
                    }

                    cells.push(<Table.Cell key={-i}>
                        <Checkbox
                            route-action-id={routeActionId}
                            checked={check}
                            route-id={routeId}
                            action-id={actionId}
                            is-parent={isParent}
                            indeterminate={indeterminate}
                            label={d.actionKey}
                            onChange={this.handleCheckbox.bind(this)}
                        /></Table.Cell>);
                });

                return false;
            }

        });
        const cLength = cells.length - 1;
        const hLength = header.length;
        if (cLength < hLength) {
            const sub = hLength - cLength;
            for (let i = sub - 1; i >= 0; i--) {
                cells.push(<Table.Cell key={-routeId}>{''}</Table.Cell>)
            }
        }

        return cells;
    }

    renderActions(header) {
        const {permissions = {}} = this.props;
        const {routes = [], current = {}} = permissions;
        let {expand = 0} = current;
        let rows = [];
        //
        _.forEach(routes, (r, i) => {
            const children = r.children;
            const length = _.size(children);
            const id = r.routeId;
            let item = `item-${i}`;
            const colexp = i === expand ? 'expand' : 'collapse';

            rows.push(<Table.Row
                key={id}
                id={id}
                index={i}
                children-count={length}
                active={true}
                className={`route-item ${item} ${colexp}`}
                onClick={this.handleClickRow.bind(this)}>
                {this.renderRow(r, i, header)}
            </Table.Row>);
            // route children
            if (length > 0 && i === expand) {
                _.forEach(children, (c, _i) => {
                    const _id = c.routeId;
                    rows.push(<Table.Row
                        key={_id}
                        id={_id}
                        parent-id={id}
                        index={_i}
                        className={`sub-route-item sub-item-${_i}`}
                        onClick={this.handleClickRow.bind(this)}
                        class-parent={item}>
                        {this.renderRow(c, _i, header, true)}
                    </Table.Row>);
                });
            }
        });

        return rows;
    }

    renderPermission = () => {
        const {permissions = {}} = this.props;
        const {routes = []} = permissions;
        const header = this.getHeader(routes);
        const length = header.length;
        return (<Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell
                        colSpan={length === 0 ? 2 : length + 1}
                        className="text-center">
                        Permissions
                    </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell
                        width={4}
                        className="text-center"
                        rowSpan={2}>
                        Routes
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        width={12}
                        className="text-center"
                        colSpan={length > 0 ? length : 1}>
                        Actions
                    </Table.HeaderCell>
                </Table.Row>
                {length === 0 ? null :
                    <Table.Row>
                        {header.map((h, index) => index === 0 ?
                            <Table.HeaderCell className="cell-border-left" key={index}>
                                <Popup
                                    content={h.actionName}
                                    position='top center'
                                    trigger={<Icon name={h.icon}/>}
                                />
                            </Table.HeaderCell> :
                            <Table.HeaderCell className="" key={-index}>
                                <Popup
                                    content={h.actionName}
                                    position='top center'
                                    trigger={<Icon name={h.icon}/>}
                                />
                            </Table.HeaderCell>)}
                    </Table.Row>
                }
            </Table.Header>
            <Table.Body>
                {this.renderActions(header)}
            </Table.Body>
        </Table>)
    }

    renderGroup = () => {
        const {permissions = {}} = this.props;
        const {groups = [], current = {}} = permissions;
        const {groupId = null} = current;

        return (<Sticky pushing offset={56}>
            <Table celled selectable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell className="text-center">Groups</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        _.map(groups, (g, i) => {
                            return (<Table.Row key={i} className='group-item' id={g.groupId}
                                               onClick={this.handleClickGroup.bind(this)}>
                                <Table.Cell active={g.groupId === groupId}>
                                    {g.groupName}
                                </Table.Cell>
                            </Table.Row>);
                        })
                    }

                </Table.Body>
            </Table>
        </Sticky>)
    }

    render() {
        const {permissions = {}} = this.props;
        const {current = {}} = permissions;
        const {checkPermission} = this.state;
        const _view = _.find(checkPermission, {actionKey: 'view'});
        const _update = _.find(checkPermission, {actionKey: 'update'});
        let component = [];
        const {update = false} = current;
        if (_.isNil(_view) && _.isNil(_update)) {
            component = (<Message negative>
                <Message.Header style={{textAlign: "center"}}>You don't have permission to view this
                    page!</Message.Header>
            </Message>)
        } else {
            if (_.isNil(_update)) {
                component = (
                    <Segment>
                        <Grid celled='internally'>
                            <Grid.Row>
                                <Grid.Column width={3} className="no-padding">
                                    {this.renderGroup()}
                                </Grid.Column>
                                <Grid.Column width={13} className="no-padding">
                                    {this.renderPermission()}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                )
            } else {
                component = (
                    <Segment>
                        <Grid className='grid-toolbar'>
                            <Grid.Column className="margin-10" floated='right' textAlign="right" computer={3}
                                         largeScreen={3} tablet={5} moblie={8}>
                                {update ?
                                    (<Button.Group>
                                        <Button onClick={this.handleCancel}>Cancel</Button>
                                        <Button.Or/>
                                        <Button color="blue" onClick={this.handleSave}>Save</Button>
                                    </Button.Group>)
                                    : (<Button primary onClick={this.handleUpdate}>Edit</Button>)}
                            </Grid.Column>
                        </Grid>
                        <Grid celled='internally'>
                            <Grid.Row>
                                <Grid.Column width={3} className="no-padding">
                                    {this.renderGroup()}
                                </Grid.Column>
                                <Grid.Column width={13} className="no-padding">
                                    {this.renderPermission()}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                )

            }
        }


        return (
            <div>
                <DashboardLayout>
                    {component}
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({permissions}) => ({permissions});

export default connect(mapStateToProps, null)(Permissions);