import React from 'react';
import {Label, Header, Segment, Form} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {connect} from 'react-redux';
import {locationA} from '../../redux/_actions/categories/locationA';
import _ from 'lodash';
import _config from '../../utils/config';
import history from "../history";

const prevURL = _config[_config.environment].prevURL;

class LocationEdit extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {locations, dispatch} = this.props;
        const {action = ''} = locations;
        const locationTest = history.location;
        const query = locationTest.search || "";
        const params = new URLSearchParams(query);
        const locationId = params.get('id');
        if (locationId) {
            dispatch(locationA.initUpdate({action: 'update'}));
            dispatch(locationA.getLocationById({locationId: locationId}));
        } else {
            dispatch(locationA.initUpdate({action: 'insert'}));
        }
        document.title = action === 'update' ? 'Update Location' : 'Add new Location';
    }

    componentWillReceiveProps = (nextProps) => {
        const {locations} = nextProps;
        const {action = '', loading = 0, current = {}} = locations;
        if ((action === 'insert' && loading === 2 && !_.isUndefined(current.locationId) && current.locationId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            history.push(prevURL + '/categories/locations');
        }
        if (action === 'update' && loading === 0 && _.size(current) > 0) {
            if (current.parentId) this.setState({isParent: false});
        }
    }

    validate() {
        let {locations, dispatch} = this.props;
        let {current = {}} = locations;

        let locationName = '';
        if (!current.locationName) {
            locationName = 'May be not empty';
        }

        if (!locationName) {
            return true;
        }
        dispatch(locationA.validate({locationName: locationName}));
        return false;
    }

    handleSave = e => {
        if (!this.validate()) return false;
        const {locations, dispatch} = this.props;
        let {current, action} = locations;
        if (action === 'insert') {
            dispatch(locationA.insertLocation(current));
        } else if (action === 'update') {
            dispatch(locationA.updateLocation(current));
        }
    }

    handleCancel = () => {
        history.push(prevURL + '/categories/locations');
    }

    handleChangeInput = e => {
        const {locations, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = locations;
        let _error = '';
        if (!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(locationA.updateCurrent(name, value, _error));
    }

    render() {
        let {locations} = this.props;
        let {
            current = {
                locationName: '',
                description: ''
            }, validate = {
                locationName: '',
            }, loading = 0, action
        } = locations;
        let parents = [];
        _.forEach(locations.parents, item => {
            parents.push({text: item.locationName, value: item.locationId});
        });
        let title = action === 'insert' ? 'Add new Location' : 'Update Location';

        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        <Form>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='locationName'
                                    value={current.locationName}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    label={<label>Tên Địa điểm <strong className="error-validate">*</strong></label>}
                                    placeholder='Name Location'
                                    error={validate.locationName ? true : false}
                                />
                                <Label
                                    className={`error-text ${validate.locationName ? '' : 'hide'}`}
                                    basic color='red'
                                    pointing
                                >
                                    {validate.locationName}
                                </Label>
                            </Form.Group>
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
                                <Form.Button
                                    secondary
                                    type='submit'
                                    disabled={loading === 1}
                                    onClick={this.handleCancel}
                                >Cancel</Form.Button>
                                <Form.Button
                                    primary
                                    type='submit'
                                    disabled={loading === 1}
                                    onClick={this.handleSave}
                                >Save</Form.Button>
                            </Form.Group>
                        </Form>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({locations}) => ({locations});
export default connect(mapStateToProps, null)(LocationEdit);