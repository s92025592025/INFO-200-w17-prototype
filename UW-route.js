// @Author: Daniel Wang (JIUN-CHENG WANG)
// @Description: This module is mainly contains geographical data on campus
// 2017/01/31
'use strict';
/* For testing and reference purpose */
const fs = require('fs');

var UWRoute = function (apiKey){
	this._apiKey = apiKey;
	this.BASE = 'https://maps.googleapis.com/maps/api/';
	this.buildingList = JSON.parse(fs.readFileSync(__dirname + '/data/testing_building_list.json'));
};


// pre: should give abbr the abbreviation of the building(without classroom num)
// post: will return a set of absolution in json format {lat, lng}
UWRoute.prototype.getAbsoluteLocation = function (abbr){
	for(var i = 0; i < this.buildingList.features.length; i++){
		if(this.buildingList.features[i].attributes.faccode == abbr.toUpperCase()){
			if(this.buildingList.features[i].geometry.hasOwnProperty('coordinates')){
				return this.buildingList.features[i].geometry.coordinates;
			}
		}
	}

	return "Not yet updated";
};

// pre: should give abbr the abbreviation of the building(without classroom num)
// post: will return a address of the building
UWRoute.prototype.getAddress = function (abbr){
	var absolute = this.getAbsoluteLocation(abbr);
	var address = "No Result";
	if(absolute == "Not yet updated"){
		return absolute;
	}

	var response = new XMLHttpRequest();
	response.open('GET', this.BASE + 'geocode/json' + 
					'?key=' + this._apiKey + 
					'&latlng=' + absolute.lat + ',' + absolute.lng, false);
	response.onload = function(){
		var response = JSON.parse(this.responseText);
		if(response.results.length > 0){
			address = response.results[0].formatted_address;
		}
	};

	response.send();

	return address;
}

// pre: should give start and end the abbreviation of the buildings, and enter mode of choice.
//		mode only have option "driving", "walking", "bicycling", "transit", default will be
//		"walking"
// post: will return the estimate travel time, or otherwise return returned status instead
UWRoute.prototype.getTravelTime = function (start, end, mode = "walking"){
	var response = new XMLHttpRequest();
	var travelTime = "Travel time not available";
	start = this.getAbsoluteLocation(start);
	end = this.getAbsoluteLocation(end);
	mode = mode.toLowerCase();

	// check if proper location is returned
	if(start.constructor !== {}.constructor || end.constructor !== {}.constructor){
		return "One of the location not available";
	}

	// check if proper mode is specified
	if(mode != "driving" || mode != "bicycling" || mode != "transit"){
		mode = "walking";
	}

	response.open('GET', this.BASE + 'directions/json?' +
						 'key=' + this._apiKey + 
						 '&origin=' + start.lat + ',' + start.lng +
						 '&destination=' + end.lat + ',' + end.lng +
						 '&mode=' + mode
				  , true);
	response.onload = function (){
		var response = JSON.parse(this.responseText);
		if(response.status == 'OK'){
			return response.routes[0].legs[0].duration.value;
		}else{
			travelTime = response.status;
		}
	}

	response.send();

	return travelTime;
}

// export
module.exports = UWRoute;