//var ruta_generica = "http://localhost:8000/";
var ruta_generica = "http://autosoft2.avansys.com.mx/api/v1/";
function get_inspection(){
    var url = window.location.href;
    params = getParams(url);

	$.ajax({
			url: ruta_generica+'servicio_completo',
			type: 'POST',
			dataType: "JSON",
			data: {
				inspection_id : params.inspection_id,
				token : localStorage.getItem('token')
			},
			success:function(data){
        if (data.status == 'ok')
        {
          $('#in-date').html(data.inspection.created_at);
          $('#out-date').html(data.inspection.updated_at);

          var inspections = data.inspection_points.vehicle_inspections;
          var detalles = $('#detalles');
          var status = [
            '',
            '',
            '<p class="text-success">Aceptado</p>',
            '<p class="text-danger">Rechazado</p>',
            '<p class="text-info">Pospuesto</p>'
          ];
          var inspection = '';
          detalles.append('<div class="list-group">');
          for(var i = 0; i < inspections.length; i++){
            if (inspections[i].status < 3)
            {
              console.log('continue');
            }

            if(inspections[i].catalogue.inspection.name != inspection)
            {
              inspection = inspections[i].catalogue.inspection.name;
                detalles.append('<a href="#" class="list-group-item" style="color:#000!important>' + inspection + '</a>');
            }
            var item = [
              inspections[i].catalogue.name,
              status[inspections[i].status],
            ];
            detalles.append('<a href="#" class="list-group-item" style="color:#000!important">' + item.join(' - ') + '</a>');
          }
          detalles.append('</div>');
        }
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {

				console.log("Function: getPaymentData()");
				console.log("Status: " + textStatus);
				console.log("Error: " + errorThrown);
			}
		});
}
