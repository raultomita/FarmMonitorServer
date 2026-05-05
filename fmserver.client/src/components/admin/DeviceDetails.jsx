import React from 'react';
import { Messages } from './Messages';

const TYPE_ICONS = {
    switch: '💡',
    toggleButton: '🔘',
    led: '🔆',
    automaticTrigger: '⚡',
    scheduledTrigger: '🕐',
    distanceSensor: '📡',
    tankLevel: '💧',
    watering: '🌿',
};

export function DeviceDetails({ deviceId, messages, fields, instanceId, onEdit, onDelete }) {
    const typeField = fields?.find(f => f.name === 'type');
    const icon = typeField ? (TYPE_ICONS[typeField.value] || '📦') : '📦';
    const displayField = fields?.find(f => f.name === 'display');
    const locationField = fields?.find(f => f.name === 'location');

    return (
        <div className="admin-device-card">
            <div className="admin-device-card-header">
                <span className="admin-device-icon">{icon}</span>
                <div className="admin-device-title">
                    <strong>{displayField ? displayField.value : deviceId}</strong>
                    {displayField && <small>{deviceId}</small>}
                </div>
                {locationField && <span className="admin-device-location">{locationField.value}</span>}
            </div>

            <Messages header="Errors" messages={messages} />

            {fields && (
                <div className="admin-device-fields">
                    {fields.map((field, index) => (
                        <div key={index} className="admin-field-row">
                            <span className="admin-field-name">{field.name}</span>
                            <span className="admin-field-value">{field.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {onEdit && onDelete && (
                <div className="admin-device-actions">
                    <button className="admin-btn-edit" onClick={() => onEdit({ deviceId, fields, instanceId })}>✏️ Edit</button>
                    <button className="admin-btn-delete" onClick={() => onDelete(instanceId, deviceId)}>🗑 Delete</button>
                </div>
            )}
        </div>
    );
}

