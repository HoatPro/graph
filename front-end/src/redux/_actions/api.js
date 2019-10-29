import config from "../../utils/config";

const env = config.environment;
const _config = config[env];
const origin = _config.originBackend + _config.prevOrigin;
const api_key = ''; //'?api_key=' + config.apiKey;
console.log('origin', origin);

export default {
    login: origin + '/login' + api_key,
    auth_user: origin + '/auth-user' + api_key,
//---------------- routes -------------------//
    get_all_route: origin + '/get-all-route' + api_key,
    get_routes: origin + '/get-routes' + api_key,
    get_route_by_id: origin + '/get-route' + api_key,
    get_route_parents: origin + '/get-route-parents' + api_key,
    insert_route: origin + '/insert-route' + api_key,
    update_route: origin + '/update-route' + api_key,
    delete_route: origin + '/delete-route' + api_key,
//---------------- end routes -------------------//

//---------------- actions -------------------//
    get_all_action: origin + '/get-all-action' + api_key,
    get_actions: origin + '/get-actions' + api_key,
    get_action_by_id: origin + '/get-action' + api_key,
    insert_action: origin + '/insert-action' + api_key,
    update_action: origin + '/update-action' + api_key,
    delete_action: origin + '/delete-action' + api_key,
//---------------- end actions -------------------//

//---------------- groups -------------------//
    get_all_group: origin + '/get-all-group' + api_key,
    get_groups: origin + '/get-groups' + api_key,
    get_group_by_id: origin + '/get-group' + api_key,
    insert_group: origin + '/insert-group' + api_key,
    update_group: origin + '/update-group' + api_key,
    delete_group: origin + '/delete-group' + api_key,
//---------------- end groups -------------------//

//---------------- users -------------------//
    get_all_user: origin + '/get-all-user' + api_key,
    get_users: origin + '/get-users' + api_key,
    get_user_by_id: origin + '/get-user' + api_key,
    insert_user: origin + '/insert-user' + api_key,
    update_user: origin + '/update-user' + api_key,
    reset_password: origin + '/reset-password' + api_key,
    delete_user: origin + '/delete-user' + api_key,
//---------------- end users -------------------//

//---------------- permissions -------------------//
    get_others: origin + '/get-others' + api_key,
    get_max_action_of_route: origin + '/max-action-of-route' + api_key,
    get_all_route_action: origin + '/get-all-route-action' + api_key,
    update_permission: origin + '/update-permission' + api_key,
    get_permission: origin + '/get-permission' + api_key,
//---------------- end permissions -------------------//

    //---------------- locations -------------------//
    get_all_location: origin + '/get-all-location' + api_key,
    get_locations: origin + '/get-locations' + api_key,
    get_location_by_id: origin + '/get-location' + api_key,
    insert_location: origin + '/insert-location' + api_key,
    update_location: origin + '/update-location' + api_key,
    delete_location: origin + '/delete-location' + api_key,
    //---------------- end locations -------------------//

    //---------------- dataCenters -------------------//
    get_all_datacenter: origin + '/get-all-datacenter' + api_key,
    get_datacenters: origin + '/get-datacenters' + api_key,
    get_datacenter_by_id: origin + '/get-datacenter' + api_key,
    insert_datacenter: origin + '/insert-datacenter' + api_key,
    update_datacenter: origin + '/update-datacenter' + api_key,
    delete_datacenter: origin + '/delete-datacenter' + api_key,
    //---------------- end dataCenters -------------------//

    //---------------- rooms -------------------//
    get_all_room: origin + '/get-all-room' + api_key,
    get_rooms: origin + '/get-rooms' + api_key,
    get_room_by_id: origin + '/get-room' + api_key,
    insert_room: origin + '/insert-room' + api_key,
    update_room: origin + '/update-room' + api_key,
    delete_room: origin + '/delete-room' + api_key,
    //---------------- end rooms -------------------//

    //---------------- zones -------------------//
    get_all_zone: origin + '/get-all-zone' + api_key,
    get_zones: origin + '/get-zones' + api_key,
    get_zone_by_id: origin + '/get-zone' + api_key,
    insert_zone: origin + '/insert-zone' + api_key,
    update_zone: origin + '/update-zone' + api_key,
    delete_zone: origin + '/delete-zone' + api_key,
    //---------------- end zones -------------------//

    //---------------- customers -------------------//
    get_all_customer: origin + '/get-all-customer' + api_key,
    get_customers: origin + '/get-customers' + api_key,
    get_customer_by_id: origin + '/get-customer' + api_key,
    insert_customer: origin + '/insert-customer' + api_key,
    update_customer: origin + '/update-customer' + api_key,
    delete_customer: origin + '/delete-customer' + api_key,
    //---------------- end customers -------------------//

    //---------------- departments -------------------//
    get_all_department: origin + '/get-all-department' + api_key,
    get_departments: origin + '/get-departments' + api_key,
    get_department_by_id: origin + '/get-department' + api_key,
    insert_department: origin + '/insert-department' + api_key,
    update_department: origin + '/update-department' + api_key,
    delete_department: origin + '/delete-department' + api_key,
    //---------------- end departments -------------------//

    //---------------- regions -------------------//
    get_all_region: origin + '/get-all-region' + api_key,
    get_regions: origin + '/get-regions' + api_key,
    get_region_by_id: origin + '/get-region' + api_key,
    insert_region: origin + '/insert-region' + api_key,
    update_region: origin + '/update-region' + api_key,
    delete_region: origin + '/delete-region' + api_key,
    //---------------- end regions -------------------//

    //---------------- device types -------------------//
    get_all_device_type: origin + '/get-all-device-type' + api_key,
    get_device_types: origin + '/get-device-types' + api_key,
    get_device_type_by_id: origin + '/get-device-type' + api_key,
    insert_device_type: origin + '/insert-device-type' + api_key,
    import_device_type: origin + '/import-device-type' + api_key,
    update_device_type: origin + '/update-device-type' + api_key,
    delete_device_type: origin + '/delete-device-type' + api_key,
    //---------------- end device-types -------------------//

    //---------------- device templates -------------------//
    get_all_device_template: origin + '/get-all-device-template' + api_key,
    get_device_templates: origin + '/get-device-templates' + api_key,
    get_device_template_by_id: origin + '/get-device-template' + api_key,
    insert_device_template: origin + '/insert-device-template' + api_key,
    import_device_template: origin + '/import-device-template' + api_key,
    update_device_template: origin + '/update-device-template' + api_key,
    delete_device_template: origin + '/delete-device-template' + api_key,
    //---------------- end device-templates -------------------//

    //---------------- device in rack -------------------//
    get_all_device_in_rack: origin + '/get-all-device-in-rack' + api_key,
    get_device_in_rack: origin + '/get-device-in-rack' + api_key,
    //---------------- end device in rack -------------------//

    //---------------- racks -------------------//
    get_all_rack: origin + '/get-all-rack' + api_key,
    get_device_by_id: origin + '/get-device' + api_key,
    get_racks: origin + '/get-racks' + api_key,
    get_rack_by_id: origin + '/get-rack' + api_key,
    get_rack_by_zone: origin + '/get-rack-by-zone' + api_key,
    get_rack_by_zones: origin + '/get-rack-by-zones' + api_key,
    get_rack_by_room: origin + '/get-rack-by-room' + api_key,
    insert_rack: origin + '/insert-rack' + api_key,
    update_rack: origin + '/update-rack' + api_key,
    update_draw_rack: origin + '/update-draw-rack' + api_key,
    delete_rack: origin + '/delete-rack' + api_key,
    booking_u: origin + '/booking-u' + api_key,
    add_device_rack: origin + '/add-device-rack' + api_key,
    delete_booking: origin + '/delete-booking' + api_key,
    delete_device: origin + '/delete-device-rack' + api_key,
    save_move_u: origin + '/save-move-u' + api_key,
    import_device_to_rack: origin + '/import-device-to-rack' + api_key,
    //---------------- end racks -------------------//

    //---------------- layouts -------------------//
    get_all_layout: origin + '/get-all-layout' + api_key,
    get_layouts: origin + '/get-layouts' + api_key,
    get_layout_by_id: origin + '/get-layout' + api_key,
    insert_layout: origin + '/insert-layout' + api_key,
    update_layout: origin + '/update-layout' + api_key,
    delete_layout: origin + '/delete-layout' + api_key,
    //---------------- end layouts -------------------//

    //---------------- contracts -------------------//
    get_all_contract: origin + '/get-all-contract' + api_key,
    get_contracts: origin + '/get-contracts' + api_key,
    get_contract_by_id: origin + '/get-contract' + api_key,
    insert_contract: origin + '/insert-contract' + api_key,
    update_contract: origin + '/update-contract' + api_key,
    delete_contract: origin + '/delete-contract' + api_key,
    //---------------- end contracts -------------------//
    //----------------  surveyDC -------------------//
    get_survey_device: origin + '/get-survey-device' + api_key,
    feedback_survey: origin + '/feed-back-survey' + api_key,
    //---------------- end surveyDC -------------------//

    //----------------  deploymentDC -------------------//
    get_deployment_device: origin + '/get-deployment-device' + api_key,
    feedback_deployment: origin + '/feed-back-deployment' + api_key,
    //---------------- end deploymentDC -------------------//


    //----------------  TEST -------------------//
    get_test: origin + '/get-test' + api_key,

    //---------------- end TEST -------------------//


}