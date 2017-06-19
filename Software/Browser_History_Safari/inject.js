/*
 * Released under the  GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007.
 * Sebastian Zimmeck, sebastian@sebastianzimmeck.de
 */

// helper function for getting the current date (including time)
function getDate() {
  
    var date = "";
    var temp = new Date();
    var month = temp.getMonth()+1;
    var day = temp.getDate();
    var year = temp.getFullYear();
    var weekday = temp.getDay();
    var hours = temp.getHours();
    var minutes = temp.getMinutes();
    var seconds = temp.getSeconds();

	if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    date += month + "/" + day + "/" + year + "," + hours + ":" + minutes + ":" + seconds + ",\x22";
    return date;
}


// helper function for getting URLs of the current and referrer website
// for the current website also get the title
function getUrls() {
 
	var referrer = document.referrer;
	var url = document.URL;
	var urlTitle = document.title;
	
	var urls = referrer + "\x22,\x22" + url + "\x22,\x22" + urlTitle + "\x22,"; 
	return urls;
}


// send message to global.html to save cookie
function saveCookie(cookie) {
    safari.self.tab.dispatchMessage("saveCookie", cookie);
}


// send message to global.html to get cookie and send data to server
function getCookie(dateUrls) {
    safari.self.tab.dispatchMessage("getCookie", dateUrls);
}


// only fire if the top-level frame is loaded, not on iframes
if (window.top === window) {
	
	var urls = getUrls();
	
	// Safari does not allow extensions to access cookies on other than its own domains
	// thus, we store the cookie in local storage and get it from there
	// as long as first party cookies are enabled, local storage also remains enabled
	// because Safari does not distinguish between the two
	// if we are on our own domain, get the cookie (name and value)
	// and send it to global.html for storing it in the extension's local storage
	if (urls.match(/datavpnserver.cs.columbia.edu/)) {
		var cookie = document.cookie;
		saveCookie(cookie);
	}
	
	// if we are not on our own domain, the cookie must have been stored in local storage earlier
	// thus, get the cookie value from global.html
	else {
		var urls = getUrls();
		var date = getDate();
		dateUrls = date + "N/A" + urls; // N/A because Safari does not provide an API for tab ID
		getCookie(dateUrls);
	}
}