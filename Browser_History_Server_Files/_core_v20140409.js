/*   Copyright (C) 2011,2012,2013,2014 John Kula; substantially modified by Sebastian Zimmeck 2015, 2016 */

/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    All trademarks and service marks contained within this document are
    property of their respective owners.

    Version 2014.04.09

    Updates may be found at: http:\\www.darkwavetech.com

    If attempting to compare to RSA AA prints only use the following subset of functions
    of the full device print: fingerprint_browser, fingerprint_display, fingerprint_plugins,
    fingerprint_timezone, fingerprint_language, fingerprint_java, fingerprint_cookie, fingerprint_flash
*/

/*jslint browser:true */

/* Global Variables */
var glbSep, glbPair, glbFlashVersion, glbOnError, glbOutputMode;

glbSep = '|';
glbPair = '=';
glbFlashVersion = "";
glbOnError = "error"; /* This sets output on error <sp>, null, err or similar. */

/* Utility Functions */

function activeXDetect(componentClassID) {
    "use strict";
    var strComponentVersion, strOut;

    strComponentVersion = "";
    strOut = "";

    try {
        strComponentVersion = document.body.getComponentVersion('{' + componentClassID + '}', 'ComponentID');
        if (strComponentVersion !== null) {
			strOut = strComponentVersion;
	    } else {
			strOut = false;
	    }
        return strOut;
    } catch (err) {
        return glbOnError;
    }
}

function stripIllegalChars(strValue) {
    "use strict";
    var iCounter, strOriginal, strOut;

    iCounter = 0;
    strOriginal = "";
    strOut = "";

    try {
        strOriginal = strValue.toLowerCase();
        for (iCounter = 0; iCounter < strOriginal.length; iCounter = iCounter + 1) {
            if (strOriginal.charAt(iCounter) !== '\n' && strOriginal.charAt(iCounter) !== '/' && strOriginal.charAt(iCounter) !== "\\") {
                strOut = strOut + strOriginal.charAt(iCounter);
            } else if (strOriginal.charAt(iCounter) === '\n') {
                strOut = strOut + "n";
            }
        }
        return strOut;
    } catch (err) {
        return glbOnError;
    }
}

function stripFullPath(tempFileName, lastDir) {
    "use strict";
    var strFileName, numFileNameStart, numFileNameFinish, strOut;

    strFileName = "";
    numFileNameStart = 0;
    numFileNameFinish = 0;
    strOut = "";

    try {
        strFileName = tempFileName;
        numFileNameStart = strFileName.lastIndexOf(lastDir);
        if (numFileNameStart < 0) {
            return tempFileName;
        }
        numFileNameFinish = strFileName.length;
        strFileName = strFileName.substring(numFileNameStart + lastDir.length, numFileNameFinish);
        strOut = strFileName;
        return strOut;
    } catch (err) {
        return glbOnError;
    }
}

function hashtable_containsKey(key) {
    "use strict";
    var bolExists, iCounter;

    bolExists = false;
    iCounter = 0;

    for (iCounter = 0; iCounter < this.hashtable.length; iCounter = iCounter + 1) {
        if (iCounter === key && this.hashtable[iCounter] !== null) {
            bolExists = true;
            break;
        }
    }
    return bolExists;
}

function hashtable_get(key) {
    "use strict";
    return this.hashtable[key];
}

function hashtable_keys() {
    "use strict";
    var keys, iCounter;

    keys = [];
    iCounter = 0;

    for (iCounter in this.hashtable) {
        if (this.hashtable[iCounter] !== null) {
            keys.push(iCounter);
        }
    }
    return keys;
}

function hashtable_put(key, value) {
    "use strict";
    if (key === null || value === null) {
        throw "NullPointerException {" + key + "},{" + value + "}";
    }
    this.hashtable[key] = value;
}

function hashtable_size() {
    "use strict";
    var iSize, iCounter, iOut;

    iSize = 0;
    iCounter = 0;
    iOut = 0;

    for (iCounter in this.hashtable) {
        if (this.hashtable[iCounter] !== null) {
            iSize = iSize + 1;
        }
    }
    iOut = iSize;
    return iOut;
}

function Hashtable() {
    "use strict";
    this.containsKey = hashtable_containsKey;
    this.get = hashtable_get;
    this.keys = hashtable_keys;
    this.put = hashtable_put;
    this.size = hashtable_size;
    this.hashtable = [];
}


/* Fingerprint Functions */

function fingerprint_truebrowser() {
    /* Uses object detection to determine if user-agent is spoofed */
    "use strict";
    var strBrowser, strUserAgent, strOut;

    strBrowser = "Unknown";
    strOut = "";
	strUserAgent = navigator.userAgent.toLowerCase();

	//checks for different browsers cannot use Try/Catch in block
	if (document.all && document.getElementById && navigator.savePreferences && (strUserAgent.indexOf("Netfront") < 0) && navigator.appName !== "Blazer") {
		strBrowser = "Escape 5";
	} else if (navigator.vendor === "KDE") {
		strBrowser = "Konqueror";
	} else if (document.childNodes && !document.all && !navigator.taintEnabled && !navigator.accentColorName) {
		strBrowser = "Safari";
	} else if (document.childNodes && !document.all && !navigator.taintEnabled && navigator.accentColorName) {
		strBrowser = "OmniWeb 4.5+";
	} else if (navigator.__ice_version) {
		strBrowser = "ICEBrowser";
	} else if (window.ScriptEngine && ScriptEngine().indexOf("InScript") + 1 && document.createElement) {
		strBrowser = "iCab 3+";
	} else if (window.ScriptEngine && ScriptEngine().indexOf("InScript") + 1) {
		strBrowser = "iCab 2-";
	} else if (strUserAgent.indexOf("hotjava") + 1 && (navigator.accentColorName) === "undefined") {
		strBrowser = "HotJava";
	} else if (document.layers && !document.classes) {
		strBrowser = "Omniweb 4.2-";
	} else if (document.layers && !navigator.mimeTypes["*"]) {
		strBrowser = "Escape 4";
	} else if (document.layers) {
		strBrowser = "Netscape 4";
	} else if (window.opera && document.getElementsByClassName) {
		strBrowser = "Opera 9.5+";
	} else if (window.opera && window.getComputedStyle) {
		strBrowser = "Opera 8";
	} else if (window.opera && document.childNodes) {
		strBrowser = "Opera 7";
	} else if (window.opera) {
		strBrowser = "Opera " + window.opera.version();
	} else if (navigator.appName.indexOf("WebTV") + 1) {
		strBrowser = "WebTV";
	} else if (strUserAgent.indexOf("netgem") + 1) {
		strBrowser = "Netgem NetBox";
	} else if (strUserAgent.indexOf("opentv") + 1) {
		strBrowser = "OpenTV";
	} else if (strUserAgent.indexOf("ipanel") + 1) {
		strBrowser = "iPanel MicroBrowser";
	} else if (document.getElementById && !document.childNodes) {
		strBrowser = "Clue browser";
	} else if (navigator.product && navigator.product.indexOf("Hv") === 0) {
		strBrowser = "Tkhtml Hv3+";
	} else if (navigator.product === "Gecko" && !navigator.savePreferences) {
		strBrowser = "Gecko engine (Mozilla, Netscape 6+ etc.)";
	} else if (window.atob) {
		strBrowser = "Internet Explorer 10+";
	} else if (XDomainRequest && window.performance) {
		strBrowser = "Internet Explorer 9";
	} else if (XDomainRequest) {
		strBrowser = "Internet Explorer 8";
	} else if (document.documentElement && document.documentElement.style.maxHeight !== "undefined") {
		strBrowser = "Internet Explorer 7";//xxxxx
	} else if (document.compatMode && document.all) {
		strBrowser = "Internet Explorer 6";//xxxxx
	} else if (window.createPopup) {
		strBrowser = "Internet Explorer 5.5";
	} else if (window.attachEvent) {
		strBrowser = "Internet Explorer 5";
	} else if (document.all && navigator.appName !== "Microsoft Pocket Internet Explorer") {
		strBrowser = "Internet Explorer 4";
	} else if ((strUserAgent.indexOf("msie") + 1) && window.ActiveXObject) {
		strBrowser = "Pocket Internet Explorer";
	} else if (document.getElementById && ((strUserAgent.indexOf("netfront") + 1) || navigator.appName === "Blazer" || navigator.product === "Gecko" || (navigator.appName.indexOf("PSP") + 1) || (navigator.appName.indexOf("PLAYSTATION 3") + 1))) {
		strBrowser = "NetFront 3+";
	} else if (window.chrome) {
		strBrowser = "Chrome";
	} else if (screen.globalStorage) {
		strBrowser = "Firefox";
    }
	strOut = strBrowser;
	return strOut;
}


/* Fingerprint form fields */

function fingerprint_formfields() {
    /* Returns form and list of fields visible on form */
    "use strict";
    var i, j, numOfForms, numOfInputs, strFormsInPage, strFormsInputsData, strInputsInForm, strTmp, strOut;


    i = 0;
    j = 0;
    numOfForms = 0;
    numOfInputs = 0;
    strFormsInPage ="";
    strFormsInputsData = [];
    strInputsInForm = "";
    strTmp = "";
    strOut = "";

    strFormsInPage = document.getElementsByTagName('form');
    numOfForms = strFormsInPage.length;
    strFormsInputsData.push("url=" + window.location.href);
    for (i = 0; i < numOfForms; i = i + 1) {
        strFormsInputsData.push("FORM=" + strFormsInPage[i].name);
        strInputsInForm = strFormsInPage[i].getElementsByTagName('input');
        numOfInputs = strInputsInForm.length;
        for (j = 0; j < numOfInputs; j = j + 1) {
            if (strInputsInForm[j].type !== "hidden") {
                strFormsInputsData.push("Input=" + strInputsInForm[j].name);
            }
        }
    }
    strTmp = strFormsInputsData.join("|");
    strOut = strTmp;
    return strOut;
}


/* Fingerprint user-agent */

function fingerprint_useragent() {
    "use strict";
    var strIE, strMOZ, strOpera, strTmp, strUserAgent, strOut;

    strIE = "";
    strMOZ = "";
    strOpera = "";
    strTmp = "";
    strUserAgent = "";
    strOut = "";

    try {
        /* navigator.userAgent is supported by all major browsers */
        strUserAgent = navigator.userAgent.toLowerCase();
        strOpera = strUserAgent.indexOf("opera") >= 0;
        strIE = strUserAgent.indexOf("msie") >= 0 && !strOpera;
        strMOZ = strUserAgent.indexOf("mozilla") && !strIE && !strOpera;
        /* navigator.platform is supported by all major browsers */
        strTmp = strUserAgent + glbSep + navigator.platform;
        if (strIE) {
            /* navigator.cpuClass only supported in IE */
            try {
                strTmp += glbSep + navigator.cpuClass;
            } catch (e) {
                strTmp += glbSep + 'na';
            }
            /* navigator.browserLanguage only supported in IE, Safari and Chrome */
            try {
                strTmp += glbSep + navigator.browserLanguage;
            } catch (e) {
                strTmp += glbSep + 'na';
            }
            /* navigator.ScriptEngineBuildVersion supported in IE */
            try {
                strTmp += glbSep + ScriptEngineBuildVersion();
            } catch (e) {
                strTmp += glbSep + 'na';
            }
        } else if (strMOZ) {
            /* navigator.language is supported by all major browsers */
            strTmp += glbSep + navigator.language;
        }
        strOut = strTmp;
        return strOut;
    } catch (err) {
        return glbOnError;
    }
}


/* Fingerprint OS and OS bits */
function fingerprint_os() {
    "use strict";
    var strUserAgent, strPlatform, strOS, strOSBits, strOut;
    try {
        /* navigator.userAgent is supported by all major browsers */
        strUserAgent = navigator.userAgent.toLowerCase();
        strPlatform = fingerprint_useragent().toLowerCase();
		if (strUserAgent.indexOf("windows nt 10.0") !== -1) {
            strOS = "Windows 10";
        } else if (strUserAgent.indexOf("windows nt 6.3") !== -1) {
            strOS = "Windows 8.1";
        } else if (strUserAgent.indexOf("windows nt 6.2") !== -1) {
            strOS = "Windows 8";
        } else if (strUserAgent.indexOf("windows nt 6.1") !== -1) {
            strOS = "Windows 7";
        } else if (strUserAgent.indexOf("windows nt 6.0") !== -1) {
            strOS = "Windows Vista/Windows Server 2008";
        } else if (strUserAgent.indexOf("windows nt 5.2") !== -1) {
            strOS = "Windows XP x64/Windows Server 2003";
        } else if (strUserAgent.indexOf("windows nt 5.1") !== -1) {
            strOS = "Windows XP";
        } else if (strUserAgent.indexOf("windows nt 5.01") !== -1) {
            strOS = "Windows 2000, Service Pack 1 (SP1)";
        } else if (strUserAgent.indexOf("windows xp") !== -1) {
            strOS = "Windows XP";
        } else if (strUserAgent.indexOf("windows 2000") !== -1) {
            strOS = "Windows 2000";
        } else if (strUserAgent.indexOf("windows nt 5.0") !== -1) {
            strOS = "Windows 2000";
        } else if (strUserAgent.indexOf("windows nt 4.0") !== -1) {
            strOS = "Windows NT 4.0";
        } else if (strUserAgent.indexOf("windows nt") !== -1) {
            strOS = "Windows NT 4.0";
        } else if (strUserAgent.indexOf("winnt4.0") !== -1) {
            strOS = "Windows NT 4.0";
        } else if (strUserAgent.indexOf("winnt") !== -1) {
            strOS = "Windows NT 4.0";
        } else if (strUserAgent.indexOf("windows me") !== -1) {
            strOS = "Windows ME";
        } else if (strUserAgent.indexOf("win 9x 4.90") !== -1) {
            strOS = "Windows ME";
        } else if (strUserAgent.indexOf("windows 98") !== -1) {
            strOS = "Windows 98";
        } else if (strUserAgent.indexOf("win98") !== -1) {
            strOS = "Windows 98";
        } else if (strUserAgent.indexOf("windows 95") !== -1) {
            strOS = "Windows 95";
        } else if (strUserAgent.indexOf("windows_95") !== -1) {
            strOS = "Windows 95";
        } else if (strUserAgent.indexOf("win95") !== -1) {
            strOS = "Windows 95";
        } else if (strUserAgent.indexOf("ce") !== -1) {
            strOS = "Windows CE";
        } else if (strUserAgent.indexOf("win16") !== -1) {
            strOS = "Windows 3.11";
        } else if (strUserAgent.indexOf("iemobile") !== -1) {
            strOS = "Windows Mobile";
        } else if (strUserAgent.indexOf("wm5 pie") !== -1) {
            strOS = "Windows Mobile";
        } else if (strUserAgent.indexOf("windows") !== -1) {
            strOS = "Windows (Unknown Version)";
        } else if (strUserAgent.indexOf("openbsd") !== -1) {
            strOS = "Open BSD";
        } else if (strUserAgent.indexOf("sunos") !== -1) {
            strOS = "Sun OS";
        } else if (strUserAgent.indexOf("ubuntu") !== -1) {
            strOS = "Ubuntu";
        } else if (strUserAgent.indexOf("ipad") !== -1) {
            strOS = "iOS (iPad)";
        } else if (strUserAgent.indexOf("ipod") !== -1) {
            strOS = "iOS (iTouch)";
        } else if (strUserAgent.indexOf("iphone") !== -1) {
            strOS = "iOS (iPhone)";
        } else if (strUserAgent.indexOf("mac os x beta") !== -1) {
            strOS = "Mac OSX Beta (Kodiak)";
		} else if (strUserAgent.indexOf("mac os x 10_10") !== -1) {
            strOS = "Mac OSX Yosemite";
		} else if (strUserAgent.indexOf("mac os x 10_11") !== -1) {
            strOS = "Mac OSX El Capitan";
        } else if (strUserAgent.indexOf("mac os x 10_0") !== -1) {
            strOS = "Mac OSX Cheetah";
        } else if (strUserAgent.indexOf("mac os x 10_1") !== -1) {
            strOS = "Mac OSX Puma";
        } else if (strUserAgent.indexOf("mac os x 10_2") !== -1) {
            strOS = "Mac OSX Jaguar";
        } else if (strUserAgent.indexOf("mac os x 10_3") !== -1) {
            strOS = "Mac OSX Panther";
        } else if (strUserAgent.indexOf("mac os x 10_4") !== -1) {
            strOS = "Mac OSX Tiger";
        } else if (strUserAgent.indexOf("mac os x 10_5") !== -1) {
            strOS = "Mac OSX Leopard";
        } else if (strUserAgent.indexOf("mac os x 10_6") !== -1) {
            strOS = "Mac OSX Snow Leopard";
        } else if (strUserAgent.indexOf("mac os x 10_7") !== -1) {
            strOS = "Mac OSX Lion";
        } else if (strUserAgent.indexOf("mac os x 10_8") !== -1) {
            strOS = "Mac OSX Mountain Lion";
		} else if (strUserAgent.indexOf("mac os x 10_9") !== -1) {
            strOS = "Mac OSX Mavericks";
		} else if (strUserAgent.indexOf("mac os x") !== -1) {
            strOS = "Mac OSX (Version Unknown)";
        } else if (strUserAgent.indexOf("mac_68000") !== -1) {
            strOS = "Mac OS Classic (68000)";
        } else if (strUserAgent.indexOf("68K") !== -1) {
            strOS = "Mac OS Classic (68000)";
        } else if (strUserAgent.indexOf("mac_powerpc") !== -1) {
            strOS = "Mac OS Classic (PowerPC)";
        } else if (strUserAgent.indexOf("ppc mac") !== -1) {
            strOS = "Mac OS Classic (PowerPC)";
        } else if (strUserAgent.indexOf("macintosh") !== -1) {
            strOS = "Mac OS Classic";
        } else if (strUserAgent.indexOf("googletv") !== -1) {
            strOS = "Android (GoogleTV)";
        } else if (strUserAgent.indexOf("xoom") !== -1) {
            strOS = "Android (Xoom)";
        } else if (strUserAgent.indexOf("htc_flyer") !== -1) {
            strOS = "Android (HTC Flyer)";
        } else if (strUserAgent.indexOf("android") !== -1) {
            strOS = "Android";
        } else if (strUserAgent.indexOf("symbian") !== -1) {
            strOS = "Symbian";
        } else if (strUserAgent.indexOf("series60") !== -1) {
            strOS = "Symbian (Series 60)";
        } else if (strUserAgent.indexOf("series70") !== -1) {
            strOS = "Symbian (Series 70)";
        } else if (strUserAgent.indexOf("series80") !== -1) {
            strOS = "Symbian (Series 80)";
        } else if (strUserAgent.indexOf("series90") !== -1) {
            strOS = "Symbian (Series 90)";
        } else if (strUserAgent.indexOf("x11") !== -1) {
            strOS = "UNIX";
        } else if (strUserAgent.indexOf("nix") !== -1) {
            strOS = "UNIX";
        } else if (strUserAgent.indexOf("linux") !== -1) {
            strOS = "Linux";
        } else if (strUserAgent.indexOf("qnx") !== -1) {
            strOS = "QNX";
        } else if (strUserAgent.indexOf("os/2") !== -1) {
            strOS = "IBM OS/2";
        } else if (strUserAgent.indexOf("beos") !== -1) {
            strOS = "BeOS";
        } else if (strUserAgent.indexOf("blackberry95") !== -1) {
            strOS = "Blackberry (Storm 1/2)";
        } else if (strUserAgent.indexOf("blackberry97") !== -1) {
            strOS = "Blackberry (Bold)";
        } else if (strUserAgent.indexOf("blackberry96") !== -1) {
            strOS = "Blackberry (Tour)";
        } else if (strUserAgent.indexOf("blackberry89") !== -1) {
            strOS = "Blackberry (Curve 2)";
        } else if (strUserAgent.indexOf("blackberry98") !== -1) {
            strOS = "Blackberry (Torch)";
        } else if (strUserAgent.indexOf("playbook") !== -1) {
            strOS = "Blackberry (Playbook)";
        } else if (strUserAgent.indexOf("wnd.rim") !== -1) {
            strOS = "Blackberry (IE/FF Emulator)";
        } else if (strUserAgent.indexOf("blackberry") !== -1) {
            strOS = "Blackberry";
        } else if (strUserAgent.indexOf("palm") !== -1) {
            strOS = "Palm OS";
        } else if (strUserAgent.indexOf("webos") !== -1) {
            strOS = "WebOS";
        } else if (strUserAgent.indexOf("hpwos") !== -1) {
            strOS = "WebOS (HP)";
        } else if (strUserAgent.indexOf("blazer") !== -1) {
            strOS = "Palm OS (Blazer)";
        } else if (strUserAgent.indexOf("xiino") !== -1) {
            strOS = "Palm OS (Xiino)";
        } else if (strUserAgent.indexOf("kindle") !== -1) {
            strOS = "Kindle";
        } else if (strUserAgent.indexOf("wii") !== -1) {
            strOS = "Nintendo (Wii)";
        } else if (strUserAgent.indexOf("nintendo ds") !== -1) {
            strOS = "Nintendo (DS)";
        } else if (strUserAgent.indexOf("playstation 3") !== -1) {
            strOS = "Sony (Playstation Console)";
        } else if (strUserAgent.indexOf("playstation portable") !== -1) {
            strOS = "Sony (Playstation Portable)";
        } else if (strUserAgent.indexOf("webtv") !== -1) {
            strOS = "MSN TV (WebTV)";
        } else if (strUserAgent.indexOf("inferno") !== -1) {
            strOS = "Inferno";
        } else {
            strOS = "Unknown";
        }
        if (strPlatform.indexOf("x64") !== -1) {
            strOSBits = "64 bits";
        } else if (strPlatform.indexOf("wow64") !== -1) {
            strOSBits = "64 bits";
        } else if (strPlatform.indexOf("win64") !== -1) {
            strOSBits = "64 bits";
        } else if (strPlatform.indexOf("win32") !== -1) {
            strOSBits = "32 bits";
        } else if (strPlatform.indexOf("x64") !== -1) {
            strOSBits = "64 bits";
        } else if (strPlatform.indexOf("x32") !== -1) {
            strOSBits = "32 bits";
        } else if (strPlatform.indexOf("x86") !== -1) {
            strOSBits = "32 bits*";
        } else if (strPlatform.indexOf("ppc") !== -1) {
            strOSBits = "64 bits";
        } else if (strPlatform.indexOf("alpha") !== -1) {
            strOSBits = "64 bits";
        } else if (strPlatform.indexOf("68k") !== -1) {
            strOSBits = "64 bits";
        } else if (strPlatform.indexOf("iphone") !== -1) {
            strOSBits = "32 bits";
        } else if (strPlatform.indexOf("android") !== -1) {
            strOSBits = "32 bits";
        } else {
            strOSBits = "Unknown";
        }
        strOut = strOS + glbSep + strOSBits;
        return strOut;
    } catch (err) {
        return glbOnError;
    }
}


/* Fingerprint Silverlight Version */
function fingerprint_silverlight() {
    "use strict";
    var objControl, objPlugin, strSilverlightVersion, strOut;
    try {
        try {
            objControl = new ActiveXObject('AgControl.AgControl');
            if (objControl.IsVersionSupported("5.0")) {
                strSilverlightVersion = "5.x";
            } else if (objControl.IsVersionSupported("4.0")) {
                strSilverlightVersion = "4.x";
            } else if (objControl.IsVersionSupported("3.0")) {
                strSilverlightVersion = "3.x";
            } else if (objControl.IsVersionSupported("2.0")) {
                strSilverlightVersion = "2.x";
            } else {
                strSilverlightVersion = "1.x";
            }
            objControl = null;
        } catch (e) {
            objPlugin = navigator.plugins["Silverlight Plug-In"];
            if (objPlugin) {
                if (objPlugin.description === "1.0.30226.2") {
                    strSilverlightVersion = "2.x";
                } else {
                    strSilverlightVersion = parseInt(objPlugin.description[0], 10);
                }
            } else {
                strSilverlightVersion = "Not Installed";
            }
        }
        strOut = strSilverlightVersion;
        return strOut;
    } catch (err) {
        return glbOnError;
    }
}


/* Fingerprint Fonts */
function fingerprint_fonts() {
     try {
         var style = "position: absolute; visibility: hidden; display: block !important";
         var fonts = ["8514oem", "AquaKana", "Abadi", "Abadi MT Condensed Light", "Adobe Arabic", "Adobe Jenson", "Adobe Text", "Adobe Fangsong Std", "Adobe Hebrew", "Adobe Ming Std", "Aegyptus", "Agency FB", "Aharoni", "Aisha", "Akzidenz-Grotesk", "Al Bayan", "Albertus", "Aldhabi", "Aldus", "Alecko", "Alexandria", "Alfarooq", "Algerian", "Alphabetum", "Amazone", "American Scribe", "American Text", "American Typewriter", "Amienne", "AMS Euler", "Amsterdam Old Style", "Andale Mono", "Andale Sans", "Andalus", "Andy", "Angsana New", "Angsana New", "Angsana UPC", "Anonymous", "Anonymous Pro", "Antiqua", "Antique Olive", "Aparajita", "Apex", "Apple Casual", "Apple Chancery", "Apple Garamond", "Apple Gothic", "Apple Li Gothic", "Apple Li Sung", "Apple Myungjo", "Apple Symbols", "Aptifer", "Aquiline", "Arab", "Arabic Typesetting", "Arabic Transparent", "Archer", "Arial", "Arial Black", "Arial Hebrew", "Arial Monospaced", "Arial Narrow", "Arial Nova", "Arial Unicode MS", "Arial Baltic", "Arial Black", "Arial CE", "Arial CYR", "Arial Greek", "Arial TUR", "Aristocrat", "Arno", "Ashley Script", "Aster", "Athens", "Aurora", "Avant Garde Gothic", "Avenir", "Ayuthaya", "Baghdad", "Balloon", "Bank Gothic", "Barmeno", "Baskerville", "Bastard", "Batak Script", "Batang", "Batang Che", "Bauer Bodoni", "Bauhaus", "Bauhaus 93", "Beijing", "Bell", "Bell Centennial", "Bell Gothic", "Bell MT", "Belwe Roman", "Bembo", "Bembo Schoolbook", "Benguiat Gothic", "Berkeley Old Style", "Berlin Sans", "Bernhard Modern", "Beteckna", "Biau Kai", "Bickham Script", "Bickley Script", "Big Caslon", "Bitstream Cyberbit", "Bitstream Symbols", "Bitstream Vera", "Bitstream Vera Serif", "Black Moor", "Blue Highway", "Bodoni", "Bodoni MT", "Book Antiqua", "Bookman", "Bookman Old Style", "Bordeaux Roman", "Bradley Hand ITC", "Braggadocio", "Brandon Grotesque", "Breitkopf Fraktur", "Broadway", "Browallia New", "Browallia UPC", "Brush Script", "Bulmer", "Cabin", "Cafeteria", "Caledonia", "Calibri", "Calibri Light", "Californian FB", "Calisto MT", "Cambria", "Cambria Math", "Candara", "Candida", "Capitals", "Cartier", "Casey", "Caslon", "Caslon Antique", "Castellar", "Casual", "Catull", "Centaur", "Century", "Century Gothic", "Century Old Style", "Century Schoolbook", "Century Schoolbook Infant", "Chalkboard", "Chalkduster", "Chandas", "Chaparral", "Charcoal", "Charcoal CY", "Charis SIL", "Charter", "Cheltenham", "Chicago", "Choc", "Cholla Slab", "Cinderella", "City", "Civitype", "Clarendon", "Clearface", "Clearface Gothic", "Clearly U", "Clearview", "Cloister Black", "Co Headline", "Co Text", "Cochin", "Code2000", "Code2001", "Code2002", "Codex", "Colonna", "Colonna MT", "Comic Sans", "Comic Sans MS", "Compacta", "Computer Modern", "Concrete Roman", "Consolas", "Constantia", "Cooper", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Light", "Copperplate Gothic Bold", "Corbel", "Cordia New", "Cordia UPC", "Corona", "Coronet", "Corsiva Hebrew", "Courier", "Courier New", "Courier HP", "Courier New Baltic", "Courier New CE", "Courier New CYR", "Courier New Greek", "Courier New TUR", "Courier PS", "Cupola", "Curlz", "Daun Penh", "David", "Deco Type Naskh", "DejaVu fonts", "DejaVu Sans", "DejaVu Sans Mono", "DejaVu Serif", "DejaVu LGC Sans Mono", "Dengxian", "Denmark", "Desdemona", "Devanagari", "DFKai-SB", "Didot", "Dillenia UPC", "DIN", "Divona", "Dok Champa", "Dom Casual", "Dotum", "Dotum Che", "Doulos SIL ", "Dragonwick", "Droid Sans", "Droid Sans Mono", "Droid Serif", "Dyslexie", "Ebrima", "Ecofont", "Ecotype", "Edwardian Script", "Egyptienne", "Elephant", "Embria", "Emerson", "Engravers MT", "Eras", "Eras Bold ITC", "Espy Sans", "Espy Serif", "Estrangelo Edessa", "Eucrosia UPC", "Euphemia", "Euphemia UCAS", "Eurocrat", "Eurostile", "Everson Mono", "Excelsior", "Eyadish", "Fairfield", "Fallback font", "Fang Song", "Fedra Mono", "Fette Fraktur", "FF Dax", "FF Meta", "FF Scala", "FF Scala Sans", "Fifteenth Century", "Fira Sans", "Fixed", "Fixedsys", "Fixedsys Excelsior", "Flama", "Fletcher", "Folio", "Fontcraft Courier", "Fontoon", "Footlight", "Formata", "Forte", "Fraktur", "Franklin Gothic", "Franklin Gothic Medium", "Franklin Gothic Heavy", "Frank Ruehl", "Free UCS Outline Fonts", "Free Font", "Free Sans", "Free Serif", "Freesia UPC", "French Script", "French Script MT", "Friz Quadrata", "Frutiger", "Frutiger Next", "Futura", "Gabriola", "Gadget", "Gadugi", "Garamond", "Gautami", "Geeza Pro", "Geezah", "Geneva", "Geneva CY", "Gentium", "Georgia", "Georgia Pro", "Georgia Ref", "Ghibli", "Gigi", "Gill Sans", "Gill Sans Nova", "Gill Sans Schoolbook", "Gisha", "Gloucester", "GNU Unifont", "Gotham", "Goudy", "Goudy Old Style", "Goudy Pro Font", "Goudy Schoolbook", "Goudy Text", "Granjon", "Gravura", "Grecs du roi", "Guardian Egyptian", "Gujarati", "Gulim", "Gulim Che", "Gung Seoche", "Gung Seo", "Gungsuh", "Gungsuh Che", "Gurmukhi", "Haettenschweiler", "Hanacaraka", "Handel Gothic", "Hangangche", "Harrington", "Headline A", "Heather", "Hei", "Hei S", "Heisei Kaku Gothic", "Hei T", "Helvetica", "Helvetica CY", "Helvetica Neue", "Herculanum", "Hercules", "High Tower Text", "Highway Gothic", "Hiragino Kaku Gothic Pro", "Hiragino Kaku Gothic ProN", "Hiragino Kaku Gothic Std", "Hiragino Kaku Gothic StdN", "Hiragino Maru Gothic Pro", "Hiragino Maru Gothic ProN", "Hiragino Mincho Pro", "Hiragino Mincho ProN", "Hiragino Sans GB", "Hiroshige", "Hiroshige Sans", "Hobo", "Hoefler Text", "Humana Serif", "Hussar", "Hyper Font", "Impact", "Imprint", "Inai Mathi", "Inconsolata", "Industria", "Informal Roman", "Interstate", "Ionic No. 5", "Iris UPC", "Iskoola Pota", "ITC Benguiat", "ITC Bodoni 72", "ITC Legacy Sans", "ITC Stone Sans", "ITC Zapf Chancery", "ITF Devanagari", "Janson", "Japanese Gothic", "Jasmine UPC", "Jefferson", "Jenson", "Joanna", "Johnston", "New Johnston", "Jomolhari", "Jung Gothic", "Junicode", "Kabel", "Kacst One", "Kai", "Kai Ti", "Kalinga", "Kartika", "Keyboard", "Khmer UI", "Kino MT", "Kiran", "Kochi", "Kodchiang UPC", "Kohinoor Devanagari", "Kokila", "Koren", "Korinna", "Kozuka Gothic Pr 6N", "Kristen", "Krungthep", "Kruti Dev", "Kuenstler Script", "Kufi Standard GK", "Kursivschrift", "Lao UI", "Last Resort", "Latha", "Lato", "Leelawadee", "Leelawadee UI", "Legacy Serif", "Letter Gothic", "Levenim MT", "Lexia", "Lexia Readable", "Lexicon", "Liberation Mono", "Liberation Sans", "Liberation Serif", "Li Hei Pro", "Lily UPC", "Linux Biolinum", "Linux Libertine", "Li Song Pro", "Literaturnaya", "Lohit Gujarati", "Loma", "Lontara Script", "Lubalin Graph", "Lucida Blackletter", "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Grande", "Lucida Handwriting", "Lucida Handwriting Italic", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode", "Lucida Typewriter", "Lucida Fax", "Luminari", "Lydian", "Magneto", "Magnificat", "Maiola", "Malgun Gothic", "Mangal", "Manny ITC", "Marker Felt", "Marlett", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Melior", "Memphis", "Menlo", "Meta", "MICR", "Microgramma", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft JhengHei UI", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Sans Serif", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft YaHei UI", "Microsoft Yi Baiti", "Microsoft Himalaya", "Microsoft Jheng Hei", "Microsoft New Tai Lue", "Microsoft Phags Pa", "Microsoft Sans Serif", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft Ya Hei", "Microsoft Yi Baiti", "Miller", "Minchō", "Ming", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Mona", "Mona Lisa", "Monaco", "Monaco CY", "Mongolian Baiti", "Monofur", "Monospace", "Monotype Corsiva", "Mool Boran", "Motorway", "Mrs Eaves", "MS Gothic", "MS Mincho", "MS PGothic", "MS PMincho", "MS Sans Serif", "MS Serif", "MS UI Gothic", "MS Gothic", "MS Outlook", "Mshtakan", "MS Reference Sans Serif", "Museo Sans", "Museo Slab", "MV Boli", "Myanmar Text", "Myriad", "MYRIAD PRO", "Nadeem", "Narkisim", "Nassim", "Nastaliq Navees", "Neacademia", "Neue Haas Grotesk Text Pro", "Neutraface", "Neuzeit S", "New Century Schoolbook", "New Gulim", "New Peninim", "New York", "News 701", "News 702", "News 705", "News 706", "News Gothic", "News Gothic MT", "Niagara Solid", "Nilland", "Nimbus Mono L", "Nimbus Roman", "Nimbus Sans Global", "Nimbus Sans L", "Nina", "Nirmala UI", "NISC GB18030", "normal ", "noto", "NPS Rawlinson Roadway", "NSimSun", "Nu Sans", "Nyala", "OCR A Extended", "OCR-A", "OCR-B", "Old English Text", "Old English Text MT", "Open Sans", "Optima", "Orator", "Ormaxx", "Osaka", "Palace Script", "Palace Script MT", "Palatino", "Palatino Linotype", "PalatinoLinotype", "Papyrus", "Parisine", "Park Avenue", "PC Myungjo", "Perpetua", "Perpetua Greek", "Phosphate", "Pilgiche", "Plantagenet Cherokee", "Plantin", "Plantin Schoolbook", "Playbill", "PMingLiU", "PMingLiU-ExtB", "Poor Richard", "Porson ", "Portobello", "Pragmata Pro", "Prelude Bold", "Prelude Compressed", "Prelude Compressed WGL", "Prelude Compressed WGL Black", "Prelude Compressed WGL Bold", "Prelude Compressed WGL Light", "Prelude Compressed WGL Medium", "Prelude Condensed WGL", "Prelude Condensed", "Prelude Condensed Bold", "Prelude Condensed Medium", "Prelude Condensed WGL Black", "Prelude Condensed WGL Bold", "Prelude Condensed WGL Light", "Prelude Condensed WGL Medium", "Prelude Medium", "Prelude WGL Black", "Prelude WGL Bold", "Prelude WGL Light", "Prelude WGL Medium", "Prestige Elite", "Pricedown", "Prima Sans", "Primer", "Pro Font", "Proggy programming fonts", "PT Sans", "Quadraat", "Raanana", "Raavi", "Rachana", "Rage Italic", "Rail Alphabet", "Renault", "Requiem", "Revue", "Roboto", "Roboto Slab", "Rockwell", "Rockwell Nova", "Rod", "Roman", "Rotis Sans", "Rotis Semi Serif", "Rotis Serif", "Rufscript", "Sabon", "Sakkal Majalla", "Samman", "Sand", "Sanskrit Text", "Sathu", "Sawasdee", "Schadow", "Schwabacher", "Scribble", "Script", "Scriptina", "Script MT Bold", "Seagull", "Segoe MDL2 Assets", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Emoji", "Segoe UI Historic", "Segoe UI Symbol", "Segoe UI v5.01", "Segoe UI v5.27", "Segoe UI v5.35", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol", "Seoul", "serif", "Serifa", "Shelley Volante", "Sherbrooke", "Shin Myungjo Neue", "Shonar Bangla", "Showcard Gothic", "Shree Devanagari", "Shruti", "Sign Painter", "Silom", "Sim Hei", "Sim Kai", "Simplified Arabic", "Simplified Arabic Fixed", "Sim Sun", "SimSun-ExtB", "Sistina", "Sitka Banner", "Sitka Display", "Sitka Heading", "Sitka Small", "Sitka Subheading", "Sitka Text", "Skeleton Antique", "Skia", "Skolar", "Skolar Devanagari", "Small Fonts", "Snap ITC", "Snell Roundhand", "Song", "Soupbone", "Source Code Pro", "Source Sans Pro", "Souvenir", "Souvenir Gothic", "Square 721", "Squarish Sans CT v0.10", "Sreda", "ST Fang Song", "ST Heiti", "ST Kaiti", "ST Song", "STIX", "Stone Informal", "Stone Serif", "Stymie", "Sukhumvit Set", "Sundanese Unicode", "Sutturah", "Sweden Sans", "Swift", "Swiss 721", "Sydnie", "Sylfaen", "Symbol", "Symbola", "Syntax", "Tae Graphic", "Tahoma", "Tai Le Valentinium", "Taipei", "Techno", "Tekton", "Tema Cantante", "Template Gothic", "Tempus Sans", "Tengwar", "Terminal", "Tex Gyre Cursor", "Textile", "Thesis Sans", "Thonburi", "Tibetan Machine Uni", "Times", "Times CY", "Times New Roman", "Times New Roman Baltic", "Times New Roman CE", "Times New Roman CYR", "Times New Roman Greek", "Times New Roman TUR", "Tiresias", "Titus Cyberbit Basic", "Tlwg Mono", "Torino", "Tower", "Trade Gothic", "Traditional Arabic", "Trajan", "Transport", "Trattatello", "Trebuchet MS", "Trixie", "Trump Gothic", "Trump Mediaeval", "Tunga", "Tw Cen MT Condensed Extra Bold", "Twentieth Century", "Ubuntu", "Ubuntu Mono", "UM Typewriter", "Umpush", "Univers", "Urdu Typesetting", "Utopia", "Utsaah", "Vale Type", "Vani", "Vera Sans", "Vera Sans Mono", "Vera Serif", "Verdana", "Verdana Pro", "Verdana Ref", "Versailles", "Vijaya", "Virtue", "Vivaldi", "Vladimir Script", "Vladimir Script Regular", "Vrinda", "Wadalab", "Wanted", "Webdings", "Wedding Text", "Weiss", "Westminster", "Wide Latin", "Wiesbaden Swing", "William Monospace", "Wilson Greek", "Windsor", "Wingdings", "Wingdings 2", "Wingdings 3", "Wyld", "XITS", "Y. Oz Font N", "Yu Gothic", "Yu Gothic UI", "Yu Mincho", "Zapf Chancery", "Zapf Dingbats", "Zapfino", "Zurich"];
         var count = fonts.length;
         var template =
             '<b style="display:inline !important; width:auto !important; font:normal 10px/1 \'X\',sans-serif !important">ww</b>' +
             '<b style="display:inline !important; width:auto !important; font:normal 10px/1 \'X\',monospace !important">ww</b>';

         var fragment = document.createDocumentFragment();
         var divs = [];

         for (var i = 0; i < count; i++) {
             var font = fonts[i];
             var div = document.createElement('div');

             font = font.replace(/['"<>]/g, '');
             div.innerHTML = template.replace(/X/g, font);
             div.style.cssText = style;
             fragment.appendChild(div);

             divs.push(div);
         }

         var body = document.body;
         body.insertBefore(fragment, body.firstChild);

         result = [];
         for (var i = 0; i < count; i++) {
             var e = divs[i].getElementsByTagName('b');

             if (e[0].offsetWidth === e[1].offsetWidth) {
                 result.push(fonts[i]);
             }
         }

         // do not combine these two loops, remove child will cause reflow
         // and induce severe performance hit
         for (var i = 0; i < count; i++) {
             body.removeChild(divs[i]);
         }
         return result.join('|');
     } catch (err) {
         return glbOnError;
     }
 }


/* Fingerprint Browser */
function fingerprint_browser() {
    "use strict";
    var strUserAgent, numVersion, strBrowser, strOut;
    try {
        strUserAgent = navigator.userAgent.toLowerCase();
        if (/trident/.test(strUserAgent)) { //test for MSIE x.x;
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
			if (strUserAgent.indexOf("trident/7") > -1) {
                numVersion = 11;
            }
            if (strUserAgent.indexOf("trident/6") > -1) {
                numVersion = 10;
            }
            if (strUserAgent.indexOf("trident/5") > -1) {
                numVersion = 9;
            }
            if (strUserAgent.indexOf("trident/4") > -1) {
                numVersion = 8;
            }
            strBrowser = "Internet Explorer_" + numVersion;
        } else if (/firefox[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Firefox_" + numVersion;
        } else if (/opera[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Opera/x.x or Opera x.x (ignoring remaining decimal places);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Opera_" + numVersion;
        } else if (/chrome[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Chrome/x.x or Chrome x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Chrome_" + numVersion;
        } else if (/version[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Version/x.x or Version x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Safari_" + numVersion;
        } else if (/rv[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for rv/x.x or rv x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Mozilla_" + numVersion;
        } else if (/mozilla[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Mozilla/x.x or Mozilla x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Mozilla_" + numVersion;
        } else if (/binget[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for BinGet/x.x or BinGet x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library_(BinGet)_" + numVersion;
        } else if (/curl[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Curl/x.x or Curl x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library_(cURL)_" + numVersion;
        } else if (/java[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Java/x.x or Java x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library_(Java)_" + numVersion;
        } else if (/libwww-perl[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for libwww-perl/x.x or libwww-perl x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library_(libwww-perl)_" + numVersion;
        } else if (/microsoft url control -[\s](\d+\.\d+)/.test(strUserAgent)) { //test for Microsoft URL Control - x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library_(Microsoft_URL_Control)_" + numVersion;
        } else if (/peach[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Peach/x.x or Peach x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library_(Peach)_" + numVersion;
        } else if (/php[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for PHP/x.x or PHP x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library_(PHP)_" + numVersion;
        } else if (/pxyscand[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for pxyscand/x.x or pxyscand x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library_(pxyscand)_" + numVersion;
        } else if (/pycurl[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for pycurl/x.x or pycurl x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library_(PycURL)_" + numVersion;
        } else if (/python-urllib[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for python-urllib/x.x or python-urllib x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library_(Python_URLlib) " + numVersion;
        } else if (/appengine-google/.test(strUserAgent)) { //test for AppEngine-Google;
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Cloud_(Google_AppEngine)_" + numVersion;
        } else {
            strBrowser = "Unknown";
        }
        strOut = strBrowser;
        return strOut;
    } catch (err) {
        return glbOnError;
    }
}


/* Fingerprint Do Not Track Enabled */
function fingerprint_dnt() {
    var bolDntEnabled, bolOut;
    try {
		if (navigator.doNotTrack == "yes" || navigator.doNotTrack == "1" ||  navigator.msDoNotTrack == "1") {
			bolDntEnabled = 1;
		}
        else {
			bolDntEnabled = 0;
		}
        bolOut = bolDntEnabled;
        return bolOut;
    } catch (err) {
        return glbOnError;
    }
}


/* Fingerprint Java Enabled */
function fingerprint_java() {
    "use strict";
    var bolJavaEnabled, bolOut;
    try {
        bolJavaEnabled = (navigator.javaEnabled()) ? 1 : 0;
        bolOut = bolJavaEnabled;
        return bolOut;
    } catch (err) {
        return glbOnError;
    }
}


/* Fingerprint Touch Device */
function fingerprint_touch() {
    "use strict";
    var bolTouchEnabled, bolOut;
    try {
		if (document.createEvent("TouchEvent")) {
        	bolTouchEnabled = 1;
        	bolOut = bolTouchEnabled;
	    } else {
		    bolTouchEnabled = 0;
        	bolOut = bolTouchEnabled;
	    }
        return bolOut;
    } catch (ignore) {
        bolTouchEnabled = 0;
        bolOut = bolTouchEnabled;
        return bolOut;
    }
}


/* Fingerprint Cookies Enabled */
function fingerprint_cookie(cookieValue) {
    var cookieEnabled, cookieSet, cookieResult;
    try {
        cookieEnabled = navigator.cookieEnabled;
        if (cookieEnabled == true) {
			cookieName = "first_party_cookie_test";
			setValue = cookieValue;
			expDays = 60;
            setCookie(cookieName, setValue, expDays);
			if (getCookie(cookieName)) {
				cookieSet = true;
			}
			else {
				cookieSet = false;
			}
        }
		else {
			cookieSet = false;
		}
        cookieResult = cookieEnabled + "; " + cookieSet;
        return cookieResult;
    } catch (err) {
        return glbOnError;
    }
}


/* Fingerprint Connection (Wi-Fi or cell) */
function fingerprint_connection() {
    "use strict";
    var strConnection, strOut;
    try {
		// only on android
        strConnection = navigator.connection.type;
        strOut = strConnection;
    } catch (err) {
        strOut = "Unknown";
    }
    return strOut;
}

/* Fingerprint Latency */
function fingerprint_latency() {
    "use strict";
    var perfData, dns, connection, requestTime, networkLatency;
    try {
	   // supported by a number of modern browsers
       perfData = window.performance.timing;
       requestTime = perfData.responseStart - perfData.requestStart;
       networkLatency = perfData.responseEnd - perfData.fetchStart;
       return requestTime + "|" + networkLatency;
    } catch (err) {
        return "Unknown";
    }
}


/* Fingerprint Timezone */
function fingerprint_timezone() {
    "use strict";
    var dtDate, numOffset, numGMTHours, numOut;
    try {
        dtDate = new Date();
        numOffset = dtDate.getTimezoneOffset();
        numGMTHours = (numOffset / 60) * (-1);
        numOut = numGMTHours;
        return numOut;
    } catch (err) {
        return glbOnError;
    }
}


/* Fingerprint Language */
function fingerprint_language() {
    "use strict";
    var strLang, strTypeLng, strTypeBrLng, strTypeSysLng, strTypeUsrLng, strOut;
    try {
        strTypeLng = typeof (navigator.language);
        strTypeBrLng = typeof (navigator.browserLanguage);
        strTypeSysLng = typeof (navigator.systemLanguage);
        strTypeUsrLng = typeof (navigator.userLanguage);

        if (strTypeLng !== "undefined") {
            strLang = "lang" + glbPair + navigator.language + glbSep;
        } else if (strTypeBrLng !== "undefined") {
            strLang = "lang" + glbPair + navigator.browserLanguage + glbSep;
        } else {
            strLang = "lang" + glbPair + glbSep;
        }
        if (strTypeSysLng !== "undefined") {
            strLang += "syslang" + glbPair + navigator.systemLanguage + glbSep;
        } else {
            strLang += "syslang" + glbPair + glbSep;
        }
        if (strTypeUsrLng !== "undefined") {
            strLang += "userlang" + glbPair + navigator.userLanguage;
        } else {
            strLang += "userlang" + glbPair;
        }
        strOut = strLang;
        return strOut;
    } catch (err) {
        return glbOnError;
    }
}


/* Fingerprint Display */
function fingerprint_display() {
    "use strict";
    var strFontSmoothing, strScreen, canvasNode, ctx, i, j, imageData, alpha, strDisplay, strOut;
    strScreen = window.screen;
    strDisplay = "";

    if (typeof (screen.fontSmoothingEnabled) !== "undefined") {
        strFontSmoothing = screen.fontSmoothingEnabled;
    } else {
        try {
            canvasNode = document.createElement('canvas');
            canvasNode.width = "35";
            canvasNode.height = "35";
            canvasNode.style.display = 'none';
            document.body.appendChild(canvasNode);
            ctx = canvasNode.getContext('2d');
            ctx.textBaseline = "top";
            ctx.font = "32px Arial";
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";
            ctx.fillText("O", 0, 0);
            for (j = 8; j <= 32; j = j + 1) {
                for (i = 1; i <= 32; i = i + 1) {
                    imageData = ctx.getImageData(i, j, 1, 1).data;
                    alpha = imageData[3];
                    if (alpha !== 255 && alpha !== 0) {
                        strFontSmoothing = "True"; // font-smoothing must be on.
                    }
                }
            }
            strFontSmoothing = "False";
        } catch (err) {
            strFontSmoothing = "Undefined";
        }
    }

    try {
        if (strScreen) {
            strDisplay += strScreen.colorDepth + glbSep + strScreen.width + glbSep + strScreen.height + glbSep + strScreen.availWidth + glbSep + strScreen.availHeight;
        }
        strOut = strDisplay  + glbSep + "fs" + glbPair + strFontSmoothing;
        return strOut;
    } catch (err) {
        return glbOnError;
    }
}


/* Fingerprint Flash Version */
function fingerprint_flash() {
    "use strict";
    var objPlayerVersion, strTemp, strOut;

    try {
        objPlayerVersion = swfobject.getFlashPlayerVersion();
        strTemp = objPlayerVersion.major + "." + objPlayerVersion.minor + "." + objPlayerVersion.release;
        if (strTemp === "0.0.0") {
            strTemp = "Not Installed";
        }
        strOut = strTemp;
        return strOut;
    } catch (err) {
        return "Not Installed";
    }
}


/* Detect Plugins */
function fingerprint_plugins() {
    "use strict";
    var htIEComponents, strKey, strName, strVersion, strTemp, bolFirst, iCount, strMimeType, strOut;

    try {
        /* Create hashtable of IE components */
        htIEComponents = new Hashtable();
        htIEComponents.put('7790769C-0471-11D2-AF11-00C04FA35D02', 'abk'); // Address Book
        htIEComponents.put('89820200-ECBD-11CF-8B85-00AA005B4340', 'wnt'); // Windows Desktop Update NT
        htIEComponents.put('47F67D00-9E55-11D1-BAEF-00C04FC2D130', 'aol'); // AOL ART Image Format Support
        htIEComponents.put('76C19B38-F0C8-11CF-87CC-0020AFEECF20', 'arb'); // Arabic Text Display Support
        htIEComponents.put('76C19B34-F0C8-11CF-87CC-0020AFEECF20', 'chs'); // Chinese (Simplified) Text Display Support
        htIEComponents.put('76C19B33-F0C8-11CF-87CC-0020AFEECF20', 'cht'); // Chinese (traditional) Text Display Support
        htIEComponents.put('9381D8F2-0288-11D0-9501-00AA00B911A5', 'dht'); // Dynamic HTML Data Binding
        htIEComponents.put('4F216970-C90C-11D1-B5C7-0000F8051515', 'dhj'); // Dynamic HTML Data Binding for Java
        htIEComponents.put('283807B5-2C60-11D0-A31D-00AA00B92C03', 'dan'); // DirectAnimation
        htIEComponents.put('44BBA848-CC51-11CF-AAFA-00AA00B6015C', 'dsh'); // DirectShow
        htIEComponents.put('76C19B36-F0C8-11CF-87CC-0020AFEECF20', 'heb'); // Hebrew Text Display Support
        htIEComponents.put('89820200-ECBD-11CF-8B85-00AA005B4383', 'ie5'); // Internet Explorer 5/6 Web Browser
        htIEComponents.put('5A8D6EE0-3E18-11D0-821E-444553540000', 'icw'); // Internet Connection Wizard
        htIEComponents.put('630B1DA0-B465-11D1-9948-00C04F98BBC9', 'ibe'); // Internet Explorer Browsing Enhancements
        htIEComponents.put('08B0E5C0-4FCB-11CF-AAA5-00401C608555', 'iec'); // Internet Explorer Classes for Java
        htIEComponents.put('45EA75A0-A269-11D1-B5BF-0000F8051515', 'ieh'); // Internet Explorer Help
        htIEComponents.put('DE5AED00-A4BF-11D1-9948-00C04F98BBC9', 'iee'); // Internet Explorer Help Engine
        htIEComponents.put('76C19B30-F0C8-11CF-87CC-0020AFEECF20', 'jap'); // Japanese Text Display Support
        htIEComponents.put('76C19B31-F0C8-11CF-87CC-0020AFEECF20', 'krn'); // Korean Text Display Support
        htIEComponents.put('76C19B50-F0C8-11CF-87CC-0020AFEECF20', 'lan'); // Language Auto-Selection
        htIEComponents.put('D27CDB6E-AE6D-11CF-96B8-444553540000', 'swf'); // Macromedia Flash
        htIEComponents.put('2A202491-F00D-11CF-87CC-0020AFEECF20', 'shw'); // Macromedia Shockwave Director
        htIEComponents.put('5945C046-LE7D-LLDL-BC44-00C04FD912BE', 'msn'); // MSN Messenger Service
        htIEComponents.put('22D6F312-B0F6-11D0-94AB-0080C74C7E95', 'wmp'); // Windows Media Player (Traditional Versions)
        htIEComponents.put('3AF36230-A269-11D1-B5BF-0000F8051515', 'obp'); // Offline Browsing Pack
        htIEComponents.put('44BBA840-CC51-11CF-AAFA-00AA00B6015C', 'oex'); // Outlook Express
        htIEComponents.put('44BBA842-CC51-11CF-AAFA-00AA00B6015B', 'net'); // NetMeeting NT
        htIEComponents.put('76C19B32-F0C8-11CF-87CC-0020AFEECF20', 'pan'); // Pan-European Text Display Support
        htIEComponents.put('76C19B35-F0C8-11CF-87CC-0020AFEECF20', 'thi'); // Thai Text Display Support
        htIEComponents.put('CC2A9BA0-3BDD-11D0-821E-444553540000', 'tks'); // Task Scheduler
        htIEComponents.put('3BF42070-B3B1-11D1-B5C5-0000F8051515', 'uni'); // Uniscribe
        htIEComponents.put('10072CEC-8CC1-11D1-986E-00A0C955B42F', 'vtc'); // Vector Graphics Rendering (VML)
        htIEComponents.put('76C19B37-F0C8-11CF-87CC-0020AFEECF20', 'vnm'); // Vietnamese Text Display Support
        htIEComponents.put('08B0E5C0-4FCB-11CF-AAA5-00401C608500', 'mvm'); // Microsoft virtual machine
        htIEComponents.put('4F645220-306D-11D2-995D-00C04F98BBC9', 'vbs'); // Visual Basic Scripting Support v5.6
        htIEComponents.put('73FA19D0-2D75-11D2-995D-00C04F98BBC9', 'wfd'); // Web Folders
        htIEComponents.put('6BF52A52-394A-11D3-B153-00C04F79FAA6', 'wmq'); // Windows Media Player (Versions 7, 8 or 9)
        htIEComponents.put('9030D464-4C02-4ABF-8ECC-5164760863C6', 'mlv'); // Windows Live ID Sign-in Helper
        htIEComponents.put('DE4AF3B0-F4D4-11D3-B41A-0050DA2E6C21', 'qtc'); // Apple Quick Time Check
        htIEComponents.put('4063BE15-3B08-470D-A0D5-B37161CFFD69', 'aqt'); // Apple Quick Time
        htIEComponents.put('3049C3E9-B461-4BC5-8870-4C09146192CA', 'rpd'); // RealPlayer Download and Record Plugin for IE
        htIEComponents.put('238F6F83-B8B4-11CF-8771-00A024541EE3', 'ica'); // Citrix ICA Client
        htIEComponents.put('90E2BA2E-DD1B-4CDE-9134-7A8B86D33CA7', 'wex'); // WebEx Productivity Tools
        strTemp = "";
        bolFirst = true;

        /* strOpera gives full path of the file, extract the filenames, ignoring description and length */
        if (navigator.plugins.length > 0) {
            for (iCount = 0; iCount < navigator.plugins.length; iCount = iCount + 1) {
                if (bolFirst === true) {
                    strTemp += navigator.plugins[iCount].name;
                    bolFirst = false;
                } else {
                    strTemp += glbSep + navigator.plugins[iCount].name;
                }
            }
        } else if (navigator.mimeTypes.length > 0) {
            strMimeType = navigator.mimeTypes;
            for (iCount = 0; iCount < strMimeType.length; iCount = iCount + 1) {
                if (bolFirst === true) {
                    strTemp += strMimeType[iCount].description;
                    bolFirst = false;
                } else {
                    strTemp += glbSep + strMimeType[iCount].description;
                }
            }
        } else {
            document.body.addBehavior("#default#clientCaps");
            strKey = htIEComponents.keys();
            for (iCount = 0; iCount < htIEComponents.size(); iCount = iCount + 1) {
                strVersion = activeXDetect(strKey[iCount]);
                strName = htIEComponents.get(strKey[iCount]);
                if (strVersion) {
                    if (bolFirst === true) {
                        strTemp = strName + glbPair + strVersion;
                        bolFirst = false;
                    } else {
                        strTemp += glbSep + strName + glbPair + strVersion;
                    }
                }
            }
            strTemp = strTemp.replace(/,/g, ".");
        }
        strTemp = stripIllegalChars(strTemp);
        if (strTemp === "") {
            strTemp = "Not Installed";
        }
        strOut = strTemp;
        return strOut;
    } catch (err) {
        return "Not Installed";
    }
}


/* set HTML Cookie */
function setCookie(strCookieName, strSetValue, numExpDays) {
    "use strict";
    var dtDate, strCookieValue;
    try {
        dtDate = new Date();
        dtDate.setDate(dtDate.getDate() + numExpDays);
        strCookieValue = escape(strSetValue) + ((numExpDays === null) ? "" : "; expires=" + dtDate.toUTCString());
        document.cookie = strCookieName + "=" + strCookieValue;
    } catch (err) {
        return glbOnError;
    }
}


/* get HTML Cookie */
function getCookie(strCookieName) {
    "use strict";
    var strCookieValue, strCookieStart, strCookieEnd;
    try {
        strCookieValue = document.cookie;
        strCookieStart = strCookieValue.indexOf(" " + strCookieName + "=");
        if (strCookieStart === -1) {
            strCookieStart = strCookieValue.indexOf(strCookieName + "=");
        }
        if (strCookieStart === -1) {
            strCookieValue = null;
        } else {
            strCookieStart = strCookieValue.indexOf("=", strCookieStart) + 1;
            strCookieEnd = strCookieValue.indexOf(";", strCookieStart);
            if (strCookieEnd === -1) {
                strCookieEnd = strCookieValue.length;
            }
            strCookieValue = unescape(strCookieValue.substring(strCookieStart, strCookieEnd));
        }
        return strCookieValue;
    } catch (err) {
        return glbOnError;
    }
}


/* Check fingerprint */
function fingerprint_hash() {
    "use strict";
    var fp_ua, fp_tb, fp_br, fp_os, fp_di, fp_to, fp_cn, fp_ti, fp_la, fp_pl, fp_fl, fp_si, fp_ja, fp_co, fp_fo, strBrowser, strEnvironment, strLocation, strSoftware, strCapabilites, strHash, strCookie, strComplete, strOut;
    try {
        fp_ua = fingerprint_useragent();
        fp_tb = fingerprint_truebrowser();
        fp_br = fingerprint_browser();
        fp_os = fingerprint_os();
        fp_di = fingerprint_display();
        fp_to = fingerprint_touch();
        fp_cn = fingerprint_connection();
        fp_ti = fingerprint_timezone();
        fp_la = fingerprint_language();
        fp_pl = fingerprint_plugins();
        fp_fl = fingerprint_flash();
        fp_si = fingerprint_silverlight();
        fp_ja = fingerprint_java();
        fp_co = fingerprint_cookie();
        fp_fo = fingerprint_fonts();
        strBrowser = md5(fp_ua + fp_tb + fp_br + fp_os);
        strEnvironment = md5(fp_ua + fp_di + fp_to + fp_cn);
        strLocation = md5(fp_ti + fp_la);
        strSoftware = md5(fp_pl);
        strCapabilites = md5(fp_fl + fp_si + fp_ja + fp_co + fp_fo);
        strComplete = md5(fp_ua + fp_tb + fp_br + fp_os + fp_di + fp_to + fp_co + fp_ti + fp_la + fp_pl + fp_fl + fp_si + fp_ja + fp_co + fp_fo);
        strHash = strComplete + glbSep + strBrowser + glbSep + strEnvironment + glbSep + strLocation + glbSep + strSoftware + glbSep + strCapabilites;
        strCookie = getCookie("fingerprint");
        if (strCookie === null) {
            setCookie("fingerprint", strHash, 365);
            strOut = "new" + glbPair + strHash;
        }
        if (strCookie === strHash) {
            setCookie("fingerprint", strHash, 365);
            strOut = "existing" + glbPair + strHash;
        }
        if (strCookie !== strHash) {
            setCookie("fingerprint", strHash, 365);
            strOut = "replace" + glbPair + strCookie + "/" + strHash;
        }
        return strOut;
    } catch (err) {
        return glbOnError;
    }
}


/* Fingerprint IP */
function fingerprint_IP() {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    for (i=0; hostipInfo.length >= i; i++) {
        ipAddress = hostipInfo[i].split(":");
        if ( ipAddress[0] == "IP" ) return ipAddress[1];
    }

    return false;
}


/* Fingerprint response headers */
function fingerprint_headers() {
	var headers;
	for (var j = 0; j < getHttp.length(); j++) {
    	headers += getHttp.header(j) + ": " + getHttp.data(j) + "; ";
	}
	return headers;
}


/* Fingerprint computer name (only for Internet Explorer) */
function fingerprint_computer_name() {
	var name = new ActiveXObject("WScript.Network");
	return name;
}


/* Fingerprint HTML5 web storage */
function fingerprint_web_storage() {
	var storage;
	if ('localStorage' in window && window['localStorage'] !== null) {
		storage = "Local Storage: 1; ";
	}
	else {
		storage = "Local Storage: 0; ";
	}
	if ('sessionStorage' in window && window['sessionStorage'] !== null) {
		storage += "Session Storage: 1";
	}
	else {
		storage += "Session Storage: 0";
	}
	return storage;
}


/* Fingerprint HTML5 geolocation */
function fingerprint_geolocation() {
	var p;
	if (navigator.geolocation) {
		// geolocation is available
		navigator.geolocation.getCurrentPosition(function(position) {
			do_something(position);     
		});

		function do_something(position){
			// use position.coords.latitude, position.coords.longitude there
			alert(position.coords.latitude);
		}
	}
}


// set Flash cookie
// wait until the page has finished loading before starting
function fingerprint_set_flash_cookie(){
	
	var mySwfStore = new SwfStore({
		
		namespace: 'dl.dropboxusercontent.com', // the this must match all other instances that want to share cookies
			
		swf_url: '//dl.dropboxusercontent.com/u/86433420/site/storage.swf', // to work cross-domain, use the same absolute url on both pages (meaning http://site.com/path/to/store.swf not just /path/to.store.swf. You may need to use // instead of https:// to work around flashplayer bugs.)
			
		onready: function(){		
			// set up an onclick handler to save the text to the swfStore whenever the Save button is clicked
			// IE converts null to "null", so we're adding an `or "" ` to the end to fix that
			mySwfStore.set('test_flash_cookie', "test_value" );
		},
		
		onerror: function(){
			// in case we had an error. (The most common cause is that the user disabled flash cookies.)
			var result = document.getElementById("flash_cookie_fingerprint");
			result.value = 0;
			var display = document.getElementById("flash_cookies_display");
			display.innerHTML = 0;
		}
	});
};


// get Flash cookie
function fingerprint_get_flash_cookie(){
	
	var result = document.getElementById("flash_cookie_fingerprint");
	result.value = 0;
	
	var mySwfStore = new SwfStore({
		
		namespace: 'dl.dropboxusercontent.com', // the this must match all other instances that want to share cookies
			
		swf_url: '//dl.dropboxusercontent.com/u/86433420/site/storage.swf', // to work cross-domain, use the same absolute url on both pages (meaning http://site.com/path/to/store.swf not just /path/to.store.swf. You may need to use // instead of https:// to work around flashplayer bugs.)
			
		onready: function(){
			// set up an onclick handler to save the text to the swfStore whenever the Save button is clicked
			// IE converts null to "null", so we're adding an `or "" ` to the end to fix that
			var tempObject = mySwfStore.get('test_flash_cookie');
			var tempString = tempObject.valueOf();
			if (tempString == "test_value") {
				var result = document.getElementById("flash_cookie_fingerprint");
				result.value = 1;
				var display = document.getElementById("flash_cookies_display");
				display.innerHTML = 1;
		
			}
		},
			
		onerror: function(){
			// in case we had an error. (The most common cause is that the user disabled flash cookies.)
			var result = document.getElementById("flash_cookie_fingerprint");
			result.value = 0;
			var display = document.getElementById("flash_cookies_display");
			display.innerHTML = 0;
		}
	});	
}
