import React from 'react';
import {Label, Header, Segment, Form} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import history from "../history";
import {connect} from 'react-redux';
import {customerA} from '../../redux/_actions/categories/customerA';
import _ from 'lodash';
import _config from '../../utils/config';

const prevURL = _config[_config.environment].prevURL;

class CustomerEdit extends React.Component {

    constructor(props) {
        super(props);
    }


    componentDidMount() {
        const {customers, dispatch} = this.props;
        const {action = ''} = customers;
        const customerTest = history.location;
        const query = customerTest.search || "";
        const params = new URLSearchParams(query);
        const customerId = params.get('id');
        if (customerId) {
            dispatch(customerA.initUpdate({action: 'update'}));
            dispatch(customerA.getCustomerById({customerId: customerId}));
            document.title="Update Customer";
        } else {
            dispatch(customerA.initUpdate({action: 'insert'}));
            document.title="Add new Customer"
        }
        this.getData();
    }


    componentWillReceiveProps = (nextProps) => {
        const {customers} = nextProps;
        const {action = '', loading = 0, current = {}} = customers;
        if ((action === 'insert' && loading === 2 && !_.isUndefined(current.customerId) && current.customerId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            history.push(prevURL + '/categories/customers');
        }
        if (action === 'update' && loading === 0 && _.size(current) > 0) {
            if (current.parentId) this.setState({isParent: false});
        }
    }

    getData = () => {
        this.props.dispatch(customerA.getOthers());
    }

    validate() {
        let {customers, dispatch} = this.props;
        let {current = {}} = customers;

        let customerName = '';
        if (!current.customerName) {
            customerName = 'May be not empty';
        }

        if (!customerName) {
            return true;
        }
        dispatch(customerA.validate({customerName: customerName}));
        return false;
    }

    handleSave = (e) => {
        if (!this.validate()) return false;
        const {customers, dispatch} = this.props;
        let {current, action} = customers;
        if (action === 'insert') {
            dispatch(customerA.insertCustomer(current));
        } else if (action === 'update') {
            dispatch(customerA.updateCustomer(current));
        }
    }

    handleCancel = () => {
        history.push(prevURL + '/categories/customers');
    }

    handleChangeInput = (e) => {
        const {customers, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = customers;
        let _error = '';
        if (!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(customerA.updateCurrent(name, value, _error));
    }

    handleSelect = (e, data) => {
        this.props.dispatch(customerA.updateCurrent('locationId', data.value));
    }

    render() {
        let {customers} = this.props;
        let {
            current = {
                customerName: '',
                description: ''
            }, validate = {
                customerName: '',
            }, loading = 0, action, locations = []
        } = customers;
        const title = action === 'update' ? 'Update Customer' : 'Add Customer';
        const _locations = _.map(locations, item => ({text: item.locationName, value: item.locationId}));
        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        <Form>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='customerName'
                                    value={current.customerName}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    label={<label>Name <strong className="error-validate">*</strong></label>}
                                    placeholder='Name'
                                    error={validate.customerName ? true : false}/>
                                <Label className={`error-text ${validate.customerName ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.customerName}
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

const mapStateToProps = ({customers}) => ({customers});

export default connect(mapStateToProps, null)(CustomerEdit);