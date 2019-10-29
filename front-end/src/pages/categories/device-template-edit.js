import React from 'react';
import {Label, Header, Segment, Form, Image, Grid, GridColumn} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ImageUpload from '../../components/Uploads/ImageUpload';
import history from "../history";
import {connect} from 'react-redux';
import {deviceTemplateA} from '../../redux/_actions/categories/deviceTemplateA';
import _ from 'lodash';
import _config from '../../utils/config';

const config = _config[_config.environment];
const prevURL = config.prevURL;
const originBackend = config.originBackend;
const prevOrigin = config.prevOrigin;

class DeviceTemplateEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            refresh: true
        }
    }


    componentDidMount() {
        const {deviceTemplates, dispatch} = this.props;
        ;
        const {action = '', loading = 0, current = {}} = deviceTemplates;
        const deviceTemplateTest = history.location;
        const query = deviceTemplateTest.search || "";
        const params = new URLSearchParams(query);
        const deviceTemplatesId = params.get('id');
        // const originalUrl = location.pathname;

        if (deviceTemplatesId) {
            dispatch(deviceTemplateA.initUpdate({action: 'update'}));
            dispatch(deviceTemplateA.getDeviceTemplateById({deviceTemplateId: deviceTemplatesId}));
        } else {
            dispatch(deviceTemplateA.initUpdate({action: 'insert'}));
        }
        this.getData();
        document.title = action === 'update' ? 'Edit Device Template' : 'Add new Device Template';
    }

    componentWillReceiveProps = (nextProps) => {
        const {deviceTemplates} = nextProps;
        const {action = '', loading = 0, current = {}} = deviceTemplates;
        if ((action === 'insert' && loading === 2 && !_.isUndefined(current.deviceTemplateId) && current.deviceTemplateId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            history.push(prevURL + '/categories/device-templates');
        }
        if (action === 'update' && loading === 0 && _.size(current) > 0) {
            if (current.parentId) this.setState({isParent: false});
        }
    }

    getData = () => {
        this.props.dispatch(deviceTemplateA.getOthers());
    }

    validate = () => {
        let {deviceTemplates, dispatch} = this.props;
        let {current = {}} = deviceTemplates;

        let deviceTemplateName = '';
        let deviceTypeId = '';
        let weight = '';
        let height = '';
        let maxPower = '';
        let powerModule = '';
        let manufacturer = '';
        if (!current.deviceTemplateName) {
            deviceTemplateName = 'May be not empty';
        }

        if (!current.deviceTypeId) {
            deviceTypeId = 'May be not empty';
        }

        if (!current.maxPower) {
            maxPower = 'May be not empty';
        }

        if (!current.powerModule) {
            powerModule = 'May be not empty';
        }

        if (!current.weight) {
            weight = 'May be not empty';
        }

        if (!current.height) {
            height = 'May be not empty';
        }

        if (!current.manufacturer) {
            manufacturer = 'May be not empty';
        }

        if (!deviceTemplateName && !deviceTypeId && !maxPower && !powerModule && !weight && !height && !manufacturer) {
            return true;
        }
        dispatch(deviceTemplateA.validate({
            deviceTemplateName: deviceTemplateName,
            deviceTypeId: deviceTypeId,
            maxPower: maxPower,
            powerModule: powerModule,
            weight: weight,
            height: height,
            manufacturer: manufacturer,
        }));
        return false;
    }

    handleSave = (e) => {
        if (!this.validate()) return false;
        const {deviceTemplates, dispatch} = this.props;
        let {current, action} = deviceTemplates;
        let formData = new FormData();
        if (action === 'insert') {
            const data = {
                deviceTemplateName: current.deviceTemplateName,
                deviceTypeId: current.deviceTypeId,
                weight: current.weight,
                height: current.height,
                CPU: current.CPU,
                RAM: current.RAM,
                disk: current.disk,
                maxPower: current.maxPower,
                manufacturer: current.manufacturer,
                powerModule: current.powerModule,
                description: current.description,
            }
            formData.append('info', JSON.stringify(data));
            if (current.fronts && current.fronts.file) formData.append('front', current.fronts.file);
            if (current.rears && current.rears.file) formData.append('rear', current.rears.file);
            dispatch(deviceTemplateA.insertDeviceTemplate(formData));
        } else if (action === 'update') {
            const data = {
                deviceTemplateId: current.deviceTemplateId,
                deviceTemplateName: current.deviceTemplateName,
                deviceTypeId: current.deviceTypeId,
                weight: current.weight,
                height: current.height,
                CPU: current.CPU,
                RAM: current.RAM,
                disk: current.disk,
                maxPower: current.maxPower,
                manufacturer: current.manufacturer,
                powerModule: current.powerModule,
                description: current.description,
            }
            formData.append('info', JSON.stringify(data));
            if (current.fronts && current.fronts.file) formData.append('front', current.fronts.file);
            if (current.rears && current.rears.file) formData.append('rear', current.rears.file);
            dispatch(deviceTemplateA.updateDeviceTemplate(formData));
        }
    }

    handleCancel = () => {
        history.push(prevURL + '/categories/device-templates');
    }

    handleChangeInput = (e) => {
        const {deviceTemplates, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = deviceTemplates;
        let _error = '';
        if (!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(deviceTemplateA.updateCurrent(name, value, _error));
    }

    handleSelectDeviceTypes = (e, data) => {
        this.props.dispatch(deviceTemplateA.updateCurrent('deviceTypeId', data.value));
    }

    getChildState = (data, name) => {
        this.props.dispatch(deviceTemplateA.updateCurrent(name, data));
    }


    render() {
        let {deviceTemplates} = this.props;
        let {
            current = {
                deviceTemplateName: '',
                description: '',
                fronts: {
                    imagePreviewUrl: '',
                },
                rears: {
                    imagePreviewUrl: '',
                }
            }, validate = {
                deviceTemplateName: '',
            }, loading = 0,
            action,
            deviceTypes = [],
        } = deviceTemplates;
        const title = action === 'update' ? 'Edit Device Template' : 'Add new Device Template';
        const _deviceTypes = _.map(deviceTypes, item => ({text: item.deviceTypeName, value: item.deviceTypeId}));

        let frontImage = current.fronts ? current.fronts.imagePreviewUrl : '';
        let rearImage = current.rears ? current.rears.imagePreviewUrl : '';
        if (_.size(frontImage) === 0 && current.front && frontImage.indexOf('data:image') === -1) {
            frontImage = `${originBackend + prevOrigin}/uploads/deviceTemplates/${current.deviceTemplateId}/front/${current.front}`;


        }
        if (_.size(rearImage) === 0 && current.rear && rearImage.indexOf('data:image') === -1) {
            rearImage = `${originBackend + prevOrigin}/uploads/deviceTemplates/${current.deviceTemplateId}/rear/${current.rear}`;
        }
        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        <Grid className='grid-toolbar'>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <Form>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Dropdown
                                                name='deviceTypeId'
                                                label={<label>Type <strong
                                                    className="error-validate">*</strong></label>}
                                                fluid
                                                placeholder='Select...'
                                                search
                                                selection
                                                clearable
                                                options={_deviceTypes}
                                                onChange={this.handleSelectDeviceTypes}
                                                value={current.deviceTypeId}
                                                error={validate.deviceTypeId ? true : false}
                                            />
                                            <Label className={`error-text ${validate.deviceTypeId ? '' : 'hide'}`} basic
                                                   color='red' pointing>
                                                {validate.deviceTypeId}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='deviceTemplateName'
                                                value={current.deviceTemplateName}
                                                onChange={this.handleChangeInput}
                                                fluid
                                                label={<label>Name <strong
                                                    className="error-validate">*</strong></label>}
                                                placeholder='Name'
                                                error={validate.deviceTemplateName ? true : false}
                                            />
                                            <Label className={`error-text ${validate.deviceTemplateName ? '' : 'hide'}`}
                                                   basic color='red' pointing>
                                                {validate.deviceTemplateName}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='CPU'
                                                value={current.CPU}
                                                onChange={this.handleChangeInput}
                                                fluid
                                                label={<label>CPU</label>}
                                                placeholder='CPU'
                                            />
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='RAM'
                                                value={current.RAM}
                                                onChange={this.handleChangeInput}
                                                fluid
                                                label={<label>RAM</label>}
                                                placeholder='RAM'
                                            />
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='disk'
                                                value={current.disk}
                                                onChange={this.handleChangeInput}
                                                fluid
                                                label={<label>Disk</label>}
                                                placeholder='Disk'
                                            />
                                        </Form.Group>
                                    </Form>
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <Form>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='maxPower'
                                                value={current.maxPower}
                                                onChange={this.handleChangeInput}
                                                fluid
                                                label={<label>Power max <strong
                                                    className="error-validate">*</strong></label>}
                                                placeholder='Power max'
                                                error={validate.maxPower ? true : false}
                                            />
                                            <Label className={`error-text ${validate.maxPower ? '' : 'hide'}`} basic
                                                   color='red' pointing>
                                                {validate.maxPower}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='powerModule'
                                                value={current.powerModule}
                                                onChange={this.handleChangeInput}
                                                fluid
                                                label={<label>Power module <strong className="error-validate">*</strong></label>}
                                                placeholder='Power module'
                                                error={validate.powerModule ? true : false}
                                            />
                                            <Label className={`error-text ${validate.powerModule ? '' : 'hide'}`} basic
                                                   color='red' pointing>
                                                {validate.powerModule}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='weight'
                                                value={current.weight}
                                                onChange={this.handleChangeInput}
                                                fluid
                                                label={<label>Weight <strong
                                                    className="error-validate">*</strong></label>}
                                                placeholder='Power module'
                                                error={validate.weight ? true : false}
                                            />
                                            <Label className={`error-text ${validate.weight ? '' : 'hide'}`} basic
                                                   color='red' pointing>
                                                {validate.weight}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='height'
                                                value={current.height}
                                                onChange={this.handleChangeInput}
                                                fluid
                                                label={<label>Height <strong
                                                    className="error-validate">*</strong></label>}
                                                placeholder='Height'
                                                error={validate.height ? true : false}
                                            />
                                            <Label className={`error-text ${validate.height ? '' : 'hide'}`} basic
                                                   color='red' pointing>
                                                {validate.height}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='manufacturer'
                                                value={current.manufacturer}
                                                onChange={this.handleChangeInput}
                                                fluid
                                                label={<label>Manufacturer <strong className="error-validate">*</strong></label>}
                                                placeholder='Manufacturer'
                                                error={validate.manufacturer ? true : false}
                                            />
                                            <Label className={`error-text ${validate.manufacturer ? '' : 'hide'}`} basic
                                                   color='red' pointing>
                                                {validate.manufacturer}
                                            </Label>
                                        </Form.Group>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <div>
                                        <label className="label label-image">Front</label>
                                    </div>
                                    <div>
                                        <ImageUpload
                                            getChildState={this.getChildState}
                                            name="fronts"
                                            imagePreview={frontImage}
                                            refresh={true}
                                        />
                                    </div>
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <div>
                                        <label className="label label-image">Rear</label>
                                    </div>
                                    <div>
                                        <ImageUpload
                                            getChildState={this.getChildState}
                                            name="rears"
                                            imagePreview={rearImage}
                                            refresh={true}
                                        />
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Form>
                                        <Form.Group widths='equal'>
                                            <Form.TextArea
                                                name='description'
                                                fluid={"true"}
                                                onChange={this.handleChangeInput}
                                                value={current.description || ''}
                                                label='Description'
                                                placeholder='Description'
                                            />
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Button secondary type='submit' disabled={loading === 1}
                                                         onClick={this.handleCancel}>Cancel</Form.Button>
                                            <Form.Button primary type='submit' disabled={loading === 1}
                                                         onClick={this.handleSave}>Save</Form.Button>
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


const mapStateToProps = ({deviceTemplates}) => ({deviceTemplates});


export default connect(mapStateToProps, null)(DeviceTemplateEdit);