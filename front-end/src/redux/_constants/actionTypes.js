const actionTypes = {
    TOGGLE_MENU: 'TOGGLE_MENU',
    ACTIVE_ITEM: 'ACTIVE_ITEM',
    ACTIVE_INDEX_SIDEBAR: 'ACTIVE_INDEX_SIDEBAR',

    //------------ alerts ------------//
    ALERT_SUCCESS: 'ALERT_SUCCESS',
    ALERT_WARNING: 'ALERT_WARNING',
    ALERT_ERROR: 'ALERT_ERROR',
    ALERT_CLEAR: 'ALERT_CLEAR',
    //------------ routes ------------//
    GET_ROUTES_SUCCESS: 'GET_ROUTES_SUCCESS',
    GET_ROUTES_FAILURE: 'GET_ROUTES_FAILURE',
    GET_ALL_ROUTES_SUCCESS:'GET_ALL_ROUTES_SUCCESS',
    GET_ALL_ROUTES_FAILURE:'GET_ALL_ROUTES_FAILURE',
    GET_ALL_ACTION_ROUTE_SUCCESS: 'GET_ALL_ACTION_ROUTE_SUCCESS',
    GET_ALL_ACTION_ROUTE_FAILURE: 'GET_ALL_ACTION_ROUTE_FAILURE',
    GET_ROUTES_BY_ID_SUCCESS: 'GET_ROUTES_BY_ID_SUCCESS',
    GET_ROUTES_BY_ID_FAILURE: 'GET_ROUTES_BY_ID_FAILURE',
    PAGINATION_ROUTES: "PAGINATION_ROUTES",
    PAGINATION_ROUTES_CLEAR: "PAGINATION_ROUTES_CLEAR",
    ON_PAGE_CHANGE_ROUTES: "ON_PAGE_CHANGE_ROUTES",
    GET_ROUTE_PARENTS_SUCCESS: 'GET_ROUTE_PARENTS_SUCCESS',
    GET_ROUTE_PARENTS_FAILURE: 'GET_ROUTE_PARENTS_FAILURE',
    INSERT_ROUTE_REQUEST: 'INSERT_ROUTE_REQUEST',
    INSERT_ROUTE_SUCCESS: 'INSERT_ROUTE_SUCCESS',
    INSERT_ROUTE_FAILURE: 'INSERT_ROUTE_FAILURE',
    UPDATE_ROUTE_REQUEST: 'UPDATE_ROUTE_REQUEST',
    UPDATE_ROUTE_SUCCESS: 'UPDATE_ROUTE_SUCCESS',
    UPDATE_ROUTE_FAILURE: 'UPDATE_ROUTE_FAILURE',
    DELETE_ROUTE_REQUEST: 'DELETE_ROUTE_REQUEST',
    DELETE_ROUTE_SUCCESS: 'DELETE_ROUTE_SUCCESS',
    DELETE_ROUTE_FAILURE: 'DELETE_ROUTE_FAILURE',
    UPDATE_CURRENT_ROUTE: 'UPDATE_CURRENT_ROUTE',
    VALIDATE_ROUTE: 'VALIDATE_ROUTE',
    MODAL_ROUTE: 'MODAL_ROUTE',
    HANDLE_DELETE_ROUTE: 'HANDLE_DELETE_ROUTE',
    HANDLE_UPDATE_ROUTE: 'HANDLE_UPDATE_ROUTE',
    INIT_UPDATE_ROUTE: 'INIT_UPDATE_ROUTE',
    SEARCH_ROUTE: 'SEARCH_ROUTE',
    CHECK_ALL_ACTION_ROUTE: 'CHECK_ALL_ACTION_ROUTE',
    //------------ end routes ------------//

    //------------ groups ------------//
    GET_GROUPS_SUCCESS: 'GET_GROUPS_SUCCESS',
    GET_GROUPS_FAILURE: 'GET_GROUPS_FAILURE',
    GET_GROUPS_BY_ID_SUCCESS: 'GET_GROUPS_BY_ID_SUCCESS',
    GET_GROUPS_BY_ID_FAILURE: 'GET_GROUPS_BY_ID_FAILURE',
    PAGINATION_GROUPS: "PAGINATION_GROUPS",
    PAGINATION_GROUPS_CLEAR: "PAGINATION_GROUPS_CLEAR",
    ON_PAGE_CHANGE_GROUPS: "ON_PAGE_CHANGE_GROUPS",
    INSERT_GROUP_REQUEST: 'INSERT_GROUP_REQUEST',
    INSERT_GROUP_SUCCESS: 'INSERT_GROUP_SUCCESS',
    INSERT_GROUP_FAILURE: 'INSERT_GROUP_FAILURE',
    UPDATE_GROUP_REQUEST: 'UPDATE_GROUP_REQUEST',
    UPDATE_GROUP_SUCCESS: 'UPDATE_GROUP_SUCCESS',
    UPDATE_GROUP_FAILURE: 'UPDATE_GROUP_FAILURE',
    DELETE_GROUP_REQUEST: 'DELETE_GROUP_REQUEST',
    DELETE_GROUP_SUCCESS: 'DELETE_GROUP_SUCCESS',
    DELETE_GROUP_FAILURE: 'DELETE_GROUP_FAILURE',
    UPDATE_CURRENT_GROUP: 'UPDATE_CURRENT_GROUP',
    VALIDATE_GROUP: 'VALIDATE_GROUP',
    MODAL_GROUP: 'MODAL_GROUP',
    HANDLE_DELETE_GROUP: 'HANDLE_DELETE_GROUP',
    HANDLE_UPDATE_GROUP: 'HANDLE_UPDATE_GROUP',
    INIT_UPDATE_GROUP: 'INIT_UPDATE_GROUP',
    SEARCH_GROUP: 'SEARCH_GROUP',
    //------------ end groups ------------//

    //------------ actions ------------//
    GET_ACTIONS_SUCCESS: 'GET_ACTIONS_SUCCESS',
    GET_ACTIONS_FAILURE: 'GET_ACTIONS_FAILURE',
    GET_ACTIONS_BY_ID_SUCCESS: 'GET_ACTIONS_BY_ID_SUCCESS',
    GET_ACTIONS_BY_ID_FAILURE: 'GET_ACTIONS_BY_ID_FAILURE',
    PAGINATION_ACTIONS: "PAGINATION_ACTIONS",
    PAGINATION_ACTIONS_CLEAR: "PAGINATION_ACTIONS_CLEAR",
    ON_PAGE_CHANGE_ACTIONS: "ON_PAGE_CHANGE_ACTIONS",
    INSERT_ACTION_REQUEST: 'INSERT_ACTION_REQUEST',
    INSERT_ACTION_SUCCESS: 'INSERT_ACTION_SUCCESS',
    INSERT_ACTION_FAILURE: 'INSERT_ACTION_FAILURE',
    UPDATE_ACTION_REQUEST: 'UPDATE_ACTION_REQUEST',
    UPDATE_ACTION_SUCCESS: 'UPDATE_ACTION_SUCCESS',
    UPDATE_ACTION_FAILURE: 'UPDATE_ACTION_FAILURE',
    DELETE_ACTION_REQUEST: 'DELETE_ACTION_REQUEST',
    DELETE_ACTION_SUCCESS: 'DELETE_ACTION_SUCCESS',
    DELETE_ACTION_FAILURE: 'DELETE_ACTION_FAILURE',
    UPDATE_CURRENT_ACTION: 'UPDATE_CURRENT_ACTION',
    VALIDATE_ACTION: 'VALIDATE_ACTION',
    MODAL_ACTION: 'MODAL_ACTION',
    HANDLE_DELETE_ACTION: 'HANDLE_DELETE_ACTION',
    HANDLE_UPDATE_ACTION: 'HANDLE_UPDATE_ACTION',
    INIT_UPDATE_ACTION: 'INIT_UPDATE_ACTION',
    SEARCH_ACTION: 'SEARCH_ACTION',
    //------------ end actions ------------//

    //------------ users ------------//
    GET_USERS_SUCCESS: 'GET_USERS_SUCCESS',
    GET_USERS_FAILURE: 'GET_USERS_FAILURE',
    GET_USERS_BY_ID_SUCCESS: 'GET_USERS_BY_ID_SUCCESS',
    GET_USERS_BY_ID_FAILURE: 'GET_USERS_BY_ID_FAILURE',
    PAGINATION_USERS: "PAGINATION_USERS",
    PAGINATION_USERS_CLEAR: "PAGINATION_USERS_CLEAR",
    ON_PAGE_CHANGE_USERS: "ON_PAGE_CHANGE_USERS",
    INSERT_USER_REQUEST: 'INSERT_USER_REQUEST',
    INSERT_USER_SUCCESS: 'INSERT_USER_SUCCESS',
    INSERT_USER_FAILURE: 'INSERT_USER_FAILURE',
    UPDATE_USER_REQUEST: 'UPDATE_USER_REQUEST',
    UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
    UPDATE_USER_FAILURE: 'UPDATE_USER_FAILURE',
    DELETE_USER_REQUEST: 'DELETE_USER_REQUEST',
    DELETE_USER_SUCCESS: 'DELETE_USER_SUCCESS',
    DELETE_USER_FAILURE: 'DELETE_USER_FAILURE',
    UPDATE_CURRENT_USER: 'UPDATE_CURRENT_USER',
    VALIDATE_USER: 'VALIDATE_USER',
    MODAL_USER: 'MODAL_USER',
    HANDLE_DELETE_USER: 'HANDLE_DELETE_USER',
    HANDLE_UPDATE_USER: 'HANDLE_UPDATE_USER',
    INIT_UPDATE_USER: 'INIT_UPDATE_USER',
    SEARCH_USER: 'SEARCH_USER',
    GET_USER_OTHER_SUCCESS: 'GET_USER_OTHER_SUCCESS',
    GET_USER_OTHER_FAILURE: 'GET_USER_OTHER_FAILURE',
    //------------ end users ------------//

    //------------ permissions ------------//
    GET_PERMISSION_OTHER: 'GET_PERMISSION_OTHER',
    HANDLE_UPDATE_PERMISSION: 'HANDLE_UPDATE_PERMISSION',
    HANDLE_CANCEL_PERMISSION: 'HANDLE_CANCEL_PERMISSION',
    HANDLE_SAVE_PERMISSION_SUCCESS: 'HANDLE_SAVE_PERMISSION_SUCCESS',
    HANDLE_GET_PERMISSION_SUCCESS: 'HANDLE_GET_PERMISSION_SUCCESS',
    UPDATE_CURRENT_PERMISSION: 'UPDATE_CURRENT_PERMISSION',
    //------------ end permissions ------------//

    //------------ locations ------------//
    GET_LOCATIONS_SUCCESS: 'GET_LOCATIONS_SUCCESS',
    GET_LOCATIONS_FAILURE: 'GET_LOCATIONS_FAILURE',
    GET_LOCATIONS_BY_ID_SUCCESS: 'GET_LOCATIONS_BY_ID_SUCCESS',
    GET_LOCATIONS_BY_ID_FAILURE: 'GET_LOCATIONS_BY_ID_FAILURE',
    PAGINATION_LOCATIONS: "PAGINATION_LOCATIONS",
    PAGINATION_LOCATIONS_CLEAR: "PAGINATION_LOCATIONS_CLEAR",
    ON_PAGE_CHANGE_LOCATIONS: "ON_PAGE_CHANGE_LOCATIONS",
    GET_LOCATION_PARENTS_SUCCESS: 'GET_LOCATION_PARENTS_SUCCESS',
    GET_LOCATION_PARENTS_FAILURE: 'GET_LOCATION_PARENTS_FAILURE',
    INSERT_LOCATION_REQUEST: 'INSERT_LOCATION_REQUEST',
    INSERT_LOCATION_SUCCESS: 'INSERT_LOCATION_SUCCESS',
    INSERT_LOCATION_FAILURE: 'INSERT_LOCATION_FAILURE',
    UPDATE_LOCATION_REQUEST: 'UPDATE_LOCATION_REQUEST',
    UPDATE_LOCATION_SUCCESS: 'UPDATE_LOCATION_SUCCESS',
    UPDATE_LOCATION_FAILURE: 'UPDATE_LOCATION_FAILURE',
    DELETE_LOCATION_REQUEST: 'DELETE_LOCATION_REQUEST',
    DELETE_LOCATION_SUCCESS: 'DELETE_LOCATION_SUCCESS',
    DELETE_LOCATION_FAILURE: 'DELETE_LOCATION_FAILURE',
    UPDATE_CURRENT_LOCATION: 'UPDATE_CURRENT_LOCATION',
    VALIDATE_LOCATION: 'VALIDATE_LOCATION',
    MODAL_LOCATION: 'MODAL_LOCATION',
    HANDLE_DELETE_LOCATION: 'HANDLE_DELETE_LOCATION',
    HANDLE_UPDATE_LOCATION: 'HANDLE_UPDATE_LOCATION',
    INIT_UPDATE_LOCATION: 'INIT_UPDATE_LOCATION',
    SEARCH_LOCATION: 'SEARCH_LOCATION',
    //------------ end locations ------------//

    //------------ datacenters ------------//
    GET_DATACENTERS_SUCCESS: 'GET_DATACENTERS_SUCCESS',
    GET_DATACENTERS_FAILURE: 'GET_DATACENTERS_FAILURE',
    GET_DATACENTER_OTHER_SUCCESS: 'GET_DATACENTER_OTHER_SUCCESS',
    GET_DATACENTER_OTHER_FAILURE: 'GET_DATACENTER_OTHER_FAILURE',
    GET_DATACENTERS_BY_ID_SUCCESS: 'GET_DATACENTERS_BY_ID_SUCCESS',
    GET_DATACENTERS_BY_ID_FAILURE: 'GET_DATACENTERS_BY_ID_FAILURE',
    PAGINATION_DATACENTERS: "PAGINATION_DATACENTERS",
    PAGINATION_DATACENTERS_CLEAR: "PAGINATION_DATACENTERS_CLEAR",
    ON_PAGE_CHANGE_DATACENTERS: "ON_PAGE_CHANGE_DATACENTERS",
    GET_DATACENTER_PARENTS_SUCCESS: 'GET_DATACENTER_PARENTS_SUCCESS',
    GET_DATACENTER_PARENTS_FAILURE: 'GET_DATACENTER_PARENTS_FAILURE',
    INSERT_DATACENTER_REQUEST: 'INSERT_DATACENTER_REQUEST',
    INSERT_DATACENTER_SUCCESS: 'INSERT_DATACENTER_SUCCESS',
    INSERT_DATACENTER_FAILURE: 'INSERT_DATACENTER_FAILURE',
    UPDATE_DATACENTER_REQUEST: 'UPDATE_DATACENTER_REQUEST',
    UPDATE_DATACENTER_SUCCESS: 'UPDATE_DATACENTER_SUCCESS',
    UPDATE_DATACENTER_FAILURE: 'UPDATE_DATACENTER_FAILURE',
    DELETE_DATACENTER_REQUEST: 'DELETE_DATACENTER_REQUEST',
    DELETE_DATACENTER_SUCCESS: 'DELETE_DATACENTER_SUCCESS',
    DELETE_DATACENTER_FAILURE: 'DELETE_DATACENTER_FAILURE',
    UPDATE_CURRENT_DATACENTER: 'UPDATE_CURRENT_DATACENTER',
    VALIDATE_DATACENTER: 'VALIDATE_DATACENTER',
    MODAL_DATACENTER: 'MODAL_DATACENTER',
    HANDLE_DELETE_DATACENTER: 'HANDLE_DELETE_DATACENTER',
    HANDLE_UPDATE_DATACENTER: 'HANDLE_UPDATE_DATACENTER',
    INIT_UPDATE_DATACENTER: 'INIT_UPDATE_DATACENTER',
    SEARCH_DATACENTER: 'SEARCH_DATACENTER',
    STOP_SEARCH_DATACENTER: 'STOP_SEARCH_DATACENTER',
    //------------ end datacenters ------------//

    //------------ rooms ------------//
    GET_ROOMS_SUCCESS: 'GET_ROOMS_SUCCESS',
    GET_ROOMS_FAILURE: 'GET_ROOMS_FAILURE',
    GET_ROOM_OTHER_SUCCESS: 'GET_ROOM_OTHER_SUCCESS',
    GET_ROOM_OTHER_FAILURE: 'GET_ROOM_OTHER_FAILURE',
    GET_ROOMS_BY_ID_SUCCESS: 'GET_ROOMS_BY_ID_SUCCESS',
    GET_ROOMS_BY_ID_FAILURE: 'GET_ROOMS_BY_ID_FAILURE',
    PAGINATION_ROOMS: "PAGINATION_ROOMS",
    PAGINATION_ROOMS_CLEAR: "PAGINATION_ROOMS_CLEAR",
    ON_PAGE_CHANGE_ROOMS: "ON_PAGE_CHANGE_ROOMS",
    GET_ROOM_PARENTS_SUCCESS: 'GET_ROOM_PARENTS_SUCCESS',
    GET_ROOM_PARENTS_FAILURE: 'GET_ROOM_PARENTS_FAILURE',
    INSERT_ROOM_REQUEST: 'INSERT_ROOM_REQUEST',
    INSERT_ROOM_SUCCESS: 'INSERT_ROOM_SUCCESS',
    INSERT_ROOM_FAILURE: 'INSERT_ROOM_FAILURE',
    UPDATE_ROOM_REQUEST: 'UPDATE_ROOM_REQUEST',
    UPDATE_ROOM_SUCCESS: 'UPDATE_ROOM_SUCCESS',
    UPDATE_ROOM_FAILURE: 'UPDATE_ROOM_FAILURE',
    DELETE_ROOM_REQUEST: 'DELETE_ROOM_REQUEST',
    DELETE_ROOM_SUCCESS: 'DELETE_ROOM_SUCCESS',
    DELETE_ROOM_FAILURE: 'DELETE_ROOM_FAILURE',
    UPDATE_CURRENT_ROOM: 'UPDATE_CURRENT_ROOM',
    VALIDATE_ROOM: 'VALIDATE_ROOM',
    MODAL_ROOM: 'MODAL_ROOM',
    HANDLE_DELETE_ROOM: 'HANDLE_DELETE_ROOM',
    HANDLE_UPDATE_ROOM: 'HANDLE_UPDATE_ROOM',
    INIT_UPDATE_ROOM: 'INIT_UPDATE_ROOM',
    SEARCH_ROOM: 'SEARCH_ROOM',
    ONCHANGE_LOCATION_ROOM: 'ONCHANGE_LOCATION_ROOM',
    //------------ end rooms ------------//

    //------------ zones ------------//
    GET_ZONES_SUCCESS: 'GET_ZONES_SUCCESS',
    GET_ZONES_FAILURE: 'GET_ZONES_FAILURE',
    GET_ZONE_OTHER_SUCCESS: 'GET_ZONE_OTHER_SUCCESS',
    GET_ZONE_OTHER_FAILURE: 'GET_ZONE_OTHER_FAILURE',
    GET_ZONES_BY_ID_SUCCESS: 'GET_ZONES_BY_ID_SUCCESS',
    GET_ZONES_BY_ID_FAILURE: 'GET_ZONES_BY_ID_FAILURE',
    PAGINATION_ZONES: "PAGINATION_ZONES",
    PAGINATION_ZONES_CLEAR: "PAGINATION_ZONES_CLEAR",
    ON_PAGE_CHANGE_ZONES: "ON_PAGE_CHANGE_ZONES",
    GET_ZONE_PARENTS_SUCCESS: 'GET_ZONE_PARENTS_SUCCESS',
    GET_ZONE_PARENTS_FAILURE: 'GET_ZONE_PARENTS_FAILURE',
    INSERT_ZONE_REQUEST: 'INSERT_ZONE_REQUEST',
    INSERT_ZONE_SUCCESS: 'INSERT_ZONE_SUCCESS',
    INSERT_ZONE_FAILURE: 'INSERT_ZONE_FAILURE',
    UPDATE_ZONE_REQUEST: 'UPDATE_ZONE_REQUEST',
    UPDATE_ZONE_SUCCESS: 'UPDATE_ZONE_SUCCESS',
    UPDATE_ZONE_FAILURE: 'UPDATE_ZONE_FAILURE',
    DELETE_ZONE_REQUEST: 'DELETE_ZONE_REQUEST',
    DELETE_ZONE_SUCCESS: 'DELETE_ZONE_SUCCESS',
    DELETE_ZONE_FAILURE: 'DELETE_ZONE_FAILURE',
    UPDATE_CURRENT_ZONE: 'UPDATE_CURRENT_ZONE',
    VALIDATE_ZONE: 'VALIDATE_ZONE',
    MODAL_ZONE: 'MODAL_ZONE',
    HANDLE_DELETE_ZONE: 'HANDLE_DELETE_ZONE',
    HANDLE_UPDATE_ZONE: 'HANDLE_UPDATE_ZONE',
    INIT_UPDATE_ZONE: 'INIT_UPDATE_ZONE',
    SEARCH_ZONE: 'SEARCH_ZONE',
    ONCHANGE_LOCATION_ZONE: 'ONCHANGE_LOCATION_ZONE',
    ONCHANGE_DATACENTER_ZONE: 'ONCHANGE_DATACENTER_ZONE',
    ONCHANGE_ROOM_ZONE: 'ONCHANGE_ROOM_ZONE',
    HANDLE_VIEW_IMAGE_ZONE: 'HANDLE_VIEW_IMAGE_ZONE',
    HANDLE_CLOSE_VIEW_IMAGE_ZONE: 'HANDLE_CLOSE_VIEW_IMAGE_ZONE',
    //------------ end zones ------------//

    //------------ customers ------------//
    GET_CUSTOMERS_SUCCESS: 'GET_CUSTOMERS_SUCCESS',
    GET_CUSTOMERS_FAILURE: 'GET_CUSTOMERS_FAILURE',
    GET_CUSTOMER_OTHER_SUCCESS: 'GET_CUSTOMER_OTHER_SUCCESS',
    GET_CUSTOMER_OTHER_FAILURE: 'GET_CUSTOMER_OTHER_FAILURE',
    GET_CUSTOMERS_BY_ID_SUCCESS: 'GET_CUSTOMERS_BY_ID_SUCCESS',
    GET_CUSTOMERS_BY_ID_FAILURE: 'GET_CUSTOMERS_BY_ID_FAILURE',
    PAGINATION_CUSTOMERS: "PAGINATION_CUSTOMERS",
    PAGINATION_CUSTOMERS_CLEAR: "PAGINATION_CUSTOMERS_CLEAR",
    ON_PAGE_CHANGE_CUSTOMERS: "ON_PAGE_CHANGE_CUSTOMERS",
    GET_CUSTOMER_PARENTS_SUCCESS: 'GET_CUSTOMER_PARENTS_SUCCESS',
    GET_CUSTOMER_PARENTS_FAILURE: 'GET_CUSTOMER_PARENTS_FAILURE',
    INSERT_CUSTOMER_REQUEST: 'INSERT_CUSTOMER_REQUEST',
    INSERT_CUSTOMER_SUCCESS: 'INSERT_CUSTOMER_SUCCESS',
    INSERT_CUSTOMER_FAILURE: 'INSERT_CUSTOMER_FAILURE',
    UPDATE_CUSTOMER_REQUEST: 'UPDATE_CUSTOMER_REQUEST',
    UPDATE_CUSTOMER_SUCCESS: 'UPDATE_CUSTOMER_SUCCESS',
    UPDATE_CUSTOMER_FAILURE: 'UPDATE_CUSTOMER_FAILURE',
    DELETE_CUSTOMER_REQUEST: 'DELETE_CUSTOMER_REQUEST',
    DELETE_CUSTOMER_SUCCESS: 'DELETE_CUSTOMER_SUCCESS',
    DELETE_CUSTOMER_FAILURE: 'DELETE_CUSTOMER_FAILURE',
    UPDATE_CURRENT_CUSTOMER: 'UPDATE_CURRENT_CUSTOMER',
    VALIDATE_CUSTOMER: 'VALIDATE_CUSTOMER',
    MODAL_CUSTOMER: 'MODAL_CUSTOMER',
    HANDLE_DELETE_CUSTOMER: 'HANDLE_DELETE_CUSTOMER',
    HANDLE_UPDATE_CUSTOMER: 'HANDLE_UPDATE_CUSTOMER',
    INIT_UPDATE_CUSTOMER: 'INIT_UPDATE_CUSTOMER',
    SEARCH_CUSTOMER: 'SEARCH_CUSTOMER',
    //------------ end customers ------------//

    //------------ departments ------------//
    GET_DEPARTMENTS_SUCCESS: 'GET_DEPARTMENTS_SUCCESS',
    GET_DEPARTMENTS_FAILURE: 'GET_DEPARTMENTS_FAILURE',
    GET_DEPARTMENT_OTHER_SUCCESS: 'GET_DEPARTMENT_OTHER_SUCCESS',
    GET_DEPARTMENT_OTHER_FAILURE: 'GET_DEPARTMENT_OTHER_FAILURE',
    GET_DEPARTMENTS_BY_ID_SUCCESS: 'GET_DEPARTMENTS_BY_ID_SUCCESS',
    GET_DEPARTMENTS_BY_ID_FAILURE: 'GET_DEPARTMENTS_BY_ID_FAILURE',
    PAGINATION_DEPARTMENTS: "PAGINATION_DEPARTMENTS",
    PAGINATION_DEPARTMENTS_CLEAR: "PAGINATION_DEPARTMENTS_CLEAR",
    ON_PAGE_CHANGE_DEPARTMENTS: "ON_PAGE_CHANGE_DEPARTMENTS",
    GET_DEPARTMENT_PARENTS_SUCCESS: 'GET_DEPARTMENT_PARENTS_SUCCESS',
    GET_DEPARTMENT_PARENTS_FAILURE: 'GET_DEPARTMENT_PARENTS_FAILURE',
    INSERT_DEPARTMENT_REQUEST: 'INSERT_DEPARTMENT_REQUEST',
    INSERT_DEPARTMENT_SUCCESS: 'INSERT_DEPARTMENT_SUCCESS',
    INSERT_DEPARTMENT_FAILURE: 'INSERT_DEPARTMENT_FAILURE',
    UPDATE_DEPARTMENT_REQUEST: 'UPDATE_DEPARTMENT_REQUEST',
    UPDATE_DEPARTMENT_SUCCESS: 'UPDATE_DEPARTMENT_SUCCESS',
    UPDATE_DEPARTMENT_FAILURE: 'UPDATE_DEPARTMENT_FAILURE',
    DELETE_DEPARTMENT_REQUEST: 'DELETE_DEPARTMENT_REQUEST',
    DELETE_DEPARTMENT_SUCCESS: 'DELETE_DEPARTMENT_SUCCESS',
    DELETE_DEPARTMENT_FAILURE: 'DELETE_DEPARTMENT_FAILURE',
    UPDATE_CURRENT_DEPARTMENT: 'UPDATE_CURRENT_DEPARTMENT',
    VALIDATE_DEPARTMENT: 'VALIDATE_DEPARTMENT',
    MODAL_DEPARTMENT: 'MODAL_DEPARTMENT',
    HANDLE_DELETE_DEPARTMENT: 'HANDLE_DELETE_DEPARTMENT',
    HANDLE_UPDATE_DEPARTMENT: 'HANDLE_UPDATE_DEPARTMENT',
    INIT_UPDATE_DEPARTMENT: 'INIT_UPDATE_DEPARTMENT',
    SEARCH_DEPARTMENT: 'SEARCH_DEPARTMENT',
    //------------ end departments ------------//

    //------------ regions ------------//
    GET_REGIONS_SUCCESS: 'GET_REGIONS_SUCCESS',
    GET_REGIONS_FAILURE: 'GET_REGIONS_FAILURE',
    GET_REGION_OTHER_SUCCESS: 'GET_REGION_OTHER_SUCCESS',
    GET_REGION_OTHER_FAILURE: 'GET_REGION_OTHER_FAILURE',
    GET_REGIONS_BY_ID_SUCCESS: 'GET_REGIONS_BY_ID_SUCCESS',
    GET_REGIONS_BY_ID_FAILURE: 'GET_REGIONS_BY_ID_FAILURE',
    PAGINATION_REGIONS: "PAGINATION_REGIONS",
    PAGINATION_REGIONS_CLEAR: "PAGINATION_REGIONS_CLEAR",
    ON_PAGE_CHANGE_REGIONS: "ON_PAGE_CHANGE_REGIONS",
    GET_REGION_PARENTS_SUCCESS: 'GET_REGION_PARENTS_SUCCESS',
    GET_REGION_PARENTS_FAILURE: 'GET_REGION_PARENTS_FAILURE',
    INSERT_REGION_REQUEST: 'INSERT_REGION_REQUEST',
    INSERT_REGION_SUCCESS: 'INSERT_REGION_SUCCESS',
    INSERT_REGION_FAILURE: 'INSERT_REGION_FAILURE',
    UPDATE_REGION_REQUEST: 'UPDATE_REGION_REQUEST',
    UPDATE_REGION_SUCCESS: 'UPDATE_REGION_SUCCESS',
    UPDATE_REGION_FAILURE: 'UPDATE_REGION_FAILURE',
    DELETE_REGION_REQUEST: 'DELETE_REGION_REQUEST',
    DELETE_REGION_SUCCESS: 'DELETE_REGION_SUCCESS',
    DELETE_REGION_FAILURE: 'DELETE_REGION_FAILURE',
    UPDATE_CURRENT_REGION: 'UPDATE_CURRENT_REGION',
    VALIDATE_REGION: 'VALIDATE_REGION',
    MODAL_REGION: 'MODAL_REGION',
    HANDLE_DELETE_REGION: 'HANDLE_DELETE_REGION',
    HANDLE_UPDATE_REGION: 'HANDLE_UPDATE_REGION',
    INIT_UPDATE_REGION: 'INIT_UPDATE_REGION',
    SEARCH_REGION: 'SEARCH_REGION',
    //------------ end regions ------------//

    //------------ device types ------------//
    GET_DEVICE_TYPES_SUCCESS: 'GET_DEVICE_TYPES_SUCCESS',
    GET_DEVICE_TYPES_FAILURE: 'GET_DEVICE_TYPES_FAILURE',
    GET_DEVICE_TYPE_OTHER_SUCCESS: 'GET_DEVICE_TYPE_OTHER_SUCCESS',
    GET_DEVICE_TYPE_OTHER_FAILURE: 'GET_DEVICE_TYPE_OTHER_FAILURE',
    GET_DEVICE_TYPES_BY_ID_SUCCESS: 'GET_DEVICE_TYPES_BY_ID_SUCCESS',
    GET_DEVICE_TYPES_BY_ID_FAILURE: 'GET_DEVICE_TYPES_BY_ID_FAILURE',
    PAGINATION_DEVICE_TYPES: "PAGINATION_DEVICE_TYPES",
    PAGINATION_DEVICE_TYPES_CLEAR: "PAGINATION_DEVICE_TYPES_CLEAR",
    ON_PAGE_CHANGE_DEVICE_TYPES: "ON_PAGE_CHANGE_DEVICE_TYPES",
    GET_DEVICE_TYPE_PARENTS_SUCCESS: 'GET_DEVICE_TYPE_PARENTS_SUCCESS',
    GET_DEVICE_TYPE_PARENTS_FAILURE: 'GET_DEVICE_TYPE_PARENTS_FAILURE',
    INSERT_DEVICE_TYPE_REQUEST: 'INSERT_DEVICE_TYPE_REQUEST',
    INSERT_DEVICE_TYPE_SUCCESS: 'INSERT_DEVICE_TYPE_SUCCESS',
    INSERT_DEVICE_TYPE_FAILURE: 'INSERT_DEVICE_TYPE_FAILURE',
    IMPORT_DEVICE_TYPE_SUCCESS: 'IMPORT_DEVICE_TYPE_SUCCESS',
    IMPORT_DEVICE_TYPE_FAILURE: 'IMPORT_DEVICE_TYPE_FAILURE',
    UPDATE_DEVICE_TYPE_REQUEST: 'UPDATE_DEVICE_TYPE_REQUEST',
    UPDATE_DEVICE_TYPE_SUCCESS: 'UPDATE_DEVICE_TYPE_SUCCESS',
    UPDATE_DEVICE_TYPE_FAILURE: 'UPDATE_DEVICE_TYPE_FAILURE',
    DELETE_DEVICE_TYPE_REQUEST: 'DELETE_DEVICE_TYPE_REQUEST',
    DELETE_DEVICE_TYPE_SUCCESS: 'DELETE_DEVICE_TYPE_SUCCESS',
    DELETE_DEVICE_TYPE_FAILURE: 'DELETE_DEVICE_TYPE_FAILURE',
    UPDATE_CURRENT_DEVICE_TYPE: 'UPDATE_CURRENT_DEVICE_TYPE',
    VALIDATE_DEVICE_TYPE: 'VALIDATE_DEVICE_TYPE',
    MODAL_DEVICE_TYPE: 'MODAL_DEVICE_TYPE',
    HANDLE_DELETE_DEVICE_TYPE: 'HANDLE_DELETE_DEVICE_TYPE',
    HANDLE_UPDATE_DEVICE_TYPE: 'HANDLE_UPDATE_DEVICE_TYPE',
    INIT_UPDATE_DEVICE_TYPE: 'INIT_UPDATE_DEVICE_TYPE',
    SEARCH_DEVICE_TYPE: 'SEARCH_DEVICE_TYPE',
    //------------ end device types ------------//

    //------------ device in rack ------------//
    GET_DEVICE_IN_RACK_SUCCESS: 'GET_DEVICE_IN_RACK_SUCCESS',
    HANDLE_DELETE_DEVICE_IN_RACK: 'HANDLE_DELETE_DEVICE_IN_RACK',
    SEARCH_DEVICE_IN_RACK: 'SEARCH_DEVICE_IN_RACK',
    MODAL_DEVICE_IN_RACK: 'MODAL_DEVICE_IN_RACK',
    GET_DEVICE_IN_RACK_OTHER_SUCCESS: 'GET_DEVICE_IN_RACK_OTHER_SUCCESS',
    GET_DEVICE_IN_RACK_OTHER_FAILURE: 'GET_DEVICE_IN_RACK_OTHER_FAILURE',
    IMPORT_DEVICE_TO_RACK: 'IMPORT_DEVICE_TO_RACK',
    UPDATE_CURRENT_DEVICE_IN_RACK: 'UPDATE_CURRENT_DEVICE_IN_RACK',
    //------------ end in rack ------------//

    //------------ device templates ------------//
    GET_DEVICE_TEMPLATES_SUCCESS: 'GET_DEVICE_TEMPLATES_SUCCESS',
    GET_DEVICE_TEMPLATES_FAILURE: 'GET_DEVICE_TEMPLATES_FAILURE',
    GET_DEVICE_TYPE_DEVICE_TEMPLATES_SUCCESS: 'GET_DEVICE_TYPE_DEVICE_TEMPLATES_SUCCESS',
    GET_DEVICE_TYPE_DEVICE_TEMPLATES_FAILURE: 'GET_DEVICE_TYPE_DEVICE_TEMPLATES_FAILURE',
    GET_DEVICE_TEMPLATE_OTHER_SUCCESS: 'GET_DEVICE_TEMPLATE_OTHER_SUCCESS',
    GET_DEVICE_TEMPLATE_OTHER_FAILURE: 'GET_DEVICE_TEMPLATE_OTHER_FAILURE',
    GET_DEVICE_TEMPLATES_BY_ID_SUCCESS: 'GET_DEVICE_TEMPLATES_BY_ID_SUCCESS',
    GET_DEVICE_TEMPLATES_BY_ID_FAILURE: 'GET_DEVICE_TEMPLATES_BY_ID_FAILURE',
    PAGINATION_DEVICE_TEMPLATES: "PAGINATION_DEVICE_TEMPLATES",
    PAGINATION_DEVICE_TEMPLATES_CLEAR: "PAGINATION_DEVICE_TEMPLATES_CLEAR",
    ON_PAGE_CHANGE_DEVICE_TEMPLATES: "ON_PAGE_CHANGE_DEVICE_TEMPLATES",
    GET_DEVICE_TEMPLATE_PARENTS_SUCCESS: 'GET_DEVICE_TEMPLATE_PARENTS_SUCCESS',
    GET_DEVICE_TEMPLATE_PARENTS_FAILURE: 'GET_DEVICE_TEMPLATE_PARENTS_FAILURE',
    INSERT_DEVICE_TEMPLATE_REQUEST: 'INSERT_DEVICE_TEMPLATE_REQUEST',
    INSERT_DEVICE_TEMPLATE_SUCCESS: 'INSERT_DEVICE_TEMPLATE_SUCCESS',
    INSERT_DEVICE_TEMPLATE_FAILURE: 'INSERT_DEVICE_TEMPLATE_FAILURE',
    IMPORT_DEVICE_TEMPLATE_SUCCESS: 'IMPORT_DEVICE_TEMPLATE_SUCCESS',
    IMPORT_DEVICE_TEMPLATE_FAILURE: 'IMPORT_DEVICE_TEMPLATE_FAILURE',
    UPDATE_DEVICE_TEMPLATE_REQUEST: 'UPDATE_DEVICE_TEMPLATE_REQUEST',
    UPDATE_DEVICE_TEMPLATE_SUCCESS: 'UPDATE_DEVICE_TEMPLATE_SUCCESS',
    UPDATE_DEVICE_TEMPLATE_FAILURE: 'UPDATE_DEVICE_TEMPLATE_FAILURE',
    DELETE_DEVICE_TEMPLATE_REQUEST: 'DELETE_DEVICE_TEMPLATE_REQUEST',
    DELETE_DEVICE_TEMPLATE_SUCCESS: 'DELETE_DEVICE_TEMPLATE_SUCCESS',
    DELETE_DEVICE_TEMPLATE_FAILURE: 'DELETE_DEVICE_TEMPLATE_FAILURE',
    UPDATE_CURRENT_DEVICE_TEMPLATE: 'UPDATE_CURRENT_DEVICE_TEMPLATE',
    VALIDATE_DEVICE_TEMPLATE: 'VALIDATE_DEVICE_TEMPLATE',
    MODAL_DEVICE_TEMPLATE: 'MODAL_DEVICE_TEMPLATE',
    HANDLE_DELETE_DEVICE_TEMPLATE: 'HANDLE_DELETE_DEVICE_TEMPLATE',
    HANDLE_UPDATE_DEVICE_TEMPLATE: 'HANDLE_UPDATE_DEVICE_TEMPLATE',
    INIT_UPDATE_DEVICE_TEMPLATE: 'INIT_UPDATE_DEVICE_TEMPLATE',
    SEARCH_DEVICE_TEMPLATE: 'SEARCH_DEVICE_TEMPLATE',
    //------------ end device templates ------------//

    //------------ racks ------------//
    GET_RACKS_SUCCESS: 'GET_RACKS_SUCCESS',
    GET_RACKS_FAILURE: 'GET_RACKS_FAILURE',
    GET_RACK_OTHER_SUCCESS: 'GET_RACK_OTHER_SUCCESS',
    GET_RACK_OTHER_FAILURE: 'GET_RACK_OTHER_FAILURE',
    GET_RACK_OTHER_PLUS_SUCCESS: 'GET_RACK_OTHER_PLUS_SUCCESS',
    GET_RACK_OTHER_PLUS_FAILURE: 'GET_RACK_OTHER_PLUS_FAILURE',
    GET_RACK_BY_ID_SUCCESS: 'GET_RACK_BY_ID_SUCCESS',
    GET_RACK_BY_ID_FAILURE: 'GET_RACK_BY_ID_FAILURE',
    GET_RACKS_BY_ZONE_REQUEST: 'GET_RACKS_BY_ZONE_REQUEST',
    GET_RACKS_BY_ZONE_SUCCESS: 'GET_RACKS_BY_ZONE_SUCCESS',
    GET_RACKS_BY_ZONE_FAILURE: 'GET_RACKS_BY_ZONE_FAILURE',
    GET_RACKS_BY_ZONES_REQUEST: 'GET_RACKS_BY_ZONES_REQUEST',
    GET_RACKS_BY_ZONES_SUCCESS: 'GET_RACKS_BY_ZONES_SUCCESS',
    GET_RACKS_BY_ZONES_FAILURE: 'GET_RACKS_BY_ZONES_FAILURE',
    GET_RACKS_BY_ROOM_REQUEST: 'GET_RACKS_BY_ROOM_REQUEST',
    GET_RACKS_BY_ROOM_SUCCESS: 'GET_RACKS_BY_ROOM_SUCCESS',
    GET_RACKS_BY_ROOM_FAILURE: 'GET_RACKS_BY_ROOM_FAILURE',
    GET_DEVICE_BY_ID_SUCCESS: 'GET_DEVICE_BY_ID_SUCCESS',
    GET_BOOKING_U_ID_SUCCESS: 'GET_BOOKING_U_ID_SUCCESS',
    PAGINATION_RACKS: "PAGINATION_RACKS",
    PAGINATION_RACKS_CLEAR: "PAGINATION_RACKS_CLEAR",
    ON_PAGE_CHANGE_RACKS: "ON_PAGE_CHANGE_RACKS",
    GET_RACK_PARENTS_SUCCESS: 'GET_RACK_PARENTS_SUCCESS',
    GET_RACK_PARENTS_FAILURE: 'GET_RACK_PARENTS_FAILURE',
    INSERT_RACK_REQUEST: 'INSERT_RACK_REQUEST',
    INSERT_RACK_SUCCESS: 'INSERT_RACK_SUCCESS',
    INSERT_RACK_FAILURE: 'INSERT_RACK_FAILURE',
    UPDATE_RACK_REQUEST: 'UPDATE_RACK_REQUEST',
    UPDATE_RACK_SUCCESS: 'UPDATE_RACK_SUCCESS',
    UPDATE_RACK_FAILURE: 'UPDATE_RACK_FAILURE',
    DELETE_RACK_REQUEST: 'DELETE_RACK_REQUEST',
    DELETE_RACK_SUCCESS: 'DELETE_RACK_SUCCESS',
    DELETE_RACK_FAILURE: 'DELETE_RACK_FAILURE',
    UPDATE_CURRENT_RACK: 'UPDATE_CURRENT_RACK',
    BOOKING_U_RACK_REQUEST: 'BOOKING_U_RACK_REQUEST',
    BOOKING_U_RACK_SUCCESS: 'BOOKING_U_RACK_SUCCESS',
    BOOKING_U_RACK_FAILURE: 'BOOKING_U_RACK_FAILURE',
    VALIDATE_RACK: 'VALIDATE_RACK',
    MODAL_RACK: 'MODAL_RACK',
    HANDLE_DELETE_RACK: 'HANDLE_DELETE_RACK',
    HANDLE_UPDATE_RACK: 'HANDLE_UPDATE_RACK',
    INIT_UPDATE_RACK: 'INIT_UPDATE_RACK',
    SEARCH_RACK: 'SEARCH_RACK',
    ONCHANGE_LOCATION_RACK: 'ONCHANGE_LOCATION_RACK',
    ONCHANGE_DATACENTER_RACK: 'ONCHANGE_DATACENTER_RACK',
    ONCHANGE_ROOM_RACK: 'ONCHANGE_ROOM_RACK',
    ONCHANGE_ZONE_RACK: 'ONCHANGE_ZONE_RACK',
    HANDLE_BOOKING_U_RACK: 'HANDLE_BOOKING_U_RACK',
    HANDLE_ADD_DEVICE: 'HANDLE_ADD_DEVICE',
    ADD_DEVICE_RACK_SUCCESS: 'ADD_DEVICE_RACK_SUCCESS',
    ADD_DEVICE_RACK_FAILURE: 'ADD_DEVICE_RACK_FAILURE',
    DELETE_BOOKING_RACK_SUCCESS: 'DELETE_BOOKING_RACK_SUCCESS',
    DELETE_BOOKING_RACK_FAILURE: 'DELETE_BOOKING_RACK_FAILURE',
    DELETE_DEVICE_RACK_SUCCESS: 'DELETE_DEVICE_RACK_SUCCESS',
    DELETE_DEVICE_RACK_FAILURE: 'DELETE_DEVICE_RACK_FAILURE',
    HANDLE_MOVE_U: 'HANDLE_MOVE_U',
    SAVE_MOVE_U_SUCCESS: 'SAVE_MOVE_U_SUCCESS',
    SAVE_MOVE_U_FAILURE: 'SAVE_MOVE_U_FAILURE',
    GET_RACK_BY_ID2_SUCCESS: 'GET_RACK_BY_ID2_SUCCESS',
    GET_RACK_BY_ID2_FAILURE: 'GET_RACK_BY_ID2_FAILURE',
    //------------ end racks ------------//

    //------------ layouts ------------//
    GET_LAYOUTS_SUCCESS: 'GET_LAYOUTS_SUCCESS',
    GET_LAYOUTS_FAILURE: 'GET_LAYOUTS_FAILURE',
    GET_LAYOUT_OTHER_SUCCESS: 'GET_LAYOUT_OTHER_SUCCESS',
    GET_LAYOUT_OTHER_FAILURE: 'GET_LAYOUT_OTHER_FAILURE',
    GET_LAYOUTS_BY_ID_SUCCESS: 'GET_LAYOUTS_BY_ID_SUCCESS',
    GET_LAYOUTS_BY_ID_FAILURE: 'GET_LAYOUTS_BY_ID_FAILURE',
    PAGINATION_LAYOUTS: "PAGINATION_LAYOUTS",
    PAGINATION_LAYOUTS_CLEAR: "PAGINATION_LAYOUTS_CLEAR",
    ON_PAGE_CHANGE_LAYOUTS: "ON_PAGE_CHANGE_LAYOUTS",
    GET_LAYOUT_PARENTS_SUCCESS: 'GET_LAYOUT_PARENTS_SUCCESS',
    GET_LAYOUT_PARENTS_FAILURE: 'GET_LAYOUT_PARENTS_FAILURE',
    INSERT_RACK_LAYOUT_REQUEST: 'INSERT_RACK_LAYOUT_REQUEST',
    INSERT_RACK_LAYOUT_SUCCESS: 'INSERT_RACK_LAYOUT_SUCCESS',
    INSERT_RACK_LAYOUT_FAILURE: 'INSERT_RACK_LAYOUT_FAILURE',
    UPDATE_RACK_LAYOUT_REQUEST: 'UPDATE_RACK_LAYOUT_REQUEST',
    UPDATE_RACK_LAYOUT_SUCCESS: 'UPDATE_RACK_LAYOUT_SUCCESS',
    UPDATE_RACK_LAYOUT_FAILURE: 'UPDATE_RACK_LAYOUT_FAILURE',
    UPDATE_DRAW_RACK_LAYOUT_SUCCESS: 'UPDATE_DRAW_RACK_LAYOUT_SUCCESS',
    DELETE_RACK_LAYOUT_REQUEST: 'DELETE_RACK_LAYOUT_REQUEST',
    DELETE_RACK_LAYOUT_SUCCESS: 'DELETE_RACK_LAYOUT_SUCCESS',
    DELETE_RACK_LAYOUT_FAILURE: 'DELETE_RACK_LAYOUT_FAILURE',
    UPDATE_CURRENT_LAYOUT: 'UPDATE_CURRENT_LAYOUT',
    DELETE_CURRENT_LAYOUT: 'DELETE_CURRENT_LAYOUT',
    UPDATE_LOADING_LAYOUT: 'UPDATE_LOADING_LAYOUT',
    VALIDATE_LAYOUT: 'VALIDATE_LAYOUT',
    MODAL_LAYOUT: 'MODAL_LAYOUT',
    HANDLE_DELETE_RACK_LAYOUT: 'HANDLE_DELETE_RACK_LAYOUT',
    HANDLE_UPDATE_LAYOUT: 'HANDLE_UPDATE_LAYOUT',
    INIT_UPDATE_LAYOUT: 'INIT_UPDATE_LAYOUT',
    SEARCH_LAYOUT: 'SEARCH_LAYOUT',
    ONCHANGE_LOCATION_LAYOUT: 'ONCHANGE_LOCATION_LAYOUT',
    ONCHANGE_DATACENTER_LAYOUT: 'ONCHANGE_DATACENTER_LAYOUT',
    ONCHANGE_ROOM_LAYOUT: 'ONCHANGE_ROOM_LAYOUT',
    ONCHANGE_ZONE_LAYOUT: 'ONCHANGE_ZONE_LAYOUT',

    //------------ end layouts ------------//

    //------------ contracts ------------//
    GET_CONTRACTS_SUCCESS: 'GET_CONTRACTS_SUCCESS',
    GET_CONTRACTS_FAILURE: 'GET_CONTRACTS_FAILURE',
    GET_CONTRACTS_BY_ID_SUCCESS: 'GET_CONTRACTS_BY_ID_SUCCESS',
    GET_CONTRACTS_BY_ID_FAILURE: 'GET_CONTRACTS_BY_ID_FAILURE',
    PAGINATION_CONTRACTS: "PAGINATION_CONTRACTS",
    PAGINATION_CONTRACTS_CLEAR: "PAGINATION_CONTRACTS_CLEAR",
    ON_PAGE_CHANGE_CONTRACTS: "ON_PAGE_CHANGE_CONTRACTS",
    GET_CONTRACT_PARENTS_SUCCESS: 'GET_CONTRACT_PARENTS_SUCCESS',
    GET_CONTRACT_PARENTS_FAILURE: 'GET_CONTRACT_PARENTS_FAILURE',
    INSERT_CONTRACT_REQUEST: 'INSERT_CONTRACT_REQUEST',
    INSERT_CONTRACT_SUCCESS: 'INSERT_CONTRACT_SUCCESS',
    INSERT_CONTRACT_FAILURE: 'INSERT_CONTRACT_FAILURE',
    UPDATE_CONTRACT_REQUEST: 'UPDATE_CONTRACT_REQUEST',
    UPDATE_CONTRACT_SUCCESS: 'UPDATE_CONTRACT_SUCCESS',
    UPDATE_CONTRACT_FAILURE: 'UPDATE_CONTRACT_FAILURE',
    DELETE_CONTRACT_REQUEST: 'DELETE_CONTRACT_REQUEST',
    DELETE_CONTRACT_SUCCESS: 'DELETE_CONTRACT_SUCCESS',
    DELETE_CONTRACT_FAILURE: 'DELETE_CONTRACT_FAILURE',
    UPDATE_CURRENT_CONTRACT: 'UPDATE_CURRENT_CONTRACT',
    VALIDATE_CONTRACT: 'VALIDATE_CONTRACT',
    MODAL_CONTRACT: 'MODAL_CONTRACT',
    HANDLE_DELETE_CONTRACT: 'HANDLE_DELETE_CONTRACT',
    HANDLE_UPDATE_CONTRACT: 'HANDLE_UPDATE_CONTRACT',
    INIT_UPDATE_CONTRACT: 'INIT_UPDATE_CONTRACT',
    SEARCH_CONTRACT: 'SEARCH_CONTRACT',
    //------------ end contracts ------------//
    //------------ surveyDC ------------//
    GET_SURVEY_DEVICE_SUCCESS: 'GET_SURVEY_DEVICE_SUCCESS',
    GET_SURVEY_DEVICE_FAILURE: 'GET_SURVEY_DEVICE_FAILURE',
    FEEDBACK_SURVEY_REQUEST: 'FEEDBACK_SURVEY_REQUEST',
    FEEDBACK_SURVEY_SUCCESS: 'FEEDBACK_SURVEY_SUCCESS',
    FEEDBACK_SURVEY_FAILURE: 'FEEDBACK_SURVEY_FAILURE',
    SEARCH_SURVEY: 'SEARCH_SURVEY',
    UPDATE_SURVEY_DEVICE: 'UPDATE_SURVEY_DEVICE',
    UPDATE_CURRENT_SURVEY: 'UPDATE_CURRENT_SURVEY',
    UPDATE_VALIDATE_SURVEY: 'UPDATE_VALIDATE_SURVEY',
    //------------ end surveyDC ------------//
    //------------ deploymentDC ------------//
    GET_DEPLOYMENT_DEVICE_SUCCESS: 'GET_DEPLOYMENT_DEVICE_SUCCESS',
    GET_DEPLOYMENT_DEVICE_FAILURE: 'GET_DEPLOYMENT_DEVICE_FAILURE',
    FEEDBACK_DEPLOYMENT_REQUEST: 'FEEDBACK_DEPLOYMENT_REQUEST',
    FEEDBACK_DEPLOYMENT_SUCCESS: 'FEEDBACK_DEPLOYMENT_SUCCESS',
    FEEDBACK_DEPLOYMENT_FAILURE: 'FEEDBACK_DEPLOYMENT_FAILURE',
    SEARCH_DEPLOYMENT: 'SEARCH_DEPLOYMENT',
    UPDATE_CURRENT_DEPLOYMENT: 'UPDATE_CURRENT_DEPLOYMENT',
    UPDATE_VALIDATE_DEPLOYMENT: 'UPDATE_VALIDATE_DEPLOYMENT',

    //------------ end deploymentDC ------------//

    //------------ loading ------------//
    LOADING_START: 'LOADING_START',
    LOADING_STOP: 'LOADING_STOP',
    //------------ end loading ------------//

    //------------ rule ------------//
    SET_RULE: 'SET_RULE',

    //------------ end rule ------------//

    //------------ test ------------//
    GET_TEST_SUCCESS: 'GET_TEST_SUCCESS',

    //------------ end test ------------//
};
export default actionTypes;