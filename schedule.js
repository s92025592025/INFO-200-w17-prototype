(function (){
	'use strict';

	const UWCourse = require('./UW-classes.js');

	Cookies.set('classes', {classes:["JAPAN 213", "PHYS 122", "ENGL 282"]});

	console.log(Cookies.get('classes'));

	window.onload = function (){
		// start find available schedule

		// read filters

		// display on block and calendar
	};

})();