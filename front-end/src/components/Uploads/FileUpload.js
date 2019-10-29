import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";
import {Button, Image} from 'semantic-ui-react';
// import defaultImage from '../../static/images/default_image.png';
// import _ from "lodash";

class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            refresh: props.refresh,
        };
    }

    handleImageChange(e) {
        const {getChildState, name} = this.props;
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files;
        this.setState({
            file: file,
            target: e.target
        });
        if (getChildState) {
            getChildState({
                files: file,
                target: e.target,
                name: name
            });
        }
    }

    // setParentState() {
    //     const { getChildState, name } = this.props;
    //     if(getChildState) {
    //         getChildState(this.state, name);
    //     }
    // }

    handleSubmit=(e)=> {
        e.preventDefault();
        // this.state.file is the file/image uploaded
        // in this function you can save the image (this.state.file) on form submit
        // you have to call it yourself
    }

    handleClick=()=> {
        this.refs.fileInput.click();
    }

    handleRemove() {
        this.setState({
            file: null,
        });
        this.refs.fileInput.value = null;
        this.forceUpdate();
        // this.state.uploaded(this.state);
    }

    render() {
        let {name, hide, theme, color, addButtonProps, changeButtonProps, removeButtonProps, size} = this.props;
        return (
            <div className="fileinput text-center">
                <input id="fileUpload" type="file" onChange={this.handleImageChange.bind(this)} ref="fileInput"/>
                <div>
                    <Button
                        {...addButtonProps}
                        {...theme}
                        style={{backgroundColor: `${color}`}}
                        onClick={() => this.handleClick()}
                    >
                        {name}
                    </Button>
                </div>
            </div>
        );
    }
}

FileUpload.defaultProps = {
    hide: false,
    avatar: false,
    size: 'small',
    name: 'Button Name',
    theme: {
        primary: true
    }
};

FileUpload.propTypes = {
    hide: PropTypes.bool,
    addButtonProps: PropTypes.object,
    changeButtonProps: PropTypes.object,
    removeButtonProps: PropTypes.object,
    color: PropTypes.oneOf(["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "black", "facebook", "google", "plus", "instagram", "linkedin", "twitter", "vk", "youtube"]),
    // theme: PropTypes.oneOf([{primary: true}, {secondary: true}]),
    size: PropTypes.oneOf(['mini', 'tiny', 'small', 'large', 'gig', 'huge', 'massive']),
    plainObj: PropTypes.shape({ primary: PropTypes.string },{secondary:PropTypes.string})

};

export default FileUpload;


// WEBPACK FOOTER //
// ./src/components/CustomUpload/FileUpload.jsx