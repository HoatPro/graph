import React from 'react';
import {Router, Route} from 'react-router-dom';
import {Loader} from 'semantic-ui-react';
import routes from "./router/routes";
import Index from "./index";
import Users from "./admin/users";
import UserEdit from "./admin/user-edit";
import Routes from "./admin/routes";
import RouteEdit from "./admin/route-edit";
import Actions from "./admin/actions";
import ActionEdit from "./admin/action-edit";
import Groups from "./admin/groups";
import GroupEdit from "./admin/group-edit";
import Permissions from "./admin/permissions";
import Locations from "./categories/locations";
import LocationEdit from "./categories/location-edit";
import Datacenters from "./categories/datacenters";
import DatacenterEdit from "./categories/datacenter-edit";
import Rooms from "./categories/rooms";
import RoomEdit from "./categories/room-edit";
import Zones from "./categories/zones";
import ZoneEdit from "./categories/zone-edit";
import Departments from "./categories/departments";
import DepartmentEdit from "./categories/department-edit";
import Customers from "./categories/customers";
import CustomerEdit from "./categories/customer-edit";
import Regions from "./categories/regions";
import RegionEdit from "./categories/region-edit";
import DeviceTypes from "./categories/device-types";
import DeviceTypeEdit from "./categories/device-type-edit";
import DeviceTemplates from "./categories/device-templates";
import DeviceTemplateEdit from "./categories/device-template-edit";
import DeviceInRack from "./categories/device-in-rack";
import Racks from "./categories/racks";
import RackEdit from "./categories/rack-edit";
import RackView from "./categories/rack-view";
import AddDevice from "./categories/add-device";
import Contracts from "./categories/contracts";
import ContractEdit from "./categories/contract-edit";
import Layouts from "./layouts/layouts";
import UpNew from "./request/up-new";
import SurveyDevice from "./request/survey-device";
import DeploymentDevice from "./request/deployment-device";
import history from "./history";
import {withCookies} from 'react-cookie';
/* eslint-disable import/first */
import _config from '../utils/config';
import {Auth} from "./Auth";
import redirectTo from "../components/Common/redirectTo";


const config = _config[_config.environment];


class App extends React.Component {
       // constructor(props){
       //     super(props);
       //     this.state={
       //         auth:[]
       //     }
       // }

    componentWillMount() {
        Auth(this.props).then((data) => this.setState({auth: data}))
    }

    renderPage(Page) {
        let {auth} = this.state;
        return (auth === 200 ? (Page) : (auth === 403 ? (redirectTo(config.originRoot + '/openid', {
            res: null,
            status: 301
        })) : (
            redirectTo(config.originFrontend + '/access', {res: null, status: 301}))));
    }

    render() {
        return (this.state && this.state.auth) ? (
            <Router history={history}>
                <Route exact path={routes.home} component={() => this.renderPage(<Index/>)}/>
                <Route exact path={routes.users} component={Users}/>
                <Route exact path={routes.user_edit} component={UserEdit}/>
                <Route exact path={routes.routes} component={Routes}/>
                <Route exact path={routes.route_edit} component={RouteEdit}/>
                <Route exact path={routes.actions} component={Actions}/>
                <Route exact path={routes.action_edit} component={ActionEdit}/>
                <Route exact path={routes.groups} component={Groups}/>
                <Route exact path={routes.group_edit} component={GroupEdit}/>
                <Route exact path={routes.permissions} component={Permissions}/>
                <Route exact path={routes.locations} component={Locations}/>
                <Route exact path={routes.location_edit} component={LocationEdit}/>
                <Route exact path={routes.dataCenters} component={Datacenters}/>
                <Route exact path={routes.dataCenter_edit} component={DatacenterEdit}/>
                <Route exact path={routes.rooms} component={Rooms}/>
                <Route exact path={routes.room_edit} component={RoomEdit}/>
                <Route exact path={routes.zones} component={Zones}/>
                <Route exact path={routes.zone_edit} component={ZoneEdit}/>
                <Route exact path={routes.departments} component={Departments}/>
                <Route exact path={routes.department_edit} component={DepartmentEdit}/>
                <Route exact path={routes.customers} component={Customers}/>
                <Route exact path={routes.customer_edit} component={CustomerEdit}/>
                <Route exact path={routes.regions} component={Regions}/>
                <Route exact path={routes.region_edit} component={RegionEdit}/>
                <Route exact path={routes.device_types} component={DeviceTypes}/>
                <Route exact path={routes.device_type_edit} component={DeviceTypeEdit}/>
                <Route exact path={routes.device_type_edit} component={DeviceTemplateEdit}/>
                <Route exact path={routes.device_templates} component={DeviceTemplates}/>
                <Route exact path={routes.device_template_edit} component={DeviceTemplateEdit}/>
                <Route exact path={routes.device_in_rack} component={DeviceInRack}/>
                <Route exact path={routes.racks} component={Racks}/>
                <Route exact path={routes.rack_edit} component={RackEdit}/>
                <Route exact path={routes.rack_view} component={RackView}/>
                <Route path={routes.add_device} component={AddDevice}/>
                <Route exact path={routes.contracts} component={Contracts}/>
                <Route exact path={routes.contract_edit} component={ContractEdit}/>
                <Route exact path={routes.layouts} component={Layouts}/>
                <Route exact path={routes.up_new} component={UpNew}/>
                <Route exact path={routes.survey_device} component={SurveyDevice}/>
                <Route exact path={routes.deployment_device} component={DeploymentDevice}/>
            </Router>
        ) : (<Loader active size='massive'/>);
    }
}

export default withCookies(App);
