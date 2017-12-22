(function() {
	// 配置
	var envir = 'test';
	var userinfo = sessionStorage.getItem("hongyuan");
	var logininfos = JSON.parse(userinfo);
	if(userinfo==undefined || userinfo==null){
				window.parent.location.href = 'login.html';
			}else{
				if(logininfos.token==undefined || logininfos.token==null || logininfos.token==""){
					window.parent.location.href = 'login.html';
			}
			}
	
	var token = logininfos.token;
	console.log(token);
	var configMap = {
		test: {
			url: 'http://192.168.1.111:8088/'
		},
		online: {
			url: ''
		}
	};
	window.CONFIG = configMap[envir];
	window.token = token;
}())