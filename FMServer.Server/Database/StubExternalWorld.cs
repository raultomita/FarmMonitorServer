using StackExchange.Redis;
using FMServer.Server.Models;

namespace FMServer.Server.Database
{
    public class StubExternalWorld : IExternalWorld
    {
        public void DeleteKey(string key)
        {
            throw new NotImplementedException();
        }

        public HashEntry[] GetAllDevices()
        {
            return new HashEntry[]
            {
                new HashEntry("switch1", CreateJson("switch1", "Kitchen", "0", "Table")),
                new HashEntry("switch2", CreateJson("switch2", "Kitchen", "1")),
                new HashEntry("switch11", CreateJson("switch11", "Kitchen", "0")),
                new HashEntry("switch21", CreateJson("switch21", "Kitchen", "1")),
                new HashEntry("switch3", CreateJson("switch3", "Bathroom", "1", "FAN")),
                new HashEntry("switch4", CreateJson("switch4", "Bathroom", "0")),
                new HashEntry("switch7", CreateJson("switch7", "Living-room", "0")),
                new HashEntry("switch8", CreateJson("switch8", "Living-room", "1")),
                new HashEntry("switch9", CreateJson("switch9", "Garden", "1", "Terrace")),  
                new HashEntry("switch5", CreateJson("switch5", "Bedroom", "0")),
                new HashEntry("switch6", CreateJson("switch6", "Bedroom", "1")),

            };
        }

        public List<string> GetAllKeys()
        {
            return new List<string>();
        }

        public DeviceField[] GetHashFields(string key)
        {
            return [];
        }

        public List<string> GetInstanceDeviceIds(string key)
        {
            return [];
        }

        public RedisType GetType(string key)
        {
            return RedisType.None;
        }

        public void SendCommand(string id)
        {
            
        }

        public void SaveDevice(string instanceId, string deviceId, Dictionary<string, string> fields)
        {
        }

        public void DeleteDevice(string instanceId, string deviceId)
        {
        }

        public async Task SubscribeAsync(Action<RedisChannel, RedisValue> subscriptionHandler)
        {
            
        }

        public async Task UnsubscribeAsync(Action<RedisChannel, RedisValue> subscriptionHandler)
        {
            
        }

        private string CreateJson(string id, string location, string state, string? name = null)
        {
            string deviceName = name ?? $"{location}{new Random(2).Next(20)}";
            return $"{{ \"id\": \"{id}\", \"type\": \"switch\", \"display\":\"{deviceName}\", \"location\":\"{location}\", \"timeStamp\": \"{DateTime.Now}\", \"state\": \"{state}\" }}";
        }
    }
}
