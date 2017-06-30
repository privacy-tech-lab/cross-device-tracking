/*
 * Software is released under the GPL-3.0 License.
 * Copyright (c) 2016, Sebastian Zimmeck
 * All rights reserved.
 *
 */

 package history.cs.columbia.edu;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;
import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.provider.Browser;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

// receiver for the broadcast from the myActivity class to start the history collection
// retrieves the browser/app history and starts the web post service
public class AlarmBroadCastReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {

        ContentResolver contentResolver = context.getContentResolver();

        // get user ID from internal storage
        SharedPreferences pref = PreferenceManager.getDefaultSharedPreferences(context);
        String userID = pref.getString("userID", "NA") + "_mobile";

        // variables for processing app and browsing history
        String curAppHistory, curBrowsingHistory;
        curAppHistory = curBrowsingHistory = userID + "|";
        String sel = Browser.BookmarkColumns.BOOKMARK + " = 0"; // 0 = history, 1 = bookmark
        Cursor mCur;

        // calculate previous date to identify the most recent browsing history
        // Android overwrites old history items with new dates when they are visited again
        // thus, we query the browser history every alarm interval checking for new data
        // the alarm interval for browsing and app history is the same
        // the interval between curDate and prevDate must be exactly the time interval in
        // MainActivity.java and DeviceBootReceiver.java; set the interval in Global.java
        Globals g = Globals.getInstance();
        int interval = g.getInterval();
        long curDate = System.currentTimeMillis();
        long prevDate = curDate - interval;
        SimpleDateFormat sdfDate = new SimpleDateFormat("MM/dd/yyyy,kk:mm:ss,zzzz", Locale.US);

        // get new app history
        try {
            curAppHistory += getAppHistory(context, curDate, sdfDate);
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        // post any new app history (except for browsing apps, which are covered by browsing history)
        if (!curAppHistory.equals(userID + "|") && !curAppHistory.contains("com.android.chrome") &&
                !curAppHistory.contains("browser")) {
            postHistory(context, curAppHistory);
        }

        // get browsing history
        for (int i = 0; i < browsers.length; i++) {

            String browser = browsers[i];
            String browserID = browserIDs[i];

            Uri uriCustom = Uri.parse(browser);
            try {
                mCur = contentResolver.query(uriCustom, historyItems, sel, null, null);
                if (mCur != null) {
                    curBrowsingHistory += getBrowsingHistory(mCur, browserID, prevDate, sdfDate);
                }
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }

        // post any new browsing history
        if (!curBrowsingHistory.equals(userID + "|")) {
            postHistory(context, curBrowsingHistory);
        }
    }

    // helper function for posting new app and browsing history
    void postHistory(Context context, String history) {

        // instantiate WebPostService.java
        Intent webServiceIntent = new Intent(context, WebPostService.class);
        // pass in history
        webServiceIntent.putExtra("History", history);
        // start service
        context.startService(webServiceIntent);
    }

    // helper function for getting new app history
    private String getAppHistory(Context context, long curDate, SimpleDateFormat sdfDate)
            throws IOException {

        String appHistoryItem = "";

        // get date of last access to app; convert UNIX date to human-readable format
        String writeCurDate = sdfDate.format(new Date(curDate));

        // instantiate app history collection class CurrentApplicationPackageRetriever.java
        // in theory there should be only one current foreground process
        // however, due to the difficulties in the API, there may be multiple
        CurrentApplicationPackageRetriever r = new CurrentApplicationPackageRetriever(context);
        String[] process = r.get();
        String curProcess = "";
        for (int i = 0; i < process.length; i++) {
            curProcess += process[i] + " ";
        }

        // save current process as previous process to check for new processes in next iteration
        Globals g = Globals.getInstance();
        String prevProcess = g.getPrevProcess();
        Log.v("Process", "previous Process: " + prevProcess + ", current Process: " + curProcess);
        g.setPrevProcess(curProcess);

        // if the foreground process has changed, prepare new app history item
        if (!prevProcess.equals(curProcess)) {
            appHistoryItem += ",App," + writeCurDate + ",N/A,N/A," + curProcess + ",N/A\n";
        }

        return appHistoryItem;
    }

    // helper function for getting new browsing history
    private String getBrowsingHistory(Cursor mCur, String browserID, long prevDate, SimpleDateFormat sdfDate)
            throws IOException {

        long itemDate;
        String url;
        String title;
        String browsingHistoryItems = "";

        mCur.moveToFirst();

        if (mCur.moveToFirst() && mCur.getCount() > 0) {

            while (!mCur.isAfterLast()) {

                // get date of last access to URL; convert UNIX date to human-readable format
                itemDate = Long.parseLong(mCur.getString(mCur.getColumnIndex(historyItems[0])));
                String writeItemDate = sdfDate.format(new Date(itemDate));

                // get URL and title of pages
                url = mCur.getString(mCur.getColumnIndex(historyItems[1]));
                title = mCur.getString(mCur.getColumnIndex(historyItems[2]));

                // if the date of the current history item is older than the current time minus the specified interval,
                // the item was already posted and can be skipped
                if (itemDate < prevDate) {
                    mCur.moveToNext();
                    continue;
                }

                // add history item to history string
                browsingHistoryItems += "," + browserID + "," + writeItemDate + ",N/A,N/A,\"" + url + "\",\"" + title + "\"\n";
                mCur.moveToNext();
            }
        }

        mCur.close();
        return browsingHistoryItems;
    }

    // variables for accessing the browsing history APIs
    private final String[] historyItems = new String[] {
            Browser.BookmarkColumns.DATE,
            Browser.BookmarkColumns.URL,
            Browser.BookmarkColumns.TITLE
    };

    private final String[] browsers = new String[]{
            "content://com.android.chrome.browser/bookmarks",
            "content://com.android.browser/bookmarks",
            "content://browser/bookmarks",
            "content://com.sec.android.app.sbrowser.browser/bookmarks",
            "content://com.sec.android.app.sbrowser.browser/history"
    };

    // the browser IDs are not always correct because multiple browsers are using the same content
    // receiver and which one they are using also depends on the Android API version and device manufacturer
    // note: Android API 23 and higher does not support the bookmarks API anymore, thus, individual
    // applications need to provide a publicly accessible API (e.g., as the S-Browser with history)
    private final String[] browserIDs = new String[]{
            "Chrome",
            "Native Android",
            "Native Android",
            "S-Browser",
            "S-Browser"
    };
}