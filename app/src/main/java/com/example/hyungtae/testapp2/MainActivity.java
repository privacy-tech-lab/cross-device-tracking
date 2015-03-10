package com.example.hyungtae.testapp2;

import android.content.Context;
import android.content.SharedPreferences;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.database.Cursor;
import android.net.Uri;
import android.provider.Browser;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.content.Intent;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;


public class MainActivity extends ActionBarActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button button1 = (Button)findViewById(R.id.button_1);
        context = getApplicationContext();

        button1.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View arg0) {
                try {

                    Intent intent = new Intent(MainActivity.this, WebService.class);
                    startService(intent);

                    SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
                    lastChecked = settings.getLong("lastChecked", 0);
                    Uri uriCustom;
                    String sel = Browser.BookmarkColumns.BOOKMARK + " = 0"; // 0 = history, 1 = bookmark
                    Cursor mCur;
                    File file = new File(context.getExternalCacheDir() + "/WebUsage.txt");
                    file.createNewFile();

                    for (int i=0; i<browsers.length; i++) {

                        String browser = browsers[i];
                        String browserID = browserIDs[i];
                        uriCustom = Uri.parse(browser);
                        try {
                            mCur = getContentResolver().query(uriCustom, proj, sel, null, null);
                            if (mCur != null)
                                parseHistory(mCur, file, browserID);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }

                    Uri uri = Uri.parse("file://" + file.getAbsolutePath());
                    Intent sharingIntent = new Intent(Intent.ACTION_SEND);
                    sharingIntent.setType("vnd.android.cursor.dir/email");
                    sharingIntent.putExtra(Intent.EXTRA_EMAIL, new String[]{"me@hyungtaekim.com"});
                    sharingIntent.putExtra(Intent.EXTRA_STREAM, uri);
                    sharingIntent.putExtra(Intent.EXTRA_SUBJECT, "Web Usage Stats");
                    sharingIntent.putExtra(Intent.EXTRA_TEXT, "Please replace this text with your e-mail " +
                            "address that you used throughout this study.");
                    startActivity(Intent.createChooser(sharingIntent, "Send email"));

                    SharedPreferences.Editor editor = settings.edit();
                    lastChecked = System.currentTimeMillis()/1000;
                    editor.putLong("lastChecked", lastChecked);
                    editor.apply();
                }
                catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    private void parseHistory(Cursor mCur, File file, String browserID) throws IOException {

        mCur.moveToFirst();

        long unixDate;
        String url;
        String title;
        String visits;
        long unixCreated;
        String dl = ",";

        FileWriter writer = new FileWriter(file.getAbsolutePath(), true);

        if (mCur.moveToFirst() && mCur.getCount() > 0) {

            while (!mCur.isAfterLast()) {

                // convert UNIX access date to human-readable format
                unixDate = Long.parseLong(mCur.getString(mCur.getColumnIndex(proj[0])));
                SimpleDateFormat sdfDate = new SimpleDateFormat("MM/dd/yyyy,hh:mm:ss,z", Locale.US);
                String date = sdfDate.format(new Date(unixDate));

                url = mCur.getString(mCur.getColumnIndex(proj[1]));
                title = mCur.getString(mCur.getColumnIndex(proj[2]));
                visits = mCur.getString(mCur.getColumnIndex(proj[3]));

                // convert UNIX create date to human-readable format
                unixCreated = Long.parseLong(mCur.getString(mCur.getColumnIndex(proj[4])));
                SimpleDateFormat sdfCreated = new SimpleDateFormat("MM/dd/yyyy,hh:mm:ss,z", Locale.US);
                String created = sdfCreated.format(new Date(unixCreated));

                if (unixDate < lastChecked) {
                    mCur.moveToNext();
                    continue;
                }

                writer.write(browserID + dl+ date + dl + url + dl + title + dl + visits + dl + created + '\n');
                mCur.moveToNext();
            }
        }

        writer.close();
        mCur.close();
    }

    private final String[] proj = new String[] {
            Browser.BookmarkColumns.DATE,
            Browser.BookmarkColumns.URL,
            Browser.BookmarkColumns.TITLE,
            Browser.BookmarkColumns.VISITS,
            Browser.BookmarkColumns.CREATED};

    private final String[] browsers = new String[]{
            "content://com.android.chrome.browser/bookmarks",
            "content://com.android.chrome.beta.browser/bookmarks",
            "content://com.android.browser/bookmarks",
            "content://browser/bookmarks",
            "content://com.firefox.browser/bookmarks",
            "content://org.mozilla.firefox.db.browser/bookmarks",
            "content://com.sec.android.app.sbrowser.browser/bookmarks",
            };

    private final String[] browserIDs = new String[]{
            "Chrome",
            "Chrome Beta",
            "Native Android 1",
            "Native Android 2",
            "Firefox 1",
            "Firefox 2",
            "S-Browser"};

    private long lastChecked = 0;
    private static Context context;
    public static final String PREFS_NAME = "MyPrefsFile";
}