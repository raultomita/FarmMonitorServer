namespace FMServer.Server.Models
{
    public class SaveDeviceRequest
    {
        public string InstanceId { get; set; } = string.Empty;
        public string DeviceId { get; set; } = string.Empty;
        public Dictionary<string, string> Fields { get; set; } = new();
    }
}
