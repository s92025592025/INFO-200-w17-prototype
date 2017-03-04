(function (){
	'use strict';

	const UWCourse = require('./UW-classes.js');

	// find available schedule
	// dummy for developing state
	Cookies.set('classes', {classes:["JAPAN 213", "PHYS 122", "ENGL 282"]});
	var classes = Cookies.getJSON('classes');
	// get "any" possible schedule
	var schedules = UWCourse.buildSchedule(classes.classes);

	window.onload = function (){
		// read filters
		for(var i = 0; i < document.querySelectorAll('.travel-option')){}
		// display on block and calendar
	};

})();