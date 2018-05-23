import * as React from 'react';

export interface DeviceTriggerProps {
    id: string;
    type: string;
    display: string;
    location: string;
    timeStamp: string;
    state: string;
    [typeProp: string]: any;
}


interface DeviceTriggerState {
    isBusy: boolean;
}

export class DeviceTrigger extends React.Component<DeviceTriggerProps, DeviceTriggerState> {
    constructor() {
        super();
        this.state = { isBusy: false };
        this.changeState = this.changeState.bind(this);
    }

    public componentWillReceiveProps(nextProps) {
        this.setState({ isBusy: false });
    }

    changeState() {
        this.setState({ isBusy: true });
        fetch('/api/devices/' + this.props.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
    }

    public render() {
        let actionIcon = this.state.isBusy ? <i className="fa fa-circle-o-notch fa-spin fa-lg"></i> : <i className="fa fa-power-off fa-lg"></i>;
        let className = this.props.state == "1" ? "btn btn-success deviceTrigger " : "btn btn-outline-success deviceTrigger ";
        className += this.props.location; 

        let locationIcon = this.props.location == "Bedroom" ? <i className="fa fa-bed" aria-hidden="true"></i> :
            this.props.location == "Bathroom" ? <i className="fa fa-bath" aria-hidden="true"></i> :
                this.props.location == "Kitchen" ? <i className="fa fa-cutlery" aria-hidden="true"></i> :
                    this.props.location == "Living-room" ? <i className="fa fa-television" aria-hidden="true"></i> :
                        this.props.location == "Lobby" ? <i className="fa fa-archive" aria-hidden="true"></i> :
            <i> </i>;

        return <div className={className} onClick={this.changeState}>
            <div className="location">{locationIcon}</div>
            <div className="deviceName">{this.props.display}</div>
            <div className="content">{actionIcon}</div>
            <div className="timeStamp">{this.props.timeStamp}</div>
        </div>;           

    }
}

export class ActiveDevice extends React.Component<DeviceTriggerProps, DeviceTriggerState> {
    constructor() {
        super();
        this.state = { isBusy: false };
        this.changeState = this.changeState.bind(this);
    }

    public componentWillReceiveProps(nextProps) {
        this.setState({ isBusy: false });
    }

    changeState() {
        this.setState({ isBusy: true });
        fetch('/api/devices/' + this.props.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
    }

    public render() {
        let actionIcon = this.state.isBusy ? <i className="fa fa-circle-o-notch fa-spin fa-lg"></i> : "";
        let className = "btn btn-outline-success activeDevice ";
        className += this.props.location;

        let locationIcon = this.props.location == "Bedroom" ? <i className="fa fa-bed" aria-hidden="true"></i> :
            this.props.location == "Bathroom" ? <i className="fa fa-bath" aria-hidden="true"></i> :
                this.props.location == "Kitchen" ? <i className="fa fa-cutlery" aria-hidden="true"></i> :
                    this.props.location == "Living-room" ? <i className="fa fa-television" aria-hidden="true"></i> :
                        this.props.location == "Lobby" ? <i className="fa fa-archive" aria-hidden="true"></i> :
                            <i> </i>;

        return <span className={className} onClick={this.changeState}>
            <span className="location">{locationIcon}</span>
            <span className="deviceName">{this.props.display}</span>
            <span className="content">{actionIcon}</span>
        </span>;

    }
}



