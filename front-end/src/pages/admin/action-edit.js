import React from 'react';
import {Form, Header, Label, Segment} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {connect} from 'react-redux';
import history from "../history";
import {actionA} from '../../redux/_actions/admin/actionA';
import _ from 'lodash';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import _config from '../../utils/config';
import {ToastContainer} from 'react-toastify';


const prevURL = _config[_config.environment].prevURL;

class ActionEdit extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {dispatch} = this.props;
        const actionTest = history.location;
        const query = actionTest.search || "";
        const params = new URLSearchParams(query);
        const actionId = params.get('id');
        if (actionId) {
            dispatch(actionA.initUpdate({action: 'update'}));
            dispatch(actionA.getActionById({actionId: actionId}));
            document.title = "Update Action"
        } else {
            dispatch(actionA.initUpdate({action: 'insert'}));
            document.title = "Add New Action"
        }
    }

    componentWillReceiveProps(nextProps) {
        const {actions} = nextProps;
        const {action = '', loading = 0, current = {}} = actions;
        if ((action === 'insert' && loading === 2 && !_.isUndefined(current.actionId) && current.actionId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            history.push(prevURL + '/admin/actions');
        }
    }

    validate() {
        let {actions, dispatch} = this.props;
        let {current = {}} = actions;

        let actionName = '';
        let actionKey = '';
        if (!current.actionName) {
            actionName = 'May be not empty';
        }

        if (!current.actionKey) {
            actionKey = 'May be not empty';
        }

        if (!actionName && !actionKey) {
            return true;
        }
        dispatch(actionA.validate({actionName: actionName, actionKey: actionKey}));
        return false;
    }

    handleSave = e => {
        if (!this.validate()) return false;
        const {actions, dispatch} = this.props;
        let {current, action} = actions;
        if (action === 'insert') {
            dispatch(actionA.insertAction(current));
        } else if (action === 'update') {
            dispatch(actionA.updateAction(current));
        }
    }

    handleCancel = () => {
        history.push(prevURL + '/admin/actions');
    }

    handleChangeInput = e => {
        const {actions = {}, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = actions;
        let _error = '';
        if (!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(actionA.updateCurrent(name, value, _error));
    }

    render() {
        let {actions = {}} = this.props;
        let {
            current = {
                actionId: '',
                actionName: '',
                icon: '',
                description: ''
            }, validate = {
                actionName: '',
                actionKey: '',
            }, loading = 0, action, operations = [], routes = [], expanded = []
        } = actions;
        const title = action === 'update' ? 'Update Action' : 'Add new Action';

        const _routes = _.map(routes, item => ({text: item.routeName, value: item.routeId}));

        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        <ToastContainer enableMultiContainer/>
                        <Form>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='actionName'
                                    value={current.actionName}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    label={<label>Action name<strong className="error-validate">*</strong></label>}
                                    placeholder='Tên Action' error={validate.actionName ? true : false}/>
                                <Label className={`error-text ${validate.actionName ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.actionName}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='actionKey'
                                    value={current.actionKey}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    label={<label>Action key<strong className="error-validate">*</strong></label>}
                                    placeholder='Action key' error={validate.actionKey ? true : false}/>
                                <Label className={`error-text ${validate.actionKey ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.actionKey}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='icon'
                                    value={current.icon}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    label={<label>Icon</label>}
                                    placeholder='Icon'/>

                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.TextArea
                                    name='description'
                                    fluid={"true"}
                                    rows={3}
                                    onChange={this.handleChangeInput} value={current.description || ''}
                                    label='Description' placeholder='Description'/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Button secondary type='submit' disabled={loading === 1}
                                             onClick={this.handleCancel}>Hủy</Form.Button>
                                <Form.Button primary type='submit' disabled={loading === 1}
                                             onClick={this.handleSave}>Lưu</Form.Button>
                            </Form.Group>
                        </Form>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({actions}) => ({actions});

export default connect(mapStateToProps, null)(ActionEdit);