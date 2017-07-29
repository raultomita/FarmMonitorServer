import * as React from 'react';


interface DeviceHeaderProps {
    id: string;
    type: string;
    timeStamp: string;    
    [typeProp: string]: any;
}

export class DeviceHeader extends React.Component<DeviceHeaderProps, {}> {
    constructor() {
        super();
    }
    public render() {
        let deviceContent = this.props.type == "tankLevel" ?
            <TankLevel {...this.props} /> :
            <Watering {...this.props}/>;
        return <div className="panel panel-default">
            <div className="panel-heading">{this.props.id}</div>
            <div className="panel-body">
                {this.props.timeStamp}
                {deviceContent}
            </div>
        </div>;

    }
}

class TankLevel extends React.Component<DeviceHeaderProps, {}> {
    constructor() {
        super();
    }
    public render() {
        return <div>
            <div>{this.props["level"]}</div>
            <div>{this.props["inputState"]}</div>
        </div>;

    }
}

class Watering extends React.Component<DeviceHeaderProps, {}> {
    constructor() {
        super();
    }
    public render() {
        return <div>
            <div>{this.props["state"]}</div>
        </div>;

    }
}