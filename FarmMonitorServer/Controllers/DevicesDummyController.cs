using System.Linq;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System;
using System.Collections.Generic;

namespace FarmMonitorServer.Controllers
{
    [Route("api/[controller]")]
    public class DevicesDummyController : Controller
    {
        
        public DevicesDummyController()
        {
        }

        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new[] { "some test1", "some test 2" };
        }
                
        [HttpPut("{id}")]
        public void Put(string id, [FromBody]string value)
        {
            //subscriber.Publish("commands", id);
        }
    }
}
