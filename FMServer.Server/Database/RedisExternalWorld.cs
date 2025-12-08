using StackExchange.Redis;
using Microsoft.AspNetCore.SignalR;
using FMServer.Server.Hubs;

namespace FMServer.Server.Database
{
    public class RedisExternalWorld : IExternalWorld
    {
        private const string StatusHashKey = "devices";
        private static readonly RedisChannel NotificationsChannel = RedisChannel.Literal("notifications");
        private static readonly RedisChannel HeartbeatsChannel = RedisChannel.Literal("heartbeats");
        private static readonly RedisChannel CommandsChannel = RedisChannel.Literal("commands");

        private readonly ConnectionMultiplexer connection;
        private readonly IDatabase database;
        private readonly ISubscriber subscriber;
        private readonly IHubContext<RedisHub> hubContext;
        private readonly ILogger<RedisExternalWorld> logger;

        public RedisExternalWorld(IHubContext<RedisHub> hubContext, IConfiguration configuration, ILogger<RedisExternalWorld> logger)
        {
            this.hubContext = hubContext;
            this.logger = logger;
            ConfigurationOptions options = new ConfigurationOptions();
            options.KeepAlive = 30;
            var hostName = configuration["redisHost"];
            if (string.IsNullOrEmpty(hostName)) {
                hostName = "127.0.0.1";
            }
            connection = ConnectionMultiplexer.Connect(hostName);
            database = connection.GetDatabase();
            subscriber = connection.GetSubscriber();
            subscriber.Subscribe(NotificationsChannel, RedisHandler);
            subscriber.Subscribe(HeartbeatsChannel, RedisHandler);
            logger.LogInformation("Connected to redis");            
            connection.ConnectionFailed += Connection_ConnectionFailed;
            connection.ConnectionRestored += Connection_ConnectionRestored;
            connection.InternalError += Connection_InternalError;
            connection.ErrorMessage += Connection_ErrorMessage;
        }

        private void Connection_ErrorMessage(object? sender, RedisErrorEventArgs e)
        {
            logger.LogError(e.Message);
        }

        private void Connection_InternalError(object? sender, InternalErrorEventArgs e)
        {
            logger.LogError(e.Exception?.Message);
        }

        private void Connection_ConnectionRestored(object? sender, ConnectionFailedEventArgs e)
        {
            logger.LogInformation("Connection restored");
        }

        private void Connection_ConnectionFailed(object? sender, ConnectionFailedEventArgs e)
        {
            logger.LogWarning($"Connection Failed {e.FailureType} with exception {e.Exception?.Message}");
        }

        private void RedisHandler(RedisChannel channel, RedisValue value)
        {
            logger.LogInformation($"Just received {value} from {channel}");
            hubContext.Clients.All.SendAsync(channel.ToString(), value);
        }

        public HashEntry[] GetAllDevices()
        {
            return database.HashGetAll(StatusHashKey);
        }

        public List<string> GetAllKeys()
        {
            var server = connection.GetServer(connection.GetEndPoints().First());

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
