var max = 0,
	min = 100000,
	minTime = 1478568600000,
	maxTime = 1478588400000;

//将日期格式转换为时间戳
for (var i = 0; i < dataList.length; i++) {
	var datas = dataList[i][0].toString().replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/g, "$1/$2/$3 $4:$5");
	var timeReg = new Date(datas).getTime();
	dataList[i].splice(0, 1, timeReg)

	//计算最新价最大值和最小值
	max = parseFloat(dataList[i][1]) > max ? parseFloat(dataList[i][1]) : max;
	min = parseFloat(dataList[i][1]) < min ? parseFloat(dataList[i][1]) : min;
	//console.log(max+','+min)
	//console.log(dataList)
}

//午休时间节点
var breakss = [{
	from: 1478575800000,
	to: 1478581260000
}];

//X轴时间分布
var positions = [1478568600000, 1478572200000, 1478575800000,1478581200000, 1478584800000, 1478588400000];

$(function() {
	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	});
	// 创建图表
	$('#container').highcharts('StockChart', {
		chart: {
			events: {
				load: function() {
					// set up the updating of the chart each second
					var series = this.series[0];
					var j = 0
					var lineDo = setInterval(function() {
						if (j >= dataList.length) {
							clearInterval(lineDo);
						}
						j += 1;
						var x = dataList[j][0],
							y = dataList[j][1];
						// var x = (new Date()).getTime(),
						//     y = Math.round(Math.random() * 100);
						// console.log(x)
						// console.log(y)
						series.addPoint([x, y], true, false);
					}, 1000);
				}
			}
		},
		series:{
			point:{
				events: function(){
					console.log(series)
				}
			}
		},
		rangeSelector: {
			enabled: false
		},
		title: {
			text: '分时图demo'
		},
		credits: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		series: [{
			name: 'Random data',
			lineWidth: 1,
			data: (function() {
				var data = [];
				// time = minTime,
				// i;
				// for (i = -10; i <= 0; i += 1) {
				//     data.push([
				//         time + i * 1000,
				//         Math.round(Math.random() * 100)
				//     ]);
				// }
				// console.log(data)
				return data;
			}())
		}],
		xAxis: {
			tickInterval: 60 * 1000 * 60,
			min: minTime,
			max: maxTime,
			gridLineColor: '#ccc',
			gridLineDashStyle: 'dotted',
			gridLineWidth: 1,
			tickColor: '#000',
			lineColor: '#ccc',
			crosshair: { //添加十字轴垂直于x轴的直线
				label: {
					enabled: true,
					padding: 3,
					formatter: function(e) {
						return Highcharts.dateFormat("%H:%M", e);
					},
					borderWidth: 1,
					backgroundColor: "red",
					style: {
						"color": "white"
					}
				},
				color: 'black', //十字轴的颜色
				dashStyle: 'dash'
			},
			breaks: breakss, //上午场最终时间无缝连接下午场开始时间
			tickPositioner: function() {
				return positions;
			},
			labels: {
				formatter: function() {
					var tt = Highcharts.dateFormat("%H:%M", this.value);
					if (tt == "11:30")
						tt = "11:30/13:00";
					return tt;
				}
			}
		},
		yAxis: [{ //y轴右
			allowDecimals: true,
			gridLineWidth: 1,
			opposite: true,
			labels: {
				formatter: function() {
					if (this.value > 100000)
						this.value = close;
					if (this.value > 10000)
						var vDate = Math.ceil(this.value);
					else if (this.value >= 100)
						var vDate = parseFloat(this.value).toFixed(2);
					else
						var vDate = parseFloat(this.value).toFixed(4);
					return vDate;

				}
			},
			plotLines: [{ //开盘价
				color: 'red',
				dashStyle: 'dash',
				value: 6500.0,
				width: 1,
				zIndex: 99
			}],
			tickPositioner: function() {
				var ypositions = [];
				var inc = max - min;
				var increment = Number((inc) / 5);
				var tickMin = Number(min),
					tickMax = Number(max);
				var i = 0;
				var tick = Number(min) - increment * 3 / 2;
				for (i; i < 7; i++) {
					tick += increment;
					ypositions.push(Number(tick).toFixed(4));

					if (tick > max)
						break;
				}
				// console.log(ypositions)
				return ypositions;
			},
			gridLineColor: '#ccc',
			crosshair: { //添加十字轴垂直于y轴的直线
				label: {
					enabled: true,
					padding: 3,
					formatter: function(e) {
						return e;
					},
					borderWidth: 1,
					backgroundColor: "red",
					style: {
						"color": "white"
					}
				},
				color: 'black', //十字线的颜色
				dashStyle: 'dash'
			}
		}, { //y轴左
			allowDecimals: true,
			opposite: false,
			labels: {
				align: 'left',
				x: 10,
				formatter: function() {
					if (this.value > 100000)
						this.value = lastClose;
					var vDate = parseFloat((this.value - lastClose) * 100 / lastClose).toFixed(2);
					return vDate + "%";
				}
			},
			tickPositioner: function() {
				var ypositions = [];

				var inc = max - min;

				var increment = Number((inc) / 5);

				var tickMin = Number(min),
					tickMax = Number(max);

				var i = 0;
				var tick = Number(min) - increment * 3 / 2;
				for (i; i < 7; i++) {
					tick += increment;

					ypositions.push(Number(tick).toFixed(4));

					if (tick > max)
						break;
				}
				return ypositions;
			}
		}],
		scrollbar: {
			enabled: false
		},
		navigator: {
			adaptToUpdatedData: false,
			enabled: false
		},
		tooltip: {
			formatter: function(e) {
				var hours = new Date(this.x).getHours();
				var minutes = new Date(this.x).getMinutes();
				if (hours < 8) {
					hours = hours + 24
				}
				if (this.y >= 100) {
					var fixed = 2;
				} else {
					var fixed = 4;
				}
				var html = '<span>' + Highcharts.dateFormat("%H:%M", this.x) + '</span><br/> 现  价:' + this.y + '<br/> 涨  跌：' + (this.y - lastClose).toFixed(fixed) + '<br/>涨跌幅：' + ((this.y - lastClose) * 100 / lastClose).toFixed(2) + "%";
				return html;
			}
		}
	});

	var charts = $('#container').highcharts();
	// console.log(charts.yAxis[0])
		//获取图表的临界数据
	var extremes = charts.yAxis[0].getExtremes();

	var datamm = charts.series[0].points;

	//series内数据的最大最小值
	var dataMax = extremes.dataMax;
	var dataMin = extremes.dataMin;

	var point;
	var pointmax;

	datamm.forEach(function(e) {
		var abs = Math.abs(e.y - dataMin);
		if (abs == 0) {

			point = e;
		}
		var absm = Math.abs(e.y - dataMax);
		if (absm == 0) {

			pointmax = e;
		}
	});
	if (pointmax)
		charts.renderer.text(pointmax.y, pointmax.plotX + charts.plotLeft, pointmax.plotY + charts.plotTop - 10).attr({
			id: "max",
			zIndex: 5
		}).add();
	if (point)
		charts.renderer.text(point.y, point.plotX + charts.plotLeft, point.plotY + charts.plotTop + 10).attr({
			id: "min",
			zIndex: 5
		}).add();
});