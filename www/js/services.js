var services = function(take, skip){
    sync_data(function(){
        var db;
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(function(tx) {
            varsql = [
                " SELECT ",
                " substr('000000' || i.id, -4, 4) as folio,  i.id as link, i.*,v.brand, v.model, v.license_plate, v.vin,  group_concat(vi.files) as files, group_concat(vi.severity) as severities, group_concat(vi.status) as vi_status, sum(vi.price) as price ",
                " FROM inspections AS i ",
                " LEFT JOIN vehicles AS v ON v.id = i.vehicle_id ",
                " LEFT JOIN vehicle_inspections AS vi ON i.id = vi.inspection_id ",
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

function HtmlServices(data)
{
    for(i in data.inspections){
        var clone = $('#clone').clone();
        var inspection = data.inspections[i];
        var status = parseInt(inspection.status);
        var progress_tab = $('#progress_tab');
        var history_tab = $('#history_tab');
        console.log(inspection);
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
            clone.find('.severity-ok').append(severity_ok).removeClass('hide');
        }
        if (severity_warning > 0){
            clone.find('.severity-warning').append(severity_warning).removeClass('hide');
        }
        if (severity_danger > 0){
            clone.find('.severity-danger').append(severity_danger).removeClass('hide');
        }
        if(severity_ok + severity_warning + severity_danger > 0){
            clone.find('.link').removeClass('hide');
        }
        if((severity_ok + severity_warning + severity_danger) > 0 && (videos + audios + photos) > 0){
            clone.find('.separator').removeClass('hide');
        }
        var price = parseInt(inspection.price).toFixed(2);
        if (price > 0){
            clone.find('.price').append(price).removeClass('hide');
        }
        var presupuesto = inspection.presupuesto;
        if (presupuesto){
            clone.find('.presupuesto').attr("href", ruta_generica + 'download_price_quote/'+presupuesto).removeClass('hide');
        }
        clone.attr('id', 'clone'+i);
        clone.find('.link').attr('id', inspection.link).click(function(){
            var db;
            var severity_icon = [
                '',
                "<i class='text-success fa fa-check-square'></i>",
                "<i class='text-warning fa fa-exclamation-triangle'></i>",
                "<i class='text-danger  fa fa-window-close'></i>"
            ];
            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            var this_id = $(this).attr('id');
            console.log(this_id);
            db.transaction(function(tx) {
                var sql = [
                    " SELECT * ",
                    " FROM  vehicle_inspections AS vi  ",
                    " WHERE vi.severity in (1,2,3) AND vi.inspection_id = "+this_id,
                    " GROUP BY vi.point_id "
                ].join('');
                console.log(sql);
                tx.executeSql(sql, [], function (tx, results){

                    $('#points').html();
                    var rows = results.rows;console.log(rows);
                    for(var x = 0; x < rows.length; x++){
                        var vpoint = rows[x]
                        var clone_point = $('#clone-point').clone();
                        clone_point.attr('id', 'clone-point'+x);
                        clone_point.find('label[for="ok"]').attr('for', 'ok'+x);
                        clone_point.find('label[for="posponer"]').attr('for', 'posponer'+x);
                        clone_point.find('label[for="rechazar"]').attr('for', 'rechazar'+x);
                        clone_point.find('input[id="ok"]').attr('id', 'ok'+x);
                        clone_point.find('input[id="posponer"]').attr('id', 'posponer'+x);
                        clone_point.find('input[id="rechazar"]').attr('id', 'rechazar'+x);
                        clone_point.find('input[name="response"]').attr('name', 'response'+x);
                        clone_point.find('input[data-severity="'+rows[x].severity+'"]').attr('checked', true);
                        clone_point.find('.severity').prepend(severity_icon[rows[x].severity]+ ' '+rows[x].cataloge);
                        console.log(rows[x]);
                        var videos = rows[x].files.split("mp4").length - 1;
                        var audios = rows[x].files.split("m4a").length - 1;
                        var photos = rows[x].files.split("jpg").length - 1;
                        if (videos > 0){
                            clone_point.find('.videos').append(videos).removeClass('hide');
                        }
                        if (audios > 0){
                            clone_point.find('.audios').append(audios).removeClass('hide');
                        }
                        if (photos > 0){
                            clone_point.find('.photos').append(photos).removeClass('hide');
                        }
                        var price = parseInt(rows[x].price).toFixed(2);
                        if (price > 0){
                            clone_point.find('.price').append(price).removeClass('hide');
                        }
                        $('#points').append(clone_point)
                    }
                    $("#carousel-example-generic").carousel('next');
                });
            });

        }.bind(inspection));

        clone.removeClass('hide');
        clone.find('.inspection_status_1').addClass('hide');
        clone.find('.inspection_status_2').addClass('hide');
        clone.find('.inspection_status_3').addClass('hide');
        clone.find('.inspection_status_4').addClass('hide');
        clone.find('.inspection_status_5').addClass('hide');
        clone.find('.inspection_status_5').addClass('hide');
        clone.find('.inspection_status_'+status).removeClass('hide');
        clone.find('.folio').append(inspection.folio);
        clone.find('.car').append(' '+ inspection.brand + ' ' + inspection.model+ ' ' + inspection.license_plate+ ' ' + inspection.vin);

        if (status <= 4)
        {
            progress_tab.append(clone);
        }else {
            history_tab.append(clone);
        }
    }
}
