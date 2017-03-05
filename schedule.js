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
		for(var i = 0; i < document.querySelectorAll('.travel-option').length; i++){
			document.querySelectorAll('.travel-option').onchange = validSchedule;
		}
		// display on block and calendar
		filteredSchedule = SCHEDULES; // dummy line
		showPossibleSchedule(filteredSchedule);
	};

	// pre: should give schedule an array of filtered schedule
	// post: will show a list of possible schedule for users to click
	function showPossibleSchedule (schedules){
		// clean all column
		document.getElementById('possible-schedules').innerHTML = "";
		// insert left arrow
		var leftArrow = document.createElement('div');
		leftArrow.classList.add('schedule-option');
		leftArrow.id = 'schedule-left';
		var leftArrorSpam = document.createElement('span');
		leftArrorSpam.classList.add('glyphicon');
		leftArrorSpam.classList.add('glyphicon-chevron-left');
		leftArrow.appendChild(leftArrorSpam);
		document.getElementById('possible-schedules').appendChild(leftArrow);

		// start making btns for schedule option

		// insert right arrow
		var rightArrow = document.createElement('div');
		rightArrow.classList.add('schedule-option');
		rightArrow.id = 'schedule-right';
		var rightArrorSpam = document.createElement('span');
		rightArrorSpam.classList.add('glyphicon');
		rightArrorSpam.classList.add('glyphicon-chevron-right');
		rightArrow.appendChild(rightArrorSpam);
		document.getElementById('possible-schedules').appendChild(rightArrow);
	}

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

	// pre: should give a schedule in JSON format to schedule
	// post: will plot the schedule to calendar
	function showCalendar (schedule){
		var cal = {
			header: null,
			views: {
		        	weekagenda: {
			        	type: 'agendaWeek',
			        	duration: {days: 6},
			        	firstDay: 1
			        }
		        },
		    defaultView: 'weekagenda',
		    events: []
		};

		for(var key in schedule){
			for(var i = 0; i < schedule[key].meeting.length; i++){
				var event = {
					title: key,
					editable: false
				};

				// break meeting day
				var day = schedule[key].meeting[i].day.match(/(M)|(W)|(Th|T)|(F)|(Sat\.)/g);
				for(var s = 0; s < day.length; s++){
					switch(day[s]){
						case "M":
							day[s] = 1;
							break;
						case "T":
							day[s] = 2;
							break;
						case "W":
							day[s] = 3;
							break;
						case "Th":
							day[s] = 4;
							break;
						case "F":
							day[s] = 5;
							break;
						case "Sat.":
							day[s] = 6;
							break;
					}
				}

				event.dow = day;

				// break down meeting time
				var time = schedule[key].meeting[i].time.match(/[0-9]{1,2}[0-9]{2}/g);
				for(var s = 0; s < time.length; s++){
					var breakDown = time[s].split(/^([0-9]{1,2})([0-9]{2})$/);
					if(Number(breakDown[1]) < 8){
						breakDown[i] = Number(breakDown[1]) + 12;
					}

					if(s == 0){
						event.start = breakDown[1] + ":" + breakDown[2] + ":00";
					}else{
						event.end = breakDown[1] + ":" + breakDown[2] + ":00";
					}
				}


				cal.events.push(event);
			}
		}

		$('#calendar').fullCalendar(cal);
	}

})();