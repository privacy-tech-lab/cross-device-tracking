<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Thank You</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>

<body>
<?php
	// write detected questionnaire values to server directory questionnaire.csv
	if(isset($_POST['identifier']) && isset($_POST['first_name']) && isset($_POST['last_name']) && isset($_POST['e_mail']) && isset($_POST['gender']) && isset($_POST['age']) && isset($_POST['consent'])) {
		$data = $_POST['arts_and_entertainment'] . ',' . $_POST['autos_and_vehicles'] . ',' . $_POST['beauty_and_fitness'] . ',' . $_POST['books_and_literature'] . ',' . $_POST['business_and_industrial'] . ',' . $_POST['computers_and_electronics'] . ',' . $_POST['finance'] . ',' . $_POST['food_and_drink'] . ',' . $_POST['games'] . ',' . $_POST['hobbies_and_leisure'] . ',' . $_POST['home_and_garden'] . ',' . $_POST['internet_and_telecom'] . ',' . $_POST['jobs_and_education'] . ',' . $_POST['law_and_government'] . ',' . $_POST['news'] . ',' . $_POST['online_communities'] . ',' . $_POST['people_and_society'] . ',' . $_POST['pets_and_animals'] . ',' . $_POST['real_estate'] . ',' . $_POST['reference'] . ',' . $_POST['science'] . ',' . $_POST['shopping'] . ',' . $_POST['sports'] . ',' . $_POST['travel'] . ',' . $_POST['world_localities'] . ',' . $_POST['business_professionals'] . ',' . $_POST['personal_finance_geeks'] . ',' . $_POST['real_estate_followers'] . ',' . $_POST['small_business_ownwers'] . ',' . $_POST['business_travelers'] . ',' . $_POST['flight_intenders'] . ',' . $_POST['leisure_travelers'] . ',' . $_POST['catalog_shoppers'] . ',' . $_POST['mobile_payment_makers'] . ',' . $_POST['value_shoppers'] . ',' . $_POST['american_football_fans'] . ',' . $_POST['avid_runners'] . ',' . $_POST['sports_fans'] . ',' . $_POST['bookworms'] . ',' . $_POST['casual_and_social_gamers'] . ',' . $_POST['entertainment_enthusiasts'] . ',' . $_POST['hardcore_gamers'] . ',' . $_POST['movie_lovers'] . ',' . $_POST['music_lovers'] . ',' . $_POST['news_and_magazine_readers'] . ',' . $_POST['slots_players'] . ',' . $_POST['auto_enthusiasts'] . ',' . $_POST['fashionistas'] . ',' . $_POST['food_and_dining_lovers'] . ',' . $_POST['health_and_fitness_enthusiasts'] . ',' . $_POST['high_net_individuals'] . ',' . $_POST['home_design_enthusiasts'] . ',' . $_POST['home_and_garden_pros'] . ',' . $_POST['new_mothers'] . ',' . $_POST['photo_and_video_enthusiasts'] . ',' . $_POST['singles'] . ',' . $_POST['social_influencers'] . ',' . $_POST['tech_and_gadget_enthusiasts'] . ',' . $_POST['mothers'] . ',' . $_POST['parenting_and_education'] . ',' . $_POST['pet_owners'] . ',' . $_POST['identifier'] . ',"' . $_POST['first_name'] . '","' . $_POST['last_name'] . '",' . $_POST['e_mail'] . ',' . $_POST['gender'] . ',' . $_POST['age'] . ',"' . $_POST['native_language'] . '",' . $_POST['consent'];
		$trimmed = trim(preg_replace('/\s+/', ' ', $data));
		$ret = file_put_contents( 'questionnaire.csv', $trimmed . PHP_EOL, FILE_APPEND | LOCK_EX);
		if($ret === false) {
			die('There was an error. Please send an e-mail with error questionnaire2a to the study coordinator at sebastian@cs.columbia.edu.');
		}
		else {
			echo "<p>Successful submission. Questionnaire data written to file. You are all set! We will send you a confirmation e-mail within the next 24 hours. If you do not receive this e-mail (at the address you provided), please contact the study coordinator at sebastian@cs.columbia.edu. Thank you for your participation!</p> <br> <p class='centeredImage'><img src='thanks.jpg'></p>";	
		}
	}
	else {
	   die('There was an error. Please send an e-mail with error questionnaire2b to the study coordinator at sebastian@cs.columbia.edu.');
	}
?>
<p>Questionnaire and Consent Progress: 2/2</p>
</body>
</html>