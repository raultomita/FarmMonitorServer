import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DeviceTrigger, ActiveDevice } from '../components/devices/DeviceTrigger';
import { Notifications } from '../components/Notifications';
import { FilterButton } from '../components/FilterButton';

function Home() {
    const [devices, setDevices] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    // Fetch devices on mount
    useEffect(() => {
        fetch('/api/devices')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Sort devices by location
                const sortedDevices = data.sort((first, second) => {
                    if (first.location > second.location) return 1;
                    if (first.location < second.location) return -1;
                    return 0;
                });
                setDevices(sortedDevices);
                setLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch devices:", error);
                setLoading(false);
            });
    }, []);

    // Update device handler
    const updateDevice = useCallback((device) => {
        setDevices(currentDevices =>
            currentDevices.map(d => d.id === device.id ? device : d)
        );
    }, []);

    // Filter handlers
    const resetFilter = useCallback(() => {
        setActiveFilter("All");
    }, []);

    const filter = useCallback((type) => {
        setActiveFilter(type);
    }, []);

    // Derived state
    const filteredDevices = useMemo(() => {
        if (activeFilter === "All") {
            return devices;
        }
        return devices.filter(d => d.location === activeFilter);
    }, [devices, activeFilter]);

    const activeDevices = useMemo(() => {
        return filteredDevices.filter(d => d.state === "1");
    }, [filteredDevices]);

    if (loading) {
        return <p><em>Loading...</em></p>;
    }

    return (
        <>
            <div className="mainHeader">
                <span className="brand">Home</span>
                <Notifications onDeviceReceived={updateDevice} />
            </div>
            <div className="filterDevices">
                <FilterButton type="All" onClick={resetFilter} symbol="fa-th-large" state={activeFilter} />
                <FilterButton type="Bedroom" onClick={filter} symbol="fa-bed" state={activeFilter} />
                <FilterButton type="Bathroom" onClick={filter} symbol="fa-bath" state={activeFilter} />
                <FilterButton type="Kitchen" onClick={filter} symbol="fa-cutlery" state={activeFilter} />
                <FilterButton type="Living-room" onClick={filter} symbol="fa-television" state={activeFilter} />
                <FilterButton type="Lobby" onClick={filter} symbol="fa-archive" state={activeFilter} />
            </div>
            {activeDevices.length > 0 && (
                <div className="activeDevices">
                    {activeDevices.map(device => (
                        <ActiveDevice key={device.id} {...device} />
                    ))}
                </div>
            )}
            <div className="deviceCollection">
                {filteredDevices.map(device => (
                    <div key={device.id} className="deviceWrapper">
                        <DeviceTrigger {...device} />
                    </div>
                ))}
            </div>
        </>
    );
}

export default Home;
