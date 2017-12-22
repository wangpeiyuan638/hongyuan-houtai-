/**
 * 管理员账号
 * */
//展开项默认隐藏
new Vue({
	el: '#app',
	data: {
		imageFrom:getIp() + 'train/upload/img',
		image :'',
		qrTitleOne :'标题1',
		qrTitleTwo :'标题2',
		qq1: '1231313',
		qq2: '32131313',
		phone1: '12345678901',
		phone2: '11234567890',
		qrPathOne: '11234567890',
		qrPathTwo: '11234567890',
		imgUrlOne :'',
		imgUrlTwo :'',
		address: "广东省广州市"
	},
	methods: {
		onFileChange(e) {
		  var files = e.target.files || e.dataTransfer.files;
		  if (!files.length)
		   return;
		   this.createImage(files[0]);
		  },
		createImage(file) {
		  var image = new Image();
		  var reader = new FileReader();
		  var vm = this;
		 
		  reader.onload = (e) => {
		    vm.image = e.target.result;
		    console.log(e.target.result);
		  };
		    reader.readAsDataURL(file);
		},
		ajaxs() {
			var vm = this;
			//请求数据,绑定到input框里
			$.ajax({
				type: 'POST',
				url: getIp()  + 'train/contactus/info/1',
				beforeSend: function(xhr) {
		            xhr.setRequestHeader("token",sessionStorage.getItem("token"));
		        },
				dataType: 'json',
				success: function(data) {
					data = verifyCode(data);
					console.log(data);
					//成功之后
					if(data.code==0){
						vm.qrTitleOne=data.contactUs.qrTitleOne;
						vm.qrTitleTwo=data.contactUs.qrTitleTwo;
						vm.qq1=data.contactUs.qqOne;
						vm.qq2=data.contactUs.qqTwo;
						vm.phone1=data.contactUs.phoneOne;
						vm.phone2=data.contactUs.phoneTwo;
						vm.address=data.contactUs.address;
						vm.qrPathOne=data.contactUs.qrPathOne;
						$("#hidden_addImageOne").val(data.contactUs.qrPathOne);
						vm.qrPathTwo=data.contactUs.qrPathTwo;
						$("#hidden_addImageTwo").val(data.contactUs.qrPathTwo);
						vm.imgUrlOne=getIp() + "resources/img/"+vm.qrPathOne;
						console.log(vm.imgUrlOne);
						vm.imgUrlTwo=getIp() + "resources/img/"+vm.qrPathTwo;
						console.log(vm.imgUrlTwo);
					}else{
						window.parent.location.href= 'login.html';
					}
					console.log(data);
					
					console.log(data);
				},
				error: function(data) {
					console.log(data.msg);
				},
			});
		},
		//		var obj = new FormData();
		//		obj.append('file',this.refs['file_'+mater].files[0]);//图片
		//		obj.append('orderId',orderobj.id);//文字
		//		upload(obj);
		//上传图片
		contactus() {
			var vm = this;
			//管理员信息
			
			var qrPathOne = vm.qrPathOne;
			var qrPathTwo = vm.qrPathTwo;
			var id = "1";
			var qrTitleOne = $("#qrTitleOne").val();
			var qrTitleTwo = $("#qrTitleTwo").val();
			var qqOne = $("#qq1").val();
			var qqTwo = $("#qq2").val();
			var phoneOne = $("#phone1").val();
			var phoneTwo = $("#phone2").val();
			var address = $("#address").val();
			var hidden_addImageOne = $("#hidden_addImageOne").val();
			var hidden_addImageTwo = $("#hidden_addImageTwo").val();
			
			var content = {
				id: id,
				qrTitleOne: qrTitleOne,
				qrTitleTwo: qrTitleTwo,
				qqOne: qqOne,
				qqTwo: qqTwo,
				phoneOne: phoneOne,
				phoneTwo: phoneTwo,
				address: address
			};
			if(qrPathOne != hidden_addImageOne){
				var qrPathOnes = {qrPathOne: qrPathOne};
				content = Object.assign(qrPathOnes, content);
			};
			if(qrPathTwo != hidden_addImageTwo){
				var qrPathTwos = {qrPathTwo: qrPathTwo};
				content = Object.assign(qrPathTwos, content);
			};
			
			console.log(content);
			var contentup = JSON.stringify(content);
			console.log(contentup);
			//发出请求
			$.ajax({
				type: 'POST',
				url: getIp()  + 'train/contactus/update',
				beforeSend: function(xhr) {
		            xhr.setRequestHeader("token",sessionStorage.getItem("token"));
		        },
				dataType: 'json',
				data: contentup,
				contentType: "application/json",
				success: function(data) {
					data = verifyCode(data);
					console.log(data);
					if(data.code==0){
						alert('成功');
					};
					vm.cancel();
				},
				error: function(data) {
					console.log(data.msg);
				},
			});

		},
		cancel() {
			let vm = this;
			//取消
			vm.ajaxs();
			location.href = 'contact-us.html';
		},
		//新增上传图片
		uploadOne(){
			var vm = this;
			$("#addImageOne").ajaxForm(function (res) {
				alert('成功');
				console.log(res);
	            vm.qrPathOne = JSON.parse(res).path;
	            vm.imgUrlOne = getIp()  + "resources/img/"+vm.qrPathOne;
	            console.log(vm.imgUrlOne);
	        });
		},
		uploadTwo(){
			var vm = this;
			$("#addImageTwo").ajaxForm(function (res) {
				alert('成功');
				console.log(res);
	            vm.qrPathTwo = JSON.parse(res).path;
	            vm.imgUrlTwo = getIp()  + "resources/img/"+vm.qrPathTwo;
	        });
		}
	},
	mounted: function() {
		this.ajaxs();
		this.uploadOne();
		this.uploadTwo();
	}
});