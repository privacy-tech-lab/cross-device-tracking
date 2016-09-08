package history.cs.columbia.edu;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceActivity;
import android.preference.PreferenceManager;

// preference class for storing the user ID
public class Preferences extends PreferenceActivity implements SharedPreferences.OnSharedPreferenceChangeListener {

    // save user ID
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        addPreferencesFromResource(R.xml.preferences); // deprecated, but necessary for older APIs
        PreferenceManager.getDefaultSharedPreferences(this).registerOnSharedPreferenceChangeListener(this);
    }

    // upon storing user ID stop preferences activity and return to main activity
    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
        finish();
    }

}