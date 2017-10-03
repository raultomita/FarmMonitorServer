import * as React from 'react';
import { Messages } from './Messages';

export interface FieldDetail {
    item1: string;
    item2: string;
}
export interface DeviceDetailsProps {
    deviceId: string;
    messages: string[];
    fields: FieldDetail[];
}


export class DeviceDetails extends React.Component<DeviceDetailsProps, {}> {
    constructor() {
        super();
    }

    public render() {
        return <div key={this.props.deviceId} className="deviceDetails card">
            <div className="card-body">
                <h5>{this.props.deviceId}</h5>
                <Messages header="Errors" messages={this.props.messages} />
                {this.props.fields.map(field =>
                    <div className="fieldDetail">
                        <label >{field.item1}</label>
                        <span >{field.item2}</span>
                    </div>
                )}
            </div>
        </div>;
    }
}