using System;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace FarmMonitorServer.Database
{
    public class StubExternalWorld : IExternalWorld
    {
        public HashEntry[] GetAllDevices()
        {
            return new HashEntry[]
            {
                new HashEntry("switch1", CreateJson("switch1", "kitchen")),
                new HashEntry("switch2", CreateJson("switch2", "kitchen")),
                new HashEntry("switch3", CreateJson("switch3", "bathroom")),
                new HashEntry("switch4", CreateJson("switch4", "bathroom")),
                new HashEntry("switch5", CreateJson("switch5", "bedroom")),
                new HashEntry("switch6", CreateJson("switch6", "bedroom")),
            };
        }

        public void SendCommand(string id)
        {
            
        }

        public async Task SubscribeAsync(Action<RedisChannel, RedisValue> subscriptionHandler)
        {
            
        }

        public async Task UnsubscribeAsync(Action<RedisChannel, RedisValue> subscriptionHandler)
        {
            
        }

        private string CreateJson(string id, string location)
        {
            return $"{{ \"id\": \"{id}\", \"type\": \"switch\", \"display\":\"{location}{new Random(10).Next()}\", \"location\":\"{location}\", \"timeStamp\": \"{DateTime.Now}\", \"state\": \"0\" }}";
        }
    }
}
