/*
 * Released under the  GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007.
 * Sebastian Zimmeck, sebastian@sebastianzimmeck.de
 */

var getData = {

    init: function() {
        gBrowser.addProgressListener(this);
    },

    uninit: function() {
        gBrowser.removeProgressListener(this);
    },
	
	// get current date (including time), URL, tab ID, and value of cookie
    processNewURL: function(aURI) { 

		var cookieValue = getCookieValue();
		var date = getCurrentDate();
		var referrer = document.referrer; // seems to be broken in Firefox
		var url = content.location.href;
		var urlTitle = document.title; // title from previous url
		var activeTabId = getActiveTabId();
		
		var serverData = cookieValue + "|,Firefox," + date + "," + activeTabId + ",\"" + referrer + "\",\"" + url + "\",\"" + urlTitle + "\"\n";
		
		// escape ampersand and other characters that are not displayed correctly in PHP posts
		var serverDataClean = encodeURIComponent(serverData);
		
		// send data to server
		postData(serverDataClean);
		
    },
    onLocationChange: function(aProgress, aRequest, aURI) {
        this.processNewURL(aURI);
    },
}


// helper function for getting the current date (including time)
function getCurrentDate() {
    
    var currentDate = "";
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
	
    currentDate += month + "/" + day + "/" + year + "," + hours + ":" + minutes + ":" + seconds + "," + timeZone;
    
    return currentDate;
}


// helper function for reading the user_id cookie
// partly based on http://stackoverflow.com/questions/1523137/reading-web-page-cookies-from-a-firefox-extension-xul
function getCookieValue() {
	  
	var ios = Components.classes["@mozilla.org/network/io-service;1"]
		.getService(Components.interfaces.nsIIOService);
	var uri = ios.newURI("https://datavpnserver.cs.columbia.edu", null, null);

	var cookieSvc = Components.classes["@mozilla.org/cookieService;1"]
		.getService(Components.interfaces.nsICookieService);
	
	var cookie = cookieSvc.getCookieString(uri, null);
	
	// create offsets to get only the cookie value without the cookie identifier
	var beginValue = 62;
	var cookieValue = cookie.substring(beginValue);
	
	return cookieValue;
}


// helper function for getting a tab identifier
// based on http://stackoverflow.com/questions/4997818/firefox-get-unique-id-of-tabs-for-extension-development
function getActiveTabId(){
	var doc = gBrowser.contentDocument; //Gets the current document.
	var tab = null;
	var targetBrowserIndex = gBrowser.getBrowserIndexForDocument(doc);
	if (targetBrowserIndex != -1) {
		tab = gBrowser.tabContainer.childNodes[targetBrowserIndex];
	}
	else {
		return null;
	}
	return tab.linkedPanel;
}


// Ajax/XMLHttpRequest function for posting the current date (including time) and URL to a server file;
// for secure data transmission use a server with HTTPS
function postData(data) {
    // create XMLHttpRequest instance
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    }
    else {
        throw new Error("Ajax is not supported by this browser");
    }
	var serverData = data;
    // post data to the server;
    // note the necessary content type application/x-www-form-urlencoded
    xhr.open('POST', 'https://datavpnserver.cs.columbia.edu/submission.php');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("serverData=" + serverData);
}


// fire event listener on each page load
window.addEventListener("load", function() { getData.init() }, false);
window.addEventListener("unload", function() { getData.uninit() }, false);