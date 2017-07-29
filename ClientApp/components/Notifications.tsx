import * as React from 'react';
import { Device } from './Home';

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
            <span className="label label-success">Connected</span> :
            <span className="label label-danger">Disconnected</span>;
        return <div className="notificationHeader"><span>{this.state.status}</span>{content}</div>;
    }

    connect(notificationsWidget) {
        let scheme = document.location.protocol == "https:" ? "wss" : "ws";
        let port = document.location.port ? (":" + document.location.port) : "";
        let connectionUrl = scheme + "://" + document.location.hostname + port + "/ws";

        let socket = new WebSocket(connectionUrl);

        socket.onopen = function (event) {
            notificationsWidget.setState({ isConnected: true, status:"" });
        };

        socket.onclose = function (event) {
            notificationsWidget.setState({
                isConnected: false, status: 'Code: ' + event.code + '. Reason: ' + event.reason });
        };

        socket.onerror = function (event) {
            switch (socket.readyState) {

                case WebSocket.CLOSED:
                    notificationsWidget.setState({
                        isConnected: false, status: 'Closed ...'
                    });

                    break;

                default:

                    event;

                    break;

            }
        };

        socket.onmessage = function (event) {
            let deviceData = JSON.parse(event.data) as Device;
            notificationsWidget.props.onDeviceReceived(deviceData);
        };
    }
}
