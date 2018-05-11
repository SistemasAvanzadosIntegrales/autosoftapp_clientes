var ruta_generica = "http://autosoft2.avansys.com.mx/api/v1/";
/**
 *  @author   Ivan Vazquez
 **/
$(document).ready(function(){
  var url = window.location.href;
  var params = getParams(url);
  var screen =  (new URL(location)).pathname;
  screen = screen.split('/');
  screen = screen[screen.length - 1];
  if (screen!='index.html'){
      $("#MainNavbar").load("navbar.html", function(){
        apariencia();
      });
   }
});

document.addEventListener("online", function() {
    $('#netStatus').attr('class', 'text-success');
     localStorage.setItem("network", 'online');
}, false);

document.addEventListener("offline", function(){
    $('#netStatus').attr('class', 'text-danger');
    localStorage.setItem("network", 'offline');
}, false);

/**
 *  @author   Ivan Vazquez
 **/
var getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};

/**
 *  @author   Ivan Vazquez
 **/
var apariencia = function()
{
  var app_settings = JSON.parse(localStorage.getItem('app_settings'));
  app_settings = app_settings ? app_settings : {"config_company": {"contrast_color": "dddddd", "base_color": "012d4a"}};
  var contrast_color = '#'+app_settings.config_company.contrast_color;
  var base_color = '#'+app_settings.config_company.base_color;
  var logo = $('#logo');

  if (app_settings.logo)
  {
      logo.attr('src', 'data:image/png;base64,'+app_settings.logo)
  }
  else {
      logo.attr('src', 'img/logo.png')
  }
  logo.fadeIn();

  $('.table thead tr th').css('background', contrast_color);
  $("#myTabs").css('background', contrast_color).css('color', base_color);
  $(".myTabs").css('background', contrast_color).css('color', base_color);

  $('label[data-target="#in-pgrogress"]').css('color', base_color);
  $('label[data-target="#history"]').css('color', base_color);

  $(document.body).css('background', base_color);
  $('.navbar-nav a').css('color', contrast_color);
  $('.btn-primary').css('background', contrast_color).css('color', base_color);
  $('a.btn-link').attr('style', 'color:' +  contrast_color+ '!important');
  $('.sub-header').css('color', contrast_color);
   $('#loading').fadeOut();
}
