$(document).ready(function(){
  $("#MainNavbar").load("navbar.html");
});

//var ruta_generica = "http://localhost:8000/api/v1/";
var ruta_generica = "http://192.168.15.63:8000/api/v1/";
//var ruta_generica = "http://localhost:8000/api/v1/";

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

					location.href = 'services.html';  
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("Function: getPaymentData()");
				console.log("Status: " + textStatus);
				console.log("Error: " + errorThrown);
			}
		});
	} 
}

function apariencia(){	
	var colores = JSON.parse(localStorage.getItem('color'));
	
	$("#myTabs").css("background-color", "#"+colores['base_color']);
	$("head").append( "<style> a.list-group-item:hover{ background-color: #"+colores['contrast_color']+" } </style>" );
}

function link(ruta){
	cordova.InAppBrowser.open(ruta);
}

function avisoDePrivacidad()
{
	
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
			console.log("Function: getPaymentData()");
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
				
				console.log("Function: getPaymentData()");
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
            inspections_id:    inspections_id
        },
        success:function(resp) {
            
            if( resp.status == 'ok' ) {
               $("#table-clients").append(resp.message);	
               $("#tittle").html(resp.vehicle);
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

function dialogPrompt() {
   var message = "Am I Prompt Dialog?";
   var title = "PROMPT";
   var buttonLabels = ["YES","NO"];
   var defaultText = "Default"
   navigator.notification.prompt(message, promptCallback, 
      title, buttonLabels, defaultText);

   function promptCallback(result) {
      console.log("You clicked " + result.buttonIndex + " button! \n" + 
         "You entered " +  result.input1);
   }
	
}
