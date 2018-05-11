/**
 *  @author   Ivan Vazquez
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
