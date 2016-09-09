<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Browser Fingerprint Status</title>
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
			die('There was an error. Please send an e-mail with error browsers6a to the study coordinator at sebastian@cs.columbia.edu.');
		}
		else {
			echo "<fieldset>
            		  <legend><b>Browser Fingerprint Status</b></legend>
					  <p>Successful submission. Fingerprint data written to file.
					  If you are using more than one browser on this laptop/desktop, please switch now to your other browser and go to our start webpage at https://datavpnserver.cs.columbia.edu/ to sign it up the same way as you did with this browser. Otherwise, please continue with the <a href='index.html#questionnaire_form'>questionnaire and consent</a>.</p>
				  </fieldset>";
		}
	}
	else {
	   die('There was an error. Please send an e-mail with error code browsers6b to the study coordinator at sebastian@cs.columbia.edu.');
	}
?>
<p>Browser Sign Up Progress: 6/6</p>
</body>
</html>
