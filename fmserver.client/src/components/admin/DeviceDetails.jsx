import React from 'react';
import { Messages } from './Messages';

export function DeviceDetails({ deviceId, messages, fields, instanceId, onEdit, onDelete }) {
    return (
        <div className="deviceDetails card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title">{deviceId}</h5>
                    {onEdit && onDelete && (
                        <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => onEdit({ deviceId, fields, instanceId })}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(instanceId, deviceId)}>Delete</button>
                        </div>
                    )}
                </div>
                <Messages header="Errors" messages={messages} />
                {fields && fields.map((field, index) => (
                    <div key={index} className="fieldDetail">
                        <label>{field.item1}</label>
                        <span>{field.item2}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

