import React from "react";
import {Image} from "react-konva";
import PropTypes from "prop-types";

class _Image extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            x,
            y,
            image,
            name,
            url
        } = this.props;
        return (
            <Image
                x={x}
                y={y}
                name={name}
                image={image}
                draggable={false}
            />
        );
    }
}

_Image.defaultProps = {
    draggable: true,
    image: null,
};

_Image.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    draggable: PropTypes.bool.isRequired,
    // image: PropTypes.object.isRequired,
};

export default _Image;