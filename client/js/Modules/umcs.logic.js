//Объекты

var and = function() {//И
	var arr = [];

    return {
    	arr: arr,
		name: "and",
		type: "logic",
		class:'w target',
		numberMax :10,
		after: function (){
			return;
		},
		refresh: function (id){
			return;
		},
		disable: function (id){
			return;
		},
		inner: '<div class="block drag" style="height: 80px; width: 80px;"><div class="ic"><i class="fa fa-sitemap"></i></div><h4>AND</h4><h6>logic block</h6></div><div class="ghost"></div><div class="sector"></div>'																																
		};
}();
//**************************************************************************************************************************************************//
//
//**************************************************************************************************************************************************//

var or = function() {//ИЛИ
	var arr = [];
		
    return {
    	arr: arr,
		name:"or",
		type: "logic",
		class:'w target',
		numberMax :10,
		after: function (){
			return;
		},
		refresh: function (id){
			return;
		},
		disable: function (id){
			return;
		},
		inner: '<div class="block drag" style="height: 80px; width: 80px;"><div class="ic"><i class="fa fa-sitemap"></i></div><h4>OR</h4><h6>logic block</h6></div><div class="sector"></div>'																																
		};
}();
//**************************************************************************************************************************************************//
//
//**************************************************************************************************************************************************//

var inv = function() {//Инвертор
	var arr = [];
		
    return {
    	arr: arr,
		name:"inv",
		type: "logic",
		class:'w target',
		numberMax :10,
		after: function (){
			return;
		},
		refresh: function (id){
			return;
		},
		disable: function (id){
			return;
		},
		inner: '<div class="block drag" style="height: 80px; width: 80px;"><div class="ic"><i class="fa fa-sitemap"></i></div><h4>inverter</h4><h6>logic block</h6></div><div class="sector"></div>'
		};
}();
//**************************************************************************************************************************************************//
//
//**************************************************************************************************************************************************//

/*var schmitt = function() {//Триггер шмитта
	var arr = [];

    return {
    	arr: arr,
    	newid: '',
		name:"schmitt",
		type: "logic",
		class:'w arena_target',
		numberMax :10,
		after: function (){

			var widget = document.getElementById(this.newid);

			$('#'+ this.newid + " .range_1").ionRangeSlider({
				type:"double",
				grid:true,
				step:1,
				min:0,
				max:0,
				from:0,
				to:0,
				disable: true,
			    onChange: function (data) {
			        widget.in_val[0] = data.from;
			        widget.in_val[1] = data.to;
			    }
			});

			$('.range' ).removeClass('hide');

		},
		refresh: function (id){
			var widget = document.getElementById(id);
			var conn = instance.getConnections({target: id, scope:["analog"]}, true);
			var sourceId = document.getElementById(conn[0].sourceId);
			var maxVal = eval(sourceId.name).maxVal;
			var minVal = eval(sourceId.name).minVal;

			if (widget.in_val[0]!=undefined) fromVal = widget.in_val[0]; else fromVal = eval(sourceId.name).fromVal;
			if (widget.in_val[1]!=undefined) toVal = widget.in_val[1]; else toVal = eval(sourceId.name).toVal;

			var fromVal, toVal;
			var slider = $("#" + id + " .range_1").data("ionRangeSlider");

			slider.update({
				disable: false,
			    max: maxVal,
			    min: minVal,
			    from: fromVal,
			    to: toVal
			});

			widget.in_val[0] = fromVal;
			widget.in_val[1] = toVal;

			slider.reset();
		},
		disable: function (id){
			var slider = $("#" + id + " .range_1").data("ionRangeSlider");
			slider.update({
				disable: true,
			    max: 0,
			    min: 0,
			    from:0,
			    to:0
			});
		},
		inner: '<div class="block drag" style="width: 150px; height: 120px;"><div class="ic"><i class="fa fa-sitemap"></div></i><h4>Schmitt Trigger</h4><h6>logic block</h6></div><div class="range hide"><input class="range_1" type="text" value="" /></div><div class="sector"></div>'		
		};
}();*/
//**************************************************************************************************************************************************//
//
//**************************************************************************************************************************************************//

var rs = function() {//Переключатель
	var arr = [];
	
    return {
    	arr: arr,
		name:"rs",
		type: "logic",
		class:'w',
		numberMax :3,
		inner: '<div class="cd-app card" style="width: 220px; height: 150px;"><header>Переключатель<span class="pull"></span><a class=""><i class="mdi-action-trending-neutral dig_drop" title="Связать блоки"></i></a><a><i class="mdi-image-tune pm" title="Меню"></i></a><ul class="wdg_menu"><li class="delwdg">Удалить</li><li>Справка</li></ul>	</header><div class="curtain"></div><div style="position: absolute;"><div class="rs_r">Сброс состояния</div></div></div>'
		};
}();
//**************************************************************************************************************************************************//
//
//**************************************************************************************************************************************************//
	
var timer = function() {//Таймер
	var arr = [];

    return {
    	arr: arr,
		name:"timer",
		type: "logic",
		class:'w target',
		numberMax :3,
		after: function (){
			$(".touchspin").TouchSpin({min:0,max:60,step:1,decimals:0,boostat:5,maxboostedstep:10,postfix:""})
			$('.touchspin').removeClass('hide');
		},
		refresh: function (id){
			return;
		},
		disable: function (id){
			return;
		},
		inner: '<div class="block drag" style="width: 150px; height: 200px;"><div class="ic"><i class="fa fa-sitemap"></div></i><h4>Timer</h4><h6>logic block</h6></div><div class="inps"><form action="#"><div style="padding: 0; margin-bottom: 5px;" class="mt-radio-inline"><label style="color: #fff;" class="mt-radio mt-radio-outline">Front<input type="radio" value="1" name="test" checked><span style="background: #fff; border: none; height: 16px; width: 16px;"></span></label><label style="color: #fff;" class="mt-radio mt-radio-outline">Recession<input type="radio" value="1" name="test"><span style="background: #fff; border: none; height: 16px; width: 16px;"></span></label><label style="color: #fff;" class="mt-radio mt-radio-outline">Chang. Signal<input type="radio" value="1" name="test"><span style="background: #fff; border: none; height: 16px; width: 16px;"></span></label></div><input class="hide touchspin" type="text" value="55" name="demo1" class="form-control"></form></div><div class="sector"></div>'	
		};
}();


//**************************************************************************************************************************************************//
//
//**************************************************************************************************************************************************//
	
var text = function() {//Текстовое поле
	var arr = [];

    return {
    	arr: arr,
		name:"text",
		type: "other",
		class:'w',
		numberMax :10,
		after: function (){
			$('.text').autosizeInput();

			$('.text').click(function(e) {
				this.focus();
			});
		},
		refresh: function (id){
			return;
		},
		disable: function (id){
			return;
		},
		inner: '<div class="block drag" style="min-height: auto;"><input type="text" class="text" maxlength="90" placeholder="Text field" placehide="Text field"></div>'	
		};
}();
//**************************************************************************************************************************************************//
//
//**************************************************************************************************************************************************//

function logicRefreshData(){
    var data = ajax().get('/config/GET_BLOCKS_VALUES/');
    var name, obj, widget, s, not='';
    data.then(function (response) {
        for(var i in response) {
        	name = i;
        	try {
	        	obj = eval(name);
	        	for (var n = 0; n < obj.arr.length; n++){
	        		if (obj.arr[n] != undefined){
	        			s = (obj.arr[n]).toString();
	        			setvalue(s, response[i][0][s]);
	        		}
	        	}
	        } catch (e) {
			    not = not + ', '+ name ;
			}
        }

        if (not!='') console.log('items were not found:' + not.substring(1));
    });

}
