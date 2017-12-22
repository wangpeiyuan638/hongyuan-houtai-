new Vue({
	el: '#app',
	data: {
		imageFrom:getIp() + 'train/upload/img',
		isadd: false,
		ismodify: false,
		list: [],
		pagesize: 0,
		nowpage: 1,
		modifyinfo: {},
		addimg:'',
		modyimg:'',
		ID:'',
		imgUrlOne: '',
		imgUrlTwo: '',
		topage:''
	},
	watch: {
		nowpage: function(newpage, oldpage) {
			this.ajaxs(newpage);
		}
	},
	methods: {
		ajaxs: function(page) {
			//请求列表
			let vm = this;
			$.ajax({
				type: "post",
				url: getIp() + "train/club/list",
				data: {
					page: page,
					limit: 10
				},
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				success: function(res) {
					console.log(res);
					res = verifyCode(res);
					var data = JSON.parse(res);
					console.log(data);
					if(data.code == 0) {
						vm.list = data.page.list; //列表
						vm.pagesize = data.page.totalPage; //页码总数
					}
				},
				error: function(err) {
					console.log(err)
				}
			});
		},
		getvalue(){
			var topages = $('#topage').val();
			if(isNumber(topages)){			this.topage = parseInt(topages);
				if(this.topage >this.pagesize){
					this.topage = this.pagesize;
					layer.msg('请输入有效页码!', {
						icon: 1,
						time: 2000
					});
					return;
					//alert('请输入有效页码')
				}
			}else{
				layer.msg('请输入正常数值!', {
					icon: 1,
					time: 2000
				});
				return;
			}
			this.gopage(this.topage);
		},
		gopage(num) {
			//页码控制
			if(num == -1) {
				//上一页
				if(this.nowpage <= 1) {
					return;
				} else {
					this.nowpage--;
				}
			} else if(num == -2) {
				//下一页
				if(this.nowpage >= this.pagesize) {
					return;
				} else {
					this.nowpage++;
				}
			} else {
				this.nowpage = num;
			}
		},
		addnew() {
			//点击新增，弹窗
			if(verifyRoot(12)){
				return;
			};
			this.isadd = true;
			this.ismodify = false;
		},
		add() {
				let vm = this;
				//确定增加文本类请求
				var coursename = $("#clubname").val();
				var courseContent =  $("#txtContent").val();
		        courseContent = courseContent.replace('<br />','/n');
		        console.log(courseContent);
				var content = {
					title: coursename,
					content: courseContent,
					imgPath: vm.addimg
				}
				var contentup = JSON.stringify(content);
				console.log(contentup);
				//上传文字内容
				$.ajax({
					type: 'POST',
					url: getIp() + "train/club/save",
					dataType: 'json',
					data:contentup,
					contentType: "application/json",
					xhrFields: {
						withCredentials: true
					},
					data:contentup,
					beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
					success: function(data) {
						data = verifyCode(data);
//						var uploadinfo = JSON.parse(data);
						console.log(data);
						if(data.code == 0){//上传成功
							//上传成功之后，需要关闭弹窗，请求一遍列表
							vm.ajaxs(vm.nowpage);
							vm.isadd = false;
							$("#clubname").val('');
							$("#txtContent").val('');
							$("#uploadfile-2").val('');
							vm.addimg = '';
							vm.imgUrlOne = '';
						}
					},
					error: function(data) {
						console.log(data.msg);
					},
				});
		},
		modifythis(id) {
			//点击修改
			if(verifyRoot(13)){
				return;
			};
			let vm = this;
			//先请求要修改的内容
			$.ajax({
				type: 'POST',
				url: getIp() + "train/club/info/" + id,
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				success: function(data) {
					data = verifyCode(data);
					console.log(JSON.parse(data));
					vm.modifyinfo = JSON.parse(data).club;
					console.log(vm.modifyinfo);
					vm.ID = JSON.parse(data).club.id;
					console.log(vm.ID);
					vm.imgUrlTwo = getIp() + "resources/img/"+vm.modifyinfo.imgPath;
					//请求成功之后显示修改弹窗
					if(JSON.parse(data).code == 0) {
						vm.isadd = false;
						vm.ismodify = true;
					}
				},
				error: function(data) {
					console.log(data.msg);
				},
			});
		},
		modify() {
			let vm = this;
			//确定修改,改变地方值与其modifyinfo绑定，
			var modyname = $("#name").val();
			var modyContent = $("#modyContent").val();
//			var modimg = $("#uploadfile1").val();
			var content = {
				id: vm.ID,
				title: modyname,
				content: modyContent,
				imgPath: vm.modyimg
			}
			var contentmod = JSON.stringify(content);
			console.log(contentmod);
			$.ajax({
				type: 'POST',
				url: getIp() + 'train/club/update',
				contentType: "application/json",
				data: contentmod,
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				success: function(data) {
					data = verifyCode(data);
					var uploadinfo = JSON.parse(data);
					console.log(uploadinfo);
					if(uploadinfo.code == 0) { //上传成功
						//修改成功之后，需要关闭弹窗，请求一遍列表
						vm.ajaxs(vm.nowpage);
						vm.ismodify = false;
					}
				},
				error: function(data) {
					console.log(data.msg);
				},
			});
		},
		del(id) {
			if(verifyRoot(14)){
				return;
			};
			//删除
			let vm = this;
			let arr = [id];
			console.log(JSON.stringify(arr));
			//先请求要修改的内容
			var confir = confirm('你确定要删除这条信息吗？');
			console.log(confir);
			if(confir){
				$.ajax({
					type: 'POST',
					url: getIp() + 'train/club/delete',
					dataType: 'json',
					data:JSON.stringify(arr),
					contentType: "application/json",
					xhrFields: {
						withCredentials: true
					},
					beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
					success: function(data) {
						data = verifyCode(data);
						//请求成功之后显示修改弹窗
						console.log(data);
						if(data.code == 0){
							vm.ajaxs(vm.nowpage);
						}
					},
					error: function(data) {
						console.log(data.msg);
					},
				});
			}
		},
		hide(num) {
			//隐藏
			this.isadd = false;
			this.ismodify = false;
		},
		isshow(id) {
			let vm = this;
			//先请求要修改的内容
			$.ajax({
				type: 'POST',
				url: getIp() + 'train/club/isShow/' + id,
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				success: function(res) {
					data = verifyCode(res);
					//请求成功之后显示修改弹窗
					console.log(JSON.parse(res));
					if(JSON.parse(res).code == 500){
						vm.ajaxs(vm.nowpage);
						alert(JSON.parse(res).msg);
					}
				},
				error: function(data) {
					console.log(data);
				},
			});
		},
		//新增上传图片
		upload(){
			$("#addImage").bind("submit", function(){
				if($("#uploadfile-2").val() == ""){
					alert("请上传图片");
					return false;
				}
	        });
			var that = this;
			$("#addImage").ajaxForm(function (res) {
				alert('成功');
	            that.addimg = JSON.parse(res).path;
	            that.imgUrlOne = getIp()  + "resources/img/"+that.addimg;
	            console.log(that.imgUrlOne);
	        });
		},
		//编辑页面上传图片
		modyupload(){
			var that = this;
			$("#modyImage").ajaxForm(function (res) {
				alert('成功');
	            that.modyimg = JSON.parse(res).path;
	            that.imgUrlTwo = getIp()  + "resources/img/"+that.modyimg;
	            console.log(that.imgUrlTwo);
	        });
		}
	},
	mounted: function() {
		this.ajaxs(1); //获取当前列表
		this.upload();
		this.modyupload();
	}
});