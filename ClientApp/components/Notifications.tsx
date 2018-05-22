import * as React from 'react';
import { Device } from './Home';
import { HubConnectionBuilder  } from "@aspnet/signalr";


interface NotificationsProps {
    onDeviceReceived: (device: Device) => void; 
}

interface NotificationsState {
    isConnected: boolean;
    status: string;
}

export class Notifications extends React.Component<NotificationsProps, NotificationsState> {
    constructor() {
        super();
        this.state = {
            isConnected: false,
            status: ""
        };
        this.connect(this);
    }
    

    public render() {        
        let content = this.state.isConnected ?
            <span className="badge badge-success">Connected</span> :
            <span className="badge badge-danger">Disconnected</span>;
        return <div className="notificationHeader">
            <span className="state">{this.state.status}</span>
            <span className="badge badge-success heartbeat">W</span>
            <span className="badge badge-success heartbeat">M</span>
            <span className="badge badge-success heartbeat">J</span>
            <span className="badge badge-success heartbeat">C</span>
            <span className="badge badge-success heartbeat">T</span>
            {content}</div>;
    }

    connect(notificationsWidget) {
        let port = document.location.port ? (":" + document.location.port) : "";
        let connectionUrl = document.location.protocol + "://" + document.location.hostname + port + "/hub";

        let hubConnection = new HubConnectionBuilder().withUrl("/hub").build();

        hubConnection.on("notifications", (value: string) => {
            let deviceData = JSON.parse(value) as Device;
            notificationsWidget.props.onDeviceReceived(deviceData);
        });
        hubConnection.on("heartbeats", (value: string) => {
            console.log(value);
        })

        hubConnection.onclose(err => notificationsWidget.setState({ isConnected: false, status: "Closed" }));

        hubConnection.start()
            .then(v => notificationsWidget.setState({ isConnected: true, status: "" }))
            .catch(err => notificationsWidget.setState({ isConnected: false, status: err.toString() }));
         
    }
}
