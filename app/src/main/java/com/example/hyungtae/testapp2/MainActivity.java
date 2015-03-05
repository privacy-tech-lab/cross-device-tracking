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

//TODO Add field to set user_id
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
                    SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
                    lastChecked = settings.getLong("lastChecked", 0);
                    Uri uriCustom;
                    String sel = Browser.BookmarkColumns.BOOKMARK + " = 0"; // 0 = history, 1 = bookmark
                    Cursor mCur;
                    //TODO Filename should depend on username and time
                    File file = new File(context.getExternalCacheDir() + "/hist.txt");
                    file.createNewFile();
                    for (String browser : browsers) {
                        uriCustom = Uri.parse(browser);
                        //TODO more elegant error handling
                        try {
                            mCur = getContentResolver().query(uriCustom, proj, sel, null, null);
                            if (mCur != null)
                                parseHistory(mCur, file);
                        } catch (Exception e) {

                        }
                    }

                    Uri uri = Uri.parse("file://" + file.getAbsolutePath());
                    Intent sharingIntent = new Intent(Intent.ACTION_SEND);
                    sharingIntent.setType("vnd.android.cursor.dir/email");
                    //TODO Change the email address
                    sharingIntent.putExtra(Intent.EXTRA_EMAIL, new String[]{"sebastian@cs.columbia.edu"});
                    sharingIntent.putExtra(Intent.EXTRA_STREAM, uri);
                    sharingIntent.putExtra(Intent.EXTRA_SUBJECT, "Browser History Log");
                    sharingIntent.putExtra(Intent.EXTRA_TEXT, "");
                    startActivity(Intent.createChooser(sharingIntent, "Send email"));

                    SharedPreferences.Editor editor = settings.edit();
                    lastChecked = System.currentTimeMillis()/1000;
                    editor.putLong("lastChecked", lastChecked);
                    editor.commit();
                }
                catch (IOException e) {

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

    private void parseHistory(Cursor mCur, File file) throws IOException {
        mCur.moveToFirst();
        String title;
        String url;
        String date;
        String visits ;
        String created;
        String dl = "\t";

        FileWriter writer = new FileWriter(file.getAbsolutePath(), true);
        if (mCur.moveToFirst() && mCur.getCount() > 0) {
            while (!mCur.isAfterLast()) {
                title = mCur.getString(mCur.getColumnIndex(proj[0]));
                url = mCur.getString(mCur.getColumnIndex(proj[1]));
                date = mCur.getString(mCur.getColumnIndex(proj[2]));
                visits = mCur.getString(mCur.getColumnIndex(proj[3]));
                created = mCur.getString(mCur.getColumnIndex(proj[4]));

                //TODO Store the last checked time

                if (Long.parseLong(date) < lastChecked) {
                    mCur.moveToNext();
                    continue;
                }

                writer.write(title + dl + url + dl + date + dl + visits + dl + created + '\n');
                mCur.moveToNext();
            }
        }
        writer.close();
        mCur.close();
    }

    private final String[] proj = new String[] {
            Browser.BookmarkColumns.TITLE,
            Browser.BookmarkColumns.URL,
            Browser.BookmarkColumns.DATE,
            Browser.BookmarkColumns.VISITS,
            Browser.BookmarkColumns.CREATED};

    private final String[] browsers = new String[]{
            "content://com.android.chrome.browser/bookmarks",
            "content://com.android.chrome.beta.browser/bookmarks",
            "content://com.firefox.browser/bookmarks",
            "content://org.mozilla.firefox.db.browser/bookmarks",
            "content://com.android.browser/bookmarks",
            "content://browser/bookmarks"};

    private long lastChecked = 0;
    private static Context context;
    public static final String PREFS_NAME = "MyPrefsFile";
}