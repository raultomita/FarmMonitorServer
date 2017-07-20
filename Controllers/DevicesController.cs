﻿using System.Linq;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace FarmMonitorServer.Controllers
{
    [Route("api/[controller]")]
    public class DevicesController : Controller
    {
        private const string HashKey = "devices";
        private readonly IDatabase database;
        private readonly ISubscriber subscriber;

        public DevicesController(ConnectionMultiplexer connection)
        {
            if(connection == null)
            {
                throw new ArgumentNullException(nameof(connection));
            }

            database = connection.GetDatabase();
            subscriber = connection.GetSubscriber();
        }

        [HttpGet]
        public IEnumerable<object> Get()
        {          
            var devices = database.HashGetAll(HashKey);
            return devices.Select(device => Newtonsoft.Json.JsonConvert.DeserializeObject((string)device.Value));
            
        }
                
        [HttpPut("{id}")]
        public void Put(string id, [FromBody]string value)
        {
            subscriber.Publish("commands", id);
        }
    }
}
