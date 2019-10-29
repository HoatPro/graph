import history from "../history";
/* eslint no-use-before-define: 0 */
const deviceTest = history.location;
const query = deviceTest.search || "";
const params = new URLSearchParams(query);
const id = params.get('id');
// console.log(id);
export default {
    home: '/',
    //Admin
    users: '/admin/users',
    user_edit: '/admin/user-edit',
    routes: '/admin/routes',
    route_edit: '/admin/route-edit',
    actions: '/admin/actions',
    action_edit: '/admin/action-edit',
    groups: '/admin/groups',
    group_edit: '/admin/group-edit',
    permissions: '/admin/permissions',
    //Categories
    locations: '/categories/locations',
    location_edit: '/categories/location-edit',
    dataCenters: '/categories/datacenters',
    dataCenter_edit: '/categories/datacenter-edit',
    rooms: '/categories/rooms',
    room_edit: '/categories/room-edit',
    zones: '/categories/zones',
    zone_edit: '/categories/zone-edit',
    departments: '/categories/departments',
    department_edit: '/categories/department-edit',
    customers: '/categories/customers',
    customer_edit: '/categories/customer-edit',
    regions: '/categories/regions',
    region_edit: '/categories/region-edit',
    device_types: '/categories/device-types',
    device_type_edit: '/categories/device-type-edit',
    device_templates: '/categories/device-templates',
    device_template_edit: '/categories/device-template-edit',
    device_in_rack: '/categories/device-in-rack',
    racks: '/categories/racks',
    rack_edit: '/categories/rack-edit',
    rack_view: '/categories/rack-view',
    add_device: `/categories/add-device`,
    contracts: '/categories/contracts',
    contract_edit: '/categories/contract-edit',
    //Layouts
    layouts: '/layouts/layout',
    //Request
    up_new: '/request/up-new',
    survey_device: '/request/survey-device',
    deployment_device: '/request/deployment-device'

};