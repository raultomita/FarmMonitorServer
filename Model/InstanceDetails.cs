using System.Collections.Generic;

namespace FarmMonitorServer.Model
{
    public class InstanceDetails
    {
        public InstanceDetails(string instanceId, List<DeviceDetails> devices)
        {
            this.InstanceId = instanceId;
            this.Devices = devices;
        }
        public string InstanceId { get; }
        public List<DeviceDetails> Devices { get; }
    }
}
