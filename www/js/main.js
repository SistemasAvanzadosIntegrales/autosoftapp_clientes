/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
var getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};
//var ruta_generica = "http://localhost:8000/api/v1/";
var ruta_generica = "http://autosoft2.avansys.com.mx/api/v1/";

function posponer(){
    var devicePlatform = device.platform;
    minDate =new Date();

    if(devicePlatform=="Android"){
        var options = {
          date: new Date(),
          mode: 'date',
          minDate: minDate.getTime(),
          titleText:"Posponer",
          okText:"Aceptar",
          cancelText:"Cancelar"
        };
    }else{
        var options = {
          date: new Date(),
          mode: 'date',
          minDate: minDate,
          titleText:"Posponer",
          okText:"Aceptar",
          cancelText:"Cancelar"
        };
    }

    datePicker.show(options, function(date){
    navigator.notification.alert("Postpuesto para " +date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate());
      madarResultado(4,date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate(),0);
    });
}

function rechazar(){

   var message = "Ingrese motivo para rechazo:";
   var title = "Rechazar";
   var buttonLabels = ["Cancelar","Aceptar"];

   navigator.notification.prompt(message, promptCallback,
      title, buttonLabels);

   function promptCallback(result) {
       if(result.buttonIndex==2){
            navigator.notification.alert('Rechazaste por '+result.input1);
             madarResultado(3, 0, result.input1);
        }
   }
}

function aceptar(){
    function onConfirm(buttonIndex) {
        if(buttonIndex==1){
             madarResultado(2,0,0);
        }
    }
    navigator.notification.confirm(
        '¿Desea que sea reparado?', // message
         onConfirm,            // callback to invoke with index of button pressed
        'Aprobar',           // title
        ['Aprobar','Cancelar']     // buttonLabels
    );
}

function madarResultado(status, fecha, motivo){
    var token = localStorage.getItem('token');
	var point_id = $('#statusPointId').val();
	var status_icon = [
	    '',
	    '',
	    "<span style='color: forestgreen '><i class='fa fa-check'></i> Aprobado </span>",
	    "<span style='color: red'><i class='fas fa-ban'></i>  Rechazado </span>",
	    "<span style='color: blue'><i class='far fa-calendar-alt'></i> Pospuesto </span>"
	];
    $.ajax({
        url: ruta_generica+"inspection_client_result",
        type: 'POST',
        dataType: 'JSON',
        data: {
            token: token,
            id: point_id,
            pospuesto: fecha,
            motivo: motivo,
            status: status
        },
        success:function(resp) {
			console.log(resp.count[0].total);
			if (resp.count[0].total == 0) {
				location.href = "services.html";
			}
            if( resp.status == 'ok' ) {
				$('div[data-point-id="'+point_id+'"]').find('.status').html(status_icon[status]);
				var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
				db.transaction(function(tx) {
					tx.executeSql( "UPDATE vehicle_inspections set status = "+status+"  origen = 'modified' where id = ? ", [point_id]);
				});
               	$("#carousel-example-generic").carousel(1);
				$('div[data-point-id="'+point_id+'"]').attr('data-status', status);
                progress_tab.html("");
                history_tab.html("");
                services();
            }
            else {
                $("#alertaLogin").html(resp.message).show();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
        }
    });

}
