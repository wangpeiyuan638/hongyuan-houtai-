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
		modiImg:'',
		ID: '',	//记录编辑的id
		status: '',
		imgUrlOne: '',
		imgUrlTwo: '',
		topage: '',
		URL:'',
		flag: true
		
	},
	watch: {
		nowpage: function(newpage, oldpage) {
			this.ajaxs(newpage);
		},
		flag: function(newflag,oldflag){
			return newflag;
		}
	},
	methods: {
		ajaxs: function(page) {
			let vm = this;
			let mydata = {"page": page,"limit": 10};
			console.log(mydata);
			$.ajax({
				type: "post",
				url: getIp() + "train/banner/list",
				data: mydata,
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				xhrFields: {
					withCredentials: true
				},
				success: function(res) {
					res = verifyCode(res);
					console.log(res);
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
			if(verifyRoot(12)){
				return;
			};
			//点击新增，弹窗
			this.isadd = true;
			this.ismodify = false;
		},
		add() {
			
			let vm = this;
			//确定增加文本类请求
			var bannername = $("#banner-name").val();
			var bannerplace = $("#banner-place option:selected").html();
//			var bannersort = $("#banner-sort").val();
			var content = {
				iName: bannername,
				type: bannerplace,
				sort: 0,
				imgPath: vm.addimg
			}
			var contentup = JSON.stringify(content);
			console.log(contentup);
			//上传文字内容
			$.ajax({
				type: 'POST',
				url: getIp() + "train/banner/save",
				dataType: 'json',
				data: contentup,
				contentType: "application/json",
				xhrFields: {
					withCredentials: true
				},
				data: contentup,
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				success: function(res) {
					res = verifyCode(res);
					console.log(res);
					if(res.code == 0) { //上传成功
						//上传成功之后，需要关闭弹窗，请求一遍列表
						vm.ajaxs(vm.nowpage);
						vm.isadd = false;
						$('#banner-name').val('');
						$('#uploadfile-2').val('');
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
			let vm = this;
			if(verifyRoot(13)){
				return;
			};
			//先请求要修改的内容
			$.ajax({
				type: 'POST',
				url: getIp() + "train/banner/info/" + id,
				xhrFields: {
					withCredentials: true
				},
				contentType: "application/json",
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				success: function(res) {
					res = verifyCode(res);
					//请求成功之后显示修改弹窗
					console.log(res);
					vm.modifyinfo = JSON.parse(res).banner;
					console.log(vm.modifyinfo);
					if(vm.modifyinfo.type == '上面'){
						$('#banner-modplace').find("option").eq(0).prop("selected",true);
						vm.flag = true;
					}else{
						$('#banner-modplace').find("option").eq(1).prop("selected",true);
						vm.flag = false;
					}
					var data = JSON.parse(res);
					vm.ID = data.banner.id;
//					vm.URL = data.banner.imgPath;
					vm.imgUrlTwo = getIp()  + "resources/img/"+data.banner.imgPath;
					if(data.code == 0) {
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
			var vm = this;
			console.log(vm.ID);
			var modname = $("#banner-modname").val();
//			var modsort = $("#banner-modsort").val();
			var modplace = $("#banner-modplace option:selected").html();
			var content = {
				id: vm.ID,
				iName: modname,
				type: modplace,
				sort: 0,
				imgPath: vm.modiImg
			}
			var contentmod = JSON.stringify(content);
			console.log(contentmod);
			$.ajax({
				type: 'POST',
				url: getIp() + 'train/banner/update',
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
					console.log(JSON.parse(data).code);
					if(JSON.parse(data).code == 0) { //上传成功
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
			//删除
			if(verifyRoot(14)){
				return;
			};
			let vm = this;
			let arr = [id];
			console.log(JSON.stringify(arr));
			//先请求要修改的内容
			var confir = confirm('你确定要删除这条信息吗？');
			console.log(confir);
			if(confir){
				$.ajax({
					type: 'POST',
					url: getIp() + 'train/banner/delete',
					data:JSON.stringify(arr),
					dataType: 'json',
					contentType: "application/json",
					xhrFields: {
						withCredentials: true
					},
					beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
					success: function(data) {
						data = verifyCode(data);
						console.log(data);
						if(data.code == 0){
							vm.ajaxs(vm.nowpage);
						}
						//请求成功之后显示修改弹窗
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
				url: getIp() + 'train/banner/isShow/' + id,
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
					if(JSON.parse(res).code == 1){
						vm.ajaxs(vm.nowpage);
						alert(JSON.parse(res).msg);
					}
				},
				error: function(data) {
					console.log(data);
				},
			});
		},
		// 上传图片
		upload(){
			$("#addImage").bind("submit", function(){
				if($("#uploadfile-2").val() == ""){
					alert("请上传图片");
					return false;
				}
	        });
			var that = this;
			$("#addImage").ajaxForm(function (res) {
	            that.addimg = JSON.parse(res).path;
	            that.imgUrlOne = getIp()  + "resources/img/"+that.addimg;
	            console.log(that.imgUrlOne);
	        });
		},
		modiupload(){
			var that = this;
			$("#modiImage").ajaxForm(function (res) {
				console.log(res);
	            that.modiImg = JSON.parse(res).path;
	            that.imgUrlTwo = getIp()  + "resources/img/"+that.modiImg;
	            console.log(that.imgUrlTwo);
	        });
		},
		change(){
			if($("#banner-place option:selected").html() == '上面'){
				this.flag = true;
				console.log('shangmian')
			}else{
				this.flag = false;
				console.log('xia')
			}
		},
		modychange(){
			if($("#banner-modplace option:selected").html() == '上面'){
				this.flag = true;
				console.log('shangmian')
			}else{
				this.flag = false;
				console.log('xia')
			}
		}
	},
	mounted: function() {
		this.upload();
		this.modiupload();
		this.ajaxs(1); //获取当前列表
	}
});