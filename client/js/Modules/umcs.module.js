
var basicType = {
        paintStyle:{ fill:"#5C9BD1", outlineStroke:"transparent", outlineWidth:1, radius:8 },                                     
        connectorStyle: { stroke:"#5C9BD1", outlineStroke:"transparent", strokeWidth: 4}//{lineWidth:4, strokeStyle:"#5C9BD1", joinstyle:"round", outlineColor:"transparent", outlineWidth:12}
};

var workType = {
        paintStyle:{ fillStyle:"#F3C200",radius:8 },                                                   
        connectorStyle: { lineWidth:4, strokeStyle:"#F3C200", joinstyle:"round", outlineColor:"transparent", outlineWidth:12}
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

function refreshConn(id){
	var widget_target = document.getElementById(id);
	var in_net = widget_target.in_net;
    var connTarget = instance.getConnections({target:id, scope:["digital","analog"]}, true);
    in_net.length=0; 
    $.each(connTarget, function(index, value) {
        in_net[index] = value.sourceId
    });
}

function assign_id(data){//-----------------------------Добавляем элемент в ячейку массива
	var obj         = eval(data.name);
	var arr			= obj.arr,
	    numberMax	= obj.numberMax;
		name 		= obj.name;
			
	if (numberMax==1){	
			for (var i = 0; i < 255; i++) {
				if (arr[i]==undefined) {
					arr[i] = name + '_' + data.count;
					$('#items_' + arr[i]).draggable('disable').addClass('nodroper');
					obj.newid = arr[i];
				return arr[i];		
				}
			}
	}
	else
		{
			for (var i = 0; i < numberMax; i++) {
				var id = name + "_" + i;
				if (arr[i]==undefined) {
					arr[i]=id;
					$('#items_' + name + ' .num').text(numberMax - free_cells(obj));
					if (free_cells(obj)==numberMax){
						$('#items_' + name).draggable('disable').addClass('nodroper');	
					};
				return id;		
				};
			};
	 };
};

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
					if (free_cells(obj) == numberMax)
						$('#items_' + name).removeClass('nodroper').draggable('enable');
					else
						$('#items_' + name + ' .num').text(numberMax - free_cells(obj));
				}
			}
	}
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

function create_items(id_device){
    var name = selectidandname(id_device).name;
    var obj = eval(name);
    var title = obj.title[0].toUpperCase() + obj.title.substring(1);
    var item = $('<li class="nav-item start dragitem" id="items_' + name + '_' + obj.arr.length + '"><a class="nav-link "><span class="title">'+ title + '</span></a></li>');

    if (obj.type=='sensor'){
        item.prependTo('#sensor');
    }
}

function selectidandname(id_device){
    var name, count;
    var arr = id_device.split('_');
    if (arr[0] != "items") {
        name = arr[0];
        count = arr[1];
    }else{
        name = arr[1];
        count = arr[2];
    };

    return {name: name, count: count}
};



function setvalue(id, value){
	var widget = document.getElementById(id);
		if 	((widget!=null)||(value != undefined)){

			if ((value != null)||(value != undefined)){
				widget.value = value;
				eval(widget.name).refresh(id);

				if (value>=1) {
						instance.select({source:id, scope:"digital"}).setPaintStyle(workType.connectorStyle);
						instance.selectEndpoints({source:id, scope:"digital"}).setPaintStyle(workType.paintStyle);
						widget.lastChild.style.backgroundColor = workType.paintStyle.fillStyle;
				}else{
						instance.select({source:id, scope:"digital"}).setPaintStyle(basicType.connectorStyle);
						instance.selectEndpoints({source:id, scope:"digital"}).setPaintStyle(basicType.paintStyle);
						widget.lastChild.style.backgroundColor = basicType.paintStyle.fillStyle;
				}
			}
		}
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

function region(event, ui, element){
    var arr = [];
            var objw = event.target.getBoundingClientRect().width;
            var objh = event.target.getBoundingClientRect().height;
            var leftObj = ui.offset.left;
            var topObj = ui.offset.top;
            var rightObj = leftObj + objw;
            var bottomObj = topObj + objh;

            var el  = document.getElementsByClassName('square');

            for (var i = 0; i < el.length; i++){
                 var rect = $(el[i]);
                 var leftRect = rect.position().left;
                 var topRect = rect.position().top;
                 var rightRect = leftRect + el[i].getBoundingClientRect().width;
                 var bottomRect = topRect + el[i].getBoundingClientRect().height;
                 $('#'+rect[0].id).css( "opacity", 1);

                 if ((topObj >= topRect && topObj <= bottomRect) || (bottomObj >= topRect && bottomObj <= bottomRect) ||
                        (topObj <= bottomRect && bottomObj >= bottomRect))

                 if ((leftObj > leftRect && leftObj < rightRect) || (rightObj > leftRect && rightObj < rightRect) || 
                  (leftObj <  rightRect && rightObj > rightRect)) {
                    
                    
                    arr.push({'leftRect': leftRect, 'rightRect': rightRect, 'topRect': topRect, 'bottomRect': bottomRect});
                    $('#'+rect[0].id).css( "opacity", 0);
                 };

            };

                   var u = (arr[0].topRect + arr[arr.length-1].bottomRect) / 2 - (objh / 2) - 85;
                   var d = ((arr[0].leftRect + arr[arr.length-1].rightRect) / 2) - (objw / 2) ;
                   $( element ).animate({ top:u, left:d}, { step: function( now, fx ) { instance.repaintEverything(); }});
/*                 $(element).animate({top:u, left:d},{duration:600,easing:'easeOutBack'}, function() {
     instance.repaintEverything();
  });*/


}

$('#clearall').click(function(e) {
	toastr.warning('Clear all?<br />(click here to clear all)', 'Warning!', { 
		onclick: function () { 
   		 	$('.w').each(function(i,elem) {
   		 		instance.removeAllEndpoints(elem);
   		 		$(this).effect("fade" , function() {
                    remove_cells(elem.id);
                    $(this).remove();
                }); 
   		 	})
   		}
	})
});