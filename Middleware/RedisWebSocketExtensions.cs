using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace FarmMonitorServer.Middleware
{
    public static class RedisWebSocketExtensions
    {
        public static void UseRedisWebSocket(this IApplicationBuilder app)
        {
            var webSocketOptions = new WebSocketOptions()
            {
                KeepAliveInterval = TimeSpan.FromSeconds(120),
                ReceiveBufferSize = 4 * 1024
            };

            app.UseWebSockets(webSocketOptions);

            app.Use(async (context, next) =>
            {
                if (context.Request.Path == "/ws")
                {
                    if (context.WebSockets.IsWebSocketRequest)
                    {
                        WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                        Action<RedisChannel, RedisValue> subscriptionHandler = (channel, value) =>
                         {
                             var message = new ArraySegment<byte>(Encoding.Default.GetBytes(value));
                             webSocket.SendAsync(message, WebSocketMessageType.Text, true, CancellationToken.None).Wait();
                         };
                        var redisConnection = context.RequestServices.GetService<ConnectionMultiplexer>();

                        await redisConnection.GetSubscriber().SubscribeAsync("notifications", subscriptionHandler);

                        var buffer = new byte[1024 * 4];
                        WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                        while (!result.CloseStatus.HasValue)
                        {
                            result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                        }

                        await redisConnection.GetSubscriber().UnsubscribeAsync("notifications", subscriptionHandler);
                        await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
                    }
                    else
                    {
                        context.Response.StatusCode = 400;
                    }
                }
                else
                {
                    await next();
                }
            });
        }
    }
}
