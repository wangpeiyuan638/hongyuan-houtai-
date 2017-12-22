/**
 * 登录js
 * 
 * */
getCode();
function getCode() {
	var timestamp = new Date().getTime();  
	$("#qrcode").attr("src",getIp()+"train/user/captcha?"+timestamp)
}
	$.ajax({
		type: "post",
		url: getIp()+"train/back/q",
		xhrFields: {
			withCredentials: true
		},
		success: function(res) {
			console.log(res);
		},
		error: function(err) {
			getCode(); //重新获取验证码
			console.log(err)
		}
	});
		
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
		url: getIp()+"train/backstudent/login",
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
//			window.sessionStorage.setItem('token',logininfo.token);
			if(logininfo.code == '0') {
//				var userinfo = JSON.stringify(logininfo);
				var students = JSON.stringify(logininfo);
				console.log(students);
				sessionStorage.setItem('student',students);
				location.href = 'student-index.html';
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