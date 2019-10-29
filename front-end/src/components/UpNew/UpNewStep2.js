import React from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Form, Table, Label, Popup} from 'semantic-ui-react';
// import {Link} from 'react-router-dom';
// import { connect } from 'react-redux';
// import {customerA} from '../../src/redux/_actions/categories/customerA';
import ModalAddDevice from '../Modal/ModalAddDevice';
// import _ from 'lodash';
// import moment from 'moment';

class UpNewStep2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        }
    }

    handleOpenModal = () => {
        this.setState({
            showModal: true
        });
    };

    handleCloseModal = () => {
        this.setState({
            showModal: false
        });
    }

    render() {
        const {showModal} = this.state;
        return (
            <Segment>
                <Header>Thông tin thiết bị</Header>
                <Segment style={{overflow: 'auto', maxHeight: 597, minHeight: 597}}>
                    <Table striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.HeaderCell>Barcode</Table.HeaderCell>
                                <Table.HeaderCell>ServerType</Table.HeaderCell>
                                <Table.HeaderCell>CPU</Table.HeaderCell>
                                <Table.HeaderCell>RAM</Table.HeaderCell>
                                <Table.HeaderCell>HDD</Table.HeaderCell>
                                <Table.HeaderCell>IP</Table.HeaderCell>
                                <Table.HeaderCell>StartDate</Table.HeaderCell>
                                <Table.HeaderCell>EndDate</Table.HeaderCell>
                                <Table.HeaderCell>Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>1</Table.Cell>
                                <Table.Cell>8922141241242</Table.Cell>
                                <Table.Cell>Rack</Table.Cell>
                                <Table.Cell>1 x 1</Table.Cell>
                                <Table.Cell>1 x 1</Table.Cell>
                                <Table.Cell>1 x 1</Table.Cell>
                                <Table.Cell>172.27.122.123</Table.Cell>
                                <Table.Cell>29/8/2018</Table.Cell>
                                <Table.Cell>29/9/2019</Table.Cell>
                                <Table.Cell>
                                    <Button color="blue" size="small" basic disabled icon
                                            onClick={() => this.handleAddDevice()}>
                                        <Icon name="check"/>
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>2</Table.Cell>
                                <Table.Cell>8922141241316</Table.Cell>
                                <Table.Cell>Rack</Table.Cell>
                                <Table.Cell>1 x 1</Table.Cell>
                                <Table.Cell>1 x 1</Table.Cell>
                                <Table.Cell>1 x 1</Table.Cell>
                                <Table.Cell>172.27.122.123</Table.Cell>
                                <Table.Cell>29/3/2018</Table.Cell>
                                <Table.Cell>29/4/2019</Table.Cell>
                                <Table.Cell>
                                    <Popup position='right center' trigger={<Button color='blue' size="small" icon='add'
                                                                                    onClick={this.handleOpenModal}/>}
                                           content='Add device'/>
                                    <ModalAddDevice open={showModal} handleOpen={this.handleOpenModal}
                                                    handleClose={this.handleCloseModal}/>
                                </Table.Cell>
                            </Table.Row>

                        </Table.Body>
                    </Table>
                </Segment>

            </Segment>
        )
    }
}

// const mapStateToProps = ({ upNews }) => ({ upNews });

export default UpNewStep2;