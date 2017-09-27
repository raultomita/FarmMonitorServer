using System.Linq;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using FarmMonitorServer.Database;

namespace FarmMonitorServer.Controllers
{
    [Route("api/[controller]")]
    public class DevicesController : Controller
    {
        private readonly IExternalWorld externalWorld;

        public DevicesController(IExternalWorld externalWorld)
        {
            this.externalWorld = externalWorld ?? throw new ArgumentNullException(nameof(externalWorld));
        }

        [HttpGet]
        public IActionResult Get()
        {
            var devices = externalWorld.GetAllDevices(); 
            return Content($"[{string.Join(", ", devices.Select(entry => entry.Value))}]", "application/json");
            
        }
                
        [HttpPut("{id}")]
        public void Put(string id, [FromBody]string value)
        {
            externalWorld.SendCommand(id);
        }
    }
}
