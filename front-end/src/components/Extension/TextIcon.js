import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from "semantic-ui-react";

export default class TextIcon extends React.Component {

    styleTextIcon = {
        wrapper: {
            whiteSpace: 'nowrap',
            display: 'inline-flex'
        },
        text: {
            alignSelf: 'center',
            paddingLeft: '4px'
        }
    };

    static propTypes = {
        name: PropTypes.string.isRequired,
        hideText: PropTypes.bool.isRequired,
        color: PropTypes.string
    };

    render() {
        return (
            <div style={this.styleTextIcon.wrapper}>
                <Icon size='large'
                      color={this.props.color}
                      name={this.props.name}/>
                <div style={this.styleTextIcon.text} hidden={this.props.hideText}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
