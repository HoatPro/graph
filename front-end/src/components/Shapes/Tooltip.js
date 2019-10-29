import React from "react";
// import {Label, Tag, Text} from "react-konva";
import PropTypes from "prop-types";
import ReactTooltip from 'react-tooltip';

class Tooltip extends React.Component {

    render() {
        const {
            x,
            y,
            width,
            height,
            id,
            stroke,
            name,
            draggable,
            strokeWidth,
            onKeyDown,
            zIndex,
            visible,
            content,
            idTooltip,
            pointerDirection
        } = this.props;
        return (<ReactTooltip
            id={idTooltip}
            aria-haspopup='true'
            role='example'
        />)
    }
}

Tooltip.defaultProps = {
    menuSetting: () => {
    },
    stroke: 'red',
    strokeWidth: 1,
};

Tooltip.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    stroke: PropTypes.string,
    menuSetting: PropTypes.func,
    strokeWidth: PropTypes.number,
    content: PropTypes.string.isRequired
    // zIndex: PropTypes.number,
};

export default Tooltip;