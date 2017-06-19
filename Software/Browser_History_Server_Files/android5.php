<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<!-- mobile view 320 -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
    <title>Android Fingerprint Status</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>

<body>
<?php
	// write detected fingerprint values to server file fingerprints.csv
	if(isset($_POST['useragent']) && isset($_POST['browser']) && isset($_POST['truebrowser']) && isset($_POST['browserplugins']) && isset($_POST['os']) && isset($_POST['timezone']) && isset($_POST['display']) && isset($_POST['language']) && isset($_POST['flashversion']) && isset($_POST['flashcookieenabled']) && isset($_POST['silverlightversion']) && isset($_POST['javascriptenabled']) && isset($_POST['cookiesenabled']) && isset($_POST['thirdpartycookiesenabled']) && isset($_POST['dntenabled']) && isset($_POST['javaenabled']) && isset($_POST['touchenabled']) && isset($_POST['connections']) && isset($_POST['latency']) && isset($_POST['fonts']) && isset($_POST['ipaddress']) && isset($_POST['webstorage']) && isset($_POST['geolocation']) && isset($_POST['headers'])) {
		$data = $_POST['identifier'] . ',"' . $_POST['useragent'] . '",' . $_POST['browser'] . ',' . $_POST['truebrowser'] . ',' . $_POST['browserplugins'] . ',' . $_POST['os'] . ',' . $_POST['timezone'] . ',' . $_POST['display'] . ',' . $_POST['language'] . ',' . $_POST['flashversion'] . ',' . $_POST['flashcookieenabled'] . ',' . $_POST['silverlightversion'] . ',' . $_POST['javascriptenabled'] . ',' . $_POST['cookiesenabled'] . ',' . $_POST['thirdpartycookiesenabled'] . ',' . $_POST['dntenabled'] . ',' . $_POST['javaenabled'] . ',' . $_POST['touchenabled'] . ',' . $_POST['connections'] . ',' . $_POST['latency'] . ',' . $_POST['fonts'] . ',' . $_POST['ipaddress'] . ',' . $_POST['webstorage'] . ',' . $_POST['geolocation'] . ',"' . $_POST['headers'] . '"';
		$trimmed = trim(preg_replace('/\s+/', ' ', $data));
		$ret = file_put_contents( 'fingerprint.csv', $trimmed . PHP_EOL, FILE_APPEND | LOCK_EX);
		if($ret === false) {
			die('There was an error. Please send an e-mail with error android5a to the study coordinator at sebastian@cs.columbia.edu.');
		}
		else {
			echo "<fieldset>
					<legend><b>Android Software Installation</b></legend>
					<p>Successful submission. Fingerprint data written to file. Please switch now to your default browser on your desktop and go to our start webpage at https://datavpnserver.cs.columbia.edu/ with that browser to sign it up.</p> 
				</fieldset>";			  
		}
	}
	else {
	   die('There was an error. Please send an e-mail with error code android5b to the study coordinator at sebastian@cs.columbia.edu.');
	}
?>
<p>Android Sign Up Progress: 5/5</p>
</body>
</html>