import React from 'react';
import {Label, Header, Segment, Form, Grid, FormGroup} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {connect} from 'react-redux';
import history from "../history";
import {rackA} from '../../redux/_actions/categories/rackA';
import _ from 'lodash';
import _config from '../../utils/config';
import Cookies from 'js-cookie';

const prevURL = _config[_config.environment].prevURL;


class AddDevice extends React.Component {
    //
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         disableFormDevice: true,
    //     }
    // }

    componentDidMount() {
        const {racks, dispatch, addDevice = {}} = this.props;
        const {action = '', loading = 0, current = {}} = racks;
        let _current = Cookies.get('current');
        let _addDevice = Cookies.get('addDevice');
        if (_current && _addDevice) {
            _current = JSON.parse(_current);
            dispatch(rackA.updateCurrent('current', _current));
            _addDevice = JSON.parse(_addDevice);
            dispatch(rackA.handleAddDevice(_addDevice));
            this.resetCookies();
        }
        const deviceTest = history.location;
        const query = deviceTest.search || "";
        const params = new URLSearchParams(query);
        const rackId = params.get('id');
        if (!rackId) {
            document.title = "Add Device";
            dispatch(rackA.initUpdate({action: 'insert', hideForm: true}));
        } else {
            dispatch(rackA.initUpdate({action: 'update', hideForm: false}));
            dispatch(rackA.getDeviceById({deviceId: rackId}));
            document.title = "Edit Device";
        }
        this.getData();
    }

    componentWillReceiveProps = (nextProps) => {
        const {racks} = nextProps;
        const {action = '', loading = 0, current = {}} = racks;
        const {addDevice = {}} = racks;
        if (action === 'insert' && !_.isUndefined(addDevice.saveSuccess) && addDevice.saveSuccess) {
            const url = prevURL + '/categories/rack-view?id=' + current.rackId;
            history.push(url);
        }
        // if((action === 'insert' && loading === 2 && !_.isUndefined(current.deviceId) && current.deviceId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
        //     history.push('/categories/rack-view');
        // }
        // if(action === 'update' && loading === 0 && _.size(current) > 0) {
        //     if(current.parentId) this.setState({isParent: false});
        // }
    }

    getData = () => {
        this.props.dispatch(rackA.getOthersPlus());
    }

    getHeightMax = () => {
        let {racks} = this.props;
        let {addDevice = {}, current = {}} = racks;
        let height = parseInt(addDevice.positionU);
        if (!_.isUndefined(current.bookingUs) || !_.isNull(current.bookingUs)) { // co' bookingUs
            let book = current.bookingUs.filter((item, index) => {
                return item.position === addDevice.position && item.positionU < addDevice.positionU;
            });
            if (book.length > 0) {
                let bookMax = book.reduce((prev, curr) => {
                    return prev.positionU > curr.positionU ? prev : curr;
                });
                height = addDevice.positionU - bookMax.positionU;
            }
        }
        if (!_.isUndefined(current.devices) || !_.isNull(current.devices)) { // co' devices
            let device = current.devices.filter((item, index) => {
                return item.position === addDevice.position && item.positionU < addDevice.positionU;
            });
            if (device.length > 0) {
                let deviceMax = device.reduce((prev, curr) => {
                    return prev.positionU > curr.positionU ? prev : curr;
                });
                if ((addDevice.positionU - deviceMax.positionU) < height) {
                    height = addDevice.positionU - deviceMax.positionU;
                }
            }
        }
        return height;
    }

    validate = () => {
        let {racks, dispatch} = this.props;
        let {addDevice = {}} = racks;
        let err = 0;
        let deviceName = '',
            connectorNumber = '',
            deviceTypeId = '',
            deviceTemplateId = '',
            contract = '',
            ip = '',
            height = '';
        let regexIP = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");

        if (!addDevice.deviceName) {
            deviceName = 'This field is required';
            err++;
        }
        if (!addDevice.connectorNumber) {
            connectorNumber = 'This field is required';
            err++;
        }
        if (!addDevice.deviceTypeId) {
            deviceTypeId = 'This field is required';
            err++;
        }
        if (!addDevice.deviceTemplateId) {
            deviceTemplateId = 'This field is required';
            err++;
        }
        if (!addDevice.contract) {
            contract = 'This field is required';
        }

        if (!addDevice.height) {
            height = 'This field is required';
            err++;
        } else if (parseInt(addDevice.height) > this.getHeightMax()) {
            height = 'Height less than or equal ' + this.getHeightMax();
            err++;
        }
        if (err === 0) {
            return true;
        }
        console.log("hei", this.getHeightMax());
        dispatch(rackA.validate({deviceName, connectorNumber, deviceTypeId, deviceTemplateId, contract, ip, height}));
        return false;
    }

    handleSave = (e) => {
        if (!this.validate()) return false;
        const {racks = {}, dispatch} = this.props;
        let {current = {}, addDevice = {}} = racks;
        let data = {
            rackId: current.rackId,
            dataCenterKey: current.dataCenterKey,
            codeRoom: current.codeRoom,
            rackName: current.rackName,
            ...addDevice,
        };
        dispatch(rackA.addDevice(data));
    }

    handleCancel = () => {
        const {racks = {}, history} = this.props;
        if (racks.current.rackId) {
            history.push(prevURL + '/categories/rack-view?id=' + racks.current.rackId);
        }
        // history.push('/categories/racks');
    }

    handleChangeInput = (e) => {
        const {racks = {}, dispatch} = this.props;
        const {addDevice = {}} = racks;
        const {name, value} = e.target;

        dispatch(rackA.handleAddDevice({
            ...addDevice,
            [name]: value
        }));
    }

    handleSelect = (e, data) => {
        // if (data.name === "deviceTemplateId") {
        //     this.setState({
        //         disableFormDevice: false
        //     })
        // }
        const {value, name} = data;
        const {dispatch, racks = {}} = this.props;
        const {deviceTemplate = [], addDevice = {}, device = {}} = racks;
        let result = deviceTemplate.filter((item, idx) => {
            return item.deviceTypeId === value;
        }).map(item => {
            // console.log(item);
            let temp = {
                deviceTypeId: item.deviceTypeId,
                deviceTemplateId: item.deviceTemplateId,
                deviceTemplateName: item.deviceTemplateName,
                // fullName: '',
                CPU: item.CPU,
                HDD: item.HDD,
                RAM: item.RAM,
                power: item.maxPower,
                height: item.height
            };
            return temp;
        });
        dispatch(rackA.updateCurrent('device', ...result));
        dispatch(rackA.handleAddDevice({
            ...addDevice,
            ...result,
            [name]: value
        }));
        dispatch(rackA.initUpdate({hideForm: false}));
    }

    getDeviceType = () => {
        const {racks = {}} = this.props;
        const {deviceType = []} = racks;
        let result = deviceType.map((item, index) => {
            let temp = {
                text: item.deviceTypeName,
                value: item.deviceTypeId
            }
            return temp;
        });
        return result;
    }

    getDeviceTemplate = () => {
        const {racks = {}} = this.props;
        const {deviceTemplate = []} = racks;
        let result = [];
        if (_.isUndefined(racks.addDevice) || _.isUndefined(racks.addDevice.deviceTypeId) || _.isNull(racks.addDevice.deviceTypeId)) {
            return result;
        }
        result = deviceTemplate.filter((item, index) => {
            return item.deviceTypeId === racks.addDevice.deviceTypeId;
        }).map(item => {
            let temp = {
                text: item.deviceTemplateName,
                value: item.deviceTemplateId
            }
            return temp;
        });
        return result;
    }

    resetCookies = () => {
        Cookies.remove('current');
        Cookies.remove('addDevice');
    }

    getContracts = () => {
        const {racks = {}} = this.props;
        const {contracts = []} = racks;
        let result = contracts.map((item, index) => {
            let temp = {
                text: item.contractId + ' - ' + item.contractName,
                value: item.contractId
            }
            return temp;
        });
        return result;
    }

    getDepartments = () => {
        const {racks = {}} = this.props;
        const {departments = []} = racks;
        let result = departments.map((item, index) => {
            let temp = {
                text: item.departmentName,
                value: item.departmentId
            }
            return temp;
        });
        return result;
    }

    render() {
        let {racks = {}} = this.props;
        let {
            current = {
                deviceName: '',
                label: '',
                connectorNumber: '',
                position: '',
                positionU: '',
                height: '',
                deviceTypeId: '',
                deviceTemplateId: '',
                contractId: '',
                IP: '',
                // fullName: '',
                departmentId: '',
                phone: '',
                CPU: '',
                RAM: '',
                HDD: '',
                power: '',
                typeServer: ''
            }, addDevice = {}, device = {}, loading = 0, action, hideForm = true,
            validate = {
                deviceName: '',
                label: '',
                connectorNumber: '',
                position: '',
                positionU: '',
                height: '',
                deviceTypeId: '',
                deviceTemplateId: '',
                contractId: '',
                IP: '',
                // fullName: '',
                CPU: '',
                departmentId: '',
                phone: '',
                HDD: '',
                typeServer: '',
                power: '',
                RAM: ''
            }
        } = racks;
        const title = action === 'update' ? 'Edit Device' : 'Add Device';

        const formDevice = [];
        if (hideForm === true) {
            formDevice.push("")
        } else {
            formDevice.push(
                <Grid.Column>
                    <Form>
                        <Form.Group className="form-group" widths='equal'>
                            <Form.Input
                                name='HDD'
                                value={device.HDD}
                                disabled
                                onChange={this.handleChangeInput}
                                fluid
                                label={<label>HDD</label>}
                            />
                        </Form.Group>
                        <Form.Group className="form-group" widths='equal'>
                            <Form.Input
                                name='CPU'
                                value={device.CPU}
                                onChange={this.handleChangeInput}
                                disabled
                                fluid
                                label={<label>CPU</label>}
                            />
                        </Form.Group>
                        <Form.Group className="form-group" widths='equal'>
                            <Form.Input
                                name='RAM'
                                value={device.RAM}
                                onChange={this.handleChangeInput}
                                fluid
                                disabled
                                label={<label>RAM</label>}
                            />
                        </Form.Group>
                        <Form.Group className="form-group" widths='equal'>
                            <Form.Input
                                name='height'
                                value={device.height}
                                onChange={this.handleChangeInput}
                                fluid
                                type='number'
                                // max={42} min={1}
                                disabled
                                label={<label>Height</label>}
                                // error={validate.height? true: false}
                            />
                            {/*<Label className={`error-text ${validate.height ? '' : 'hide'}`} basic color='red' pointing>*/}
                            {/*    {validate.height}*/}
                            {/*</Label>*/}
                        </Form.Group>
                        <Form.Group className="form-group" widths='equal'>
                            <Form.Input
                                name='power'
                                value={device.power}
                                onChange={this.handleChangeInput}
                                fluid
                                disabled
                                label={<label>Power</label>}
                            />
                        </Form.Group>

                    </Form>
                </Grid.Column>
            )
        }
        // console.log(addDevice);
        // console.log(racks);
        return (
            <div>
                {/*<Head>*/}
                {/*    <title>{title}</title>*/}
                {/*</Head>*/}
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        <Grid divided='vertically'>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <Form>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='rackName'
                                                value={current.rackName}
                                                fluid
                                                label={<label>Rack name</label>}
                                                disabled
                                            />
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='position'
                                                value={addDevice.position ? addDevice.position + ' - ' + addDevice.positionU : ''}
                                                fluid
                                                label={<label>Position</label>}
                                                disabled
                                            />
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='deviceName'
                                                value={current.deviceName}
                                                onChange={this.handleChangeInput}
                                                fluid
                                                label={<label>Device name <strong className="error-validate">*</strong></label>}
                                                placeholder='Device name'
                                                error={validate.deviceName ? true : false}
                                            />
                                            <Label className={`error-text ${validate.deviceName ? '' : 'hide'}`} basic
                                                   color='red' pointing>
                                                {validate.deviceName}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='connectorNumber'
                                                value={current.connectorNumber}
                                                onChange={this.handleChangeInput}
                                                fluid
                                                type='number'
                                                label={<label>Connector number <strong
                                                    className="error-validate">*</strong></label>}
                                                placeholder='Connector number'
                                                error={validate.connectorNumber ? true : false}
                                            />
                                            <Label className={`error-text ${validate.connectorNumber ? '' : 'hide'}`}
                                                   basic color='red' pointing>
                                                {validate.connectorNumber}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Dropdown
                                                name='deviceTypeId'
                                                label={<label>Device Type <strong className="error-validate">*</strong></label>}
                                                fluid
                                                placeholder='Select...'
                                                search
                                                selection
                                                clearable
                                                options={this.getDeviceType()}
                                                onChange={this.handleSelect}
                                                value={addDevice.deviceTypeId || ''}
                                                error={validate.deviceTypeId ? true : false}
                                            />
                                            <Label className={`error-text ${validate.deviceTypeId ? '' : 'hide'}`} basic
                                                   color='red' pointing>
                                                {validate.deviceTypeId}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Dropdown
                                                name='deviceTemplateId'
                                                label={<label>Device Template <strong
                                                    className="error-validate">*</strong></label>}
                                                fluid
                                                placeholder='Select...'
                                                search
                                                selection
                                                clearable
                                                options={this.getDeviceTemplate()}
                                                onChange={this.handleSelect}
                                                value={addDevice.deviceTemplateId || ''}
                                                error={validate.deviceTemplateId ? true : false}
                                            />
                                            <Label className={`error-text ${validate.deviceTemplateId ? '' : 'hide'}`}
                                                   basic color='red' pointing>
                                                {validate.deviceTemplateId}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Button secondary type='submit' disabled={loading === 1}
                                                         onClick={this.handleCancel}>Cancel</Form.Button>
                                            <Form.Button primary type='submit' disabled={loading === 1}
                                                         onClick={this.handleSave}>Save</Form.Button>
                                        </Form.Group>
                                    </Form>
                                </Grid.Column>
                                {formDevice}

                                <Grid.Column>
                                    <Form>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Dropdown
                                                name='contractId'
                                                label={<label>Contract code <strong
                                                    className="error-validate">*</strong></label>}
                                                fluid
                                                placeholder='Select...'
                                                search
                                                selection
                                                clearable
                                                options={this.getContracts()}
                                                onChange={this.handleSelect}
                                                value={current.contractId || ''}
                                                error={validate.contractId ? true : false}
                                            />
                                            <Label className={`error-text ${validate.contractId ? '' : 'hide'}`} basic
                                                   color='red' pointing>
                                                {validate.contractId}
                                            </Label>
                                        </Form.Group>
                                        {/*<Form.Group className="form-group" widths='equal'>*/}
                                        {/*    <Form.Input */}
                                        {/*        name='fullName'*/}
                                        {/*        value={device.fullName} */}
                                        {/*        onChange={this.handleChangeInput} */}
                                        {/*        fluid */}
                                        {/*        label={<label>Full Name</label>}*/}
                                        {/*    />*/}
                                        {/*</Form.Group>*/}
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Dropdown
                                                name='departmentId'
                                                label={<label>Department <strong
                                                    className="error-validate">*</strong></label>}
                                                fluid
                                                placeholder='Select...'
                                                search
                                                selection
                                                clearable
                                                options={this.getDepartments()}
                                                onChange={this.handleSelect}
                                                value={current.departmentId || ''}
                                                error={current.departmentId ? true : false}
                                            />
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='phone'
                                                value={device.phone}
                                                onChange={this.handleChangeInput}
                                                fluid
                                                label={<label>Phone</label>}
                                            />
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='typeServer'
                                                value={device.typeServer}
                                                onChange={this.handleChangeInput}
                                                fluid
                                                label={<label>Type Server</label>}
                                            />
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='IP'
                                                value={device.IP}
                                                onChange={this.handleChangeInput}
                                                fluid
                                                label={<label>IP</label>}
                                            />
                                        </Form.Group>

                                    </Form>

                                </Grid.Column>

                            </Grid.Row>
                        </Grid>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}


const mapStateToProps = ({racks}) => ({racks});

export default connect(mapStateToProps, null)(AddDevice);