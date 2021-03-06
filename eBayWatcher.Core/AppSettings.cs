﻿using System;

namespace eBayWatcher.Core
{
    public class AppSettings
    {
        private static NLog.Logger log = NLog.LogManager.GetCurrentClassLogger();

        public static string Get(string settingName)
        {
            // Check the environment variables first
            var envSettingName = ("EbayWatcher_" + settingName).ToUpper();
            var fromEnv = Environment.GetEnvironmentVariable(envSettingName);
            if (fromEnv != null)
                return fromEnv;
            else
                throw new Exception($"Environment variable not set, needed for application to run: {envSettingName}");
        }
    }
}