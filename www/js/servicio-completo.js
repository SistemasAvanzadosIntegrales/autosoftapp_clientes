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
          $('#unidad').html(data.inspection.vehicle.brand + " " + data.inspection.vehicle.model)
          var inspections = data.inspection_points.vehicle_inspections;
          var detalles = $('#detalles');

          var severity_icon = [
              '',
              "<i style='color: forestgreen ' class='fa fa-check-square'></i>",
              "<i style='color: goldenrod' class='fa fa-exclamation-triangle'></i>",
              "<i style='color: red' class='fa fa-window-close'></i>"
          ];

          var status_icon = [
              '',
              '',
              "<span style='color: forestgreen '><i class='fa fa-check'></i> Aprobado </span>",
              "<span style='color: red'><i class='fas fa-ban'></i>  Rechazado </span>",
              "<span style='color: blue'><i class='far fa-calendar-alt'></i> Pospuesto </span>"
          ];

          var inspection = '';
          detalles.append('<div class="list-group">');
          for(var i = 0; i < inspections.length; i++){
             var item = [
              severity_icon[inspections[i].status],
              inspections[i].catalogue.name,
              "<small>" + inspections[i].catalogue.inspection.name + "<small>",
              status_icon[inspections[i].status],
            ];
            detalles.append('<p class="list-group-item" style="color:#000!important">' + item.join(' - ') + '</p>');
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
