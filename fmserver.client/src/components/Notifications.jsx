import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from "@microsoft/signalr";

export function Notifications({ onDeviceReceived }) {
    const [connectionState, setConnectionState] = useState({
        isConnected: false,
        status: "",
        heartbeats: []
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
                if (Array.isArray(value)) {
                    // Sort by hostname to ensure consistent order
                    const sortedHeartbeats = [...value].sort((a, b) => a.hostName.localeCompare(b.hostName));
                    setConnectionState(prevState => ({
                        ...prevState,
                        heartbeats: sortedHeartbeats
                    }));
                }
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

    const renderHeartbeat = (isActive, label, key) => (
        <span key={key} className={`badge ${isActive ? 'bg-success' : 'bg-danger'} heartbeat`}>
            {label}
        </span>
    );

    const connectionBadgeText = connectionState.isConnected 
        ? "Connected" 
        : (connectionState.status || "Disconnected");
        
    const connectionBadgeClass = connectionState.isConnected 
        ? "badge bg-success" 
        : "badge bg-danger";

    return (
        <div className="notificationHeader">
            {connectionState.heartbeats.map(hb => 
                renderHeartbeat(!hb.isDead, hb.hostName.charAt(0).toUpperCase(), hb.hostName)
            )}
            <span className={connectionBadgeClass}>{connectionBadgeText}</span>
        </div>
    );
}
