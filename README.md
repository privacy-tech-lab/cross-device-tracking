# Cross_Device_Tracking (v1.1)

A Privacy Analysis of Cross-device Tracking  
Sebastian Zimmeck, Hyungtae Kim, Steven M. Bellovin, and Tony Jebara  
USENIX Security 2017

## 1. Overview

This repository contains data and software for cross-device tracking data collection. Cross-device tracking is a practice used by ad networks, analytics providers, and other Internet services to identify the different computers (desktops, laptops, smartphones, etc.) that belong to the same person. This identification of devices allows person-centric tracking. The system here helps researchers in their user studies to create cross-device tracking datasets.

Every participant in the user study needs an Android phone (iOS and other operating systems are not supported) and a desktop (or laptop) with Google Chrome or Mozilla Firefox (using any operating system). If a user has the respective app and extension installed browsing history as well as other device usage data will be sent to a server and stored there.

As an initial step when signing up a study participant a browser/device fingerprint is taken from each signed up browser/device. In addition, each particpant is asked for various types of personal information as well as interests (e.g., in sports or computer games). It might be interesting to explore correlations between browsing histories and interests, for example.

Please note, installation of the system requires substantial time to set up and various modifications to the code are necessary (see below). There are also multiple limitations (see below) that may render the system not useful for your purposes.

## 2. Directory Contents

The directories contain the following:

- Data: The data we collected during our study (anonymized)
- Software/Android_App: Source code for Android app sending browsing history and other user data to server
- Software/Browser_History_Chrome: Google Chrome extension for sending Chrome browsing history and other user data to server
- Software/Browser_History_Firefox: Mozilla Firefox extension for sending Firefox browsing history and other user data to server
- Software/Browser_History_IE: Microsoft Internet Explorer (IE) extension for sending IE browsing history and other user data to server
- Software/Browser_History_Safari: Apple Safari extension for sending Safari browsing history and other user data to server
- Software/Browser_History_Server: Server files for receiving browsing history and other user data

To learn more about individual files, read the comments inside the files.

## 3. Data

The data directory contains the following:

- Browsing_Histories_Anonymous: Desktop and mobile histories for each user in our study; usually one desktop and one mobile history file per user. The columns of each file contain: IP Address, Browser Vendor, Date, Time, Time Zone, Browser Tab ID, Referrer URL, URL/App Package ID, URL Title, 3rd Party Tracker/SDKs. The URLS are separated into [subdomain, second level domain, top domain, path]. Examples are [mobile, nytimes, com, N/A], [en, wikipedia, org, /wiki/Data_analysis], or [uah.facilities, columbia, edu, N/A]. Similarly, app package IDs are separated into their individual parts. Examples are [com, google, android, wearable, app], [com, snapchat, android], or [com, groupon]. Each part of an URL and a package ID is hashed using SHA 256. IP addresses and URL titles are also hashed.
- fingerprint_anonymous.csv: Device fingerprints for each user in our study, usually one desktop and one mobile device fingerprint.
- questionnaire_anonymous.csv: Gender, age group, interests, and personas of users in our dataset.

## 4. Extension and App Setup

Independent of the browser (Chrome, Firefox, etc.) all extensions work the way that users visit the websites on the server and enter their e-mail address, which is then stored as an identifier in the storage of the extension. Once this identifier is placed into storage all URLs and various other browing information (e.g., IP addresses, time and date) are automatically sent to the server.

The app as well as some of the extensions (e.g., the Chrome extension) should be hosted on the Play store and the respective extension store (e.g., the Chrome Web store). Otherwise, it is not possible to sign and package the software, which makes it cumbersome for the study participants to install. 

## 5. Server Setup

For our study we used a single server with 8 CPU and 16GB memory. We installed Ubuntu 14.10 and the Apache Web server. In total we collected about 350 MB of data for about three weeks from about 120 study participants. Once you have set up the server all files from the Browser_History_Server_Files folder go into the var/www/html directory on the server.

If you want to test whether a study participant has enabled third party cookies, you will need to host the files in Browser_History_Server_Files/site on a third party domain. The third party domain will then try to set a cookie.

To make sure that data is not compromised an HTTPS certificate is recommended as well as careful permission selection for the collected data on the server.

## 6. Necessary Modifications

There are many code modifications necessary to make it run on your system. Most importantly, the domain of our server was datavpnserver.cs.columbia.edu. All occurences of this server in the app, extension, and server files have to be changed to your server domain. Also, all package names for the app and extension have to be changed because history.cs.columbia.edu is the specific name of our app, for example.

## 7. Dependencies

- The browser extensions require jQuery, which is included in the extensions' directories whenever necessary.

- The Android app uses https://github.com/jaredrummler/AndroidProcesses to identify running processes and requires the Android Support Library (https://developer.android.com/topic/libraries/support-library/features.html#v7-appcompat). It also uses gradle for the build.

## 8. Limitations

- The Android app works for phones that are not rooted. However, browsing history will only be captured from Google Chrome, the native Android browser, and the Samsung S-Browser. For Android 6 and higher it is also no longer possible to access the saved browsing history, which the app relies on. Thus, for Android 6 and higher browsing history cannot be captured.

- The Android app checks every minute whether there is a new entry in the browsing history or a new app is running in the foreground. Thus, if a user opens and closes an app between two checks, it will not be recognized.

- For the Firefox extension the file names created for the study participants on the server (containing their browsing history and other data) does not correspond to their e-mail identifiers (but rather seems to be some random code). However, based on the individual entries themselve it is possible to make the identification. It also does not seem possible to collect the titles of webpages with the Firefox extension.

- Hosting the Safari extension requires an Apple developer account that costs some money. We did not use this extension in our study, and it is unclear how well it works.

- The Internet Explorer extension does not work in its current state. We did not use this extension in our study, and it is unclear if it can be made workable at all.

- All captured data has to be substantially post-processed. For example, the apps currently in use by a study participant as detected by the Android app often appear multiple times on the server data. Thus, the duplicates have to be deleted.

- For many captured history items from the Android app the IP address is missing.

- The Android app should start itself again after a reboot. However, if a phone runs out of battery this automatic restart does not work.

## 9. Version History

- v1.0 initial publication (09/09/2016)
- v1.1 added data (06/17/2017)

## 10. License

All cross-device tracking software is released under the GPL-3 License, 2016, Sebastian Zimmeck and Hyungtae Kim.

## 11. Contact Info

For feedback and questions please contact Sebastian Zimmeck at sebastian@sebastianzimmeck.de
