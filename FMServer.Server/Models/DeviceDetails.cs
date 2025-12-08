using StackExchange.Redis;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FMServer.Server.Models
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
