import React, { useState, useEffect, useCallback } from 'react';
import { Messages } from '../components/admin/Messages';
import { DeviceDetails } from '../components/admin/DeviceDetails';
import { DeviceForm } from '../components/admin/DeviceForm';

function Admin() {
    const [loading, setLoading] = useState(true);
    const [systemOverview, setSystemOverview] = useState(null);
    const [formState, setFormState] = useState(null);

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

    if (loading) return (
        <div className="admin-loading">
            <em>Loading…</em>
        </div>
    );

    if (!systemOverview) return <p className="admin-error">Error loading system overview.</p>;

    return (
        <>
            <div className="mainHeader">
                <span className="brand">Admin</span>
                <button className="admin-add-btn" onClick={() => setFormState({})}>+ Add Device</button>
            </div>

            <div className="admin-body">
                <Messages header="System errors" messages={systemOverview.messages} />

                {systemOverview.instances.map(instance => (
                    <section key={instance.instanceId} className="admin-section">
                        <div className="admin-section-header">
                            <span className="admin-section-badge mapped">mapped</span>
                            <h2 className="admin-section-title">{instance.instanceId}</h2>
                        </div>
                        <div className="admin-device-grid">
                            {instance.devices.map(device => (
                                <DeviceDetails
                                    key={device.deviceId}
                                    {...device}
                                    instanceId={instance.instanceId}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </section>
                ))}

                {systemOverview.unmapped.length > 0 && (
                    <section className="admin-section">
                        <div className="admin-section-header">
                            <span className="admin-section-badge unmapped">unmapped</span>
                            <h2 className="admin-section-title">unknown</h2>
                        </div>
                        <div className="admin-device-grid">
                            {systemOverview.unmapped.map(device => (
                                <DeviceDetails key={device.deviceId} {...device} />
                            ))}
                        </div>
                    </section>
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
        </>
    );
}

export default Admin;

