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
                new HashEntry("switch1", CreateJson("switch1", "Kitchen", "0")),
                new HashEntry("switch2", CreateJson("switch2", "Kitchen", "1")),
                new HashEntry("switch3", CreateJson("switch3", "Bathroom", "1")),
                new HashEntry("switch4", CreateJson("switch4", "Bathroom", "0")),
                new HashEntry("switch5", CreateJson("switch5", "Bedroom", "0")),
                new HashEntry("switch6", CreateJson("switch6", "Bedroom", "1")),
                new HashEntry("switch7", CreateJson("switch7", "Living-room", "0")),
                new HashEntry("switch8", CreateJson("switch8", "Living-room", "1")),
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

        private string CreateJson(string id, string location, string state)
        {
            return $"{{ \"id\": \"{id}\", \"type\": \"switch\", \"display\":\"{location}{new Random(2).Next(20)}\", \"location\":\"{location}\", \"timeStamp\": \"{DateTime.Now}\", \"state\": \"{state}\" }}";
        }
    }
}
