import * as React from 'react';
import { DeviceProps } from './deviceProps';
import { Watering } from './watering';
import { TankLevel } from './tankLevel';

export class DeviceSelector extends React.Component<DeviceProps, {}> {
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