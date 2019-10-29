import React from 'react';
import {Label, Header, Segment, Form} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import history from "../history";
import {connect} from 'react-redux';
import {regionA} from '../../redux/_actions/categories/regionA';
import _ from 'lodash';
import _config from '../../utils/config';

const prevURL = _config[_config.environment].prevURL;

class RegionEdit extends React.Component {

    constructor(props) {
        super(props);
    }


    componentDidMount() {
        const {regions, dispatch} = this.props;
        const {action = '', loading = 0, current = {}} = regions;

        const regionTest = history.location;
        const query = regionTest.search || "";
        const params = new URLSearchParams(query);
        const regionId = params.get('id');
        // const originalUrl = location.pathname;

        if (regionId) {
            dispatch(regionA.initUpdate({action: 'update'}));
            dispatch(regionA.getRegionById({regionId: regionId}))
        } else {
            dispatch(regionA.initUpdate({action: 'insert'}));
        }
        this.getData();
        document.title = action === 'update' ? 'Update Region' : 'Add Region';
    }

    componentWillReceiveProps = (nextProps) => {
        const {regions} = nextProps;
        const {action = '', loading = 0, current = {}} = regions;
        if ((action === 'insert' && loading === 2 && !_.isUndefined(current.regionId) && current.regionId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            history.push(prevURL + '/categories/regions');
        }
        if (action === 'update' && loading === 0 && _.size(current) > 0) {
            if (current.parentId) this.setState({isParent: false});
        }
    }

    getData = () => {
        this.props.dispatch(regionA.getOthers());
    }

    validate = () => {
        let {regions, dispatch} = this.props;
        let {current = {}} = regions;

        let regionName = '';
        if (!current.regionName) {
            regionName = 'May be not empty';
        }

        if (!regionName) {
            return true;
        }
        dispatch(regionA.validate({regionName: regionName}));
        return false;
    }

    handleSave = e => {
        if (!this.validate()) return false;
        const {regions, dispatch} = this.props;
        let {current, action} = regions;
        if (action === 'insert') {
            dispatch(regionA.insertRegion(current));
        } else if (action === 'update') {
            dispatch(regionA.updateRegion(current));
        }
    }

    handleCancel = () => {
        history.push(prevURL + '/categories/regions');
    }

    handleChangeInput = e => {
        const {regions, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = regions;
        let _error = '';
        if (!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(regionA.updateCurrent(name, value, _error));
    }

    handleSelect = (e, data) => {
        this.props.dispatch(regionA.updateCurrent('departmentId', data.value));
    }

    render() {
        let {regions} = this.props;
        let {
            current = {
                regionName: '',
                description: ''
            }, validate = {
                regionName: '',
            }, loading = 0, action, departments = []
        } = regions;
        const title = action === 'update' ? 'Update Region' : 'Add Region';
        const _departments = _.map(departments, item => ({text: item.departmentName, value: item.departmentId}));
        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        <Form>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input name='regionName' value={current.regionName}
                                            onChange={this.handleChangeInput} fluid
                                            label={<label>Name <strong className="error-validate">*</strong></label>}
                                            placeholder='Name' error={validate.regionName ? true : false}/>
                                <Label className={`error-text ${validate.regionName ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.regionName}
                                </Label>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Dropdown
                                    label='Department'
                                    fluid
                                    placeholder='Select...'
                                    search
                                    selection
                                    clearable
                                    options={_departments}
                                    onChange={this.handleSelect}
                                    value={current.departmentId}
                                />
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


const mapStateToProps = ({regions}) => ({regions});


export default connect(mapStateToProps, null)(RegionEdit);