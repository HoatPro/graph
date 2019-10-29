import React from 'react';
import {Header, Segment, Form, Grid, Dropdown, Progress, Modal, Button} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import history from "../history";
import {connect} from 'react-redux';
import {rackA} from '../../redux/_actions/categories/rackA';
import _ from 'lodash';
import CustomTable from '../../components/Table/Table';
import base from '../../assets/js/base';
import _config from '../../utils/config';
/* eslint-disable import/first */
const prevURL = _config[_config.environment].prevURL;
import Cookies from 'js-cookie';

class RackView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            refresh: true,
            autoCrop: false,
            showModal: false
        };
        this.base = new base();
    }

    componentDidMount() {
        const {racks, dispatch} = this.props;
        const location = history.location;

        const searchId = location.search || {};
        const params = new URLSearchParams(searchId);
        const rackId = params.get('id');
        const {action = '', loading = 0, current = {}} = racks;
        if (!_.isNull(rackId)) dispatch(rackA.getRackById({rackId: rackId}));
        if (rackId) {
            dispatch(rackA.initUpdate({action: 'update'}));
        } else {
            dispatch(rackA.initUpdate({action: 'insert'}));
        }
        // if(action === 'update' && loading === 0 && _.size(current) === 0) {
        //     if(!_.isNull(rackId)) dispatch(rackA.getRackById({rackId: rackId}));
        // }
        // if(action === 'update' && loading === 0 && _.size(current) !== 0) {
        //     // if(parseInt(current.rackId) !== parseInt(rackId)){
        //     if(!_.isNull(rackId)) dispatch(rackA.getRackById({rackId: rackId}));
        //     // }
        // }
        // this.getData();
        document.title = "Rack view";
    }

    componentWillReceiveProps = (nextProps) => {
        const {racks} = nextProps;
        const {action = '', loading = 0, current = {}} = racks;
        if ((action === 'insert' && loading === 2 && !_.isUndefined(current.rackId) && current.rackId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            history.push(prevURL + '/categories/racks');
        }
        if (action === 'update' && loading === 0 && _.size(current) > 0) {
            if (current.parentId) this.setState({isParent: false});
        }
    }

    getData = () => {
        this.props.dispatch(rackA.getOthers());
    }

    validate = () => {
        const {racks, dispatch} = this.props;
        let {current = {}} = racks;

        let rackName = '';
        let x = '';
        let y = '';
        let width = '';
        let height = '';
        let roomId = '';
        if (!current.rackName) {
            rackName = 'May be not empty';
        }

        if (!current.x) {
            x = 'May be not empty';
        }

        if (!current.y) {
            y = 'May be not empty';
        }

        if (!current.width) {
            width = 'May be not empty';
        }

        if (!current.height) {
            height = 'May be not empty';
        }

        if (!current.roomId) {
            roomId = 'May be not empty';
        }

        if (!rackName && !x && !y && !width && !height && !roomId) {
            return true;
        }
        dispatch(rackA.validate({
            rackName: rackName,
            x: x,
            y: y,
            width: width,
            height: height,
            roomId: roomId
        }));
        return false;
    }

    handleSave = (e) => {
        if (!this.validate()) return false;
        const {racks, dispatch} = this.props;
        let {current, action} = racks;
        if (action === 'insert') {
            const data = {
                rackName: current.rackName,
                width: current.width,
                height: current.height,
                x: current.x,
                y: current.y,
                roomId: current.roomId,
            }
            dispatch(rackA.insertRack(data));
        } else if (action === 'update') {
            const data = {
                rackId: current.rackId,
                rackName: current.rackName,
                width: current.width,
                height: current.height,
                x: current.x,
                y: current.y,
                roomId: current.roomId,
            }
            dispatch(rackA.insertRack(data));
        }
    }

    handleCancel = () => {
        history.push(prevURL + '/categories/racks');
    }

    handleChangeInput = (e) => {
        const {racks, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = racks;
        let _error = '';
        if (!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(rackA.updateCurrent(name, value, _error));
    }

    handleSelectLocation = (e, data) => {
        const {dispatch} = this.props;
        dispatch(rackA.onChangeLocation(data.value));
        dispatch(rackA.updateCurrent('locationId', data.value));
    }

    handleSelectDataCenter = (e, data) => {
        const {dispatch} = this.props;
        dispatch(rackA.onChangeDatCenter(data.value));
        dispatch(rackA.updateCurrent('dataCenterId', data.value));
    }

    handleSelectRoom = (e, data) => {
        const {dispatch} = this.props;
        dispatch(rackA.onChangeRoom(data.value));
        dispatch(rackA.updateCurrent('roomId', data.value));
    }

    getChildState = (data) => {
        this.props.dispatch(rackA.updateCurrent('images', data));
    }

    onCropEnd = () => {
        let crop = this.refs.cropper.getData();
        console.log(crop);
        this.props.dispatch(rackA.updateCurrent('crop', {
            width: crop.width,
            height: crop.height,
            x: crop.x,
            y: crop.y,
        }));
    };

    handleBooking = (e) => {
        const {target} = e;
        const {racks = {}} = this.props;
        const {current = {}} = racks;
        const td = this.base.getParent(target, 'td');

        if (td) {
            const position = td.getAttribute('position');
            const positionU = parseInt(td.getAttribute('position-u'));
            this.props.dispatch(rackA.handleBookingU({
                position,
                positionU
            }));
            Cookies.set('current', current);
            Cookies.set('bookingU', {
                position,
                positionU
            });
            history.push(`${prevURL}/categories/booking-u`);
        }
    }

    handleAddDeviceLocal = (e) => {
        const {target} = e;
        const {racks = {}} = this.props;
        const {current = {}} = racks;
        const td = this.base.getParent(target, 'td');

        if (td) {
            const position = td.getAttribute('position');
            const positionU = parseInt(td.getAttribute('position-u'));
            this.props.dispatch(rackA.handleAddDevice({
                position,
                positionU
            }));
            Cookies.set('current', current);
            Cookies.set('addDevice', {
                position,
                positionU
            });
            history.push(`${prevURL}/categories/add-device`);
        }
    }

    handleMoveU = (e) => {
        const {racks} = this.props;
        const {current = {}} = racks;
        const {bookingUs = [], devices = []} = current;
        const {target} = e;
        const td = this.base.getParent(target, 'td');
        if (td) {
            const position = td.getAttribute('position');
            const positionU = parseInt(td.getAttribute('position-u'));

            let book = bookingUs.filter(item => {
                return item.position === position && item.positionU === positionU;
            });
            let device = devices.filter(item => {
                return item.position === position && item.positionU === positionU;
            });
            let temp = {};
            if (book.length > 0) {
                temp = {
                    typeMove: 'Booking',
                    ...book[0],
                    dataCenterId: current.dataCenterId,
                    roomId: current.roomId,
                    zoneId: current.zoneId,
                    rackId: current.rackId
                };
            } else if (device.length > 0) {
                temp = {
                    typeMove: 'Device',
                    ...device[0],
                    dataCenterId: current.dataCenterId,
                    roomId: current.roomId,
                    zoneId: current.zoneId,
                    rackId: current.rackId
                };
            }
            this.props.dispatch(rackA.handleMoveU(temp));
            Cookies.set('moveU', temp);
            Cookies.set('current', current);
            history.push(prevURL + '/categories/move-u');
        }
    }

    handleRemoveU = (e) => {
        const {racks} = this.props;
        const {current = {}} = racks;
        const {bookingUs = [], devices = []} = current;
        const {target} = e;
        const td = this.base.getParent(target, 'td');
        if (td) {
            const position = td.getAttribute('position');
            const positionU = parseInt(td.getAttribute('position-u'));

            let book = bookingUs.filter(item => {
                return item.position === position && item.positionU === positionU;
            });
            let device = devices.filter(item => {
                return item.position === position && item.positionU === positionU;
            });
            if (book.length > 0) {
                this.setState({
                    showModal: true,
                    deleteType: 'Booking',
                    deleteData: book[0]
                });
            } else if (device.length > 0) {
                this.setState({
                    showModal: true,
                    deleteType: 'Device',
                    deleteData: device[0]
                });
            }
        }
    }

    handleEdit = (id, type) => {
        const {racks, dispatch} = this.props;
        const {current = {}} = racks;
        const {bookingUs = [], devices = []} = current;
        // const {target} = e;
        let item = null;
        switch (type) {
            case 'booking':
                break;
            case 'device':
                item = _.find(devices, {deviceId: id});
                console.log(item);
                if (item) {
                    dispatch(rackA.updateCurrent('current', item));
                    history.push(`${prevURL}/categories/add-device?id=${id}`);
                }
                break;
            default:
                break;
        }
    }

    renderRack = (data) => {
        const {uNumber = 0, bookingUs = [], devices = []} = data;
        let fronts = [], rears = [], used = 0, weight = 0, power = 0;
        //render front
        let className = '';
        let rowspan = 0;

        for (let i = uNumber; i > 0; i--) {
            let booking = _.find(_.pickBy(bookingUs, {position: 'front', positionU: i}));
            let device = _.find(_.pickBy(devices, {position: 'front', positionU: i}));

            if (_.size(booking) > 0) {
                className = 'booking';
                rowspan = booking.height;
                used += rowspan;
                fronts.push([
                    {cell: <label>{i}</label>, props: {width: 1}},
                    {cell: <label>{booking.description}</label>, props: {rowSpan: rowspan, className: className}},
                    {
                        cell: <Dropdown icon='setting' basic className='icon'>
                            <Dropdown.Menu>
                                <Dropdown.Item icon='pencil' text='Edit'
                                               onClick={() => this.handleEdit(device.bookingUId, 'booking')}/>
                                <Dropdown.Item icon='move' text='Move U' onClick={this.handleMoveU}/>
                                <Dropdown.Item icon='remove' text='Remove' onClick={this.handleRemoveU}/>
                            </Dropdown.Menu>
                        </Dropdown>,
                        props: {width: 1, position: 'front', 'position-u': i, rowSpan: rowspan, className: className}
                    }
                ]);
                rowspan--;
            } else if (_.size(device) > 0) {
                className = 'device';
                rowspan = device.height;
                weight += device.weight || 0;
                power += device.power || 0;
                used += rowspan;
                fronts.push([{cell: <label>{i}</label>, props: {width: 1}}, {
                    cell: <label>{device.label}</label>,
                    props: {rowSpan: rowspan, className: className}
                },
                    {
                        cell: <Dropdown icon='setting' basic className='icon'>
                            <Dropdown.Menu>
                                <Dropdown.Item icon='pencil' text='Edit'
                                               onClick={() => this.handleEdit(device.deviceId, 'device')}/>
                                <Dropdown.Item icon='move' text='Move U' onClick={this.handleMoveU}/>
                                <Dropdown.Item icon='remove' text='Remove' onClick={this.handleRemoveU}/>
                            </Dropdown.Menu>
                        </Dropdown>,
                        props: {width: 1, position: 'front', 'position-u': i, rowSpan: rowspan, className: className}
                    }
                ]);
                rowspan--;
            } else {
                let temp = null;
                if (rowspan > 0) {
                    temp = [{cell: <label>{i}</label>, props: {width: 1}}];
                    rowspan--;
                } else {
                    className = '';
                    temp = [{cell: <label>{i}</label>, props: {width: 1}}, i, {
                        cell: <Dropdown icon='setting' basic className='icon'>
                            <Dropdown.Menu>
                                <Dropdown.Item icon='plus' text='Add Device local'
                                               onClick={this.handleAddDeviceLocal}/>
                                <Dropdown.Item icon='calendar check outline' text='Booking U'
                                               onClick={this.handleBooking}/>
                            </Dropdown.Menu>
                        </Dropdown>, props: {width: 1, position: 'front', 'position-u': i}
                    }]
                }
                fronts.push(temp);
            }
        }

        for (let i = uNumber; i > 0; i--) {
            let booking = _.find(_.pickBy(bookingUs, {position: 'rear', positionU: i}));
            let device = _.find(_.pickBy(devices, {position: 'rear', positionU: i}));
            if (_.size(booking) > 0) {
                rowspan = booking.height;
                used += rowspan;
                rears.push([
                    {cell: <label>{i}</label>, props: {width: 1}},
                    {cell: <label>{booking.description}</label>, props: {rowSpan: rowspan, className: className}},
                    {
                        cell: <Dropdown icon='setting' basic className='icon'>
                            <Dropdown.Menu>
                                <Dropdown.Item icon='plus' text='Add Device local'
                                               onClick={this.handleAddDeviceLocal}/>
                                <Dropdown.Item icon='calendar check outline' text='Booking U'
                                               onClick={this.handleBooking}/>
                            </Dropdown.Menu>
                        </Dropdown>, props: {width: 1, position: 'rear', 'position-u': i, className: className}
                    }]);
                rowspan--;
            } else if (_.size(device) > 0) {
                className = 'device';
                rowspan = device.height;
                weight += device.weight || 0;
                power += device.power || 0;
                used += rowspan;
                fronts.push([{cell: <label>{i}</label>, props: {width: 1}}, {
                    cell: <label>{device.label}</label>,
                    props: {rowSpan: rowspan, className: className}
                },
                    {
                        cell: <Dropdown icon='setting' basic className='icon'>
                            <Dropdown.Menu>
                                <Dropdown.Item icon='plus' text='Add Device local'
                                               onClick={this.handleAddDeviceLocal}/>
                                <Dropdown.Item icon='calendar check outline' text='Booking U'
                                               onClick={this.handleBooking}/>
                            </Dropdown.Menu>
                        </Dropdown>,
                        props: {width: 1, position: 'front', 'position-u': i, rowSpan: rowspan, className: className}
                    }
                ]);
                rowspan--;
            } else {
                let temp = null;
                if (rowspan > 0) {
                    temp = [{cell: <label>{i}</label>, props: {width: 1}}];
                    rowspan--;
                } else {
                    temp = [{cell: <label>{i}</label>, props: {width: 1}}, i, {
                        cell: <Dropdown icon='setting' basic className='icon'>
                            <Dropdown.Menu>
                                <Dropdown.Item icon='plus' text='Add Device local'
                                               onClick={this.handleAddDeviceLocal}/>
                                <Dropdown.Item icon='calendar check outline' text='Booking U'
                                               onClick={this.handleBooking}/>
                            </Dropdown.Menu>
                        </Dropdown>, props: {width: 1, position: 'rear', 'position-u': i}
                    }]
                }
                rears.push(temp);
            }
        }
        return {
            fronts: fronts,
            rears: rears,
            used: used,
            weight: weight,
            power: power
        }
    }

    handleCloseModal = () => {
        this.setState({
            showModal: false
        });
    }

    onDeleteRack = () => {
        const {deleteType, deleteData} = this.state;
        const rackTest = history.location;
        const query = rackTest.search || "";
        const params = new URLSearchParams(query);
        const rackId = params.get('id');
        // const rackId = Router.router.query.id || null;
        if (deleteType === 'Booking') {
            this.props.dispatch(rackA.handleDeleteBooking(deleteData));
        }
        if (deleteType === 'Device') {
            this.props.dispatch(rackA.handleDeleteDevice(deleteData));
        }
        this.handleCloseModal();
        this.props.dispatch(rackA.getRackById({rackId: rackId}));
        // console.log('delete', this.state.deleteData);
    }


    render() {
        let {racks = {}} = this.props;
        const {current = {}} = racks;
        const title = 'Rack view';
        const data = this.renderRack(current);
        const {showModal, deleteType = '', deleteData = {}} = this.state;
        return (
            <div>
                <DashboardLayout>
                    <Grid divided='vertically'>
                        <Grid.Row>
                            <Grid.Column width={12}>
                                <Segment>
                                    <Header>Rack view</Header>
                                    <Grid>
                                        <Grid.Row columns={2}>
                                            <Grid.Column>
                                                <CustomTable
                                                    header={[[{
                                                        cell: <label>Pos</label>,
                                                        props: {width: 1}
                                                    }, 'Front', '']]}
                                                    body={data.fronts}
                                                    pagination={false}
                                                />
                                            </Grid.Column>
                                            <Grid.Column>
                                                <CustomTable
                                                    header={[['Pos', 'Rear', '']]}
                                                    body={data.rears}
                                                    pagination={false}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Segment>
                                    <Header>Metric</Header>
                                    <Form>
                                        <Form.Field>
                                            <label>Space [{data.used}/{current.uNumber}]</label>
                                            <Progress percent={Number(((data.used / current.uNumber) * 100).toFixed(1))}
                                                      inverted progress success/>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Weight [{data.weight}/{current.maxWeight}]</label>
                                            <Progress
                                                percent={Number(((data.weight / current.maxWeight) * 100).toFixed(1))}
                                                inverted progress success/>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Power [{data.power}/{current.maxPower}]</label>
                                            <Progress
                                                percent={Number(((data.power / current.maxPower) * 100).toFixed(1))}
                                                inverted progress success/>
                                        </Form.Field>
                                    </Form>
                                </Segment>
                                <Segment>
                                    <Header>Information Rack</Header>
                                    <Form>
                                        <Form.Field>
                                            <label>Total device: {current.devices ? current.devices.length : 0}</label>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Total
                                                booking: {current.bookingUs ? current.bookingUs.length : 0}</label>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Location: {current.locationName || ''}</label>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Data center: {current.dataCenterName || ''}</label>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Room: {current.roomName || ''}</label>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Zone: {current.zoneName || ''}</label>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Rack name: {current.rackName || ''}</label>
                                        </Form.Field>
                                    </Form>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Modal size={'tiny'} open={showModal}
                           onClose={() => this.handleCloseModal()}
                           closeOnEscape={true}
                           closeOnDimmerClick={false}
                    >
                        <Modal.Header>Remove {deleteType}</Modal.Header>
                        <Modal.Content>
                            {deleteType === 'Booking' ?
                                <p>Do you want to remove the {deleteType} ({deleteData.position} -
                                    U{deleteData.positionU}): {deleteData.description} ?</p>
                                :
                                <p>Do you want to remove the {deleteType} ({deleteData.position} -
                                    U{deleteData.positionU}): {deleteData.label} ?</p>
                            }

                        </Modal.Content>
                        <Modal.Actions>
                            <Button negative icon='remove' labelPosition='right' onClick={() => this.handleCloseModal()}
                                    content='Cancel'/>
                            <Button positive icon='checkmark' labelPosition='right' content='Yes'
                                    onClick={() => this.onDeleteRack()}/>
                        </Modal.Actions>
                    </Modal>

                </DashboardLayout>
            </div>
        );
    }
}


const mapStateToProps = ({racks}) => ({racks});

export default connect(mapStateToProps, null)(RackView);