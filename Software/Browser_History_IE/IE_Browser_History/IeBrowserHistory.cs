/*
 * Software is released under the GPL-3.0 License.
 * Copyright (c) 2016, Sebastian Zimmeck
 * All rights reserved.
 *
 */

// IeBrowserHistory.cs
//http://markcz.wordpress.com/2011/12/27/how-to-create-internet-explorer-addin-in-csharp/
// cd C:\Users\Sebastian\Documents\Visual Studio 2013\Projects\IE_Browser_History\IE_Browser_History\bin\Debug
// regasm /codebase IE_Browser_History.dll
// regasm /u IE_Browser_History.dll
// signed with Strong_Name_Key.snk (file included in the project)

using System;
using System.Text;
using System.Text.RegularExpressions;
using SHDocVw;
using System.IO;
using System.Web;
using System.Net;
using Microsoft.Win32;
using System.Runtime.InteropServices;
using System.Diagnostics;
using System.Windows.Forms;


namespace IE_Browser_History
{
    [
    ComVisible(true),
    Guid("6F36BC96-7999-485E-9909-EC9B7B9E7E25"),
    ClassInterface(ClassInterfaceType.None)
    ]
    public class BHO : IObjectWithSite
    {
        SHDocVw.WebBrowser webBrowser;

        public void OnDocumentComplete(object pDisp, ref object URL)
        {
            // OnDocumentComplete fires each time an item (advertisement, image, etc.) is loaded
            // thus, exit for all loaded items except for the website that the user requested
            if (!ReferenceEquals(pDisp, webBrowser))
            {
                return;
            }
            
            // get the local HTML cookie value that identifies the user
            string domain = "www.sebastianzimmeck.de/";
            string cookieValue = getCookie(domain);

            // get date, time, current URL, title of the URL, tab (process) ID, and IPv4 address
            string date = DateTime.Now.ToString("M/d/yyyy");
            string time = DateTime.Now.ToString("HH:mm:ss");
            // To do: get referrer
            // var context = System.Web.HttpContext.CurrentHandler; 
            string url = URL.ToString();
            string urlTitle = getTitle(url);
            int activeTabId = (int)Process.GetCurrentProcess().Id;
            string ip = getHostIp();
            
            string historyEntry = cookieValue + "|" + date + "," + time + "," + url + "," + urlTitle + "," + activeTabId + "," + ip + "\n";
            // escape ampersand and other characters that are not displayed correctly in PHP posts
            string encodedHistoryEntry = Uri.EscapeDataString(historyEntry);

            // create local text file and save browser history entry
            string fileName = "C:\\internet_explorer_browsing_history.csv";
            using (FileStream fs = new FileStream(fileName, FileMode.Append, FileAccess.Write))
            using (StreamWriter sw = new StreamWriter(fs))
            {
                sw.Write(historyEntry);
            }

            // send browser history entry to server
            postServerData(encodedHistoryEntry);
        }

        // helper function for getting the cookie object
        // http://www.codeproject.com/Articles/330142/Cookie-Quest-A-Quest-to-Read-Cookies-from-Four-Pop
        public static string getCookie(string strHost)
        {
            string strPath, strCookie;
            string strValue = "";
            string[] fp;
            StreamReader sr;

            try
            {
                // in Windows 7 cookies are stored at C:\Users\<user name>\AppData\Roaming\Microsoft\Windows\Cookies
                strPath = Environment.GetFolderPath(Environment.SpecialFolder.Cookies);
                Version v = Environment.OSVersion.Version;

                // if (IsWindows7())
                // {
                //     strPath += @"\low";
                // }

                fp = Directory.GetFiles(strPath, "*.txt");

                foreach (string path in fp)
                {
                    sr = File.OpenText(path);
                    strCookie = sr.ReadToEnd();
                    sr.Close();

                    if (System.Text.RegularExpressions.Regex.IsMatch(strCookie, strHost))
                    {
                        string[] cookieContent = strCookie.Replace("\r", "").Split('\n');
                        strValue = cookieContent[1];
                    }
                }
            }
            // exception if file not found etc.
            catch (Exception e)
            {
                MessageBox.Show("Error : " + e.Message + ", Please contact us at sebastian@cs.columbia.edu");
            }

            return strValue;
        }

        // helper function for getting the URL title
        public static string getTitle(string url)
        {
            try
            {
                WebClient x = new WebClient();
                string source = x.DownloadString(url);
                string title = Regex.Match(source, @"\<title\b[^>]*\>\s*(?<Title>[\s\S]*?)\</title\>",
                    RegexOptions.IgnoreCase).Groups["Title"].Value;
                return title;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Could not connect. Error:" + ex.Message);
                return "Error";
            }
        }


        // helper function for getting the host name and IPv4 address
        public static string getHostIp()
        {
            string hostName = Dns.GetHostName();
            IPHostEntry host = Dns.GetHostEntry(hostName);
            string ipAddress = "";

            foreach (IPAddress ip in host.AddressList)
            {
                if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                {
                    ipAddress = ip.ToString();
                }

            }
            string hostIp = hostName + "," + ipAddress;
            return hostIp;
        }


        // WebRequest function for posting the current browser history entry;
        // for secure data transmission use a server with HTTPS
        // note the necessary content type application/x-www-form-urlencoded
        // note that the name "serverData=" must correspond to the variable name in the PHP server file
        public static void postServerData(string data)
        {
            try
            {
                ASCIIEncoding encoding = new ASCIIEncoding();
                string postData = "serverData=" + data;
                byte[] serverData = encoding.GetBytes(postData);

                WebRequest request = WebRequest.Create("http://www.sebastianzimmeck.de/submission2.php");
                request.Method = "POST";
                request.ContentType = "application/x-www-form-urlencoded";
                request.ContentLength = serverData.Length;

                Stream stream = request.GetRequestStream();
                stream.Write(serverData, 0, serverData.Length);
                stream.Close();

                WebResponse response = request.GetResponse();
                stream = response.GetResponseStream();

                StreamReader sr = new StreamReader(stream);
                // comment out the following line to test whether server connection is working
                // MessageBox.Show(sr.ReadToEnd());

                sr.Close();
                stream.Close();
            }
            catch (Exception e)
            {
                MessageBox.Show("Error : " + e.Message + ", Please contact us at sebastian@cs.columbia.edu");
            }
        }


        // from here on administrative code
        public static string BHOKEYNAME = "Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Browser Helper Objects";

        [ComRegisterFunction]
        public static void RegisterBHO(Type type)
        {
            RegistryKey registryKey = Registry.LocalMachine.OpenSubKey(BHOKEYNAME, true);

            if (registryKey == null)
                registryKey = Registry.LocalMachine.CreateSubKey(BHOKEYNAME);

            string guid = type.GUID.ToString("B");
            RegistryKey ourKey = registryKey.OpenSubKey(guid);

            if (ourKey == null)
                ourKey = registryKey.CreateSubKey(guid);

            ourKey.SetValue("Alright", 1);
            ourKey.SetValue("NoExplorer", 1);
            registryKey.Close();
            ourKey.Close();
        }

        [ComUnregisterFunction]
        public static void UnregisterBHO(Type type)
        {
            RegistryKey registryKey = Registry.LocalMachine.OpenSubKey(BHOKEYNAME, true);
            string guid = type.GUID.ToString("B");

            if (registryKey != null)
                registryKey.DeleteSubKey(guid, false);
        }

        public int SetSite(object site)
        {
            if (site != null)
            {
                webBrowser = (SHDocVw.WebBrowser)site;
                webBrowser.DocumentComplete += new DWebBrowserEvents2_DocumentCompleteEventHandler(this.OnDocumentComplete);
            }
            else
            {
                webBrowser.DocumentComplete -= new DWebBrowserEvents2_DocumentCompleteEventHandler(this.OnDocumentComplete);
                webBrowser = null;
            }

            return 0;

        }

        public int GetSite(ref Guid guid, out IntPtr ppvSite)
        {
            IntPtr punk = Marshal.GetIUnknownForObject(webBrowser);
            int hr = Marshal.QueryInterface(punk, ref guid, out ppvSite);
            Marshal.Release(punk);

            return hr;
        }
    }
}
