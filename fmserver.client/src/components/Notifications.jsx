import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from "@microsoft/signalr";

export function Notifications({ onDeviceReceived }) {
    const [connectionState, setConnectionState] = useState({
        isConnected: false,
        status: "",
        watcher: false,
        coco: false,
        main: false,
        jason: false,
        thomas: false
    });

    useEffect(() => {
        const connect = async () => {
            const hubConnection = new HubConnectionBuilder()
                .withUrl("/hub")
                .withAutomaticReconnect()
                .build();

            hubConnection.on("notifications", (value) => {
                try {
                    const deviceData = JSON.parse(value);
                    onDeviceReceived(deviceData);
                } catch (e) {
                    console.error("Error parsing notification", e);
                }
            });

            hubConnection.on("heartbeats", (value) => {
                console.log(value);
                const newHeartbeatState = {
                    watcher: false,
                    coco: false,
                    main: false,
                    jason: false,
                    thomas: false
                };

                if (Array.isArray(value)) {
                    value.forEach(item => {
                        if (item.hostName === "watcher" && !item.isDead) newHeartbeatState.watcher = true;
                        if (item.hostName === "coco" && !item.isDead) newHeartbeatState.coco = true;
                        if (item.hostName === "jason" && !item.isDead) newHeartbeatState.jason = true;
                        if (item.hostName === "main" && !item.isDead) newHeartbeatState.main = true;
                        if (item.hostName === "thomas" && !item.isDead) newHeartbeatState.thomas = true;
                    });
                }

                setConnectionState(prevState => ({
                    ...prevState,
                    ...newHeartbeatState
                }));
            });

            hubConnection.onreconnecting(error => {
                setConnectionState(prevState => ({ ...prevState, isConnected: false, status: "Reconnecting..." }));
            });

            hubConnection.onreconnected(connectionId => {
                setConnectionState(prevState => ({ ...prevState, isConnected: true, status: "" }));
            });

            hubConnection.onclose(err => {
                setConnectionState(prevState => ({ ...prevState, isConnected: false, status: "Closed" }));
            });

            try {
                await hubConnection.start();
                setConnectionState(prevState => ({ ...prevState, isConnected: true, status: "" }));
            } catch (err) {
                setConnectionState(prevState => ({ ...prevState, isConnected: false, status: err.toString() }));
            }

            return () => {
                hubConnection.stop();
            };
        };

        connect();
    }, [onDeviceReceived]);

    const renderHeartbeat = (isActive, label) => (
        <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'} heartbeat`}>
            {label}
        </span>
    );

    const content = connectionState.isConnected ?
        <span className="badge badge-success">Connected</span> :
        <span className="badge badge-danger">Disconnected</span>;

    return (
        <div className="notificationHeader">
            <span className="state">{connectionState.status}</span>
            {renderHeartbeat(connectionState.watcher, "W")}
            {renderHeartbeat(connectionState.coco, "C")}
            {renderHeartbeat(connectionState.jason, "J")}
            {renderHeartbeat(connectionState.main, "M")}
            {renderHeartbeat(connectionState.thomas, "T")}
            {content}
        </div>
    );
}
