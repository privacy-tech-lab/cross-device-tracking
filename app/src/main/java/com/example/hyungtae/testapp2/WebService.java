package com.example.hyungtae.testapp2;

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


public class WebService extends Service {

    private static final String TAG = "HelloService";

    private boolean isRunning  = false;

    @Override
    public void onCreate() {
        Log.i(TAG, "Service onCreate");

        isRunning = true;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        Log.i(TAG, "Service onStartCommand");

        //Creating new thread for my service
        //Always write your long running tasks in a separate thread, to avoid ANR
        new Thread(new Runnable() {
            @Override
            public void run() {

                //Your logic that service will perform will be placed here
                try {

                    // url where the data will be posted
                    String postReceiverUrl = "https://datavpnserver.cs.columbia.edu/submission.php";
                    Log.v(TAG, "postURL: " + postReceiverUrl);

                    // HttpClient
                    HttpClient httpClient = new DefaultHttpClient();

                    // post header
                    HttpPost httpPost = new HttpPost(postReceiverUrl);

                    // add your data
                    String testString = "identifier|url,title,date";
                    List<NameValuePair> pairs = new ArrayList<>();
                    pairs.add(new BasicNameValuePair("serverData", testString));

                    httpPost.setEntity(new UrlEncodedFormEntity(pairs, HTTP.UTF_8));

                    httpPost.setHeader("Content-Type", "application/x-www-form-urlencoded");

                    // execute HTTP post request
                    httpClient.execute(httpPost);

                } catch (Exception e) {
                    e.printStackTrace();
                }

                if(isRunning){
                    Log.i(TAG, "Service running");
                }

                //Stop service once it finishes its task
                //stopSelf();
            }
        }).start();

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
