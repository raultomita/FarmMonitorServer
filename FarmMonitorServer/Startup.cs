using System;
using System.Collections.Generic;using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using System.IO;
using Microsoft.Extensions.FileProviders;

namespace FarmMonitorServer
{
    public class Startup
    {       
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton(s=> ConnectionMultiplexer.Connect("192.168.1.200"));            
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseWebSockets();
            app.UseMvc();
            app.UseStaticFiles();
            app.UseDefaultFiles(new DefaultFilesOptions()
            {
                DefaultFileNames = new[] { "Index.html"}
            });
        }
    }
}
