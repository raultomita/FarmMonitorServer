import * as React from 'react';
import { DeviceTrigger, ActiveDevice } from './devices/DeviceTrigger';
import { Notifications } from './Notifications';
import { FilterButton } from './FilterButton';

interface HomeState {
    activeFilter: string;
    devices: Device[];
    filteredDevices: Device[];
    activeDevices: Device[];
    loading: boolean;
}

export class Home extends React.Component<{}, HomeState> {
    constructor() {
        super();
        this.state = { devices: [], filteredDevices: [], activeDevices: [], activeFilter: "All", loading: true };
        this.updateDevice = this.updateDevice.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
        this.filter = this.filter.bind(this);

        fetch('/api/devices')
            .then(response => response.json() as Promise<Device[]>)
            .then(data => {
                let sortedDevices = data.sort(this.sortDevices);
                this.setState({
                    devices: sortedDevices,
                    filteredDevices: sortedDevices,
                    activeDevices: sortedDevices.filter(d => d.state === "1"),
                    loading: false
                });
            });
    }

    sortDevices(first: Device, second: Device) {
        if (first.location > second.location) {
            return 1;
        }

        else if (first.location > second.location) {
            return -1;
        }
        else {
            return 0;
        }
    }

    updateDevice(device: Device) {
        let currentDevices = this.state.devices.map(d => d.id == device.id ? device : d);
        let currentFilteredDevices = this.state.filteredDevices.map(d => d.id == device.id ? device : d);
        this.setState({ devices: currentDevices, filteredDevices: currentFilteredDevices, activeDevices: currentFilteredDevices.filter(d => d.state === "1"), });
    }

    resetFilter() {
        this.setState({ filteredDevices: this.state.devices, activeDevices: this.state.devices.filter(d => d.state === "1"), activeFilter: "All" });
    }

    filter(type) {
        var filteredDevices = this.state.devices.filter(d => d.location === type);
        this.setState({ filteredDevices: filteredDevices, activeDevices: filteredDevices.filter(d => d.state === "1"), activeFilter: type });
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : <div className="deviceCollection">
                <div className="filterDevices">
                    <FilterButton type="All" onClick={this.resetFilter} symbol="fa-th-large" state={this.state.activeFilter} />
                    <FilterButton type="Bedroom" onClick={this.filter} symbol="fa-bed" state={this.state.activeFilter} />
                    <FilterButton type="Bathroom" onClick={this.filter} symbol="fa-bath" state={this.state.activeFilter} />
                    <FilterButton type="Kitchen" onClick={this.filter} symbol="fa-cutlery" state={this.state.activeFilter} />
                    <FilterButton type="Living-room" onClick={this.filter} symbol="fa-television" state={this.state.activeFilter} />
                    <FilterButton type="Lobby" onClick={this.filter} symbol="fa-archive" state={this.state.activeFilter} />
                </div>

                {this.state.activeDevices.length > 0 ?
                    <div className="activeDevices">
                        {this.state.activeDevices.map(device =>
                            <ActiveDevice {...device} />
                        )}
                    </div> :
                    ""}

                {this.state.filteredDevices.map(device =>
                    <div key={device.id} className="deviceWrapper">
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
