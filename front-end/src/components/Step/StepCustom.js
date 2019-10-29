import React from 'react';
import {Button, Segment, Icon, Step} from 'semantic-ui-react';
// import { connect } from 'react-redux';
// import _ from 'lodash';
// import moment from 'moment';

class StepCustom extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {positionStep} = this.props;
        return (
            <Step.Group ordered fluid={true}>
                {
                    positionStep === 1 ?
                        <Step active>
                            <Step.Content>
                                <Step.Title>Information</Step.Title>
                                <Step.Description>Enter request information</Step.Description>
                            </Step.Content>
                        </Step>
                        :
                        <Step disabled completed>
                            <Step.Content>
                                <Step.Title>Information</Step.Title>
                                <Step.Description>Enter request information</Step.Description>
                            </Step.Content>
                        </Step>
                }
                {
                    positionStep === 2 ?
                        <Step active>
                            <Step.Content>
                                <Step.Title>Form Request</Step.Title>
                                <Step.Description>Choose your add deviece options</Step.Description>
                            </Step.Content>
                        </Step>
                        :
                        positionStep > 2 ?
                            <Step disabled completed>
                                <Step.Content>
                                    <Step.Title>Form Request</Step.Title>
                                    <Step.Description>Choose your add deviece options</Step.Description>
                                </Step.Content>
                            </Step>
                            :
                            <Step disabled>
                                <Step.Content>
                                    <Step.Title>Form Request</Step.Title>
                                    <Step.Description>Choose your add deviece options</Step.Description>
                                </Step.Content>
                            </Step>
                }
                {
                    positionStep === 3 ?
                        <Step active>
                            <Step.Content>
                                <Step.Title>Confirm Request</Step.Title>
                                <Step.Description>View request and confirm !</Step.Description>
                            </Step.Content>
                        </Step>
                        :
                        <Step disabled>
                            <Step.Content>
                                <Step.Title>Confirm Request</Step.Title>
                                <Step.Description>View request and confirm !</Step.Description>
                            </Step.Content>
                        </Step>
                }
                {/* <Step active >
                    <Step.Content>
                        <Step.Title>Information</Step.Title>
                        <Step.Description>Enter request information</Step.Description>
                    </Step.Content>
                </Step>
            
                <Step disabled >
                    <Step.Content>
                        <Step.Title>Form Request</Step.Title>
                        <Step.Description>Choose your add deviece options</Step.Description>
                    </Step.Content>
                </Step>
            
                <Step disabled>
                    <Step.Content>
                        <Step.Title>Confirm Request</Step.Title>
                        <Step.Description>View request and confirm !</Step.Description>
                    </Step.Content>
                </Step> */}
            </Step.Group>
        )
    }
}

// const mapStateToProps = ({ upNews }) => ({ upNews });

export default StepCustom;