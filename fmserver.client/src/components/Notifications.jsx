import { useEffect } from 'react';
import { HubConnectionBuilder } from "@microsoft/signalr";

export function Notifications({ onDeviceReceived, onStatusChange }) {
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
                    const sorted = [...value].sort((a, b) => a.hostName.localeCompare(b.hostName));
                    onStatusChange?.(prev => ({ ...prev, heartbeats: sorted }));
                }
            });

            hubConnection.onreconnecting(() => {
                onStatusChange?.(prev => ({ ...prev, isConnected: false, status: "Reconnecting" }));
            });

            hubConnection.onreconnected(() => {
                onStatusChange?.(prev => ({ ...prev, isConnected: true, status: "" }));
            });

            hubConnection.onclose(() => {
                onStatusChange?.(prev => ({ ...prev, isConnected: false, status: "Closed" }));
            });

            try {
                await hubConnection.start();
                onStatusChange?.(prev => ({ ...prev, isConnected: true, status: "" }));
            } catch (err) {
                onStatusChange?.(prev => ({ ...prev, isConnected: false, status: "Error" }));
            }

            return () => hubConnection.stop();
        };

        connect();
    }, [onDeviceReceived, onStatusChange]);

    return null;
}
