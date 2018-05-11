
function info_perfil(){
	$("#email").val(localStorage.getItem('email'));
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
