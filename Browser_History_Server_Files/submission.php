<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="application/x-www-form-urlencoded" />
<title>Untitled Document</title>
</head>

<body>
<?php
	// write data to user's server file browsingHistories/<user_id_mobile or user_id_desktop>.csv
	if(isset($_POST['serverData'])) {
		// data from browser extension/app
		$serverData = $_POST["serverData"];
		echo $serverData;
		// IP address is detected server-side
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
		list($fileName, $fileContent) = explode("|", $serverData, 2);
		if (!file_exists("browsingHistories")) {
			mkdir("browsingHistories", 2770, true);
		}
		$file = fopen("browsingHistories/" . $fileName . ".csv","a");
		fwrite($file,$ipaddress . $fileContent);
		fclose($file);
	}
?>
</body>
</html>