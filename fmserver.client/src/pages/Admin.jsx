import React, { useState, useEffect, useCallback } from 'react';
import { Messages } from '../components/admin/Messages';
import { DeviceDetails } from '../components/admin/DeviceDetails';
import { DeviceForm } from '../components/admin/DeviceForm';

function Admin() {
    const [loading, setLoading] = useState(true);
    const [systemOverview, setSystemOverview] = useState(null);
    const [formState, setFormState] = useState(null); // null = closed, { device?, instanceId? } = open

    const loadOverview = useCallback(() => {
        setLoading(true);
        fetch('/api/admin')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
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

    useEffect(() => { loadOverview(); }, [loadOverview]);

    function handleEdit(device) {
        setFormState({ device, instanceId: device.instanceId });
    }

    async function handleDelete(instanceId, deviceId) {
        if (!window.confirm(`Delete device "${deviceId}" from instance "${instanceId}"?`)) return;
        try {
            const res = await fetch(`/api/admin/devices/${instanceId}/${deviceId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(await res.text());
            loadOverview();
        } catch (err) {
            alert(`Delete failed: ${err.message}`);
        }
    }

    if (loading) return <p><em>Loading...</em></p>;
    if (!systemOverview) return <p>Error loading system overview.</p>;

    return (
        <div className="systemOverview">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>System overview</h1>
                <button className="btn btn-primary" onClick={() => setFormState({})}>+ Add Device</button>
            </div>

            <Messages header="System errors" messages={systemOverview.messages} />

            <div>
                {systemOverview.instances.map(instance =>
                    <div key={instance.instanceId} className="instancesDetails">
                        <h2>mapped :: {instance.instanceId}</h2>
                        {instance.devices.map(device =>
                            <DeviceDetails
                                key={device.deviceId}
                                {...device}
                                instanceId={instance.instanceId}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
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

            {formState !== null && (
                <DeviceForm
                    instances={systemOverview.instances}
                    supportedTypes={systemOverview.supportedTypes}
                    supportedLocations={systemOverview.supportedLocations}
                    device={formState.device || null}
                    instanceId={formState.instanceId || null}
                    onSave={() => { setFormState(null); loadOverview(); }}
                    onClose={() => setFormState(null)}
                />
            )}
        </div>
    );
}

export default Admin;
