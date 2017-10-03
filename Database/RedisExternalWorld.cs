using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StackExchange.Redis;
using System.Linq;

namespace FarmMonitorServer.Database
{
    public class RedisExternalWorld : IExternalWorld
    {
        private const string StatusHashKey = "devices";
        private const string NotificationsChannel = "notifications";
        private const string CommandsChannel = "commands";

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
            return database.HashGetAll(StatusHashKey);
        }

        public List<string> GetAllKeys()
        {
            var server = connection.GetServer(connection.Configuration);

            var keys = server.Keys(pageSize: 100);

            return keys.Where(key => key != StatusHashKey).Select(key => (string)key).ToList();
        }

        public (string fieldName, string value)[] GetHashFields(string key)
        {
            return database.HashGetAll(key).Select(hf => ((string)hf.Name, (string)hf.Value)).ToArray();
        }

        public List<string> GetInstanceDeviceIds(string key)
        {
            return database.SetScan(key, pageSize: 100).Select(v => (string)v).ToList();
        }

        public RedisType GetType(string key)
        {
            return database.KeyType(key);
        }

        public void SendCommand(string id)
        {
            subscriber.Publish(CommandsChannel, id);
        }

        public async Task SubscribeAsync(Action<RedisChannel, RedisValue> subscriptionHandler)
        {
            await connection.GetSubscriber().SubscribeAsync(NotificationsChannel, subscriptionHandler);
        }

        public async Task UnsubscribeAsync(Action<RedisChannel, RedisValue> subscriptionHandler)
        {
            await connection.GetSubscriber().UnsubscribeAsync(NotificationsChannel, subscriptionHandler);
        }
    }
}
