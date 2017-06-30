/*
 * Software is released under the GPL-3.0 License.
 * Copyright (c) 2016, Sebastian Zimmeck
 * All rights reserved.
 *
 */

package history.cs.columbia.edu;

// class for storing variables that have global program scope
// based on https://androidresearch.wordpress.com/2012/03/22/defining-global-variables-in-android/
public class Globals{
    private static Globals instance;

    // global variables
    private String prevProcess; // previous foreground process
    private int interval = 60000; // alarm interval in milliseconds

    // restrict the constructor from being instantiated
    private Globals(){}

    public void setPrevProcess(String process){
        this.prevProcess = process;
    }
    public String getPrevProcess(){
        return this.prevProcess;
    }
    public int getInterval(){
        return this.interval;
    }

    public static synchronized Globals getInstance(){
        if(instance == null){
            instance = new Globals();
        }
        return instance;
    }
}