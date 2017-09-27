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
                new HashEntry("switch1", CreateJson("switch1", "Kitchen")),
                new HashEntry("switch2", CreateJson("switch2", "Kitchen")),
                new HashEntry("switch3", CreateJson("switch3", "Bathroom")),
                new HashEntry("switch4", CreateJson("switch4", "Bathroom")),
                new HashEntry("switch5", CreateJson("switch5", "Bedroom")),
                new HashEntry("switch6", CreateJson("switch6", "Bedroom")),
                new HashEntry("switch7", CreateJson("switch7", "Living-room")),
                new HashEntry("switch8", CreateJson("switch8", "Living-room")),
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
            return $"{{ \"id\": \"{id}\", \"type\": \"switch\", \"display\":\"{location}{new Random(2).Next(20)}\", \"location\":\"{location}\", \"timeStamp\": \"{DateTime.Now}\", \"state\": \"0\" }}";
        }
    }
}
