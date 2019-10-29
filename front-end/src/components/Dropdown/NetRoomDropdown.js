import {Dropdown} from "semantic-ui-react";
import React, {Component, Fragment} from 'react';
import {Form} from "semantic-ui-react/dist/commonjs/collections/Form/Form";
import {connect} from 'react-redux';
import _ from "lodash";
import {getNetDeviceFunctions} from '../../../src/redux/_actions/netData/netDataA';
import {getNetRoomsByAreaId} from "../../utils/api";
import {toast} from "react-toastify";

export default class NetRoomDropdownDropdown extends Component {
    constructor(props) {
        super(props);

        this.state= {
            rooms : []
        }
    }

    getRoomList = async (areaId)=>{
        try {
            const rooms = await getNetRoomsByAreaId(areaId);
            this.setState({
                rooms: rooms
            });
        }
        catch (e) {
            console.log(e);
            toast.error('Cannot get rooms of area');
        }
    };

    shouldComponentUpdate(nextProps, nextState) {

        let result = (!_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state));
        return result;
    }

    componentDidMount()
    {
        if (this.props.areaId)
        {
            this.getRoomList(this.props.areaId);
        }
    };

    componentWillReceiveProps = (nextProps) =>{
        if (nextProps.areaId && nextProps.areaId != this.props.areaId)
        {
            this.getRoomList(nextProps.areaId);
        }
    };

    render() {

        const {placeholder='', value, onChange, name} = this.props;
        const {rooms} = this.state;

        return (
            <Dropdown
                placeholder={placeholder}
                fluid
                search
                selection
                name={name}
                options = {rooms.map(e=>({
                    key: e.id,
                    value: e.id,
                    text: e.name
                }))}
                value={value}
                onChange={onChange}
            />
        )
    }
}
