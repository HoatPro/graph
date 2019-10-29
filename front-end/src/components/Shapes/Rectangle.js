import React from "react";
import {Rect, Transformer} from "react-konva";
import PropTypes from "prop-types";

class Rectangle extends React.Component {
    constructor(props) {
        super(props);
        this.shapeRef = React.createRef();
        this.trRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isSelected) {
            // we need to attach transformer manually
            this.trRef.current.setNode(this.shapeRef.current);
            this.trRef.current.getLayer().batchDraw();
        }
    }

    render() {
        const {shapeProps, isSelected, onSelect, onChange, onMenu} = this.props;
        return (
            <React.Fragment>
                <Rect
                    onClick={onSelect}
                    ref={this.shapeRef}
                    {...shapeProps}
                    onContextMenu={onMenu}
                    onDragEnd={e => {
                        onChange({
                            ...shapeProps,
                            x: e.target.x(),
                            y: e.target.y()
                        });
                    }}
                    onTransformEnd={e => {
                        // transformer is changing scale
                        const node = this.shapeRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        // we will reset it back
                        node.scaleX(1);
                        node.scaleY(1);
                        onChange({
                            ...shapeProps,
                            x: node.x(),
                            y: node.y(),
                            width: node.width() * scaleX,
                            height: node.height() * scaleY
                        });
                    }}
                />
                {isSelected && <Transformer ref={this.trRef}/>}
            </React.Fragment>
        );
    }
}

Rectangle.defaultProps = {
    onMenu: () => {
    },
    isSelected: false,
    onChange: () => {
    },
    onSelect: () => {
    },
    shapeProps: {}
};

Rectangle.propTypes = {
    shapeProps: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onMenu: PropTypes.func,
};

export default Rectangle;