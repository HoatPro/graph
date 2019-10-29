import React from 'react';
import {Button, Input, Form, Header, Grid, Segment, Icon, Popup, Message} from 'semantic-ui-react';
import DashboardLayout from "../../components/Layout/DashboardLayout";
import CustomTable from "../../components/Table/Table";
import {connect} from 'react-redux';
import {surveyDCA} from "../../redux/_actions/request/surveyDCA";
import _ from 'lodash';
import moment from "moment";
import {ToastContainer} from 'react-toastify';
import Loading from "../../components/Loading/Loading";
import ModalSurveyDevice from "../../components/Modal/ModalSurveyDevice";


class SurveyDevice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkPermission: []
        }
    }

    componentDidMount() {
        this.getData();
        const user = localStorage.getItem('user');
        const userInfo = JSON.parse(user);
        let arrayData = userInfo.permissions;
        let children = []
        arrayData.map(data => {
            if (data.routeKey === "/request") {
                children = data.children;
            }
        });
        let checkPermission = [];
        children.map(data => {
            if (data.routeKey === "/survey-device") {
                checkPermission = data.actions;
            }
        });
        this.setState({
            checkPermission: checkPermission
        })
        document.title = "Survey Device"
    }

    componentDidUpdate = (nextProps) => {
        const {surveyDevice} = nextProps;
        const {action = '', loading = false, current = {}} = surveyDevice;
        if (action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData = (_search, _pagination) => {
        const {surveyDevice = {}, dispatch} = this.props;
        const {search = {}, pagination = {}} = surveyDevice;
        const dataW = {
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }
        dispatch(surveyDCA.getSurveyDevice(dataW));
    }

    handleCloseDetail = () => {
        this.props.dispatch(surveyDCA.updateCurrent('current', {openModal: false}));
    }

    handleSearch = async (e) => {
        const {name, value} = e.target;
        const {surveyDevice = {}, dispatch} = this.props;
        const {search = {}, pagination = {}} = surveyDevice;
        search[name] = value;
        if (pagination.currentPage === 0) {
            await new Promise(resolve => {
                dispatch(surveyDCA.handleSearch(name, value));
                resolve();
            }).then(() => {
                this.getData(search, pagination)
            })

        } else {
            dispatch(surveyDCA.getSurveyDevice('pagination', {currentPage: 0}))
            await new Promise(resolve => {
                dispatch(surveyDCA.handleSearch(name, value));
            }).then(() => {
                this.getData(search, pagination)
            })

        }
    }

    handleSelect = (e, data) => {
        const {name, value} = data;
        const {surveyDevice, dispatch} = this.props;
        let {search = {}, pagination = {}} = surveyDevice;
        search[name] = value;
        dispatch(surveyDCA.handleSearch(name, value));
        this.getData(search, pagination);
    }

    onPageChange = (e, data) => {
        const {activePage} = data;
        const {surveyDevice} = this.props;
        let {search = {}, pagination = {}} = surveyDevice;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    handleDetailRow = (id) => {
        const {surveyDevice, dispatch} = this.props;
        const {list = []} = surveyDevice;
        const find = _.find(list, {ID: id});
        if (find) {
            dispatch(surveyDCA.updateCurrent('current', {openModal: true, ...find}));
        }
    }

    handleChangeInput = (e) => {
        const {surveyDevice = {}, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = surveyDevice;
        let _error = '';
        if (!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(surveyDCA.updateCurrent(name, value, _error));
    }

    onSave = () => {
        const {surveyDevice = {}, dispatch} = this.props;
        const {current = {}, validate = {}} = surveyDevice;
        if (!current.status) {
            dispatch(surveyDCA.updateCurrent('status', '', 'May be not empty'));
            return false;
        } else {
            dispatch(surveyDCA.feedbackSurvey(current)).then(() => {
                dispatch(surveyDCA.updateCurrent('current', {openModal: true}));
            });
        }
    }

    handleChangeStatus = (e, data) => {
        const {value} = data;
        let error = '';
        if (value === '') {
            error = 'May be not empty';
        }
        this.props.dispatch(surveyDCA.updateCurrent('status', value, error));
    }

    render() {
        const {surveyDevice = {}} = this.props;
        const {checkPermission}=this.state;

        const {
            current = {},
            search = {
                str: '',
                accessStatusId: '',
                priorityTypeId: ''
            },
            validate = {},
            searchLoading = false,
            pagination = {currentPage: 0, countPage: 1},
        } = surveyDevice;
        const {
            status = '',
            openModal = false
        } = current;
        const statusAccess = [
            {
                text: 'Chưa khảo sát',
                value: -2
            },
            {
                text: 'Chưa phân công',
                value: -1
            },
            {
                text: 'Đang khảo sát',
                value: 1
            },
            {
                text: 'Khảo sát OK',
                value: 2
            },
            {
                text: 'Khảo sát NOT OK',
                value: 3
            },
            {
                text: 'Khảo sát lại ',
                value: 4
            },
            {
                text: 'Đề nghị hủy',
                value: 5
            }
        ]

        const priorityType = [
            {
                text: 'Low Priority',
                value: 1
            },
            {
                text: 'Normal Priority',
                value: 2
            },
            {
                text: 'High Priority',
                value: 3
            },

        ]
        let list = [];
        let checkRole=true;
        let _view=_.find(checkPermission,{actionKey:'view'});
        let _feedback=_.find(checkPermission,{actionKey: 'feedback'});
        let _header=['Index', 'Survey ID', 'Access Status ID', 'Priority Type ID', 'Customer Type', 'Description Excess', 'Device Location', 'DataCenter Deploy Name', 'Registration Detail Code', 'From Date Contract', 'To Date Contract', 'Sale Name', 'Actions'];

        _.forEach(surveyDevice.list, (item, i) => {
            let temp = [];
            let index = 1;
            if (_.isNull(pagination.currentPage) || _.isUndefined(pagination.currentPage)) {
                index = i + 1;
            } else {
                index = (pagination.currentPage * pagination.sizePage) + i + 1;
            }
            temp.push(index);
            _.forEach(['surveyid', 'ACCESSSTATUSID', 'PRIORITYTYPEID', 'CUSTOMERTYPE', 'DESCRIPTIONEXCESS', 'DEVICELOCATION', 'DATACENTERDEPLOYNAME', 'REGISTRATIONDETAILCODE', 'FROMDATE_CONTRACT', "TODATE_CONTRACT", "SALENAME"], c => {
                let value = item[c];
                if ((item[c] !== null && c === 'CONTRACTDATE') || c === 'FROMDATE_CONTRACT' || c === 'TODATE_CONTRACT') value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                else if (c === 'ACCESSSTATUSID' && item[c] === -2) value = "Chưa khảo sát";
                else if (c === 'ACCESSSTATUSID' && item[c] === -1) value = "Chưa phân công";
                else if (c === 'ACCESSSTATUSID' && item[c] === 1) value = "Đang khảo sát";
                else if (c === 'ACCESSSTATUSID' && item[c] === 2) value = "Khảo sát OK";
                else if (c === 'ACCESSSTATUSID' && item[c] === 3) value = "Khảo sát NOT OK";
                else if (c === 'ACCESSSTATUSID' && item[c] === 4) value = "Khảo sát lại";
                else if (c === 'ACCESSSTATUSID' && item[c] === 5) value = "Đề nghị hủy";
                else if (c === 'PRIORITYTYPEID' && item[c] === 1) value = "Low Priority";
                else if (c === 'PRIORITYTYPEID' && item[c] === 2) value = "Normal Priority";
                else if (c === 'PRIORITYTYPEID' && item[c] === 3) value = "High Priority";
                else if (c === 'CUSTOMERTYPE' && item[c] === 1) value = "Triển khai mới";
                else if (c === 'CUSTOMERTYPE' && item[c] === 2) value = "Chuyển địa điểm";
                if (_.isNull(value)) value = '';
                temp.push(value);
            });

            const id = item.ID;
            if(_.isNil(_view)&& _.isNil(_feedback)){
                checkRole=false
            }else{
                if(_.isNil(_feedback)){
                    _header=['Index', 'Survey ID', 'Access Status ID', 'Priority Type ID', 'Customer Type', 'Description Excess', 'Device Location', 'DataCenter Deploy Name', 'Registration Detail Code', 'From Date Contract', 'To Date Contract', 'Sale Name']

                }else{
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
                    _header=['Index', 'Survey ID', 'Access Status ID', 'Priority Type ID', 'Customer Type', 'Description Excess', 'Device Location', 'DataCenter Deploy Name', 'Registration Detail Code', 'From Date Contract', 'To Date Contract', 'Sale Name','Actions']

                }

                list.push(temp);

            }
        })
        const header = [
            _header
        ];

        return (
            <div>
                <Loading type="PacmanLoader"/>
                <DashboardLayout>
                    <Segment>
                        <Header>Survey Device</Header>
                        <ToastContainer enableMultiContainer/>
                        <Grid className='grid-toolbar' doubling stackable style={{marginBottom: 5}}>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input
                                    icon='search'
                                    placeholder="SurveyId/RegistrationCode..."
                                    name='str'
                                    loading={searchLoading}
                                    value={search.str}
                                    onChange={this.handleSearch}
                                />
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8} style={{marginRight: 60}}>
                                <Form.Dropdown
                                    name='accessStatusId'
                                    fluid
                                    placeholder='Select Access Status'
                                    search
                                    selection
                                    clearable
                                    options={statusAccess}
                                    onChange={this.handleSelect.bind((this))}
                                    value={search.accessStatusId}
                                />
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Dropdown
                                    name='priorityTypeId'
                                    fluid
                                    placeholder='Select Priority Type'
                                    search
                                    selection
                                    clearable
                                    options={priorityType}
                                    onChange={this.handleSelect.bind((this))}
                                    value={search.priorityTypeId}
                                />
                            </Grid.Column>

                        </Grid>
                        <div className="table-edit">
                            {checkRole? <CustomTable
                                header={header}
                                body={list}
                                pagination={true}
                                paginationProps={{
                                    defaultActivePage: pagination.currentPage + 1,
                                    totalPages: pagination.countPage
                                }}
                                onPageChange={this.onPageChange}
                            />:<Message negative>
                                <Message.Header style={{textAlign: "center"}}>You don't have permission to view this
                                    page!</Message.Header>
                            </Message>
                            }

                        </div>
                        <ModalSurveyDevice
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

const mapStateToProps = ({surveyDevice}) => ({surveyDevice});

export default connect(mapStateToProps, null)(SurveyDevice);