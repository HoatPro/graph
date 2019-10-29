import React from 'react';
import {Label, Header, Segment, Form} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {Router} from 'react-router-dom';
import history from "../history";
import {connect} from 'react-redux';
import {contractA} from '../../redux/_actions/categories/contractA';
import _ from 'lodash';
import _config from '../../utils/config';

const prevURL = _config[_config.environment].prevURL;

class ContractEdit extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {dispatch} = this.props;
        const contractTest = history.location;
        const query = contractTest.search || "";
        const params = new URLSearchParams(query);
        const contractId = params.get('id');
        // const originalUrl = location.pathname;

        if (contractId) {
            dispatch(contractA.initUpdate({action: 'update'}));
            dispatch(contractA.getContractById({contractId: contractId}));
            document.title="Update Contract";
        } else {
            dispatch(contractA.initUpdate({action: 'insert'}));
            document.title="Add new Contract";
        }
        this.getData();
    }

    componentWillReceiveProps = (nextProps) => {
        const {contracts} = nextProps;
        const {action = '', loading = 0, current = {}} = contracts;
        if ((action === 'insert' && loading === 2 && !_.isUndefined(current.contractId) && current.contractId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            history.push(prevURL + '/categories/contracts');
        }
        if (action === 'update' && loading === 0 && _.size(current) > 0) {
            if (current.parentId) this.setState({isParent: false});
        }
    }

    getData = () => {
    }

    validate = () => {
        let {contracts, dispatch} = this.props;
        let {current = {}} = contracts;

        let contractName = '';
        if (!current.contractName) {
            contractName = 'May be not empty';
        }

        if (!contractName) {
            return true;
        }
        dispatch(contractA.validate({contractName: contractName}));
        return false;
    }

    handleSave = (e) => {
        if (!this.validate()) return false;
        const {contracts, dispatch} = this.props;
        let {current, action} = contracts;
        if (action === 'insert') {
            dispatch(contractA.insertContract(current));
        } else if (action === 'update') {
            dispatch(contractA.updateContract(current));
        }
    }

    handleCancel = () => {
        history.push(prevURL + '/categories/contracts');
    }

    handleChangeInput = (e) => {
        const {contracts, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = contracts;
        let _error = '';
        if (!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(contractA.updateCurrent(name, value, _error));
    }

    render() {
        let {contracts} = this.props;
        let {
            current = {
                contractName: '',
                company: '',
                phone: '',
                barcode: '',
                fullName: '',

            }, validate = {
                contractName: '',
            }, loading = 0, action
        } = contracts;
        let parents = [];
        _.forEach(contracts.parents, item => {
            parents.push({text: item.contractName, value: item.contractId});
        });
        const title = action === 'update' ? 'Update Contract' : 'Add new Contract';

        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        <Form>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='contractId'
                                    value={current.contractId}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    label={<label>Contract code <strong className="error-validate">*</strong></label>}
                                    placeholder='Contract Code'
                                    error={validate.contractId ? true : false}
                                />
                                <Label className={`error-text ${validate.contractId ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.contractId}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input name='contractName' value={current.contractName}
                                            onChange={this.handleChangeInput} fluid
                                            label={<label>Contract name <strong
                                                className="error-validate">*</strong></label>}
                                            placeholder='Contract name' error={validate.contractName ? true : false}/>
                                <Label className={`error-text ${validate.contractName ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.contractName}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input name='barcode' value={current.barcode}
                                            onChange={this.handleChangeInput} fluid
                                            label={<label>Barcode</label>} placeholder='Barcode'/>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='fullName'
                                    value={current.fullName}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    label={<label>Customer <strong className="error-validate">*</strong></label>}
                                    placeholder='Customer'
                                    error={validate.fullName ? true : false}
                                />
                                <Label className={`error-text ${validate.fullName ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.fullName}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='company'
                                    value={current.company}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    label={<label>Company <strong className="error-validate">*</strong></label>}
                                    placeholder='Company'
                                    error={validate.fullName ? true : false}
                                />
                                <Label className={`error-text ${validate.company ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.company}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='phone'
                                    value={current.phone}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    type="number"
                                    label={<label>Phone <strong className="error-validate">*</strong></label>}
                                    placeholder='Company'
                                    error={validate.phone ? true : false}
                                />
                                <Label className={`error-text ${validate.phone ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.phone}
                                </Label>
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

ContractEdit.getInitialProps = async (context) => {
    const {req = {}, query = {}, store} = context;
    const {originalUrl} = req;
    if (query.id) {
        await store.dispatch(contractA.initUpdate({originalUrl, action: 'update'}));
    } else {
        await store.dispatch(contractA.initUpdate({originalUrl, action: 'insert'}));
    }
    return store.getState();
}

// const mapStateToProps =({contracts}) => ({contracts});
const mapStateToProps = (state, props) => {
    const {contracts} = state;
    const _contracts = props.contracts;
    if (contracts.originalUrl) {
        return {
            contracts
        };
    } else {
        return {
            contracts: {
                ...props.contracts,
                ...contracts,
            }
        };
    }

};

export default connect(mapStateToProps, null)(ContractEdit);