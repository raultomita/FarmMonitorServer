import * as React from 'react';
import { Device } from './Home';
import { HubConnectionBuilder  } from "@aspnet/signalr";


interface NotificationsProps {
    onDeviceReceived: (device: Device) => void; 
}

interface NotificationsState {
    isConnected: boolean;
    status: string;
    watcher: boolean,
    coco: boolean,
    main: boolean,
    jason: boolean,
    thomas: boolean
}

export class Notifications extends React.Component<NotificationsProps, NotificationsState> {
    constructor() {
        super();
        this.state = {
            isConnected: false,
            status: "",
            watcher: false,
            coco: false,
            main: false,
            jason: false,
            thomas: false
        };
        this.connect(this);
    }
    

    public render() {        
        let content = this.state.isConnected ?
            <span className="badge badge-success">Connected</span> :
            <span className="badge badge-danger">Disconnected</span>;

        let watcherState = this.state.watcher ?
            <span className="badge badge-success heartbeat">W</span> :
            <span className="badge badge-danger heartbeat">W</span>;
        let cocoState = this.state.coco ?
            <span className="badge badge-success heartbeat">C</span> :
            <span className="badge badge-danger heartbeat">C</span>
        let jasonState = this.state.jason ?
            <span className="badge badge-success heartbeat">J</span> :
            <span className="badge badge-danger heartbeat">J</span>
        let mainState = this.state.main ?
            <span className="badge badge-success heartbeat">M</span> :
            <span className="badge badge-danger heartbeat">M</span>
        let thomasState = this.state.thomas ?
            <span className="badge badge-success heartbeat">T</span> :
            <span className="badge badge-danger heartbeat">T</span>


        return <div className="notificationHeader">
            <span className="state">{this.state.status}</span>
            {watcherState}
            {cocoState}
            {jasonState}
            {mainState}
            {thomasState}
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

        hubConnection.on("heartbeats", (value: any[]) => {
            console.log(value);
            let newState: any = {}; 
            for (let index = 0; index < value.length; index++) {
                if (value[index].hostName == "watcher" && !value[index].isDead) {
                    newState.watcher = true
                }

                if (value[index].hostName == "coco" && !value[index].isDead) {
                    newState.coco = true
                }

                if (value[index].hostName == "jason" && !value[index].isDead) {
                    newState.jason = true
                }

                if (value[index].hostName == "main" && !value[index].isDead) {
                    newState.main = true
                }

                if (value[index].hostName == "thomas" && !value[index].isDead) {
                    newState.thomas = true
                }
            }

            notificationsWidget.setState(newState);
        })

        hubConnection.onclose(err => notificationsWidget.setState({ isConnected: false, status: "Closed" }));

        hubConnection.start()
            .then(v => notificationsWidget.setState({ isConnected: true, status: "" }))
            .catch(err => notificationsWidget.setState({ isConnected: false, status: err.toString() }));
         
    }
}
