using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FMServer.Server.Database
{
    public interface IExternalWorld
    {
        HashEntry[] GetAllDevices();
        void SendCommand(string id);
        List<string> GetAllKeys();
        RedisType GetType(string key);
        List<string> GetInstanceDeviceIds(string key);
        (string fieldName, string value)[] GetHashFields(string key);
    }
}
