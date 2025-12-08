import React, { useState, useEffect } from 'react';

const LocationIcon = ({ location }) => {
    switch (location) {
        case "Bedroom": return <i className="fa fa-bed" aria-hidden="true"></i>;
        case "Bathroom": return <i className="fa fa-bath" aria-hidden="true"></i>;
        case "Kitchen": return <i className="fa fa-cutlery" aria-hidden="true"></i>;
        case "Living-room": return <i className="fa fa-television" aria-hidden="true"></i>;
        case "Lobby": return <i className="fa fa-archive" aria-hidden="true"></i>;
        default: return <i> </i>;
    }
};

const useTimeAgo = (timeStamp) => {
    const [timeMessage, setTimeMessage] = useState("");

    useEffect(() => {
        const calculateTimeAgo = () => {
            const seconds = Math.floor((Date.now() - Date.parse(timeStamp)) / 1000);
            if (seconds < 60) return seconds + " sec ago";
            if (seconds < 3600) return Math.floor(seconds / 60) + " min ago";
            if (seconds < 86400) return Math.floor(seconds / 3600) + " hour ago";
            return Math.floor(seconds / 86400) + " day ago";
        };

        setTimeMessage(calculateTimeAgo());
        
        const interval = setInterval(() => {
            setTimeMessage(calculateTimeAgo());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [timeStamp]);

    return timeMessage;
};

export function DeviceTrigger(props) {
    const [isBusy, setIsBusy] = useState(false);
    const timeStampMessage = useTimeAgo(props.timeStamp);

    // Reset busy state when props change (simulating componentWillReceiveProps)
    useEffect(() => {
        setIsBusy(false);
    }, [props.id, props.state, props.timeStamp]);

    const changeState = async () => {
        setIsBusy(true);
        try {
            await fetch('/devices/' + props.id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
        } catch (error) {
            console.error("Failed to update device", error);
            setIsBusy(false);
        }
    };

    const actionIcon = isBusy ? 
        <i className="fa fa-circle-o-notch fa-spin fa-lg"></i> : 
        <i className="fa fa-power-off fa-lg"></i>;
    
    let className = props.state === "1" ? "btn btn-success deviceTrigger " : "btn btn-outline-success deviceTrigger ";
    className += props.location;

    return (
        <div className={className} onClick={changeState}>
            <div className="location"><LocationIcon location={props.location} /></div>
            <div className="deviceName">{props.display}</div>
            <div className="content">{actionIcon}</div>
            <div className="timeStamp">{timeStampMessage}</div>
        </div>
    );
}

export function ActiveDevice(props) {
    const [isBusy, setIsBusy] = useState(false);

    // Reset busy state when props change
    useEffect(() => {
        setIsBusy(false);
    }, [props.id, props.state, props.timeStamp]);

    const changeState = async () => {
        setIsBusy(true);
        try {
            await fetch('/devices/' + props.id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
        } catch (error) {
            console.error("Failed to update device", error);
            setIsBusy(false);
        }
    };

    const actionIcon = isBusy ? <i className="fa fa-circle-o-notch fa-spin fa-lg"></i> : "";
    let className = "btn btn-outline-success activeDevice ";
    className += props.location;

    return (
        <span className={className} onClick={changeState}>
            <span className="location"><LocationIcon location={props.location} /></span>
            <span className="deviceName">{props.display}</span>
            <span className="content">{actionIcon}</span>
        </span>
    );
}
