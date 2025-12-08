import React from 'react';
import { Messages } from './Messages';

export function DeviceDetails({ deviceId, messages, fields }) {
    return (
        <div className="deviceDetails card">
            <div className="card-body">
                <h5 className="card-title">{deviceId}</h5>
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
