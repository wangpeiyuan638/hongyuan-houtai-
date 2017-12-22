new Vue({
	el: '#app',
	data: {
		Path:'',
		imgUrlPath:'',
		imageFrom:getIp() + 'train/upload/img',
		inform:{}
	},
	methods: {
		ajaxs(){
			let vm = this;
			$.ajax({
				type: "post",
				url: getIp() + "train/leaguemembers/info/1",
				contentType: "application/json",
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				xhrFields: {
					withCredentials: true
				},
				success: function(res) {
					vm.inform = JSON.parse(res).leagueMembers;
					console.log(vm.inform);
					document.getElementsByTagName("iframe")[0].contentWindow.document.body.innerHTML = vm.inform.richText;
					vm.imgUrlPath = getIp()  + "resources/img/"+vm.inform.imgPath;
					vm.Path = vm.inform.imgPath;
				},
				error: function(err) {
					console.log(err)
				}
			});
		},
		mody(){
			if(verifyRoot(13)){
				return;
			};
			let vm = this;
			if($('#uploadfile-2').val()){
				var Path = vm.Path;
			}else{
				var Path = '';
			}
			let content = $('#content').val();
			let richText = $(document.getElementsByTagName("iframe")[0].contentWindow.document.body).html();
			let mydata = JSON.stringify({"imgPath":Path,"content":content,"richText":richText,"id":1});
			console.log(mydata);
			$.ajax({
				type: "post",
				url: getIp() + "train/leaguemembers/update",
				contentType: "application/json",
				data: mydata,
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				xhrFields: {
					withCredentials: true
				},
				success: function(res) {
					alert('修改成功');
				},
				error: function(err) {
					console.log(err)
				}
			});
		},
		upload(){
			var vm = this;
			$("#addImage").ajaxForm(function (res) {
				alert('成功');
				console.log(res);
	            vm.Path = JSON.parse(res).path;
	            vm.imgUrlPath = getIp()  + "resources/img/"+vm.Path;
	            console.log(vm.imgUrlPath);
	        });
		}
	},
	mounted: function() {
		this.ajaxs();
		this.upload();
	}
});