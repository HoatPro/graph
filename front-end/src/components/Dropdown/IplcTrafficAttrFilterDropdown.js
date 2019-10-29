import React, {Component, Fragment} from 'react';
import {} from "semantic-ui-react";
import {Form, Input, Dropdown, Select, Button} from 'semantic-ui-react'
import _ from "lodash";
import {toast} from "react-toastify";

export default class IplcTrafficAttrFilterDropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            services: [-1, 'Premium', 'General'],
            types: [-1, 'Landline', 'submarine'],
            locations: [-1, 'Singapore', 'Hong Kong', 'Japan'],
            providers: [-1, 'APG', 'IA', 'AAE-1', 'AAG', 'CMI', 'CT', 'CU'],
            localLocations: [-1, 'Da Nang', 'Ho Chi Minh', 'Ha Noi'],
            selectedService: [-1],
            selectedType: [-1],
            selectedProvider: [-1],
            selectedLocation: [-1],
            selectedLocalLocation: [-1]
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state != nextState) {
            return true;
        }
        return false;
    }

    componentDidMount() {

    };

    componentWillReceiveProps = (nextProps) => {

    };

    handleDropdownChange = (e, {name, value}) => {
        let newValue = value;

        if (value.includes(-1)) {
            newValue = [-1];
        }

        this.setState({
            [name]: newValue
        });
    };

    handeSearch = () => {
        const data = {
            service: this.state.selectedService,
            provider: this.state.selectedProvider,
            type: this.state.selectedType,
            location: this.state.selectedLocation,
            localLocation: this.state.selectedLocalLocation
        };

        for (const attr in data) {
            if (data[attr].length == 0) {
                toast.error('Empty field deteted!');
                return;
            }
        }

        this.props.onSearch(data);
    };

    render() {

        const {
            services,
            types,
            locations,
            providers,
            localLocations,
            selectedService,
            selectedType,
            selectedProvider,
            selectedLocation,
            selectedLocalLocation
        } = this.state;

        return (
            <Form>
                <Form.Group widths='equal'>
                    <Form.Field control={Dropdown} label='Service' placeholder='service'
                                fluid
                                multiple
                                search
                                selection
                                options={services.map(e => ({
                                    key: e,
                                    text: e == -1 ? 'All' : e,
                                    value: e
                                }))}
                                value={selectedService}
                                name="selectedService"
                                onChange={this.handleDropdownChange}
                    />
                    <Form.Field control={Dropdown} label='Type' placeholder='type'
                                fluid
                                multiple
                                search
                                options={types.map(e => ({
                                    key: e,
                                    text: e == -1 ? 'All' : e,
                                    value: e
                                }))}
                                selection
                                name="selectedType"
                                value={selectedType}
                                onChange={this.handleDropdownChange}
                    />
                    <Form.Field control={Dropdown} label='Provider' placeholder='provider'
                                fluid
                                multiple
                                search
                                options={providers.map(e => ({
                                    key: e,
                                    text: e == -1 ? 'All' : e,
                                    value: e
                                }))}
                                selection
                                value={selectedProvider}
                                name="selectedProvider"
                                onChange={this.handleDropdownChange}
                    />
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field control={Dropdown} label='Location' placeholder='End location'
                                fluid
                                multiple
                                search
                                options={locations.map(e => ({
                                    key: e,
                                    text: e == -1 ? 'All' : e,
                                    value: e
                                }))}
                                selection
                                value={selectedLocation}
                                name="selectedLocation"
                                onChange={this.handleDropdownChange}
                    />
                    <Form.Field control={Dropdown} label='Local location' placeholder='type'
                                fluid
                                multiple
                                search
                                options={localLocations.map(e => ({
                                    key: e,
                                    text: e == -1 ? 'All' : e,
                                    value: e
                                }))}
                                selection
                                value={selectedLocalLocation}
                                name="selectedLocalLocation"
                                onChange={this.handleDropdownChange}
                    />
                    <Form.Field>
                        <label>&nbsp;</label>
                        <Button
                            onClick={this.handeSearch}
                        >
                            Search
                        </Button>
                    </Form.Field>
                </Form.Group>
            </Form>
        )
    }
}
