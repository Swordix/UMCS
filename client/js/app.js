$(window).load(function() {
/*try {
    setInterval(logicRefreshData, 500);
    setInterval(sensorsRefreshData, 500);
} catch (e) {
    console.log(e.name);
}*/



var $container = $("#desktop"),
    gridWidth = 100,//80
    gridHeight = 100,
    gridRows = 24,
    gridColumns = 24,
    i, x, y;

//loop through and create the grid (a div for each cell). Feel free to tweak the variables above
for (i = 0; i < gridRows * gridColumns; i++) {
    y = Math.floor(i / gridColumns) * gridHeight;
    x = (i * gridWidth) % (gridColumns * gridWidth);
    $("<div/>").css({position:"absolute", border:"1px solid #E1E5EC", width:gridWidth+1, height:gridHeight+1, top:y, left:x}).prependTo($container);
}

var $container2 = $("#desktop_draw"),
    gridWidth2 = 20,
    gridHeight2 = 20,
    gridRows2 = 70,
    gridColumns2 = 70,
    i2, x2, y2;

for (i2 = 0; i2 < gridRows2 * gridColumns2; i2++) {
    y2 = Math.floor(i2 / gridColumns2) * gridHeight2;
    x2 = (i2 * gridWidth2) % (gridColumns2 * gridWidth2);
    $("<div/>").css({position:"absolute", border:"1px solid #E1E5EC", width:gridWidth2+1, height:gridHeight2+1, top:y2, left:x2}).prependTo($container2);
}


instance = jsPlumb.getInstance({
    DragOptions : { cursor: 'pointer', zIndex:2000 },
    ConnectionOverlays : [[ "Arrow", { location:1, width:20, length:20 } ]]
});

instance.ready(function() {
    instance.Defaults.Container = $("#desktop");  
});

instance.bind("connectionDrag", function(connection) {
    
}); 

instance.bind("connection", function (connInfo, originalEvent) {
    var sourceID = connInfo.sourceId,
        targetID = connInfo.targetId,
        widget_source = document.getElementById(sourceID),
        widget_target = document.getElementById(targetID),
        conn = instance.getConnections({source: sourceID, target: targetID}, true);
        

    if (sourceID === targetID){
        toastr.info('Blocks can not operate in closed mode. Help F1');
        instance.detach(connInfo);
    };
    
    if (conn.length > 1){
        toastr.info('Line already exists. Help F1');
        instance.detach(connInfo);
    };
    
    eval(widget_target.name).refresh(targetID);

    if ((conn.length!=0)&&((widget_target.in_net).indexOf(conn[0].sourceId)==-1)){
        $.each(widget_target.in_net, function(i, value) {
            if (value == undefined){
                widget_target.in_net[i] = conn[0].sourceId;
                return false;
            }
        });
    }


});

    
instance.bind("connectionDetached", function(connInfo) {

}); 
    
    
instance.bind("dblclick", function(conn) {
    instance.detach(conn);
    var widget_target = document.getElementById(conn.targetId);
    eval(widget_target.name).disable(conn.targetId);

    $.each(widget_target.in_net, function(i, value) {
        if (widget_target.in_net[i] == conn.sourceId){
            widget_target.in_net[i] = undefined;
            return false;
        }
    });

});

$('.page-container').bind('mousewheel DOMMouseScroll', function(e) {
    var scrollTo = null;
    if (e.type == 'mousewheel') {
        scrollTo = (e.originalEvent.wheelDelta * -1);
    }
    else if (e.type == 'DOMMouseScroll') {
        scrollTo = 40 * e.originalEvent.detail;
    }
    if (scrollTo) {
        e.preventDefault();
        $(this).scrollTop(scrollTo + $(this).scrollTop());
    }
});

dragobj = {
        opacity: .4,
        helper : 'clone',
        appendTo: '#desktop',
        containment :'#desktop',//[left,top,width-17,height-68],
        scroll: false,
        distance: 50,        
        cursor:'move',
        scrollSensitivity: 100,
        scrollSpeed: 30,
        helper: function(event) {
            var data = {id: this.id};
            var wdg = create_widget(data);
            var hwdg = $(wdg).context.firstChild.style.height;
            var wwdg = $(wdg).context.firstChild.style.width;

            return $("<div style='height: "+ hwdg +"; width: "+ wwdg +"'></div>").append(wdg);
        },
        start:function(event, ui){
            $(this).draggable('instance').offset.click = {
                left: Math.floor($(ui.helper[0].lastChild).width() / 2),
                top: Math.floor($(ui.helper[0].lastChild).height() / 2)
            }
        },
        stop: function(event, ui ){
            var data = {
                top: ui.position.top,
                left: ui.position.left,
                id: event.target.id
            };
            create_widget(data, true);
        }
}

$('#desktop').find('div').droppable({
    hoverClass: "ui-state-active",
    drop:function(event, ui){
         if(ui.helper.context!=undefined){
            snapToMiddle(ui.draggable, $(this))
         }else{
            setTimeout(function(){
                snapToMiddle($("#"+ui.helper[0].firstChild.id), $(event.target));
            }, 1);
         }        
    }
});

function snapToMiddle(dragger, target){
    var top=0, left=0;
    if (target.outerHeight(false) - 1 == dragger.outerHeight(false)){
        top = target.position().top ; 
        left = target.position().left ; 
    }else{
        top = target.position().top - (dragger.outerHeight(true) - target.outerHeight(true)) / 2;
        left = target.position().left - (dragger.outerWidth(true) - target.outerWidth(true)) / 2;
    }
    
    dragger.animate({top:top,left:left}, {
        duration:600,
        easing:'easeInOutBack',//'easeOutBack',   
        step: function( now, fx ) {
            instance.repaintEverything(); 
        }
    });
}

//create_items('ADC_12_1');
create_items('OneWire_32');
$(".dragitem").draggable(dragobj).on('dragstart', function (e, ui) {
    $(ui.helper).css('z-index','999999');
});

var left, top, width, height;

var zindex = 10; 

//load_circuit();
function load_circuit(){

    const dataSensor = ajax().get('/config/GET_SENSORS_VALUES')
    var id;
    dataSensor.then(function (response) {
        for(var i in response) {
            $(response[i].child).each(function(p, child) {
                id = ('stub'+'_'+i+'_'+child.sn);
                create_items(id);
            })
        }
    });

    const data = ajax().get('/GET_BLOCK')
    var source, widget_;
    data.then(function (response) {

      for(var i in response) {
            var obj = {
                id: 'stub_'+i, 
                name: response[i].name,
                top: response[i].x,
                left: response[i].y,
                in_net: response[i].in_net[0],
                in_val: response[i].in_val[0]
            };

         create_widget(obj, true);
        }

        $('.w').each(function(i, widget) { //Переберем "w" и создадим связи
    
            var target = widget.id;

            for (var n = 0; n < 4; n++){
                source = widget.in_net[n];
                widget_ = document.getElementById(source);
              
                if (source==target){
                   widget.in_net[n] = null;
                }else{
                   if (source!=undefined){
                        instance.connect({source: widget_, target: target}); 
                   };
                };
            };

        });

    });

    instance.repaintEverything();
};

function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}
var StyleSource = {
    endpoint:"Dot",
    isTarget: false,
    isSource: true,
    anchor: [ 'Continuous', { faces: ['right'] } ],
    //connector:[ "Flowchart", { stub:[10, 20], gap:1, cornerRadius:0, alwaysRespectStubs:true } ],
    connector: ['Flowchart', { 
            stub: [40, 60], 
            cornerRadius: 5, 
            alwaysRespectStubs: true 
    }], 
    paintStyle: basicType.paintStyle,
    connectorStyle: basicType.connectorStyle,
    onMaxConnections: function(info, e) { MaxConn(info.maxConnections);}
}
var StyleTarget = {
    isTarget: true,
    isSource: false,
    anchor: [ 'Continuous', { faces: ['left'] } ],
    endpoint:"Dot", 
    paintStyle:{ radius:0.1 },
    onMaxConnections: function(info, e) { MaxConn(info.maxConnections); }
}

function create_widget(data, create){
        
        var obj = assign_id(data, create);

        widget                              = document.createElement('div');
        widget.id                           = obj.id;
        widget.style.top                    = data.top + 'px';
        widget.style.left                   = data.left + 'px';

        widget.value                        = obj.obj.value;
        widget.name                         = obj.obj.name;
        widget.className                    = obj.obj.class;
        widget.innerHTML                    = obj.obj.inner;

        widget.style.zIndex                 = zindex++;
        widget.in_net                       = [undefined,undefined,undefined,undefined];
        widget.in_val                       = [undefined,undefined,undefined,undefined];

/*        if(obj.obj.type == "sensor"){
            widget.range = [[undefined,undefined],[undefined,undefined],[undefined,undefined]]
        }
*/
        if (data.in_net != undefined){
            widget.in_net = data.in_net;
            widget.in_val = data.in_val;
        }

        if (create){
            $(widget).appendTo('#desktop').show();
        } else { 
            return widget;
        }

        var source = jsPlumb.getSelector(widget);
        var target = jsPlumb.getSelector('.target');
         

        instance.draggable(source, {
                    opacity: .4,
                    handle: '.drag',
                    scroll: true,
                    scrollSensitivity: 150,
                    scrollSpeed: 10,
                   // containment : [left,top,width+95,height-38],
                    containment :'#desktop',
                    stack: widget,
                    zIndex: 7000,
                    distance: 0,
                    delay: 0,
                    start:function(event, ui){
                        $(this).draggable('instance').offset.click = {
                            left: Math.floor($(ui.helper[0]).width() / 2),
                            top: Math.floor($(ui.helper[0]).height() / 2)
                        }
                    },
                    stop: function(event, ui){
                        this.style.zIndex = zindex++;
                    }
        });
         
        instance.makeSource(source, StyleSource,{ filter:".sector",  maxConnections:4 });
        instance.makeTarget(target, StyleTarget,{ maxConnections:4 });

    if ((obj.obj.type=='other')||(obj.obj.type=='logic')) obj.obj.after(widget.id);

};

/*setTimeout(function() { 
    setvalue('ds18b20_0', 30); 
    console.log('timeout') 
    setTimeout(function() { setvalue('schmitt_0', 1); console.log('timeout') }, 1000);
}, 10000);
*/


$('#desktop').on('click', '.add_item', function() {
  var id = $(this).parent()[0].id;
  var wdg = document.getElementById(id);
  var listclass = $('#' + wdg.id + ' .list .list-item');
  var item;
  var int = getRandomInt(1,10000);
  
  for (var i = 0; i < listclass.length; i++) {
    if (rcod(listclass[i].id).child == int){
        break;
    }
  }

  if (listclass.length < 10){ 
      item            = document.createElement('div');
      item.id         = id + "_item_" + getRandomInt(1,10000);
      item.level      = [undefined, undefined];
      item.className  = 'list-item';
      item.innerHTML  = '<div class="button remove_item nodrag"><i class="fa fa-minus"></i></div><span>from - to</span><input type="text" class="form-control range"><div class="ep"></div>';
      $(item).appendTo("#" + id + " .list").slideDown();
      instance.makeSource($("#" + item.id + " .ep"), StyleSource,{maxConnections:4 });

      $( "#" + id + " .list" ).sortable({
        sort: function(e) {
            instance.repaintEverything();
        }
      });

       $("#" + id + " .list" ).disableSelection();

       var obj = eval($("#"+id)[0].name);
       obj.after(item.id);
  }else{
      toastr.info('You reached the maximum number item. Help F1');
  }

});

$('#desktop').on('click', '.remove_item', function() {
    var id = $(this).parent()[0].id;
    var wdg = document.getElementById(id);

    instance.removeAllEndpoints($('#' + id + " .ep"));
    $(this).parent().slideUp({
       duration:500,
       step: function(){ 
          instance.repaintEverything();
       },
       complete: function(){
           $(this).remove();
       }
    });

});



});