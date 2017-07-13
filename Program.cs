using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace FarmMonitorServer
{
    public class Program
    {
        public static ConnectionMultiplexer redis;
        public static void Main(string[] args)
        {
            redis = ConnectionMultiplexer.Connect("localhost");
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
				.UseUrls("http://*:8000")
                .Build();
    }
}
