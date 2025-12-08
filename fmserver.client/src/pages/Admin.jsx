import React, { useState, useEffect } from 'react';
import { Messages } from '../components/admin/Messages';
import { DeviceDetails } from '../components/admin/DeviceDetails';

function Admin() {
    const [loading, setLoading] = useState(true);
    const [systemOverview, setSystemOverview] = useState(null);

    useEffect(() => {
        fetch('/api/admin')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setSystemOverview(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch admin data:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p><em>Loading...</em></p>;
    }

    if (!systemOverview) {
        return <p>Error loading system overview.</p>;
    }

    return (
        <div className="systemOverview">
            <h1>System overview</h1>
            <Messages header="System errors" messages={systemOverview.messages} />
            <p>
                Supported types CS: 
                {systemOverview.supportedTypes.map((type, index) =>
                    <span key={index}> "{type}" </span>
                )}
            </p>
            <p>
                Supported locations CS: 
                {systemOverview.supportedLocations.map((location, index) =>
                    <span key={index}> "{location}" </span>
                )}
            </p>

            <div>                    
                {systemOverview.instances.map(instance =>
                    <div key={instance.instanceId} className="instancesDetails">
                        <h2>mapped :: {instance.instanceId}</h2>
                        {instance.devices.map(device =>
                            <DeviceDetails key={device.deviceId} {...device} />
                        )}
                    </div>
                )}
            </div>
            <div className="unmapped">
                <h2>unmapped :: unknown</h2>
                {systemOverview.unmapped.map(device =>
                    <DeviceDetails key={device.deviceId} {...device} />
                )}
            </div>
        </div>
    );
}

export default Admin;
