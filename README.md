# Cross_Device_Tracking (v1.2)

A Privacy Analysis of Cross-device Tracking  
Sebastian Zimmeck, Jie S. Li, Hyungtae Kim, Steven M. Bellovin, and Tony Jebara  
USENIX Security 2017

## 1. Overview

This repository contains data and software from our academic work on cross-device tracking. Cross-device tracking is a practice used by ad networks, analytics providers, and other Internet services to identify the different computers (desktops, laptops, smartphones, etc.) that belong to the same Internet user. This identification of devices allows person-centric tracking. The software and data published here is intended to help researchers in their studies to explore cross-device tracking and create cross-device tracking datasets.

## 2. Directory Contents

The directories contain the following:

* Data: The data we collected during our study (n = 126 study participants; all anonymized)
    * Browsing_Histories_Anonymous: Mobile and desktop browsing histories
    * fingerprint_anonymous.csv: Mobile and desktop fingerprints
    * questionnaire_anonymous.csv: Gender, age group, interests, and personas
    * study_participant_list_anonymous.xlsx: Summary statistics
    
* Software: Software for collecting cross-device data
    * Android_App: Source code for Android app sending browsing history and other user data to server
    * Browser_History_Chrome: Google Chrome extension for sending Chrome browsing history and other user data to server
    * Browser_History_Firefox: Mozilla Firefox extension for sending Firefox browsing history and other user data to server
    * Browser_History_IE: Microsoft Internet Explorer (IE) extension for sending IE browsing history and other user data to server
    * Browser_History_Safari: Apple Safari extension for sending Safari browsing history and other user data to server
    * Browser_History_Server: Server files for receiving browsing history and other user data

To learn more about individual files, read the comments inside the files.

## 3. Collecting Data

We provide an app for Android (iOS and other operating systems are not supported) and browser extensions for desktops with Google Chrome, Opera, and Mozilla Firefox. The extensions for IE and Safari are not fully functional. If a user has the respective app and extension installed browsing history as well as other device usage data will be sent to a set up server and stored there.

As an initial step when signing up a study participant we recommend to take a browser/device fingerprint from each signed up browser/device. In addition, each particpant can be asked for various types of personal information as well as interests (e.g., in sports or computer games) and personas (e.g., runner or gamer). It might be interesting to explore correlations between browsing histories and interests.

Please note, installation of the data collection system likely requires substantial time and various modifications to the code might be necessary (see below). There are also multiple limitations (see below) that may render the system not useful for your purposes.

## 4. Server Setup

For our study we collected the user data on a single server with 8 CPU and 16GB memory. We installed Ubuntu 14.10 and the Apache Web server. In total we collected about 350 MB of data for about three weeks from 126 study participants. Once you have set up the server all files from the Browser_History_Server_Files directory go into the var/www/html directory on the server. The files contain the frontend to sign up study participants, obtain their device/browser fingerprints, and personas/interests.

If you want to test whether a study participant has enabled third party cookies, you will need to host the files in Browser_History_Server_Files/site on a third party domain. The third party domain will then try to set a cookie. Depending on whether the third party cookie can be set or not a respective result will be returned.

To make sure that data is not compromised an HTTPS certificate is recommended as well as careful permission selection for the collected data on the server.

## 5. Extension and App Setup

Independent of the browser (Chrome, Firefox, etc.) all extensions work the way that each participant initially needs to sign up on the server and enter his or her e-mail address, which is then stored as an identifier in the local storage of the extension in the participants browser. Once this identifier is placed into storage all URLs and various other browsing information (e.g., IP addresses, time and date) are automatically sent to the server with the identifier.

The app as well as some of the extensions (e.g., the Chrome extension) should be hosted on the Play store and the respective extension store (e.g., the Chrome Web store). Otherwise, it is not possible to sign and package the software, which makes it cumbersome for the study participants to install. 

## 6. Necessary Modifications

There may be many code modifications necessary to make the software run on your system. Most importantly, the domain of our server was datavpnserver.cs.columbia.edu, which you would need to change to your server domain. All occurences of this server in the app, extension, and server files have to be changed to your server domain. Also, all package names for the app and extension have to be changed because history.cs.columbia.edu is the specific name of our app, for example.

## 7. Dependencies

* The browser extensions require jQuery, which is included in the extensions' directories whenever necessary.

* The Android app uses https://github.com/jaredrummler/AndroidProcesses to identify running processes and requires the Android Support Library (https://developer.android.com/topic/libraries/support-library/features.html#v7-appcompat). It also uses gradle for the build.

## 8. Limitations

* The Android app works for phones that are not rooted. However, browsing history will only be captured from Google Chrome, the native Android browser, and the Samsung S-Browser. For Android 6 and higher it also seems no longer possible to access the saved browsing history, which the app relies on. Thus, for Android 6 and higher browsing history seems difficult to capture. You can ask your study participants to copy and paste their browsing history into an e-mail to you.

* The Android app checks every minute whether there is a new entry in the browsing history or a new app is running in the foreground. Thus, if a user opens and closes an app between two checks, it will not be detected.

* For the Firefox extension the file names created for the study participants on the server (containing their browsing history and other data) does not correspond to their e-mail identifiers (but rather seems to be some random code). However, based on the individual entries themselves it is possible to make the identification. It also does not seem possible to collect the titles of webpages with the Firefox extension.

* Hosting the Safari extension requires an Apple developer account that costs money. We did not use this extension in our study, and it is unclear how well it works.

* The Internet Explorer extension does not work in its current state. We did not use this extension in our study, and it is unclear if it can be made workable at all.

* All captured data has to be substantially post-processed. For example, the apps currently in use by a study participant as detected by the Android app often appear multiple times on the server data. Thus, the duplicates have to be deleted.

* For many captured history items from the Android app the IP address is missing.

* The Android app should start itself again after a reboot. However, if a phone runs out of battery this automatic restart does not work.

## 9. Version History

* v1.2 added data and revised documentation (06/29/2017)
* v1.1 added data (06/17/2017)
* v1.0 initial publication (09/09/2016)

## 10. License

All cross-device tracking software is released under the GPL-3 License, 2016, Sebastian Zimmeck and Hyungtae Kim.

## 11. Contact Info

For feedback and questions please contact Sebastian Zimmeck at sebastian@sebastianzimmeck.de