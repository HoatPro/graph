import React from 'react';
import {Button, Input, Header, Grid, Segment, Icon, Form, Container, Label} from 'semantic-ui-react';
// import {Link} from 'react-router-dom';
// import { connect } from 'react-redux';

class UpNewStep1 extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
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
                        <Grid.Column width={8}>
                            <Form>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input
                                        name='serverType'
                                        // value={moveU.label ? moveU.label : moveU.description} 
                                        fluid
                                        label={<label>Loại server </label>}
                                    />
                                </Form.Group>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input
                                        name='endDate'
                                        // value={moveU.label ? moveU.label : moveU.description} 
                                        fluid
                                        label={<label>Ngày kết thúc </label>}
                                        disabled
                                    />
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                        {/* </Grid.Row>
                    <Grid.Row columns={1}> */}
                        <Grid.Column width={16}>
                            <Form>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input
                                        name='title'
                                        // value={moveU.label ? moveU.label : moveU.description} 
                                        fluid
                                        label={<label>Tiêu đề <strong className="error-validate">*</strong></label>}
                                    />
                                </Form.Group>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input
                                        name='mail'
                                        // value={moveU.label ? moveU.label : moveU.description} 
                                        fluid
                                        label={<label>Người nhận mail <strong
                                            className="error-validate">*</strong></label>}
                                    />
                                    <Label basic color='orange' pointing size='large'> Mỗi mail cách nhau bởi dấu
                                        ";" </Label>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.TextArea
                                        name='description' fluid={"true"}
                                        // onChange={this.handleChangeInput.bind(this)} 
                                        // value={bookingU.description || ''} 
                                        rows={2}
                                        label={<label>Ghi chú </label>}
                                    />
                                </Form.Group>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input
                                        name='file'
                                        // value={moveU.label ? moveU.label : moveU.description} 
                                        fluid
                                        type='file'
                                        label={<label>File đính kèm</label>}
                                    />
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input
                                        name='fullName'
                                        // value={moveU.label ? moveU.label : moveU.description} 
                                        fluid
                                        label={<label>Họ và tên <strong className="error-validate">*</strong></label>}
                                    />
                                </Form.Group>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input
                                        name='contractName'
                                        // value={moveU.label ? moveU.label : moveU.description} 
                                        fluid
                                        label={<label>Tên hợp đồng <strong
                                            className="error-validate">*</strong></label>}
                                    />
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input
                                        name='phone'
                                        // value={moveU.label ? moveU.label : moveU.description} 
                                        fluid
                                        label={<label>Phone <strong className="error-validate">*</strong></label>}
                                    />
                                </Form.Group>

                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input
                                        name='company'
                                        // value={moveU.label ? moveU.label : moveU.description} 
                                        fluid
                                        label={<label>Công ty <strong className="error-validate">*</strong></label>}
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

export default UpNewStep1;