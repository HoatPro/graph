import React from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Form, Container, Label} from 'semantic-ui-react';
// import {Link} from 'react-router-dom';
// import { connect } from 'react-redux';
// import _ from 'lodash';
// import moment from 'moment';

class UpNewStep3 extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Header>Confirm Request</Header>
                <Grid className='grid-toolbar'>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Form>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input
                                        name='contractNumber'
                                        // value={moveU.label ? moveU.label : moveU.description} 
                                        fluid
                                        label={<label>Số hợp đồng <strong className="error-validate">*</strong></label>}
                                    />
                                </Form.Group>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input
                                        name='startDate'
                                        // value={moveU.label ? moveU.label : moveU.description} 
                                        fluid
                                        label={<label>Ngày bắt đầu </label>}
                                        disabled
                                    />
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

// const mapStateToProps = ({ upNews }) => ({ upNews });

export default UpNewStep3;