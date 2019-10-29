import React from 'react';
import {Label, Header, Segment, Form} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {connect} from 'react-redux';
import {datacenterA} from '../../redux/_actions/categories/datacenterA';
import _ from 'lodash';
import _config from '../../utils/config';
import history from "../history";

const prevURL = _config[_config.environment].prevURL;

class DataCenterEdit extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { dispatch} = this.props;
        const dataCenterTest = history.location;
        const query = dataCenterTest.search || "";
        const params = new URLSearchParams(query);
        const dataCenterId = params.get('id');
        // const originalUrl = location.pathname;

        if (dataCenterId) {
            dispatch(datacenterA.initUpdate({action: 'update'}));
            dispatch(datacenterA.getDataCenterById({dataCenterId: dataCenterId}));
            document.title="Update DataCenter";
        } else {
            dispatch(datacenterA.initUpdate({action: 'insert'}));
            document.title="Add new DataCenter";
        }
        this.getData();

    }

    componentWillReceiveProps = (nextProps) => {
        const {datacenters} = nextProps;
        const {action = '', loading = 0, current = {}} = datacenters;
        if ((action === 'insert' && loading === 2 && !_.isUndefined(current.dataCenterId) && current.dataCenterId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            history.push(prevURL + '/categories/datacenters');
        }
        if (action === 'update' && loading === 0 && _.size(current) > 0) {
            if (current.parentId) this.setState({isParent: false});
        }
    }

    getData() {
        this.props.dispatch(datacenterA.getOthers());
    }

    validate() {
        let {datacenters, dispatch} = this.props;
        let {current = {}} = datacenters;

        let dataCenterName = '';
        if (!current.dataCenterName) {
            dataCenterName = 'May be not empty';
        }

        if (!dataCenterName) {
            return true;
        }
        dispatch(datacenterA.validate({dataCenterName: dataCenterName}));
        return false;
    }

    handleSave = e => {
        if (!this.validate()) return false;
        const {datacenters, dispatch} = this.props;
        let {current, action} = datacenters;
        if (action === 'insert') {
            dispatch(datacenterA.insertDatacenter(current));
        } else if (action === 'update') {
            dispatch(datacenterA.updateDatacenter(current));
        }
    }

    handleCancel = () => {
        history.push(prevURL + '/categories/datacenters');
    }

    handleChangeInput = e => {
        const {datacenters, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = datacenters;
        let _error = '';
        if (!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(datacenterA.updateCurrent(name, value, _error));
    }

    handleSelect = (e, data) => {
        this.props.dispatch(datacenterA.updateCurrent('locationId', data.value));
    }

    render() {
        let {datacenters} = this.props;
        let {
            current = {
                dataCenterName: '',
                description: ''
            }, validate = {
                dataCenterName: '',
            }, loading = 0, action, locations = []
        } = datacenters;
        const title = action === 'update' ? 'Update DataCenter' : 'Add new DataCenter';
        const _locations = _.map(locations, item => ({text: item.locationName, value: item.locationId}));
        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        <Form>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input name='dataCenterName' value={current.dataCenterName}
                                            onChange={this.handleChangeInput} fluid
                                            label={<label>Name <strong className="error-validate">*</strong></label>}
                                            placeholder='Name' error={validate.dataCenterName ? true : false}/>
                                <Label className={`error-text ${validate.dataCenterName ? '' : 'hide'}`} basic
                                       color='red' pointing>
                                    {validate.dataCenterName}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input name='dataCenterKey' value={current.dataCenterKey}
                                            onChange={this.handleChangeInput} fluid
                                            label={<label>Short Name<strong
                                                className="error-validate">*</strong></label>} placeholder='Short Name'
                                            error={validate.dataCenterKey ? true : false}/>
                                <Label className={`error-text ${validate.dataCenterKey ? '' : 'hide'}`} basic
                                       color='red' pointing>
                                    {validate.dataCenterKey}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input type="number" name='totalRoom' value={current.totalRoom || 0}
                                            onChange={this.handleChangeInput} fluid
                                            label={<label>Total Room<strong
                                                className="error-validate">*</strong></label>} placeholder='Total Room'
                                            error={validate.totalRoom ? true : false}/>
                                <Label className={`error-text ${validate.totalRoom ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.totalRoom}
                                </Label>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Dropdown
                                    label='Location'
                                    fluid
                                    placeholder='Select...'
                                    search
                                    selection
                                    clearable
                                    options={_locations}
                                    onChange={this.handleSelect}
                                    value={current.locationId}
                                />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.TextArea name='description' fluid={"true"}
                                               onChange={this.handleChangeInput}
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


// const mapStateToProps =({datacenters}) => ({datacenters});
const mapStateToProps = (state, props) => {
    const {datacenters} = state;
    const _datacenters = props.datacenters;
    if (datacenters.originalUrl) {
        return {
            datacenters
        };
    } else {
        return {
            datacenters: {
                ...props.datacenters,
                ...datacenters,
            }
        };
    }

};

export default connect(mapStateToProps, null)(DataCenterEdit);