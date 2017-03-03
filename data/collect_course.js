'use strict';

const fs = require('file-system');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const cheerio = require('cheerio');
const BASE = 'https://www.washington.edu/students/timeschd/SPR2017/';

var catalog = webpageRequest(BASE);
var major_list = [];
var course_list = {};
/*
	course_list format:
	{
		major_abbr: [
			{
				num: ,
				title: ,
				sections: [
					{
						SLN: ,
						section: ,
						type: ,
						credit: ,
						meeting: [
							{
								day: [],
								time: ,
								building: ,
								room:
							}
						],
						instructor: "",

					}
				]

			}
		]
	}
*/

// get all the link to classes information
for(var i = 0; i < catalog('a').length; i++){
	if(/\.html$/.test(catalog('a').eq(i).attr('href')) &&
		/\([A-Z]+\)/.test(catalog('a').eq(i).text())){
		major_list.push(catalog('a').eq(i).attr('href'));
	}
}

// get all the courses and store to classes.json
for(var i = 0; i < major_list.length; i++){
	var content = webpageRequest(BASE + major_list[i]);
	if(content != ''){
		//if the class is offered
		course_list[major_list[i].match(/([a-z]+)\.html/)[1].toUpperCase()] = [];
		var classTitle = "";
		var classIndex = -1;
		for(var s = 0; s < content('td').length; s++){
			if(content('td').eq(s).text().match(/^([A-Z]+)\s+([12345][0-9][0-9])\s+(\w+.*)$/)){
				var parse = content('td').eq(s).text().match(/^([A-Z]+)\s+([12345][0-9][0-9])\s+(\w+.*)$/);
				course_list[major_list[i].match(/([a-z]+)\.html/)[1].toUpperCase()].push({
					num: parse[2],
					title: parse[3],
					sections: []
				});
				classTitle = major_list[i].match(/([a-z]+)\.html/)[1].toUpperCase();
				classIndex++;
				console.log(content('td').eq(s).text());
			}else if(classTitle != '' && 
						content('td').eq(s).text().
							match(/.*([0-9]{5})\s([A-Z][A-Z]?)\s\s(QZ|[0-9][0-9]?\-?[0-9]?[0-9]?)\s+([MTWThFSat\.]+\s+[0-9]{3,4}\-[0-9]{3,4}P?\s+[A-Z]{3,}\s+[A-Z]?[0-9][0-9][0-9])\s+([A-Z\-]+,[A-Z \.\-]+)?/)){
				console.log(classTitle);
				console.log(content('td').eq(s).text());
				var classInfo = content('td').eq(s).text().
									match(/.*([0-9]{5})\s([A-Z][A-Z]?)\s\s(QZ|[0-9][0-9]?\-?[0-9]?[0-9]?)\s+([MTWThFSat\.]+\s+[0-9]{3,4}\-[0-9]{3,4}P?\s+[A-Z]{3,}\s+[A-Z]?[0-9][0-9][0-9])\s+([A-Z\-]+,[A-Z \.\-]+)?/);
				var meetingTimes = content('td').eq(s).text().match(/([MTWThFSat\.]+\s+[0-9]{3,4}\-[0-9]{3,4}P?\s+[A-Z]{3,}\s+[A-Z]?[0-9][0-9][0-9])/g);
				var data = {
						SLN: classInfo[1],
						section: classInfo[2],
						credit: classInfo[3],
						meeting: [],
						instructor: classInfo[5],
					};
				for(var j = 0; j < meetingTimes.length; j++){
					data.meeting.push({
						day: meetingTimes[j].match(/([MTWThFSat\.]+)/)[1],
						time: meetingTimes[j].match(/[0-9]{3,4}\-[0-9]{3,4}P?/)[0],
						building: meetingTimes[j].match(/[A-Z]{3,}/)[0],
						room: meetingTimes[j].match(/[A-Z]?[0-9][0-9][0-9]/)[0]
					});
				}
				course_list[classTitle][classIndex].sections.push(data);
			}
		}
	}
}

fs.writeFileSync(__dirname + '/data/classes.json', JSON.stringify(course_list, null, 4));

// pre: give a url that leads to a static webpage
// post: will return a cheerio HTML dom if the request is successfully
//		 requested
function webpageRequest(url){
	var dom = '';
	var request = new XMLHttpRequest();
	request.open('GET', url, false);
	request.onload = function (){
		if(this.status == 200 || this.status == 0){
			dom = cheerio.load(this.responseText);
		}
	}

	request.send();

	return dom;
}