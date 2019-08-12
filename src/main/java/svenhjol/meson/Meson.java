package svenhjol.meson;

import org.apache.logging.log4j.LogManager;

public class Meson
{
    public static final String MOD_ID = "Meson";

    public static void log(Object... out)
    {
        for (Object obj : out) {
            LogManager.getLogger(MOD_ID).info(obj);
        }
    }
}
