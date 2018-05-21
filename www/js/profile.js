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
	{
		navigator.notification.alert('Campos vacíos', null, 'Aviso', 'Aceptar');
	}
	else if(password2 != password)
	{
		navigator.notification.alert('Las contraseñas no coinciden ', null, 'Aviso', 'Aceptar');
	}

	else if(password == localStorage.getItem('password'))
	{
		navigator.notification.alert('No se ha detectado ningun cambio ', function(){location.href = 'services.html';}, 'Aviso', 'Aceptar');
	}
	else
	{
		var app_settings = JSON.parse(localStorage.getItem('app_settings'));
		$.ajax({
			url: ruta_generica+'changepassword',
			type: 'POST',
			dataType: "JSON",
			data: {
				id: app_settings.user.id,
				password : password,
				token : localStorage.getItem('token')
			},
			success:function(data){
				navigator.notification.alert(data.message, function(){
					location.href = 'services.html';
				}, 'Aviso', 'Aceptar');
			}
		});
	}
}
