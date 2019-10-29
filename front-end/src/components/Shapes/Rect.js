import React from "react";
import {Rect} from "react-konva";
import PropTypes from "prop-types";

class _Rect extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
    }

    handleChange(e) {
        const shape = e.target;
        // take a look into width and height properties
        // by default Transformer will change scaleX and scaleY
        // while transforming
        // so we need to adjust that properties to width and height
        this.props.onTransform({
            x: shape.x(),
            y: shape.y(),
            width: shape.width() * shape.scaleX(),
            height: shape.height() * shape.scaleY(),
            rotation: shape.rotation()
        });
    };

    handleContextMenu(e) {
        this.props.menuSetting(e);
    }

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
            zIndex
        } = this.props;
        return (
            <Rect
                x={x}
                y={y}
                id={id ? id : ''}
                width={width}
                height={height}
                name={name}
                // zIndex={zIndex}
                scaleX={1}
                scaleY={1}
                stroke={stroke}
                strokeWidth={strokeWidth}
                onDragEnd={this.handleChange}
                onTransformEnd={this.handleChange}
                draggable={draggable}
                onContextMenu={this.handleContextMenu}
            />
        );
    }
}

_Rect.defaultProps = {
    menuSetting: () => {
    },
    stroke: 'red',
    strokeWidth: 1,
};

_Rect.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    stroke: PropTypes.string,
    menuSetting: PropTypes.func,
    strokeWidth: PropTypes.number,
    // zIndex: PropTypes.number,
};

export default _Rect;