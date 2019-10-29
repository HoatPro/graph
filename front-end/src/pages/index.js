import React from 'react';
import {Segment} from 'semantic-ui-react';
import DashboardLayout from '../components/Layout/DashboardLayout';

class Index extends React.Component {

    componentDidMount() {
        document.title = "Home";
    }

    render() {
        return (
            <div>
                <DashboardLayout>
                    <Segment>
                        <h1> RACA Dashboard</h1>
                    </Segment>
                </DashboardLayout>
            </div>

        )
    }
}

export default Index;