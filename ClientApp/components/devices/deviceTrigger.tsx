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
        let className = this.props.state == "1" ? "btn btn-success deviceTrigger " : "btn btn-default deviceTrigger ";
        className += this.props.location 

        return <div className={className} onClick={this.changeState}>
            <div className="location">{this.props.location}</div>
            <div className="content">{actionIcon}  {this.props.display}</div>
            <div className="timeStamp">{this.props.timeStamp}</div>
        </div>;           

    }
}