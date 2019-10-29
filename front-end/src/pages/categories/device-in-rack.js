import React from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Modal, Form, Dropdown, Loader, Message} from 'semantic-ui-react';
import DashboardLayout from "../../components/Layout/DashboardLayout";
import CustomTable from "../../components/Table/Table";
import FileUpload from "../../components/Uploads/FileUpload";
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import {deviceInRackA} from "../../redux/_actions/categories/deviceInRackA";
import _ from 'lodash';
import moment from 'moment/moment';
import {loadingA} from "../../redux/_actions/loadingA";
import _config from '../../utils/config';
import XLSX from 'xlsx';
import {ToastContainer, toast} from 'react-toastify';

const prevURL = _config[_config.environment].prevURL;


class DeviceInRack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkPermission: []
        }
    }

    componentDidMount() {
        this.props.dispatch(deviceInRackA.getOthers());
        this.getData();
        document.title = "Device in Rack";
        const data = localStorage.getItem('user');
        const userInfo = JSON.parse(data);
        let arrayData = userInfo.permissions;
        let children = [];
        arrayData.map(data => {
            if (data.routeKey === "/categories") children = data.children
        });
        let checkPermission = [];
        children.map(data => {
            if (data.routeKey === "/device-in-rack") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
    }

    getData = (_search, _pagination) => {
        const {deviceInRack = {}, dispatch} = this.props;
        const {search = {}, pagination = {}} = deviceInRack;

        dispatch(deviceInRackA.getDeviceInRack({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow = id => {
        const {deviceInRack = {}, dispatch} = this.props;
        const {list = []} = deviceInRack;
        const find = _.find(list, {deviceId: id});
        console.log(find);
        if (find) {
            dispatch(deviceInRackA.handleDeleteRow({...find, open: true}));
        }
    }

    handleUpdateRow = id => {
        const {deviceInRack, dispatch} = this.props;
        const {list = []} = deviceInRack;
        const find = _.find(list, {deviceId: id});
        if (find) {
            dispatch(deviceInRackA.handleUpdateRow(find));
        }
    }

    handleClose = () => {
        const {dispatch} = this.props;
        dispatch(deviceInRackA.updateCurrent('current', {open: false}));
    }

    onDelete = () => {
        const {deviceInRack} = this.props;
        const {current = {}} = deviceInRack;
        const id = current.deviceTypeId;
        if (id) this.props.dispatch(deviceInRackA.deleteDeviceType({id: id}));
    }


    onPageChange = (e, data) => {
        const {activePage} = data;
        const {name, value} = e.target;
        const {deviceInRack = {}} = this.props
        const {dispatch, search = {}, pagination = {}} = deviceInRack;
        search[name] = value;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    getChildState = (data) => {
        // const {dispatch} = this.props;
        const files = data.files;

        if (_.size(files) > 0) {
            var file = files[0];
            var regex = /(.xls|.xlsx|.csv)$/;

            if (regex.test(file.name.toLowerCase())) {
                if (typeof FileReader != "undefined") {
                    this.props.dispatch(loadingA.start());
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

    processExcel = (data) => {
        let error = [];
        const {dispatch} = this.props;
        //Read the Excel File data.
        try {
            let workbook = XLSX.read(data, {
                type: 'binary'
            }); //Fetch the name of First Sheet.
            let result = [];
            const sheets = workbook.SheetNames; //Read all rows from First Sheet into an JSON array.
            const columns = {
                "Device Name": "deviceName",
                "Device Type": "deviceType",
                "Device Template": "deviceTemplate",
                "U Position": "UPosition",
                "Rack": "rack",
                "Zone": "zone",
                "Room": "room",
                "Contract": "contract",
                "Customer": "customer",
                "StartDate": "startDate",
                "EndDate": "endDate"
            };
            const columnNames = _.keys(columns);

            // get rows by sheet
            for (let i = 0; i < sheets.length; i++) {
                const sheetName = sheets[i];
                let rows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                _.forEach(rows, (item, j) => {

                    let temp = {};

                    // get value by column
                    _.forEach(columnNames, c => {
                        let strError = [];
                        const value = item[c];
                        if (c !== "Customer" && !value) strError.push(`"${c}" is required`);

                        // check error
                        if (strError.length === 0) {
                            temp[`${columns[c]}`] = value;
                        } else {
                            error.push(`Sheet "${sheetName}" Row ${j + 2}: ${strError.join(', ')}`);
                        }
                    });

                    // push data
                    result.push(temp);
                });
            }

            // let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);


            if (result.length === 0) {
                toast.error('File is empty');
                return false;
            }
            dispatch(loadingA.stop());
            if (error.length > 0) {
                dispatch(deviceInRackA.updateCurrent({
                    openError: true,
                    error: error
                }));
            } else {
                new Promise(resolve => {
                    dispatch(deviceInRackA.importDeviceToRack({devices: result}));
                    resolve()
                }).then(() => {
                    dispatch(loadingA.stop());
                })
            }
        } catch (error) {
            toast.error(error.message);

        }
        dispatch(loadingA.stop());
    }

    onCloseError = () => {
        const {dispatch} = this.props;
        dispatch(deviceInRackA.updateCurrent({openError: false, error: null}));
    }

    handleSearch = async (e) => {
        const {name, value} = e.target;
        const {dispatch} = this.props;
        await new Promise(resolve => {
            dispatch(deviceInRackA.handleSearch(name, value));
            resolve();
        });
        this.onSearch();
    }

    handleSelect = async (e, data) => {
        const {dispatch} = this.props;
        const {name, value} = data;
        await new Promise(resolve => {
            dispatch(deviceInRackA.handleSearch(name, value));
            resolve();
        });
        this.onSearch();
    }

    onSearch = () => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.getData();
        }, 500);
    }

    render() {
        const {deviceInRack = {}} = this.props;
        const {checkPermission} = this.state;
        const {
            current = {},
            search = {str: ''},
            searchLoading = false,
            pagination = {currentPage: 0, countPage: 1},
            rooms = [],
            zones = [],
            racks = [],
            deviceTemplates = []
        } = deviceInRack;
        const {
            roomId = '',
            zoneId = '',
            deviceTemplateId = ''
        } = search;
        const {
            open = false,
            openError = false,
            error = []
        } = current;
        const _rooms = rooms.map(item => {
            return {
                text: item.roomName, value: item.roomId
            }
        });
        const _deviceTemplates = deviceTemplates.map(item => {
            return {text: item.deviceTemplateName, value: item.deviceTemplateId}
        })
        let _zones = [];
        let _racks = [];
        if (roomId) {
            _.forEach(zones, item => {
                if (roomId === item.roomId) {
                    _zones.push({text: item.zoneName, value: item.zoneId})
                }
            })
        }
        if (zoneId) {
            _.forEach(racks, item => {
                if (zoneId === item.zoneId) {
                    _racks.push({text: item.rackName, value: item.rackId})
                }
            })

        }

        let listDevice = [];
        let insert = [];
        let checkRole = true;
        let _header = ['STT', 'Device Name', 'Device Template', 'Rack', 'Zone', 'Room', 'Created date', 'Created By'];
        let _update = _.find(checkPermission, {actionKey: 'update'});
        let _delete = _.find(checkPermission, {actionKey: 'delete'});
        let _insert = _.find(checkPermission, {actionKey: 'insert'});
        let _view = _.find(checkPermission, {actionKey: 'view'});
        if (_insert) {
            insert = (
                <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8} style={{marginTop: -5}}>
                    <FileUpload
                        name="Import"
                        getChildState={this.getChildState}
                    />
                </Grid.Column>
            )
        }
        _.forEach(deviceInRack.list, (item, i) => {
            let temp = [];
            let index = 1;
            if (_.isNull(pagination.currentPage) || _.isUndefined(pagination.currentPage)) {
                index = i + 1;
            } else {
                index = (pagination.currentPage * pagination.sizePage) + i + 1;
            }
            temp.push(index);
            _.forEach(['deviceName', 'deviceTemplateName', 'rackName', 'zoneName', 'roomName', 'createdDate', 'createdBy'], c => {
                let value = item[c];
                if (c === 'createdDate') value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                if (_.isNull(value)) value = '';
                temp.push(value);
            });
            const id = item.deviceId;
            const rackId = item.rackId;
            let change = [];
            if (_.isNil(_view) && _.isNil(_update) && _.isNil(_delete)) {
                checkRole = false;
            } else {
                if (_.isNil(_update) && _.isNil(_delete)) {
                    _header = ['STT', 'Device Name', 'Device Template', 'Rack', 'Zone', 'Room', 'Created date', 'Created By'];
                } else {
                    if (_update) {
                        change.push(<Link to={prevURL + '/categories/rack-view?id=' + rackId} key={index}>
                            <Button size="mini" icon onClick={() => this.handleUpdateRow(rackId)}>
                                <Icon name="eye"/>
                            </Button>
                        </Link>)
                    }
                    _header = ['STT', 'Device Name', 'Device Template', 'Rack', 'Zone', 'Room', 'Created date', 'Created By', ''];
                    if (_delete) {
                        change.push(<Button color="red" size="mini" icon onClick={() => this.handleDeleteRow(id)} key={-i}>
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
                listDevice.push(temp);
            }
        });
        const header = [_header];
        return (
            <div>
                {/*<Loading type="PacmanLoader" />*/}
                <DashboardLayout>
                    <Segment>
                        {/*<Loading type="PacmanLoader" />*/}
                        <Header>Device Rack List</Header>
                        <ToastContainer enableMultiContainer/>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8}>
                                <Input
                                    fluid
                                    icon='search'
                                    placeholder="Device Name..."
                                    name='deviceName'
                                    value={search.deviceName}
                                    onChange={this.handleSearch}
                                />
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8}>
                                <Dropdown
                                    fluid
                                    name='deviceTemplateId'
                                    placeholder='Device Template...'
                                    search
                                    selection
                                    clearable
                                    options={_deviceTemplates}
                                    onChange={this.handleSelect}
                                    value={search.deviceTemplateId || ''}
                                />
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8}>
                                <Dropdown
                                    fluid
                                    name='roomId'
                                    placeholder='Room...'
                                    search
                                    selection
                                    clearable
                                    options={_rooms}
                                    onChange={this.handleSelect}
                                    value={search.roomId || ''}
                                />
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8}>
                                <Dropdown
                                    fluid
                                    name='zoneId'
                                    placeholder='Zone...'
                                    search
                                    selection
                                    clearable
                                    options={_zones}
                                    onChange={this.handleSelect}
                                    value={search.zoneId || ''}
                                />
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8}>
                                <Dropdown
                                    fluid
                                    name='rackId'
                                    placeholder='Rack...'
                                    search
                                    selection
                                    clearable
                                    options={_racks}
                                    onChange={this.handleSelect}
                                    value={search.rackId || ''}
                                />
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8}>
                                <Loader active={searchLoading}/>
                            </Grid.Column>
                            {insert}
                        </Grid>
                        {checkRole ? <CustomTable
                            header={header}
                            body={listDevice}
                            pagination={true}
                            paginationProps={{
                                defaultActivePage: pagination.currentPage + 1,
                                totalPages: pagination.countPage
                            }}
                            onPageChange={this.onPageChange}
                        /> : <Message negative>
                            <Message.Header style={{textAlign: "center"}}>You don't have permission to view this
                                page!</Message.Header>
                        </Message>
                        }
                        <Modal size={'mini'} open={open}
                               onClose={this.handleClose}
                               closeOnEscape={true}
                               closeOnDimmerClick={false}
                        >
                            <Modal.Header>Remove Device</Modal.Header>
                            <Modal.Content>
                                <p>Do you want to remove the Device: {`"${current.deviceName}"`}?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose}>Cancel</Button>
                                <Button positive icon='checkmark' labelPosition='right' content='Yes'
                                        onClick={this.onDelete}/>
                            </Modal.Actions>
                        </Modal>
                        <Modal open={openError} onClose={this.onCloseError}>
                            <Modal.Header>Error</Modal.Header>
                            <Modal.Content>
                                {error.map(item => <div>{item}</div>)}
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.onCloseError}>Close</Button>
                            </Modal.Actions>
                        </Modal>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({deviceInRack}) => ({deviceInRack});

export default connect(mapStateToProps, null)(DeviceInRack);