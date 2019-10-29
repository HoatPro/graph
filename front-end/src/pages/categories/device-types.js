import React from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Modal, Form, Message} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import CustomTable from '../../components/Table/Table';
import FileUpload from '../../components/Uploads/FileUpload';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {deviceTypeA} from '../../redux/_actions/categories/deviceTypeA';
import _ from 'lodash';
import moment from 'moment/moment';
// import ImageUpload from "../../src/components/Uploads/ImageUpload";
import {loadingA} from "../../redux/_actions/loadingA";
import _config from '../../utils/config';
import XLSX from 'xlsx';
import {ToastContainer, toast} from 'react-toastify';
// import {datacenterA} from "../../src/redux/_actions/categories/datacenterA";
/* eslint-disable import/first */
const prevURL = _config[_config.environment].prevURL;

// import Loading from '../../components/Loading/Loading';
// import {deviceTemplateA} from "../../redux/_actions/categories/deviceTemplateA";

class DeviceTypes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeout: null,
            checkPermission: []
        }
    }

    componentDidMount() {
        this.getData();
        document.title = "DeviceType List";
        const data = localStorage.getItem('user');
        const userData = JSON.parse(data);
        let arrayData = userData.permissions;
        let children = [];
        arrayData.map(data => {
            if (data.routeKey === "/categories") children = data.children
        });
        let checkPermission = [];
        children.map(data => {
            if (data.routeKey === "/device-types") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
    }

    componentWillReceiveProps = (nextProps) => {
        const {deviceTypes} = nextProps;
        const {action = '', loading = false, current = {}} = deviceTypes;
        if (action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData = (_search, _pagination) => {
        const {deviceTypes, dispatch} = this.props;
        const {search = {}, pagination = {}} = deviceTypes;
        dispatch(deviceTypeA.getDeviceTypes({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow = id => {
        const {deviceTypes, dispatch} = this.props;
        const {list = []} = deviceTypes;
        const find = _.find(list, {deviceTypeId: id});
        if (find) {
            dispatch(deviceTypeA.handleDeleteRow(find));
        }
    }

    handleUpdateRow = id => {
        const {deviceTypes, dispatch} = this.props;
        const {list = []} = deviceTypes;
        const find = _.find(list, {deviceTypeId: id});
        if (find) {
            dispatch(deviceTypeA.handleUpdateRow(find));
        }
    }

    handleClose = () => {
        const {dispatch} = this.props;
        dispatch(deviceTypeA.modal(false));
    }

    onDelete = () => {
        const {deviceTypes} = this.props;
        const {current = {}} = deviceTypes;
        const id = current.deviceTypeId;
        if (id) this.props.dispatch(deviceTypeA.deleteDeviceType({id: id}));
    }

    handleSearch = e => {
        const {name, value} = e.target;
        const {deviceTypes, dispatch} = this.props;
        let {search = {}, pagination = {}} = deviceTypes;
        search[name] = value;
        if (pagination.currentPage === 0) {
            dispatch(deviceTypeA.handleSearch(value));
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.getData(search, pagination);
            }, 500);
        } else {
            dispatch(deviceTypeA.getDeviceTypes('pagination', {currentPage: 0}));
            dispatch(deviceTypeA.handleSearch(value));
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.getData(search, pagination);
            }, 500);
        }

    }

    onPageChange = (e, data) => {
        const {activePage} = data;
        const {name, value} = e.target;
        const {deviceTypes} = this.props;
        const {dispatch, search = {}, pagination = {}} = deviceTypes;
        search[name] = value;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    getChildState = (data) => {
        const files = data.files;
        const target = data.target;
        if (_.size(files) > 0) {
            var file = files[0];
            var regex = /(.xls|.xlsx|.csv)$/;

            if (regex.test(file.name.toLowerCase())) {
                if (typeof FileReader != "undefined") {
                    var reader = new FileReader(); //For Browsers other than IE.

                    if (reader.readAsBinaryString) {
                        reader.onload = (e) => {
                            // this.props.dispatch(loadingA.start());
                            this.processExcel(e.target.result);
                        };

                        reader.readAsBinaryString(file);
                    } else {
                        //For IE Browser.
                        reader.onload = (e) => {
                            var data = "";
                            var bytes = new Uint8Array(e.target.result);

                            for (let i = 0; i < bytes.byteLength; i++) {
                                data += String.fromCharCode(bytes[i]);
                            }
                            // this.props.dispatch(loadingA.start());
                            this.processExcel(data);
                        };

                        reader.readAsArrayBuffer(file);
                    }
                } else {
                    toast.error("This browser does not support HTML5.");
                }
            } else {
                toast.error("Please upload a valid Excel file.");
            }
        }
    }

    processExcel = data => {
        let error = [];
        const {dispatch} = this.props;
        //Read the Excel File data.
        var workbook = XLSX.read(data, {
            type: 'binary'
        }); //Fetch the name of First Sheet.

        var firstSheet = workbook.SheetNames[0]; //Read all rows from First Sheet into an JSON array.

        let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
        let result = [];

        var length = excelRows.length;
        if (length === 0) {
            toast.error('File is empty');
            return false;
        }

        _.forEach(excelRows, (item, i) => {
            let strError = [];
            let name = item.Name || '';
            name = name.trim();
            let desc = item.Description || '';
            desc = desc.trim();
            if (!name) strError.push('"Name" is required');

            if (strError.length === 0) {
                result.push({
                    name: name,
                    desc: desc
                });
            } else {
                error.push(`Row ${i + 2}: ${strError.join(', ')}`);
            }
        });

        if (error.length > 0) {
            toast.error(error.join('<br>'), {autoClose: false});
        } else {
            dispatch(loadingA.start());
            dispatch(deviceTypeA.importDeviceType({deviceTypes: result}));
        }
    }

    render() {
        const {deviceTypes} = this.props;
        const {checkPermission} = this.state;
        const {
            open = false, current = {
                deviceTypeName: '',
                deviceTypeId: ''
            }, search = {str: ''}, searchLoading = false, pagination = {currentPage: 0, countPage: 1}
        } = deviceTypes;
        let list = [];
        let insert = [];
        let checkRole = true;
        let _header = ['STT', 'DeviceType', 'Description', 'Created date', 'Created By'];
        let _update = _.find(checkPermission, {actionKey: 'update'});
        let _delete = _.find(checkPermission, {actionKey: 'delete'});
        let _insert = _.find(checkPermission, {actionKey: 'insert'});
        let _view = _.find(checkPermission, {actionKey: 'view'});
        if (_insert) {
            insert = (
                <Grid.Column floated='right' textAlign="right" computer={3} largeScreen={3} tablet={5}
                             moblie={8} style={{marginTop: -5}}>
                    <Link to={prevURL + "/categories/device-type-edit"}><Button primary>Add</Button></Link>
                    <FileUpload
                        name="Import"
                        getChildState={this.getChildState}
                    />
                </Grid.Column>
            )
        }
        _.forEach(deviceTypes.list, (item, i) => {
            let temp = [];
            let index = 1;
            if (_.isNull(pagination.currentPage) || _.isUndefined(pagination.currentPage)) {
                index = i + 1;
            } else {
                index = (pagination.currentPage * pagination.sizePage) + i + 1;
            }
            temp.push(index);
            _.forEach(['deviceTypeName', 'description', 'createdDate', 'fullName'], c => {
                let value = item[c];
                if (c === 'createdDate') value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                if (_.isNull(value)) value = '';
                temp.push(value);
            });
            const id = item.deviceTypeId;
            let change = [];
            if (_.isNil(_view) && _.isNil(_update) && _.isNil(_delete)) {
                checkRole = false;
            } else {
                if (_.isNil(_update) && _.isNil(_delete)) {
                    _header = ['STT', 'DeviceType', 'Description', 'Created date', 'Created By'];
                } else {
                    if (_update) {
                        change.push(<Link to={prevURL + '/categories/device-type-edit?id=' + id} key={index}>
                            <Button size="mini" icon onClick={() => this.handleUpdateRow(id)}>
                                <Icon name="pencil"/>
                            </Button>
                        </Link>)
                    }
                    _header = ['STT', 'DeviceType', 'Description', 'Created date', 'Created By', ''];
                    if (_delete) {
                        change.push(<Button color="red" size="mini" icon onClick={() => this.handleDeleteRow(id)} key={-index}>
                            <Icon name="delete"/>
                        </Button>)
                    }
                    temp.push({
                        cell: (<React.Fragment>
                            {change}

                        </React.Fragment>),
                        props: {
                            textAlign: 'center'
                        }
                    });
                }
                list.push(temp);
            }


        });
        const header = [_header];
        return (
            <div>
                {/*<Loading type="PacmanLoader" />*/}
                <DashboardLayout>
                    <Segment>
                        {/*<Loading type="PacmanLoader" />*/}
                        <Header>DeviceType List</Header>
                        <ToastContainer enableMultiContainer/>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input icon='search' placeholder="Search..." name='str' loading={searchLoading}
                                       value={search.str} onChange={this.handleSearch}/>
                            </Grid.Column>

                            {insert}
                        </Grid>
                        {checkRole ? <CustomTable
                            header={header}
                            body={list}
                            pagination={true}
                            paginationProps={{
                                defaultActivePage: pagination.currentPage + 1,
                                totalPages: pagination.countPage
                            }}
                            onPageChange={this.onPageChange}
                        /> : <Message negative>
                            <Message.Header style={{textAlign: "center"}}>You don't have permission to view this
                                page!</Message.Header>
                        </Message>}
                        <Modal size={'mini'} open={open}
                               onClose={this.handleClose}
                               closeOnEscape={true}
                               closeOnDimmerClick={false}
                        >
                            <Modal.Header>Remove DeviceType</Modal.Header>
                            <Modal.Content>
                                <p>Do you want to remove the DeviceType: {`"${current.deviceTypeName}"`}?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose}>Cancel</Button>
                                <Button positive icon='checkmark' labelPosition='right' content='Yes'
                                        onClick={this.onDelete}/>
                            </Modal.Actions>
                        </Modal>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({deviceTypes}) => ({deviceTypes});

export default connect(mapStateToProps, null)(DeviceTypes);