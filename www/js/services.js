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
                " WHERE i.status > 2 ",
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
    '',
    "<span style='color: forestgreen '><i class='fa fa-check'></i> Aprobado </span>",
    "<span style='color: red'><i class='fas fa-ban'></i>  Rechazado </span>",
    "<span style='color: blue'><i class='far fa-calendar-alt'></i> Pospuesto </span>"
];

var progress_tab = $('#progress_tab');
var history_tab = $('#history_tab');

var HtmlServices = function HtmlServices(data)
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
        var _title = ' '+ inspection.brand + ' ' + inspection.model+ ', ' + inspection.license_plate+ ', ' + inspection.vin;
        clone.attr('id', 'clone'+inspection.link);
        clone.attr('data-id', inspection.link);
        clone.attr('data-folio', inspection.folio);
        clone.attr('data-title', _title);
        clone.attr('data-status',inspection.status);
        clone.attr('data-created-at', inspection.created_at);
        clone.attr('data-price', inspection.price);
        clone.attr('data-updated-at',inspection.updated_at);

        clone.find('.car').append(_title);

        clone.find('.inspection_status_1').addClass('hide');
        clone.find('.inspection_status_2').addClass('hide');
        clone.find('.inspection_status_3').addClass('hide');
        clone.find('.inspection_status_4').addClass('hide');
        clone.find('.inspection_status_5').addClass('hide');
        clone.find('.inspection_status_5').addClass('hide');
        clone.find('.inspection_status_'+status).removeClass('hide');
        clone.find('.folio').append(inspection.folio);


        clone.find('.btn-slide').draggable({
            revert:true,
            scroll:false,
            axis: "x",
            start: function(event, ui) {
                start = ui.position.left;
                if ($('.visited').length)
                {
                    $('.visited').removeClass('visited')
                }
                $(this).parent().addClass('visited');
            },
            drag: function(event, ui) {
                stop = ui.position.left;''
                        console.log(ui.position);
                if(start - stop > 10 && start > stop){
                    slide(inspection);
                }
            }
        });
        clone.removeClass('hide');

        if (status <= 4)
        {
            progress_tab.append(clone);
        }else {
            history_tab.append(clone);
        }
    }
    if(progress_tab.html() == "")
    {
        progress_tab.append("<p class='text-center'>Por el momento no tienes servicios registrados.</p>");
    };
    if(history_tab.html() == "")
    {
        history_tab.append("<p class='text-center'>Por el momento no tienes servicios registrados.</p>");
    };
}

var load_media = function(e) {
    $('.w3-section').html('')
    $('.severity-point').html("");
    $('.severity-point').prepend(severity_icon[$('.point-visited').attr('data-severity')] + ' '+$('.point-visited').attr('data-cataloge') + ' <small>' + $('.point-visited').attr('data-category')  + '</small>');
    $('.btn-status').css('background', 'rgb(102, 102, 102)');
    $('.btn-status').removeClass('hide').removeAttr('disabled').removeAttr('readonly');
    $('button[data-status="'+$('.point-visited').attr('data-status')+'"]').css('background', 'green');
    if($('.visited').attr('data-status') != 3 || $('.point-visited').attr('data-severity') == 1)
    {
        $('button[data-status="'+$('.point-visited').attr('data-status')+'"]').css('background', 'lightgray');
        $('button[data-status="'+$('.point-visited').attr('data-status')+'"]').attr('disabled', true).attr('readonly', true);
        $('.btn-status:not(button[data-status="'+$('.point-visited').attr('data-status')+'"])').addClass('hide');
        $('button[data-status="'+$('.point-visited').attr('data-status')+'"]').css('width', '100%').css('font-size', '1em').css('border-radius', 0);
        $('button[data-status="'+$('.point-visited').attr('data-status')+'"]').html(status_icon[$('.point-visited').attr('data-status')]);
    }
    if( parseInt($('.point-visited').attr('data-point-price')) > 0 )
    {
        $('.price-point').html($('.point-visited').find('.price').html());
        $('.price-point').removeClass('hide');
    }
    else
    {
        $('.price-point').html("<br><br>");
        $('.price-point').addClass('hide');
    }
    $('#statusPointId').val($('.point-visited').attr('data-point-id'));
    if($('.point-visited').attr('data-point-files') == undefined || $('.point-visited').attr('data-point-files') == ""){
        return;
    }
    var files = /*JSON.parse(*/$('.point-visited').attr('data-point-files')/*)*/;
    alert(files);
    var files_length =  files.length;
    var uri = 'http://autosoft2.avansys.com.mx/files/';
    for (var w = 0; w < files_length; w++){


        var __file_name = files[w].name;
        var item = false;
        if (__file_name.indexOf('.mp4') > 0){
            item = "<div class='mySlides'><video style='height:250px; margin:auto; display: inherit; 'controls><source src='"+uri + __file_name +"' type='video/mp4'></video></div>";
        }
        else if (__file_name.indexOf('.m4a') > 0){
            item  = "<div class='mySlides'>"+
            "<i class='fa fa-volume-up'></i><audio style='width:100%; margin:auto; display: inherit;' controls>"+
            "<source src='"+uri + __file_name+"'></audio></div>";
        }
        else if (__file_name.indexOf('.jpg') > 0){
            item = '<div class="mySlides"><img style="width:100%; margin:auto; display: inherit;" src="'+uri + __file_name +'"></div>';
        }

        $('.w3-content').append(item);

    }
    if($('.mySlides').length > 1){
        $('.sliders-button').removeClass('hide');
        showDivs(1);
    }else {
        $('.sliders-button').addClass('hide');
    }

}

$("#GalleryPanel").draggable({
    revert:true,
    axis: 'x',
    scroll:false,
    start: function(event, ui) {
        start = ui.position.left;
    },
    drag: function(event, ui) {
        stop = ui.position.left;
        if(stop - start > 10 && start < stop){
            $("#carousel-example-generic").carousel(1);
        }
    }
});

var slide = function(e){
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);;
    var inspection_id = $('.visited').attr('data-id');
    $(".inspection_folio").html($('.visited').attr('data-folio'));
    $(".inspection_car").html($('.visited').attr('data-title'));
    var presupuesto_href = $('.visited').find('.presupuesto').attr('href');
    $(".presupuesto-display").addClass('hide');
    if(presupuesto_href){
        $(".presupuesto-display").attr("href", presupuesto_href);
        $(".presupuesto-display").removeClass('hide');
    }
    if( $('.visited').attr('data-status') >= 5 )
    {
        $('.created_at').html($('.visited').attr('data-created-at'));
        $('.updated_at').html($('.visited').attr('data-updated-at'));
        $('.updated_at').parent().removeClass('hide');
    } else
    {
        $('.created_at').html("");
        $('.updated_at').html("");
        $('.updated_at').parent().addClass('hide');
    }
    if( $('.visited').attr('data-price') > 0 )
    {
        $('.price-display').html(parseInt($('.visited').attr('data-price')).toFixed(2));
        $('.price-display').parent().removeClass('hide');
    }else {
        $('.price-display').html("");
        $('.price-display').parent().addClass('hide');
    }
    db.transaction(function(tx) {
        var sql = [
            " SELECT * ",
            " FROM  vehicle_inspections AS vi  ",
            " WHERE vi.severity in (1,2,3) AND vi.inspection_id = "+inspection_id,
            " GROUP BY vi.point_id "
        ].join('');
        tx.executeSql(sql, [], function (tx, results){

            $('#points').html("");
            var rows = results.rows;
            for(var x = 0; x < rows.length; x++){
                var point = rows[x];
                var clone_point = $('#clone-point').clone();
                clone_point.attr('id', 'clone-point'+x);
                clone_point.find('.severity').prepend(severity_icon[point.severity] + ' '+point.cataloge + ' <small>' + point.category  + '</small>');
                clone_point.find('.status').html(status_icon[point.status]);
                console.log(point.file);
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
                clone_point.attr('data-severity', point.severity);
                clone_point.attr('data-cataloge', point.cataloge);
                clone_point.attr('data-category', point.category);
                clone_point.attr('data-status', point.status);
                clone_point.attr('data-point-id', point.id);
                clone_point.attr('data-point-price', point.price);
                clone_point.attr('data-point-inspection-id', point.inspection_id);
                clone_point.attr('data-point-files', point.files);
                clone_point.find('.btn-slide').draggable({
                    revert:true,
                    helper: "clone",
                    axis: "x",
                    start: function(event, ui) {
                        console.log(ui.position);
                        start = ui.position.left;
                        if ($('.point-visited').length)
                        {
                            $('.point-visited').removeClass('point-visited')
                        }
                        $(this).parent().addClass('point-visited');
                    },
                    drag: function(event, ui) {
                        stop = ui.position.left;
                        if(start - stop > 10 || start - stop < -10){
                            if(start > stop)
                            {
                                load_media(point)
                                $("#carousel-example-generic").carousel(2);
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
    });
}

var slideIndex = 1;
function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "block";
}

$( window ).on( "orientationchange", function( event ) {
    //var height_panel = screen.availHeight - 30;
    //$('.panel-default').css('height', height_panel);
});
