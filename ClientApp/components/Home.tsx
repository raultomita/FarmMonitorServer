import * as React from 'react';
import { DeviceHeader } from './devices/deviceHeader';
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
        this.setState({devices: [device]})
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : <div>
                {this.state.devices.map(device =>                 
                    <DeviceHeader {...device} />
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
