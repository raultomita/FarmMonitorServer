import * as React from 'react';
import { Messages } from './Messages';
import { DeviceDetails, DeviceDetailsProps } from './DeviceDetails';

interface AdminState {
    loading: boolean;
    systemOverview: SystemOverview;
}

export class Admin extends React.Component<{}, AdminState> {
    constructor() {
        super();
        this.state = { loading: true, systemOverview: null };
        fetch('/api/admin')
            .then(response => response.json() as Promise<SystemOverview>)
            .then(data => {
                this.setState({ systemOverview: data, loading: false });
            });
    }

    public render() {
        return this.state.loading ?
            <p><em>Loading...</em></p> :
            <div className="systemOverview">
                <h1>System overview</h1>
                <Messages header="System errors" messages={this.state.systemOverview.messages} />
                <p>
                    Supported types CS: 
                    {this.state.systemOverview.supportedTypes.map(type =>
                        <span> "{type}" </span>
                    )}
                </p>
                <p>
                    Supported locations CS: 
                    {this.state.systemOverview.supportedLocations.map(location =>
                        <span> "{location}" </span>
                    )}
                </p>

                <div>                    
                    {this.state.systemOverview.instances.map(instance =>
                        <div className="instancesDetails">
                            <h2>mapped :: {instance.instanceId}</h2>
                            {instance.devices.map(device =>
                                <DeviceDetails {...device} />
                            )}
                        </div>
                    )}
                </div>
                <div className="unmapped">
                    <h2>unmapped :: unknown</h2>
                    {this.state.systemOverview.unmapped.map(device =>
                        <DeviceDetails {...device} />
                    )}
                </div>
            </div>;
    }
}


interface InstanceDetails {
    instanceId: string;
    devices: DeviceDetailsProps[];
}

interface SystemOverview {
    supportedTypes: string[];
    supportedLocations: string[];
    messages: string[];
    instances: InstanceDetails[];
    unmapped: DeviceDetailsProps[];
}