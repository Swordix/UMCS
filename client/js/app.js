$(window).load(function() {

Instance = jsPlumb.getInstance({
    DragOptions : { cursor: 'pointer', zIndex:2000 },
    ConnectionOverlays : [[ "Arrow", { location:1, width:20, length:20 } ]],
});

Instance.bind("connection", function (connInfo, originalEvent) {
    var sourceID = connInfo.sourceId,
        targetID = connInfo.targetId,
        widget_source = document.getElementById(sourceID),
        widget_target = document.getElementById(targetID),
        conn = Instance.getConnections({source: sourceID, target: targetID, scope:["digital","analog"]}, true);
        
      
    if (sourceID === targetID){
        toastr.info('Blocks can not operate in closed mode. Help F1');
        Instance.detach(connInfo);
    };
    
    if (conn.length > 1){
        toastr.info('Line already exists. Help F1');
        Instance.detach(connInfo);
    };

    eval(widget_target.name).refresh(targetID);

    refreshConn(targetID);      
});
    
Instance.bind("dblclick", function(conn) {
    Instance.detach(conn);
    refreshConn(conn.targetId);
    var widget = document.getElementById(conn.targetId);
    eval(widget.name).disable(conn.targetId);
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

create_items('adc_12');
create_items('ds18b20_11');

$(".dragitem").draggable({
        opacity: .4,
        helper : 'clone',
        appendTo: '#desktop',
        containment : [left,top,width-17,height-68],
        cursor:'move',
        scrollSensitivity: 100,
        scrollSpeed: 30,
        helper: function() {
            var id_items = this.id;
            var data = {name: selectidandname(id_items).name};
            return $("<div></div>").append(create_widget(data));
        },
        start:function(){$(this).stop(true,true);},
        stop: function(event, ui){
            var id_items = event.target.id;
            var data = {
                top: ui.position.top,
                left: ui.position.left,
                name: selectidandname(id_items).name, 
                count: selectidandname(id_items).count              
            };
           create_widget(data, true)
        }       


});



var left, top, width, height;

$( '.page-content' ).UMCSdroppable({
    grid: [20,20],
    size: [130,130],
   // fill: 'transparent',
  //  stroke: 'transparent',
    coordinates: function(b, data) {
        left = data.left;
        top = data.top;
        width = data.width;
        height = data.height;
    }
});


var zindex = 10; 

//load_circuit();

function load_circuit(){
    const data = ajax().get('/GET_BLOCK')

    data.then(function (response) {

      for(var i in response) {
            var obj = {
                id: response[i].id, 
                name: response[i].name, 
                top: response[i].x,
                left: response[i].y,
                in_net: response[i].in_net[0],
                in_val: response[i].in_val[0]
            };

         create_widget(obj, true);
        }

        $('.w').each(function(i, widget) {
            var target = widget.id;

            for (var n=0; n<4; n++){
                var source = widget.in_net[n];
                if (source!=undefined){
         
                    
                    instance.connect({source: source, target: target} );
                    console.log(source);
                    
                }
            }

        })

       // setvalue('inverter_0', 1);

    })
}

var StyleSourceDigital = { 
    filter:".sector",
    scope:"digital",
    endpoint:"Dot",
    anchor: [ 'Continuous', { faces: ['right'] } ],
    connector:[ "Flowchart", { stub:[10, 30], gap:1, cornerRadius:0, alwaysRespectStubs:true } ],
    paintStyle: basicType.paintStyle,
    connectorStyle : basicType.connectorStyle,
    maxConnections:4,
    onMaxConnections: function(info, e) { MaxConn(4) }
};

var StyleTargetDigital = { 
    scope:"digital",
    endpoint:"Dot",
    anchor: [ 'Continuous', { faces: ['left'] } ],
    connector:[ "Flowchart", { stub:[10, 30], gap:1, cornerRadius:0, alwaysRespectStubs:true } ],
    paintStyle:{ radius:0.1 },
    maxConnections:4,
    onMaxConnections:function(info, e) {MaxConn(4)}
};

function create_widget(data, create){
        obj = eval(data.name);
        var id;

        if (data.id != undefined) id = data.id;
        else
        if (create) id = assign_id(data); else id = 'dragdiv';
       
        widget                              = document.createElement('div');
        widget.id                           = id;
        widget.style.top                    = data.top + 'px';
        widget.style.left                   = data.left + 'px';
        widget.value                        = obj.value;
        widget.name                         = obj.name;
        widget.style.zIndex                 = zindex++;

        widget.className                    = obj.class;
        widget.innerHTML                    = obj.inner;

        if (data.id == undefined){
            widget.in_net = [undefined,undefined,undefined,undefined];
            widget.in_val = [undefined,undefined,undefined,undefined];
        }else{
            widget.in_net = data.in_net;
            widget.in_val = data.in_val;
        }

        var source = jsPlumb.getSelector(widget);

        if (create){
            $(widget).appendTo('#desktop').show();
        } else { 
            return widget;
        }

        var SelDig        = jsPlumb.getSelector('.dig_target');
        var SelAnl        = jsPlumb.getSelector('.arena_target');

/*        var SelDigitalTarget        = jsPlumb.getSelector('.dig_target');
        var SelAnalogTarget         = jsPlumb.getSelector('.anl_target');
        var SelDigitalTargetANDOR   = jsPlumb.getSelector('.anl_target_ANDOR');
        var SelStatisticTarget      = jsPlumb.getSelector('.statistic_target');
        var rs                      = jsPlumb.getSelector('.rs');
        var rs_r                    = jsPlumb.getSelector('.rs_r');*/
        
        $(widget).draggable({
                    handle: '.drag',
                    cancel: ".sector",
                    scroll: true,
                    scrollSensitivity: 150,
                    scrollSpeed: 10,
                    containment : [left,top,width-17,height-68],
                    stack: widget,
                    zIndex: 7000,
                    drag: function(event,ui){
                        Instance.repaintEverything();
                    },
                    stop: function(event, ui){
                        Instance.repaintEverything();
                    //    region(event, ui, this);
                        this.style.zIndex = zindex++;

                    }
        });

         Instance.makeSource(source, StyleSourceDigital,{scope:"digital, analog"});
         Instance.makeTarget(SelDig, StyleTargetDigital,{scope:"digital"});

       //  Instance.makeTarget(SelAnl, StyleTargetDigital,{scope:"analog"});

/*        digitalPlumb.makeSource(source, {
            scope:"digital",
            filter:".sector",
            endpoint:"Dot",
            anchor: [ 'Continuous', { faces: ['right'] } ],
            connector:[ "Flowchart", { stub:[10, 30], gap:1, cornerRadius:0, alwaysRespectStubs:true } ],
            maxConnections:4,
            paintStyle: basicType.paintStyle,
            connectorStyle: basicType.connectorStyle,
            onMaxConnections: function(info, e) { MaxConn(4) }
        });
        
       digitalPlumb.makeTarget(SelDig, {
            scope:"digital",
            anchor: [ 'Continuous', { faces: ['left'] } ],
            endpoint:"Dot", 
            paintStyle:{ radius:0.1 },   
            maxConnections:4,
            onMaxConnections:function(info, e) {MaxConn(4)}
        }); */

/*
        //*****************Аналоговые элементы имеют 4 - цели и 1-источник
*/
        
    obj.after();

};

/*/*setTimeout(function() { 
    setvalue('and_0', 1); 
    console.log('timeout') 
    setTimeout(function() { setvalue('and_0', 0); console.log('timeout') }, 1000);
}, 10000);*/




});