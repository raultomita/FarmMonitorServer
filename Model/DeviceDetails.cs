﻿using Newtonsoft.Json;
using StackExchange.Redis;
using System.Collections.Generic;

namespace FarmMonitorServer.Model
{
    public class DeviceDetails
    {
        public DeviceDetails(string deviceId)
        {
            DeviceId = deviceId;
            Messages = new List<string>();
            MappedWith = new List<string>();
        }

        [JsonIgnore]
        public List<string> MappedWith { get; }
        
        public string DeviceId { get; }
        public (string fieldName, string value)[] Fields { get; set; }
        public List<string> Messages { get; }
    }
}
