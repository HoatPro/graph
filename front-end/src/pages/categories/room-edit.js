import React from 'react';
import {Label, Header, Segment, Form, Image, Grid} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ImageUpload from '../../components/Uploads/ImageUpload';
import history from "../history";
import {connect} from 'react-redux';
import {roomA} from '../../redux/_actions/categories/roomA';
import _ from 'lodash';
import _config from '../../utils/config';

const config = _config[_config.environment];
const prevURL = config.prevURL;
const originBackend = config.originBackend;
const prevOrigin = config.prevOrigin;

class RoomEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            refresh: true
        }
    }

    componentDidMount() {
        const {rooms, dispatch} = this.props;
        const roomTest = history.location;
        const query = roomTest.search || "";
        const params = new URLSearchParams(query);
        const roomId = params.get('id');
        if (roomId) {
            dispatch(roomA.initUpdate({action: 'update'}));
            dispatch(roomA.getRoomById({roomId: roomId}))
            document.title = "Edit Room";
        } else {
            dispatch(roomA.initUpdate({action: 'insert'}));
            document.title = "Add new Room";
        }
        this.getData();
    }

    componentWillReceiveProps = (nextProps) => {
        const {rooms} = nextProps;
        const {action = '', loading = 0, current = {}} = rooms;
        if ((action === 'insert' && loading === 2 && !_.isUndefined(current.roomId) && current.roomId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            history.push(prevURL + '/categories/rooms');
        }
        if (action === 'update' && loading === 0 && _.size(current) > 0) {
            if (current.parentId) this.setState({isParent: false});
        }
    }

    getData = () => {
        this.props.dispatch(roomA.getOthers());
    }

    validate = () => {
        let {rooms, dispatch} = this.props;
        let {current = {}} = rooms;

        let roomName = '';
        let codeRoom = '';
        let width = '';
        let height = '';
        let capacity = '';
        let locationId = '';
        let dataCenterId = '';
        if (!current.roomName) {
            roomName = 'May be not empty';
        }

        if (!current.codeRoom) {
            codeRoom = 'May be not empty';
        }

        if (!current.width) {
            width = 'May be not empty';
        }

        if (!current.height) {
            height = 'May be not empty';
        }

        if (!current.capacity) {
            capacity = 'May be not empty';
        }

        if (!current.locationId) {
            locationId = 'May be not empty';
        }

        if (!current.dataCenterId) {
            dataCenterId = 'May be not empty';
        }

        if (!roomName && !codeRoom && !width && !height && !locationId && !dataCenterId) {
            return true;
        }
        dispatch(roomA.validate({
            roomName: roomName,
            codeRoom: codeRoom,
            width: width,
            height: height,
            capacity: capacity,
            locationId: locationId,
            dataCenterId: dataCenterId,
        }));
        return false;
    }

    handleSave = (e) => {
        if (!this.validate()) return false;
        const {rooms, dispatch} = this.props;
        let {current, action} = rooms;
        let formData = new FormData();
        if (action === 'insert') {
            const data = {
                roomName: current.roomName,
                codeRoom: current.codeRoom,
                width: current.width,
                height: current.height,
                capacity: current.capacity,
                locationId: current.locationId,
                dataCenterId: current.dataCenterId,
                description: current.description,
            }
            formData.append('info', JSON.stringify(data));
            if (current.images && current.images.file) formData.append('image', current.images.file);
            dispatch(roomA.insertRoom(formData));
        } else if (action === 'update') {
            const data = {
                roomId: current.roomId,
                roomName: current.roomName,
                codeRoom: current.codeRoom,
                width: current.width,
                height: current.height,
                capacity: current.capacity,
                locationId: current.locationId,
                dataCenterId: current.dataCenterId,
                description: current.description,
            }
            formData.append('info', JSON.stringify(data));
            if (current.images && current.images.file) formData.append('image', current.images.file);
            dispatch(roomA.updateRoom(formData));
        }
    }

    handleCancel = () => {
        history.push(prevURL + '/categories/rooms');
    }

    handleChangeInput = (e) => {
        const {rooms, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = rooms;
        let _error = '';
        if (!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(roomA.updateCurrent(name, value, _error));
    }

    handleSelectLocation = (e, data) => {
        const {dispatch} = this.props;
        dispatch(roomA.onChangeLocation(data.value));
        dispatch(roomA.updateCurrent('locationId', data.value));
    }

    handleSelectDataCenter = (e, data) => {
        this.props.dispatch(roomA.updateCurrent('dataCenterId', data.value));
    }

    getChildState = (data) => {
        this.props.dispatch(roomA.updateCurrent('images', data));
    }

    render() {
        let {rooms} = this.props;
        let {
            current = {
                roomName: '',
                description: '',
                images: {}
            }, validate = {
                roomName: '',
            }, loading = 0,
            action,
            locations = [],
            _dataCenters = [],
            dataCenters = []
        } = rooms;
        const title = action === 'update' ? 'Edit Room' : 'Add new Room';
        const _locations = _.map(locations, item => ({text: item.locationName, value: item.locationId}));
        if (current.locationId && _.size(_dataCenters) === 0) {
            _dataCenters = _.filter(dataCenters, item => {
                return (current.locationId === item.locationId)
            });
        }
        _dataCenters = _.map(_dataCenters, item => ({text: item.dataCenterName, value: item.dataCenterId}));
        let imagePreviewUrl = current.images ? current.images.imagePreviewUrl : '';
        if (_.size(imagePreviewUrl) === 0 && current.image && imagePreviewUrl.indexOf('data:image') === -1) {
            imagePreviewUrl = `${originBackend + prevOrigin}/uploads/rooms/${current.roomId}/${current.image}`;
        }
        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        <Form>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Dropdown
                                    name='locationId'
                                    label={<label>Location <strong className="error-validate">*</strong></label>}
                                    fluid
                                    placeholder='Select...'
                                    search
                                    selection
                                    clearable
                                    options={_locations}
                                    onChange={this.handleSelectLocation}
                                    value={current.locationId}
                                    error={validate.locationId ? true : false}
                                />
                                <Label className={`error-text ${validate.locationId ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.locationId}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Dropdown
                                    name='dataCenterId'
                                    label={<label>Data Center <strong className="error-validate">*</strong></label>}
                                    fluid
                                    placeholder='Select...'
                                    search
                                    selection
                                    clearable
                                    options={_dataCenters}
                                    onChange={this.handleSelectDataCenter}
                                    value={current.dataCenterId}
                                    error={validate.dataCenterId ? true : false}
                                />
                                <Label className={`error-text ${validate.dataCenterId ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.dataCenterId}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='roomName'
                                    value={current.roomName}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    label={<label>Name <strong className="error-validate">*</strong></label>}
                                    placeholder='Name'
                                    error={validate.roomName ? true : false}
                                />
                                <Label className={`error-text ${validate.roomName ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.roomName}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='codeRoom'
                                    value={current.codeRoom}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    label={<label>Code room <strong className="error-validate">*</strong></label>}
                                    placeholder='Code room'
                                    error={validate.codeRoom ? true : false}
                                />
                                <Label className={`error-text ${validate.codeRoom ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.codeRoom}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='width'
                                    value={current.width}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    label={<label>Width(m) <strong className="error-validate">*</strong></label>}
                                    placeholder='Width'
                                    error={validate.width ? true : false}
                                />
                                <Label className={`error-text ${validate.width ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.width}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='height'
                                    value={current.height}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    label={<label>Height(m) <strong className="error-validate">*</strong></label>}
                                    placeholder='Height'
                                    error={validate.height ? true : false}
                                />
                                <Label className={`error-text ${validate.height ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.height}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input
                                    name='capacity'
                                    value={current.capacity}
                                    onChange={this.handleChangeInput}
                                    fluid
                                    label={<label>Capacity <strong className="error-validate">*</strong></label>}
                                    placeholder='Capacity'
                                    error={validate.capacity ? true : false}
                                />
                                <Label className={`error-text ${validate.capacity ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.capacity}
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
                            <Form.Group widths='equal'>
                                <ImageUpload
                                    getChildState={this.getChildState}
                                    name="image"
                                    imagePreview={imagePreviewUrl}
                                    refresh={this.state.refresh}
                                />
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

RoomEdit.getInitialProps = async (context) => {
    const {req = {}, query = {}, store} = context;
    const {originalUrl} = req;
    if (query.id) {
        await store.dispatch(roomA.initUpdate({originalUrl, action: 'update'}));
    } else {
        await store.dispatch(roomA.initUpdate({originalUrl, action: 'insert'}));
    }
    return store.getState();
}

// const mapStateToProps =({rooms}) => ({rooms});
const mapStateToProps = (state, props) => {
    const {rooms} = state;
    const _rooms = props.rooms;
    if (rooms.originalUrl) {
        return {
            rooms
        };
    } else {
        return {
            rooms: {
                ...props.rooms,
                ...rooms,
            }
        };
    }

};

export default connect(mapStateToProps, null)(RoomEdit);