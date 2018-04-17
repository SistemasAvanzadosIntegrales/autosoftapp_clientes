$(document).ready(function(){
  var url = window.location.href;
  var params = getParams(url);
  var screen =  (new URL(location)).pathname;
  screen = screen.split('/');
  screen = screen[screen.length - 1];
  if (screen!='index.html'){
      $("#MainNavbar").load("navbar.html", function(){
        apariencia();
        $("#loading").addClass('hide');
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
  app_settings = app_settings ? app_settings : {"config_company": {"contrast_color": "dddddd", "base_color": "012d4a"}};
  $('.table thead tr th').css('background', '#'+app_settings.config_company.contrast_color);
  $('.btn, a, h1.tittle, h2.tittle, h3.tittle, h4.tittle').css('color', app_settings.config_company.contrast_color);

  $(document.body).css('background', '#'+app_settings.config_company.base_color);
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
function login(){
	var user = $("#user").val();
	var password = $("#password").val();
	var token = $("#token").val();

	if(user == '' || password == '' || token == '')
		$("#alerta").html('<i class="fa fa-warning fa-lg"></i>&nbsp; Campos vacíos').show();

	else
	{
		$.ajax({
			url: ruta_generica+'login',
			type: 'POST',
			dataType: "JSON",
			data: {
				email : user,
				password : password,
				token : token,
			},
			success:function(data){

				if(data.status == 'error'){
					$("#alerta").html('<i class="fa fa-warning fa-lg"></i>&nbsp; '+data.message).show();
				}else{
					localStorage.setItem("id", JSON.stringify(data['user']['id']));
					localStorage.setItem("user", user);
					localStorage.setItem("password", password);
					localStorage.setItem("token", token);
					localStorage.setItem("color", JSON.stringify(data['conf']));
					localStorage.setItem("id_cliente", JSON.stringify(data['user']['id']));
                    localStorage.setItem("app_settings", JSON.stringify(data));

                    var rol=JSON.stringify(data['rol']);
                    rol=rol.replace(/['"]+/g, '');
                    localStorage.setItem("rol", rol);

					location.href = 'services.html';
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {

				console.log("Status: " + textStatus);
				console.log("Error: " + errorThrown);
			}
		});
	}
}

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : /01/2018
 *  @function : apariencia
 **/
function apariencia(){
	//var colores = JSON.parse(localStorage.getItem('color'));

	//$("#myTabs").css("background-color", "#"+colores['base_color']);
	//$("head").append( "<style> a.list-group-item:hover{ background-color: #"+colores['contrast_color']+" } </style>" );
    logo();
    style();
}

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
 *  @date     : /01/2018
 *  @function : avisoDePrivacidad
 **/
function avisoDePrivacidad(){

	$.ajax({
		url: ruta_generica+'notice',
		type: 'POST',
		dataType: "JSON",
		data: {
			token : localStorage.getItem('token')
		},
		success:function(data){

			$("#notice").append(data['privacy']['notice_privacy']).show();

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
                $(target).remove();
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
                $(target).remove();
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

/**
 *  @author   : Andrea Luna
 *  @Contact  : andrea_luna@avansys.com.mx
 *  @date     : 15/02/2018
 *  @function : detallehistorial
 *  @description : De acuerdo al estado realiza la funcion correspondientes. 0 = historico 1 = progreso
 **/
function detallehistorial(){


	$.ajax({
			url: ruta_generica+'detail_inspections_client',
			type: 'POST',
			dataType: "JSON",
			data: {
				id : localStorage.getItem('vehicle_id'),
				token : localStorage.getItem('token')
			},
			success:function(data){
				$("#table_inspections").append(data['table']).show();
				$("#precio").val(data['price']);
				$("#fechataller").val(data['fechaTaller']);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {


				console.log("Status: " + textStatus);
				console.log("Error: " + errorThrown);
			}
		});
}


function info_perfil(){
	$("#user").val(localStorage.getItem('user'));
	$("#password").val(localStorage.getItem('password'));
	$("#password2").val(localStorage.getItem('password'));
	$("#token").val(localStorage.getItem('token'));
}

function cambiar_contraseña(){

	var password = $("#password").val();
	var password2 = $("#password2").val();

	if(password2 == '' || password == '')
		$("#alerta").html('<i class="fa fa-warning fa-lg"></i>&nbsp; Campos vacíos').show();

	else if(password2 != password)
		$("#alerta").html('<i class="fa fa-warning fa-lg"></i>&nbsp; Las contraseñas no coinciden ').show();

	else if(password == localStorage.getItem('password'))
		location.href = 'services.html';

	else
	{
		$.ajax({
			url: ruta_generica+'changepassword',
			type: 'POST',
			dataType: "JSON",
			data: {
				id : localStorage.getItem('id'),
				password : password,
				token : localStorage.getItem('token')
			},
			success:function(data){

				alert(JSON.stringify(data));
				localStorage['password'] = password;
				location.href = 'services.html';

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {


				console.log("Status: " + textStatus);
				console.log("Error: " + errorThrown);
			}
		});
	}
}


function gridDetalleInspeccion(){

    $("#table-clients-users").html("");
    var token = localStorage.getItem('token');
    var inspections_id=14;

    $.ajax({
        url: ruta_generica+"inspection_detail",
        type: 'POST',
        dataType: 'JSON',
        data: {
            token:      token,
            inspection_id: localStorage.getItem("inspection_id"),
            vehicle_id:    localStorage.getItem("vehicle_id"),
        },
        success:function(resp) {

            if( resp.status == 'ok' ) {
               $("#table-clients").append(resp.message);
               $("#tittle").html(resp.vehicle);
               localStorage.setItem("vehicle_client", resp.vehicle);
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

function detalle_inspeccion(id){
    location.href = 'service-detail-items.html?id='+id;
}

function gridDetalleInspeccionItem(){

    $("#items").html("");
    var token = localStorage.getItem('token');
    var inspections_id=14;
    let params =  (new URL(location)).searchParams;

    $.ajax({
        url: ruta_generica+"inspection_detail_item",
        type: 'POST',
        dataType: 'JSON',
        data: {
            token:      token,
            vehicle_inspection:     params.get('id')
        },
        success:function(resp) {

            if( resp.status == 'ok' ) {
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
