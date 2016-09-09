<!-- Device Fingerprint - Version 2.0 - John Kula, substantially modified by Sebastian Zimmeck -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Browser Fingerprint</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
    <style type="text/css">
		label{
			display: inline-block;
			float: left;
			clear: left;
			width: 250px;
			text-align: left;
		}
		input {
			display: inline-block;
			float: left;
		}
		select {
			display: inline-block;
			float: left;
		}
    </style>
</head>

<body>
    <fieldset>
    <legend><b>Browser Fingerprint</b></legend>
    <p> </p><br><br>
    Your browser has the following fingerprint. Please click the submit button below to send us this information.
    <!-- display the detected fingerprints -->
    <p> </p><br><br>
    <label>User Agent:</label><br>
    <p id="useragent_display"> </p><br><br>
    <label>Browser:</label> <br>
    <p id="browser_display"> </p><br><br>
    <label>True Browser:</label><br>
    <p id="true_browser_display"> </p><br><br>
    <label>Browser Plugins:</label><br>
    <p id="browser_plugins_display"> </p><br><br>
    <label>Operating System:</label><br>
    <p id="os_display"> </p><br><br>
    <label>Time Zone:</label><br>
    <p id="timezone_display"> </p><br><br>
    <label>Display:</label><br>
    <p id="display_display"> </p><br><br>
    <label>Language:</label><br>
    <p id="language_display"> </p><br><br>
    <label>Flash Version:</label><br>
    <p id="flash_version_display"> </p><br><br>
    <label>Flash Cookies:</label><br>
    <p id="flash_cookies_display"> </p><br><br>
    <label>Silverlight Version:</label><br>
    <p id="silverlight_version_display"> </p><br><br>
    <label>JavaScript:</label><br>
    <p id="javascript_was_enabled_display"> </p><br><br>
    <label>1st Party HTTP Cookies:</label><br>
    <p id="cookies_were_enabled_display"> </p><br><br>
	<label>3rd Party HTTP Cookies:</label><br>
	<p><lnbreak>
	<?php
		echo $_COOKIE['third_party_cookie_test'];
	?>
	</lnbreak></p><br><br>
	<label>Do Not Track:</label><br>
    <p id="dnt_enabled_display"> </p><br><br>
    <label>Java:</label><br>
    <p id="java_enabled_display"> </p><br><br>
    <label>Touch:</label><br>
    <p id="touch_enabled_display"> </p><br><br>
    <label>Connection:</label><br>
    <p id="connections_display"> </p><br><br>
    <label>Latency:</label><br>
    <p id="latency_display"> </p><br><br>
    <label>Fonts:</label><br>
    <p id="fonts_display"> </p><br><br>
    <label>Web Storage:</label><br>
    <p id="web_storage_display"> </p><br><br>
    <label>Geolocation:</label><br>
    <p id="geolocation_display"> </p><br><br>
    <label>IP Address:</label><br>
    <p><lnbreak>
    <?php
		$ipaddress = '';
		if (getenv('HTTP_CLIENT_IP'))
			$ipaddress = getenv('HTTP_CLIENT_IP');
		else if(getenv('HTTP_X_FORWARDED_FOR'))
			$ipaddress = getenv('HTTP_X_FORWARDED_FOR');
		else if(getenv('HTTP_X_FORWARDED'))
			$ipaddress = getenv('HTTP_X_FORWARDED');
		else if(getenv('HTTP_FORWARDED_FOR'))
			$ipaddress = getenv('HTTP_FORWARDED_FOR');
		else if(getenv('HTTP_FORWARDED'))
			$ipaddress = getenv('HTTP_FORWARDED');
		else if(getenv('REMOTE_ADDR'))
			$ipaddress = getenv('REMOTE_ADDR');
		else
			$ipaddress = 'UNKNOWN';
		print $ipaddress;
    ?>
    </lnbreak></p><br><br>
    <label>Accept Headers:</label><br>
    <p><lnbreak>
    <?php
		print
		$_SERVER['HTTP_ACCEPT'] . '|' .
		$_SERVER['HTTP_ACCEPT_CHARSET'] . '|' .
		$_SERVER['HTTP_ACCEPT_ENCODING'] . '|' .
		$_SERVER['HTTP_ACCEPT_LANGUAGE'];
    ?>
    <br>
    <br>
    <br>
    <!-- create web form to get user information (with the already displayed fingerprints as hidden submissions)
    get also the cookie value of the user_id cookie (that is, the e-mail address) to identify the user -->
    <form name = "system_data_form" form action="browsers6.php" method="POST">
    <input type="hidden" id="useragent_fingerprint" input name="useragent" />
    <input type="hidden" id="browser_fingerprint" input name="browser" />
    <input type="hidden" id="true_browser_fingerprint" input name="truebrowser" />
    <input type="hidden" id="browser_plugins_fingerprint" input name="browserplugins" />
    <input type="hidden" id="os_fingerprint" input name="os" />
    <input type="hidden" id="timezone_fingerprint" input name="timezone" />
    <input type="hidden" id="display_fingerprint" input name="display" />
    <input type="hidden" id="language_fingerprint" input name="language" />
    <input type="hidden" id="flash_version_fingerprint" input name="flashversion" />
    <input type="hidden" id="flash_cookie_fingerprint" input name="flashcookieenabled"/>
    <input type="hidden" id="silverlight_version_fingerprint" input name="silverlightversion" />
    <input type="hidden" id="javascript_was_enabled_fingerprint" input name="javascriptenabled" />
    <input type="hidden" id="cookies_were_enabled_fingerprint" input name="cookiesenabled" />
	<input type="hidden" id="dnt_enabled_fingerprint" input name="dntenabled" />
    <input type="hidden" id="java_enabled_fingerprint" input name="javaenabled" />
    <input type="hidden" id="touch_enabled_fingerprint" input name="touchenabled" />
    <input type="hidden" id="connections_fingerprint" input name="connections" />
    <input type="hidden" id="latency_fingerprint" input name="latency" />
    <input type="hidden" id="fonts_fingerprint" input name="fonts" />
    <input type="hidden" id="web_storage_fingerprint" input name="webstorage" />
    <input type="hidden" id="geolocation_fingerprint" input name="geolocation" />
    <input type="hidden" id="ip_address_fingerprint" input name="ipaddress" value="
    <?php
		$ipaddress = '';
		if (getenv('HTTP_CLIENT_IP'))
			$ipaddress = getenv('HTTP_CLIENT_IP');
		else if(getenv('HTTP_X_FORWARDED_FOR'))
			$ipaddress = getenv('HTTP_X_FORWARDED_FOR');
		else if(getenv('HTTP_X_FORWARDED'))
			$ipaddress = getenv('HTTP_X_FORWARDED');
		else if(getenv('HTTP_FORWARDED_FOR'))
			$ipaddress = getenv('HTTP_FORWARDED_FOR');
		else if(getenv('HTTP_FORWARDED'))
			$ipaddress = getenv('HTTP_FORWARDED');
		else if(getenv('REMOTE_ADDR'))
			$ipaddress = getenv('REMOTE_ADDR');
		else
			$ipaddress = 'UNKNOWN';
		echo $ipaddress;
    ?>"/>
    <input type="hidden" id="headers_fingerprint" input name="headers" value="
    <?php
		echo $_SERVER['HTTP_ACCEPT'];
		echo $_SERVER['HTTP_ACCEPT_CHARSET'];
		echo $_SERVER['HTTP_ACCEPT_ENCODING'];
		echo $_SERVER['HTTP_ACCEPT_LANGUAGE'];
    ?>"/>
	<input type="hidden" id="third_party_cookies_were_enabled_fingerprint" input name="thirdpartycookiesenabled" value="
	<?php
		echo $_COOKIE['third_party_cookie_test'];
	?>"/>
    <input type="hidden" id="identifier" input name="identifier" value="
    <?php
		echo $_COOKIE['user_id'];
    ?>"/>
    <label></label><input type="submit" name="submit" value="Submit Fingerprint Data">
    </form>
    </fieldset>
    <p>Browser Sign Up Progress: 5/6</p>
    <script src="jquery-1.11.1.min.js"></script>
    <script src="_core_v20140409.js"></script>
    <script src="_swfobject.js"></script>
    <script src="swfstore.js"></script>
    <!-- pre-populate web form and html with detected fingerprint values -->
    <script>
		<!-- detect user agent -->
		var useragent = fingerprint_useragent();
		document.getElementById("useragent_fingerprint").value = useragent;
		document.getElementById("useragent_display").innerHTML = useragent;
		<!-- detect browser -->
		var browser = fingerprint_browser();
		document.getElementById("browser_fingerprint").value = browser;
		document.getElementById("browser_display").innerHTML = browser;
		<!--  detect true browser -->
		var truebrowser = fingerprint_truebrowser();
		document.getElementById("true_browser_fingerprint").value = truebrowser;
		document.getElementById("true_browser_display").innerHTML = truebrowser;
		<!-- detect browser plugins (does not detect NPAPI plugins for Google Chrome version 45 and up as it dropped support for NPAPI) -->
		var browserplugins = fingerprint_plugins();
		document.getElementById("browser_plugins_fingerprint").value = browserplugins;
		document.getElementById("browser_plugins_display").innerHTML = browserplugins;
		<!-- detect OS -->
		var os = fingerprint_os();
		document.getElementById("os_fingerprint").value = os;
		document.getElementById("os_display").innerHTML = os;
		<!-- detect timezone -->
		var timezone = fingerprint_timezone();
		document.getElementById("timezone_fingerprint").value = timezone;
		document.getElementById("timezone_display").innerHTML = timezone;
		<!-- detect display -->
		var display = fingerprint_display();
		document.getElementById("display_fingerprint").value = display;
		document.getElementById("display_display").innerHTML = display;
		<!-- detect languages -->
		var language = fingerprint_language();
		document.getElementById("language_fingerprint").value = language;
		document.getElementById("language_display").innerHTML = language;
		<!-- detect Flash version (only means that Flash is installed and the browser plugin for the tested browser is enabled; it may still be impossible to store Flash cookies if the user does not allow to store Flash cookies in general or for particular websites) -->
		var flashversion = fingerprint_flash();
		document.getElementById("flash_version_fingerprint").value = flashversion;
		document.getElementById("flash_version_display").innerHTML = flashversion;
		<!-- detect if Flash cookie is set -->
		fingerprint_get_flash_cookie();
		<!-- detect Silverlight version (does not work for Google Chrome version 45 and up as it dropped support for NPAPI) -->
		var silverlightversion = fingerprint_silverlight();
		document.getElementById("silverlight_version_fingerprint").value = silverlightversion;
		document.getElementById("silverlight_version_display").innerHTML = silverlightversion;
		<!-- we require JavaScript to be enabled for our study, thus, it is always true -->
		var javascriptenabled = 1;
		document.getElementById("javascript_was_enabled_fingerprint").value = javascriptenabled;
		document.getElementById("javascript_was_enabled_display").innerHTML = javascriptenabled;
		<!-- we require first party HTTP cookies to be enabled for our study, thus, it is always true -->
		var cookiesenabled = 1;
		document.getElementById("cookies_were_enabled_fingerprint").value = cookiesenabled;
		document.getElementById("cookies_were_enabled_display").innerHTML = cookiesenabled;
		<!-- detect Do Not Track enabled -->
		var dntenabled = fingerprint_dnt();
		document.getElementById("dnt_enabled_fingerprint").value = dntenabled;
		document.getElementById("dnt_enabled_display").innerHTML = dntenabled;
		<!-- detect Java enabled (does not work for Google Chrome version 45 and up as it dropped support for NPAPI; same for Firefox 64-bit for Windows) -->
		var javaenabled = fingerprint_java();
		document.getElementById("java_enabled_fingerprint").value = javaenabled;
		document.getElementById("java_enabled_display").innerHTML = javaenabled;
		<!-- detect touch enabled -->
		var touchenabled = fingerprint_touch();
		document.getElementById("touch_enabled_fingerprint").value = touchenabled;
		document.getElementById("touch_enabled_display").innerHTML = touchenabled;
		<!-- detect Connections (detect whether Wi-Fi or cell connection) -->
		var connections = fingerprint_connection();
		document.getElementById("connections_fingerprint").value = connections;
		document.getElementById("connections_display").innerHTML = connections;
		<!-- detect Latency (measures page load speed, specifically, duration of request (requestStart to responseStart) | roundtrip network latency (fetchStart to responseEnd) ) -->
		var latency = fingerprint_latency();
		document.getElementById("latency_fingerprint").value = latency;
		document.getElementById("latency_display").innerHTML = latency;
		<!-- detect Fonts (would be more precise if based on Flash, however, would also fall short for browsers without Flash -->
		var fonts = fingerprint_fonts();
		document.getElementById("fonts_fingerprint").value = fonts;
		document.getElementById("fonts_display").innerHTML = fonts;
		<!-- detect local/session storage enabled -->
		var webstorage = fingerprint_web_storage();
		document.getElementById("web_storage_fingerprint").value = webstorage;
		document.getElementById("web_storage_display").innerHTML = webstorage;
		<!-- detect geolocation enabled (we require geolocation to be enabled for the browser fingerprint) -->
		function getLocation() {
			document.getElementById("geolocation_fingerprint").value  = 0;
			document.getElementById("geolocation_display").innerHTML = 0;
			navigator.geolocation.getCurrentPosition(showPosition);
		}
		function showPosition(position) {
			document.getElementById("geolocation_fingerprint").value = position.coords.latitude + "|" + position.coords.longitude; 
			document.getElementById("geolocation_display").innerHTML = "Latitude: " + position.coords.latitude + "; Longitude: " + position.coords.longitude; 
		}
		getLocation();
		<!-- detect IP address (need to use PHP for HTTPS sites) -->
        var ipaddress = fingerprint_IP();
        document.getElementById("ip_address_fingerprint").value = ipaddress;
		<!-- detect response headers -->
		var headers = fingerprint_headers();
		document.getElementById("headers_fingerprint").value = headers;
    </script><br>
</body>
</html>