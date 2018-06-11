
var ADC = function() {//АЦП
	var arr = [];
	var bar;

    return {
    	arr: arr,
		name: "ADC",
		maxVal: 30,
		minVal: 0,
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
		disable: function (id){
			return;
		},
		inner: '<div class="block drag"><div class="ic"><i class="fa fa-sitemap"></div></i><h4>ADC</h4><h6>sensor block</h6><h1 style="position: relative; bottom: 28px; color: #E1E5EC;text-align: center;"></h1><div class="progressbar"></div></div><div class="anl_sector"></div>'
		};
}();

//****************************************************************************//
//										1-wire
//****************************************************************************//
var OneWire = function() {//ds18b20
	var arr = [];

    return {
    	arr: arr,
		name: "OneWire",
		maxVal: 90,
		minVal: -70,
		title: "1-wire temperature probes (DS18B20)",
		type: "sensor",
		class:'w',
		numberMax :1,
		after: function (id){
			var item_wdg = document.getElementById(id);
			$("#" + id + ' input').inputmask({
				mask: "(+)|(-)99 to: (+)|(-)99"
			});

		},
		refresh: function (id){

		},
		disable: function (id){
			return;
		},

		inner: '<input type="text" class="name" maxlength="35" placeholder="name (click left mouse)" placehide="name (click left mouse)"><div class="block drag sensor" style="width: 210px;"><div class="ic"><i class="fa fa-sitemap"></i></div><div class="context"><h3 class="list-title">0</h3><span style="margin: 0px 0px 0px 50px; font-size: 12px;">temperature sensor</span></div></div><div class="button add_item" style="background-color: #44b6ae;"><i class="fa fa-plus"></i></div><div class="list"></div></div>'

	};
}();

//**************************************************************************************************************************************************//
//
//**************************************************************************************************************************************************//
	
var clock = function() {//Часы
	var arr = [];

    return {
    	arr: arr,
		name:"clock",
		title: "clock module",
		type: "sensor",
		class:'w',
		numberMax :1,
		after: function (id){
			var item_wdg = document.getElementById(id);
			$("#" + id + ' input').inputmask({
				alias: "datetime",
				mask: "h:s:s - h:s:s",
				placeholder: "hh:mm:ss - hh:mm:ss"
			});

		},
		refresh: function (id){
			
		},
		disable: function (id){
			return;
		},
		inner: '<div class="block drag sensor" style="width: 210px;"><div class="ic"><i class="fa fa-sitemap"></i></div><div class="context"><h3 class="list-title">00:00:00</h3><span style="margin: 0px 0px 0px 50px; font-size: 12px;">clock sensor</span></div></div><div class="button add_item" style="background-color: #44b6ae;"><i class="fa fa-plus"></i></div><div class="list"></div></div>'
		};
}();



//**************************************************************************************************************************************************//
//
//**************************************************************************************************************************************************//

function sensorsRefreshData(){
    var data = ajax().get('/config/GET_SENSORS_VALUES/');
    var id, obj, widget, s, not='';
    data.then(function (response) {
        for(var i in response) {
        	for (var n=0; n < response[i].child.length; n++){
        		try {
	        		id = i + '_' + response[i].child[n].sn;
	        		obj = eval(id);
	        		value = response[i].child[n].data;
	        		setvalue(id, value);
		        } catch (e) {
				    not = not + ', '+ id ;
				}

			}
        }

        //if (not!='') console.log('items were not found:' + not.substring(1));
    });
}