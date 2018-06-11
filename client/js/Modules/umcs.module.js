
window.onload = function() {
    $('#desktop').show(1000);
};


var basicType = {
        paintStyle:{ fillStyle:"#5C9BD1",radius:8 },                                          
        connectorStyle: {lineWidth:4, strokeStyle:"#5C9BD1", joinstyle:"round", outlineColor:"transparent", outlineWidth:1}
};

var workType = {
        paintStyle:{ fillStyle:"#26C281",radius:8 },                                                   
        connectorStyle: { lineWidth:4, strokeStyle:"#26C281", joinstyle:"round", outlineColor:"transparent", outlineWidth:1}
};

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function MaxConn(number){
	toastr.info('Maximum number of connections exceeded, maximum number of connections: ' + number +'. Help F1');
}	

function addZeros(n, needLength) {//Десятичные с нулем
  needLength = needLength || 2;
  n = String(n);
  while (n.length < needLength) {
    n = "0" + n;
  }
  return n
}

function OpenWindowCenter(id){//-----------------------------Открываем окна по центру монитора
var i = document.getElementById(id);
	$("#" + i.id).fadeIn("slow");
	i.style.top = parseInt(document.body.offsetHeight - i.offsetHeight)/4+'px';
	i.style.left = parseInt(document.body.offsetWidth - i.offsetWidth)/2+'px';	
};

function assign_id(data, create){//-----------------------------Добавляем элемент в ячейку массива
    var obj         = eval(rcod(data.id)[1]),
        arr         = obj.arr,
        numberMax   = obj.numberMax,
        name        = obj.name,
        id          = '';
    if (numberMax==1){  
        /*for (var i = 0; i < 255; i++) {
            if (arr[i]==undefined) {*/
                id = rcod(data.id)[1]+'_'+rcod(data.id)[2];
                if (create){
                	//arr[i] = id;
               	 	//obj.newid = id;
                 	$('#items_' + id).draggable('disable').addClass('nodroper');
             	}
                return {id: id, obj: obj}
        //    }
       // }
    }else{
        for (var i = 0; i < numberMax; i++) {
            id = name + "_" + i;
            if (arr[i] == undefined) {
            	if (create){
                	arr[i]=id;
                	obj.newid = id;
               	 	$('#items_' + name + ' .num').text(numberMax - free_cells(obj));
                	if (free_cells(obj)==numberMax){
                   		$('#items_' + name).draggable('disable').addClass('nodroper');  
                	};
                };
                return {id: id, obj: obj}
            };
        };
    }
}

function rcod(ident){
    var arr = ident.split('_');	
    return arr;
}

function remove_cells(id){//-----------------------------Удаляем элемент из ячейки массива
	var widget		= eval(id),
		obj         = eval(widget.name),
	    arr			= obj.arr,
	    numberMax	= obj.numberMax,
		name 		= obj.name;

		if (numberMax==1){

			for (var i = 0; i < 255; i++) {
				if (arr[i]==id) {
					arr.splice(i,1,undefined);

					$('#items_' + id).removeClass('nodroper').draggable('enable');
					return;
				}
			}

		}else{

			for (var i = 0; i < numberMax; i++) {
				if (arr[i]==id) {
					arr.splice(i,1,undefined);
					if (free_cells(obj) != numberMax){
						$('#items_' + name).removeClass('nodroper').draggable('enable');
						$('#items_' + name + ' .num').text(numberMax - free_cells(obj));
					};
				};
			};
		};
}

function free_cells(obj){//-----------------------------Возвращает количество свободных ячеек массива. Например container_arr(AND)=3; Значит 3 свободные ячейки из 10 
	var arr	= obj.arr;
	var s 	= 0;
	
	for (var i = 0; i < obj.numberMax + 1; i++) {
		if (arr[i]!=undefined) {
			s++;
		}
	}
	return s;
}

function selStrNum(str){
	var strnum = '';
	var strstr = '';
	for (var i = 0; i < str.length; i++) {
		if( !isNaN(str[i]) ){
			strnum = strnum + str[i]
		}else{
			strstr = strstr + str[i]
		}
	}
	return {num: strnum, str: strstr}
}

function create_items(id_device){
    var name = rcod(id_device)[0];
    var id = id_device;
   
    var obj = eval(name);
    var title = obj.title[0].toUpperCase() + obj.title.substring(1);
    var item = $('<li class="nav-item start dragitem" id="items_' + id + '"><a class="nav-link "><span class="title">'+ title + '</span></a></li>');

    if (obj.type=='sensor'){
        item.prependTo('#sensor');
    }

    $('#items_' + id).draggable(dragobj);
}

function selectidandname(id_device){
    var name, child;
    var arr = id_device.split('_');
    if (arr[0] != "items") {
        name = arr[0];
        child = arr[1];
    }else{
        name = arr[1];
        child = arr[2];
    };

    return {name: name, child: child}
};

function lang(l){
	var obj;
	var request = ajax({
	  method: 'get',
	  url: '/languages/' + l + '.json'
	});

	request.then(function (res) {
		for (key in res) {
			$('body').find("[lng]").each(function (){
				var lng = $(this).attr('lng');
				var seeking = '['+ key +']';
				var el = $(this);
				if (lng==seeking){
					el.context.lastChild.textContent=' '+ res[key];
				};
			});
		};
	});
};

function setvalue(id, value){
	var widget = document.getElementById(id);
	
		if 	((widget!=null)||(value != undefined)){

			if ((value != null)||(value != undefined)){
				widget.value = value;

				eval(widget.name).refresh(id);
				if (value>=1) {

						instance.select({source:id}).each(function(connection) {
							connection.endpoints[0].setPaintStyle(workType.paintStyle);
							connection.setPaintStyle(workType.connectorStyle);
						});
						widget.lastChild.style.backgroundColor = workType.paintStyle.fillStyle;

						ghost();
				}else{
						instance.select({source:id}).each(function(connection) {
							connection.endpoints[0].setPaintStyle(basicType.paintStyle);
							connection.setPaintStyle(basicType.connectorStyle);
						});
						widget.lastChild.style.backgroundColor = basicType.paintStyle.fillStyle;
				};
			};
		};
};

function ghost(){
	
}

$('#saveall').click(function(e) {
	save(link_circuit(), true);
})

function save(data, msg){
	var request = ajax({
	  method: 'get',
	  url: '/SET_BLOCK',
	  data: JSON.stringify(data)
	});

	request.then(function (response) {
		if (msg) toastr.info(response);
	});
}

function link_circuit(){
	var data=[];

	$('.w').each(function(i,elem) {
		data.push(link_widget(elem.id));
	});
	return data;
}

function link_widget(id){
	var widget = document.getElementById(id);

	var data = {
		id: widget.id,
		name: widget.name,
		x: widget.offsetTop,
		y: widget.offsetLeft,
		in_net: [widget.in_net[0], widget.in_net[1], widget.in_net[2], widget.in_net[3]],
		in_val: [widget.in_val[0], widget.in_val[1], widget.in_val[2], widget.in_val[3]]
	};

	return data;
}

$('#mode-switch').on('switchChange.bootstrapSwitch', function (event, state) {
    var x=$(this).data('on-text');
    var y=$(this).data('off-text');
    if($("#mode-switch").is(':checked')) {
        $('.page-title h1')[0].innerHTML='Space for drawing  <small>drag blocks here</small>';
        $('#desktop').show();
        $('#desktop_draw').hide();
        $('#logic').show();
        $('#tools').hide();
        
      } else {
        $('.page-title h1')[0].innerHTML='Draw a plan of your room here  <small>drag blocks here</small>';
        $('#desktop').hide();
        $('#desktop_draw').show();
        $('#logic').hide();
        $('#tools').show();
    }
});

$('#clearall').click(function(e) {
	toastr.warning('Clear all?<br />(click here to clear all)', 'Warning!', { 
		onclick: function () { 
   		 	$('.w').each(function(i,elem) {
   		 		instance.removeAllEndpoints(elem);
   		 		$(this).effect("fade", function() {
                    remove_cells(elem.id);
                    $(this).remove();
                }); 
   		 	})
   		}
	})
});
