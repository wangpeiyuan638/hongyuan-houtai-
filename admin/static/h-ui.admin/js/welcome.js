/**
 * 首页信息
 * 
 * */
new Vue({
	el: '#app',
	data: {
		nowtime: Date.parse(new Date()),
		userinfo: {
			account: 'admin',
			pos: '管理员',
			phone: 144244244424,
			img: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502596824&di=56540da8b52bb211bd4e1318039bf6b4&imgtype=jpg&er=1&src=http%3A%2F%2Fimg.name2012.com%2Fuploads%2Fallimg%2F2015-07%2F27-233103_984.jpg"
		},
		somenum: [200, 400, 220, 110, 150, 300, 200, 550, 80, 400, 200, 1],
		vistornum: 0,
		notice: 00,
		modify: 12,
		moneynum: 123456543,
		moneypre: "",
		moneyup: true,
		peoplepre: "",
		peopleup: false,
		currentMonth: '',
		upperMonth: '',
		sum:[],
		currentPeople:'',
		prePeople:''
	},
	methods: {
		ajaxs() {
			//柱状图数据
			var now = new Date();  
			var year = now.getFullYear();      
        	var month = now.getMonth() + 1; 
        	if(month < 10){
        		month = '0'+month;
        	}
			var vm = this;
			let mydata = {"year": year,"month":month};
//			console.log(mydata);
			$.ajax({
				type: 'POST',
				url: getIp()+"train/back/studentStatistics",
				data: mydata,
				dataType: 'json',
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(data) {
					var list = data.data;
					vm.peoplepre = list.ratio;
					if( vm.peoplepre >=0 ){
						vm.peopleup = true;
					}else{
						vm.peopleup = false;
						vm.peoplepre = -vm.peoplepre; 
					}
					
					list.m1 = parseInt(list.m1);
					console.log(typeof list.m1);
					list.m2 = parseInt(list.m2);
					list.m3 = parseInt(list.m3);
					list.m4 = parseInt(list.m4);
					list.m5 = parseInt(list.m5);
					list.m6 = parseInt(list.m6);
					list.m7 = parseInt(list.m7);
					list.m8 = parseInt(list.m8);
					list.m9 = parseInt(list.m9);
					list.m10 = parseInt(list.m10);
					list.m11 = parseInt(list.m11);
					list.m12 = parseInt(list.m12);
					vm.sum = [list.m1,list.m2,list.m3,list.m4,list.m5,list.m6,list.m7,list.m8,list.m9,list.m10,list.m11,list.m12];
					vm.sethighchart(); //柱状图
					vm.currentPeople = vm.sum[month-1];
					var pre = vm.sum[month-2];
				},
				error: function(data) {
					console.log(data);
				},
			});
		},
		getMounth(month) {
			//下拉选择框数据
			var now = new Date();  
			var year = now.getFullYear();
			var id = JSON.parse(sessionStorage.getItem('hongyuan')).data.id;
//			console.log(id);
			var vm = this;
			let mydata = {"year": year,"month": month,"userId":id};
			console.log(mydata);
			$.ajax({
				type: 'POST',
				url: getIp()+ "train/back/payStatistics",
				data: mydata,
				dataType: 'json',
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(data) {
					console.log(data);
					vm.currentMonth = data.data.currentMonth;
					vm.upperMonth = data.data.upperMonth;
					vm.moneypre = data.data.ratio;
					if( vm.moneypre >= 0){
						vm.moneyup = true;
					}else {
						vm.moneypre = -vm.moneypre;
						vm.moneyup = false
					}
				},
				error: function(data) {
					console.log(data.msg);
				},
			});
		},
		//网站浏览量
		see(){
			var vm = this;
			$.ajax({
				type: 'POST',
				url: getIp() + "train/back/accessQuantity",
				dataType: 'json',
				beforeSend: function(xhr){
						xhr.setRequestHeader('token',token);
					},
				success: function(data) {
					vm.vistornum = data.data;
				},
				error: function(data) {
					console.log(data.msg);
				},
			});
		},
		//下拉框选择月份
		selected(){
			var month = $('.radius5 option:selected').val();
			this.getMounth(month);
		},
		sethighchart(data) {
			let vm = this;
			$('#container').highcharts({
				chart: {
					type: 'column'
				},
				title: {
					text: '广东宏远训练营每月招生人数'
				},
				xAxis: {
					categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
				},
				yAxis: {
					labels: {
						formatter: function() {
							if(this.value <= 120) {
								return this.value;
							} else if(this.value > 120 && this.value <= 240) {
								return this.value;
							} else if(this.value > 240 && this.value <= 360) {
								return this.value;
							} else if(this.value > 360 && this.value <= 480) {
								return this.value;
							} else {
								return this.value;
							}
						}
					},
					min: 0,
					title: {
						text: '人数 (人)'
					}
				},
				tooltip: {
					headerFormat: '<span style="font-size:10px">{point.key}月</span><table>',
					pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y} 人</b></td></tr>',
					footerFormat: '</table>',
					shared: true,
					useHTML: true
				},
				plotOptions: {
					column: {
						pointPadding: 0.2,
						borderWidth: 0,
						colorByPoint: true
					}
				},
				series: [{
					name: '报名人数',
					data: vm.sum
				}]
			});
		}
	},
	mounted: function() {
		var ss = JSON.parse(sessionStorage.getItem('hongyuan')).data;
		console.log(ss);
		this.userinfo = {
			account: ss.username,
			pos: ss.type,
			phone: ss.mobile,
			time: ss.createTime.split(':')[0].split(' ')[0],
			address: ss.address,
			img: getIp()+'resources/img/'+ss.imgPath
		},
		this.ajaxs();
//		$('.radius5 option:selected').val();
		 
		var now = new Date();  
		var month = now.getMonth() + 1; 
        	if(month < 10){
        		month = '0'+month;
        	}
//      $(".radius5").find("option[text=9月]").attr("selected",true);
//      document.getElementById("select").options[3].selected = true;
        $("select option[value="+month+"]").attr("selected", "selected");  
		this.getMounth(month);
		this.see();
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
			var now = new Date(num);
			var hours = now.getHours();
			if(hours < 12) {
				return "上午好";
			} else if(hours >= 12 && hours < 18) {
				return "下午好";
			} else {
				return "晚上好";
			}
		},
		money: function (num) {
        var places = 0;
        var thousand = ",";
        var decimal = ".";
        var number = num,
            negative = number < 0 ? "-" : "",
            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
    }
	}
});