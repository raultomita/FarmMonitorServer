import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DeviceTrigger, ActiveDevice } from '../components/devices/DeviceTrigger';
import { Notifications } from '../components/Notifications';
import { FilterButton } from '../components/FilterButton';

const FILTERS = [
    { type: 'All',         symbol: 'fa-th-large',   label: 'All' },
    { type: 'Bedroom',     symbol: 'fa-bed',         label: 'Bedroom' },
    { type: 'Bathroom',    symbol: 'fa-bath',        label: 'Bathroom' },
    { type: 'Kitchen',     symbol: 'fa-cutlery',     label: 'Kitchen' },
    { type: 'Living-room', symbol: 'fa-television',  label: 'Living room' },
    { type: 'Lobby',       symbol: 'fa-archive',     label: 'Lobby' },
    { type: 'Garden',      symbol: 'fa-leaf',        label: 'Garden' },
];

function Home() {
    const [devices, setDevices] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [connStatus, setConnStatus] = useState({ isConnected: false, status: '', heartbeats: [] });

    useEffect(() => {
        fetch('/api/devices')
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(data => {
                setDevices(data.sort((a, b) => a.location > b.location ? 1 : a.location < b.location ? -1 : 0));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const updateDevice = useCallback((device) => {
        setDevices(cur => cur.map(d => d.id === device.id ? device : d));
    }, []);

    const filteredDevices = useMemo(() =>
        activeFilter === 'All' ? devices : devices.filter(d => d.location === activeFilter),
        [devices, activeFilter]
    );

    const activeDevices = useMemo(() => filteredDevices.filter(d => d.state === '1'), [filteredDevices]);

    const groupedDevices = useMemo(() => {
        const groups = {};
        filteredDevices.forEach(d => {
            if (!groups[d.location]) groups[d.location] = [];
            groups[d.location].push(d);
        });
        return groups;
    }, [filteredDevices]);

    if (loading) return <div className="home-loading"><em>Loading devices…</em></div>;

    return (
        <div className="home-page">
            <Notifications onDeviceReceived={updateDevice} onStatusChange={setConnStatus} />

            <div className="home-filters">
                {FILTERS.map(f => (
                    <FilterButton key={f.type} type={f.type} label={f.label} symbol={f.symbol}
                        state={activeFilter} onClick={setActiveFilter} />
                ))}
                <div className="filter-status">
                    {connStatus.heartbeats.map(hb => (
                        <span key={hb.hostName} className={`hb-dot ${hb.isDead ? 'dead' : 'alive'}`}
                              title={hb.hostName}>
                            <span className="hb-dot-circle" />
                            <span className="hb-dot-label">{hb.hostName.slice(0, 4)}</span>
                        </span>
                    ))}
                    <span className={`conn-dot ${connStatus.isConnected ? 'ok' : 'err'}`}
                          title={connStatus.isConnected ? 'Connected' : (connStatus.status || 'Disconnected')}>
                        <span className="conn-dot-circle" />
                        <span className="conn-dot-label">{connStatus.isConnected ? 'live' : (connStatus.status || 'off').slice(0,4).toLowerCase()}</span>
                    </span>
                </div>
            </div>

            {activeDevices.length > 0 && (
                <div className="home-active-strip">
                    <span className="home-active-label">On now</span>
                    {activeDevices.map(d => <ActiveDevice key={d.id} {...d} />)}
                </div>
            )}

            <div className="home-device-groups">
                {Object.entries(groupedDevices).map(([location, devs]) => (
                    <div key={location} className="home-location-group">
                        {activeFilter === 'All' && <h3 className="home-location-header">{location}</h3>}
                        <div className="home-device-grid">
                            {devs.map(d => (
                                <DeviceTrigger key={d.id} {...d} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
