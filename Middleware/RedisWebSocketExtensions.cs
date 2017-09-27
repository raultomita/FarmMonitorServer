using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using FarmMonitorServer.Database;
using StackExchange.Redis;

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
                        Action<RedisChannel, RedisValue> subscriptionHandler = (channel, message) =>
                         {
                             var messageByteArray = new ArraySegment<byte>(Encoding.Default.GetBytes(message));
                             webSocket.SendAsync(messageByteArray, WebSocketMessageType.Text, true, CancellationToken.None).Wait();
                         };
                        var externalWorld = context.RequestServices.GetService<IExternalWorld>();

                        await externalWorld.SubscribeAsync(subscriptionHandler);                       

                        var buffer = new byte[1024 * 4];
                        WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                        while (!result.CloseStatus.HasValue)
                        {
                            result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                        }

                        await externalWorld.UnsubscribeAsync(subscriptionHandler);
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
