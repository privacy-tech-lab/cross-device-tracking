<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!-- mobile view 320 -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
	<title>Android Sign Up Status</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>

<body>
<?php
	// write detected device sign up values of android2.html to server file "signup.csv"
	if(isset($_POST['e_mail']) && isset($_POST['identifier']) && isset($_POST['mob_browsers_shared']) && isset($_POST['apps_shared'])) {	
		$data =  $_POST['e_mail'] . ',' . $_POST['identifier'] . ',' . 'android' . ',' . $_POST['mob_browsers_shared'] . ',' . $_POST['apps_shared'] . "\n";
		$ret = file_put_contents('signup.csv', $data, FILE_APPEND | LOCK_EX);
		// if writing fails
		if($ret === false) {
			die('There was an error. Please send an e-mail with error code android3a to the study coordinator at sebastian@cs.columbia.edu.');
		}
		else {
			echo '<fieldset>
            		  <legend><b>Android Sign Up Status</b></legend>
					  Successful submission. Sign up data were written to file. The next page will take a browser fingerprint. (If your browser asks for location access, please allow such access.) Please continue with the <a href="android4.php">browser fingerprint</a>.
				  </fieldset>';
		}
	}
	// if no post data to process
	else {
	   die('There was an error. Please send an e-mail with error code android3b to the study coordinator at sebastian@cs.columbia.edu.');
	}
?>
<p>Android Sign Up Progress: 3/5</p>
</body>
</html>