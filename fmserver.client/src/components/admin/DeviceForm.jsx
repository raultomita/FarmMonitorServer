import React, { useState, useEffect } from 'react';

const DEVICE_SCHEMAS = {
    switch: [
        { name: 'display', label: 'Display Name', required: true },
        { name: 'location', label: 'Location', required: true, type: 'location' },
        { name: 'gpio', label: 'GPIO Pin', required: true, type: 'number' },
        { name: 'googleType', label: 'Google Home Type', required: true },
        { name: 'autoOff', label: 'Auto-Off (seconds)', required: false, type: 'number' },
    ],
    toggleButton: [
        { name: 'gpio', label: 'GPIO Pin', required: true, type: 'number' },
        { name: 'targetDeviceId', label: 'Target Device ID', required: true },
        { name: 'commands4On', label: 'Extra On Commands (comma-separated)', required: false },
        { name: 'logPressedCommand', label: 'Long-Press Command', required: false },
    ],
    led: [
        { name: 'gpio', label: 'GPIO Pin', required: true, type: 'number' },
        { name: 'listenTo', label: 'Listen To Device ID', required: true },
        { name: 'gpioOff', label: 'GPIO Off Pin', required: false, type: 'number' },
    ],
    automaticTrigger: [
        { name: 'targetDeviceId', label: 'Target Device ID', required: true },
        { name: 'listenOnDeviceId', label: 'Listen On Device ID', required: true },
    ],
    scheduledTrigger: [
        { name: 'targetDeviceId', label: 'Target Device ID', required: true },
        { name: 'cron', label: 'CRON Expression', required: true, placeholder: '0 8 * * 1,2,3,4,5' },
        { name: 'durationSeconds', label: 'Duration (seconds)', required: false, type: 'number' },
    ],
    distanceSensor: [
        { name: 'gpio', label: 'GPIO Pin', required: true, type: 'number' },
        { name: 'targetDeviceId', label: 'Target Device ID', required: true },
        { name: 'invertState', label: 'Invert State', required: true, type: 'select', options: ['0', '1'] },
    ],
    tankLevel: [],
    watering: [],
};

function buildInitialFields(type, existingFields) {
    const schema = DEVICE_SCHEMAS[type] || [];
    const initial = {};
    schema.forEach(f => { initial[f.name] = ''; });
    if (existingFields) {
        existingFields.forEach(f => { initial[f.item1] = f.item2; });
    }
    return initial;
}

export function DeviceForm({ instances, supportedTypes, supportedLocations, device, instanceId, onSave, onClose }) {
    const isEdit = !!device;

    const [deviceId, setDeviceId] = useState(isEdit ? device.deviceId : '');
    const [selectedInstance, setSelectedInstance] = useState(instanceId || (instances.length > 0 ? instances[0].instanceId : ''));
    const [type, setType] = useState(() => {
        if (isEdit && device.fields) {
            const tf = device.fields.find(f => f.item1 === 'type');
            return tf ? tf.item2 : (supportedTypes[0] || '');
        }
        return supportedTypes[0] || '';
    });
    const [fields, setFields] = useState(() =>
        buildInitialFields(
            isEdit && device.fields ? (device.fields.find(f => f.item1 === 'type')?.item2 || supportedTypes[0]) : (supportedTypes[0] || ''),
            isEdit ? device.fields : null
        )
    );
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setFields(buildInitialFields(type, isEdit ? device?.fields : null));
    }, [type]);

    function handleFieldChange(name, value) {
        setFields(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        const allFields = { type, ...fields };
        // Remove empty optional fields
        Object.keys(allFields).forEach(k => { if (allFields[k] === '') delete allFields[k]; });

        const schema = DEVICE_SCHEMAS[type] || [];
        const missing = schema.filter(f => f.required && !allFields[f.name]);
        if (missing.length > 0) {
            setError(`Missing required fields: ${missing.map(f => f.label).join(', ')}`);
            return;
        }

        const body = { instanceId: selectedInstance, deviceId, fields: allFields };
        setSaving(true);

        try {
            const url = isEdit ? `/api/admin/devices/${device.deviceId}` : '/api/admin/devices';
            const method = isEdit ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || res.statusText);
            }
            onSave();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    const schema = DEVICE_SCHEMAS[type] || [];

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-dialog card" onClick={e => e.stopPropagation()}>
                <div className="card-body">
                    <h5 className="card-title">{isEdit ? `Edit ${device.deviceId}` : 'Add Device'}</h5>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-2">
                            <label>Device ID</label>
                            <input
                                className="form-control"
                                value={deviceId}
                                onChange={e => setDeviceId(e.target.value)}
                                disabled={isEdit}
                                required
                            />
                        </div>

                        <div className="form-group mb-2">
                            <label>Instance (host)</label>
                            <select className="form-control" value={selectedInstance} onChange={e => setSelectedInstance(e.target.value)}>
                                {instances.map(inst => (
                                    <option key={inst.instanceId} value={inst.instanceId}>{inst.instanceId}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group mb-2">
                            <label>Type</label>
                            <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
                                {supportedTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        {schema.map(f => (
                            <div key={f.name} className="form-group mb-2">
                                <label>{f.label}{f.required ? ' *' : ''}</label>
                                {f.type === 'select' ? (
                                    <select className="form-control" value={fields[f.name] || ''} onChange={e => handleFieldChange(f.name, e.target.value)}>
                                        <option value="">— select —</option>
                                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                ) : f.type === 'location' ? (
                                    <select className="form-control" value={fields[f.name] || ''} onChange={e => handleFieldChange(f.name, e.target.value)}>
                                        <option value="">— select —</option>
                                        {supportedLocations.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        className="form-control"
                                        type={f.type === 'number' ? 'number' : 'text'}
                                        value={fields[f.name] || ''}
                                        placeholder={f.placeholder || ''}
                                        onChange={e => handleFieldChange(f.name, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}

                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="d-flex gap-2 mt-3">
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
