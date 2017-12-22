new Vue({
	el: '#app',
	data: {
		isadd: false,
		ismodify: false,
		list: [],
		pagesize: 0,
		nowpage: 1,
		modifyinfo: {},
		status: '',
		ID: '',
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
				url: getIp() + "train/summary/list",
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
				success: function(data) {
					data = verifyCode(data);
					 var data = JSON.parse(data);
					console.log(data);
					if(data.code == 0) {
						vm.list = data.page.list;//列表
						console.log(vm.list);
						for(var i = 0;i<vm.list.length;i++){
							if(vm.list[i].isShow == 1){
								vm.status = true;
								console.log(vm.status);
							}else if(vm.list[i].isShow == 0){
								vm.status = false;
								console.log(vm.status);
							}
						}
						
						vm.pagesize = data.page.totalPage;//页码总数
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
		add(){
				let vm = this;
				//确定增加文本类请求
				var schoolname = $("#schoolname").val();
				var addcontent = $("#addcontent").val();
				var txtContent = $(document.getElementsByTagName("iframe")[0].contentWindow.document.body).html();
				var addcontent = {
					title:schoolname,
					content:addcontent,
					richText:txtContent
				}
				var contentup = JSON.stringify(addcontent);
				console.log(contentup);
				//上传文字内容
				$.ajax({
					type: 'POST',
					url: getIp() + "train/summary/save",
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
						console.log(data);
						if(data.code == 0){//上传成功
							//上传成功之后，需要关闭弹窗，请求一遍列表
							vm.ajaxs(vm.nowpage);
							vm.isadd = false;
							$("#schoolname").val('');
							$("#addcontent").val('');
							$(document.getElementsByTagName("iframe")[0].contentWindow.document.body).html('');
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
				url: getIp() + "train/summary/info/" + id,
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(data) {
					data = verifyCode(data);
					vm.modifyinfo = JSON.parse(data).summary;
					console.log(vm.modifyinfo);
					console.log(vm.modifyinfo.content);
					document.getElementsByTagName("iframe")[1].contentWindow.document.body.innerHTML = vm.modifyinfo.richText;
					vm.ID = JSON.parse(data).summary.id;
					console.log(vm.ID);
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
			var vm = this;
			console.log(vm.ID);
			var modyname = $("#modyname").val();
			var addmodycontent = $("#addmodycontent").val();
			var modyContent =  $(document.getElementsByTagName("iframe")[1].contentWindow.document.body).html();;
			var content = {
				id: vm.ID,
				title: modyname,
				content: addmodycontent,
				richText: modyContent
			}
			var contentmod = JSON.stringify(content);
			console.log(contentmod);
			$.ajax({
				type: 'POST',
				url: getIp() + 'train/summary/update',
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
					url: getIp() + 'train/summary/delete',
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
			console.log(id);
			$.ajax({
				type: 'POST',
				url: getIp() + 'train/summary/isShow/' + id,
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(res) {
					res = verifyCode(res);
					//请求成功之后显示修改弹窗
					console.log(JSON.parse(res).code);
					if(JSON.parse(res).code == 500){
						vm.ajaxs(vm.nowpage);
						alert(JSON.parse(res).msg);
					}
				},
				error: function(data) {
					console.log(data);
				},
			});
		}
	},
	mounted: function() {
		this.ajaxs(1); //获取当前列表
	}
});