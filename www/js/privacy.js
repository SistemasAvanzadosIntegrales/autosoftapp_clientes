/**
 *  @author   Ivan Vazquez
 **/
function avisoDePrivacidad(){
	var notice = JSON.parse(localStorage.getItem("app_settings"))
	console.log(notice);
	if(notice.config_company && notice.config_company.notice_privacy){
		$("#notice").append(notice.config_company.notice_privacy).show()
	}
	else if(localStorage.getItem('network') == 'online') {
		sync_data(function(){
			notice = localStorage.getItem("app_settings").config_company.notice_privacy;
			$("#notice").append(notice.config_company.notice_privacy).show()
		})
	}
}
