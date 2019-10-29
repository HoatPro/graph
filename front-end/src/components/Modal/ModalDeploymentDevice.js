import React from 'react';
import {Button, Modal, Grid, Form, Input} from 'semantic-ui-react';

class ModalDeploymentDevice extends React.Component {

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
                text: 'Triển khai mới',
                value: -2
            },
            {
                text: 'Chưa phân công',
                value: -1
            },
            {
                text: 'Triển khai lại',
                value: 0
            },
            {
                text: 'Chưa thi công',
                value: 1
            },
            {
                text: 'Đang thi công',
                value: 2
            },
            {
                text: 'Triển khai OK',
                value: 3
            },
            {
                text: 'Triển khai NOT OK',
                value: 4
            },
        ]
        return (
            <Modal
                open={open}
                onClose={onClose}
                size='large'
                closeOnEscape={true}
                closeOnDimmerClick={false}
            >
                <Modal.Header>Triển khai lắp đặt thiết bị</Modal.Header>
                <Modal.Content scrolling>
                    <Grid className='grid-toolbar'>
                        <Grid.Row className='row-edit'>
                            <Grid.Column width={5}>
                                <Form>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>Deployment ID</label>
                                            <Input
                                                name='id'
                                                value={data.deployid || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>NOCDataCenterId</label>
                                            <Input
                                                name='nocDataCenterId'
                                                value={data.NOCDataCenterId || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>NOC DataCenter Name</label>
                                            <Input
                                                name='nocDataCenterName'
                                                value={data.NOCDataCenterName || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>NOC Location ID</label>
                                            <Input
                                                name='nocLocationId'
                                                value={data.NOCLocationId || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>NOC Location Name </label>
                                            <Input
                                                name='nocLocationName'
                                                value={data.NOCLocationName || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> NOCNumberOfConnection</label>
                                            <Input
                                                name='nocNumberOfConnection'
                                                value={data.NOCNumberOfConnection || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>NOCPort </label>
                                            <Input
                                                name='nocPort'
                                                value={data.NOCPort}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> NOCRackId</label>
                                            <Input
                                                name='nocRackId'
                                                value={data.NOCRackId || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> NOCRackName</label>
                                            <Input
                                                name='nocRackName'
                                                value={data.NOCRackName || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>NOCRackTotalu </label>
                                            <Input
                                                name='nocRackTotalu'
                                                value={data.NOCRackTotalu || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>NOCRoomId </label>
                                            <Input
                                                name='nocRoomId'
                                                value={data.NOCRoomId || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> NOCRoomName</label>
                                            <Input
                                                name='nocRoomName'
                                                value={data.NOCRoomName || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>NOCZoneId </label>
                                            <Input
                                                name='nocZoneId'
                                                value={data.NOCZoneId || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> NOCZoneName</label>
                                            <Input
                                                name='nocZoneName'
                                                value={data.NOCZoneName || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>salecenterid </label>
                                            <Input
                                                name='salecenterid'
                                                value={data.salecenterid || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>salename </label>
                                            <Input
                                                name='salename'
                                                value={data.salename || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> salephonenumber</label>
                                            <Input
                                                name='salephonenumber'
                                                value={data.salephonenumber || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>servicegroupname </label>
                                            <Input
                                                name='servicegroupname'
                                                value={data.servicegroupname || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>servicetypename </label>
                                            <Input
                                                name='servicetypename'
                                                value={data.servicetypename || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>ID </label>
                                            <Input
                                                name='id'
                                                value={data.ID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> REGISTRATIONCODE</label>
                                            <Input
                                                name='registrationCode'
                                                value={data.REGISTRATIONCODE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>REGISTRATIONID </label>
                                            <Input
                                                name='registrationId'
                                                value={data.REGISTRATIONID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CONTRACTID </label>
                                            <Input
                                                name='contractId'
                                                value={data.CONTRACTID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>OBJID </label>
                                            <Input
                                                name='objId'
                                                value={data.OBJID || ''}
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
                                            <label> REGISTRATIONDETAILCODE</label>
                                            <Input
                                                name='registrationDetailCode'
                                                value={data.REGISTRATIONDETAILCODE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>SERVICETYPEID </label>
                                            <Input
                                                name='servicetypeId'
                                                value={data.SERVICETYPEID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>DEVICESIZE</label>
                                            <Input
                                                name='deviceSize'
                                                value={data.DEVICESIZE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> CAPACITYONEPOWER</label>
                                            <Input
                                                name='capacityOnePower'
                                                value={data.CAPACITYONEPOWER || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>APACITYTWOPOWER </label>
                                            <Input
                                                name='apacityTwoPower'
                                                value={data.APACITYTWOPOWER || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>IPNUMBER </label>
                                            <Input
                                                name='ipNumber'
                                                value={data.IPNUMBER || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>BRANDNAME </label>
                                            <Input
                                                name='brandName'
                                                value={data.BRANDNAME || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> CPU</label>
                                            <Input
                                                name='cpu'
                                                value={data.CPU || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>RAM </label>
                                            <Input
                                                name='ram'
                                                value={data.RAM || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>HDD </label>
                                            <Input
                                                name='hdd'
                                                value={data.HDD || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> BANDWIDTHLOCAL</label>
                                            <Input
                                                name='bandwidthLocal'
                                                value={data.BANDWIDTHLOCAL || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>BANDWIDTHINTER </label>
                                            <Input
                                                name='bandwidthInter'
                                                value={data.BANDWIDTHINTER || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>NETWORKSOCKET </label>
                                            <Input
                                                name='networkSocket'
                                                value={data.NETWORKSOCKET || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>INTERNETCABLE </label>
                                            <Input
                                                name='internetCable'
                                                value={data.INTERNETCABLE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> MANAGERSERVERADD</label>
                                            <Input
                                                name='managerServerADD'
                                                value={data.MANAGERSERVERADD || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> FIREWALLADD</label>
                                            <Input
                                                name='firewallADD'
                                                value={data.FIREWALLADD || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CPANELADD</label>
                                            <Input
                                                name='cpanelADD'
                                                value={data.CPANELADD || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>OSADD </label>
                                            <Input
                                                name='osADD'
                                                value={data.OSADD || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> DESIGNRACK</label>
                                            <Input
                                                name='designRack'
                                                value={data.DESIGNRACK || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CAPACITYRACK </label>
                                            <Input
                                                name='capacityRack'
                                                value={data.CAPACITYRACK || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> RENTSPACE</label>
                                            <Input
                                                name='rentSpace'
                                                value={data.RENTSPACE}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>SERVERINSTALLEDNUMBER </label>
                                            <Input
                                                name='serverInstalledNumber'
                                                value={data.SERVERINSTALLEDNUMBER || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>POWERSUPPYRACK </label>
                                            <Input
                                                name='powerSuppyRack'
                                                value={data.POWERSUPPYRACK || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>PDUSTANDARD </label>
                                            <Input
                                                name='pduStandard'
                                                value={data.PDUSTANDARD || ''}
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
                                            <label>capacitytotaL1RACK </label>
                                            <Input
                                                name='capacitytotaL1RACK'
                                                value={data.capacitytotaL1RACK || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>capacitymaX1RACK </label>
                                            <Input
                                                name='capacitymaX1RACK'
                                                value={data.capacitymaX1RACK || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>DESCRIPTION </label>
                                            <Input
                                                name='description'
                                                value={data.DESCRIPTION || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> STATUS</label>
                                            <Input
                                                name='status'
                                                value={data.STATUS || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>ISNEEDSOLUTION </label>
                                            <Input
                                                name='iSneedSolution'
                                                value={data.ISNEEDSOLUTION || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> SALEPROMOTIONINFORMATION</label>
                                            <Input
                                                name='salePromotionInformation'
                                                value={data.SALEPROMOTIONINFORMATION || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>SERVICEGROUPID </label>
                                            <Input
                                                name='serviceGroupId'
                                                value={data.SERVICEGROUPID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>ISNEEDSURVEY </label>
                                            <Input
                                                name='IsNeedSurvey'
                                                value={data.ISNEEDSURVEY || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> FROMDATE</label>
                                            <Input
                                                name='fromDate'
                                                value={data.FROMDATE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>TODATE </label>
                                            <Input
                                                name='toDate'
                                                value={data.TODATE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> CREATEDBY</label>
                                            <Input
                                                name='createdBy'
                                                value={data.CREATEDBY || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>CREATEDDATE </label>
                                            <Input
                                                name='createdDate'
                                                value={data.CREATEDDATE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>UPDATEDBY </label>
                                            <Input
                                                name='updateBy'
                                                value={data.UPDATEDBY || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> UPDATEDDATE</label>
                                            <Input
                                                name='updatedDate'
                                                value={data.UPDATEDDATE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>BARCODE </label>
                                            <Input
                                                name='barCode'
                                                value={data.BARCODE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label> ISDEPLOY</label>
                                            <Input
                                                name='isDeploy'
                                                value={data.ISDEPLOY || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>BRANCHID </label>
                                            <Input
                                                name='branchId'
                                                value={data.BRANCHID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>SUBCOMPANYID </label>
                                            <Input
                                                name='subCompanyId'
                                                value={data.SUBCOMPANYID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>DATACENTERDEPLOYID </label>
                                            <Input
                                                name='dataCenterDeployId'
                                                value={data.DATACENTERDEPLOYID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>AREADEPLOYID </label>
                                            <Input
                                                name='areaDeployId'
                                                value={data.AREADEPLOYID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>DATEDEPLOY </label>
                                            <Input
                                                name='dateDeploy'
                                                value={data.DATEDEPLOY || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>LOCATIONDCDEPLOYID </label>
                                            <Input
                                                name='locationDCDeployId'
                                                value={data.LOCATIONDCDEPLOYID || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>IPFREE </label>
                                            <Input
                                                name='ipFree'
                                                value={data.IPFREE || ''}
                                                disabled
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group className="form-group" widths='equal'>
                                        <Form.Field>
                                            <label>IPNOTFREE </label>
                                            <Input
                                                name='ipNotFree'
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

export default ModalDeploymentDevice;