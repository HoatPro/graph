import React from 'react';
import {Label, Header, Segment, Form} from 'semantic-ui-react';
import DashboardLayout from "../../components/Layout/DashboardLayout";
import history from "../history";
import {connect} from 'react-redux';
import {routeA} from "../../redux/_actions/admin/routeA";
import _ from 'lodash';
import _config from "../../utils/config";
import {ToastContainer, toast} from 'react-toastify';

const prevURL = _config[_config.environment].prevURL;

class RouteEdit extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { dispatch} = this.props;
        dispatch(routeA.getAllAction());
        const routerTest = history.location;
        const query = routerTest.search || "";
        const params = new URLSearchParams(query);
        const routeId = params.get('id');
        // const originalUrl = location.pathname;
        if (routeId) {
            dispatch(routeA.initUpdate({action: 'update'}));
            dispatch(routeA.getRouteById({routeId: routeId}));
            document.title="Update Route";
        } else {
            dispatch(routeA.initUpdate({action: 'insert'}));
            document.title="Add new Route";
        }
        this.getData();

    }

    componentWillReceiveProps = (nextProps) => {
        const {routes} = nextProps;
        const {action = '', loading = 0, current = {}} = routes;
        if ((action === 'insert' && loading === 2 && !_.isUndefined(current.routeId) && current.routeId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            history.push(prevURL + '/admin/routes');
        }
        // if(action === 'update' && loading === 0 && _.size(current) > 0) {
        //     if(current.parentId) this.setState({isParent: false});
        // }
    }

    getData = () => {
        this.props.dispatch(routeA.getRouteParents());
    }

    handleParent = (e, data) => {
        const {routes = {}, dispatch} = this.props;
        const {
            current = {
                isParent: true
            }
        } = routes;
        const isParent = data.checked;
        // let data = {...current};
        // console.log(current.actions.length);
        // console.log(actions.length);
        // this.setState({isParent: !this.state.isParent});
        if (isParent) {
            dispatch(routeA.updateCurrent('parent', {
                parentId: '',
                isParent: isParent,
            }));
        } else dispatch(routeA.updateCurrent('parent', {
            isParent: isParent
        }));
    }

    handleSelectParent = (e, data) => {
        const {dispatch, routes = {}} = this.props;
        const {parents = [], actions = []} = routes;
        const value = data.value;
        const find = _.find(parents, {routeId: value});
        if (find) {
            dispatch(routeA.updateCurrent('parentId', {
                parentId: value,
                parentCode: find.code
            }));
        } else {
            dispatch(routeA.updateCurrent('parentId', value));
        }
    }

    validate = () => {
        let {routes, dispatch} = this.props;
        let {current = {}} = routes;
        let routeName = '', routeKey = '';

        if (!current.routeName) {
            routeName = 'May be not empty';
        }
        if (!current.routeKey) {
            routeKey = 'May be not empty';
        }
        if (!routeName && !routeKey) {
            return true;
        }
        dispatch(routeA.validate({routeName: routeName, routeKey: routeKey}));
        return false;
    }

    handleSave = (e) => {
        if (!this.validate()) return false;
        const {routes = {}, dispatch} = this.props;
        let {current = {}, action, actions = []} = routes;
        const {isParent = true, parentId = ''} = current;
        let data = {...current};
        let temp = [];
        _.forEach(data.actions, a => {
            const find = _.find(actions, {actionKey: a});
            if (find) temp.push({actionId: find.actionId, actionKey: find.actionKey});
        });
        data.actions = temp;
        if (action === 'insert') {
            if (isParent === false && parentId.length === 0) {
                toast.error("Please set Parent or Child");
                return;
            } else {
                dispatch(routeA.insertRoute(data));
            }

        } else if (action === 'update') {
            dispatch(routeA.updateRoute(data));
        }
    }

    handleCancel = () => {
        history.push(prevURL + '/admin/routes');
    }

    handleChangeInput = (e) => {
        const {routes, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = routes;
        let _error = '';
        if (!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(routeA.updateCurrent(name, value, _error));
    }

    getId = () => {
        const {originalUrl, dispatch} = this.props;
        const regex = new RegExp(/id\=(\d+)/);
        console.log(originalUrl)
        // const pathname = history.location.pathname;
        const find = originalUrl.match(regex);
        const id = find ? parseInt(find[1]) : null;
        return id;
        // dispatch(stockOrderingActions.viewStockOrdering({id: id}));
    }

    handleCheckbox = (e, data) => {
        this.props.dispatch(routeA.updateCurrent('actions', data));
    }

    checkAll = (e, data) => {
        this.props.dispatch(routeA.checkAll(data.checked));
    }

    render() {
        let {routes = {}} = this.props;
        let {
            current = {
                parentId: '',
                routeName: '',
                routeKey: '',
                description: '',
                actions: [],
                _actions: [],
                isParent: true,
                indeterminate: false,
                viewReadOnly: false,
            },

            validate = {
                routeName: '',
                routeKey: '',
            },
            loading = 0,
            action,
            actions = []
        } = routes;
        let parents = [];
        const isParent = (_.isUndefined(current.isParent) || current.isParent);

        _.forEach(routes.parents, item => {
            parents.push({text: item.routeName, value: item.routeId});
        });
        const title = action === 'update' ? 'Update Route' : 'Insert Route';

        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        <ToastContainer enableMultiContainer/>
                        <Form>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='routeName'
                                    value={current.routeName}
                                    onChange={this.handleChangeInput.bind(this)}
                                    fluid
                                    label={<label>Route name<strong className="error-validate">*</strong></label>}
                                    placeholder='Route name'
                                    error={validate.routeName ? true : false}
                                />
                                <Label className={`error-text ${validate.routeName ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.routeName}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    fluid
                                    name='routeKey'
                                    value={current.routeKey}
                                    onChange={this.handleChangeInput.bind(this)}
                                    label={<label>Route <strong className="error-validate">*</strong></label>}
                                    placeholder='URL (Ex: /routes)' error={validate.routeKey ? true : false}
                                />
                                <Label className={`error-text ${validate.routeKey ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.routeKey}
                                </Label>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Checkbox toggle onChange={this.handleParent.bind(this)} checked={isParent}
                                               label='Is parent'/>
                            </Form.Group>
                            <Form.Group widths='equal' className={isParent ? 'hide' : ''}>
                                <Form.Dropdown
                                    label='Parent'
                                    fluid
                                    placeholder='Select ...'
                                    search
                                    selection
                                    clearable
                                    options={parents}
                                    onChange={this.handleSelectParent.bind(this)}
                                    value={current.parentId}
                                />
                            </Form.Group>
                            <Form.Group className={isParent ? 'hide' : 'form-group'} widths='equal'>
                                <div className="field"><label>Roles</label></div>
                            </Form.Group>
                            <Form.Group inline className={isParent ? 'hide' : ''}>
                                <Form.Checkbox
                                    label="All"
                                    value="all"
                                    checked={current.actions.length === actions.length}
                                    indeterminate={current.indeterminate}
                                    onChange={this.checkAll.bind(this)}
                                />
                                {_.map(actions, (a, i) => {
                                    return <Form.Checkbox
                                        key={i}
                                        label={a.actionName}
                                        value={a.actionKey}
                                        checked={current.actions.indexOf(a.actionKey) > -1}
                                        onChange={this.handleCheckbox.bind(this)}
                                        readOnly={a.actionKey === 'view' ? current.viewReadOnly : false}
                                    />
                                })}
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.TextArea
                                    name='description'
                                    fluid={"true"}
                                    onChange={this.handleChangeInput.bind(this)}
                                    value={current.description || ''}
                                    label='Description'
                                    placeholder='Description'
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Button secondary type='submit' disabled={loading === 1}
                                             onClick={this.handleCancel.bind(this)}>Cancel</Form.Button>
                                <Form.Button primary type='submit' disabled={loading === 1}
                                             onClick={this.handleSave.bind(this)}>Yes</Form.Button>
                            </Form.Group>
                        </Form>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}


const mapStateToProps = ({routes}) => ({routes});


export default connect(mapStateToProps, null)(RouteEdit);