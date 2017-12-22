/**
 * 课程服务
 * */
//展开项默认隐藏
new Vue({
	el: '#app',
	data: {
		pagesize: 0,
		nowpage: 1,
		pagesize1: 0,
		nowpage1: 1,
		studentid:'',
		iname:'',
		number:'',
		selected_schoolId:'',
		selected_sex:'',
		imageFrom:getIp() + 'train/upload/img',
		isshow: false,
		isadd: false,
		ismodify: false,
		iscourseall:false,
		school: [],
		list: [],
		classlist: [],
		imgUrlOne :'',
		qrPathOne:'',
		pover: [{
			name: "后台管理"
		}]
	},
	watch: {
		nowpage1: function(newpage1, oldpage1) {
			var vm = this;
			var id = vm.studentid;
			vm.admin_student_edit(newpage1,id);
		},
		nowpage: function(newpage, oldpage) {
			this.ajax(newpage);
		}
	},
	methods: {
		schoolAjax(){
			//查询学校
			let vm = this;
			$.ajax({
				type: "post",
				url: getIp() + "train/school/all",
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				xhrFields: {
					withCredentials: true
				},
				success: function(res) {
					console.log("++++++++++++++");
					res = verifyCode(res);
					console.log(res);
					var list = JSON.parse(res);
					vm.school = list.data;
//					vm.schoolId = vm.school.id;
//					console.log(vm.school);
				},
				error: function(err) {
					console.log(err)
				}
			})
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
		getvalue1(){
			var topages = $('#topage1').val();
			if(isNumber(topages)){			this.topage1 = parseInt(topages);
				if(this.topage1 >this.pagesize1){
					this.topage1 = this.pagesize1;
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
			this.gopage1(this.topage1);
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
		gopage1(num) {
			//页码控制
			if(num == -1) {
				//上一页
				if(this.nowpage1 <= 1) {
					return;
				} else {
					this.nowpage1--;
				}
			} else if(num == -2) {
				//下一页
				if(this.nowpage1 >= this.pagesize1) {
					return;
				} else {
					this.nowpage1++;
				}
			} else {
				this.nowpage1 = num;
			}
		},
		addnew() {
			if(verifyRoot(28)){
				return;
			};
			//点击新增
			this.isadd = true;
			this.isshow = true;
			this.ismodify = false;
			this.iscourseall = false;
			this.qrPathOne = "";
			$('#schoolId').prop("disabled", false);
			
		},
		modifythis(id) {
			if(verifyRoot(29)){
				return;
			};
			//点击修改
			let vm = this;
			vm.isadd = false;
			vm.ismodify = true;
			vm.isshow = true;
			vm.iscourseall = false;
			//先请求要修改的内容
			$.ajax({
				type: 'POST',
				url: getIp() + "train/backstudent/info/"+id,
				dataType: 'json',
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				success: function(data) {
					data = verifyCode(data);
					//请求成功之后显示修改弹窗
					console.log(data);
					if(data.code==0){
						
						vm.selected_schoolId = data.backStudent.schoolId;
						$('#schoolId').prop("disabled", "disabled");
						vm.selected_sex = data.backStudent.sex;
						
						$("#studentId").val(data.backStudent.studentId) ;
						$("#iname").val(data.backStudent.iname) ;
						//$('#schoolId option:selected').val()
						//$('#schoolId option:selected').val(data.backStudent.schoolId);
						//$("#sex option:selected").val(data.backStudent.sex);
						$("#number").val(data.backStudent.number);
						$("#grade").val(data.backStudent.grade);
						$("#sourceSchool").val(data.backStudent.sourceSchool);
						$("#signUpDate").val(data.backStudent.signUpDate.split(':')[0].split(' ')[0]);
						var headImgPath = vm.qrPathOne;
						vm.qrPathOne = data.backStudent.headImgPath;
						vm.imgUrlOne=getIp() + "resources/img/"+vm.qrPathOne;
						$("#hidden_addImageOne").val(data.backStudent.headImgPath);
						//照片
						$("#birthday").val(data.backStudent.birthday.split(':')[0].split(' ')[0]);
						$("#qq").val(data.backStudent.qq);
						$("#email").val(data.backStudent.email);
						$("#userName").val(data.backStudent.userName);
						$("#pass").val(data.backStudent.pass);
						$("#hidden_addpsw").val(data.backStudent.pass);
						$("#phone").val(data.backStudent.phone);
						$("#sparePhone").val(data.backStudent.sparePhone);
						$("#remarks").val(data.backStudent.remarks);
					}else{
						alert(data.message);
					}
				},
				error: function(data) {
					console.log(data.msg);
				},
			});
		},
		del(id){
			if(verifyRoot(30)){
				return;
			};
			//删除
			let vm = this;
			var povers = [];
			povers.push(id);
			var contentup = JSON.stringify(povers);
			layer.confirm('角色删除须谨慎，确认要删除吗？', function(index) {
				$.ajax({
					type: 'POST',
					url: getIp() + "train/backstudent/delete",
					beforeSend: function(xhr) {
			            xhr.setRequestHeader("token",sessionStorage.getItem("token"));
			        },
					data: contentup,
					dataType: 'json',
					contentType: "application/json",
					success: function(data) {
						data = verifyCode(data);
						if(data.code == 0){
							layer.msg('已删除!', {
								icon: 1,
								time: 2000
							});
						}else{
							layer.msg(data.msg, {
								icon: 1,
								time: 2000
							});
						}
						vm.hide(1);
						vm.search();
					},
					error: function(data) {
						console.log(data.msg);
					},
				});
			});
			this.hide(1);
		},
		hide(num) {
			//隐藏
			this.isshow = false;
			this.iscourseall = false;
			if(num>0){
				//取消
				$("#add-admin").find("input").val("");
				//editor.html("")
				$("#shangchuan").val("上传");
				
			};
			this.search();
		},
		add() {
			let vm = this;
			var iname = $("#iname").val();
			var schoolId = parseInt($('#schoolId option:selected').val());
			var sex = $("#sex option:selected").val();
			var number = $("#number").val();
			var grade = $("#grade").val();
			var sourceSchool = $("#sourceSchool").val();
			var signUpDates = $("#signUpDate").val();
			//照片
			var headImgPath = vm.qrPathOne;
			var birthdays = $("#birthday").val();
			var qq = $("#qq").val();
			var email = $("#email").val();
			var userName = $("#userName").val();
			var pass = $("#pass").val();
			var phone = $("#phone").val();
			var sparePhone = $("#sparePhone").val();
			var remarks = $("#remarks").val();
			
			if (iname.length == 0) { 
				alert("学员姓名不能为空!"); 
				return ;
			};
			if (sex.length == 0) { 
				alert("性别不能为空!"); 
				return ;
			};
			if (number.length == 0) { 
				alert("学号不能为空!"); 
				return ;
			};
			if (grade.length == 0) { 
				alert("年级不能为空!"); 
				return ;
			};
			/*if (sourceSchool.length == 0) { 
				alert("来源学校不能为空!"); 
				return ;
			};*/
			if (signUpDates.length == 0) { 
				alert("报名日期不能为空!"); 
				return ;
			};
			/*if (headImgPath == "") { 
				alert("请选择头像"); 
				return ;
			};*/
			
			if (birthdays.length == 0) { 
				alert("生日不能为空!"); 
				return ;
			};
			
			/*if (qq.length == 0) { 
				alert("QQ不能为空!"); 
				return ;
			};*/
			/*if (email.length == 0) {
				alert("邮箱不能为空!"); 
				return ;
			};*/
			if (userName.length == 0) { 
				alert("登录密码不能为空!"); 
				return ;
			};
			if (pass.length == 0) { 
				alert("登录密码不能为空!"); 
				return ;
			};
			if (phone.length == 0) { 
				alert("学员电话不能为空!"); 
				return ;
			};
			/*if (sparePhone.length == 0) { 
				alert("备用电话不能为空!"); 
				return ;
			};
			if (remarks.length == 0) { 
				alert("备注不能为空!"); 
				return ;
			};*/
			
			var signUpDate = signUpDates;
			var birthday = birthdays;
			
			
			var mydata = {
				"iname": iname,
				"schoolId": schoolId,
				"sex": sex,
				"number": number,
				"grade": grade,
				"sourceSchool": sourceSchool,
				"signUpDate": signUpDate,
				"birthday": birthday,
				"headImgPath":headImgPath,
				"qq": qq,
				"email": email,
				"userName":userName,
				"pass":pass,
				"phone": phone,
				"sparePhone": sparePhone,
				"remarks": remarks
			}
			var contentup = JSON.stringify(mydata);
			
			console.log(contentup);
			
			//确定增加
			$.ajax({
				type: 'POST',
				url: getIp() + "train/backstudent/save",
				data: contentup,
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				xhrFields: {
					withCredentials: true
				},
				contentType: "application/json",
				success: function(data) {
					data = verifyCode(data);
					console.log(data);
					//查询结果
					if( typeof data === 'object' ){
					}else{
						var data = JSON.parse(data);
					}
					
					if(data.code == 0){
						layer.msg('增加成功', {
							icon: 1,
							time: 2000
						});
					}else{
						layer.msg(data.msg, {
							icon: 1,
							time: 2000
						});
					}
					vm.hide(1);
					vm.search();
					
				},
				error: function(data) {
					console.log(data.msg);
				},
			});
		},
		modify() {
			let vm = this;
			//确定修改
			var studentId = parseInt($("#studentId").val()) ;
			var iname = $("#iname").val();
			var schoolId = parseInt($('#schoolId option:selected').val());
			var sex = $("#sex option:selected").val();
			var number = $("#number").val();
			var grade = $("#grade").val();
			var sourceSchool = $("#sourceSchool").val();
			var signUpDates = $("#signUpDate").val();
			
			//照片
			var headImgPath = vm.qrPathOne;
			var hidden_addImageOne = $("#hidden_addImageOne").val();
			
			var birthdays = $("#birthday").val();
			var qq = $("#qq").val();
			var email = $("#email").val();
			var userName = $("#userName").val();
			var pass = $("#pass").val();
			var hidden_addpsw = $("#hidden_addpsw").val();
			var phone = $("#phone").val();
			var sparePhone = $("#sparePhone").val();
			var remarks = $("#remarks").val();
			
			
			
			if (iname.length == 0) { 
				alert("学员姓名不能为空!"); 
				return ;
			};
			if (sex.length == 0) { 
				alert("性别不能为空!"); 
				return ;
			};
			if (number.length == 0) { 
				alert("学号不能为空!"); 
				return ;
			};
			if (grade.length == 0) { 
				alert("年级不能为空!"); 
				return ;
			};
			/*if (sourceSchool.length == 0) { 
				alert("来源学校不能为空!"); 
				return ;
			};*/
			if (signUpDates.length == 0) { 
				alert("报名日期不能为空!"); 
				return ;
			};
			/*if (headImgPath == "") { 
				alert("请选择头像"); 
				return ;
			};*/
			if (birthdays.length == 0) { 
				alert("生日不能为空!"); 
				return ;
			};
			/*if (qq.length == 0) { 
				alert("QQ不能为空!"); 
				return ;
			};*/
			/*if (email.length == 0) {
				alert("邮箱不能为空!"); 
				return ;
			};*/
			if (userName.length == 0) { 
				alert("登录密码不能为空!"); 
				return ;
			};
			if (pass.length == 0) { 
				alert("登录密码不能为空!"); 
				return ;
			};
			if (phone.length == 0) { 
				alert("学员电话不能为空!"); 
				return ;
			};
			/*if (sparePhone.length == 0) { 
				alert("备用电话不能为空!"); 
				return ;
			};
			if (remarks.length == 0) { 
				alert("备注不能为空!"); 
				return ;
			};*/
			
			var signUpDate = signUpDates;
			var birthday = birthdays;
			
			
			var mydata = {
				"studentId":studentId,
				"iname": iname,
				"schoolId": schoolId,
				"sex": sex,
				"number": number,
				"grade": grade,
				"sourceSchool": sourceSchool,
				"signUpDate": signUpDate,
				
				"birthday": birthday,
				"qq": qq,
				"email": email,
				"userName":userName,
				"phone": phone,
				"sparePhone": sparePhone,
				"remarks": remarks
			}
			if(pass != hidden_addpsw){
				var passwords = {"pass": pass};
				mydata = Object.assign(passwords, mydata);
			};
			if(headImgPath != hidden_addImageOne){
				var qrPathOnes = {"headImgPath":headImgPath};
				mydata = Object.assign(qrPathOnes, mydata);
			};
			var contentup = JSON.stringify(mydata);
			
			console.log(contentup);
			
			//确定增加
			$.ajax({
				type: 'POST',
				url: getIp() + "train/backstudent/update",
				data: contentup,
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				xhrFields: {
					withCredentials: true
				},
				contentType: "application/json",
				success: function(data) {
					data = verifyCode(data);
					var data = JSON.parse(data);
					if(data.code==0){
						console.log(data);
						layer.msg('修改成功!', {
								icon: 1,
								time: 2000
							});
						
						//查询结果
					}else{
						console.log(data);
						alert(data.msg);
						return;
					}
					vm.hide(1);
					vm.search();
				},
				error: function(data) {
					console.log(data.msg);
				},
			});

		},
		//新增上传图片
		uploadOne(){
			var vm = this;
			$("#addImageOne").ajaxForm(function (res) {
				console.log(res);
	            vm.qrPathOne = JSON.parse(res).path;
	            vm.imgUrlOne = getIp()  + "resources/img/"+vm.qrPathOne;
	        });
		},
		click(index){
			var tdList = $('input[name=checkbox]').eq(index).parents('td').siblings();
			for(var i = 0;i<tdList.length;i++){
				console.log(tdList[0]);
			}
		},
		admin_role_edit(id,number,iname,schoolId){
			var vm = this;
			vm.studentid = id;
			vm.number = number;
			vm.iname = iname;
			vm.admin_student_edit(1,id,schoolId);
		},
		admin_student_edit(page,id,schoolId){
			
			let vm = this;
			vm.isadd = false;
			vm.ismodify = false;
			vm.isshow = false;
			vm.iscourseall = true;
			var idd = parseInt(id);
			$.ajax({
				type: 'POST',
				url: getIp() + "train/backstudent/queryNotClass",
				data: {"schoolId":schoolId,"studentId":idd,"page": page,"limit": 10},
				dataType: 'json',
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(data) {
					data = verifyCode(data);
					console.log(data);
					if(data.code==0){
						vm.classlist = data.page.list;
						vm.pagesize1 = data.page.totalPage;
					}else{
						alert(data.msg);
						return;
					}
				},
				error: function(data) {
					console.log(data.msg);
				},
			});
		},
		determine(id){
			var vm = this;
			var id = parseInt(vm.studentid);
			var classIds = [];
			for(var i = 0;i<$("#datatable tbody .text-c").length;i++){
				if($("#datatable tbody .text-c .checkbox").eq(i).find("input").is(':checked')){
					var classId = $("#datatable tbody .text-c .hidden").eq(i).find("input").val();
					
					classIds.push(parseInt(classId));
				}
			}
			console.log(classIds);
			data = {"studentId": id,"classIds": classIds};
			var datas = JSON.stringify(data);
			$.ajax({
				type: 'POST',
				url: getIp() + "train/backstudent/choiceClass",
				data: datas,
				xhrFields: {
					withCredentials: true
				},
				contentType: "application/json",
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(data) {
					data = verifyCode(data);
					var data = JSON.parse(data);
					if(data.code==0){
						console.log(data);
						layer.msg('选班成功!', {
								icon: 1,
								time: 2000
							});
						
						//查询结果
					}else{
						console.log(data);
						alert(data.msg);
						return;
					}
					vm.hide(1);
					vm.search();
				},
				error: function(data) {
					console.log(data.msg);
				},
			});
			
		},
		
		search(){
			this.ajax(1);
		},
		ajax(page) {
			var vm = this;
			var iname = $("#search_iname").val();
			var number = $("#search_number").val();
			var phone = $("#search_phone").val();
			var data = {"page": page,"limit": 10,"sidx":"sign_up_date","order":"desc"};
			if(iname.length!=0){
				data = Object.assign({"iname":iname}, data);
			}
			if(number.length!=0){
				data = Object.assign({"number":number}, data);
			}
			if(phone.length!=0){
				data = Object.assign({"phone":phone}, data);
			}
			console.log(data);
			$.ajax({
				type: 'POST',
				url: getIp() + "train/backstudent/list",
				data: data,
				dataType: 'json',
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(data) {
					data = verifyCode(data);
					vm.list = data.page.list;
					vm.pagesize = data.page.totalPage; //页码总数
					console.log(data);
				},
				error: function(data) {
					console.log(data.msg);
				},
			});

		}
	},
	mounted: function() {
		this.schoolAjax();
		this.search();
		this.uploadOne();
	}
});