/**
 * 课程服务
 * */
//展开项默认隐藏
new Vue({
	el: '#app',
	data: {
		list: [],
		school: [],
		idTmrRecord: '',
		showDetail: false,
		pagePer: 1,
		totalPage: 0,
		//总金额
		totalMoney: 0
	},
	methods: {
		ajax(page) {
			var vm = this;
			var schoolId = $("#search_schoolId").val();
			var studentName = $("#search_studentName").val();
			var number = $("#search_number").val();
			var phone = $("#search_phone").val();
			var sex = $("#search_sex").val();
			
			var paydatestart = $("#schoolname.paydatestart").val();
			var paydateend = $("#schoolname.paydateend").val();
			
			var paytype = $('#paytype').val();
			/*var payState = $("#search_payState").val();*/
			
			var className = $("#search_className").val();
			
			var dataP = {"page": page,"limit": 10};
			
			
			if(schoolId.length!=0){
				dataP = Object.assign({"schoolId":schoolId}, dataP);
			};
			if(studentName.length!=0){
				dataP = Object.assign({"studentName":studentName}, dataP);
			};
			if(number.length!=0){
				dataP = Object.assign({"number":number}, dataP);
			};
			if(phone.length!=0){
				dataP = Object.assign({"phone":phone}, dataP);
			};
			
			//===============
			if(paydatestart.length!=0 && paydateend.length!=0){
				dataP = Object.assign({"start":paydatestart}, dataP);
				dataP = Object.assign({"end":paydateend}, dataP);
			};
//			if(!paydateend){
//				dataP = Object.assign({"end":paydateend}, dataP);
//			};
			if(paytype.length!=0){
				dataP = Object.assign({"payType":paytype}, dataP);
			};
			//==================
			if(className!=null&&className.length!=0){
				dataP = Object.assign({"className":className}, dataP);
			};
			//确定修改
			console.log('======dataP===========')
			console.log(dataP)
			$.ajax({
				type: 'POST',
				url: getIp() + "train/pay/list",
				data: dataP,
				dataType: 'json',
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(dat) {
					dat = verifyCode(dat);
					
					
					var lists = [];
					console.log(dat);
					var listOld = dat.page.list;
					for(var i = 0 ; i<listOld.length;i++){
						//state是否有详细信息
						//style=0显示明细按钮style=1显示隐藏明细按钮
						var obj = {"obj1":listOld[i],"state":0,"style":0,"id":listOld[i].payId,"obj2":{}}
						lists.push(obj);
					}
					vm.list = lists;
					vm.totalPage = dat.page.totalPage;
				},
				error: function(dat) {
					console.log(dat.msg);
				},
			});

		},
		search() {
			this.ajax(1);
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
			if ($('#topage.topagefn').val() <=0 || $('#topage.topagefn').val() > this.totalPage ||  window.parseInt($('#topage.topagefn').val()) != window.parseFloat($('#topage.topagefn').val()) || window.parseInt($('#topage.topagefn').val()) + '' == 'NaN') {
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
			console.log('toPage')
			console.log($('#topage.topagefn').val())
			this.pagePer = $('#topage.topagefn').val();
			this.ajax(this.pagePer);
			$('.currentPages:nth-of-type(2)').text(this.pagePer);
		},
		//===============================end
		showItem (item, ele){
			var vm = this;
			var j = 0;
			var s = 0;
			var lists = vm.list;
			var flag = false;
			do{
				flag = false;
				for(var i = 0 ; i<lists.length;i++){
					if(lists[i].state==1&&lists[i].style==1){
						lists.splice(i, 1);
						flag = true;
						break;
					};
				};
			}while(flag)
			
			for(var i = 0 ; i<lists.length;i++){
				lists[i].style=0;
			};
			for(var k = 0 ; k<lists.length;k++){
				if(item == lists[k].id){
					j = k;
				}
			};
			//查询出来的集合
			var list11 = [];
//			list11.push({"kecheng":"语文课","jine":"300.00","yidu":"已读"});
//			list11.push({"kecheng":"数学课","jine":"300.00","yidu":"已读"});
//			list11.push({"kecheng":"语文课","jine":"300.00","yidu":"已读"});
//			list11.push({"kecheng":"数学课","jine":"300.00","yidu":"已读"});
				
	
			
			console.log('===item=====')
			console.log(item, ele.obj1.chargingMode)
			if (ele.obj1.chargingMode === 'B2'){
////				按期
						console.log('===按期======');
						console.log('fill', ele.obj1.fill)
						list11 = [{"curriculumName":"按期","fillingClassHour":ele.obj1.fill,"money":ele.obj1.money}];
						
						for(var q =0;q<list11.length;q++){
							lists.splice(j+1,0,{"obj1":{},"state":1,"style":1,"id":lists[j].id,"obj2":Object.assign({"style1":1}, list11[q])});
						};
						lists[j].style=1;
						vm.list = lists;
////				<tr class="text-c detail-info hide">
////					<td colspan="3">项目名称: 按期收费</td>
////					<td colspan="4">金额：{{item.fill * item.money}} &nbsp;</td>
////					<td colspan="2">充入课时：{{item.fill}}</td>
////				</tr>
//				var ele = $(`<tr><td colspan="3">项目名称: 按期收费</td><td colspan="4">金额：${item.money} &nbsp;</td><td colspan="2">充入课时：${item.fill}</td></tr>`);
//				ele.addClass('text-c detail-info addItems');
////				ele.insertBefore(event.target.parentNode.parentElement.nextElementSibling)
//				ele.insertAfter(event.target.parentNode.parentElement)
//				this.showDetail = true;
			}else if (ele.obj1.chargingMode === 'B1') {
////按课时
////					<tr class="text-c detail-info hide">
////						<td colspan="3">课程名称：********</td>
////						<td colspan="4">金额：1000.0 &nbsp;充入课时：16 &nbsp;已上课时：10&nbsp; 剩余课时6</td>
////						<td colspan="2">选班状态：在读</td>
////					</tr>
//				
					var data = {'payId': item};
					$.ajax({
						type: 'GET',
						url: getIp() + "train/paydetailed/list",
						data: data,
						dataType: 'json',
						beforeSend: function(xhr){
								xhr.setRequestHeader('token',token);
							},
						success: function(data) {
							data = verifyCode(data);
							console.log('====按课时====');
							console.log(data);
							list11 = data.data
//							if (!list11) {
								console.log('empty');
								console.log()
//							}else {
								var list12 = [];
								for(var q =0;q<list11.length;q++){
									lists.splice(j+1,0,{"obj1":{},"state":1,"style":1,"id":lists[j].id,"obj2":Object.assign({"style1":0}, list11[q])});
									
								};
								lists[j].style=1;
								vm.list = lists;
//							}

//							for (var i=0; i<) {
//								var ele = $(`<tr></tr>`);
//								ele.addClass('text-c detail-info addItems');
//								ele.insertBefore(event.target.parentNode.parentElement.nextElementSibling)
//							}
						},
						error: function(data) {
							console.log(data.msg);
						},
					});
				}
				
		},
		hideItem (one) {
			var vm = this;
			var lists = vm.list;
			var flag = false;
			do{
				flag = false;
				for(var i = 0 ; i<lists.length;i++){
					if(lists[i].state==1&&lists[i].style==1){
						lists.splice(i, 1);
						flag = true;
						break;
					};
				};
			}while(flag)
			for(var i = 0 ; i<lists.length;i++){
				lists[i].style=0;
			};
			vm.list = lists;
		},
		//导出excel==========
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
                    vm.idTmrRecord = window.setInterval("vm.Cleanup();", 1);
                }

            }
            else
            {
                vm.tableToExcel(tableid)
            }
        },
        Cleanup() {
        		var vm =this;
            window.clearInterval(vm.idTmrRecord);
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
        //导出excel end==============
        //删除记录
        delItem (item) {
        	if(verifyRoot(30)){
				return;
			};
        	//删除
			let vm = this;
			var povers = [];
			povers.push(item);
			var contentup = JSON.stringify(povers);
			layer.confirm('角色删除须谨慎，确认要删除吗？', function(index) {
				$.ajax({
					type: 'POST',
					url: getIp() + "train/pay/delete",
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
						vm.ajax(1);
					},
					error: function(data) {
						console.log(data.msg);
					},
				});
			});
//			this.hide(1);
   },
    delItemss (item) {
        	if(verifyRoot(30)){
				return;
			};
        	//删除
			let vm = this;
			var povers = [];
			povers.push(item);
			var contentup = JSON.stringify(povers);
			layer.confirm('角色删除须谨慎，确认要删除吗？', function(index) {
				$.ajax({
					type: 'POST',
					url: getIp() + "train/paydetailed/delete",
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
						
						console.log("============lists====================");
						
						var lists = vm.list;
						console.log(lists);
						for(var i = 0 ; i<lists.length;i++){
							if(JSON.stringify(lists[i].obj2) != "{}"){
								if(lists[i].obj2.payDetailedId.length!=0&&lists[i].obj2.payDetailedId==item){
									lists.splice(i, 1);
									vm.list = lists;
								};
							}
							
						};
					},
					error: function(data) {
						console.log(data.msg);
					},
				});
			});
//			this.hide(1);
    }
	},
	mounted () {
		this.schoolAjax();
		this.ajax(this.pagePer);
	}
});