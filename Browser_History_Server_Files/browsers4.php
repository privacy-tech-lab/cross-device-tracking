<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Browser Sign Up Status</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>

<body>
<?php
	// write detected browser sign up values of browsers3.html to server file "signup.csv"
	if(isset($_POST['e_mail']) && isset($_POST['identifier']) && isset($_POST['previous']) && isset($_POST['desk_browsers_shared'])) {	
		$data =  $_POST['e_mail'] . ',' . $_POST['identifier'] . ',' . $_POST['previous'] . ',' . $_POST['desk_browsers_shared'] . ',' . 'N/A' . PHP_EOL;
		$ret = file_put_contents('signup.csv', $data, FILE_APPEND | LOCK_EX);
		// if writing fails
		if($ret === false) {
			die('There was an error. Please send an e-mail with error code browsers4a to the study coordinator at sebastian@cs.columbia.edu.');
		}
		else {
			echo '<fieldset>
            		  <legend><b>Browser Sign Up Status</b></legend>
					  Successful submission. Sign up data were written to file. The next page will take a browser fingerprint.  (If your browser asks for location access, please allow such access.) Please continue with the <a href="browsers5.php">browser fingerprint</a>.
				  </fieldset>';
		}
	}
	// if no post data to process
	else {
	   die('There was an error. Please send an e-mail with error code browsers4b to the study coordinator at sebastian@cs.columbia.edu.');
	}
?>
<p>Browser Sign Up Progress: 4/6</p>
</body>
</html>