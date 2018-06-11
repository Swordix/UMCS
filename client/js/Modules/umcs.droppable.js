//Попробуем=)
(function( $ ) {
$.widget( "ui.UMCSdroppable",
    {
      options:
      {
        grid: [null, null],//row(line), column
        size: [null, null], //width, height
        fill: '#FAFAFA',
        stroke: '#E1E5EC',//'#5C9BD1',
        strokeWidth: 1,
        let: true,
        css: ''
      },

	  _create: function() {

	  },
	  vars: {
            width: 0,
            height: 0
      },

      _init: function()
      {
        var $ = jQuery,
          	me = this;
        var $el = me.element;

       if (( me.options.grid[0] == null) || (me.options.grid[1] == null) || (me.options.size[0] == null) || (me.options.size[1] == null)){
         throw new Error( 'not enough params' );
       }else{
       	    var gridData = me._gridData();
            var widthDesktop = gridData[0][me.options.grid[0]-1].x + (me.options.size[0] * 2);
            me.vars.width = widthDesktop;
        	var heightDesktop = gridData[1][me.options.grid[1]-1].x + (me.options.size[1] * 2);
        	me.vars.height = heightDesktop;
			var elm = '<div class="'+ me.options.css +'" id="desktop" ' +
	          'style="z-index: -1; top: 0; left: 0; width: ' + widthDesktop + 'px; height: ' + heightDesktop + 'px; padding-right: 80px; padding-bottom: 80px;">' +
	          '</div>';
			$(elm).appendTo(me.element[0]);
	
			
			var grid = d3.select("#desktop").append("svg").attr("width", "100%").attr("height", "100%");//510

			var row = grid.selectAll(".row").data(gridData).enter().append("g").attr("class", "row");
			var v = 1;
			var inc = 0;

			var column = row.selectAll(".square")
			.data(function(d) { return d; })
			.enter().append("rect")
			.attr("class","square")
			.attr("x", function(d) { return d.x; })
			.attr("y", function(d) { return d.y; })
			.attr("width", function(d) { return d.width; })
			.attr("height", function(d) { return d.height; })
			.attr("stroke-width", me.options.strokeWidth)
			.attr("id", function(d, i){ inc++; var result = 'u_'+inc+i; return result; })
			.style("fill", function(d) { return me.options.fill; })
			.style("stroke", function(d) { return me.options.stroke; })
			.style("opacity", 1)
/*			.on("click", function(d){ 
			   v = v ? 0 : 1;
		       d3.select(this).style("opacity", v);
			   d3.select(this).attr("class", ".show");
			 })*/
			this._render();

			var menu = new BootstrapMenu('#desktop', {});
			/*var menu = new BootstrapMenu('#desktop', {
			  fetchElementData: function() {
			  },
			  // actionsGroups: [
			   // ['bigGrid, smallGrid'],
			   // ['snapGrid']
			  //],
			  actions: { bigGrid: {//snap grid
			      name: 'Big grid step ',
			      iconClass: 'fa-th-large',
			      onClick: function() {
			      }
			    }, smallGrid: {
			      name: 'Small grid step',
			      iconClass: 'fa-th',
			      onClick: function() {
			      }
			  }, /*snapGrid: {
			      name: 'Snap grid',
			      iconClass: 'fa-magnet',
			      onClick: function() {
			      }
			  }}
			});*/
			
	    }
      },
	  _render: function() {
    	    this._trigger("coordinates",null, {
    	     left : this._getCoords('desktop').left + 2,
    	     top : this._getCoords('desktop').top + 2,
    	     width : this.vars.width,
    	     height: this.vars.height
    	    })
	  },
      _gridData: function () {
      	var $ = jQuery,
          	me = this;
        var $el = me.element;

		var data = new Array();
		var xpos = 1; 
		var ypos = 1;
		var width = me.options.size[0];
		var height = me.options.size[1];
		// iterate for rows	
		for (var row = 0; row < me.options.grid[0]; row++) {
			data.push( new Array() );

			for (var column = 0; column < me.options.grid[1]; column++) {
				data[row].push({
					x: xpos,
					y: ypos,
					width: width,
					height: height
				})

				xpos += width;
			}

			xpos = 1;
			ypos += height;	
		}
		return data;

	 },
	_getCoords: function(elem) { 
	  var field = document.getElementById(elem);
	  var box = field.getBoundingClientRect();

	  return {
	    top: box.top + pageYOffset,
	    left: box.left + pageXOffset
	  };

	}

    })
 }( jQuery ));
