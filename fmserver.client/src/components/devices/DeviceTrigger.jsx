import React, { useState, useEffect } from 'react';

const LOCATION_EMOJI = {
    Bedroom: '🛏',
    Bathroom: '🚿',
    Kitchen: '🍳',
    'Living-room': '📺',
    Lobby: '🚪',
    Garden: '🌱',
};

const useTimeAgo = (timeStamp) => {
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const calc = () => {
            const s = Math.floor((Date.now() - Date.parse(timeStamp)) / 1000);
            if (s < 60) return `${s}s ago`;
            if (s < 3600) return `${Math.floor(s / 60)}m ago`;
            if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
            return `${Math.floor(s / 86400)}d ago`;
        };
        setMsg(calc());
        const id = setInterval(() => setMsg(calc()), 60000);
        return () => clearInterval(id);
    }, [timeStamp]);

    return msg;
};

async function toggle(id, setIsBusy) {
    setIsBusy(true);
    try {
        await fetch(`/api/devices/${id}`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        });
    } catch (e) {
        console.error('Failed to update device', e);
        setIsBusy(false);
    }
}

export function DeviceTrigger({ id, display, location, state, timeStamp, googleType }) {
    const [isBusy, setIsBusy] = useState(false);
    const timeAgo = useTimeAgo(timeStamp);
    const isOn = state === '1';

    useEffect(() => { setIsBusy(false); }, [id, state, timeStamp]);

    return (
        <button
            className={`device-card ${isOn ? 'on' : 'off'} ${location}`}
            onClick={() => toggle(id, setIsBusy)}
            disabled={isBusy}
        >
            <span className="device-card-location">{LOCATION_EMOJI[location] || '📦'}</span>
            <span className="device-card-name">{display}</span>
            <span className="device-card-icon">
                {isBusy
                    ? <i className="fa fa-circle-o-notch fa-spin" />
                    : <i className={`fa fa-power-off ${isOn ? 'on' : ''}`} />
                }
            </span>
            <span className="device-card-time">{timeAgo}</span>
        </button>
    );
}

export function ActiveDevice({ id, display, location, state }) {
    const [isBusy, setIsBusy] = useState(false);

    useEffect(() => { setIsBusy(false); }, [id, state]);

    return (
        <button
            className={`active-device-pill ${location}`}
            onClick={() => toggle(id, setIsBusy)}
            disabled={isBusy}
        >
            <span>{LOCATION_EMOJI[location] || '📦'}</span>
            <span>{display}</span>
            {isBusy && <i className="fa fa-circle-o-notch fa-spin" />}
        </button>
    );
}
