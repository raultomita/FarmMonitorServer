import * as React from 'react';
import { DeviceSelector } from './devices/deviceSelector';
import { Notifications } from './Notifications';

interface HomeState {
    devices: Device[];
    loading: boolean;
}

export class Home extends React.Component<{}, HomeState> {
    constructor() {
        super();
        this.state = { devices: [], loading: true };
        this.updateDevice = this.updateDevice.bind(this);
        fetch('/api/devices')
            .then(response => response.json() as Promise<Device[]>)
            .then(data => {
                this.setState({ devices: data, loading: false });
            });
    }

    updateDevice(device: Device) {
        let currentDevices = this.state.devices.map(d => d.id == device.id ? device : d);
        this.setState({ devices: currentDevices });
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : <div className="row">
                {this.state.devices.map(device =>
                    <div className="col-sm-3">                    
                        <DeviceSelector {...device} />
                    </div>
                )}

            </div>;

        return <div>
            <Notifications onDeviceReceived={this.updateDevice} />
            {contents}
        </div>;

    }
}

export interface Device {
    id: string;
    type: string;
    timeStamp: string;
    [typeProp: string]: any;
}
