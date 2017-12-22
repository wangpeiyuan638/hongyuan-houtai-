/**
 * 管理员账号
 * */
//展开项默认隐藏
new Vue({
	el: '#app',
	data: {
		pagesize: 0,
		nowpage: 1,
		imageFrom:getIp() + 'train/upload/img',
		qrPathOne: '',
		imgUrlOne :'',
		isadd: false,
		ismodify: false,
		ID: '',	
		adminlist: [],
		povers: []
	},
	watch: {
		nowpage: function(newpage, oldpage) {
			this.search_admin(newpage);
		}
	},
	methods: {
		xiala() {
			let vm = this;
			$.ajax({
				type: 'POST',
				url: getIp() + "train/menu/all",
				beforeSend: function(xhr) {
		            xhr.setRequestHeader("token",sessionStorage.getItem("token"));
		        },
				dataType: 'json',
				success: function(data) {
					data = verifyCode(data);
					console.log(data);
					//var data = JSON.parse(data);
					console.log(data);
					if(data.code == 0) {
						var arr1 = [];
						for(var i = 0;i<data.data.length;i++){						
							if(data.data[i].type==0){
								var arr2 = [];
								for(var j = 0;j<data.data.length;j++){
									if(data.data[j].type==2){
										if(data.data[i].menuId==data.data[j].parentId){
											var Jurisdiction = {"menuId":data.data[j].menuId,"name":data.data[j].name,"parentId":data.data[j].parentId,"perms":data.data[j].perms,"type":data.data[j].type}
											arr2.push(Jurisdiction);
										}
									}
								}
								var pover1 = {"menuId":data.data[i].menuId,"name":data.data[i].name,"parentId":data.data[i].parentId,"perms":data.data[i].perms,"type":data.data[i].type,"povers":arr2}
								arr1.push(pover1);
							}
						}
						vm.povers = arr1;
						console.log(arr1);
					}
					//查询结果渲染到页面上
				},
				error: function(data) {
					console.log(data.msg);
				},
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
		search_admin(page) {
			let vm = this;
			var val = $("#search").val();
			$.ajax({
				type: 'POST',
				url: getIp() + "train/user/list",
				beforeSend: function(xhr) {
		            xhr.setRequestHeader("token",sessionStorage.getItem("token"));
		        },
				dataType: 'json',
				data: {"page": page,"limit": 10,"sidx":"create_time","order":"desc"},
				success: function(data) {
					data = verifyCode(data);
					console.log(data);
					if(data.code == 0) {
						vm.adminlist = data.page.list; //列表
						vm.pagesize = data.page.totalPage; //页码总数
					}
					//查询结果渲染到页面上
				},
				error: function(data) {
					console.log(data.msg);
				},
			});
		},
		admin_role_add() {
			this.admin_empty_edit();
			this.isadd = true;
			let vm = this;
			if(!vm.ismodify){
				vm.modifysave();
				vm.ismodify=true;
			}
		},
		addsave() {
			let vm = this;
			//管理员信息
			var qrPathOne = vm.qrPathOne;
			var hidden_id = $("#hidden_id").val();
			var hidden_addpsw = $("#hidden_addpsw").val();
			var addaccount = $("#addaccount").val();
			var addpsw = $("#addpsw").val();
			var addaccountclass = $("#addaccountclass").val();
			
			var hidden_addImageOne = $("#hidden_addImageOne").val();
			var addphone = $("#addphone").val();
			var addaddress = $("#addaddress").val();
			//管理员权限列表
			var povers = [
//				{
//					name:"后台管理",
//					issee:true,
//					issearch:true,
//					isadd:true,
//					ismodify:true,
//					isdelete:true
//				}
			]
			for(var i = 0;i<$("#add-admin .control-col").length;i++){
				if($(".control-col .title label").eq(i).find("input").is(':checked')){
					console.log($(".control-col .title label").eq(i).find("input").val());
					povers.push(Number($(".control-col .title label").eq(i).find("input").val()));
				}
				var pover = {};
				pover.name = $(".control-col").eq(i).find(".title .title-name").text();
				for(var j=0;j<$(".control-col").eq(i).find(".control-sel label").length;j++){
					if($(".control-col").eq(i).find(".control-sel label").eq(j).find("input").is(':checked')){
						console.log($(".control-col").eq(i).find(".control-sel label").eq(j).find("input").val());
						
						povers.push(Number($(".control-col").eq(i).find(".control-sel label").eq(j).find("input").val()));
					}
				}
			}
			
			var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
			
			if (addaccount.length == 0) { 
				alert("登录名不能为空!"); 
				return ;
			};
			if (addpsw.length == 0) { 
				alert("登录密码不能为空!"); 
				return ;
			};
			if (addaccountclass.length == 0) { 
				alert("账号类型不能为空!"); 
				return ;
			};
			if (addphone.length == 0) { 
				alert("手机号码不能为空!"); 
				return ;
			};
			if(!myreg.test(addphone)) { 
			    alert('请输入有效的手机号码！'); 
			    return ; 
			} ;
			if (addaddress.length == 0) { 
				alert("家庭住址不能为空!"); 
				return ;
			};
			var content = {
				address: addaddress,
				menuId: povers,
				mobile: addphone,
				type: addaccountclass,
				username: addaccount,
			}
			if(addpsw != hidden_addpsw){
				var passwords = {password: addpsw};
				content = Object.assign(passwords, content);
			};
			if(qrPathOne != hidden_addImageOne){
				var qrPathOnes = {imgPath: qrPathOne};
				content = Object.assign(qrPathOnes, content);
			};
			console.log(content);
			//发出请求
			if(hidden_id != ""){
				var hidden_ids = {id: hidden_id};
				content = Object.assign(hidden_ids, content);
				var contentup = JSON.stringify(content);
				console.log(contentup);
				$.ajax({
					type: 'POST',
					url: getIp() + 'train/user/update',
					beforeSend: function(xhr) {
			            xhr.setRequestHeader("token",sessionStorage.getItem("token"));
			        },
					dataType: 'json',
					data: contentup,
					contentType: "application/json",
					success: function(data) {
						data = verifyCode(data);
						console.log(data);
						//$(obj).parents("tr").remove();
						vm.isadd = false;
						if(data.code == 0){
							layer.msg('修改成功!', {
								icon: 1,
								time: 2000
							});
							var userinfo = sessionStorage.getItem("hongyuan");
							var logininfos = JSON.parse(userinfo);
							if(logininfos.data.id==hidden_id){
								window.parent.location.href= 'login.html';
							}
							vm.search_admin(1);
						}else{
							layer.msg(data.msg, {
								icon: 1,
								time: 2000
							});
							vm.search_admin(1);
						}
					},
					error: function(data) {
						console.log(data.msg);
					},
				});
			}else{
				var contentup = JSON.stringify(content);
				$.ajax({
					type: 'POST',
					url: getIp() + 'train/user/save',
					beforeSend: function(xhr) {
			            xhr.setRequestHeader("token",sessionStorage.getItem("token"));
			        },
					dataType: 'json',
					data: contentup,
					contentType: "application/json",
					success: function(data) {
						data = verifyCode(data);
						console.log(data);
						//$(obj).parents("tr").remove();
						vm.isadd = false;
						if(data.code == 0){
							layer.msg('增加成功!', {
								icon: 1,
								time: 2000
							});
							
							vm.search_admin(1);
						}else{
							layer.msg(data.msg, {
								icon: 1,
								time: 2000
							});
							vm.search_admin(1);
						}
						
					},
					error: function(data) {
						console.log(data.msg);
					},
				});
			}
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
		admin_empty_edit() {
			//清除所有渲染数据
			$("#hidden_id").val("");
			$("#hidden_addpsw").val("");
			$("#addaccount").val("");
			$("#addpsw").val("");
			$("#addaccountclass").val("");
			$("#addphone").val("");
			$("#addaddress").val("");
			$(".propertyset .control-col").find("input:checkbox").prop("checked", false);
			$(".propertyset .control").find("input:checkbox").prop("checked", false)
		},
		admin_role_edit(id) {
			this.admin_empty_edit();
			let vm = this;
			if(!vm.ismodify){
				vm.modifysave();
				vm.ismodify=true;
			}
			
			$.ajax({
					type: 'POST',
					url: getIp() + "train/user/info/"+id,
					beforeSend: function(xhr) {
			            xhr.setRequestHeader("token",sessionStorage.getItem("token"));
			        },
					dataType: 'json',
					success: function(data) {
						data = verifyCode(data);
						console.log(data);
						if(data.code==0){
							$("#hidden_id").val(data.user.id);
							$("#hidden_addpsw").val(data.user.password);
							
							vm.qrPathOne=data.user.imgPath;
							vm.imgUrlOne=getIp() + "resources/img/"+vm.qrPathOne;
							$("#hidden_addImageOne").val(data.user.imgPath);
							$("#addaccount").val(data.user.username);
							$("#addpsw").val(data.user.password);
							$("#addaccountclass").val(data.user.type);
							$("#addphone").val(data.user.mobile);
							$("#addaddress").val(data.user.address);
							//查询结果渲染到页面上
							$.ajax({
								type: 'POST',
								url: getIp() + "train/user/menu/"+id,
								beforeSend: function(xhr) {
						            xhr.setRequestHeader("token",sessionStorage.getItem("token"));
						        },
								dataType: 'json',
								success: function(data) {
									data = verifyCode(data);
									console.log("123");
									console.log(data);
									if(data.code==0){
										for(var i = 0;i<$("#add-admin .control-col").length;i++){
											for(var k1 = 0; k1<data.data.length ; k1++){
												console.log();
												if($(".control-col .title label").eq(i).find("input").val()==data.data[k1]){
													$(".control-col .title label").eq(i).find("input").prop("checked", true);
													//$(".control-col").eq(i).find(".control-sel label").find("input:checkbox").prop("checked", true)
												}
											}
											for(var j=0;j<$(".control-col").eq(i).find(".control-sel label").length;j++){
												for(var k = 0; k<data.data.length ; k++){
													if($(".control-col").eq(i).find(".control-sel label").eq(j).find("input").val()==data.data[k]){
														$(".control-col").eq(i).find(".control-sel label").eq(j).find("input").prop("checked", true);
													}
												}
											}
										}		
										//查询结果渲染到页面上
									}else{
										alert(data.msg);
									}
								},
								error: function(data) {
									console.log(data.msg);
								},
							});
							
							
						}else{
							alert(data.msg);
						}
					},
					error: function(data) {
						console.log(data.msg);
					},
			});
			this.isadd = true;
		},
		modifysave() {
			$(".propertyset .control input:checkbox").click(function() {
				//全选
				$(".propertyset .control-col").find("input:checkbox").prop("checked", $(this).prop("checked"));
			});
			$(".propertyset .control-col .title input:checkbox").click(function() {
				//二级全选
				$(this).parent().parent().parent().find(".control-sel input:checkbox").prop("checked", $(this).prop("checked"));
			});
			//全部展开收起
			$(".propertyset .control .expand-all").click(function() {
				if($(this).text() == '全部展开') {
					$(this).text("全部收起");
					$(this).parent().parent().find(".control-col .title span").removeClass("Hui-iconfont-arrow2-bottom").addClass("Hui-iconfont-arrow2-top")

					$(this).parent().parent().find(".control-col .control-sel").slideDown();
				} else {
					$(this).text("全部展开");
					$(this).parent().parent().find(".control-col .title span").removeClass("Hui-iconfont-arrow2-top").addClass('Hui-iconfont-arrow2-bottom')
					$(this).parent().parent().find(".control-col .control-sel").slideUp();
				}
			});
			//单个展开收起
			$(".propertyset .control-col .title span").click(function() {
				if($(this).hasClass("Hui-iconfont-arrow2-bottom")) {
					$(this).removeClass("Hui-iconfont-arrow2-bottom").addClass("Hui-iconfont-arrow2-top");
					$(this).parent().parent().find(".control-sel").slideDown();
				} else {
					$(this).removeClass("Hui-iconfont-arrow2-top").addClass("Hui-iconfont-arrow2-bottom");
					$(this).parent().parent().find(".control-sel").slideUp();
				}
			});
		},
		hide() {
			//隐藏
			this.isadd = false;
			//this.ismodify = false;
		},
		admin_role_del(id) {
			let vm = this;
			var povers = [];
			povers.push(id);
			var contentup = JSON.stringify(povers);
			layer.confirm('角色删除须谨慎，确认要删除吗？', function(index) {
				$.ajax({
					type: 'POST',
					url: getIp() + "train/user/delete",
					beforeSend: function(xhr) {
			            xhr.setRequestHeader("token",sessionStorage.getItem("token"));
			        },
					data: contentup,
					dataType: 'json',
					contentType: "application/json",
					success: function(data) {
						//$(obj).parents("tr").remove();
						data = verifyCode(data);
						if(data.code == 0){
							layer.msg('已删除!', {
								icon: 1,
								time: 2000
							});
							vm.search_admin(1);
						}else{
							layer.msg(data.msg, {
								icon: 1,
								time: 2000
							});
						}
						
					},
					error: function(data) {
						console.log(data.msg);
					},
				});
			});
			this.search_admin(1);
		}
	},
	mounted: function() {
		this.xiala(); //下拉监听
		this.search_admin(1);
		this.uploadOne();
	},
	filters: {
		numthree: function(num) {
			if(num < 10) {
				return "00" + num;
			} else if(num >= 10 && num < 100) {
				return "0" + num;
			} else {
				return num;
			}
		},
		timetran: function(num) {
			var now = new Date(num * 1000);
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var date = now.getDate();
			return year + "/" + month + "/" + date;
		}
	}
});