var ruta_generica = "http://172.16.0.8:8000/api/v1/";
function get_inspection(){
  let urlParams =  (new URL(location)).searchParams;
	$.ajax({
			url: ruta_generica+'servicio_completo',
			type: 'POST',
			dataType: "JSON",
			data: {
				inspection_id : urlParams.get('inspection_id'),
				token : localStorage.getItem('token')
			},
			success:function(data){
        var color  = JSON.parse(localStorage.getItem('color'));
        if (data.status == 'ok')
        {
          $('#in-date').html(data.inspection.created_at);
          $('#out-date').html(data.inspection.updated_at);

          var inspections = data.inspection_points.vehicle_inspections;
          var detalles = $('#detalles');
          var status = [
            '<i class="fa fa-trash-o"> </i>',
            '<i class="fa fa-trash"> </i>',
            '<p class="text-success">Aceptado</p>',
            '<p class="text-danger">Rechazado</p>',
            '<p class="text-info">Pospuesto</p>'
          ];
          var inspection = '';
          detalles.append('<div class="list-group">');
          for(var i = 0; i < inspections.length; i++){
            if (inspections[i].status < 3)
            {
              //continue;
              console.log('continue');
            }

            if(inspections[i].catalogue.inspection.name != inspection)
            {
              inspection = inspections[i].catalogue.inspection.name;
                detalles.append('<a class="list-group-item active" style="background:#'+ color.contrast_color +'">' + inspection + '</a>');
            }
            var item = [
              inspections[i].catalogue.name,
              status[inspections[i].status],
            ];
            detalles.append('<a href="#" class="list-group-item">' + item.join(' - ') + '</a>');
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
