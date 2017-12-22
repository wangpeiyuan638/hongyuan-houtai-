
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
		addvideo: '',
		modyimg:'',
		modyvideo:'',
		ID:'',
		add_video_show:true,
		add_connect_show:false,
		exit_video_show:true,
		exit_connect_show:false,
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
		ajaxs:function(page) {
			//请求列表
			let vm = this;
			$.ajax({
				type: "post",
				url: getIp() + "train/video/list",
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
					res = verifyCode(res);
					console.log(res);
					var data = JSON.parse(res);
					console.log(data);
					if(data.code == 0) {
						vm.list = data.page.list;//列表
						vm.pagesize = data.page.totalPage;//页码总数
					}
				},
				error: function(err) {
					console.log(err)
				}
			});
		},
		add_show_status(){
			//辅助增加显示的方法
			if($('#add_upload_status option:selected').val()=='0'){
				this.add_video_show=true;
				this.add_connect_show=false;
			}else{
				this.add_video_show=false;
				this.add_connect_show=true;
			}
		},
		exit_show_status(){
			//辅助修改显示的方法
			if($('#exit_upload_status option:selected').val()=='0'){
				this.exit_video_show=true;
				this.exit_connect_show=false;
			}else{
				this.exit_video_show=false;
				this.exit_connect_show=true;
			}
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
			if(verifyRoot(21)){
				return;
			};
			//点击新增，弹窗
			this.isadd = true;
			this.ismodify = false;
		},
		add() {
			let vm = this;
				//确定增加文本类请求
				var  title = $("#coachname").val();
//				var  Link = $("#coachaddress").val();
//				var  sort = $('#coachaddress').val();
//				var  imgPath = $("#coachaddress").val();
//				var  videoPath = $("#coachaddress").val();
				var  upload_status = $("#add_upload_status").val();
				var  connect = $("#add_connect").val();
				
				var video = vm.addvideo;
				if(upload_status==1){
					video = "";
					if(connect.length==0){
						layer.msg('上传视频不能为空!', {
							icon: 1,
							time: 2000
						});
					}
				}else{
					connect = "";
					if(video.length==0){
						layer.msg('上传视频不能为空!', {
							icon: 1,
							time: 2000
						});
					}
				}
				
				var content = {
					title: title,
					sort: 0,
					imgPath: vm.addimg,
					videoPath: video,
					videoPath: video,
					ilink: connect
				}
				var contentup = JSON.stringify(content);
				console.log(contentup);
				//上传文字内容
				$.ajax({
					type: 'POST',
					url: getIp() + "train/video/save",
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
							$("#coachname").val('');
							$("#uploadfile1").val('');
							$("#uploadfile2").val('');
							$("#uploadfile3").val('');
							vm.addimg = '';
							vm.addvideo = '';
							vm.imgUrlOne = '';
						}
					},
					error: function(data) {
						console.log(data.msg);
					},
				});
		},
		modifythis(id) {
			if(verifyRoot(22)){
				return;
			};
			//点击修改
			let vm = this;
			//先请求要修改的内容
			$.ajax({
				type: 'POST',
				url: getIp() + "train/video/info/" + id,
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(data) {
					data = verifyCode(data);
					console.log(data);
					dates = JSON.parse(data);	
					vm.modifyinfo = dates.video;
					if(dates.video.ilink==null||dates.video.ilink.length==0){
						$("#exit_upload_status").val(0);
						$("#hidden_video_show").val(dates.video.videoPath);
						$("#exit_connect").val("");
						vm.exit_video_show=true;
						vm.exit_connect_show=false;
					}else{
						$("#exit_upload_status").val(1);
						$("#exit_connect").val(dates.video.ilink);
						$("#hidden_connect_show").val(dates.video.ilink);
						$("#hidden_video_show").val("");
						vm.exit_video_show=false;
						vm.exit_connect_show=true;
					}
					vm.ID = dates.video.id;
					vm.imgUrlTwo = getIp() + "resources/img/"+vm.modifyinfo.imgPath;
					console.log(vm.modifyinfo.imgPath);
					//请求成功之后显示修改弹窗
					if(dates.code == 0) {
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
			var title = $("#videoname").val();
//			var Link = $("#videoaddress").val();
//			var sort = $("#videoaddress").val();

			var  upload_status = $("#exit_upload_status").val();
			var  connect = $("#exit_connect").val();
			
			var  hidden_video_show = $("#hidden_video_show").val();
			var  hidden_connect_show = $("#hidden_connect_show").val();
			
			var video = vm.modyvideo;
			if(upload_status==0){
				connect = "";
			}else{
				video = "";
				if(hidden_connect_show==connect){
					connect = "";
				}
			}

			var modycontent = {
				id: vm.ID,
				title: title,
				sort: 0,
				imgPath: vm.modyimg,
				videoPath: video,
				ilink: connect
			}
			var contentmod = JSON.stringify(modycontent);
			console.log(contentmod);
			$.ajax({
				type: 'POST',
				url: getIp() + 'train/video/update',
				contentType:"application/json",
				data:contentmod,
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(data) {
					console.log(data);
					data = verifyCode(data);
					var uploadinfo = JSON.parse(data);
					console.log(uploadinfo);
					if(uploadinfo.code == 0){//上传成功
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
			if(verifyRoot(23)){
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
					url: getIp() + 'train/video/delete',
					dataType: 'json',
					data:JSON.stringify(arr),
					contentType:"application/json",
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
				url: getIp() + 'train/video/isShow/' + id,
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(res) {
					res = verifyCode(res);
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
			var indexLayer;
			$("#addImage").bind("submit", function(){
				if($("#uploadfile1").val() == ""){
					layer.msg('请选择图片!', {
						icon: 1,
						time: 1500
					});
				}else{
					indexLayer = layer.load(1, {
					    shade: [0.1,'#fff'], //0.1透明度的白色背景
					    time: 10*1000
					});
				}
				
			});
			
			var that = this;
			$("#addImage").ajaxForm(function (res) {
				layer.close(indexLayer);
				layer.msg('图片上传成功!', {
					icon: 1,
					time: 1500
				});
	            that.addimg = JSON.parse(res).path;
	            that.imgUrlOne = getIp()  + "resources/img/"+that.addimg;
	            console.log(that.imgUrlOne);
	        });
		},
		//新增上传视频
		uploadvideo(){
			var indexLayer;
			$("#addvideo").bind("submit", function(){
				if($("#uploadfile2").val() == ""){
					layer.msg('请选择视频!', {
						icon: 1,
						time: 1500
					});
				}else{
					indexLayer = layer.load(1, {
					    shade: [0.1,'#fff'], //0.1透明度的白色背景
					    time: 10*1000
					});
				}
			});
	        var that = this;
			$("#addvideo").ajaxForm(function (res) {
				layer.close(indexLayer);
				layer.msg('视频上传成功!', {
					icon: 1,
					time: 1500
				});
	            that.addvideo = JSON.parse(res).path;
	            console.log(that.addvideo);
	        });
		},
		//编辑页面上传图片
		modyupload(){
			var indexLayer;
			$("#modyImage").bind("submit", function(){
				if($("#uploadfile3").val() == ""){
					layer.msg('请选择图片!', {
						icon: 1,
						time: 1500
					});
				}else{
					indexLayer = layer.load(1, {
					    shade: [0.1,'#fff'], //0.1透明度的白色背景
					    time: 10*1000
					});
				}
			});
			var that = this;
			$("#modyImage").ajaxForm(function (res) {
				layer.close(indexLayer);
				layer.msg('图片修改成功!', {
					icon: 1,
					time: 1500
				});
	            that.modyimg = JSON.parse(res).path;
	            that.imgUrlTwo = getIp()  + "resources/img/"+that.modyimg;
	            console.log(that.imgUrlTwo);
	        });
		},
		//编辑页面上传视频
		modyuploadvideo(){
			var indexLayer;
			$("#modyvideo").bind("submit", function(){
				if($("#uploadfile4").val() == ""){
					layer.msg('请选择视频!', {
						icon: 1,
						time: 1500
					});
				}else{
					indexLayer = layer.load(1, {
					    shade: [0.1,'#fff'], //0.1透明度的白色背景
					    time: 10*1000
					});
				}
			});
			var that = this;
			$("#modyvideo").ajaxForm(function (res) {
				layer.close(indexLayer);
				layer.msg('视频修改成功!', {
					icon: 1,
					time: 1500
				});
	            that.modyvideo = JSON.parse(res).path;
	            console.log(that.modyvideo);
	        });
		}
	},
	mounted: function() {
		this.ajaxs(1); //获取当前列表
		this.upload();
		this.uploadvideo();
		this.modyupload();
		this.modyuploadvideo();
	}
});