import React from 'react';
import {Label, Header, Segment, Form} from 'semantic-ui-react';
import DashboardLayout from "../../components/Layout/DashboardLayout";
import history from "../history";
import {connect} from 'react-redux';
import {groupA} from "../../redux/_actions/admin/groupA";
import _ from 'lodash';
import _config from "../../utils/config";
import {ToastContainer} from "react-toastify";

const prevURL = _config[_config.environment].prevURL;

class GroupEdit extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {dispatch} = this.props;
        const groupTest = history.location;
        const query = groupTest.search || "";
        const params = new URLSearchParams(query);
        const groupId = params.get('id');

        if (groupId) {
            dispatch(groupA.initUpdate({action: 'update'}));
            dispatch(groupA.getGroupById({groupId: groupId}));
            document.title = "Update Group";

        } else {
            dispatch(groupA.initUpdate({action: 'insert'}));
            document.title = "Add New Group";
        }
    }

    componentWillReceiveProps = (nextProps) => {
        const {groups} = nextProps;
        const {action = '', loading = 0, current = {}} = groups;
        if ((action === 'insert' && loading === 2 && !_.isUndefined(current.groupId) && current.groupId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            history.push(prevURL + '/admin/groups');
        }
    }

    validate = () => {
        let {groups, dispatch} = this.props;
        let {current = {}} = groups;

        let groupName = '';
        if (!current.groupName) {
            groupName = 'May be not empty';
        }

        if (!groupName) {
            return true;
        }
        dispatch(groupA.validate({groupName: groupName}));
        return false;
    }

    handleSave = e => {
        if (!this.validate()) return false;
        const {groups, dispatch} = this.props;
        let {current, action} = groups;
        if (action === 'insert') {
            dispatch(groupA.insertGroup(current));
        } else if (action === 'update') {
            dispatch(groupA.updateGroup(current));
        }
    }

    handleCancel = () => {
        history.push(prevURL + '/admin/groups');
    }

    handleChangeInput = e => {
        const {groups = {}, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = groups;
        let _error = '';
        if (!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(groupA.updateCurrent(name, value, _error));
    }

    render() {
        let {groups = {}} = this.props;
        let {
            current = {
                groupId: '',
                groupName: '',
                description: '',
            }, validate = {
                groupName: '',
                groupKey: '',
            }, loading = 0, action
        } = groups;
        const title = action === 'update' ? 'Cập nhật Nhóm quyền' : 'Thêm mới Nhóm quyền';

        return (
            <div>
                {/*<Head>*/}
                {/*    <title>{title}</title>*/}
                {/*</Head>*/}
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        <ToastContainer enableMultiContainer/>
                        <Form>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input name='groupName' value={current.groupName} onChange={this.handleChangeInput}
                                            fluid label={<label>Tên Group <strong className="error-validate">*</strong></label>}
                                            placeholder='Tên Group' error={validate.groupName ? true : false}/>
                                <Label className={`error-text ${validate.groupName ? '' : 'hide'}`} basic color='red'
                                       pointing>
                                    {validate.groupName}
                                </Label>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.TextArea name='description' fluid={"true"} onChange={this.handleChangeInput}
                                               value={current.description || ''} label='Mô tả' placeholder='Mô tả'/>
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

const mapStateToProps = ({groups}) => ({groups});
export default connect(mapStateToProps, null)(GroupEdit);