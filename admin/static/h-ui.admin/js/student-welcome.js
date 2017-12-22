/**
 * 首页信息
 * 
 * */
new Vue({
	el: '#app',
	data: {
		nowtime: Date.parse(new Date()),
		students: {},
		school: {},
		headImg:''
	},
	methods: {
		
	},
	mounted: function() {
		this.students = JSON.parse(sessionStorage.getItem('student')).data;
		this.school = JSON.parse(sessionStorage.getItem('student')).school;
		console.log(this.school);
		console.log(this.students);
		this.headImg = this.students.headImgPath;
		console.log(this.headImg);
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