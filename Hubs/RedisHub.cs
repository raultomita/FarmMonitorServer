using FarmMonitorServer.Database;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace FarmMonitorServer.Hubs
{
    public class RedisHub : Hub
    {
        private readonly IExternalWorld externalWorld;

        public RedisHub(IExternalWorld externalWorld)
        {
            this.externalWorld = externalWorld;
        }
        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("heartbeats", externalWorld.GetHashFields("heartbeat").Select(h=> new {
                hostName = h.fieldName,
                latestDate = h.value,
                isDead = (DateTime.Now - DateTime.ParseExact(h.value, "dd.MM.yy HH:mm:ss", CultureInfo.InvariantCulture)).Minutes > 10 })
                .ToList());            
            await base.OnConnectedAsync();
        }
    }
}
