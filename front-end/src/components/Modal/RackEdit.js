import React from 'react'
import {Button, Modal, Grid, Form, Label, Dropdown} from 'semantic-ui-react'
import PropTypes from "prop-types";
import _ from "lodash";

class RackEdit extends React.Component {

    render() {
        const {
            title = '',
            open = false,
            dataCenters = [],
            rooms = [],
            zones = [],
            current = {},
            validate = {},
            onClose,
            onSave,
            onChange
        } = this.props;

        return (
            <Modal open={open} onClose={onClose}>
                <Modal.Header>{title}</Modal.Header>
                <Modal.Content image>
                    <Grid className='grid-toolbar'>
                        <Grid.Row columns={3}>
                            <Grid.Column>
                                <Dropdown
                                    name='dataCenterId'
                                    label={<label>Data Center</label>}
                                    fluid
                                    placeholder='Select...'
                                    search
                                    selection
                                    clearable
                                    disabled
                                    options={dataCenters}
                                    value={current.dataCenterId}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Dropdown
                                    name='roomId'
                                    label={<label>Room</label>}
                                    fluid
                                    placeholder='Select...'
                                    search
                                    selection
                                    clearable
                                    disabled
                                    options={rooms}
                                    value={current.roomId}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Dropdown
                                    name='zoneId'
                                    label={<label>Zone</label>}
                                    fluid
                                    placeholder='Select...'
                                    search
                                    selection
                                    clearable
                                    disabled
                                    options={zones}
                                    // onChange={this.handleSelectRoom.bind(this)}
                                    value={current.zoneId || current._zoneId}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className='row-edit'>
                            <Grid.Column width={8}>
                                <Form>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='rackName'
                                            value={current.rackName || ''}
                                            onChange={onChange}
                                            fluid
                                            label={<label>Name <strong className="error-validate">*</strong></label>}
                                            placeholder='Name'
                                            error={validate.rackName ? true : false}
                                        />
                                        <Label className={`error-text ${validate.rackName ? '' : 'hide'}`} basic
                                               color='red' pointing>
                                            {validate.rackName}
                                        </Label>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='model'
                                            value={current.model || ''}
                                            onChange={onChange}
                                            fluid
                                            label={<label>Model</label>}
                                            placeholder='Model'
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='SNMP'
                                            value={current.SNMP || ''}
                                            onChange={onChange}
                                            fluid
                                            label={<label>SNMP</label>}
                                            placeholder='SNMP'
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='uNumber'
                                            value={current.uNumber || ''}
                                            onChange={onChange}
                                            fluid
                                            label={<label>U Number</label>}
                                            placeholder='U Number'
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='maxPower'
                                            value={current.maxPower || ''}
                                            onChange={onChange}
                                            fluid
                                            label={<label>Power Max</label>}
                                            placeholder='Power Max'
                                        />
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Form>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='wattage'
                                            value={current.wattage || ''}
                                            onChange={onChange}
                                            fluid
                                            label={<label>Measured Wattage</label>}
                                            placeholder='Measured Wattage'
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='maxWeight'
                                            value={current.maxWeight || ''}
                                            onChange={onChange}
                                            fluid
                                            label={<label>Max Weight</label>}
                                            placeholder='Max Weight'
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='rackWidth'
                                            value={current.rackWidth || ''}
                                            onChange={onChange}
                                            fluid
                                            label={<label>Width</label>}
                                            placeholder='Width'
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='rackHeight'
                                            value={current.rackHeight || ''}
                                            onChange={onChange}
                                            fluid
                                            label={<label>Height</label>}
                                            placeholder='Height'
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Input
                                            name='rackDepth'
                                            value={current.rackDepth || ''}
                                            onChange={onChange}
                                            fluid
                                            label={<label>Depth</label>}
                                            placeholder='Depth'
                                        />
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className='row-edit'>
                            <Grid.Column width={16}>
                                <Form>
                                    <Form.Group widths='equal'>
                                        <Form.TextArea name='description' fluid={"true"} onChange={e => onChange(e)}
                                                       value={current.description || ''} label='Description'
                                                       placeholder='Description'/>
                                    </Form.Group>

                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative icon='remove' labelPosition='right' onClick={e => {
                        onClose(e)
                    }} content='Cancel'/>
                    <Button positive icon='checkmark' labelPosition='right' content='Save' onClick={e => onSave(e)}/>
                </Modal.Actions>
            </Modal>
        )
    }
}

RackEdit.defaultProps = {
    draggable: true,
    image: null,
};

RackEdit.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    draggable: PropTypes.bool.isRequired,
    // image: PropTypes.object.isRequired,
};


export default RackEdit;