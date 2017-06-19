/*
 * Released under the  GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007.
 * Sebastian Zimmeck, sebastian@sebastianzimmeck.de
 */
 
// logic for putting together the cookie value with the date, URL, and other data
chrome.extension.onMessage.addListener(function(request, sender) {
	if (request.action == "sendData") {
		
		// get the date and urls from scraper.js
		var date = request.source1;
		var urls = request.source2;
		
		// get the ID of the current active tab
		var activeTabId;
		chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
			// since only one tab should be active and in the current window at once
			// the return variable should only have one entry
			var activeTab = arrayOfTabs[0];
			activeTabId = arrayOfTabs[0].id;
		});
		
		// get the cookie identifier
		var cookieName = "user_id";
		getCookie(cookieName, function(cookieData){
  			// the callback function(cookieData) returns the cookie object
  			// of the cookie object with the name user_id
  			// get the value of the object and convert it to string
		  	var cookieValue = JSON.stringify(cookieData.value);
		  	// remove quotation marks in the beginning and end
			var trimmedCookieValue = cookieValue.substring(1, cookieValue.length-1);
			// get the current location
			//getLocation(function (latitude, longitude) {
			// create history entry
			var historyEntry = trimmedCookieValue + "|,Chrome|Opera," + date + "," + activeTabId + "," + urls + "\n"; // + "," + latitude + "|" + longitude;
			// escape ampersand and other characters that are not displayed correctly in PHP posts
			var encodedHistoryEntry = encodeURIComponent(historyEntry);
			// send data to server
			postServerData(encodedHistoryEntry);
			//});
		});	
	}
});


// helper callback function for getting the current location (comment in getLocation and latitude and longitude at var historyEntry as well)
//function getLocation(callback) {
//	navigator.geolocation.getCurrentPosition(function (position) {
//		var latitude = position.coords.latitude;
//		var longitude = position.coords.longitude;
//		callback.call(null, latitude, longitude);
//	});
//}


// helper callback function for getting the cookie object
function getCookie(cookieName, callback){
    chrome.cookies.get({
        'url':'https://datavpnserver.cs.columbia.edu',
        'name': cookieName
    },
    function(data){
        callback(data);
    });
}


// Ajax/XMLHttpRequest function for posting the current date (including time) and URL to a server file;
// for secure data transmission use a server with HTTPS
function postServerData(data) {
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