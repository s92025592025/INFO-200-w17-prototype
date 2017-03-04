(function (){
	'use strict';

	const UWCourse = require('./UW-classes.js');
	const UWRoute = require('./UW-route.js')

	// find available schedule
	// dummy for developing state
	Cookies.set('classes', {classes:["JAPAN 213", "PHYS 122", "ENGL 282"]});
	var classes = Cookies.getJSON('classes');
	// get "any" possible schedule
	const SCHEDULES = UWCourse.buildSchedule(classes.classes);
	var filteredSchedule = [];

	window.onload = function (){
		// read filters
		for(var i = 0; i < document.querySelectorAll('.travel-option')){
			document.querySelectorAll('.travel-option').onchange = validSchedule;
		}
		// display on block and calendar
	};

	function validSchedule (){
		var passedSchedule = [];
		var route = new UWRoute('AIzaSyBRJAizomD3x1U7FX2PZM7PEDxs_UQXFWQ');

		if(this.value == mixed){
			filteredSchedule = SCHEDULES;
		}

		for(var i = 0; i < SCHEDULES.length; i++){
			// filter travek time
		}

		// will filter data later
		filteredSchedule = SCHEDULES;
	}

})();