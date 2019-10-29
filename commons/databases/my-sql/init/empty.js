const Mysql = require('../mysql-connector');

function empty() {
    const db = new Mysql();
    const query = `truncate table tbl_Racks_BookingUs;
        alter table tbl_Racks_BookingUs AUTO_INCREMENT = 1;
        truncate table tbl_Racks_Devices;
        alter table tbl_Racks_Devices AUTO_INCREMENT = 1;
        truncate table tbl_Racks;
        alter table tbl_Racks AUTO_INCREMENT = 1;
        truncate table tbl_Zones;
        alter table tbl_Zones AUTO_INCREMENT = 1;
        truncate table tbl_Rooms;
        alter table tbl_Rooms AUTO_INCREMENT = 1;
        truncate table tbl_DataCenters;
        alter table tbl_DataCenters AUTO_INCREMENT = 1;
        truncate table tbl_Locations;
        alter table tbl_Locations AUTO_INCREMENT = 1;
    `;
    db._query(query, null, function (err, resp) {
        console.log(err, resp);
    })
}

empty();