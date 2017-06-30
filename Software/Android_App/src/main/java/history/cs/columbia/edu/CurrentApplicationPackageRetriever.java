/*
 * Software is released under the GPL-3.0 License.
 * Copyright (c) 2016, Sebastian Zimmeck
 * All rights reserved.
 *
 */

package history.cs.columbia.edu;

import android.app.ActivityManager;
import android.content.ComponentName;
import android.content.Context;
import android.os.Build;

import com.jaredrummler.android.processes.ProcessManager;
import com.jaredrummler.android.processes.models.AndroidAppProcess;

import java.lang.reflect.Field;
import java.util.List;

// class for getting the current foreground app
// based on http://stackoverflow.com/questions/3873659/android-how-can-i-get-the-current-foreground-activity-from-a-service
// and using the AndroidProcesses library at https://github.com/jaredrummler/AndroidProcesses
public class CurrentApplicationPackageRetriever {

    private final Context context;

    public CurrentApplicationPackageRetriever(Context context) {
        this.context = context;
    }

    // depending on the Android API different methods have to be used for getting the current app
    public String[] get() {
        if (Build.VERSION.SDK_INT < 21)
            return getPreLollipop();
        else if (Build.VERSION.SDK_INT == 21)
            return getLollipop();
        else
            return getPostLollipop();
    }

    // pre-Lollipop the running tasks can be retrieved
    private String[] getPreLollipop() {
        @SuppressWarnings("deprecation")
        List<ActivityManager.RunningTaskInfo> tasks =
                activityManager().getRunningTasks(1);
        ActivityManager.RunningTaskInfo currentTask = tasks.get(0);
        ComponentName currentActivity = currentTask.topActivity;
        return new String[] { currentActivity.getPackageName() };
    }

    // for Lollipop there is no good way of getting the current foreground app
    // the following might return two or more current apps or no app at all
    private String[] getLollipop() {
        final int PROCESS_STATE_TOP = 2;

        try {
            Field processStateField = ActivityManager.RunningAppProcessInfo.class.getDeclaredField("processState");

            List<ActivityManager.RunningAppProcessInfo> processes =
                    activityManager().getRunningAppProcesses();
            for (ActivityManager.RunningAppProcessInfo process : processes) {
                if (
                    // Filters out most non-activity processes
                        process.importance <= ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND
                                &&
                                // Filters out processes that are just being
                                // _used_ by the process with the activity
                                process.importanceReasonCode == 0
                        ) {
                    int state = processStateField.getInt(process);

                    if (state == PROCESS_STATE_TOP)
                        /*
                         If multiple candidate processes can get here,
                         it's most likely that apps are being switched.
                         The first one provided by the OS seems to be
                         the one being switched to, so we stop here.
                         */
                        return process.pkgList;
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return new String[] { };
    }

    // for post-Lollipop get current foreground app using the AndroidProcesses library
    private String[] getPostLollipop() {
        List<AndroidAppProcess> processes = ProcessManager.getRunningForegroundApps(context);
        String[] curAppHistory = new String[processes.size()];
        for (int i = 0; i < processes.size(); i++) {
            curAppHistory[i] = processes.get(0).name;
        }
        return curAppHistory;
    }

    private ActivityManager activityManager() {
        return (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
    }

}