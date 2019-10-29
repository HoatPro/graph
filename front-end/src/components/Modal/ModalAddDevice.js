import React from 'react';
import {Button, Header, Icon, Image, Modal, Grid, Form, Radio} from 'semantic-ui-react';

class ModalAddDevice extends React.Component {
    state = {positionRack: 'front'}

    // show = () => () => this.setState({ open: true })
    // close = () => this.setState({ open: false })

    handleSelect(e, data) {
        const {value, name} = data;
        // const {dispatch, racks = {}} = this.props;
        // const {addDevice = {}} = racks;
        // dispatch(rackA.handleAddDevice({
        //     ...addDevice,
        //     [name]: value
        // }));
    }

    onSave = () => {

    }

    handleChangeRadio = (e, {value}) => this.setState({positionRack: value})

    render() {
        const {open, handleClose, handleOpen} = this.props;
        return (
            <Modal open={open} onClose={handleClose}>
                <Modal.Header>Thông tin hợp đồng</Modal.Header>
                <Modal.Content image>
                    <Grid className='grid-toolbar'>
                        <Grid.Row style={{paddingBottom: 0}}>
                            <Grid.Column width={8}>
                                <Form>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Dropdown
                                            name='locationId'
                                            label={<label>Location <strong
                                                className="error-validate">*</strong></label>}
                                            fluid
                                            placeholder='Select...'
                                            search
                                            selection
                                            clearable
                                            // options={this.getDeviceType()}
                                            // onChange={this.handleSelect.bind(this)}
                                            // value={addDevice.deviceTypeId || ''}
                                            // error={validate.deviceTypeId? true: false}
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Dropdown
                                            name='datacenterId'
                                            label={<label>Datacenter <strong
                                                className="error-validate">*</strong></label>}
                                            fluid
                                            placeholder='Select...'
                                            search
                                            selection
                                            clearable
                                            // options={this.getDeviceType()}
                                            // onChange={this.handleSelect.bind(this)}
                                            // value={addDevice.deviceTypeId || ''}
                                            // error={validate.deviceTypeId? true: false}
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Dropdown
                                            name='roomId'
                                            label={<label>Room <strong className="error-validate">*</strong></label>}
                                            fluid
                                            placeholder='Select...'
                                            search
                                            selection
                                            clearable
                                            // options={this.getDeviceType()}
                                            // onChange={this.handleSelect.bind(this)}
                                            // value={addDevice.deviceTypeId || ''}
                                            // error={validate.deviceTypeId? true: false}
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Dropdown
                                            name='zoneId'
                                            label={<label>Zone <strong className="error-validate">*</strong></label>}
                                            fluid
                                            placeholder='Select...'
                                            search
                                            selection
                                            clearable
                                            // options={this.getDeviceType()}
                                            // onChange={this.handleSelect.bind(this)}
                                            // value={addDevice.deviceTypeId || ''}
                                            // error={validate.deviceTypeId? true: false}
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Dropdown
                                            name='rackId'
                                            label={<label>Rack <strong className="error-validate">*</strong></label>}
                                            fluid
                                            placeholder='Select...'
                                            search
                                            selection
                                            clearable
                                            // options={this.getDeviceType()}
                                            // onChange={this.handleSelect.bind(this)}
                                            // value={addDevice.deviceTypeId || ''}
                                            // error={validate.deviceTypeId? true: false}
                                        />
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Form>
                                    <Form.Group className="form-group" widths='equal' style={{paddingTop: 5}}>
                                        <Form.Input
                                            name='barcode'
                                            // value={current.barcode} 
                                            fluid
                                            label={<label>Barcode</label>}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal' style={{paddingTop: 5}}>
                                        <Form.Input
                                            name='serverType'
                                            // value={current.barcode} 
                                            fluid
                                            label={<label>ServerType</label>}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal' style={{paddingTop: 5}}>
                                        <Form.Input
                                            name='cpu'
                                            // value={current.barcode} 
                                            fluid
                                            label={<label>CPU</label>}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal' style={{paddingTop: 5}}>
                                        <Form.Input
                                            name='cpu'
                                            // value={current.barcode} 
                                            fluid
                                            label={<label>RAM</label>}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal' style={{paddingTop: 5}}>
                                        <Form.Input
                                            name='cpu'
                                            // value={current.barcode} 
                                            fluid
                                            label={<label>HDD</label>}
                                            disabled
                                        />
                                    </Form.Group>

                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{paddingTop: 0, paddingBottom: 0}}>
                            <Grid.Column width={2}>
                                <Form>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='port'
                                            // value={current.barcode} 
                                            fluid
                                            type='number'
                                            max={24} min={1}
                                            label={<label>Port</label>}
                                        />
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Form>
                                    <Form.Group className="form-group" widths='equal' style={{paddingTop: 21}}>
                                        <Form.Dropdown
                                            name='portNumber'
                                            // label={<label>Rack <strong className="error-validate">*</strong></label>}
                                            fluid
                                            placeholder='Select port'
                                            search
                                            selection
                                            clearable
                                            // options={this.getDeviceType()}
                                            // onChange={this.handleSelect.bind(this)}
                                            // value={addDevice.deviceTypeId || ''}
                                            // error={validate.deviceTypeId? true: false}
                                        />
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Form>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='ip'
                                            // value={current.barcode} 
                                            fluid
                                            label={<label>IP</label>}
                                            disabled
                                        />
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{paddingTop: 0, paddingBottom: 0}}>
                            <Grid.Column width={8}>
                                <Form>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='switch'
                                            // value={current.switch} 
                                            fluid
                                            type='number'
                                            label={<label>Switch</label>}
                                        />
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Form>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='startDate'
                                            // value={current.barcode} 
                                            fluid
                                            label={<label>StartDate</label>}
                                            disabled
                                        />
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Form>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='endDate'
                                            // value={current.barcode} 
                                            fluid
                                            label={<label>EndDate</label>}
                                            disabled
                                        />
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{paddingTop: 0}}>
                            <Grid.Column width={2}>
                                <Form style={{paddingTop: 35}}>
                                    <Form.Field>
                                        <Radio
                                            label='Front'
                                            name='frontRack'
                                            value='front'
                                            checked={this.state.positionRack === 'front'}
                                            onChange={this.handleChangeRadio}
                                        />
                                    </Form.Field>
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Form style={{paddingTop: 35}}>
                                    <Form.Field>
                                        <Radio
                                            label='Rear'
                                            name='frontRear'
                                            value='rear'
                                            checked={this.state.positionRack === 'rear'}
                                            onChange={this.handleChangeRadio}
                                        />
                                    </Form.Field>
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Form>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Dropdown
                                            name='zoneId'
                                            label={<label>Position U</label>}
                                            fluid
                                            placeholder='Select position U'
                                            search
                                            selection
                                            clearable
                                            // options={this.getDeviceType()}
                                            // onChange={this.handleSelect.bind(this)}
                                            // value={addDevice.deviceTypeId || ''}
                                            // error={validate.deviceTypeId? true: false}
                                        />
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Form>
                                    <Form.Group widths='equal'>
                                        <Form.TextArea
                                            name='description'
                                            fluid
                                            // onChange={this.handleChangeInput.bind(this)} 
                                            // value={bookingU.description || ''} 
                                            label={<label>Ghi chú</label>} placeholder='Ghi chú'
                                            // error={validate.description? true: false} 
                                        />
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>

                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative icon='remove' labelPosition='right' onClick={handleClose} content='Cancel'/>
                    <Button positive icon='checkmark' labelPosition='right' content='Save' onClick={this.onSave}/>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default ModalAddDevice;