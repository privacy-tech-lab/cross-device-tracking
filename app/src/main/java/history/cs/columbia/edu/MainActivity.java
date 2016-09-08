// if build error occurs due to expiration of debug certificate, delete the debug.keystore file at
// C:\Users\<user>\.android\ (http://developer.android.com/tools/publishing/app-signing.html#expdebug)
package history.cs.columbia.edu;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.View;
import android.widget.Toast;

// main activity for starting and stopping the collection of browsing history
// once the user entered his or her e-mail the collection should start automatically
// and also resume after the device was rebooted
public class MainActivity extends Activity {

    private PendingIntent pendingIntent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_activity);

        // retrieve a PendingIntent that will broadcast an alarm
        Intent alarmIntent = new Intent(MainActivity.this, AlarmBroadCastReceiver.class);
        pendingIntent = PendingIntent.getBroadcast(MainActivity.this, 0, alarmIntent, 0);

        // check if the user entered a user ID (defined in preferences.xml)
        // if not, display preference menu and ask for user ID
        SharedPreferences pref = PreferenceManager.getDefaultSharedPreferences(getBaseContext());
        String userID = pref.getString("userID", "NA");
        if(userID.equals("NA")) {
            // start preferences activity; user ID is saved in preferences.java
            Intent i = new Intent(MainActivity.this, Preferences.class);
            startActivity(i);
        }

        // start button
        findViewById(R.id.startAlarm).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                start();
            }
        });

        // stop button (also comment in below and the button layout in main_activity.xml)
        // findViewById(R.id.stopAlarm).setOnClickListener(new View.OnClickListener() {
        //    @Override
        //    public void onClick(View v) {
        //        stop();
        //    }
        //});
    }

    // if user pushes start button, set interval alarm depending on how often browsing history should be retrieved
    // same interval also in DeviceBootReceiver.java
    public void start() {

        AlarmManager manager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
        Globals g = Globals.getInstance();
        int interval=g.getInterval(); // alarm interval in milliseconds; set the interval in Global.java
        manager.setInexactRepeating(AlarmManager.RTC_WAKEUP, System.currentTimeMillis(), interval, pendingIntent);
        Toast.makeText(this, "Browser Hist Collector Started", Toast.LENGTH_SHORT).show();
    }

    // if the user pushes stop button, stop alarm and web history posting
    //public void stop() {

    //    // stop alarm broadcast receiver
    //    AlarmManager manager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
    //    manager.cancel(pendingIntent);
    //    Toast.makeText(this, "Browser Hist Collector Stopped", Toast.LENGTH_SHORT).show();

        // stop web post service
    //    Intent intent = new Intent(getApplicationContext(), WebPostService.class);
    //    stopService(intent);
    //}
}