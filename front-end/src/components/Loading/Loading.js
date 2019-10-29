import React from 'react';
import {css} from '@emotion/core';
import {
    BarLoader,
    BeatLoader,
    BounceLoader,
    CircleLoader,
    ClipLoader,
    ClimbingBoxLoader,
    DotLoader,
    FadeLoader,
    GridLoader,
    HashLoader,
    MoonLoader,
    PacmanLoader,
    PropagateLoader,
    PulseLoader,
    RingLoader,
    RiseLoader,
    RotateLoader,
    ScaleLoader,
    SyncLoader,
} from 'react-spinners';
import '../../../src/assets/css/loading.css';
import {connect} from "react-redux";
import PropTypes from "prop-types";

const override = css`
    display: block;
    margin: auto;
    border-color: red;
`;


class Loading extends React.Component {
    constructor(props) {
        super(props);
    }

    chosenType() {
        const {loading = {}, color, size, type} = this.props;
        const {status = true, message = "Loading"} = loading;
        let component = null;
        switch (type) {
            case 'BarLoader':
                component = (<ClipLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'BeatLoader':
                component = (<BeatLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'BounceLoader':
                component = (<BounceLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'CircleLoader':
                component = (<CircleLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'ClipLoader':
                component = (<ClipLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'ClimbingBoxLoader':
                component = (<ClimbingBoxLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'DotLoader':
                component = (<DotLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'GridLoader':
                component = (<GridLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'HashLoader':
                component = (<HashLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'MoonLoader':
                component = (<MoonLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'PacmanLoader':
                component = (<PacmanLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'PropagateLoader':
                component = (<PropagateLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'PulseLoader':
                component = (<PulseLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'RingLoader':
                component = (<RingLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'RiseLoader':
                component = (<RiseLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'RotateLoader':
                component = (<RotateLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'ScaleLoader':
                component = (<ScaleLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'SyncLoader':
                component = (<SyncLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            case 'FadeLoader':
                component = (<FadeLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
            default:
                component = (<RingLoader
                    css={override}
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={status}
                />);
                break;
        }
        return component;
    }

    render() {
        const {loading = {}} = this.props;
        const {status = false} = loading;
        return (
            <div className={status ? 'sweet-loading' : 'hide'}>
                {this.chosenType()}
            </div>
        )
    }
}

Loading.defaultProps = {
    color: '#2185d0',
    size: 60,
};

Loading.propTypes = {
    type: PropTypes.oneOf([
        "BarLoader",
        "BeatLoader",
        "BounceLoader",
        "CircleLoader",
        "ClipLoader",
        "ClimbingBoxLoader",
        "DotLoader",
        "FadeLoader",
        "GridLoader",
        "HashLoader",
        "MoonLoader",
        "PacmanLoader",
        "PropagateLoader",
        "PulseLoader",
        "RingLoader",
        "RiseLoader",
        "RotateLoader",
        "ScaleLoader",
        "SyncLoader"
    ]),
    color: PropTypes.string,
    size: PropTypes.number,
};

const mapStateToProps = ({loading}) => ({loading});

export default connect(mapStateToProps, null)(Loading);