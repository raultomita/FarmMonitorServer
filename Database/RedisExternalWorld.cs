using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace FarmMonitorServer.Database
{
    public class RedisExternalWorld : IExternalWorld
    {
        private const string HashKey = "devices";
        private const string NotificationsChannel = "notifications";

        private readonly ConnectionMultiplexer connection;
        private readonly IDatabase database;
        private readonly ISubscriber subscriber;


        public RedisExternalWorld()
        {
            connection = ConnectionMultiplexer.Connect("192.168.1.200");
            database = connection.GetDatabase();
            subscriber = connection.GetSubscriber();
        }

        public HashEntry[] GetAllDevices()
        {
            return database.HashGetAll(HashKey);
        }

        public void SendCommand(string id)
        {
            subscriber.Publish("commands", id);
        }

        public async Task SubscribeAsync(Action<RedisChannel, RedisValue> subscriptionHandler)
        {
            await connection.GetSubscriber().SubscribeAsync("notifications", subscriptionHandler);
        }

        public async Task UnsubscribeAsync(Action<RedisChannel, RedisValue> subscriptionHandler)
        {
            await connection.GetSubscriber().UnsubscribeAsync("notifications", subscriptionHandler);
        }
    }
}
