import React from 'react';
import {Label, Header, Segment, Form} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {Router} from "react-router";
import history from "../history";
import {connect} from 'react-redux';
import {deviceTypeA} from '../../redux/_actions/categories/deviceTypeA';
import _ from 'lodash';
import _config from '../../utils/config';
import {regionA} from "../../redux/_actions/categories/regionA";
import {datacenterA} from "../../redux/_actions/categories/datacenterA";

const prevURL = _config[_config.environment].prevURL;

class DeviceTypeEdit extends React.Component {

    constructor(props) {
        super(props);
    }


    componentDidMount() {
        const {deviceTypes, dispatch} = this.props;
        const {action = ''} = deviceTypes;
        const deviceTypeTest = history.location;
        const query = deviceTypeTest.search || "";
        const params = new URLSearchParams(query);
        const deviceTypeId = params.get('id');
        // const originalUrl = location.pathname;

        if (deviceTypeId) {
            dispatch(deviceTypeA.initUpdate({action: 'update'}));
            dispatch(deviceTypeA.getDeviceTypeById({deviceTypeId: deviceTypeId}));
        } else {
            dispatch(deviceTypeA.initUpdate({action: 'insert'}));
        }
        this.getData();

        document.title = action === 'update' ? 'Update Device Type' : 'Add Device Type';
    }

    componentWillReceiveProps = (nextProps) => {
        const {deviceTypes} = nextProps;
        const {action = '', loading = 0, current = {}} = deviceTypes;
        if ((action === 'insert' && loading === 2 && !_.isUndefined(current.deviceTypeId) && current.deviceTypeId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            history.push(prevURL + '/categories/device-types');
        }
        if (action === 'update' && loading === 0 && _.size(current) > 0) {
            if (current.parentId) this.setState({isParent: false});
        }
    }

    getData = () => {
        // this.props.dispatch(deviceTypeA.getOthers());
    }

    validate = () => {
        let {deviceTypes, dispatch} = this.props;
        let {current = {}} = deviceTypes;

        let deviceTypeName = '';
        if (!current.deviceTypeName) {
            deviceTypeName = 'May be not empty';
        }

        if (!deviceTypeName) {
            return true;
        }
        dispatch(deviceTypeA.validate({deviceTypeName: deviceTypeName}));
        return false;
    }

    handleSave = e => {
        if (!this.validate()) return false;
        const {deviceTypes, dispatch} = this.props;
        let {current, action} = deviceTypes;
        if (action === 'insert') {
            dispatch(deviceTypeA.insertDeviceType(current));
        } else if (action === 'update') {
            dispatch(deviceTypeA.updateDeviceType(current));
        }
    }

    handleCancel = () => {
        history.push(prevURL + '/categories/device-types');
    }

    handleChangeInput = e => {
        const {deviceTypes, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = deviceTypes;
        let _error = '';
        if (!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(deviceTypeA.updateCurrent(name, value, _error));
    }

    render() {
        let {deviceTypes} = this.props;
        let {
            current = {
                deviceTypeName: '',
                description: ''
            }, validate = {
                deviceTypeName: '',
            }, loading = 0, action, locations = []
        } = deviceTypes;
        const title = action === 'update' ? 'Update Device Type' : 'Add Device Type';
        const _locations = _.map(locations, item => ({text: item.locationName, value: item.locationId}));
        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        <Form>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='deviceTypeName'
                                    value={current.deviceTypeName}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    label={<label>Name <strong className="error-validate">*</strong></label>}
                                    placeholder='Name'
                                    error={validate.deviceTypeName ? true : false}/>
                                <Label className={`error-text ${validate.deviceTypeName ? '' : 'hide'}`} basic
                                       color='red' pointing>
                                    {validate.deviceTypeName}
                                </Label>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.TextArea name='description' fluid={"true"} onChange={this.handleChangeInput}
                                               value={current.description || ''} label='Description'
                                               placeholder='Description'/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Button secondary type='submit' disabled={loading === 1}
                                             onClick={this.handleCancel}>Cancel</Form.Button>
                                <Form.Button primary type='submit' disabled={loading === 1}
                                             onClick={this.handleSave}>Save</Form.Button>
                            </Form.Group>
                        </Form>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({deviceTypes}) => ({deviceTypes});
export default connect(mapStateToProps, null)(DeviceTypeEdit);