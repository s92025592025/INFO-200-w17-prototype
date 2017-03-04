(function (){
	'use strict';

	const UWCourse = require('./UW-classes.js');

	Cookies.set('classes', {classes:["JAPAN 213", "PHYS 122", "ENGL 282"]});

	console.log(Cookies.get('classes'));

	// test browserfy
	console.log(UWCourse.getClassSections(Cookies.getJSON('classes').classes[0]));
})();