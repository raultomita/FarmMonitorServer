import * as React from 'react';
import { DeviceTrigger } from './devices/DeviceTrigger';
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
            : <div className="deviceCollection">
                <div className="filterDevices">
                    <button className="btn btn-default"><i className="fa fa-th-large" aria-hidden="true"></i></button>
                    <button className="btn btn-default Bedroom"><i className="fa fa-bed" aria-hidden="true"></i></button>
                    <button className="btn btn-default Bathroom"><i className="fa fa-bath" aria-hidden="true"></i> </button>
                    <button className="btn btn-default Kitchen"><i className="fa fa-cutlery" aria-hidden="true"></i> </button>
                    <button className="btn btn-default Living-room"><i className="fa fa-television" aria-hidden="true"></i> </button>
                </div>
                {this.state.devices.map(device =>
                    <div className="deviceWrapper">
                        <DeviceTrigger {...device} />
                    </div>
                )}

            </div>;

        return <div>
            <div className="mainHeader row">
                <span className="brand">Home</span>  <Notifications onDeviceReceived={this.updateDevice} />
            </div>
            {contents}
        </div>;

    }
}

export interface Device {
    id: string;
    type: string;
    timeStamp: string;
    display: string;
    location: string;
    state: string;
    [typeProp: string]: any;
}
