/*
 * Software is released under the GPL-3.0 License.
 * Copyright (c) 2016, Sebastian Zimmeck
 * All rights reserved.
 *
 */


// helper function for getting the current date (including time)
function getDate() {
  
    var date = "";
    var temp = new Date();
    var month = temp.getMonth()+1;
    var day = temp.getDate();
    var year = temp.getFullYear();
    var hours = temp.getHours();
    var minutes = temp.getMinutes();
    var seconds = temp.getSeconds();
	var timeZone = temp.toString().match(/\(([A-Za-z\s].*)\)/)[1];

	if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
	if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
	
    date += month + "/" + day + "/" + year + "," + hours + ":" + minutes + ":" + seconds + "," + timeZone;
    
	return date;
}


// helper function for getting URLs of the current and referrer website
// for the current website also get the title
function getUrls() {
 
	var referrer = document.referrer;
	var url = document.URL;
	var urlTitle = $('title').text();
	
	var urls = "\"" + referrer + "\",\"" + url + "\",\"" + urlTitle + "\""; 
	// remove new lines and multipe whitespace
	urls = urls.replace(/(\r\n|\n|\r)/gm,"");
	urls = urls.replace(/  +/g, ' ');
	return urls;
}


window.onload = function() {
	// turn off prerendering and prefetching pages, which are default in Google Chrome
	// otherwise page loads as well as changing of tab IDs can occur without user action
	if (document.webkitVisibilityState == "prerender" ||  document.visibilityState == "prerender" || document.visibilityState[0] == "prerender") {
		alert("no prerendering and prefetching");
	}
	// send data to background.js
	chrome.extension.sendMessage({
	    action: "sendData",
	    source1: getDate(),
	    source2: getUrls()
	});
}