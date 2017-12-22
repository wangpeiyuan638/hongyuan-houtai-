/**
 * 登录js
 * 
 * */
getCode();
function getCode() {
	var timestamp = new Date().getTime();  
	$("#qrcode").attr("src",getIp()+"train/user/captcha?"+timestamp)
}
document.getElementById("my_button").onclick = function(e) {
	e.preventDefault();//阻止表单默认提交
	
	var username = $("#username").val();
	var psw = $("#psw").val();
	var code = $("#code_input").val();

	

	if(username == '' ) {
		alert("用户名不能为空");
		return;
	}
	if( psw == '' ) {
		alert("密码不能为空");
		return;
	}
	if(code == '') {
		alert("验证码不能为空");
		return;
	}
	$.ajax({
		type: "post",
		url: getIp()+"train/user/login",
		data: {
			userName: username,
			passWord: psw,
			captcha: code
		},
		xhrFields: {
			withCredentials: true
		},
		success: function(res) {
			
			getCode(); //重新获取验证码
			var logininfo = JSON.parse(res);
			console.log(logininfo);
			window.sessionStorage.setItem('token',logininfo.token);
			if(logininfo.code == '0') {
				var userinfo = JSON.stringify(logininfo);
				sessionStorage.setItem("hongyuan", userinfo);
				var username = $('#username').val();
				console.log(username);
				sessionStorage.setItem("count", username);
				location.href = 'index.html';
			} else {
				alert(logininfo.msg);
				return false;
			}

		},
		error: function(err) {
			getCode(); //重新获取验证码
			console.log(err)
		}
	});
}
//回车
$(document).keyup(function(event) {
	if(event.keyCode == 13) {
		$("#my_button").trigger("click");
	}
});