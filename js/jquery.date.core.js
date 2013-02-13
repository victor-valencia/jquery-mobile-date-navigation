//==============================================================================
// jquery.date.core.js
//
// Version 1.0
//
// Libreria de funciones para las fechas.
//
// Autor: Víctor Valencia Rico.
// Febrero 2013
//==============================================================================

(function($) {

    /*
     * monthsYear. Nombre de todos los meses de un año.
     */
    $.monthsYear = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

    /*
     * daysWeek. Nombre de todos los dias de una semana.
     */
    $.daysWeek = ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];

     /*
     * getDayName. Retorna el nombre del dia abreviado.
     */
    $.getDayName = function( date ) {
        var day = date.getDay();
	if( day == 0 ){
	    return $.daysWeek[6];
	}
	else {
	    return $.daysWeek[day-1];
	}
    };

    /*
     * getMonthName. Retorna el nombre del mes abreviado.
     */
    $.getMonthName = function( month ) {
        switch( month ) {
            case 0: 	return "ENE"; 	break;
            case 1: 	return "FEB"; 	break;
            case 2: 	return "MAR"; 	break;
            case 3: 	return "ABR"; 	break;
            case 4: 	return "MAY"; 	break;
            case 5: 	return "JUN"; 	break;
            case 6: 	return "JUL"; 	break;
            case 7: 	return "AGO"; 	break;
            case 8: 	return "SEP"; 	break;
            case 9: 	return "OCT"; 	break;
            case 10: 	return "NOV"; 	break;
            case 11: 	return "DIC"; 	break;
            default: 	""; 		break;
        }
    };

    /*
     * addDays. Agrega dias a una fecha especificada.
     */
    $.addDays = function( date, days ) {
        var _date = new Date( date.getTime() );
        _date.setDate( _date.getDate() + days );
        return _date;
    };

    /*
     * getDateToObj. Convierte una fecha especificada
     *	             en un objeto => { year:n, month:n, day:n }.
     */
    $.getDateToObj = function( date ) {
	return { day: date.getDate(), month: date.getMonth(), year: date.getFullYear() };
    };

    /*
     * getDateStrToObj. Convierte una fecha especificada en cadena
     *	             en un objeto => { year:n, month:n, day:n }.
     */
    $.getDateStrToObj = function( dateStr ) {
	var y = parseInt(dateStr.substring(0,4),10);
	var m = parseInt(dateStr.substring(5,7),10);
	var d = parseInt(dateStr.substring(8,10),10);
	return { day: d, month: m-1, year: y };
    };

    /*
     * daysInMonth. Retorna el numero total maximo de dias de un mes de una
     *		    fecha especificada.
     */
    $.daysInMonth = function(date) {
        var month = date.getMonth();
        var day = 0;
        do {
            day = date.getDate();
            date = $.addDays( date, 1 );
        } while( month == date.getMonth() );
	return day;
    };

    /*
     * addWeeks. Agrega semanas a una fecha especificada y retorna la primera
     *		 fecha de la semana en curso.
     */
    $.addWeeks = function( date, weeks ) {
        var _date = $.addDays( date, 7 * weeks );
        while( _date.getDay() != 1 ) {
            _date = $.addDays(_date, -1);
        }
        return _date
    };

    /*
     * addMonths. Agrega meses a una fecha especificada.
     */
    $.addMonths = function( date, months ) {
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var sum = month + months;
        var y = sum / 12;
        if( sum <= 0 ) {
            year += parseInt( y ) - 1;
        }
        else {
            year += parseInt( y );
            if( sum % 12 == 0 ) {
                year--;
            }
        }
        var _months = ( month + months ) % 12;
        month = ( _months > 0 ) ? _months : ( 12 + _months );
        return new Date( year, month, day );
    };

    /*----------------Inicio Rangos----------------*/

    /*
     * getEmptyRange. Retorna un rango de fechas vacias
     *		      con objetos => { year:n, month:n, day:n }.
     */
    $.getEmptyRange = function() {
        var range = {
            ini: {day: 0, month: 0, year: 0},
            end: {day: 0, month: 0, year: 0}
        };
        return range;
    };

    /*
     * getWeekRange. Retorna un rango de fechas señalando el numero de semanas
     *               desfazadas de una fecha especificada
     *               con objetos => { year:n, month:n, day:n }.
     */
    $.getWeekRange = function(date, steps) {
        //Fecha inicial de la semana
        var _ini = $.addWeeks( date, steps );
        //Fecha final de la semana
        var _end = _ini;
        //Calcular hasta el domingo siguiente
        do{
            _end = $.addDays( _end, 1 );
        } while( _end.getDay() != 0 );

        var range = {
            ini: $.getDateToObj( _ini ),
            end: $.getDateToObj( _end )
        };
        return range;
    };

    /*
     * getMonthRange. Retorna un rango de fechas señalando el numero de meses
     *                desfazados de una fecha especificada
     *                con objetos => { year:n, month:n, day:n }.
     */
    $.getMonthRange = function(date, steps) {
        //Fecha inicial del mes
        var _ini = $.addMonths( new Date( date.getFullYear(), date.getMonth(), 1 ), steps );
        var _end = new Date( _ini.getFullYear(), _ini.getMonth(), $.daysInMonth( _ini ) );
        var range = {
            ini: $.getDateToObj( _ini ),
            end: $.getDateToObj( _end )
        };
        return range;
    };

    /*
     * getYearRange. Retorna un rango de fechas señalando el numero de a�os
     *		     desfazados de una fecha especificada
     *		     con objetos => { year:n, month:n, day:n }.
     */
    $.getYearRange = function(date, steps) {
        var year = date.getFullYear() + steps;
        var range = {
            ini: $.getDateToObj( new Date( year, 0, 1 ) ),
            end: $.getDateToObj( new Date( year, 11, 31 ) )
        };
        return range;
    };

    /*
     * getRangeLabel. Retorna un texto formateado de un rango de fechas señalando
     *                a que tipo pertenece.
     */
    $.getRangeLabel = function(range, type) {
        switch( type ) {
            case 'week': return range.ini.day+" "+$.getMonthName( range.ini.month )+( ( range.ini.year != range.end.year ) ? " "+range.ini.year : "" )+" - "+range.end.day+" "+$.getMonthName( range.end.month )+" "+range.end.year; break;
            case 'month': return range.ini.day+" - "+range.end.day+" "+$.getMonthName( range.end.month )+" "+range.end.year; break;
            case 'year': return range.ini.day+" "+$.getMonthName( range.ini.month )+" - "+range.end.day+" "+$.getMonthName( range.end.month )+" "+range.end.year; break;
            default: return ""; break;
        }
    };

    /*
     * getStringDate. Retorna un texto formateado de un fecha => { year:n, month:n, day:n }
     *                al tipo "year-month-day".
     */
    $.getStringDate = function(dateObj) {
        return dateObj.year+"-"+(((dateObj.month+1)<10)?"0":"")+(dateObj.month+1)+"-"+((dateObj.day<10)?"0":"")+dateObj.day;
    };

    /*
     * getFormatDate. Retorna un texto formateado de la cadena de una fecha del tipo "day/month/year".
     */
    $.getFormatDate = function(dateString) {
        return dateString.substring(8)+"/"+$.getMonthName(parseInt(dateString.substring(5,7),10)-1)+"/"+dateString.substring(0,4);
    };

    /*----------------Fin Rangos----------------*/

    /*
    $.print = function(date){
        console.log("Fecha => "+date.year+" - "+date.month+" - "+date.day);
        return 0;
    };

    $.printDate = function(date){
        console.log("Fecha => "+date.getFullYear()+" - "+date.getMonth()+" - "+date.getDate()+" , "+date.getHours()+" : "+date.getMinutes()+" : "+date.getSeconds()+" : "+date.getMilliseconds()+" => "+date.getDay());
        return 0;
    };
    */

})(jQuery);
