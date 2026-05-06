import React, { useState, useEffect } from 'react';

const LOCATION_ICON = {
    Bedroom:      'fa-bed',
    Bathroom:     'fa-bath',
    Kitchen:      'fa-cutlery',
    'Living-room':'fa-television',
    Lobby:        'fa-archive',
    Garden:       'fa-leaf',
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

export function DeviceTrigger({ id, display, location, state, timeStamp }) {
    const [isBusy, setIsBusy] = useState(false);
    const timeAgo = useTimeAgo(timeStamp);
    const isOn = state === '1';

    useEffect(() => { setIsBusy(false); }, [id, state, timeStamp]);

    return (
        <div className={`device-tile ${location}`}>
            <button
                className={`device-btn ${isOn ? 'on' : 'off'} ${location}`}
                onClick={() => toggle(id, setIsBusy)}
                disabled={isBusy}
            >
                <span className="device-btn-emoji"><i className={`fa ${LOCATION_ICON[location] || 'fa-plug'}`} aria-hidden="true" /></span>
                <span className="device-btn-name">{display}</span>
                <span className="device-btn-icon">
                    {isBusy
                        ? <i className="fa fa-circle-o-notch fa-spin" />
                        : <i className="fa fa-power-off" />
                    }
                </span>
            </button>
        </div>
    );
}
