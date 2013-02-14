//==============================================================================
// jquery.mobile.date.navigation.ba.js
//
// Version 1.0
//
// Plugin que el componente de navegacion entre un rango de fechas.
//
// Autor: Víctor Valencia Rico.
// Febrero 2013
//==============================================================================

(function($) {

    /*
     * Lógica de llamadas a los metodos.
     */
    $.fn.dateNavigation = function( method ) {

        if ( $.fn.dateNavigation.methods[method] ) {
            return $.fn.dateNavigation.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }
        else if ( typeof method === 'object' || ! method ) {
            return $.fn.dateNavigation.methods.init.apply( this, arguments );
        }
        else {
            $.error( 'El metodo: ' +  method + ' no existe en el plug-in roalcom.jquery.date.navigation' );
        }

    };


    /*
     * Default
     */
    $.fn.dateNavigation.defaults = {

	options: {
	    date: "2000-01-01",
	    range: "week",
	    rangeLabels: {
		week: 'Week',
		month: 'Month',
		year: 'Year'
	    }
	},
	events: {
	    onPreviousClick: function(e){},
	    onNextClick: function(e){},
	    onRangeChange: function(e){},
	    onNavigate: function(e){}
	}

    }


    /*
     * Metodos
     */
    $.fn.dateNavigation.methods = {

        /*
         * Metodo init. Inicializa el componente.
         */
        init : function( custom ) {

            return this.each( function() {

                var target = $(this);

		//console.log("Data by data-*:");
		//console.log(target.data());

		var defaults = $.fn.dateNavigation.defaults;

		var options = $.extend( { }, defaults.options, target.data() );

		var events = $.extend( { }, defaults.events );

		if( custom ) {
		    if( custom.options ) {
			options = $.extend( { }, options, custom.options );
		    }
		    if( custom.events ) {
			events = $.extend( { }, events, custom.events );
		    }
		}

		//console.log("Data by JQuery:");
		//console.log(config);

		target.removeData();
		target.data("options", options);
		target.data("events", events);

		target.data('_oldSelected', '');
                target.data('_steps', 0);

		var date_default = $.getDateStrToObj(defaults.options.date);
		var date = $.getDateStrToObj(target.data('options').date);

		var dateObj = $.extend({}, date_default, date);

                target.data('_dateObj', dateObj);
                target.data('_date', new Date( dateObj.year, dateObj.month, dateObj.day ));

		//console.log(target.data());

		//target.addClass("ui-block-solo");

		var tpl = '';
		tpl += '    <div class="ui-block-solo" style="text-align:center;">';
		tpl += '        <span name="label" style="font-weight: bold;">&nbsp;</span>';
		tpl += '    </div>';
		tpl += '    <div class="container_12">';
		tpl += '        <div class="grid_3">';
		tpl += '	    <a name="prev" href="javascript:;" data-role="button" data-icon="arrow-l" data-theme="c" class="ui-btn ui-btn-icon-left ui-btn-corner-left ui-btn-up-c">';
		tpl += '		<span class="ui-btn-inner ui-corner-left">';
		tpl += '		    <span class="ui-btn-text">&nbsp;</span>';
		tpl += '		    <span class="ui-icon ui-icon-arrow-l ui-icon-shadow">&nbsp;</span>';
		tpl += '		</span>';
		tpl += '	    </a>';
		tpl += '	</div>';
		tpl += '	<div class="grid_6">';
		tpl += '	    <div class="ui-select">';
		tpl += '	        <div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="arrow-d" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-btn-up-c">';
		tpl += '		    <span class="ui-btn-inner ui-btn-corner-all">';
		tpl += '		        <span class="ui-btn-text"><span name="label-select">&nbsp;</span></span>';
		tpl += '		        <span class="ui-icon ui-icon-arrow-d ui-icon-shadow">&nbsp;</span>';
		tpl += '		    </span>';
		tpl += '		    <select name="range">';
		tpl += '		        <option value="week">'+options.rangeLabels.week+'</option>';
		tpl += '		        <option value="month">'+options.rangeLabels.month+'</option>';
		tpl += '		        <option value="year">'+options.rangeLabels.year+'</option>';
		tpl += '		    </select>';
		tpl += '		</div>';
		tpl += '	    </div>';
		tpl += '	</div>';
		tpl += '	<div class="grid_3">';
		tpl += '	    <a name="next" href="javascript:;" data-role="button" data-icon="arrow-l" data-theme="c" class="ui-btn ui-btn-icon-right ui-btn-corner-right ui-btn-up-c">';
		tpl += '		<span class="ui-btn-inner">';
		tpl += '		    <span class="ui-btn-text">&nbsp;</span>';
		tpl += '		    <span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span>';
		tpl += '		</span>';
		tpl += '	    </a>';
		tpl += '	</div>';
		tpl += '    </div>';

                target.html( tpl );

                var setSteps = function( steps ) {

                    target.data( '_steps', steps );

                };

                var change = function( obj ) {

		    var node = obj[0].nodeName;

		    var name = obj.attr( (node == 'A') ? "name" : "value");

                    if( name == "prev" || name == "next" ) {
                        var steps = target.data('_steps');
                        steps += (name == "next") ? 1 : -1;
                        setSteps(steps);
                    }

                    var commitChange = true;
                    //Cambiar opcion
                    if( name == "week" || name == "month" || name == "year" ) {

			var label = target.find('select[name*="range"] option:selected').html();
			target.find('span[name*="label-select"]').html(label);

                        if( target.data('_oldSelected') != name ){

                            target.data('_oldSelected', name);
                            commitChange = true;
                            setSteps(0);
                        }
                        else{
                            commitChange = false;
                        }
                    }

                    if( commitChange ){

                        var optionSelected = target.find('select[name*="range"] option:selected').attr("value");
                        var steps = target.data('_steps');
                        var date = target.data('_date');
                        var range = $.getEmptyRange();

                        switch( optionSelected ){
                            case "week":range = $.getWeekRange( date, steps );break;
                            case "month":range = $.getMonthRange( date, steps );break;
                            case "year":range = $.getYearRange( date, steps );break;
                        }

                        var label = target.find('span[name="label"]');

                        label.html($.getRangeLabel(range, optionSelected));

                        //console.log($.getStringDate(range.ini)+"  <->  "+$.getStringDate(range.end));

			events.onNavigate.apply(this,
			    [{

				rangeSelected: optionSelected,
				//steps: steps,
				//rangeDate: range,
				range: {ini: $.getStringDate(range.ini), end: $.getStringDate(range.end)},
				date: options.date,
				//subtitle:$.getRangeLabel(range, optionSelected)
			    }]
			);

                        //target.data('currentEvent', event);

                    }

                };

		//Evento Click : Boton Atras
                target.find('a[name="prev"]').click(function(e) {
                    e.preventDefault();
		    change($(this));
		    events.onPreviousClick.apply(this, [{}]);
                });

		//Evento Click : Boton Siguiente
                target.find('a[name="next"]').click(function(e) {
                    e.preventDefault();
		    change($(this));
		    events.onNextClick.apply(this, [{}]);
                });

                //Evento Change : Combo Rango
                target.find('select[name="range"]').change(function(e) {
                    e.preventDefault();
		    var oldRange = target.data('_oldSelected');
		    change($(this).find("option:selected"));
		    events.onRangeChange.apply(this,
			[{
			    oldRange : oldRange,
			    newRange : $(this).find("option:selected").val()
			}]
		    );
                });

		var range = target.find('select[name="range"]').find('option[value="'+options.range+'"]');
		if(!range.length){
		    range = target.find('select[name="range"]').find('option[value="'+defaults.options.range+'"]');
		}
		if(range.length){
		    range.attr("selected","selected");
		    range.parent().trigger("change");
		}


            });


        }


    };

})(jQuery);
