package history.cs.columbia.edu;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;

import java.util.ArrayList;
import java.util.List;

// service for sending browser and app history to a PHP server
// (located at https://datavpnserver.cs.columbia.edu/submission.php)
public class WebPostService extends Service {

    private static final String TAG = "WebPostService";
    private boolean isRunning  = false;

    @Override
    public void onCreate() {
        Log.i(TAG, "Service onCreate");
        isRunning = true;
    }

    @Override
    public int onStartCommand(final Intent intent, int flags, int startId) {

        Log.i(TAG, "Service onStartCommand");

        // creating new thread for service
        // always write long running tasks in separate thread to avoid ANR
        new Thread(new Runnable() {
            @Override
            public void run() {

            try {
                // get history from AlarmBroadCastReceiver.java
                String history = intent.getStringExtra("History");

                // server url where the data will be posted
                String postReceiverUrl = "https://datavpnserver.cs.columbia.edu/submission.php";
                Log.v(TAG, "postURL: " + postReceiverUrl);

                // set HttpClient
                HttpClient httpClient = new DefaultHttpClient();

                // set post header
                HttpPost httpPost = new HttpPost(postReceiverUrl);

                // add history data
                List<NameValuePair> pairs = new ArrayList<>();
                pairs.add(new BasicNameValuePair("serverData", history));

                // prepare HTTP post request
                httpPost.setEntity(new UrlEncodedFormEntity(pairs, HTTP.UTF_8));
                httpPost.setHeader("Content-Type", "application/x-www-form-urlencoded");

                // execute HTTP post request
                httpClient.execute(httpPost);
            }

            catch (Exception e) {
                e.printStackTrace();
            }

            if (isRunning){
                Log.i(TAG, "Service running");
            }

            }
        }).start();

        // keep service running with START_STICKY
        return Service.START_STICKY;
    }

    @Override
    public IBinder onBind(Intent arg0) {
        Log.i(TAG, "Service onBind");
        return null;
    }

    @Override
    public void onDestroy() {
        isRunning = false;
        Log.i(TAG, "Service onDestroy");
    }
}