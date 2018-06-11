
var adc = function() {//АЦП
	var arr = [];
	var bar;

    return {
    	arr: arr,
    	newid: '',
		name: "adc",
		maxVal: 30,
		minVal: 0,
		fromVal:0,
		toVal: 5,
		title: "analog-to-digital",
		type: "sensor",
		class:'w',
		numberMax :1,
		after: function (){
			  bar = new ProgressBar.Line('#'+ this.newid +' .progressbar', {
			  strokeWidth: 4,
			  easing: 'easeInOut',
			  duration: 1400,
			  color: '#FFEA82',
			  trailColor: '#eee',
			  trailWidth: 1,
			  svgStyle: {width: '100%', height: '100%'},
			  from: {color: '#26C281'},
			  to: {color: '#ed5565'},
			  step: (state, bar) => {
			    bar.path.setAttribute('stroke', state.color);
			    $('#'+ this.newid +' h1').text(Math.round(bar.value() * 30) + 'v.');
			  }
			});
		},
		refresh: function (id){
			var widget = document.getElementById(id);
			bar.animate(widget.value / 30);
		},
		inner: '<div class="block drag"><div class="ic"><i class="fa fa-sitemap"></div></i><h4>ADC</h4><h6>sensor block</h6><h1 style="position: relative; bottom: 28px; color: #E1E5EC;text-align: center;">0</h1><div class="progressbar"></div><div class="anl_sector"></div></div>'
		};
}();

//****************************************************************************//
//										1-wire
//****************************************************************************//
var ds18b20 = function() {//DS18B20
	var arr = [];
	var bar;
		
    return {
    	arr: arr,
    	newid: '',
		name: "ds18b20",
		maxVal: 90,
		minVal: -70,
		fromVal:20,
		toVal: 30,
		value: 0,
		title: "1-wire temperature probes (DS18B20)",
		type: "sensor",
		class:'w',
		numberMax :1,
		after: function (){
			  bar = new ProgressBar.Line('#'+ this.newid +' .progressbar', {
			  strokeWidth: 4,
			  easing: 'easeInOut',
			  duration: 1400,
			  color: '#FFEA82',
			  trailColor: '#eee',
			  trailWidth: 1,
			  svgStyle: {width: '100%', height: '100%'},
			  from: {color: '#26C281'},
			  to: {color: '#ed5565'},
			  step: (state, bar) => {
			    bar.path.setAttribute('stroke', state.color);
			    $('#'+ this.newid +' h1').text(Math.round(bar.value() * 30) + '°C');
			  }
			});

		},
		refresh: function (id){
			var widget = document.getElementById(id);
			bar.animate(widget.value / 30);
		},
		inner: '<div class="block drag"><div class="ic"><i class="fa fa-sitemap"></div></i><h4>18b20</h4><h6>sensor block</h6><h1 style="position: relative; bottom: 28px; color: #E1E5EC;text-align: center;">0°C</h1><div class="progressbar"></div><div class="anl_sector"></div></div>'
		};
}();
