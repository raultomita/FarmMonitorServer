using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StackExchange.Redis;
using System.Linq;
using FarmMonitorServer.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FarmMonitorServer.Database
{
    public class RedisExternalWorld : IExternalWorld
    {
        private const string StatusHashKey = "devices";
        private const string NotificationsChannel = "notifications";
        private const string heartbeatsChannel = "heartbeats";
        private const string CommandsChannel = "commands";

        private readonly ConnectionMultiplexer connection;
        private readonly IDatabase database;
        private readonly ISubscriber subscriber;
        private readonly IHubContext<RedisHub> hubContext;
        private readonly ILogger<RedisExternalWorld> logger;

        public RedisExternalWorld(IHubContext<RedisHub> hubContext, IConfiguration configuration, ILogger<RedisExternalWorld> logger)
        {
            this.hubContext = hubContext;
            this.logger = logger;
            connection = ConnectionMultiplexer.Connect(configuration["redisHost"]);
            database = connection.GetDatabase();
            subscriber = connection.GetSubscriber();
            subscriber.Subscribe(NotificationsChannel, RedisHandler);
            subscriber.Subscribe(heartbeatsChannel, RedisHandler);
            logger.LogInformation("Connected to redis");
        }

        private void RedisHandler(RedisChannel channel, RedisValue value)
        {
            logger.LogInformation($"Just received {value} from {channel}");
            hubContext.Clients.All.SendAsync(channel, value);
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
