import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DeviceTrigger } from '../components/devices/DeviceTrigger';
import { FilterButton } from '../components/FilterButton';

const LOCATION_FILTERS = [
    { type: 'Bedroom',     symbol: 'fa-bed',         label: 'Bedroom' },
    { type: 'Bathroom',    symbol: 'fa-bath',        label: 'Bathroom' },
    { type: 'Kitchen',     symbol: 'fa-cutlery',     label: 'Kitchen' },
    { type: 'Living-room', symbol: 'fa-television',  label: 'Living room' },
    { type: 'Lobby',       symbol: 'fa-archive',     label: 'Lobby' },
    { type: 'Garden',      symbol: 'fa-leaf',        label: 'Garden' },
];

const LOCATION_BG = {
    'Bedroom':     '#d4e3c4',
    'Bathroom':    '#c7dff7',
    'Kitchen':     '#fde4bb',
    'Living-room': '#f9f099',
    'Lobby':       '#ddd8f8',
    'Garden':      '#b8f0cb',
};
const DEFAULT_BG = '#dde3ec';

function Home({ onRegisterDeviceHandler }) {
    const [devices, setDevices] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        onRegisterDeviceHandler?.(updateDevice);
    }, [onRegisterDeviceHandler, updateDevice]);

    const handleFilter = useCallback((type) => {
        if (type === 'All') { setActiveFilter('All'); return; }
        setActiveFilter(cur => cur === type ? 'All' : type);
    }, []);

    const onCount = useMemo(() => devices.filter(d => d.state === '1').length, [devices]);

    const activeLocations = useMemo(() => new Set(devices.map(d => d.location)), [devices]);

    const filteredDevices = useMemo(() => {
        if (activeFilter === 'All') return devices;
        if (activeFilter === 'On') return devices.filter(d => d.state === '1');
        return devices.filter(d => d.location === activeFilter);
    }, [devices, activeFilter]);

    const bgColor = useMemo(() => {
        const last = filteredDevices[filteredDevices.length - 1];
        return last ? (LOCATION_BG[last.location] ?? DEFAULT_BG) : DEFAULT_BG;
    }, [filteredDevices]);

    if (loading) return <div className="home-loading"><em>Loading devices…</em></div>;

    return (
        <div className="home-page" style={{ background: bgColor }}>
            <div className="home-filters">
                <FilterButton type="All" label="All" symbol="fa-th-large" state={activeFilter} onClick={handleFilter} />
                <FilterButton type="On" label="On" state={activeFilter} onClick={handleFilter} count={onCount} />
                {LOCATION_FILTERS.filter(f => activeLocations.has(f.type)).map(f => (
                    <FilterButton key={f.type} type={f.type} label={f.label} symbol={f.symbol}
                        state={activeFilter} onClick={handleFilter} />
                ))}
            </div>

            <div className="home-device-grid">
                {filteredDevices.map(d => <DeviceTrigger key={d.id} {...d} />)}
            </div>
        </div>
    );
}

export default Home;
