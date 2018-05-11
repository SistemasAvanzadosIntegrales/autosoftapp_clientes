function __sync_data(data, call_back_function = null){

    var  db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);


    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS techs;');
        tx.executeSql('DROP TABLE IF EXISTS clients;');
        tx.executeSql('DROP TABLE IF EXISTS sync;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS vehicles (id INTEGER PRIMARY KEY, brand, model, license_plate, user_id, vin)');
        for(var i = 0; i < data.vehicles.length; i++)
        {
            var vehicle = data.vehicles[i];
            var sql = "INSERT INTO vehicles (id, brand, model, license_plate, user_id, vin) VALUES ("+vehicle.id+", '"+vehicle.brand+"', '"+vehicle.model+"', '"+vehicle.license_plate+"', "+vehicle.user_id+", '"+vehicle.vin+"')";
            tx.executeSql(sql);
        }
    });

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS catalogue;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS catalogue (id INTEGER PRIMARY KEY, inspection_id, name, category_name)');
        for(var i = 0; i < data.catalogue.length; i++)
        {
            var catalogue =  data.catalogue[i];
            tx.executeSql("INSERT INTO catalogue (id, inspection_id, name, category_name) VALUES ("+catalogue.id+", "+catalogue.inspection_id+", '"+catalogue.name+"', '"+catalogue.category_name+"')");
        }
    });

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS inspections;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS inspections (id INTEGER PRIMARY KEY, vehicle_id, user_id, origen, status, presupuesto)');
        tx.executeSql('DROP TABLE IF EXISTS vehicle_inspections;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS vehicle_inspections (id INTEGER PRIMARY KEY, inspection_id, point_id, price, severity, status, cataloge, category, origen, files)');
        for(var i = 0; i < data.inspections.length; i++)
        {
            var inspection =  data.inspections[i];

            var presupuesto = data.presupuestos[inspection.id] ? data.presupuestos[inspection.id] : '';
            var sql = "INSERT INTO inspections (id, vehicle_id, user_id, origen, status, presupuesto) VALUES ("+inspection.id+", "+inspection.vehicle_id+", "+inspection.user_id+", 'server', "+inspection.status+", '"+ presupuesto +"')";
            tx.executeSql(sql);
            var vehicle_inspections = inspection.vehicle_inspections;
            for(var x = 0; x < vehicle_inspections.length; x++)
            {
                var point = vehicle_inspections[x];
                var files = JSON.stringify(point.files);
                var sql2 = "INSERT INTO vehicle_inspections (id, inspection_id, point_id, price, severity, status, cataloge, category, origen, files) VALUES ("+point.id+", "+point.inspections_id+", "+point.inspection_id+", '"+point.price+"', "+point.severity+", '"+point.status+"', '"+point.catalogue.name+"', '"+point.catalogue.inspection.name+"', 'server', '"+files+"' )";
                tx.executeSql(sql2);
            }
        }
    }, function(error) {
        debug('algo fallo', true);
    }, function() {
        $('#dbRefresh').addClass('hide');
        debug('Data base has been saved');
        if(call_back_function)
            call_back_function.call();
    });
}

var first_sync = true;

function sync_data(call_back_function = null){
    var app_settings = JSON.parse(localStorage.getItem('app_settings'));
    console.log(app_settings);
    if(localStorage.getItem("network") == 'online'){
        $('#dbRefresh').removeClass('hide');
        var session = JSON.parse(localStorage.getItem('session'));

        $.ajax({
            async: false,
            url: ruta_generica+"sync_get_data",
            type: 'POST',
            cache : false,
            dataType: 'JSON',
            data: {
                user_id: app_settings.user.id,
                token:localStorage.getItem('token')
            },
            success:function(data) {
                __sync_data(data, call_back_function);
            }
        });
    }
    else
    {
        call_back_function.call();

    }
}

function debug(message, debug)
{
    console.log(message);
    if(debug)
        alert(JSON.stringify(message));
}