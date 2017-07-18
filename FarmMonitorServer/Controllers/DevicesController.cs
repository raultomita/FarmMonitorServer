using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace FarmMonitorServer.Controllers
{
    [Route("api/[controller]")]
    public class DevicesController : Controller
    {
        public IEnumerable<string> Get()
        {
            return new[] { "1", "2" };
        }
    }
}
