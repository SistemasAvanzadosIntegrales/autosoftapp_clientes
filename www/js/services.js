var services = function(take, skip){
    sync_data(function(){
        var db;
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(function(tx) {
            var sql = [
                " SELECT ",
                " substr('000000' || i.id, -4, 4) as folio,  i.id as link, i.*,v.brand, v.model, v.license_plate, v.vin,  group_concat(vi.files) as files, group_concat(vi.severity) as severities, group_concat(vi.status) as vi_status, sum(vi.price) as price ",
                " FROM inspections AS i ",
                " LEFT JOIN vehicles AS v ON v.id = i.vehicle_id ",
                " LEFT JOIN vehicle_inspections AS vi ON i.id = vi.inspection_id ",
                " WHERE i.status > 1 ",
                " GROUP BY i.id ",
                " ORDER BY i.id DESC "
            ].join('');
            tx.executeSql(sql, [], function (tx, results){
                HtmlServices({inspections: results.rows});
            });

            sql = [
                " SELECT ",
                " COUNT(*) as count_rows ",
                " FROM inspections AS i ",
                " LEFT JOIN vehicles AS v ON v.id = i.vehicle_id "
            ].join('');
            tx.executeSql(sql, [], function (tx, results){
                var show_more = $('#show_more');
                show_more.unbind('click');
                show_more.parent().parent().removeClass('hide');
                skip = skip + take;
                if(skip < results.rows[0].count_rows){
                    show_more.click(function(){
                        services(take, skip)
                    });
                }
                else {
                    show_more.parent().parent().addClass('hide');
                }
            });
        });
    });
}
var severity_icon = [
    '',
    "<i style='color: forestgreen ' class='fa fa-check-square'></i>",
    "<i style='color: goldenrod' class='fa fa-exclamation-triangle'></i>",
    "<i style='color: red' class='fa fa-window-close'></i>"
];
var status_icon = [
    '',
    "<span style='color: forestgreen '><i class='fa fa-check'></i> Aceptado </span>",
    "<span style='color: red'><i class='fas fa-ban'></i>  Rechazado </span>",
    "<span style='color: blue'><i class='far fa-calendar-alt'></i> 1212-12-12 </span>"
];
function HtmlServices(data)
{
    for(i in data.inspections){
        var clone = $('#clone').clone();
        var inspection = data.inspections[i];
        var status = parseInt(inspection.status);
        var progress_tab = $('#progress_tab');
        var history_tab = $('#history_tab');


        if(!status)
            continue;

        var videos = inspection.files.split("mp4").length - 1;
        var audios = inspection.files.split("m4a").length - 1;
        var photos = inspection.files.split("jpg").length - 1;
        if (videos > 0){
            clone.find('.videos').append(videos).removeClass('hide');
        }
        if (audios > 0){
            clone.find('.audios').append(audios).removeClass('hide');
        }
        if (photos > 0){
            clone.find('.photos').append(photos).removeClass('hide');
        }

        var severity_ok = inspection.severities.split("1").length - 1;
        var severity_warning = inspection.severities.split("2").length - 1;
        var severity_danger = inspection.severities.split("3").length - 1;
        if (severity_ok > 0){
            clone.find('.severity-ok').append(severity_icon[1] + severity_ok).removeClass('hide');
        }
        if (severity_warning > 0){
            clone.find('.severity-warning').append(severity_icon[2] + severity_warning).removeClass('hide');
        }
        if (severity_danger > 0){
            clone.find('.severity-danger').append(severity_icon[3] + severity_danger).removeClass('hide');
        }
        if(severity_ok + severity_warning + severity_danger > 0){
            clone.find('.link').removeClass('hide');
        }

        var price = parseInt(inspection.price).toFixed(2);
        if (price > 0){
            clone.find('.price').append(price).removeClass('hide');
        }
        var presupuesto = inspection.presupuesto;
        if (presupuesto){
            clone.find('.presupuesto').attr("href", ruta_generica + 'download_price_quote/'+presupuesto).removeClass('hide');
        }
        clone.attr('id', 'clone'+inspection.link);
        clone.draggable({
            revert:true,
            axis: "x",
            start: function(event, ui) {
                start = ui.position.left;
            },
            drag: function(event, ui) {
                stop = ui.position.left;
                if(start - stop > 30 && start > stop){
                    console.log(inspection);
                    slide();
                }
            }
        });
        var slide = function(e){
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);;
            $('.visited').removeClass('visited');
            var inspection = this;
            var inspection_id = inspection.id;
            $("#clone" + inspection_id).addClass('visited');
            $(".inspection_folio").html(inspection.folio);
            $(".inspection_car").html(inspection.brand + ' ' + inspection.model+ ', ' + inspection.license_plate+ ', ' + inspection.vin);
            db.transaction(function(tx) {
                var sql = [
                    " SELECT * ",
                    " FROM  vehicle_inspections AS vi  ",
                    " WHERE vi.severity in (1,2,3) AND vi.inspection_id = "+inspection_id,
                    " GROUP BY vi.point_id "
                ].join('');
                tx.executeSql(sql, [], function (tx, results){

                    $('#points').html("");
                    var rows = results.rows;console.log(rows);
                    for(var x = 0; x < rows.length; x++){
                        var point = rows[x];
                        var clone_point = $('#clone-point').clone();
                        clone_point.attr('id', 'clone-point'+x);
                        clone_point.find('.severity').prepend(severity_icon[point.severity] + ' '+point.cataloge + ' <small>' + point.category  + '</small>');
                        clone_point.find('.status').prepend(status_icon[point.status]);

                        var videos = point.files.split("mp4").length - 1;
                        var audios = point.files.split("m4a").length - 1;
                        var photos = point.files.split("jpg").length - 1

                        var price = parseInt(point.price).toFixed(2);

                        if (videos > 0){
                            clone_point.find('.videos').append(videos).removeClass('hide');
                        }

                        if (audios > 0){
                            clone_point.find('.audios').append(audios).removeClass('hide');
                        }

                        if (photos > 0){
                            clone_point.find('.photos').append(photos).removeClass('hide');
                        }

                        if (price > 0){
                            clone_point.find('.price').append(price).removeClass('hide');
                        }
                        clone_point.attr('data-point')
                        clone_point.draggable({
                            revert:true,
                            axis: "x",
                            start: function(event, ui) {
                                start = ui.position.left;
                            },
                            drag: function(event, ui) {
                                stop = ui.position.left;
                                if(start - stop > 10 ||  start - stop < -10){
                                    if(start > stop)
                                    {
                                        $("#carousel-example-generic").carousel(2);
                                        load_media(point)
                                        $('#carousel-gallery-generic').carousel();
                                    }
                                    else {
                                        $("#carousel-example-generic").carousel(0);
                                    }
                                }
                            }
                        });
                        $('#points').append(clone_point)
                    }
                    $("#carousel-example-generic").carousel(1);
                });
                $('.list-group').css('height', screen.availHeight);
                var height_panel = screen.availHeight - 30;
                $('.panel-default').css('height', height_panel);
            });

        }.bind(inspection);

        var load_media = function(point) {
            $('.severity-point').html("");
            $('.severity-point').prepend(severity_icon[point.severity] + ' '+point.cataloge + ' <small>' + point.category  + '</small>');
            $('input[data-severity="'+point.severity+'"]').attr('checked', true);
            var files = JSON.decode(point.files);
            for(var r = 0; r < files.length; r++)
            {
                console.log(files[r]);
            }

        }

/*

*/
        clone.removeClass('hide');
        clone.find('.inspection_status_1').addClass('hide');
        clone.find('.inspection_status_2').addClass('hide');
        clone.find('.inspection_status_3').addClass('hide');
        clone.find('.inspection_status_4').addClass('hide');
        clone.find('.inspection_status_5').addClass('hide');
        clone.find('.inspection_status_5').addClass('hide');
        clone.find('.inspection_status_'+status).removeClass('hide');
        clone.find('.folio').append(inspection.folio);
        clone.find('.car').append(' '+ inspection.brand + ' ' + inspection.model+ ', ' + inspection.license_plate+ ', ' + inspection.vin);

        if (status <= 4)
        {
            progress_tab.append(clone);
        }else {
            history_tab.append(clone);
        }
    }
}
$( window ).on( "orientationchange", function( event ) {
    var height_panel = screen.availHeight - 30;
    $('.panel-default').css('height', height_panel);
});
