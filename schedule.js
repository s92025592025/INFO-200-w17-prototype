(function (){
	'use strict';

	const UWCourse = require('./UW-classes.js');

	// dummy for developing state
	Cookies.set('classes', {classes:["JAPAN 213", "PHYS 122", "ENGL 282"]});

	// get "any" possible schedule
	var schedules = UWCourse.buildSchedule(Cookies.getJSON('classes').classes);
	console.log(schedules);

	window.onload = function (){
		// start find available schedule

		// read filters

		// display on block and calendar
	};

})();