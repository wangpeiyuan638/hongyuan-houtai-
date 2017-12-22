
/**
 * 课程服务
 * */
//展开项默认隐藏
new Vue({
	el: '#app',
	data: {
//		rootLink: 'http://192.168.1.111:8080',
		imoenys:"0.00",
		ispay: false,
		classlist:[],
		school: [],
		list: [],
		listPer: [],
		idTmr: '',
		pagePer: 1,
		totalPage: 0,
		showClass: '',
		showPayStatus: '',
		showClassDetail: '',
		classId: '',
		backStudentClassId: 0,
		isChangeClass: false,
		changeclass: {},
		changeclasstarget: {},
		isHourDatas: {},
		isHourDataCount: 0
	},
	created () {
		this.tableToExcel();
	},
	methods: {
		schoolAjax(){
			//查询学校
			var vm = this;
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
					var listD = JSON.parse(res);
					vm.school = listD.data;
//					vm.schoolId = vm.school.id;
				},
				error: function(err) {
					console.log(err)
				}
			})
		},
		//点击切换========================
		firstPage () {
			this.pagePer = 1;
			this.ajax(this.pagePer);
			$('.currentPages:nth-of-type(2)').text(this.pagePer);
		},
		prePage () {
			if (this.pagePer <= 1) return;
			this.ajax(--this.pagePer);
			$('.currentPages:nth-of-type(2)').text(this.pagePer);
		},
		nextPage (){
			if (this.pagePer >= this.totalPage) return;
			this.ajax(++this.pagePer);
			$('.currentPages:nth-of-type(2)').text(this.pagePer);
		},
		lastPage () {
			if (this.totalPage == 0) return;
			this.pagePer = this.totalPage;
			this.ajax(this.pagePer);
			$('.currentPages:nth-of-type(2)').text(this.pagePer);
		},
		changePageFn (num) {
			var middleData;
			switch (num) {
			  case 1:
			    middleData = parseInt($('.currentPages:nth-of-type(2)').text());
			    $('.currentPages:nth-of-type(1)').text(middleData-2);
			    $('.currentPages:nth-of-type(2)').text(middleData-1);
			    $('.currentPages:nth-of-type(3)').text(middleData);
			    this.prePage();
			    break;
			  case 2:
			    break;
			  case 3:
			    middleData = parseInt($('.currentPages:nth-of-type(2)').text());
			    $('.currentPages:nth-of-type(1)').text(middleData);
			    $('.currentPages:nth-of-type(2)').text(middleData+1);
			    $('.currentPages:nth-of-type(3)').text(middleData+2);
			    this.nextPage();
			  break;
			}
		},
		tovaluepage () {
			if ($('#topage.topagefn').val() <=0 || $('#topage.topagefn').val() > this.totalPage || window.parseInt($('#topage.topagefn').val()) != window.parseFloat($('#topage.topagefn').val()) || window.parseInt($('#topage.topagefn').val()) + '' == 'NaN' ) {
				layer.msg('无效值! 请重新输入!!', {
								icon: 1,
								time: 1500
							})
				return;
			}else if(!isNumber($('#topage.topagefn').val())){
				layer.msg('无效值! 请重新输入!!', {
								icon: 1,
								time: 1500
							})
				return;
			}
//			console.log('toPage')
//			console.log($('#topage.topagefn').val())
			this.pagePer = $('#topage.topagefn').val();
			this.ajax(this.pagePer);
			$('.currentPages:nth-of-type(2)').text(this.pagePer);
		},
		//===============================end
		search() {
			this.ajax(this.pagePer);
//			this.ajax(1);
			/*var searchschool = $("#search-school").val();
			var searchname = $("#search-name").val();
			var searchnum = $("#search-num").val();
			var searchphone = $("#search-phone").val();
			var searchsex = $("#search-sex").val();
			var searchispay = $("#search-ispay").val();
			var searchclass = $("#search-class").val();
			var searchclassclass = $("#search-classclass").val();*/
			//搜索

		},
//		exportExcel() {
			//导出Excel表格
			 
        getExplorer() {
            var explorer = window.navigator.userAgent ;
            //ie
            if (explorer.indexOf("MSIE") >= 0) {
                return 'ie';
            }
            //firefox
            else if (explorer.indexOf("Firefox") >= 0) {
                return 'Firefox';
            }
            //Chrome
            else if(explorer.indexOf("Chrome") >= 0){
                return 'Chrome';
            }
            //Opera
            else if(explorer.indexOf("Opera") >= 0){
                return 'Opera';
            }
            //Safari
            else if(explorer.indexOf("Safari") >= 0){
                return 'Safari';
            }
        },
        method5(tableid) {
        	var vm = this;
            if(vm.getExplorer()=='ie')
            {
                var curTbl = document.getElementById(tableid);
                var oXL = new ActiveXObject("Excel.Application");
                var oWB = oXL.Workbooks.Add();
                var xlsheet = oWB.Worksheets(1);
                var sel = document.body.createTextRange();
                sel.moveToElementText(curTbl);
                sel.select();
                sel.execCommand("Copy");
                xlsheet.Paste();
                oXL.Visible = true;

                try {
                    var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
                } catch (e) {
                    print("Nested catch caught " + e);
                } finally {
                    oWB.SaveAs(fname);
                    oWB.Close(savechanges = false);
                    oXL.Quit();
                    oXL = null;
                    vm.idTmr = window.setInterval("vm.Cleanup();", 1);
                }

            }
            else
            {
                vm.tableToExcel(tableid)
            }
        },
        Cleanup() {
        	var vm = this;
            window.clearInterval(vm.idTmr);
            CollectGarbage();
        },
        tableToExcel () {
            var uri = 'data:application/vnd.ms-excel;base64,',
                    template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',
                    base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
                    format = function(s, c) {
                        return s.replace(/{(\w+)}/g,
                                function(m, p) { return c[p]; }) }
            return function(table, name) {
                if (!table.nodeType) table = document.getElementById(table)
                var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
                window.location.href = uri + base64(format(template, ctx))
            }
        },
//		},
		paymoney(id,studentId, item) {
			if(verifyRoot(29)){
				return;
			};
					//set table title
					this.showClass = this.list.filter(function (ele) {
						return ele.classId == id;
					})[0].className;
					this.showPayStatus = this.list.filter(function (ele) {
						return ele.classId == id;
					})[0].chargingMode;
			//点击新增
			this.classId = id;
			this.backStudentClassId = item.backStudentClassId;
			var vm = this;
			this.ispay = true;
			var ids = parseInt(id);
			if (vm.showPayStatus === 'B2') {
				vm.isHourDatas = item;
				console.log('======itemishour===========')
				console.log(item)
				this.isHourDataCount = $('#periodInput').val() * this.isHourDatas.tuition;
				
				
				
				return;
			}
			$.ajax({
				type: "post",
				url: getIp() + "train/class/payCurriculum/"+id+"/"+studentId,
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				xhrFields: {
					withCredentials: true
				},
				success: function(res) {
//					console.log(res)
					var count = 0;
					res = verifyCode(res);
					var res = JSON.parse(res);
					vm.listPer=res.curriculum;
					vm.showClassDetail = res.ClassCurriculum
					for (var i=0; i < $('.dun_imoeny').length; i++) {
						count = count + $('.dun_imoeny')[i].value * vm.listPer[i].imoeny;
//						console.log($('.dun_imoeny')[i], $('.dun_imoeny')[i].value)
					}
					vm.imoenys = count;
					console.log('===listPer=====')
					console.log(vm.listPer)
				},
				error: function(err) {
					console.log(err)
				}
			});
		},
		nopay(num) {
			//隐藏
			this.ispay = false;
		},
		okpay(status) {
			var vm = this;
			var pay = {};
			var title = $("#title").val();
			var linkaddress = $("#linkaddress").val();
			var txtContent = $("#txtContent").val();
			var fill;
			// ===========
			// 按期收费 B1
			if (status === 'B2') {
					fill = window.parseFloat($('#periodInput').val()); //期数
					if(!isNumber($('#periodInput').val())){
							layer.msg('请输入有效的正整数数值!', {
								icon: 1,
								time: 2000
							});
							return;
						}
					pay = {
					  backStudentClassId: this.backStudentClassId,
//					    userId: (登录人的ID),
						userId: JSON.parse(window.sessionStorage.getItem("hongyuan")).data.id,
//					    payType: value(页面上增加个下拉列表1.value: "B1",
//					    html: 现金。。2.value: "B2",
//					    html: 刷卡),
						payType: $('#schooladdress.payMode').val(),
//					    fill: (期数【按期收费用】),
						fill: fill,
//					    billNumber: 票据号,
						billNumber: $('#schooladdress.manPicket').val(),
//					    payDate: 交费日期,
						payDate: $('#schooladdress.submitDate').val(),
//					    money: 交费金额(你算出来的那个),
						money: this.isHourDataCount,
					  mode: "B2",
//					  arrearsDate: $('#schooladdress.delayDate').val(),
					}
				if(pay.billNumber.length==0 || pay.payDate.length==0 || window.parseInt(fill) + '' == 'NaN'){
					
					layer.msg('数据不能为空,请输入!', {
								icon: 2,
								time: 1500
							})
					return;
				}
			// 按课时收费 B2
			} else if (status === 'B1') {
				pay = {
					  backStudentClassId: this.backStudentClassId,
//						userId: window.sessionStorage.getItem("count"),
//					    userId: (登录人的ID),
						userId: JSON.parse(window.sessionStorage.getItem("hongyuan")).data.id,
//					    payType: value(页面上增加个下拉列表1.value: "B1",
//					    html: 现金。。2.value: "B2",
//					    html: 刷卡),
						payType: $('#schooladdress.payMode').val(),
//					    billNumber: 票据号,
						billNumber: $('#schooladdress.manPicket').val(),
//					    payDate: 交费日期,
						payDate: $('#schooladdress.submitDate').val(),
//					    money: 交费金额(你算出来的那个),
						money: this.imoenys,
					  mode: "B1",
//					  arrearsDate: $('#schooladdress.delayDate').val(),
					  payDetailed: [
//					        {
//					            classCurriculumId: 班级课程id,
//					            fillingClassHour: 充入课时,
//					            money: 金额,
//					            curriculumName: 课程名称
//					        }
					    ]
					}
				for (var i=0; i<this.listPer.length; i++) {
					if ($('.dun_imoeny')[i].value.length == 0 ||$('.dun_imoeny')[i].value==0) continue;
					if(!isNumber($('.dun_imoeny')[i].value)){
							layer.msg('请输入有效的正整数数值!', {
								icon: 1,
								time: 2000
							});
							return;
						}
					pay.payDetailed[i] = {
//						classCurriculumId: 班级课程id,
						classCurriculumId: this.listPer[i].classCurriculumId,
//			            fillingClassHour: 充入课时,
						
			        fillingClassHour: $('.dun_imoeny')[i].value,
//			            money: 金额,
			        money: this.listPer[i].imoeny,
//			            curriculumName: 课程名称
			        curriculumName: this.listPer[i].name
					}
				}		
				console.log('=========pay======')
//				console.log(pay, pay.payDetailed.lenght)
				if(pay.payDetailed.length == 0){
					layer.msg('课程至少选择一项!', {
								icon: 2,
								time: 1500
						})
					return;
				}
				if(pay.billNumber.length==0 || pay.payDate.length==0){
//					console.log(pay.billNumber.length , pay.payDate.length)
					layer.msg('数据不能为空,请输入!', {
								icon: 2,
								time: 1500
							})
					return;
				}
			}
			console.log('=============paydatas============')
			console.log(pay)
			this.nopay()
			//确定增加
			$.ajax({
				type: 'POST',
				url: getIp() + "/train/pay/save",
				data: JSON.stringify(pay),
				contentType: 'application/json',
				beforeSend: function(xhr){
					xhr.setRequestHeader('token',token);
				},
				dataType: 'json',
				success: function(data) {
					data = verifyCode(data);
					if( typeof data === 'object' ) {
					}else{
						var data = JSON.parse(data);
					}
					if(data.code==0){
						layer.msg('交费成功!', {
							icon: 1,
							time: 2000
						});
					}else{
						layer.msg(data.msg, {
							icon: 1,
							time: 2000
						});
					};
					vm.firstPage();
					vm.schoolAjax();
					vm.search();
					console.log('success')
				},
				error: function(data) {
					console.log(data.msg);
//					console.log(this.url)
				},
			})
		},
// =======================


		ajax(page) {
			//this.ispay = true;
			var vm = this;
			var schoolId = $("#search_schoolId").val();
			var studentName = $("#search_studentName").val();
			var number = $("#search_number").val();
			var phone = $("#search_phone").val();
			var sex = $("#search_sex").val();
			var payState = $("#search_payState").val();
			var className = $("#search_className").val();
			var data = {"page": page,"limit": 10};
			
			if(schoolId.length!=0){
				data = Object.assign({"schoolId":schoolId}, data);
			};
			if(studentName.length!=0){
				data = Object.assign({"studentName":studentName}, data);
			};
			if(number.length!=0){
				data = Object.assign({"number":number}, data);
			};
			if(phone.length!=0){
				data = Object.assign({"phone":phone}, data);
			};
			if(sex.length!=0){
				data = Object.assign({"sex":sex}, data);
			};
			if(payState.length!=0){
				data = Object.assign({"payState":payState}, data);
			};
			if(className!=null&&className.length!=0){
				data = Object.assign({"className":className}, data);
			};
//			console.log(data);
			$.ajax({
				type: 'POST',
				url: getIp() + "train/backstudentclass/list",
				data: data,
				dataType: 'json',
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(data) {
					console.log(data)
					data = verifyCode(data);
					vm.list = data.page.list;
					vm.totalPage = data.page.totalPage;
					console.log('===========list======')
					console.log(vm.list)
				},
				error: function(data) {
					console.log(data.msg);
				},
			});

		},
		changeHour (item,event) {
			if (this.showPayStatus === 'B1') {
				
				item.iclassHour = event.target.value;
				
				this.imoenys = 0;
	//			for (var i = 0; i < this.school.length; i++) {
	//				this.imoenys = this.imoenys + this.school[i].imoeny * this.school[i].iclassHour;
	//			}
				var count = 0;
	//			for (var i=0; i < $('.dun_imoeny').length; i++) {
	//				count = count + parseFloat($($('.dun_imoeny')[i]).text().slice(1)) * this.listPer[i].imoeny;
	//				console.log(parseFloat($($('.dun_imoeny')[i]).text().slice(1)) , this.listPer[i].imoeny)
	//			}
				for (var i=0; i < $('.dun_imoeny').length; i++) {
					count = count + $($('.dun_imoeny')[i]).val() * this.listPer[i].imoeny;
				}
				this.imoenys = count;
		} else if (this.showPayStatus === 'B2') {
				this.isHourDataCount = $('#periodInput').val() * this.isHourDatas.tuition;
			}
		},
		// 转班
		changeClass (item) {
			if(verifyRoot(29)){
				return;
			};
			var vm =this;
			this.isChangeClass = true;
			this.changeclass = item;
//			console.log(item)
			var data = {'studentId': item.studentId,'schoolId': item.schoolId};
//			console.log(data)
			$.ajax({
				type: 'POST',
				url: getIp() + "train/backstudent/notClass",
				data: data,
				dataType: 'json',
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(data) {
					data = verifyCode(data);
//					console.log('------class---')
//					console.log(data)
					vm.changeclasstarget = data.data;
				},
				error: function(data) {
					console.log(data.msg);
				},
			});
		},
		hideChange () {
			this.isChangeClass = false;
		},
		sureChange () {
			var targetclass = $('#targetclass').val()
			this.hideChange ();
			var data = {'backStudentClassId':this.changeclass.backStudentClassId,'classId': window.parseInt(targetclass)};
			//data = Object.assign(this.changeclass, data);
			console.log('========newclassdata=====/==')
			console.log(data, targetclass)
			$.ajax({
				type: 'POST',
				url: getIp() + "train/backstudent/transfer",
				data: data,
				dataType: 'json',
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(data) {
					if( typeof data === 'object' ) {
					}else{
						var data = JSON.parse(data);
					}
					if(data.code==0){
						layer.msg('转班成功!', {
							icon: 1,
							time: 2000
						});
					}else{
						layer.msg(data.msg, {
							icon: 1,
							time: 2000
						});
					};
					this.firstPage();
					this.schoolAjax();
					this.search();
				},
				error: function(data) {
					console.error(data.msg);
				},
			});
			this.firstPage();
			this.schoolAjax();
			this.search();
		}
	},
	mounted () {
		this.schoolAjax();
		this.search();
	}
})