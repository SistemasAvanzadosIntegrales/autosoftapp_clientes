/*document.addEventListener("online", function() {

	var app_settings = JSON.parse(localStorage.getItem('app_settings'));
	var url = window.location.href;
	var params = getParams(url);
	var screen =  (new URL(location)).pathname;
	if(params.url){
		location.href = params.url
	}
	screen = screen.split('/');
	screen = screen[screen.length - 1];
	if (app_settings)
	{
	  location.href="services.html";
	}
});
/**
 *  @author   Ivan Vazquez
 **/
function login(){
	var ruta_generica = "http://autosoft2.avansys.com.mx/api/v1/";
	var email = $("#email").val().trim();
	var password = $("#password").val().trim();
	var token = $("#token").val().trim();

	if( email == '' ) {
        navigator.notification.alert('Debes escribir tu email', null, 'Aviso', 'Aceptar');
    }
    else if( password == '' ) {
        navigator.notification.alert('Debes escribir tu contraseña', null, 'Aviso', 'Aceptar');
    }
    else if( token == '' ) {
        navigator.notification.alert('Debes escribir el token', null, 'Aviso', 'Aceptar');
    }
	else
	{
		$.ajax({
			url: ruta_generica+'login',
			type: 'POST',
			dataType: "JSON",
			data: {
				email : email,
				password : password,
				token : token,
			},
			success:function(data){

				if(data.status == 'error'){
					navigator.notification.alert(resp.message, null, 'Aviso', 'Aceptar');
				}else{

					localStorage.setItem("token", token);
                    localStorage.setItem("app_settings", JSON.stringify(data));
					localStorage.setItem("email", email);
					localStorage.setItem("password", password);
					localStorage.setItem("token", token);
					sync_data(function(){
						location.href = 'services.html'
					})
				}
			}
		});
	}
}
