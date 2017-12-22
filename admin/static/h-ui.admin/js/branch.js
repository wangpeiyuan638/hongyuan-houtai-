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
			let sheng = $('#sheng').val();
			let shi = $('#shi').val();
			let qu = $('#qu').val();
			
			let mydata = {"page": page,"limit": 10};
			
			if(iname != null && iname.length!=0){
				mydata = Object.assign({"iname":iname}, mydata);
			}
			if(sheng != null && sheng.length!=0){
				mydata = Object.assign({"province":sheng}, mydata);
			}
			if(shi != null && shi.length!=0){
				mydata = Object.assign({"city":shi}, mydata);
			}
			if(qu != null && qu.length!=0){
				mydata = Object.assign({"distric":qu}, mydata);
			}
			
			console.log(mydata);
			$.ajax({
				type: "post",
				url: getIp() + "train/school/list",
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
			let sheng = $('#sheng').val();
			let shi = $('#shi').val();
			let qu = $('#qu').val();
			
			var data = {"page": page,"limit": 10};
			
			if(iname.length!=0){
				data = Object.assign({"iname":iname}, data);
			}
			if(sheng.length!=0){
				data = Object.assign({"province":sheng}, data);
			}
			if(shi.length!=0){
				data = Object.assign({"city":shi}, data);
			}
			if(qu.length!=0){
				data = Object.assign({"distric":qu}, data);
			}
			
			/*let mydata = {"page": page,"limit": 10,"iname": iname,"province":sheng,"city":shi,"distric":qu,};
			console.log(data);*/
			$.ajax({
				type: "post",
				url: getIp() + "train/school/list",
				data: data,
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
			var iname = $("#schoolname").val();
			var province = $("#province option:selected").val();
			var city = $("#city option:selected").val();
			var distric = $("#area option:selected").val();
			var address = $("#schooladdress").val();
			
			if (iname.length == 0) {
				alert("学校名称不能为空!"); 
				return ;
			};
			if (province.length == 0) {
				alert("省份不能为空!"); 
				return ;
			};
			if (city.length == 0) {
				alert("市不能为空!"); 
				return ;
			};
			if (distric.length == 0) {
				alert("区不能为空!"); 
				return ;
			};
			if (address.length == 0) {
				alert("详细地址不能为空!"); 
				return ;
			};
			
			
			
			
			var content = {
				iname: iname,
				province: province,
				city: city,
				distric: distric,
				address: address,
			}
			var contentup = JSON.stringify(content);
			console.log(contentup);
			//上传文字内容
			$.ajax({
				type: 'POST',
				url: getIp() + "train/school/save",
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
					
					if( typeof res === 'object' ) {
					}else{
						var res = JSON.parse(res);
					}
					if(res.code==0){
						layer.msg('增加成功!', {
							icon: 1,
							time: 2000
						});
					}else{
						layer.msg(res.msg, {
							icon: 1,
							time: 2000
						});
					}
					vm.ajaxs(vm.nowpage);
						vm.isadd = false;
					
					
					
					
					
					
					/*if(res.code == 0) { //上传成功
						//上传成功之后，需要关闭弹窗，请求一遍列表
						
					}*/
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
			//先请求要修改的内容
			$.ajax({
				type: 'POST',
				url: getIp() + "train/school/info/" + id,
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
					vm.modifyinfo = JSON.parse(res).school;
					console.log(vm.modifyinfo);
//					$('#province1 option').html() == vm.modifyinfo.province
//					$('#province1 option:contains(' + vm.modifyinfo.province + ')').each(function(){
//					  if ($(this).text() == vm.modifyinfo.province) {
//					     $(this).attr('selected', true);
//					  }
//					});	
//					$('#city1 option:contains(' + vm.modifyinfo.city + ')').each(function(){
//					  if ($(this).text() == vm.modifyinfo.city) {
//					     $(this).attr('selected', true);
//					  }
//					});
//					$('#area1 option:contains(' + vm.modifyinfo.distric + ')').each(function(){
//					  if ($(this).text() == vm.modifyinfo.distric) {
//					     $(this).attr('selected', true);
//					  }
//					});

					var province = document.getElementById('province1');
					var city = document.getElementById('city1');
					var county = document.getElementById('area1');
					
					$("#province1").val(vm.modifyinfo.province);
					province.onchange();
					
					
					$("#city1").val(vm.modifyinfo.city);
					city.onchange();
					
					$("#area1").val(vm.modifyinfo.distric);
					
					var data = JSON.parse(res);
					vm.ID = data.school.id;
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
			var iname = $("#schoolname1").val();
			var province = $("#province1 option:selected").val();
			var city = $("#city1 option:selected").val();
			var distric = $("#area1 option:selected").val();
			var address1 = $("#schooladdress1").val();
			if (iname.length == 0) {
				alert("学校名称不能为空!"); 
				return ;
			};
			if (province.length == 0) {
				alert("省份不能为空!"); 
				return ;
			};
			if (city.length == 0) {
				alert("市不能为空!"); 
				return ;
			};
			if (distric.length == 0) {
				alert("区不能为空!"); 
				return ;
			};
			if (address1.length == 0) {
				alert("详细地址不能为空!"); 
				return ;
			};
			
			var modycontent = {
				id: vm.ID,
				address: address1,
				iname: iname,
				province: province,
				city: city,
				distric: distric
			}
			var contentmod = JSON.stringify(modycontent);
			console.log(contentmod);
			$.ajax({
				type: 'POST',
				url: getIp() + 'train/school/update',
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
			//删除
			if(verifyRoot(30)){
				return;
			};
			let vm = this;
			let arr = [id];
			console.log(JSON.stringify(arr));
			//先请求要修改的内容
			layer.confirm('分校删除须谨慎，确认要删除吗？', function(index) {
				$.ajax({
					type: 'POST',
					url: getIp() + 'train/school/delete',
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
						}
						
						/*if(data.code == 0){
							vm.ajaxs(vm.nowpage);
						}*/
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