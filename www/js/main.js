$(document).ready(function(){
  var url = window.location.href;
  var params = getParams(url);
  var screen =  (new URL(location)).pathname;
  screen = screen.split('/');
  screen = screen[screen.length - 1];
  if (screen!='index.html'){
      $("#MainNavbar").load("navbar.html", function(){
        apariencia();
        setTimeout(function(){
            $("#loading").addClass('hide');

        }, 7000);
      });
   }
});
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

function style()
{
  var app_settings = JSON.parse(localStorage.getItem('app_settings'));
  console.log(app_settings);
  app_settings = app_settings ? app_settings : {"config_company": {"contrast_color": "dddddd", "base_color": "012d4a"}};
  var contrast_color = '#'+app_settings.config_company.contrast_color;
  var base_color = '#'+app_settings.config_company.base_color;

  $('.table thead tr th').css('background', contrast_color);
  $("#myTabs").css('background', contrast_color).css('color', base_color);
  $('label[data-target="#in-pgrogress"]').css('color', base_color);
  $('label[data-target="#history"]').css('color', base_color);

  $(document.body).css('background', base_color);
  $('.navbar-nav a').css('color', contrast_color);
  $('.btn-primary').css('background', contrast_color).css('color', base_color);
  $('a.btn-link').attr('style', 'color:' +  contrast_color+ '!important');
  $('.sub-header').css('color', contrast_color);
  $('#loading').fadeOut();
  console.log("style was aplicated");
}

function logo(){
  var app_settings = JSON.parse(localStorage.getItem('app_settings'));
  var logo = $('#logo');
  if (logo && app_settings) {
      if (app_settings.logo)
      {
          logo.attr('src', 'data:image/png;base64,'+app_settings.logo)
      }
      else {
          logo.attr('src', 'img/logo.png')
      }
   logo.fadeIn();
   console.log("logo was put");
  }
}
/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : /01/2018
 *  @function : login
 **/



/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : /01/2018
 *  @function : link
 **/
function link(ruta){
	cordova.InAppBrowser.open(ruta);
}


/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 12/02/2018
 *  @function : getservices
 *  @Description : Obtiene los autos con inspecciones en progreso y las que fueron atendidas.
 **/
function getservices_active(take, skip, target = null){

	$.ajax({
		url: ruta_generica+'inspections_client_active',
		type: 'POST',
		dataType: "JSON",
		data: {
            take: take,
            skip: skip,
			token : localStorage.getItem('token'),
			id_cliente : localStorage.getItem('id_cliente')
		},
		success:function(data){
			$("#table-services-progress").append(data['table']).show();
            if (target)
            {
                $(target).parent().remove();
            }
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("Status: " + textStatus);
			console.log("Error: " + errorThrown);
		}
	});
}

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 12/02/2018
 *  @function : getservices
 *  @Description : Obtiene los autos con inspecciones en progreso y las que fueron atendidas.
 **/
function getservices_history(take, skip, target = null){

	$.ajax({
		url: ruta_generica+'inspections_client_history',
		type: 'POST',
		dataType: "JSON",
		data: {
            take: take,
            skip: skip,
			token : localStorage.getItem('token'),
			id_cliente : localStorage.getItem('id_cliente')
		},
		success:function(data){
			$("#table-services-history").append(data['table']).show();
            if (target)
            {
                $(target).parent().remove();
            }
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("Function: getPaymentData()" + JSON.stringify(XMLHttpRequest));
			console.log("Status: " + textStatus);
			console.log("Error: " + errorThrown);
		}
	});
}


/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 12/02/2018
 *  @function : accion_services
 *  @description : De acuerdo al estado realiza la funcion correspondientes. 0 = historico 1 = progreso
 **/
function accion_services(inspection_id, vehicle_id, status){

    localStorage.removeItem("inspection_id");
	localStorage.setItem("inspection_id", inspection_id);
	localStorage.removeItem("vehicle_id");
	localStorage.setItem("vehicle_id", vehicle_id);

	if(status) location.href = 'service-details.html';
	else location.href = 'service-detail-history.html';
}


function gridDetalleInspeccion(type){

    $("#table-clients-users").html("");
    var token = localStorage.getItem('token');
    var inspections_id=14;

    $.ajax({
        url: ruta_generica+"inspection_detail",
        type: 'POST',
        dataType: 'JSON',
        data: {
            token:      token,
            type: type,
            inspection_id: localStorage.getItem("inspection_id"),
            vehicle_id:    localStorage.getItem("vehicle_id"),
        },
        success:function(resp) {

            if( resp.status == 'ok' ) {
               $("#table-clients").append(resp.message);
               $("#tittle").html(resp.vehicle);
               localStorage.setItem("vehicle_client", resp.vehicle);
               if(resp.redirect){
                   location.href = 'services.html';
               }
               if($("#precio").length){

                   for(var i = 0; i < resp.inspections.vehicle_inspections.length; i++){
                       var inspection_point_price = resp.inspections.vehicle_inspections[i].price;
                         $("#precio").val((parseInt(inspection_point_price ? inspection_point_price : 0) + parseInt($("#precio").val())));
                   }

                   $("#fechataller").val(resp.inspections.created_at);
                   $("#fechaatencion").val(resp.inspections.updated_at);
               }

               if (resp.pdf)
               {
                   $("#price_quote").removeClass('hide');
                   $("#price_quote").find('a').attr('href', ruta_generica + 'download_price_quote/'+resp.pdf);
               }
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


function gridDetalleInspeccionItem(){

    $("#items").html("");
    var token = localStorage.getItem('token');
    let params =  (new URL(location)).searchParams;

    $.ajax({
        url: ruta_generica+"inspection_detail_item",
        type: 'POST',
        dataType: 'JSON',
        data: {
            token: token,
            vehicle_inspection: params.get('id')
        },
        success:function(resp) {

            if( resp.status == 'ok' ) {
                if(params.get('type') == 'history')
                {
                    let status = resp.vehicle_inspection.status;
                    let status_text;
                    if(status == 2){
                        status_text = 'Aprobado';
                    }else if(status == 3){
                        status_text = 'Pospuesto';
                    }else if(status == 4){
                        status_text = 'Rechazado';
                    }
                    $("#StatusInspectionPoint").html("<h4 class='text-center'>"+status_text+"</h4>");
                }
               $("#service-detail-items").html(resp.message);
                localStorage.setItem("vehicle_inspection", resp.inspection);
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
             madarResultado(3,0,result.input1);
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

function madarResultado(status,fecha,motivo){


    var token = localStorage.getItem('token');
    let params =  (new URL(location)).searchParams;

    $.ajax({
        url: ruta_generica+"inspection_client_result",
        type: 'POST',
        dataType: 'JSON',
        data: {
            token:      token,
            id:     params.get('id'),
            pospuesto: fecha,
            motivo: motivo,
            status: status
        },
        success:function(resp) {

            if( resp.status == 'ok' ) {
               push();
               location.href = 'service-details.html';
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

function push(){

        var token = localStorage.getItem('token');
        var mensaje = "El cliente revisó: "+localStorage.getItem('vehicle_client')+" el punto: "+localStorage.getItem('vehicle_inspection');
        $.ajax({
            url: ruta_generica+"send_notification",
            type: 'POST',
            dataType: 'JSON',
            data: {
                tipo:"rol",
                value:"Asesor",
                token:token,
                mensaje:mensaje
            },
            success:function(resp) {
                if( resp.status == 'ok' ) {
                 $("#alertaLogin").html(resp.message).show();
                    location.href="resultado_inspeccion.html";
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
