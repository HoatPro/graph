const authController = require('../api/controllers/auths/auth-controller');
const adminController = require('../api/controllers/admin-controller');
const userController = require('../api/controllers/admin/users-controller');
const groupsController = require('../api/controllers/admin/groups-controller');
const permissionsController = require('../api/controllers/admin/permissions-controller');
const actionsController = require('../api/controllers/admin/actions-controller');
const routesController = require('../api/controllers/admin/routes-controller');
const departmentsController = require('../api/controllers/categories/departments-controller');
const groupMaterialsController = require('../api/controllers/categories/group-materials-controller');
const professionalKnowledgesController = require('../api/controllers/categories/professional-knowledges-controller')
const regionsController = require('../api/controllers/categories/regions-controller');
const typesController = require('../api/controllers/categories/types-controller');
const diagramsController = require('../api/controllers/diagram/diagrams-controller');
const deviceTypesController = require('../api/controllers/categories/device-types-controller');
const deviceTemplatesController = require('../api/controllers/categories/device-templates-controller');
const cabsController = require('../api/controllers/cabport/cabs-controller');
const cabtypesController = require('../api/controllers/cabport/cabtypes-controller');
const portsController = require('../api/controllers/cabport/ports-controller');
const porttypesController = require("../api/controllers/cabport/porttypes-controller");
const racksController = require("../api/controllers/categories/racks-controller");
const dataCentersController = require("../api/controllers/datacenter/data-centers-controller");
const initController = require("../api/controllers/init-controller");
const upNewController = require("../api/controllers/request/up-new-controller");
const surveyDeviceController = require("../api/controllers/request/survey-device-controller");
const deploymentDeviceController = require("../api/controllers/request/deployment-device-controller");
const branchsController = require("../api/controllers/categories/branchs-controller");
const reasonsController = require("../api/controllers/categories/reasons-controller");
const provincesController = require("../api/controllers/categories/provinces-controller");
const districtsController = require("../api/controllers/categories/districts-controller");
const placesController = require("../api/controllers/categories/places-controller");
const productsController = require("../api/controllers/categories/products-controller");
const normOfProductsController = require("../api/controllers/categories/norm-of-products-controller");
const statesController = require("../api/controllers/categories/states-controller");
const inventoryReportController = require("../api/controllers/report/inventory-report-controller");
const transactionHistoryReportController = require("../api/controllers/report/transaction-history-report-controller");
const stockReportController = require("../api/controllers/report/stock-report-controller");
const stepperController = require("../api/controllers/categories/stepper-controller");
const locationsController = require("../api/controllers/categories/locations-controller");
const datacentersController = require("../api/controllers/categories/datacenters-controller");
const zonesController = require("../api/controllers/categories/zones-controller");
const roomsController = require("../api/controllers/categories/rooms-controllers");
const customersController = require("../api/controllers/categories/customers-controller");
const testController = require("../api/controllers/admin/test-controller");
const contracts = require("../api/controllers/categories/contracts-controller");
const middleware = require('../api/middleware/middleware');
const inventoryMaterialsDetailedController = require("../api/controllers/report/inventory-materials-detailed-controller");
const deviceInRack = require("../api/controllers/categories/device-in-rack-controller");

function routes(app) {

    //-------------- auth --------------//
    app.post('/raca-api/login', (req, res, next) => {
        authController.login(req, res, next);
    });
    app.post('/raca-api/auth-user', (req, res, next) => {
        authController.authUser(req, res, next);
    });
    //-------------- end auth --------------//

    //-------------- admin --------------//
    app.get('/raca-api/get-all-stock-kipper', (req, res, next) => {
        userController.getAllStockKipper(req, res, next);
    });

    app.get('/raca-api/get-users', (req, res, next) => {
        userController.getUsers(req, res, next);
    });

    app.get('/raca-api/get-user', (req, res, next) => {
        userController.getUserById(req, res, next);
    });

    app.post('/raca-api/insert-user', (req, res, next) => {
        userController.insertUser(req, res, next);
    });

    app.put('/raca-api/update-user', (req, res, next) => {
        userController.updateUser(req, res, next);
    });

    app.put('/raca-api/reset-password', (req, res, next) => {
        userController.resetPassword(req, res, next);
    });


    app.delete('/raca-api/delete-user', (req, res, next) => {
        userController.deleteUser(req, res, next);
    });
    //-------------- end admin --------------//

    //-------------- actions --------------//
    app.get('/raca-api/get-all-action', (req, res, next) => {
        actionsController.getAllAction(req, res, next);
    });

    app.get('/raca-api/get-actions', (req, res, next) => {
        actionsController.getActions(req, res, next);
    });

    app.get('/raca-api/get-action', (req, res, next) => {
        actionsController.getActionById(req, res, next);
    });

    app.post('/raca-api/insert-action', (req, res, next) => {
        actionsController.insertAction(req, res, next);
    });

    app.put('/raca-api/update-action', (req, res, next) => {
        actionsController.updateAction(req, res, next);
    });

    app.delete('/raca-api/delete-action', (req, res, next) => {
        actionsController.deleteAction(req, res, next);
    });
    //-------------- end actions --------------//

    //-------------- permissions --------------//
    app.get('/raca-api/get-all-permission', (req, res, next) => {
        permissionsController.getAllPermission(req, res, next);
    });

    app.get('/raca-api/get-permission', (req, res, next) => {
        permissionsController.getPermission(req, res, next);
    });

    app.get('/raca-api/max-action-of-route', (req, res, next) => {
        permissionsController.getMaxActionOfRoute(req, res, next);
    });

    app.post('/raca-api/insert-permission', (req, res, next) => {
        permissionsController.insertPermission(req, res, next);
    });

    app.post('/raca-api/update-permission', (req, res, next) => {
        permissionsController.updatePermission(req, res, next);
    });

    app.delete('/raca-api/delete-permission', (req, res, next) => {
        permissionsController.deletePermission(req, res, next);
    });
    //-------------- end permissions --------------//

    //-------------- routes --------------//
    app.get('/raca-api/get-all-route', (req, res, next) => {
        routesController.getAllRoute(req, res, next);
    });

    app.get('/raca-api/get-routes', (req, res, next) => {
        routesController.getRoutes(req, res, next);
    });

    app.get('/raca-api/get-route', (req, res, next) => {
        routesController.getRouteById(req, res, next);
    });

    app.get('/raca-api/get-all-route-action', (req, res, next) => {
        routesController.getAllRouteAction(req, res, next);
    });

    app.get('/raca-api/get-route-parents', (req, res, next) => {
        routesController.getParents(req, res, next);
    });

    app.post('/raca-api/insert-route', (req, res, next) => {
        routesController.insertRoute(req, res, next);
    });

    app.put('/raca-api/update-route', (req, res, next) => {
        routesController.updateRoute(req, res, next);
    });

    app.delete('/raca-api/delete-route', (req, res, next) => {
        routesController.deleteRoute(req, res, next);
    });
    //-------------- end routes --------------//

    //-------------- departments --------------//
    app.get('/raca-api/get-all-department', (req, res, next) => {
        departmentsController.getAllDepartment(req, res, next);
    });

    app.get('/raca-api/get-departments', (req, res, next) => {
        departmentsController.getDepartments(req, res, next);
    });

    app.get('/raca-api/get-department', (req, res, next) => {
        departmentsController.getDepartmentById(req, res, next);
    });

    app.post('/raca-api/insert-department', (req, res, next) => {
        departmentsController.insertDepartment(req, res, next);
    });

    app.put('/raca-api/update-department', (req, res, next) => {
        departmentsController.updateDepartment(req, res, next);
    });

    app.delete('/raca-api/delete-department', (req, res, next) => {
        departmentsController.deleteDepartment(req, res, next);
    });
    //-------------- end departments --------------//

    //-------------- Professional Knowledges --------------//
    app.get('/raca-api/get-all-professional-knowledge', (req, res, next) => {
        professionalKnowledgesController.getAllProfessionalKnowledge(req, res, next);
    });

    app.get('/raca-api/get-professional-knowledges', (req, res, next) => {
        professionalKnowledgesController.getProfessionalKnowledges(req, res, next);
    });

    app.post('/raca-api/insert-professional-knowledge', (req, res, next) => {
        professionalKnowledgesController.insertProfessionalKnowledge(req, res, next);
    });

    app.put('/raca-api/update-professional-knowledge', (req, res, next) => {
        professionalKnowledgesController.updateProfessionalKnowledge(req, res, next);
    });

    app.delete('/raca-api/delete-professional-knowledge', (req, res, next) => {
        professionalKnowledgesController.deleteProfessionalKnowledge(req, res, next);
    });
    //-------------- end Professional Knowledges --------------//

    //-------------- types --------------//
    app.get('/raca-api/get-all-type', (req, res, next) => {
        typesController.getAllType(req, res, next);
    });

    app.get('/raca-api/get-types', (req, res, next) => {
        typesController.getTypes(req, res, next);
    });

    // app.get('/raca-api/search-types', (req, res, next) => {
    //     typesController.searchTypes(req, res, next);
    // });

    app.post('/raca-api/insert-type', (req, res, next) => {
        typesController.insertType(req, res, next);
    });

    app.put('/raca-api/update-type', (req, res, next) => {
        typesController.updateType(req, res, next);
    });

    app.delete('/raca-api/delete-type', (req, res, next) => {
        typesController.deleteType(req, res, next);
    });
    //-------------- end types --------------//

    //-------------- groups --------------//
    app.get('/raca-api/get-all-group', (req, res, next) => {
        groupsController.getAllGroup(req, res, next);
    });

    app.get('/raca-api/get-groups', (req, res, next) => {
        groupsController.getGroups(req, res, next);
    });

    app.get('/raca-api/get-group', (req, res, next) => {
        groupsController.getGroupById(req, res, next);
    });

    app.post('/raca-api/insert-group', (req, res, next) => {
        groupsController.insertGroup(req, res, next);
    });

    app.put('/raca-api/update-group', (req, res, next) => {
        groupsController.updateGroup(req, res, next);
    });

    app.delete('/raca-api/delete-group', (req, res, next) => {
        groupsController.deleteGroup(req, res, next);
    });
    //-------------- end groups --------------//

    //-------------- regions --------------//
    app.get('/raca-api/get-all-region', (req, res, next) => {
        regionsController.getAllRegion(req, res, next);
    });

    app.get('/raca-api/get-regions', (req, res, next) => {
        regionsController.getRegions(req, res, next);
    });

    app.get('/raca-api/get-region', (req, res, next) => {
        regionsController.getRegionById(req, res, next);
    });

    app.post('/raca-api/insert-region', (req, res, next) => {
        regionsController.insertRegion(req, res, next);
    });

    app.put('/raca-api/update-region', (req, res, next) => {
        regionsController.updateRegion(req, res, next);
    });

    app.delete('/raca-api/delete-region', (req, res, next) => {
        regionsController.deleteRegion(req, res, next);
    });
    //-------------- end regions --------------//

    //-------------- diagrams --------------//
    app.get('/raca-api/get-all-diagram', (req, res, next) => {
        diagramsController.getAllDiagram(req, res, next);
    });

    app.get('/raca-api/get-diagrams', (req, res, next) => {
        diagramsController.getDiagrams(req, res, next);
    });

    app.post('/raca-api/insert-diagram', (req, res, next) => {
        diagramsController.insertDiagram(req, res, next);
    });

    app.put('/raca-api/update-diagram', (req, res, next) => {
        diagramsController.updateDiagram(req, res, next);
    });

    app.delete('/raca-api/delete-diagram', (req, res, next) => {
        diagramsController.deleteDiagram(req, res, next);
    });
    //-------------- end diagrams --------------//

    //-------------- location --------------//
    app.get('/raca-api/get-all-location', (req, res, next) => {
        locationsController.getAllLocation(req, res, next);
    });

    app.get('/raca-api/get-locations', (req, res, next) => {
        locationsController.getLocations(req, res, next);
    });

    app.get('/raca-api/get-location', (req, res, next) => {
        locationsController.getLocationById(req, res, next);
    });

    app.post('/raca-api/insert-location', (req, res, next) => {
        locationsController.insertLocation(req, res, next);
    });

    app.put('/raca-api/update-location', (req, res, next) => {
        locationsController.updateLocation(req, res, next);
    });

    app.delete('/raca-api/delete-location', (req, res, next) => {
        locationsController.deleteLocation(req, res, next);
    });
    //-------------- end location --------------//

    //-------------- contract --------------//
    app.get('/raca-api/get-all-contract', (req, res, next) => {
        contracts.getAllContract(req, res, next);
    });

    app.get('/raca-api/get-contracts', (req, res, next) => {
        contracts.getContracts(req, res, next);
    });

    app.get('/raca-api/get-contract', (req, res, next) => {
        contracts.getContractById(req, res, next);
    });

    app.post('/raca-api/insert-contract', (req, res, next) => {
        contracts.insertContract(req, res, next);
    });

    app.put('/raca-api/update-contract', (req, res, next) => {
        contracts.updateContract(req, res, next);
    });

    app.delete('/raca-api/delete-contract', (req, res, next) => {
        contracts.deleteContract(req, res, next);
    });
    //-------------- end contract --------------//

    //-------------- datacenter --------------//

    app.get('/raca-api/get-all-datacenter', (req, res, next) => {
        datacentersController.getAllDatacenters(req, res, next);
    });
    app.get('/raca-api/get-datacenters', (req, res, next) => {
        datacentersController.getDatacenters(req, res, next);
    });

    app.get('/raca-api/get-datacenter', (req, res, next) => {
        datacentersController.getDatacenterById(req, res, next);
    });

    app.post('/raca-api/insert-datacenter', (req, res, next) => {
        datacentersController.insertDatacenter(req, res, next);
    });

    app.put('/raca-api/update-datacenter', (req, res, next) => {
        datacentersController.updateDatacenter(req, res, next);
    });

    app.delete('/raca-api/delete-datacenter', (req, res, next) => {
        datacentersController.deleteDatacenter(req, res, next);
    });
    //-------------- end datacenter --------------//
    //-------------- room --------------//
    app.get('/raca-api/get-all-room', (req, res, next) => {
        roomsController.getAllRoom(req, res, next);
    });

    app.get('/raca-api/get-rooms', (req, res, next) => {
        roomsController.getRooms(req, res, next);
    });

    app.get('/raca-api/get-room', (req, res, next) => {
        roomsController.getRoomById(req, res, next);
    });

    app.post('/raca-api/insert-room', (req, res, next) => {
        roomsController.insertRoom(req, res, next);
    });

    app.put('/raca-api/update-room', (req, res, next) => {
        roomsController.updateRoom(req, res, next);
    });

    app.delete('/raca-api/delete-room', (req, res, next) => {
        roomsController.deleteRoom(req, res, next);
    });
    //-------------- end room --------------//
    //-------------- zone --------------//
    app.get('/raca-api/get-all-zone', (req, res, next) => {
        zonesController.getAllZone(req, res, next);
    });

    app.get('/raca-api/get-zones', (req, res, next) => {
        zonesController.getZones(req, res, next);
    });

    app.get('/raca-api/get-zone', (req, res, next) => {
        zonesController.getZoneById(req, res, next);
    });

    app.post('/raca-api/insert-zone', (req, res, next) => {
        zonesController.insertZone(req, res, next);
    });

    app.put('/raca-api/update-zone', (req, res, next) => {
        zonesController.updateZone(req, res, next);
    });

    app.delete('/raca-api/delete-zone', (req, res, next) => {
        zonesController.deleteZone(req, res, next);
    });
    //-------------- end zone --------------//

    //-------------- deviceTypes --------------//
    app.get('/raca-api/get-all-device-type', (req, res, next) => {
        deviceTypesController.getAllDeviceType(req, res, next);
    });

    app.get('/raca-api/get-device-types', (req, res, next) => {
        deviceTypesController.getDeviceTypes(req, res, next);
    });

    app.get('/raca-api/get-device-type', (req, res, next) => {
        deviceTypesController.getDeviceTypeById(req, res, next);
    });

    app.post('/raca-api/insert-device-type', (req, res, next) => {
        deviceTypesController.insertDeviceType(req, res, next);
    });

    app.post('/raca-api/import-device-type', (req, res, next) => {
        deviceTypesController.importDeviceType(req, res, next);
    });

    app.put('/raca-api/update-device-type', (req, res, next) => {
        deviceTypesController.updateDeviceType(req, res, next);
    });

    app.delete('/raca-api/delete-device-type', (req, res, next) => {
        deviceTypesController.deleteDeviceType(req, res, next);
    });
    //-------------- end deviceTypes --------------//

    //-------------- deviceTemplates --------------//
    app.get('/raca-api/get-all-device-template', (req, res, next) => {
        deviceTemplatesController.getAllDeviceTemplate(req, res, next);
    });

    app.get('/raca-api/get-device-templates', (req, res, next) => {
        deviceTemplatesController.getDeviceTemplates(req, res, next);
    });

    app.get('/raca-api/get-device-template', (req, res, next) => {
        deviceTemplatesController.getDeviceTemplateById(req, res, next);
    });

    app.post('/raca-api/insert-device-template', (req, res, next) => {
        deviceTemplatesController.insertDeviceTemplate(req, res, next);
    });

    app.post('/raca-api/import-device-template', (req, res, next) => {
        deviceTemplatesController.importDeviceTemplate(req, res, next);
    });

    app.put('/raca-api/update-device-template', (req, res, next) => {
        deviceTemplatesController.updateDeviceTemplate(req, res, next);
    });

    app.delete('/raca-api/delete-device-template', (req, res, next) => {
        deviceTemplatesController.deleteDeviceTemplate(req, res, next);
    });
    //-------------- end deviceTemplates --------------//

    //-------------- cabs --------------//
    app.get('/raca-api/get-cabs', (req, res, next) => {
        cabsController.getCabs(req, res, next);
    });

    app.post('/raca-api/insert-cab', (req, res, next) => {
        cabsController.insertCab(req, res, next);
    });

    app.put('/raca-api/update-cab', (req, res, next) => {
        cabsController.updateCab(req, res, next);
    });

    app.delete('/raca-api/delete-cab', (req, res, next) => {
        cabsController.deleteCab(req, res, next);
    });
    //-------------- end cabs --------------//

    //-------------- cabtypes --------------//
    app.get('/raca-api/get-all-cabtype', (req, res, next) => {
        cabtypesController.getAllCabType(req, res, next);
    });

    app.get('/raca-api/get-cabtypes', (req, res, next) => {
        cabtypesController.getCabTypes(req, res, next);
    });

    app.post('/raca-api/insert-cabtype', (req, res, next) => {
        cabtypesController.insertCabType(req, res, next);
    });

    app.put('/raca-api/update-cabtype', (req, res, next) => {
        cabtypesController.updateCabType(req, res, next);
    });

    app.delete('/raca-api/delete-cabtype', (req, res, next) => {
        cabtypesController.deleteCabType(req, res, next);
    });
    //-------------- end cabtypes --------------//
    //
    // -------------- ports --------------//
    app.get('/raca-api/get-ports', (req, res, next) => {
        portsController.getPorts(req, res, next);
    });

    app.post('/raca-api/insert-port', (req, res, next) => {
        portsController.insertPort(req, res, next);
    });

    app.put('/raca-api/update-port', (req, res, next) => {
        portsController.updatePort(req, res, next);
    });

    app.delete('/raca-api/delete-port', (req, res, next) => {
        portsController.deletePort(req, res, next);
    });
    //-------------- end ports --------------//

    //-------------- porttypes --------------//
    app.get('/raca-api/get-all-porttype', (req, res, next) => {
        porttypesController.getAllPortType(req, res, next);
    });

    app.get('/raca-api/get-porttypes', (req, res, next) => {
        porttypesController.getPortTypes(req, res, next);
    });

    app.post('/raca-api/insert-porttype', (req, res, next) => {
        porttypesController.insertPortType(req, res, next);
    });

    app.put('/raca-api/update-porttype', (req, res, next) => {
        porttypesController.updatePortType(req, res, next);
    });

    app.delete('/raca-api/delete-porttype', (req, res, next) => {
        porttypesController.deletePortType(req, res, next);
    });
    //-------------- end porttypes --------------//

    //-------------- racks --------------//
    app.get('/raca-api/get-all-rack', (req, res, next) => {
        racksController.getAllRack(req, res, next);
    });

    app.get('/raca-api/get-racks', (req, res, next) => {
        racksController.getRacks(req, res, next);
    });
    // get by Id
    app.get('/raca-api/get-rack', (req, res, next) => {
        racksController.getRackById(req, res, next);
    });

    app.get('/raca-api/get-rack-by-zone', (req, res, next) => {
        racksController.getRackByZone(req, res, next);
    });

    app.get('/raca-api/get-rack-by-zones', (req, res, next) => {
        racksController.getRackByZones(req, res, next);
    });

    app.get('/raca-api/get-rack-by-room', (req, res, next) => {
        racksController.getRackByRoom(req, res, next);
    });

    // get by zone
    app.get('/raca-api/get-racks-by-zone', (req, res, next) => {
        racksController.getRacksByZone(req, res, next);
    });

    app.get('/raca-api/get-select-device', (req, res, next) => {
        racksController.getSelectDevice(req, res, next);
    });

    app.post('/raca-api/insert-rack', (req, res, next) => {
        racksController.insertRack(req, res, next);
    });

    app.post('/raca-api/import-device-to-rack', (req, res, next) => {
        racksController.importDeviceToRack(req, res, next);
    });

    app.post('/raca-api/put-device-local', (req, res, next) => {
        racksController.putDeviceOnRack(req, res, next);
    });

    app.post('/raca-api/booking-u', (req, res, next) => {
        racksController.bookingU(req, res, next);
    });

    app.post('/raca-api/add-device-rack', (req, res, next) => {
        racksController.addDeviceRack(req, res, next);
    });

    app.put('/raca-api/update-rack', (req, res, next) => {
        racksController.updateRack(req, res, next);
    });

    app.delete('/raca-api/delete-rack', (req, res, next) => {
        racksController.deleteRack(req, res, next);
    });

    app.delete('/raca-api/delete-device-rack', (req, res, next) => {
        racksController.deleteDeviceRack(req, res, next);
    });

    app.delete('/raca-api/delete-device', (req, res, next) => {
        racksController.addDeviceRack(req, res, next);
    });

    app.delete('/raca-api/delete-booking', (req, res, next) => {
        racksController.deleteBooking(req, res, next);
    });
    app.post('/raca-api/save-move-u', (req, res, next) => {
        racksController.saveMoveU(req, res, next);
    });

    app.get('/raca-api/get-device', (req, res, next) => {
        racksController.getDeviceById(req, res, next);
    });

    app.post('/raca-api/update-draw-rack', (req, res, next) => {
        racksController.updateDraw(req, res, next);
    });

    //-------------- end racks --------------//

    // -------------- data centers --------------//
    app.get('/raca-api/get-data-center', (req, res, next) => {
        dataCentersController.getDataCenterById(req, res, next);
    });


    //-------------- end data centers --------------//
    //-------------- init --------------//
    app.post('/raca-api/survey-dc', middleware.verifyAPI, (req, res, next) => {
        initController.surveyDC(req, res, next);
    });

    app.post('/raca-api/deployment-dc', middleware.verifyAPI, (req, res, next) => {
        initController.deployment(req, res, next);
    });

    app.get('/raca-api/get-location-dc', middleware.verifyAPI, (req, res, next) => {
        initController.getLocation(req, res, next);
    });

    app.get('/raca-api/get-data-center-dc', middleware.verifyAPI, (req, res, next) => {
        initController.getDataCenter(req, res, next);
    });

    app.get('/raca-api/get-room-dc', middleware.verifyAPI, (req, res, next) => {
        initController.getRoom(req, res, next);
    });

    app.get('/raca-api/get-zone-dc', middleware.verifyAPI, (req, res, next) => {
        initController.getZone(req, res, next);
    });

    app.get('/raca-api/get-rack-dc', middleware.verifyAPI, (req, res, next) => {
        initController.getRack(req, res, next);
    });
    //-------------- end int --------------//

    //-------------- up new --------------//
    app.get('/raca-api/get-contract', (req, res, next) => {
        upNewController.getContract(req, res, next);
    });

    app.get('/raca-api/get-devices-by-contract', (req, res, next) => {
        upNewController.getDevicesByContract(req, res, next);
    });

    //-------------- end up new --------------//

    //-------------- survey device --------------//
    app.get('/raca-api/get-survey-device', (req, res, next) => {
        surveyDeviceController.getSurveyDevice(req, res, next);
    });
    app.post('/raca-api/feed-back-survey', (req, res, next) => {
        surveyDeviceController.feedbackSurvey(req, res, next);
    });

    //-------------- end survey device --------------//

    //-------------- deployment device --------------//
    app.get('/raca-api/get-deployment-device', (req, res, next) => {
        deploymentDeviceController.getDeploymentDevice(req, res, next);
    });
    app.post('/raca-api/feed-back-deployment', (req, res, next) => {
        deploymentDeviceController.feedBackDeploymentDevice(req, res, next);
    });

    //-------------- end deployment device --------------//

    //-------------- customer --------------//
    app.get('/raca-api/get-all-customer', (req, res, next) => {
        customersController.getAllCustomers(req, res, next);
    });

    app.get('/raca-api/get-customers', (req, res, next) => {
        customersController.getCustomers(req, res, next);
    });

    app.get('/raca-api/get-customer', (req, res, next) => {
        customersController.getCustomerById(req, res, next);
    });

    app.post('/raca-api/insert-customer', (req, res, next) => {
        customersController.insertCustomer(req, res, next);
    });

    app.put('/raca-api/update-customer', (req, res, next) => {
        customersController.updateCustomer(req, res, next);
    });

    app.delete('/raca-api/delete-customer', (req, res, next) => {
        customersController.deleteCustomer(req, res, next);
    });
    //-------------- end customer --------------//

    //-------------- branchs --------------//
    app.get('/raca-api/get-branchs', (req, res, next) => {
        branchsController.getBranchs(req, res, next);
    });

    app.get('/raca-api/search-branchs', (req, res, next) => {
        branchsController.searchBranchs(req, res, next);
    });

    app.post('/raca-api/insert-branch', (req, res, next) => {
        branchsController.insertBranch(req, res, next);
    });

    app.put('/raca-api/update-branch', (req, res, next) => {
        branchsController.updateBranch(req, res, next);
    });

    app.delete('/raca-api/delete-branch', (req, res, next) => {
        branchsController.deleteBranch(req, res, next);
    });
    //-------------- end branchs --------------//

    //-------------- reasons --------------//
    app.get('/raca-api/get-all-reason', (req, res, next) => {
        reasonsController.getAllReason(req, res, next);
    });

    app.get('/raca-api/get-reasons', (req, res, next) => {
        reasonsController.getReasons(req, res, next);
    });

    app.get('/raca-api/search-reasons', (req, res, next) => {
        reasonsController.searchReasons(req, res, next);
    });

    app.post('/raca-api/insert-reason', (req, res, next) => {
        reasonsController.insertReason(req, res, next);
    });

    app.put('/raca-api/update-reason', (req, res, next) => {
        reasonsController.updateReason(req, res, next);
    });

    app.delete('/raca-api/delete-reason', (req, res, next) => {
        reasonsController.deleteReason(req, res, next);
    });
    //-------------- end reasons --------------//

    //-------------- Group Materials --------------//
    app.get('/raca-api/get-all-group-materials', (req, res, next) => {
        groupMaterialsController.getAllGroupMaterials(req, res, next);
    });

    app.get('/raca-api/get-group-materials', (req, res, next) => {
        groupMaterialsController.getGroupMaterials(req, res, next);
    });

    app.get('/raca-api/search-group-materials', (req, res, next) => {
        groupMaterialsController.searchGroupMaterials(req, res, next);
    });

    app.post('/raca-api/insert-group-material', (req, res, next) => {
        groupMaterialsController.insertGroupMaterial(req, res, next);
    });

    app.put('/raca-api/update-group-material', (req, res, next) => {
        groupMaterialsController.updateGroupMaterial(req, res, next);
    });

    app.delete('/raca-api/delete-group-material', (req, res, next) => {
        groupMaterialsController.deleteGroupMaterial(req, res, next);
    });
    //-------------- end Group Materials --------------//

    //-------------- provinces --------------//
    app.get('/raca-api/get-all-province', (req, res, next) => {
        provincesController.getAllProvince(req, res, next);
    });

    app.get('/raca-api/get-provinces', (req, res, next) => {
        provincesController.getProvinces(req, res, next);
    });

    app.post('/raca-api/insert-province', (req, res, next) => {
        provincesController.insertProvince(req, res, next);
    });

    app.put('/raca-api/update-province', (req, res, next) => {
        provincesController.updateProvince(req, res, next);
    });

    app.delete('/raca-api/delete-province', (req, res, next) => {
        provincesController.deleteProvince(req, res, next);
    });

    app.post('/raca-api/import-province', (req, res, next) => {
        provincesController.importProvince(req, res, next);
    });


    //-------------- end provinces --------------//

    // -------------- districts --------------//
    app.get('/raca-api/get-all-district', (req, res, next) => {
        districtsController.getAllDistrict(req, res, next);
    });

    app.get('/raca-api/get-districts', (req, res, next) => {
        districtsController.getDistricts(req, res, next);
    });
    app.post('/raca-api/insert-district', (req, res, next) => {
        districtsController.insertDistrict(req, res, next);
    });
    app.put('/raca-api/update-district', (req, res, next) => {
        districtsController.updateDistrict(req, res, next);
    });
    app.delete('/raca-api/delete-district', (req, res, next) => {
        districtsController.deleteDistrict(req, res, next);
    });

    app.get('/raca-api/search-district', (req, res, next) => {
        districtsController.searchDistrict(req, res, next);
    });

    app.post('/raca-api/import-district', (req, res, next) => {
        districtsController.importDistrict(req, res, next);
    });


    //-------------- end districts --------------//

    // -------------- places --------------//
    app.get('/raca-api/get-all-place', (req, res, next) => {
        placesController.getAllPlace(req, res, next);
    });

    app.get('/raca-api/get-places', (req, res, next) => {
        placesController.getPlaces(req, res, next);
    });

    app.post('/raca-api/insert-place', (req, res, next) => {
        placesController.insertPlace(req, res, next);
    });

    app.put('/raca-api/update-place', (req, res, next) => {
        placesController.updatePlace(req, res, next);
    });

    app.delete('/raca-api/delete-place', (req, res, next) => {
        placesController.deletePlace(req, res, next);
    });

    //-------------- end places --------------//

    // -------------- products --------------//
    app.get('/raca-api/get-all-product', (req, res, next) => {
        productsController.getAllProduct(req, res, next);
    });

    app.get('/raca-api/get-products', (req, res, next) => {
        productsController.getProducts(req, res, next);
    });

    app.get('/raca-api/get-products-by-query', (req, res, next) => {
        productsController.getProductsByQuery(req, res, next);
    });

    app.get('/raca-api/get-products-by-name-code', (req, res, next) => {
        productsController.getProductsByNameCode(req, res, next);
    });

    app.get('/raca-api/get-products-by-name', (req, res, next) => {
        productsController.getProductsByName(req, res, next);
    });

    app.post('/raca-api/insert-product', (req, res, next) => {
        productsController.insertProduct(req, res, next);
    });

    app.put('/raca-api/update-product', (req, res, next) => {
        productsController.updateProduct(req, res, next);
    });

    app.delete('/raca-api/delete-product', (req, res, next) => {
        productsController.deleteProduct(req, res, next);
    });

    app.get('/raca-api/get-devices-by-department', (req, res, next) => {
        productsController.getDeviceByDepartment(req, res, next);
    });

    //-------------- end products --------------//

    // -------------- norm of products --------------//
    app.get('/raca-api/get-norm-of-products', (req, res, next) => {
        normOfProductsController.getNormOfProducts(req, res, next);
    });

    app.post('/raca-api/insert-norm-of-product', (req, res, next) => {
        normOfProductsController.insertNormOfProduct(req, res, next);
    });

    app.put('/raca-api/update-norm-of-product', (req, res, next) => {
        normOfProductsController.updateNormOfProduct(req, res, next);
    });

    app.delete('/raca-api/delete-norm-of-product', (req, res, next) => {
        normOfProductsController.deleteNormOfProduct(req, res, next);
    });


    //-------------- end products --------------//


    //-------------- states --------------//
    app.get('/raca-api/get-all-state', (req, res, next) => {
        statesController.getAllState(req, res, next);
    });

    //-------------- end states --------------//


    // -------------- inventory report --------------//
    app.get('/raca-api/get-inventory-report', (req, res, next) => {
        inventoryReportController.getInventoryReport(req, res, next);
    });

    app.get('/raca-api/get-inventory-report-by-serial', (req, res, next) => {
        inventoryReportController.getInventoryReportBySerial(req, res, next);
    });

    app.get('/raca-api/get-serial', (req, res, next) => {
        inventoryReportController.getSerials(req, res, next);
    });
    //-------------- end inventory report --------------//

    // -------------- transaction history report --------------//
    app.get('/raca-api/get-transaction-history-report', (req, res, next) => {
        transactionHistoryReportController.getTransactionHistoryReport(req, res, next);
    });
    //-------------- end transaction history  report --------------//


    // -------------- stock report --------------//
    app.get('/raca-api/get-stock-report', (req, res, next) => {
        stockReportController.getStockReport(req, res, next);
    });
    //-------------- end stock report --------------//

    // -------------- inventory materials detailed --------------//
    app.get('/raca-api/get-inventory-materials-detailed', (req, res, next) => {
        inventoryMaterialsDetailedController.getInventoryMaterialsDetailed(req, res, next);
    });
    //-------------- end inventory materials detailed --------------//

    // -------------- stepper --------------//
    app.get('/raca-api/get-stepper', (req, res, next) => {
        stepperController.getStepper(req, res, next);
    });
    //-------------- end stepper --------------//

    //--------------test actionRoute-----------//
    app.get('/raca-api/get-test', (req, res, next) => {
        testController.getDetailActionRole(req, res, next);
    })
    //-------------- end test actionRoute------//

    // -------------- device in rack --------------//
    app.get('/raca-api/get-all-device-in-rack', (req, res, next) => {
        deviceInRack.getAllDeviceInRack(req, res, next);
    });

    app.get('/raca-api/get-device-in-rack', (req, res, next) => {
        deviceInRack.getDeviceInRack(req, res, next);
    });
    //-------------- end device in rack --------------//


}

module.exports = routes;