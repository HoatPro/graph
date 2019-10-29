import {Dropdown} from "semantic-ui-react";
import React, {Component, Fragment} from 'react';
import {Form} from "semantic-ui-react/dist/commonjs/collections/Form/Form";
import {connect} from 'react-redux';
import _ from "lodash";
import {getNetDeviceFunctions} from '../../../src/redux/_actions/netData/netDataA';

class NetDeviceFunctionDropdownWithRedux extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount()
    {
        if (_.size(this.props.options)==0)
        {
            this.props.dispatch(getNetDeviceFunctions());
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        let result = (!_.isEqual(nextProps, this.props));
        return result;
    }

    render() {

        const {options, placeholder='', value, onChange, name} = this.props;

        return (
            <Dropdown
                placeholder={placeholder}
                fluid
                search
                selection
                name = {name}
                options = {options}
                value={value}
                onChange={onChange}
            />
        )
    }
}

export default connect((state) => ({
    options : state.netData.netDeviceFunctions.map(e => ({
        key: e.netDeviceFunctionId,
        value: e.netDeviceFunctionId,
        text: e.netDeviceFunctionName
    }))
}), null)(NetDeviceFunctionDropdownWithRedux);

