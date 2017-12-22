/**
 * 课程服务
 * */
//展开项默认隐藏
new Vue({
	el: '#app',
	data: {
		hours:[],
		minutes:[],
		pagesize: 0,
		nowpage: 1,
		pagesize1: 0,
		nowpage1: 1,
		name:'',
		iname:'',
		classCurriculumId:'',
		curriculumId:0,
		disabled_studentNumber:false,
		selected_choose:1,
		selected_choose_1:1,
		selected_category:1,
		selected_classtype:1,
		selected_state:1,
		selected_chargingMode:1,
		isadd: false,
		ismodify: false,
		iscourse: false,
		isgoup: false,
		iscourseall:false,
		isCost:false,
		isClassHours:true,
		isCosts:false,
		isClassHourss:true,
		isCost2:false,
		isClassHours2:false,
		isCost3:false,
		isClassHours3:true,
		iscourses:false,
		list: [],
		school: [],
		isCurriculum:[],
		curriculum: [],
		classCurriculum: [],
		curriculumSchedule:[],
		studentlist:[],
		schoolId:''
	},
	watch: {
		nowpage1: function(newpage1, oldpage1) {
			var vm = this;
			var id = vm.classCurriculumId;
			vm.gotoClassFenye(newpage1,id);
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
					res = verifyCode(res);
					var list = JSON.parse(res);
					vm.school = list.data;
//					vm.schoolId = vm.school.id;
//					console.log(vm.school);
				},
				error: function(err) {
					console.log(err)
				}
			});
			vm.hours=["05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
			vm.minutes=["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59"];
		
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
			if(isNumber(topages)){
				this.topage1 = parseInt(topages);
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
		curriculumAjax(){
			//查询总课时
			let vm = this;
			$.ajax({
				type: "post",
				url: getIp() + "train/curriculum/all",
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				xhrFields: {
					withCredentials: true
				},
				success: function(res) {
					res = verifyCode(res);
					var list = JSON.parse(res);
					vm.curriculum = list.data;
					console.log('==========keshilist===================================================================')
					console.log(vm.curriculum);
				},
				error: function(err) {
					console.log(err)
				}
			})
		},
		isClassHour(){
			//辅助增加显示的方法
			if($('#chargingMode option:selected').val()=='B1'){
				this.isCost=false;
				this.isClassHours=true;
			}else{
				this.isCost=true;
				this.isClassHours=true;
			}
		},
		isClassHour9(){
			//辅助增加显示的方法
			if($('#etc_chargingMode option:selected').val()=='B1'){
				this.isCost2=false;
				this.isClassHours2=true;
			}else{
				this.isCost2=true;
				this.isClassHours2=true;
			}
		},
		isClassHour10(){
			//辅助增加显示的方法
			if($('#chargingModes option:selected').val()=='B1'){
				this.isCost3=false;
				this.isClassHours3=true;
			}else{
				this.isCost3=true;
				this.isClassHours3=true;
			}
		},
		add(){
			let vm = this;
			vm.addAjax();
		},
		addnew() {
			if(verifyRoot(28)){
				return;
			};
			//点击新增
			this.schoolAjax();
			this.curriculumAjax();
			this.isadd = true;
			this.iscourse = false;
			this.iscourses = false;
			this.ismodify = false;
			this.isgoup = false;
			this.iscourseall = false;
		},
		closnew() {
			//关闭遮罩层/刷新页面
			this.isadd = false;
			this.iscourse = false;
			this.iscourses = false;
			this.ismodify = false;
			this.isgoup = false;
			this.iscourseall = false;
			this.ajax(1);
		},
		addAjax(){
			//增加班级方法
			let vm = this;
			var school = $('#choose option:selected').val();
			var category = $('#category').val();
			var iname = $('#classname').val();
			var type = $('#classtype option:selected').val();
			var teacher = $('#teacher').val();
			var startTime = $('#startTime').val();
			var Number = $('#Number').val();
			var state = $('#state option:selected').val();
			var estimatePeopleNumbers = $('#people').val();
			var endTime = $('#endTime').val();
			
			var chargingMode = $('#chargingMode option:selected').val();
			var tuitions = $('#tuition').val();
			var curriculumState = "B1";
			
			var classCurriculumList = [];
			for(var i = 0;i<$("#datatable tbody .text-c").length;i++){
				if($("#datatable tbody .text-c .checkbox").eq(i).find("input").is(':checked')){
					var curriculumId = $("#datatable tbody .text-c .hidden").eq(i).find("input").val();
					var iclassHour = $("#datatable tbody .text-c .classHours").eq(i).find("input").val();
					var imoeny = $("#datatable tbody .text-c .moneys").eq(i).find("input").val();
					var classCurriculum = {
						curriculumId : curriculumId,
						iclassHour : iclassHour,
						imoeny : imoeny
					};
					classCurriculumList.push(classCurriculum);
					
				}
				
			}
			var reg = /^[0-9]+$/; 
			var schoolId;
			var estimatePeopleNumber;
			var tuition;
			if (school.length == 0) { 
				alert("所在分校不能为空!"); 
				return ;
			}else{
				schoolId = parseInt(school);
			};
			if (category.length == 0) { 
				alert("所属类别不能为空!"); 
				return ;
			};
			if (iname.length == 0) { 
				alert("班级名称不能为空!"); 
				return ;
			};
			if (type.length == 0) { 
				alert("班级类型不能为空!"); 
				return ;
			};
			if (teacher.length == 0) { 
				alert("教练不能为空!"); 
				return ;
			};
			if (startTime.length == 0) { 
				alert("开始时间不能为空!"); 
				return ;
			};
			if (Number.length == 0) { 
				alert("班级编号不能为空!"); 
				return ;
			};
			if (state.length == 0) { 
				alert("班级状态不能为空!"); 
				return ;
			};
			if (estimatePeopleNumbers.length == 0) { 
				alert("预招人数不能为空!"); 
				return ;
			}else if(!isNumber(estimatePeopleNumbers)){
				alert("请输入有效的正整数数值"); 
				return;
			}else if(estimatePeopleNumbers!=""&&!reg.test(estimatePeopleNumbers)){
				alert("预招人数必须是数字!"); 
				return;
			}else{
				estimatePeopleNumber = parseInt(estimatePeopleNumbers)
			};
			if (endTime.length == 0) { 
				alert("结束时间不能为空!"); 
				return ;
			};
			date1=new Date(startTime);
			date2=new Date(endTime);
			if (Date.parse(date1)>Date.parse(date2)) { 
				alert("结束时间不能小于开始时间"); 
				return ;
			};
			if (chargingMode.length == 0) { 
				alert("收费模式不能为空!"); 
				return ;
			}else if(chargingMode=="B2"){
				if (tuitions.length == 0) { 
					alert("费用不能为空!"); 
					return ;
				}else if(!isNumber(tuitions)){
					alert("请输入有效的正整数数值"); 
					return;
				}else{
					tuition = parseInt(tuitions)
				}
			};
			console.log(classCurriculumList);
			if (classCurriculumList.length == 0) { 
				alert("课时不能为空!"); 
				return ;
			}
			
			console.log(classCurriculumList);
			
			var startTimes = startTime;
			var endTimes = endTime;
			var mydata = {
				"schoolId": schoolId,
				"category": category,
				"iname": iname,
				"type": type,
				"teacher": teacher,
				"startTime": startTimes,
				"number": Number,
				"state": state,
				"estimatePeopleNumber": estimatePeopleNumber,
				"endTime": endTimes,
				"curriculumState":curriculumState,
				"chargingMode": chargingMode,
				"tuition": tuition,
				"classCurriculumList": classCurriculumList
			}
			console.log(mydata);
			var contentup = JSON.stringify(mydata);
			console.log(contentup);
			$.ajax({
				type: "post",
				url: getIp() + "train/class/save",
				data: contentup,
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				xhrFields: {
					withCredentials: true
				},
				contentType: "application/json",
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
					vm.closnew();
				},
				error: function(err) {
					console.log(err)
				}
			})
		},
		modifythis(id) {
			if(verifyRoot(29)){
				return;
			};
			//点击修改
			let vm = this;
			vm.schoolAjax();
			vm.curriculumAjax();
			//先请求要修改的内容
			vm.isadd = false;
			vm.iscourse = false;
			vm.iscourses = false;
			vm.ismodify = true;
			vm.isgoup = false;
			vm.iscourseall = false;
			$.ajax({
				type: 'POST',
				url: getIp() + "train/class/info/"+id,
				dataType: 'json',
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				success: function(data) {
					data = verifyCode(data);
					for(var i = 0;i< vm.school.length;i++){
						if(data.class.schoolId==vm.school[i].id){
							vm.selected_choose = data.class.schoolId;
							$('#etc_choose').prop("disabled", "disabled")
						}
					}
					$("#hidden_id").val(data.class.classId);
					$('#etc_category').val(data.class.category);
					//vm.selected_category = data.class.category;
					//$('#etc_category option:selected').val(data.class.category);
					$('#etc_classname').val(data.class.iname);
					vm.selected_classtype = data.class.type;
					//$('#etc_classtype option:selected').val(data.class.type);
					$('#etc_teacher').val(data.class.teacher);
					$('#etc_startTime').val(data.class.startTime);
					$('#etc_Number').val(data.class.number);
					vm.selected_state = data.class.state;
					//$('#etc_state option:selected').val(data.class.state);
					$('#etc_people').val(data.class.estimatePeopleNumber);
					$('#etc_endTime').val(data.class.endTime);
					vm.selected_chargingMode = data.class.chargingMode;
					$('#hidden_studentNumber').val(data.class.studentNumber);
						$('#etc_chargingMode').prop("disabled", "disabled");
					
					//$('#etc_chargingMode option:selected').val(data.class.chargingMode);
						vm.isClassHours2=true;
						$.ajax({
							type: "post",
							url: getIp() + "train/class/curriculum/"+data.class.classId,
							beforeSend: function(xhr){
								xhr.setRequestHeader('token',token);
							},
							xhrFields: {
								withCredentials: true
							},
							success: function(res) {
								res = verifyCode(res);
								var res = JSON.parse(res);
								var curriculum = res.curriculum;
								for(var i = 0;i<$("#datatable_ext tbody .text-c").length;i++){
									for(var j =0;j<curriculum.length;j++){
										if($("#datatable_ext tbody .text-c .hidden").eq(i).find("input").val()==curriculum[j].curriculumId){
											$("#datatable_ext tbody .text-c .checkbox").eq(i).find("input").prop("checked", true);
										}
									}
								};
								if(data.class.studentNumber==null || data.class.studentNumber.length==0 || data.class.studentNumber==0){
									vm.disabled_studentNumber = false;
								}else{
									vm.disabled_studentNumber = true;
								}
							},
							error: function(err) {
								console.log(err)
							}
						});
					if(data.class.chargingMode=='B2'){
						vm.isCost2=true;
						$('#etc_tuition').val(data.class.tuition);
						if(data.class.studentNumber==null || data.class.studentNumber.length==0  || data.class.studentNumber==0){
							$('#etc_tuition').prop("disabled", false);
						}else{
							$('#etc_tuition').prop("disabled", "disabled");
						}
					}else{
						vm.isCost2=false;
					};
						
						
						
						
					/*if($('#chargingMode option:selected').val()=='B2'){
						vm.isCost2=true;
						$('#etc_tuition').val(data.class.tuition);
						if(data.class.studentNumber==null || data.class.studentNumber.length==0){
							$('#etc_tuition').prop("disabled", "disabled");
						}
					}*/
					if(data.class.studentNumber==null || data.class.studentNumber.length==0  || data.class.studentNumber==0){
						$('#etc_people').prop("disabled", false);
					}else{
						$('#etc_people').prop("disabled", "disabled");
					}
					var curriculumState = "B1";
				},
				error: function(data) {
					console.log(data.msg);
				},
			});
		},
		modify() {
			//确定修改
			let vm = this;
			var hidden_studentNumber = $('#hidden_studentNumber').val();
			var hidden_id = $("#hidden_id").val();
			//alert(hidden_id);
			var school = $('#etc_choose option:selected').val();
			var category = $('#etc_category').val();
			var iname = $('#etc_classname').val();
			var type = $('#etc_classtype option:selected').val();
			var teacher = $('#etc_teacher').val();
			var startTime = $('#etc_startTime').val();
			var Number = $('#etc_Number').val();
			var state = $('#etc_state option:selected').val();
			var estimatePeopleNumbers = $('#etc_people').val();
			var endTime = $('#etc_endTime').val();
			var chargingMode = $('#etc_chargingMode option:selected').val();
			var tuitions = $('#etc_tuition').val();
			var curriculumState = "B1";
			var classCurriculumList = [];
			for(var i = 0;i<$("#datatable_ext tbody .text-c").length;i++){
				if($("#datatable_ext tbody .text-c .checkbox").eq(i).find("input").is(':checked')){
					var curriculumId = $("#datatable_ext tbody .text-c .hidden").eq(i).find("input").val();
					var iclassHour = $("#datatable_ext tbody .text-c .classHours").eq(i).find("input").val();
					var imoeny = $("#datatable_ext tbody .text-c .moneys").eq(i).find("input").val();
					var classCurriculum = {
						curriculumId : curriculumId,
						iclassHour : iclassHour,
						imoeny : imoeny
					};
					classCurriculumList.push(classCurriculum);
					
				}
				
			}
			var reg = /^[0-9]+$/; 
			var schoolId;
			var estimatePeopleNumber;
			var tuition;
			if (school.length == 0) { 
				alert("所在分校不能为空!"); 
				return ;
			}else{
				schoolId = parseInt(school)
			};
			if (category.length == 0) { 
				alert("所属类别不能为空!"); 
				return ;
			};
			if (iname.length == 0) { 
				alert("班级名称不能为空!"); 
				return ;
			};
			if (type.length == 0) { 
				alert("班级类型不能为空!"); 
				return ;
			};
			if (teacher.length == 0) { 
				alert("教练不能为空!"); 
				return ;
			};
			if (startTime.length == 0) { 
				alert("开始时间不能为空!"); 
				return ;
			};
			if (Number.length == 0) { 
				alert("班级编号不能为空!"); 
				return ;
			};
			if (state.length == 0) { 
				alert("班级状态不能为空!"); 
				return ;
			};
			if (estimatePeopleNumbers.length == 0) { 
				alert("预招人数不能为空!"); 
				return ;
			}else if(!isNumber(estimatePeopleNumbers)){
					alert("请输入有效的正整数数值"); 
					return;
				}else if(estimatePeopleNumbers!=""&&!reg.test(estimatePeopleNumbers)){
				alert("预招人数必须是数字!"); 
				return;
			}else{
				estimatePeopleNumber = parseInt(estimatePeopleNumbers)
			};
			if (endTime.length == 0) { 
				alert("结束时间不能为空!"); 
				return ;
			};
			date1=new Date(startTime);
			date2=new Date(endTime)
			if (Date.parse(date1)>Date.parse(date2)) { 
				alert("结束时间不能小于开始时间"); 
				return ;
			};
			if (chargingMode.length == 0) { 
				alert("收费模式不能为空!"); 
				return ;
			}else if(chargingMode=="B2"){
				if (tuitions.length == 0) { 
					alert("费用不能为空!"); 
					return ;
				}else if(!isNumber(tuitions)){
					alert("请输入有效的正整数数值"); 
					return;
				}else{
					tuition = parseInt(tuitions)
				}
			};
			if (classCurriculumList.length == 0) { 
				alert("课时不能为空!"); 
				return ;
			}
			var startTimes = startTime;
			var endTimes = endTime;
			var mydata = {
				"classId":hidden_id,
				"schoolId": schoolId,
				"category": category,
				"iname": iname,
				"type": type,
				"teacher": teacher,
				"startTime": startTimes,
				"number": Number,
				"state": state,
				"estimatePeopleNumber": estimatePeopleNumber,
				"endTime": endTimes,
				"curriculumState":curriculumState,
				
			};
			if(hidden_studentNumber==null || hidden_studentNumber.length==0  || hidden_studentNumber == 0){
				mydata = Object.assign({"tuition": tuition}, mydata);
				var chargingMode11 = {"chargingMode": chargingMode};
				mydata = Object.assign(chargingMode11, mydata);
				var classCurriculumList11 = {"classCurriculumList": classCurriculumList};
				mydata = Object.assign(classCurriculumList11, mydata);
			}
			console.log(mydata);
			var contentup = JSON.stringify(mydata);
			console.log(contentup);
			
			
			$.ajax({
				type: "post",
				url: getIp() + "train/class/update",
				data: contentup,
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				xhrFields: {
					withCredentials: true
				},
				contentType: "application/json",
				success: function(res) {
					res = verifyCode(res);
					console.log(res);
					if( typeof res === 'object' ) {
					}else{
						var res = JSON.parse(res);
					}
					if(res.code==0){
						layer.msg('修改成功!', {
							icon: 1,
							time: 2000
						});
					}else{
						layer.msg(res.msg, {
							icon: 1,
							time: 2000
						});
					}
					vm.closnew();
					
				},
				error: function(err) {
					console.log(err)
				}
			});
		},
		/*click(index){
			var tdList = $('input[name=checkbox]').eq(index).parents('td').siblings();
			for(var i = 0;i<tdList.length;i++){
				console.log(tdList[0]);
			}
		},*/
		del(id,studentNumber){
			if(verifyRoot(30)){
				return;
			};
			//点击删除
			let vm = this;
			//先请求要修改的内容
			
			var povers = [];
			povers.push(id);
			var contentup = JSON.stringify(povers);
			console.log(contentup);
			layer.confirm('角色删除须谨慎，确认要删除吗？', function(index) {
				if(studentNumber==null || studentNumber.length==0||studentNumber==0){
					$.ajax({
						type: 'POST',
						url: getIp() + "train/class/delete",
						beforeSend: function(xhr) {
				            xhr.setRequestHeader("token",sessionStorage.getItem("token"));
				        },
						data: contentup,
						dataType: 'json',
						contentType: "application/json",
						success: function(data) {
							console.log(data);
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
							vm.closnew();
						},
						error: function(data) {
							console.log(data.msg);
						},
					});
				}else{
					layer.msg('本班有学生，不可删除!', {
						icon: 1,
						time: 2000
					});
					vm.closnew();
				}
			});
		},
		
		course(id,iname){
			if(verifyRoot(29)){
				return;
			};
			//点击排课,查看课程
			this.isadd = false;
			this.ismodify = false;
			this.iscourse = false;
			this.iscourses = true;
			this.isgoup = false;
			this.iscourseall = false;
			var vm = this;
			vm.iname = iname;
			var ids = parseInt(id);
			vm.curriculumId = ids;
			$.ajax({
				type: "post",
				url: getIp() + "train/class/classHour/"+ids,
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				xhrFields: {
					withCredentials: true
				},
				success: function(res) {
					res = verifyCode(res);
					console.log(res)
					var res = JSON.parse(res);
					vm.isCurriculum=res.curriculum;
					
				},
				error: function(err) {
					console.log(err)
				}
			});

		},
		schedule(id,name){
			this.isadd = false;
			this.ismodify = false;
			this.iscourse = true;
			this.iscourses = false;
			this.isgoup = false;
			this.iscourseall = false;
			var vm = this;
			vm.name = name;
			vm.classCurriculumId = id;
			
			$("#pk_date").val("");
			$("#pk_sumClassHour").val("");
			$("#pk_classHour").val(0);
			$("#pk_startTime_h").val("05");
			$("#pk_startTime_s").val("00");
			$("#pk_endTime_h").val("05");
			$("#pk_endTime_s").val("00");
			$("#pk_iweek").val(1);
		},
		returnOne(){
			var vm = this;
			vm.course(vm.curriculumId,vm.iname);
		},
		modifyCour(id){
			var vm = this;
			var classCurriculumId = parseInt(id);
			var dates = $("#pk_date").val();
			var sumClassHours = $("#pk_sumClassHour").val();
			var classHours = $("#pk_classHour").val();
			var pk_startTime_h = $("#pk_startTime_h").val();
			var pk_startTime_s = $("#pk_startTime_s").val();
			var pk_endTime_h = $("#pk_endTime_h").val();
			var pk_endTime_s = $("#pk_endTime_s").val();
			var iweeks = $("#pk_iweek").val();
			
			var classId = vm.curriculumId;
			
			var sumClassHour;
			var classHour;
			var startTime ;
			var endTime ;
			var iweek;
			if (dates.length == 0) { 
				alert("排课时间不能为空!"); 
				return ;
			};
			if (sumClassHours.length == 0) { 
				alert("课时不能为空!"); 
				return ;
			}else if(!isNumber(sumClassHours)){
					alert("请输入有效的正整数数值"); 
					return;
				}else{
				sumClassHour = parseInt(sumClassHours);
			};
			if (classHours.length == 0||classHours==0) { 
				alert("课时不能为空!"); 
				return ;
			}else if(!isNumber(classHours)){
					alert("请输入有效的正整数数值"); 
					return;
				}else{
				classHour = parseInt(classHours);
			};
			if (pk_startTime_h.length == 0) { 
				alert("开始小时不能为空!"); 
				return ;
			}else if (pk_startTime_s.length == 0) { 
				alert("开始分钟不能为空!"); 
				return ;
			}else if(pk_startTime_h==0&&pk_startTime_s==0){
				alert("开始时/分不能为空!"); 
				return ;
			}else{
				startTime = pk_startTime_h+":"+pk_startTime_s;
			};
			if (pk_endTime_h.length == 0) { 
				alert("结束小时不能为空!"); 
				return ;
			}else if (pk_endTime_s.length == 0) { 
				alert("结束分钟不能为空!"); 
				return ;
			}else if(pk_endTime_h==0&&pk_endTime_s==0){
				alert("结束时/分不能为空!"); 
				return;
			}else{
				endTime = pk_endTime_h+":"+pk_endTime_s;
			};
			if(parseInt(pk_startTime_h)>parseInt(pk_endTime_h)){
				alert("结束时间必须大于开始时间!"); 
				return;
			}else if(parseInt(pk_startTime_h)==parseInt(pk_endTime_h)){
				if(parseInt(pk_startTime_s)>=parseInt(pk_endTime_s)){
					alert("结束时间必须大于开始时间!"); 
					return;
				}
			};
			if (pk_iweek.length == 0) { 
				alert("星期不能为空!"); 
				return ;
			}else{
				iweek = parseInt(iweeks);
			};
			
			
			
			var data = {
				"classCurriculumId":classCurriculumId,
				"date":dates,
				"sumClassHour":sumClassHour,
				"classHour":classHour,
				"startTime":startTime,
				"endTime":endTime,
				"iweek":iweek
			};
			console.log(data)
			
			$.ajax({
				type: "post",
				url: getIp() + "train/class/test",
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				data:Object.assign({"classId":classId}, data),
				dataType: 'json',
				success: function(res) {
					res = verifyCode(res);
					console.log("======================================")
					console.log(res)
					if(res.code==0){
						$.ajax({
							type: "post",
							url: getIp() + "train/class/arrange",
							beforeSend: function(xhr){
								xhr.setRequestHeader('token',token);
							},
							data:data,
							dataType: 'json',
							success: function(res) {
								res = verifyCode(res);
								console.log(res)
								if(res.code==0){
									layer.msg('排课成功!', {
										icon: 1,
										time: 2000
									});
								}else{
									layer.msg(res.msg, {
										icon: 1,
										time: 2000
									});
								}
								vm.returnOne();
							},
							error: function(err) {
								console.log(err)
							}
						});
					}else{
						alert(res.msg);
						return;
					}
					
				},
				error: function(err) {
					console.log(err)
				}
			});
		},
		
		gotoClass(id){
			this.gotoClassFenye(1,id,1);
		},
		gotoClassFenye(page,id,nowps){
			//点击排课具体进度情况
			if(nowps==1){
				this.nowpage1= 1;
			}
			this.isadd = false;
			this.ismodify = false;
			this.iscourse = false;
			this.iscourses = false;
			this.isgoup = false;
			this.iscourseall = true;
			var vm = this;
			vm.classCurriculumId = id;
			console.log({"page": page,"limit": 10,"classCurriculumId":id,"sidx":"idate"})
			
			$.ajax({
				type: "post",
				url: getIp() + "train/curriculumschedule/list",
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				data:{"page": page,"limit": 10,"classCurriculumId":id,"sidx":"idate"},
				xhrFields: {
					withCredentials: true
				},
				success: function(res) {
					res = verifyCode(res);
					console.log(res)
					var res = JSON.parse(res);
					if(res.code==0){
						vm.curriculumSchedule = res.page.list;
						vm.pagesize1 = res.page.totalPage; //页码总数
					}
				},
				error: function(err) {
					console.log(err)
				}
			});
		},
		
		classBegins(id){
			//点击上课
			var vm = this;
			var ids = vm.classCurriculumId;
			var idd = parseInt(id);
			$.ajax({
				type: "post",
				url: getIp() + "train/curriculumschedule/useClass/"+idd,
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				xhrFields: {
					withCredentials: true
				},
				success: function(res) {
					res = verifyCode(res);
					console.log(res)
					var res = JSON.parse(res);
					console.log(res)
					if(res.code==0){
						layer.msg('上课成功!', {
							icon: 1,
							time: 2000
						});
					}else{
						layer.msg(res.msg, {
							icon: 1,
							time: 2000
						});
					}
					vm.gotoClassFenye(1,ids)
					
				},
				error: function(err) {
					console.log(err)
				}
			});
		},
		class_del_pk(id){
			if(verifyRoot(30)){
				return;
			};
			//点击删除
			let vm = this;
			var ids = vm.classCurriculumId;
			//先请求要修改的内容
			var povers = [];
			povers.push(id);
			var contentup = JSON.stringify(povers);
			console.log(contentup);
			layer.confirm('排课进度删除须谨慎，确认要删除吗？', function(index) {
				$.ajax({
					type: 'POST',
					url: getIp() + "train/curriculumschedule/delete",
					beforeSend: function(xhr) {
			            xhr.setRequestHeader("token",sessionStorage.getItem("token"));
			        },
					data: contentup,
					dataType: 'json',
					contentType: "application/json",
					success: function(data) {
						console.log(data);
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
						vm.gotoClassFenye(1,ids);
						//vm.closnew();
					},
					error: function(data) {
						console.log(data.msg);
					},
				});
			});
		},
		goup(id,riseClassState,schoolId){
			if(verifyRoot(29)){
				return;
			};
			if(riseClassState==1){
				layer.msg('已经升过班的班级，不允许再次升班!', {
					icon: 1,
					time: 2000
				});
				return;
			}else if(riseClassState==0){
			//点击升班
			this.isadd = false;
			this.ismodify = false;
			this.iscourse = false;
			this.iscourses = false;
			this.isgoup = true;
			this.iscourseall = false;
			this.schoolAjax();
			this.curriculumAjax();
			var vm = this;
			var ids = parseInt(id);
			$('#hidden_classId').val(ids);
			
			
			for(var i = 0;i< vm.school.length;i++){
				if(schoolId==vm.school[i].id){
					vm.selected_choose_1 = schoolId;
					$('#Promoted_choose').prop("disabled", "disabled")
				}
			}
			
			/*$('#Promoted_choose').val(schoolId);*/
			
			$.ajax({
				type: "post",
				url: getIp() + "train/backstudent/classStudent/"+ids,
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(res) {
					res = verifyCode(res);
					console.log(res);
					var res = JSON.parse(res);
					if(res.code==0){
						vm.studentlist = res.data;
					}else{
						alert(res.msg);
						return;
					}
					
				},
				error: function(err) {
					console.log(err)
				}
			});
			}
		},
		okgoup(){
			var vm = this;
			var hidden_classId = $('#hidden_classId').val();
			var school = $('#Promoted_choose option:selected').val();
			var category = $('#Promoted_category').val();
			var iname = $('#Promoted_classname').val();
			var type = $('#Promoted_classtype option:selected').val();
			var teacher = $('#Promoted_teacher').val();
			var startTime = $('#Promoted_startTime').val();
			var Number = $('#Promoted_Number').val();
			var state = $('#Promoted_state option:selected').val();
			var estimatePeopleNumbers = $('#Promoted_people').val();
			var endTime = $('#Promoted_endTime').val();
			
			var chargingMode = $('#chargingModes option:selected').val();
			var beizhu = $('#Promoted_beizhu').val();
			var tuitions = $('#tuition_sf').val();
			
			var curriculumState = "B1";
			console.log(chargingMode);
			
			var classCurriculumList = [];
			for(var i = 0;i<$("#datatable_student tbody .text-c").length;i++){
				if($("#datatable_student tbody .text-c .checkbox").eq(i).find("input").is(':checked')){
					var curriculumId = $("#datatable_student tbody .text-c .hidden").eq(i).find("input").val();
					var iclassHour = $("#datatable_student tbody .text-c .classHours").eq(i).find("input").val();
					var imoeny = $("#datatable_student tbody .text-c .moneys").eq(i).find("input").val();
					var classCurriculum = {
						curriculumId : curriculumId,
						iclassHour : iclassHour,
						imoeny : imoeny
					};
					classCurriculumList.push(classCurriculum);
					
				}
				
			}
			var backStudentList = [];
			for(var i = 0;i<$("#table_class_stu tbody .text-c").length;i++){
				if($("#table_class_stu tbody .text-c .checkbox").eq(i).find("input").is(':checked')){
					var curriculumId = $("#table_class_stu tbody .text-c .hidden").eq(i).find("input").val();
					var students = {"studentId":curriculumId};
					backStudentList.push(students);
					
				}
			}
			console.log(backStudentList);
			var reg = /^[0-9]+$/; 
			var schoolId;
			var estimatePeopleNumber;
			var tuition;
			if (school.length == 0) { 
				alert("所在分校不能为空!"); 
				return ;
			}else{
				schoolId = parseInt(school);
			};
			if (category.length == 0) { 
				alert("所属类别不能为空!"); 
				return ;
			};
			if (iname.length == 0) { 
				alert("班级名称不能为空!"); 
				return ;
			};
			if (type.length == 0) { 
				alert("班级类型不能为空!"); 
				return ;
			};
			if (teacher.length == 0) { 
				alert("教练不能为空!"); 
				return ;
			};
			if (startTime.length == 0) { 
				alert("开始时间不能为空!"); 
				return ;
			};
			if (Number.length == 0) { 
				alert("班级编号不能为空!"); 
				return ;
			};
			if (state.length == 0) { 
				alert("班级状态不能为空!"); 
				return ;
			};
			if (estimatePeopleNumbers.length == 0) { 
				alert("预招人数不能为空!"); 
				return ;
			}else if(!isNumber(estimatePeopleNumbers)){
					alert("请输入有效的正整数数值"); 
					return;
				}else if(estimatePeopleNumbers!=""&&!reg.test(estimatePeopleNumbers)){
				alert("预招人数必须是数字!"); 
				return;
			}else{
				estimatePeopleNumber = parseInt(estimatePeopleNumbers)
			};
			if (endTime.length == 0) { 
				alert("结束时间不能为空!"); 
				return ;
			};
			if (beizhu.length == 0) { 
				alert("备注不能为空!"); 
				return ;
			};
			if (backStudentList.length == 0) { 
				alert("所选学员不能为空!"); 
				return ;
			}
			if (chargingMode.length == 0) { 
				alert("收费模式不能为空!"); 
				return ;
			}else if(chargingMode=="B2"){
				if (tuitions.length == 0) { 
					alert("费用不能为空!"); 
					return ;
				}else if(!isNumber(tuitions)){
					alert("请输入有效的正整数数值"); 
					return;
				}else{
					tuition = parseInt(tuitions)
				}
			};
			if (classCurriculumList.length == 0) { 
				alert("课时不能为空!"); 
				return ;
			}
			console.log(chargingMode);
			var startTimes = startTime;
			var endTimes = endTime;
			var mydata = {
				"classId":hidden_classId,
				"schoolId": schoolId,
				"category": category,
				"iname": iname,
				"type": type,
				"teacher": teacher,
				"startTime": startTimes,
				"number": Number,
				"state": state,
				"estimatePeopleNumber": estimatePeopleNumber,
				"endTime": endTimes,
				"curriculumState":curriculumState,
				"chargingMode": chargingMode,
				"beizhu":beizhu,
				"tuition": tuition,
				"classCurriculumList": classCurriculumList,
				"backStudentList":backStudentList
			}
			console.log(mydata);
			var contentup = JSON.stringify(mydata);
			console.log(contentup);
			
			$.ajax({
				type: "post",
				url: getIp() + "train/class/riseClass",
				data: contentup,
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				xhrFields: {
					withCredentials: true
				},
				contentType: "application/json",
				success: function(res) {
					res = verifyCode(res);
					if( typeof res === 'object' ) {
					}else{
						var res = JSON.parse(res);
					}
					if(res.code == 0){
						layer.msg('升班成功!', {
							icon: 1,
							time: 2000
						});
					}else{
						layer.msg(res.msg, {
							icon: 1,
							time: 2000
						});
					};
					vm.closnew();
				},
				error: function(err) {
					console.log(err)
				}
			});
		},
		/*clicks(index){
			alert();
			var tdList = $('#table_student input[name=checkbox]').eq(index).parents('td').siblings();
			for(var i = 0;i<tdList.length;i++){
				console.log(tdList[0]);
			}
		},*/
		allchoose_student(ind,choose){
			if($("#"+ind+" tbody .text-c .checkbox input").eq(0).is(':checked')){
				alert("nihoa");
			}
			if($("#"+choose).is(':checked')){
				$("#"+ind+" tbody .text-c .checkbox input").each(function(){
					$(this).prop("checked", "checked");
				});
				/*$(" input").each(function(){
					$(this).prop("checked", "checked");
				});*/
				//$("#datatable tbody .text-c .checkbox").eq(i).find("input").prop("checked", true);
			}else{
				$("#"+ind+" tbody .text-c .checkbox input").prop("checked", false);
			}
			
			
			
			
			
		},
		hide(num) {
			//点击排课
			this.isadd = false;
			this.ismodify = false;
			this.iscourse = false;
			this.iscourses = false;
			this.isgoup = false;
			this.iscourseall = false;
			this.search();
		},
		search(){
			this.ajax(1);
		},
		ajax(page){
				this.nowpage= page;
			let vm = this;
			var schoolId = $("#search_schoolId").val();
			var iname = $("#search_className").val();
			var data = {"page": page,"limit": 10,"sidx":"start_time","order":"desc"};
			if(schoolId.length!=0){
				data = Object.assign({"schoolId":schoolId}, data);
			};
			if(iname.length!=0){
				data = Object.assign({"iname":iname}, data);
			};
			console.log(data);
			$.ajax({
				type: "post",
				url: getIp() + "train/class/list",
				data: data,
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				xhrFields: {
					withCredentials: true
				},
				success: function(res) {
					res = verifyCode(res);
					console.log("========list===============================================================");
					console.log(res);
					var lists = JSON.parse(res);
					if(lists.page.list.length>0){
						vm.list = lists.page.list;
						vm.pagesize = lists.page.totalPage; //页码总数
						console.log("=====================");
						console.log(lists.page);
					}else{
						vm.list = [];
					}
					
//					vm.schoolId = vm.school.id;
//					console.log(vm.school);
				},
				error: function(err) {
					console.log(err)
				}
			})
		},
		//全选 & 全不选
		checkall(idp, cla){
			var showstatus = $("#" + idp).prop('checked') ? $("#" + idp).prop('checked') : false;
			$('.' + cla).each(function(index, ele){
				console.log(showstatus, $(ele).prop('checked'))
				$(ele).prop('checked', showstatus)
			})
		}
	},
	mounted: function() {
			this.schoolAjax();
			this.search();
	}
	
});

