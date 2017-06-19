package history.cs.columbia.edu;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

// boot receiver for restarting the app after the device was rebooted
public class DeviceBootReceiver extends BroadcastReceiver {

    // set alarm in case of device reboot
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals("android.intent.action.BOOT_COMPLETED")) {

            Intent alarmIntent = new Intent(context, AlarmBroadCastReceiver.class);
            PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, alarmIntent, 0);

            AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            Globals g = Globals.getInstance();
            int interval=g.getInterval(); // alarm interval in milliseconds; set the interval in Global.java
            manager.setInexactRepeating(AlarmManager.RTC_WAKEUP, System.currentTimeMillis(), interval, pendingIntent);
            Toast.makeText(context, "Browser Hist Collector Started", Toast.LENGTH_SHORT).show();
        }
    }
}