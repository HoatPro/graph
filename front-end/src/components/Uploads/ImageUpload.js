import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";
import {Button, Image} from 'semantic-ui-react';
import defaultImage from '../../static/images/default_image.png';
import _ from "lodash";

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            refresh: props.refresh,
            imagePreview: null,
            imagePreviewUrl: defaultImage,
            // uploaded: this.props.uploaded
        };
    }

    handleImageChange = e => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = (event) => {
            const img = document.getElementById('imgPreview');
            this.setState({
                file: file,
                imagePreview: img,
                imagePreviewUrl: reader.result
            });
            // if (this.state.uploaded) this.state.uploaded(this.state);
            this.setParentState();
        };
        reader.readAsDataURL(file);
    }

    setParentState() {
        const {getChildState, name} = this.props;
        if (getChildState) {
            getChildState(this.state, name);
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        // this.state.file is the file/image uploaded
        // in this function you can save the image (this.state.file) on form submit
        // you have to call it yourself
    }

    handleClick=()=> {
        this.refs.fileInput.click();
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        // const {refresh} = nextProps;
        // if(refresh) {
        //     this.handleRemove();
        // }
        const {imagePreview} = nextProps;
        if (imagePreview && !_.isObject(imagePreview)) {
            this.setState({
                imagePreviewUrl: imagePreview
            })
        } else if (_.size(imagePreview) === 0) {
            this.setState({
                imagePreviewUrl: defaultImage
            })
        }


    }

    handleRemove=()=> {
        this.setState({
            file: null,
            imagePreview: null,
            imagePreviewUrl: defaultImage
        });
        this.refs.fileInput.value = null;
        this.forceUpdate();
        // this.state.uploaded(this.state);
    }

    render() {
        var {avatar, hide, addButtonProps, changeButtonProps, removeButtonProps, size} = this.props;
        const {imagePreviewUrl} = this.state;
        return (
            <div className="fileinput text-center">
                <input id="fileUpload" type="file" onChange={this.handleImageChange} ref="fileInput"/>
                <div className={"thumbnail" + (avatar ? " img-circle" : "") + (hide ? " hide" : "")}>
                    <Image size={size} id="imgPreview" src={imagePreviewUrl} alt="..."/>
                </div>
                <div>
                    {this.state.file === null ? (
                        <Button {...addButtonProps} onClick={() => this.handleClick()}>
                            {avatar ? "Add Photo" : "Select image"}
                        </Button>
                    ) : (
                        <span>
                            <Button {...changeButtonProps} onClick={() => this.handleClick()}>
                                Change
                            </Button>
                            {avatar ? <br/> : null}
                            <Button
                                {...removeButtonProps}
                                onClick={() => this.handleRemove()}
                            >
                                <i className="fas fa-times"/> Remove
                            </Button>
                        </span>
                    )}
                </div>
            </div>
        );
    }
}

ImageUpload.defaultProps = {
    hide: false,
    avatar: false,
    size: 'small'
}

ImageUpload.propTypes = {
    hide: PropTypes.bool,
    avatar: PropTypes.bool,
    addButtonProps: PropTypes.object,
    changeButtonProps: PropTypes.object,
    removeButtonProps: PropTypes.object,
    size: PropTypes.oneOf(['mini', 'tiny', 'small', 'large', 'gig', 'huge', 'massive'])
};

export default ImageUpload;


// WEBPACK FOOTER //
// ./src/components/CustomUpload/ImageUpload.jsx