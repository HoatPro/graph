import React from 'react';
import {Label, Header, Segment, Form, Grid} from 'semantic-ui-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {connect} from 'react-redux';
import {rackA} from '../../redux/_actions/categories/rackA';
import _ from 'lodash';
import _config from '../../utils/config';

const prevURL = _config[_config.environment].prevURL;
import Cookies from 'js-cookie';

class MoveU extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let {location, dispatch} = this.props;

        const query = location.search || "";
        const params = new URLSearchParams(query);
        const originalUrl = location.pathname;

        if (params.get('id')) {
            dispatch(rackA.initUpdate({originalUrl, action: 'update'}));
        } else {
            dispatch(rackA.initUpdate({originalUrl, action: 'insert'}));
        }
    }

    componentDidMount() {
        const {racks, dispatch} = this.props;
        const {action = '', loading = 0, current = {}} = racks;
        let _current = Cookies.get('current');
        let _moveU = Cookies.get('moveU');
        if (_current && _moveU) {
            _current = JSON.parse(_current);
            dispatch(rackA.updateCurrent('current', _current));
            _moveU = JSON.parse(_moveU);
            dispatch(rackA.handleMoveU(_moveU));
            this.resetCookies();
        }
        this.getData();
        document.title = "Move U";
    }

    resetCookies() {
        Cookies.remove('current');
        Cookies.remove('moveU');
    }

    componentWillReceiveProps(nextProps) {
        const {racks} = nextProps;
        const {history} = this.props;
        const {action = '', loading = 0, current = {}} = racks;
        const {moveU = {}} = racks;
        if (action === 'insert' && !_.isUndefined(moveU.saveSuccess) && moveU.saveSuccess) {
            const url = prevURL + '/categories/rack-view?id=' + current.rackId;
            history.push(url);
        }
    }

    getData() {
        this.props.dispatch(rackA.getOthers2());
    }

    validate() {
        let {racks, dispatch} = this.props;
        let {moveU = {}} = racks;
        let positionU = '';
        let dataCenterId = '', roomId = '', zoneId = '', rackId = '';
        if (!moveU.positionU) {
            positionU = 'This field is required';
        }
        // if(!moveU.dataCenterId) {
        //     height = 'This field is required';
        // }
        // if(!moveU.roomId) {
        //     description = 'This field is required';
        // }
        // if(!moveU.zoneId) {
        //     height = 'This field is required';
        // }
        // if(!moveU.rackId) {
        //     description = 'This field is required';
        // }

        if (!positionU && !dataCenterId && !roomId && !zoneId && !rackId) {
            return true;
        }
        dispatch(rackA.validate({positionU, dataCenterId, roomId, zoneId, rackId}));
        return false;
    }

    handleSave(e) {
        if (!this.validate()) return false;
        const {racks = {}, dispatch} = this.props;
        let {moveU = {}} = racks;
        let data = {
            ...moveU
        };
        dispatch(rackA.saveMoveU(data));
    }

    handleCancel() {
        const {racks = {}, history} = this.props;
        const {current = {}} = racks;
        if (current.rackId) {
            history.push(prevURL + '/categories/rack-view?id=' + racks.current.rackId);
        }
        history.push(prevURL + '/layouts/layouts');
    }

    handleChangeInput(e) {
        const {racks = {}, dispatch} = this.props;
        const {moveU = {}} = racks;
        const {name, value} = e.target;

        dispatch(rackA.handleMoveU({
            ...moveU,
            [name]: value
        }));
    }

    handleSelect(e, data) {
        const {value, name} = data;
        const {dispatch, racks = {}} = this.props;
        const {moveU = {}} = racks;
        let _moveU = {};

        if (name === "dataCenterId") {
            _moveU = {...moveU};
            delete _moveU.roomId;
            delete _moveU.zoneId;
            delete _moveU.rackId;
            dispatch(rackA.handleMoveU({
                ..._moveU,
                [name]: value
            }));
        } else if (name === "roomId") {
            _moveU = {...moveU};
            delete _moveU.zoneId;
            delete _moveU.rackId;
            dispatch(rackA.handleMoveU({
                ..._moveU,
                [name]: value
            }));
        } else if (name === "zoneId") {
            _moveU = {...moveU};
            delete _moveU.rackId;
            dispatch(rackA.handleMoveU({
                ..._moveU,
                [name]: value
            }));
        } else if (name === "rackId") {
            dispatch(rackA.handleMoveU({
                ...moveU,
                [name]: value
            }));
            this.props.dispatch(rackA.getRackById({rackId: value}));
        } else if (name === "positionU") {
            dispatch(rackA.handleMoveU({
                ...moveU,
                [name]: value
            }));
        }

    }

    getSelectDatacenter() {
        const {racks = {}} = this.props;
        const {dataCenters = []} = racks;
        if (_.isUndefined(racks.current)) {
            return [];
        } else {
            let result = dataCenters.filter(item => {
                return item.locationId === racks.current.locationId;
            }).map(item => {
                return {
                    text: item.dataCenterName,
                    value: item.dataCenterId
                }
            });
            return result;
        }

    }

    getSelectRoom() {
        const {racks = {}} = this.props;
        const {rooms = []} = racks;
        if (_.isUndefined(racks.moveU) || _.isUndefined(racks.moveU.dataCenterId) || _.isNull(racks.moveU.dataCenterId)) {
            return [];
        } else {
            let result = rooms.filter(item => {
                return item.dataCenterId === racks.moveU.dataCenterId;
            }).map(item => {
                return {
                    text: item.roomName,
                    value: item.roomId
                }
            });
            return result;
        }
    }

    getSelectZone() {
        const {racks = {}} = this.props;
        const {zones = []} = racks;
        if (_.isUndefined(racks.moveU) || _.isUndefined(racks.moveU.roomId) || _.isNull(racks.moveU.roomId)) {
            return [];
        } else {
            let result = zones.filter(item => {
                return item.roomId === racks.moveU.roomId;
            }).map(item => {
                return {
                    text: item.zoneName,
                    value: item.zoneId
                }
            });
            return result;
        }
    }

    getSelectRack() {
        const {racks = {}} = this.props;
        const {listRack = []} = racks;
        if (_.isUndefined(racks.moveU) || _.isUndefined(racks.moveU.zoneId) || _.isNull(racks.moveU.zoneId)) {
            return [];
        } else {
            let result = listRack.filter(item => {
                return item.zoneId === racks.moveU.zoneId;
            }).map(item => {
                return {
                    text: item.rackName,
                    value: item.rackId
                }
            });
            return result;
        }
    }

    checkHeightMax(U) {
        let {racks} = this.props;
        let {moveU = {}, current = {}} = racks;
        let height = U;
        if (!_.isUndefined(current.bookingUs) || !_.isNull(current.bookingUs)) { // co' bookingUs
            let book = current.bookingUs.filter((item, index) => {
                return item.position === moveU.position && item.positionU < U;
            });
            if (book.length > 0) {
                let bookMax = book.reduce((prev, curr) => {
                    return prev.positionU > curr.positionU ? prev : curr;
                });
                height = U - bookMax.positionU;
            }
        }
        if (!_.isUndefined(current.devices) || !_.isNull(current.devices)) { // co' devices
            let device = current.devices.filter((item, index) => {
                return item.position === moveU.position && item.positionU < U;
            });
            if (device.length > 0) {
                let deviceMax = device.reduce((prev, curr) => {
                    return prev.positionU > curr.positionU ? prev : curr;
                });
                if ((U - deviceMax.positionU) < height) {
                    height = U - deviceMax.positionU;
                }
            }
        }
        return height;
    }

    getSelectPosition() {
        let {racks} = this.props;
        let {moveU = {}, current = {}} = racks;
        let result = [];
        if (_.isUndefined(racks.moveU) || _.isUndefined(racks.moveU.rackId) || _.isNull(racks.moveU.rackId)) {
            return [];
        } else {
            let book = [], device = [], noU = [];
            if (!_.isUndefined(current.bookingUs) || !_.isNull(current.bookingUs)) { // co' bookingUs
                book = current.bookingUs.filter((item, index) => {
                    return item.position === moveU.position;
                });
            }
            if (!_.isUndefined(current.devices) || !_.isNull(current.devices)) { // co' devices
                device = current.devices.filter((item, index) => {
                    return item.position === moveU.position;
                });
            }
            let arr = book.concat(device);
            console.log(arr);
            // if(moveU.height === 1){

            // } else {

            // }
            arr.forEach(item => {
                if (item.height === 1) {
                    noU.push(item.positionU);
                } else {
                    noU.push(item.positionU);
                    let i = 1;
                    let hei = item.height;
                    while (hei > 1) {
                        noU.push(item.positionU - i);
                        i++;
                        hei--;
                    }
                }
            });

            console.log(noU.indexOf(moveU.positionU));
            console.log('no', noU);
            if (moveU.height === 1) {
                noU.splice(noU.indexOf(moveU.positionU), 1);
            } else {
                noU.splice(noU.indexOf(moveU.positionU), 1);
                let j = 1;
                let heig = moveU.height;
                while (heig > 1) {
                    noU.splice(noU.indexOf(moveU.positionU - j), 1);
                    j++;
                    heig--;
                }
            }

            console.log('noU', noU);
            let newArr = [];
            for (let i = 42; i >= 1; i--) {
                if (noU.indexOf(i) === -1) {
                    newArr.push(i);
                }
            }
            // console.log('newArr', newArr);
            result = newArr.filter((item, index) => {
                return this.checkHeightMax(item) >= moveU.height;
            }).map(item => {
                return {
                    text: "U" + item,
                    value: parseInt(item)
                }
            });

            // console.log('result', result);
        }
        return result;

    }

    render() {
        let {racks = {}} = this.props;
        let {
            current = {}, moveU = {}, loading = 0,
            validate = {
                positionU: '',
                dataCenterId: '',
                zoneId: '', roomId: '', rackId: ''
            }
        } = racks;
        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        <Grid divided='vertically' className='grid-toolbar'>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Form>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='label'
                                                value={moveU.label ? moveU.label : moveU.description}
                                                fluid
                                                label={<label>Device Name </label>}
                                                disabled
                                            />
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='location'
                                                value={current.locationName}
                                                fluid
                                                label={<label>Location </label>}
                                                disabled
                                            />
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Dropdown
                                                name='dataCenterId'
                                                label={<label>DataCenter <strong
                                                    className="error-validate">*</strong></label>}
                                                fluid
                                                placeholder='Select...'
                                                search
                                                selection
                                                clearable
                                                options={this.getSelectDatacenter()}
                                                onChange={this.handleSelect.bind(this)}
                                                value={moveU.dataCenterId || ''}
                                                error={validate.dataCenterId ? true : false}
                                            />
                                            <Label className={`error-text ${validate.dataCenterId ? '' : 'hide'}`} basic
                                                   color='red' pointing>
                                                {validate.dataCenterId}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Dropdown
                                                name='roomId'
                                                label={<label>Room <strong
                                                    className="error-validate">*</strong></label>}
                                                fluid
                                                placeholder='Select...'
                                                search
                                                selection
                                                clearable
                                                options={this.getSelectRoom()}
                                                onChange={this.handleSelect.bind(this)}
                                                value={moveU.roomId || ''}
                                                error={validate.roomId ? true : false}
                                            />
                                            <Label className={`error-text ${validate.roomId ? '' : 'hide'}`} basic
                                                   color='red' pointing>
                                                {validate.roomId}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Button secondary type='submit' disabled={loading === 1}
                                                         onClick={this.handleCancel.bind(this)}>Cancel</Form.Button>
                                            <Form.Button primary type='submit' disabled={loading === 1}
                                                         onClick={this.handleSave.bind(this)}>Save Changes</Form.Button>
                                        </Form.Group>
                                    </Form>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Dropdown
                                                name='zoneId'
                                                label={<label>Zone <strong
                                                    className="error-validate">*</strong></label>}
                                                fluid
                                                placeholder='Select...'
                                                search
                                                selection
                                                clearable
                                                options={this.getSelectZone()}
                                                onChange={this.handleSelect.bind(this)}
                                                value={moveU.zoneId || ''}
                                                error={validate.zoneId ? true : false}
                                            />
                                            <Label className={`error-text ${validate.zoneId ? '' : 'hide'}`} basic
                                                   color='red' pointing>
                                                {validate.zoneId}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Dropdown
                                                name='rackId'
                                                label={<label>Rack <strong
                                                    className="error-validate">*</strong></label>}
                                                fluid
                                                placeholder='Select...'
                                                search
                                                selection
                                                clearable
                                                options={this.getSelectRack()}
                                                onChange={this.handleSelect.bind(this)}
                                                value={moveU.rackId || ''}
                                                error={validate.rack ? true : false}
                                            />
                                            <Label className={`error-text ${validate.rack ? '' : 'hide'}`} basic
                                                   color='red' pointing>
                                                {validate.rack}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Dropdown
                                                name='positionU'
                                                label={<label>Position <strong
                                                    className="error-validate">*</strong></label>}
                                                fluid
                                                placeholder='Chọn U ...'
                                                search
                                                selection
                                                clearable
                                                options={this.getSelectPosition()}
                                                onChange={this.handleSelect.bind(this)}
                                                value={moveU.positionU || ''}
                                                error={validate.positionU ? true : false}
                                            />
                                            <Label className={`error-text ${validate.position ? '' : 'hide'}`} basic
                                                   color='red' pointing>
                                                {validate.positionU}
                                            </Label>
                                        </Form.Group>
                                        <Form.Group className="form-group" widths='equal'>
                                            <Form.Input
                                                name='height'
                                                value={moveU.height}
                                                // onChange={this.handleChangeInput.bind(this)} 
                                                fluid
                                                type='number' max={42} min={1}
                                                label={<label>Height</label>}
                                                disabled
                                                // error={validate.height? true: false}
                                            />
                                            {/* <Label className={`error-text ${validate.height? '': 'hide'}`} basic color='red' pointing> */}
                                            {/* {validate.height} */}
                                            {/* </Label> */}
                                        </Form.Group>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

// const mapStateToProps =({racks}) => ({racks});
const mapStateToProps = (state, props) => {
    const {racks} = state;
    const _racks = props.racks;
    if (racks.originalUrl) {
        return {
            racks
        };
    } else {
        return {
            racks: {
                ...props.racks,
                ...racks,
            }
        };
    }

};

export default connect(mapStateToProps, null)(MoveU);