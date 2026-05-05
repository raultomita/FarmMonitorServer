using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FMServer.Server.Models;

namespace FMServer.Server.Database
{
    public interface IExternalWorld
    {
        HashEntry[] GetAllDevices();
        void SendCommand(string id);
        List<string> GetAllKeys();
        RedisType GetType(string key);
        List<string> GetInstanceDeviceIds(string key);
        DeviceField[] GetHashFields(string key);
        void SaveDevice(string instanceId, string deviceId, Dictionary<string, string> fields);
        void DeleteDevice(string instanceId, string deviceId);
    }
}
