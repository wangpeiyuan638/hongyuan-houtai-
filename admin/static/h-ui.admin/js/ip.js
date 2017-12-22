//全局获取IP
function getIp(){
	//var http = "http://192.168.1.111:8080/";
	var http = "http://119.23.28.239:8080/";
	//var http = "http://192.168.1.111:8088/";
	return http;
};
//全局验证登录token
function verifyCode(data){
	var falg = false;
	if( typeof data === 'object' ) {
    	if(data.code==401){
    		alert(data.msg);
    		window.parent.location.href= 'login.html';
    	}else{
    		return data;
    	}
	}else{
		var res = JSON.parse(data);
		if(res.code==401){
			alert(data.msg);
    		window.parent.location.href= 'login.html';
    	}else{
    		return data;
    	}
	}
};
//全局验证增加
function verifyRoot(rootIndex){
	var userinfo = sessionStorage.getItem("hongyuan");
		if(userinfo==undefined || userinfo==null){
			window.parent.location.href = 'login.html';
		}else{
			var logininfos = JSON.parse(userinfo);
			var flag = true;
			if(logininfos.token==undefined || logininfos.token==null || logininfos.token==""){
				window.parent.location.href = 'login.html';
			};
			for(x in logininfos.data.menuId){
				if(logininfos.data.menuId[x]==rootIndex){
					flag = false;
				}
			}
			if(flag){
				layer.msg('您没有此权限，请联系管理员!', {
					icon: 1,
					time: 2000
				});
				return true;
			}else{
				return false;
			}
		}
};
function isNumber(value) {
    var patrn = /^\+?[1-9][0-9]*$/;
    if (patrn.exec(value) == null || value == "") {
        return false;
    } else {
        return true;
    }
};
function trim(str) {
  return str.replace(/(^\s+)|(\s+$)/g, "");
}