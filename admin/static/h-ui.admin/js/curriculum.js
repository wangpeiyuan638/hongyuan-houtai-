new Vue({
	el: '#app',
	data: {
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
		topage:''
	},
	watch: {
		nowpage: function(newpage, oldpage) {
			this.ajaxs(newpage);
			this.find(newpage);
		}
	},
	methods: {
		ajaxs: function(page) {
			let vm = this;
			let iname = $('#search').val();
			
			let mydata = {"page": page,"limit": 10};
			if(iname.length!=0){
				mydata = Object.assign({"iname":iname}, mydata);
			}
			
			console.log(mydata);
			$.ajax({
				type: "post",
				url: getIp() + "train/curriculum/list",
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
		//查询
		find:function(page){
			let vm = this;
			let iname = $('#search').val();
			
			let mydata = {"page": page,"limit": 10};
			if(iname.length!=0){
				mydata = Object.assign({"iname":iname}, mydata);
			}
			console.log(mydata);
			$.ajax({
				type: "post",
				url: getIp() + "train/curriculum/list",
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
			if(verifyRoot(28)){
				return;
			};
			//点击新增，弹窗
			this.isadd = true;
			this.ismodify = false;
		},
		add() {
			let vm = this;
			//确定增加文本类请求
			var iname = $("#iname").val();
			var classHour = $("#classHour").val();
			var money = $("#money").val();
			var remarks = $("#remarks").val();
			
			if (iname.length == 0) { 
				alert("课程名称不能为空!"); 
				return ;
			};
			if (classHour.length == 0) { 
				alert("课时 不能为空!"); 
				return ;
			}else if(!isNumber(classHour)){
				alert("请输入有效的正整数数值"); 
				return;
			};
			if (money.length == 0) { 
				alert("课时收费不能为空!"); 
				return ;
			}else if(!isNumber(money)){
				alert("请输入有效的正整数数值"); 
				return;
			};
			
			
			var content = {
				iname: iname,
				classHour: classHour,
				money: money,
				remarks: remarks
			}
			var contentup = JSON.stringify(content);
			console.log(contentup);
			//上传文字内容
			$.ajax({
				type: 'POST',
				url: getIp() + "train/curriculum/save",
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
					//var data = JSON.parse(res);
					if(res.code == 0) { //上传成功
						//上传成功之后，需要关闭弹窗，请求一遍列表
						vm.ajaxs(vm.nowpage);
						vm.isadd = false;
					}
				},
				error: function(data) {
					console.log(data.msg);
				},
			});
		},
		modifythis(id) {
			if(verifyRoot(29)){
				return;
			};
			//点击修改
			let vm = this;
			console.log(id);
			//先请求要修改的内容
			$.ajax({
				type: 'POST',
				url: getIp() + "train/curriculum/info/" + id,
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
					vm.modifyinfo = JSON.parse(res).curriculum;
					console.log(vm.modifyinfo);
					var data = JSON.parse(res);
					vm.ID = data.curriculum.curriculumId;
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
			var iname1 = $("#iname1").val();
			var classHour1 = $("#classHour1").val();
			var money1 = $("#money1").val();
			var remarks1 = $("#remarks1").val();
			
			if (iname1.length == 0) { 
				alert("课程名称不能为空!"); 
				return ;
			};
			if (classHour1.length == 0) { 
				alert("课时 不能为空!"); 
				return ;
			}else if(!isNumber(classHour1)){
				alert("请输入有效的正整数数值"); 
				return;
			};
			if (money1.length == 0) { 
				alert("课时收费不能为空!"); 
				return ;
			}else if(!isNumber(money1)){
				alert("请输入有效的正整数数值"); 
				return;
			};
			
			var modycontent = {
				curriculumId: vm.ID,
				iname: iname1,
				classHour: classHour1,
				money: money1,
				remarks: remarks1
			}
			var modycontentup = JSON.stringify(modycontent);
			console.log(modycontentup);
			$.ajax({
				type: 'POST',
				url: getIp() + 'train/curriculum/update',
				contentType: "application/json",
				data: modycontentup,
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				success: function(data) {
					data = verifyCode(data);
					console.log(data);
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
			if(verifyRoot(30)){
				return;
			};
			//删除
			let vm = this;
			let arr = [id];
			console.log(JSON.stringify(arr));
			//先请求要修改的内容
			layer.confirm('课程删除须谨慎，确认要删除吗？', function(index) {
				$.ajax({
					type: 'POST',
					url: getIp() + 'train/curriculum/delete',
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
						if(data.code==0){
							vm.ajaxs(vm.nowpage);
							layer.msg('删除成功!', {
								icon: 1,
								time: 2000
							});
						}else{
							layer.msg(data.msg, {
								icon: 1,
								time: 2000
							});
						};
						
						//请求成功之后显示修改弹窗
					},
					error: function(data) {
						console.log(data.msg);
					},
				});
			});
		},
		hide(num) {
			//隐藏
			this.isadd = false;
			this.ismodify = false;
		}
	},
	mounted: function() {
		this.ajaxs(1); //获取当前列表
	}
});