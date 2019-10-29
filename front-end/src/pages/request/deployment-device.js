import React from 'react';
import {Button, Input, Header, Popup, Grid, Segment, Icon} from 'semantic-ui-react';
import DashboardLayout from "../../components/Layout/DashboardLayout";
import CustomTable from "../../components/Table/Table";
import {connect} from 'react-redux';
import {deploymentDCA} from "../../redux/_actions/request/deploymentDCA";
import _ from 'lodash';
import moment from 'moment/moment';
import {ToastContainer} from 'react-toastify';
import Loading from "../../components/Loading/Loading";
import ModalDeploymentDevice from "../../components/Modal/ModalDeploymentDevice";


class DeploymentDevice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkPermission: []
        }
    }

    componentDidMount() {
        this.getData();
        document.title = " Deployment Device";
        const user = localStorage.getItem('user');
        const userInfo = JSON.parse(user);
        let arrayData = userInfo.permissions;
        let children = [];
        arrayData.map(data => {
            if (data.routeKey === "/request") {
                children = data.children;
            }
        });
        let checkPermission = [];
        children.map(data => {
            if (data.routeKey === "/deployment-device") {
                checkPermission = data.actions
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
    }

    componentWillReceiveProps = (nextProps) => {
        const {deploymentDevice} = nextProps;
        const {action = '', loading = false, current = {}} = deploymentDevice;
        if (action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData = (_search, _pagination) => {
        const {deploymentDevice = {}, dispatch} = this.props;
        const {search = {}, pagination = {}} = deploymentDevice;
        dispatch(deploymentDCA.getDeploymentDevice({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleCloseDetail = () => {
        this.props.dispatch(deploymentDCA.updateCurrent('current', {openModal: false}));

    }

    handleSearch = async (e) => {
        const {name, value} = e.target;
        const {dispatch} = this.props;
        // await new Promise(resolve => {
        //     dispatch(deploymentDCA.handleSearch(name, value));
        //      resolve();
        // });
        await Promise.resolve(dispatch(deploymentDCA.handleSearch(name, value)));
        this.onSearch();
    }

    onSearch = () => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.getData();
        }, 500);
    }

    onPageChange = (e, data) => {
        const {activePage} = data;
        const {name, value} = e.target;
        const {deploymentDevice} = this.props;
        let {search = {}, pagination = {}} = deploymentDevice;
        search[name] = value;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    handleDetailRow = (id) => {
        const {deploymentDevice, dispatch} = this.props;
        const {list = []} = deploymentDevice;
        const find = _.find(list, {ID: id});
        if (find) {
            dispatch(deploymentDCA.updateCurrent('current', {openModal: true, ...find}));
        }
    }

    onSave = () => {
        const {deploymentDevice = {}, dispatch} = this.props;
        const {current = {}} = deploymentDevice;

        if (!current.status) {
            dispatch(deploymentDCA.updateCurrent('status', '', 'May be not empty'));
            return false;
            // dispatch(deploymentDCA.updateCurrent('status', '', 'May be not empty'));
        } else {
            dispatch(deploymentDCA.feedBackDeployment(current)).then(() => {
                dispatch(deploymentDCA.updateCurrent('current', {openModal: true}));
            });
        }
    }

    handleChangeStatus = (e, data) => {
        const {value} = data;
        let error = '';

        if (value === '') {
            error = 'May be not empty';
        }
        this.props.dispatch(deploymentDCA.updateCurrent('status', value, error));
    }

    render() {
        const {deploymentDevice = {}} = this.props;
        const {checkPermission} = this.state;
        const {
            validate = {},
            current = {},
            search = {str: ''},
            searchLoading = false,
            pagination = {currentPage: 0, countPage: 1},
        } = deploymentDevice;
        const {
            status = '',
            openModal = false,
        } = current;
        let list = [];
        let checkRole = true;
        let _view = _.find(checkPermission, {actionKey: 'view'});
        let _feedback = _.find(checkPermission, {actionKey: 'feedback'});
        let _header = ['Index', 'Deployment ID', 'NOC Location Name', 'NOC DataCenter Name ', 'NOC Room Name', 'NOC Zone Name', 'NOC Rack Name', 'Registration Detail Code', 'Contract ID', 'Status', 'Create By'];
        _.forEach(deploymentDevice.list, (item, i) => {
            let temp = [];
            let index = 1;
            if (_.isNull(pagination.currentPage) || _.isUndefined(pagination.currentPage)) {
                index = i + 1;
            } else {
                index = (pagination.currentPage * pagination.sizePage) + i + 1;
            }
            temp.push(index);
            _.forEach(['deployid', 'NOCLocationName', 'NOCDataCenterName', 'NOCRoomName', 'NOCZoneName', 'NOCRackName', 'REGISTRATIONDETAILCODE', 'CONTRACTID', 'STATUS', 'CREATEDBY'], c => {
                let value = item[c];
                if (c === 'CREATEDDATE' && item[c] !== null) value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                // else if (c === 'STATUS' && item[c] === -2) value = "Triển khai mới";
                // else if (c === 'STATUS' && item[c] === -1) value = "Chưa phân công";
                // else if (c === 'STATUS' && item[c] === 0) value = "Triển khai lại";
                // else if (c === 'STATUS' && item[c] === 1) value = "Chưa thi công";
                // else if (c === 'STATUS' && item[c] === 2) value = "Đang thi công";
                // else if (c === 'STATUS' && item[c] === 3) value = "Triển khai OK";
                // else if (c === 'STATUS' && item[c] === 4) value = "Triển khai NOT OK";
                if (_.isNull(value)) value = '';
                temp.push(value);
            });
            const id = item.ID;
            if (_.isNil(_view) && _.isNil(_feedback)) {
                checkRole = false
            } else {
                if (_.isNil(_feedback)) {
                    _header = ['Index', 'Deployment ID', 'NOC Location Name', 'NOC DataCenter Name ', 'NOC Room Name', 'NOC Zone Name', 'NOC Rack Name', 'Registration Detail Code', 'Contract ID', 'Status', 'Create By'];
                } else {
                    temp.push({
                        cell: (
                            <Popup
                                trigger={<Button size="mini" icon onClick={() => this.handleDetailRow(id)}>
                                    <Icon name="reply"/>
                                </Button>}
                                content='Feedback'
                                position='top center'
                            />),
                        props: {
                            textAlign: 'center'
                        }
                    });
                    _header = ['Index', 'Deployment ID', 'NOC Location Name', 'NOC DataCenter Name ', 'NOC Room Name', 'NOC Zone Name', 'NOC Rack Name', 'Registration Detail Code', 'Contract ID', 'Status', 'Create By', 'Actions'];
                }
                list.push(temp);
            }
        });
        const header = [_header];

        return (
            <div>
                <Loading type="PacmanLoader"/>
                <DashboardLayout>
                    <Segment>
                        <Header>Deployment Device</Header>
                        <ToastContainer enableMultiContainer/>
                        <Grid className='grid-toolbar' doubling stackable style={{marginBottom: 5}}>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input
                                    icon='search'
                                    placeholder="Search..."
                                    name='str'
                                    loading={searchLoading}
                                    value={search.str}
                                    onChange={this.handleSearch}
                                />
                            </Grid.Column>

                        </Grid>
                        <div className="table-edit">
                            <CustomTable
                                header={header}
                                body={list}
                                pagination={true}
                                paginationProps={{
                                    defaultActivePage: pagination.currentPage + 1,
                                    totalPages: pagination.countPage
                                }}
                                onPageChange={this.onPageChange}
                            />
                        </div>
                        <ModalDeploymentDevice
                            current={list}
                            data={current}
                            open={openModal}
                            onClose={this.handleCloseDetail}
                            onSave={this.onSave}
                            onChange={this.handleChangeStatus}
                            value={status}
                            validate={validate}
                        />
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({deploymentDevice}) => ({deploymentDevice});

export default connect(mapStateToProps, null)(DeploymentDevice);