var services = function(take, skip){
    sync_data(function(){
        var db;
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(function(tx) {
            let sql = [
                " SELECT ",
                " substr('000000' || i.id, -4, 4) as folio,  i.id as link, i.*,v.brand, v.model, v.license_plate, v.vin, group_concat(vi.files) as files, group_concat(vi.severity) as severities, group_concat(vi.status) as vi_status ",
                " FROM inspections AS i ",
                " LEFT JOIN vehicles AS v ON v.id = i.vehicle_id ",
                " LEFT JOIN vehicle_inspections AS vi ON i.id = vi.inspection_id ",
                                " GROUP BY i.id ",
                " ORDER BY i.id DESC ",

                " LIMIT " + skip+", "+take
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
        if((severity_ok + severity_warning + severity_danger) > 0 && (videos + audios + photos) > 0){
            clone.find('.separator').removeClass('hide');
        }
        clone.attr('id', 'clone'+i);
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
