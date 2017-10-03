import * as React from 'react';
import { DeviceTrigger } from './devices/DeviceTrigger';
import { Notifications } from './Notifications';
import { FilterButton } from './FilterButton';

interface HomeState {
    state: string;
    devices: Device[];
    filteredDevices: Device[];
    loading: boolean;
}

export class Home extends React.Component<{}, HomeState> {
    constructor() {
        super();
        this.state = { devices: [], filteredDevices: [], state:"All", loading: true };
        this.updateDevice = this.updateDevice.bind(this);
        this.filterBedroom = this.filterBedroom.bind(this);
        this.filterBathroom = this.filterBathroom.bind(this);
        this.filterKitchen = this.filterKitchen.bind(this);
        this.filterLivingRoom = this.filterLivingRoom.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
        
        fetch('/api/devices')
            .then(response => response.json() as Promise<Device[]>)
            .then(data => {
                this.setState({ devices: data, filteredDevices: data, loading: false });
            });
    }

    updateDevice(device: Device) {
        let currentDevices = this.state.devices.map(d => d.id == device.id ? device : d);
        let currentFilteredDevices = this.state.filteredDevices.map(d => d.id == device.id ? device : d);
        this.setState({ devices: currentDevices, filteredDevices: currentFilteredDevices });
    }

     filterBedroom(){  
        this.filter("Bedroom");      
     } 

     filterBathroom(){  
        this.filter("Bathroom");      
     }

     filterKitchen(){  
        this.filter("Kitchen");      
     }

    filterLivingRoom(){  
        this.filter("Living-room");      
     }     

    resetFilter(){
         this.setState({filteredDevices: this.state.devices, state: "All"});
    }

    filter(type){
        var filteredDevices = this.state.devices.filter(d=> d.location === type);
        this.setState({filteredDevices: filteredDevices, state: type});
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : <div className="deviceCollection">
                <div className="filterDevices">
                    <FilterButton type="All" onClick={this.resetFilter} symbol="fa-th-large" state={this.state.state}/>
                    <FilterButton type="Bedroom" onClick={this.filterBedroom} symbol="fa-bed" state={this.state.state}/>
                    <FilterButton type="Bathroom" onClick={this.filterBathroom} symbol="fa-bath" state={this.state.state}/>
                    <FilterButton type="Kitchen" onClick={this.filterKitchen} symbol="fa-cutlery" state={this.state.state}/>
                    <FilterButton type="Living-room" onClick={this.filterLivingRoom} symbol="fa-television" state={this.state.state}/>
                </div>
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
