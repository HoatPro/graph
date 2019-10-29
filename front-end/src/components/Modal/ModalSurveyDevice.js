import React from 'react'
import {Button, Modal, Grid, Form, Input} from 'semantic-ui-react'
import moment from "moment";
import _ from 'lodash';

class ModalSurveyDevice extends React.Component {

    render() {

        const {
            data = {},
            open = false,
            onClose,
            onChange,
            value = '',
            validate = {},
            onSave
        } = this.props;
        const status = [

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
            },
        ]


        return (
            <Modal
                open={open}
                onClose={onClose}
                size='large'
                closeOnEscape={true}
                closeOnDimmerClick={false}>
                <Modal.Header>Thông tin chi tiết khảo sát thiết bị</Modal.Header>
                <Modal.Content scrolling>
                    <Grid className='grid-toolbar'>
                        <Grid.Row className='row-edit'>
                            <Grid.Column width={5}>
                                <Form>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>Survey ID</label>
                                            <Input
                                                name='surveyId'
                                                value={data.surveyid || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>ID</label>
                                            <Input
                                                name='id'
                                                value={data.ID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>ACCESSSTATUSID</label>
                                            <Input
                                                name='accessstatusId'
                                                value={data.ACCESSSTATUSID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>PRIORITYTYPEID</label>
                                            <Input
                                                name='prioritytypeid'
                                                value={data.PRIORITYTYPEID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CUSTOMERTYPE</label>
                                            <Input
                                                name='customerType'
                                                value={data.CUSTOMERTYPE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>UpdatedBy</label>
                                            <Input
                                                name='updatedby'
                                                value={data.updatedby || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>DESCRIPTIONEXCESS</label>
                                            <Input
                                                name='descriptioneExcess'
                                                value={data.DESCRIPTIONEXCESS || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>ISREQUESTNOC</label>
                                            <Input
                                                name='isRequestNOC'
                                                value={data.ISREQUESTNOC}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>DEVICELOCATION</label>
                                            <Input
                                                name='deviceLocation'
                                                value={data.DEVICELOCATION || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>ADDRESSIP</label>
                                            <Input
                                                name='addressIp'
                                                value={data.ADDRESSIP || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>UpdatedDate</label>
                                            <Input
                                                name='updatedDate'
                                                value={data.UpdatedDate || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>DATACENTERDEPLOYID</label>
                                            <Input
                                                name='dataCenterDeployId'
                                                value={data.DATACENTERDEPLOYID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>DATACENTERDEPLOYNAME</label>
                                            <Input
                                                name='dataCenterDeployName'
                                                value={data.DATACENTERDEPLOYNAME || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>REGISTRATIONDETAILCODE</label>
                                            <Input
                                                name='registrationDetailCode'
                                                value={data.REGISTRATIONDETAILCODE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>SERVICETYPEID</label>
                                            <Input
                                                name='serviceTypeId'
                                                value={data.SERVICETYPEID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>LOCATIONID</label>
                                            <Input
                                                name='locationId'
                                                value={data.LOCATIONID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CUSTOMERNAME</label>
                                            <Input
                                                name='customerName'
                                                value={data.CUSTOMERNAME || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CONTRACTNUMBER</label>
                                            <Input
                                                name='contractNumber'
                                                value={data.CONTRACTNUMBER || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>

                                </Form>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Form>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CONTRACTDATE</label>
                                            <Input
                                                name='id'
                                                value={data.CONTRACTDATE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>USERNAME</label>
                                            <Input
                                                name='accessstatusId'
                                                value={data.USERNAME || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>FROMDATE_CONTRACT</label>
                                            <Input
                                                name='prioritytypeid'
                                                value={data.FROMDATE_CONTRACT || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>TODATE_CONTRACT</label>
                                            <Input
                                                name='customerType'
                                                value={data.TODATE_CONTRACT || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>SALEPROMOTIONINFORMATION</label>
                                            <Input
                                                name='updatedby'
                                                value={data.SALEPROMOTIONINFORMATION || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CONTACTNAME</label>
                                            <Input
                                                name='descriptioneExcess'
                                                value={data.CONTACTNAME || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CONTACTPHONENUMBER</label>
                                            <Input
                                                name='isRequestNOC'
                                                value={data.CONTACTPHONENUMBER}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CREATEDBY</label>
                                            <Input
                                                name='deviceLocation'
                                                value={data.CREATEDBY || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CREATEDDATE</label>
                                            <Input
                                                name='addressIp'
                                                value={moment(data.CREATEDDATE).format("DD/MM/YYYY HH:mm:ss") || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>SALENAME</label>
                                            <Input
                                                name='updatedDate'
                                                value={data.SALENAME || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>DEVICESIZE</label>
                                            <Input
                                                name='dataCenterDeployId'
                                                value={data.DEVICESIZE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CAPACITYONEPOWER</label>
                                            <Input
                                                name='dataCenterDeployName'
                                                value={data.CAPACITYONEPOWER || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>APACITYTWOPOWER</label>
                                            <Input
                                                name='registrationDetailCode'
                                                value={data.APACITYTWOPOWER || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>IPNUMBER</label>
                                            <Input
                                                name='serviceTypeId'
                                                value={data.IPNUMBER || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>BRANDNAME</label>
                                            <Input
                                                name='locationId'
                                                value={data.BRANDNAME || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CPU</label>
                                            <Input
                                                name='customerName'
                                                value={data.CPU || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>RAM</label>
                                            <Input
                                                name='contractNumber'
                                                value={data.RAM || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>HDD</label>
                                            <Input
                                                name='id'
                                                value={data.HDD || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>

                                </Form>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Form>

                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>BANDWIDTHLOCAL</label>
                                            <Input
                                                name='accessstatusId'
                                                value={data.BANDWIDTHLOCAL || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>

                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>BANDWIDTHINTER</label>
                                            <Input
                                                name='prioritytypeid'
                                                value={data.BANDWIDTHINTER || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>NETWORKSOCKET</label>
                                            <Input
                                                name='customerType'
                                                value={data.NETWORKSOCKET || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>INTERNETCABLE</label>
                                            <Input
                                                name='updatedby'
                                                value={data.INTERNETCABLE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>MANAGERSERVERADD</label>
                                            <Input
                                                name='descriptioneExcess'
                                                value={data.MANAGERSERVERADD || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>FIREWALLADD</label>
                                            <Input
                                                name='isRequestNOC'
                                                value={data.FIREWALLADD}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CPANELADD</label>
                                            <Input
                                                name='deviceLocation'
                                                value={data.CPANELADD || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>OSADD</label>
                                            <Input
                                                name='addressIp'
                                                value={data.OSADD || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>DESIGNRACK</label>
                                            <Input
                                                name='updatedDate'
                                                value={data.DESIGNRACK || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CAPACITYRACK</label>
                                            <Input
                                                name='dataCenterDeployId'
                                                value={data.CAPACITYRACK || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>RENTSPACE</label>
                                            <Input
                                                name='dataCenterDeployName'
                                                value={data.RENTSPACE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>SERVERINSTALLEDNUMBER</label>
                                            <Input
                                                name='registrationDetailCode'
                                                value={data.SERVERINSTALLEDNUMBER || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>POWERSUPPYRACK</label>
                                            <Input
                                                name='serviceTypeId'
                                                value={data.POWERSUPPYRACK || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>PDUSTANDARD</label>
                                            <Input
                                                name='locationId'
                                                value={data.PDUSTANDARD || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>capacitytotaL1RACK</label>
                                            <Input
                                                name='customerName'
                                                value={data.capacitytotaL1RACK || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>capacitytotaL1RACK</label>
                                            <Input
                                                name='contractNumber'
                                                value={data.capacitytotaL1RACK || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>IPFREE</label>
                                            <Input
                                                name='contractNumber'
                                                value={data.IPFREE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>IPNOTFREE</label>
                                            <Input
                                                name='contractNumber'
                                                value={data.IPNOTFREE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>

                    </Grid>
                </Modal.Content>
                <Modal.Actions className="group-button-modal">
                    <Grid className='grid-toolbar'>
                        <Grid.Column width={3}>
                            <Button negative icon='remove' labelPosition='right' onClick={onClose} content='Cancel'/>
                        </Grid.Column>
                        <Grid.Column floated='right' textAlign="right" width={6}>
                            <Form>
                                <Form.Group className="form-group">
                                    <Form.Dropdown
                                        name='status'
                                        fluid
                                        placeholder='Select status'
                                        search
                                        selection
                                        clearable
                                        options={status}
                                        onChange={onChange}
                                        value={value}
                                        error={validate.status ? {content: validate.status, pointing: 'below'} : false}
                                    />
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                        <Grid.Column floated='right' textAlign="right" width={3}>
                            <Button positive icon='checkmark' labelPosition='right' content='Save'
                                    onClick={e => onSave(e)}/>

                        </Grid.Column>
                    </Grid>

                </Modal.Actions>
            </Modal>
        )
    }
}

export default ModalSurveyDevice;