/*
 *修改密码js
 * */
$(function(){
	var count = sessionStorage.getItem('count');
	console.log(count);
	$('#account').val(count);
})

$("#submit").click(function () {
	var account = $("#account").val();
	var psw = $("#psw").val();
	var newpsw = $("#newpsw").val();
	var okpsw = $("#okpsw").val();
	var tip = $("#modifytip");
	
	
	if (account==''||psw==''||newpsw==''||okpsw=="") {
		tip.text("输入框不能为空");
		return;
	} else if(newpsw != okpsw){
		tip.text("重新确认新密码");
		$("#okpsw").focus();
		return;
	}
	var mydata = {"oldPass": psw,"newPass": newpsw};
	$.ajax({
		type:"get",
		url: getIp()+"train/user/updatePass",
		async:true,
		beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
		data: mydata,
		success:function(res){
			alert('密码修改成功');
			window.location.href = 'welcome.html';
		},
		error:function (err) {
			
		}
	});
	
});
