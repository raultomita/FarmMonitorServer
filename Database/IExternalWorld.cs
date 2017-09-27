using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FarmMonitorServer.Database
{
    public interface IExternalWorld
    {
        Task SubscribeAsync(Action<RedisChannel, RedisValue> subscriptionHandler);
        Task UnsubscribeAsync(Action<RedisChannel, RedisValue> subscriptionHandler);
        HashEntry[] GetAllDevices();
        void SendCommand(string id);
    }
}
