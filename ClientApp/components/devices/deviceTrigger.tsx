import * as React from 'react';

interface DeviceTriggerProps{
    deviceId: string;
    state: string;
}

interface DeviceTriggerState{
    isBusy: boolean;
}

export class DeviceTrigger extends React.Component<DeviceTriggerProps, DeviceTriggerState> {
    constructor() {
        super();
        this.state = {isBusy: false};
        this.changeState = this.changeState.bind(this);
    }

    public componentWillReceiveProps(nextProps){
        if(nextProps.state != this.props.state){
            this.setState({isBusy: false});
        }
    }

    changeState() {
        this.setState({isBusy: true});
        fetch('/api/devices/' + this.props.deviceId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
    }

    public render() {
       let actionIcon = this.state.isBusy ? <i className="fa fa-circle-o-notch fa-spin fa-lg"></i> : <i className="fa fa-power-off fa-lg"></i>;

       return this.props.state == "1"?             
            <a className="btn btn-success" href="#" onClick={this.changeState}>{actionIcon}  Opened</a> :
            <a className="btn btn-default" href="#" onClick={this.changeState}>{actionIcon}  Closed</a>;

    }
}